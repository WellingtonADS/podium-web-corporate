"""
Testes de Integração: API de Usuários e Telemetria

Testes automatizados para validar comportamento com múltiplos motoristas.
"""

import pytest
from typing import Any, Callable, cast
from pytest import approx as _approx  # type: ignore[reportUnknownVariableType]
from fastapi.testclient import TestClient
from sqlmodel import Session, delete
from app.main import app
from app.models.domain import User, DriverProfile
from app.core.security import get_password_hash

# Alias tipado para evitar aviso de tipo desconhecido do Pylance
approx: Callable[..., Any] = cast(Callable[..., Any], _approx)

# Fixtures para testes
@pytest.fixture
def setup_drivers(db_session: Session, client: TestClient) -> list[User]:
    """Cria 2 motoristas para teste"""
    # Limpar dados anteriores (perfis e usuários com role=driver)
    db_session.exec(delete(DriverProfile))
    db_session.exec(delete(User).where(User.role == User.Role.driver))  # type: ignore[reportArgumentType]
    db_session.commit()

    drivers: list[User] = []
    for i in range(1, 3):
        user = User(
            email=f"test_driver{i}@test.com",
            full_name=f"Test Driver {i}",
            hashed_password=get_password_hash("test123"),
            role=User.Role.driver,
            is_active=True
        )
        db_session.add(user)
        db_session.commit()
        db_session.refresh(user)

        assert user.id is not None
        profile = DriverProfile(
            user_id=user.id,
            vehicle_model=f"Car Model {i}",
            vehicle_plate=f"TST{i}234",
            cnh_number=f"1234567890{i}",
            rating=5.0
        )
        db_session.add(profile)
        db_session.commit()

        drivers.append(user)

    return drivers

def test_multiple_drivers_location_update(setup_drivers: list[User], client: TestClient):
    """
    Testa se múltiplos motoristas podem atualizar localização
    sem interferir uns nos outros
    """
    # Login motorista 1
    response1 = client.post(
        "/api/v1/login",
        data={"username": "test_driver1@test.com", "password": "test123"}
    )
    assert response1.status_code == 200
    token1 = response1.json()["access_token"]
    
    # Login motorista 2
    response2 = client.post(
        "/api/v1/login",
        data={"username": "test_driver2@test.com", "password": "test123"}
    )
    assert response2.status_code == 200
    token2 = response2.json()["access_token"]
    
    # Motorista 1 atualiza localização
    loc1_response = client.patch(
        "/api/v1/users/me/location",
        headers={"Authorization": f"Bearer {token1}"},
        json={"lat": -3.1190, "lng": -60.0217}
    )
    assert loc1_response.status_code == 200
    assert loc1_response.json()["status"] == "updated"
    
    # Motorista 2 atualiza localização
    loc2_response = client.patch(
        "/api/v1/users/me/location",
        headers={"Authorization": f"Bearer {token2}"},
        json={"lat": -3.1303, "lng": -60.0234}
    )
    assert loc2_response.status_code == 200
    assert loc2_response.json()["status"] == "updated"
    
    # Listar motoristas (como admin)
    admin_login = client.post(
        "/api/v1/login",
        data={"username": "admin@podium.com", "password": "Admin123!"}
    )
    admin_token = admin_login.json()["access_token"]
    
    list_response = client.get(
        "/api/v1/users",
        headers={"Authorization": f"Bearer {admin_token}"},
        params={"role": "driver"}
    )
    assert list_response.status_code == 200
    
    drivers = list_response.json()
    
    # Verificar que ambos os motoristas têm localização
    driver1 = next((d for d in drivers if d["email"] == "test_driver1@test.com"), None)
    driver2 = next((d for d in drivers if d["email"] == "test_driver2@test.com"), None)
    
    assert driver1 is not None, "Driver 1 not found"
    assert driver2 is not None, "Driver 2 not found"
    
    # Verificar localizações
    assert driver1["driver_profile"]["current_lat"] == approx(-3.1190, abs=0.0001)
    assert driver1["driver_profile"]["current_lng"] == approx(-60.0217, abs=0.0001)

    assert driver2["driver_profile"]["current_lat"] == approx(-3.1303, abs=0.0001)
    assert driver2["driver_profile"]["current_lng"] == approx(-60.0234, abs=0.0001)

def test_driver_location_update_isolation(setup_drivers: list[User], client: TestClient):
    """
    Testa que a atualização de um motorista não afeta o outro
    """
    # Login dos dois motoristas
    token1 = client.post("/api/v1/login", data={"username": "test_driver1@test.com", "password": "test123"}).json()["access_token"]
    token2 = client.post("/api/v1/login", data={"username": "test_driver2@test.com", "password": "test123"}).json()["access_token"]
    
    # Ambos atualizam localização inicial
    client.patch("/api/v1/users/me/location", headers={"Authorization": f"Bearer {token1}"}, json={"lat": -3.1190, "lng": -60.0217})
    client.patch("/api/v1/users/me/location", headers={"Authorization": f"Bearer {token2}"}, json={"lat": -3.1303, "lng": -60.0234})
    
    # Motorista 1 atualiza para nova posição
    client.patch("/api/v1/users/me/location", headers={"Authorization": f"Bearer {token1}"}, json={"lat": -3.1250, "lng": -60.0200})
    
    # Verificar que motorista 2 NÃO mudou
    admin_token = client.post("/api/v1/login", data={"username": "admin@podium.com", "password": "Admin123!"}).json()["access_token"]
    drivers = client.get("/api/v1/users", headers={"Authorization": f"Bearer {admin_token}"}, params={"role": "driver"}).json()
    
    driver1 = next(d for d in drivers if d["email"] == "test_driver1@test.com")
    driver2 = next(d for d in drivers if d["email"] == "test_driver2@test.com")
    
    # Driver 1 deve ter nova posição
    assert driver1["driver_profile"]["current_lat"] == approx(-3.1250, abs=0.0001)
    
    # Driver 2 deve ter posição original
    assert driver2["driver_profile"]["current_lat"] == approx(-3.1303, abs=0.0001)
    assert driver2["driver_profile"]["current_lng"] == approx(-60.0234, abs=0.0001)

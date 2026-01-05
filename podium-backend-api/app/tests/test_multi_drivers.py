"""
Script de Teste: Múltiplos Motoristas com Telemetria Simultânea

Simula 2 motoristas logados ao mesmo tempo enviando telemetria GPS
e verifica se as informações de ambos persistem corretamente.

Uso:
    python -m app.tests.test_multi_drivers
"""

import requests
from typing import Any, Dict, List
import time
from datetime import datetime

BASE_URL = "http://127.0.0.1:8000"

# Credenciais dos motoristas de teste
DRIVERS = [
    {"email": "driver1@podium.com", "password": "teste123"},
    {"email": "driver2@podium.com", "password": "teste123"}
]

# Admin para listar motoristas
ADMIN: Dict[str, str] = {"email": "admin@podium.com", "password": "Admin123!"}

def login(email: str, password: str) -> str:
    """Faz login e retorna o token JWT"""
    response = requests.post(
        f"{BASE_URL}/api/v1/login",
        data={"username": email, "password": password}
    )
    if response.status_code != 200:
        raise Exception(f"Login falhou para {email}: {response.status_code} - {response.text}")
    return response.json()["access_token"]

JsonDict = Dict[str, Any]
JsonList = List[JsonDict]

def update_location(token: str, lat: float, lng: float) -> JsonDict:
    """Atualiza localização do motorista"""
    response = requests.patch(
        f"{BASE_URL}/api/v1/users/me/location",
        headers={"Authorization": f"Bearer {token}"},
        json={"lat": lat, "lng": lng}
    )
    if response.status_code != 200:
        raise Exception(f"Atualização de localização falhou: {response.status_code} - {response.text}")
    return response.json()

def list_drivers(admin_token: str) -> JsonList:
    """Lista motoristas com localização (como admin)"""
    response = requests.get(
        f"{BASE_URL}/api/v1/users",
        headers={"Authorization": f"Bearer {admin_token}"},
        params={"role": "driver"}
    )
    if response.status_code != 200:
        raise Exception(f"Listagem de motoristas falhou: {response.status_code} - {response.text}")
    return response.json()

def print_driver_locations(drivers: JsonList) -> None:
    """Exibe localizações dos motoristas"""
    print("\n" + "="*60)
    print(f"📍 ESTADO ATUAL ({datetime.now().strftime('%H:%M:%S')})")
    print("="*60)
    for driver in drivers:
        profile = driver.get("driver_profile", {})
        if profile:
            lat = profile.get("current_lat")
            lng = profile.get("current_lng")
            last_update = profile.get("last_location_at")
            print(f"🚗 {driver['full_name']} (ID: {driver['id']})")
            print(f"   📧 Email: {driver['email']}")
            if (lat is not None) and (lng is not None):
                print(f"   📍 Localização: ({lat}, {lng})")
                print(f"   🕐 Última atualização: {last_update}")
            else:
                print("   ⚠️  SEM LOCALIZAÇÃO")
            print(f"   🚘 Veículo: {profile.get('vehicle_model')} - {profile.get('vehicle_plate')}")
        else:
            print(f"⚠️  {driver['full_name']} - SEM PERFIL DE MOTORISTA")
        print("-" * 60)

def run_test():
    """Executa teste de múltiplos motoristas"""
    print("🧪 TESTE: MÚLTIPLOS MOTORISTAS COM TELEMETRIA SIMULTÂNEA")
    print("="*60)
    
    # 1. Login do admin
    print("\n[1] Login do Admin...")
    admin_token = login(ADMIN["email"], ADMIN["password"])
    print("✅ Admin logado com sucesso")
    
    # 2. Login dos motoristas
    print("\n[2] Login dos Motoristas...")
    driver_tokens: List[Dict[str, str]] = []
    for i, driver in enumerate(DRIVERS, 1):
        try:
            token = login(driver["email"], driver["password"])
            driver_tokens.append({"email": driver["email"], "token": token})
            print(f"✅ Motorista {i} ({driver['email']}) logado")
        except Exception as e:
            print(f"❌ Erro ao logar motorista {i}: {e}")
            return
    
    # 3. Estado inicial (antes de qualquer telemetria)
    print("\n[3] Estado Inicial dos Motoristas...")
    initial_drivers: JsonList = list_drivers(admin_token)
    print_driver_locations(initial_drivers)
    
    # 4. Motorista 1 envia localização
    print("\n[4] Motorista 1 enviando telemetria...")
    loc1 = {"lat": -3.1190, "lng": -60.0217}  # Manaus - Centro
    result1 = update_location(driver_tokens[0]["token"], loc1["lat"], loc1["lng"])
    print(f"✅ Motorista 1: {result1}")
    
    time.sleep(1)  # Pequeno delay para simular tempo real
    
    # 5. Verificar se Motorista 1 aparece no mapa
    print("\n[5] Verificando estado após Motorista 1...")
    after_driver1: JsonList = list_drivers(admin_token)
    print_driver_locations(after_driver1)
    
    # 6. Motorista 2 envia localização
    print("\n[6] Motorista 2 enviando telemetria...")
    loc2 = {"lat": -3.1303, "lng": -60.0234}  # Manaus - Teatro Amazonas
    result2 = update_location(driver_tokens[1]["token"], loc2["lat"], loc2["lng"])
    print(f"✅ Motorista 2: {result2}")
    
    time.sleep(1)
    
    # 7. Verificar se AMBOS aparecem no mapa
    print("\n[7] Verificando estado após Motorista 2...")
    after_driver2: JsonList = list_drivers(admin_token)
    print_driver_locations(after_driver2)
    
    # 8. Motorista 1 atualiza novamente
    print("\n[8] Motorista 1 atualizando localização novamente...")
    loc1_new = {"lat": -3.1250, "lng": -60.0200}  # Nova posição
    result1_new = update_location(driver_tokens[0]["token"], loc1_new["lat"], loc1_new["lng"])
    print(f"✅ Motorista 1 (nova posição): {result1_new}")
    
    time.sleep(1)
    
    # 9. Verificar se ambos ainda estão com localização
    print("\n[9] Verificando estado final...")
    final_drivers: JsonList = list_drivers(admin_token)
    print_driver_locations(final_drivers)
    
    # 10. Análise dos resultados
    print("\n" + "="*60)
    print("📊 ANÁLISE DOS RESULTADOS")
    print("="*60)

    # Considera apenas os motoristas participantes do cenário (DRIVERS)
    target_emails = {d["email"] for d in DRIVERS}
    relevant_drivers: JsonList = [d for d in final_drivers if d.get("email") in target_emails]

    def has_location(d: JsonDict) -> bool:
        prof: JsonDict = (d.get("driver_profile") or {})  # type: ignore[assignment]
        return (prof.get("current_lat") is not None) and (prof.get("current_lng") is not None)

    drivers_with_location: JsonList = [d for d in relevant_drivers if has_location(d)]
    drivers_without_location: JsonList = [d for d in relevant_drivers if not has_location(d)]

    print(f"✅ Motoristas com localização: {len(drivers_with_location)}/{len(relevant_drivers)}")
    print(f"❌ Motoristas sem localização: {len(drivers_without_location)}/{len(relevant_drivers)}")

    if len(drivers_with_location) == len(relevant_drivers):
        print("\n🎉 TESTE PASSOU: Todos os motoristas têm localização!")
    else:
        print("\n⚠️  TESTE FALHOU: Alguns motoristas perderam localização!")
        print("\nMotoristas SEM localização:")
        for d in drivers_without_location:
            print(f"   - {d['full_name']} ({d['email']})")
    
    # Verificar se as localizações estão corretas
    print("\n📍 Validação de Localizações:")
    for i, driver_info in enumerate(DRIVERS, 1):
        driver = next((d for d in final_drivers if d['email'] == driver_info['email']), None)
        if driver and driver.get('driver_profile'):
            profile = driver['driver_profile']
            lat = profile.get('current_lat')
            lng = profile.get('current_lng')
            
            # Motorista 1 deve ter a segunda posição (-3.1250, -60.0200)
            # Motorista 2 deve ter a posição (-3.1303, -60.0234)
            if i == 1:
                expected = (-3.1250, -60.0200)
            else:
                expected = (-3.1303, -60.0234)
            
            if lat and lng:
                if abs(lat - expected[0]) < 0.0001 and abs(lng - expected[1]) < 0.0001:
                    print(f"   ✅ Motorista {i}: Localização correta ({lat}, {lng})")
                else:
                    print(f"   ⚠️  Motorista {i}: Localização incorreta!")
                    print(f"      Esperado: {expected}")
                    print(f"      Obtido: ({lat}, {lng})")
            else:
                print(f"   ❌ Motorista {i}: SEM LOCALIZAÇÃO")
        else:
            print(f"   ❌ Motorista {i}: NÃO ENCONTRADO")

if __name__ == "__main__":
    try:
        run_test()
    except Exception as e:
        print(f"\n❌ ERRO NO TESTE: {e}")
        import traceback
        traceback.print_exc()

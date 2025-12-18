import os
import argparse
from sqlmodel import Session, select
from app.core.database import engine
from app.core.security import get_password_hash
from app.models.domain import User, Company, CostCenter, DriverProfile, EmployeeProfile

# Script para popular dados iniciais: empresa, motorista, funcionários


def seed_company(name: str, cnpj: str) -> Company:
    """Cria ou retorna empresa existente"""
    with Session(engine) as session:
        stmt = select(Company).where(Company.cnpj == cnpj)
        existing = session.exec(stmt).first()
        if existing:
            print(f"[seed-company] Empresa já existe: {name} (CNPJ: {cnpj})")
            return existing
        
        company = Company(name=name, cnpj=cnpj, contract_status="active")
        session.add(company)
        session.commit()
        session.refresh(company)
        print(f"[seed-company] Empresa criada: id={company.id}, name={company.name}")
        return company


def seed_cost_center(company_id: int, name: str, code: str) -> CostCenter:
    """Cria ou retorna centro de custo existente"""
    with Session(engine) as session:
        stmt = select(CostCenter).where(
            (CostCenter.company_id == company_id) & (CostCenter.code == code)
        )
        existing = session.exec(stmt).first()
        if existing:
            print(f"[seed-cost-center] Centro de custo já existe: {name} ({code})")
            return existing
        
        cost_center = CostCenter(name=name, code=code, company_id=company_id)
        session.add(cost_center)
        session.commit()
        session.refresh(cost_center)
        print(f"[seed-cost-center] Centro de custo criado: id={cost_center.id}, name={cost_center.name}")
        return cost_center


def seed_driver(email: str, full_name: str, password: str, vehicle_model: str, 
                vehicle_plate: str, cnh_number: str) -> User:
    """Cria motorista (User + DriverProfile)"""
    with Session(engine) as session:
        # Verificar se usuário já existe
        stmt = select(User).where(User.email == email)
        existing_user = session.exec(stmt).first()
        if existing_user:
            print(f"[seed-driver] Motorista já existe: {email}")
            return existing_user
        
        try:
            hashed = get_password_hash(password)
            user = User(
                email=email,
                full_name=full_name,
                hashed_password=hashed,
                role=User.Role.driver,
                is_active=True,
            )
            session.add(user)
            session.flush()  # Obtém o ID
            
            # Type narrowing para garantir que user.id não é None
            user_id: int = user.id or 0
            if user_id == 0:
                raise ValueError("Falha ao obter ID do usuário")
            
            driver_profile = DriverProfile(
                user_id=user_id,
                vehicle_model=vehicle_model,
                vehicle_plate=vehicle_plate,
                cnh_number=cnh_number,
            )
            session.add(driver_profile)
            session.commit()
            session.refresh(user)
            print(f"[seed-driver] Motorista criado: id={user.id}, email={user.email}")
            return user
        except Exception as e:
            session.rollback()
            print(f"[seed-driver] Erro ao criar motorista {email}: {str(e)}")
            raise


def seed_employee(email: str, full_name: str, password: str, company_id: int, 
                  department: str | None = None) -> User:
    """Cria funcionário (User + EmployeeProfile)"""
    with Session(engine) as session:
        # Verificar se usuário já existe
        stmt = select(User).where(User.email == email)
        existing_user = session.exec(stmt).first()
        if existing_user:
            print(f"[seed-employee] Funcionário já existe: {email}")
            return existing_user
        
        try:
            hashed = get_password_hash(password)
            user = User(
                email=email,
                full_name=full_name,
                hashed_password=hashed,
                role=User.Role.employee,
                is_active=True,
            )
            session.add(user)
            session.flush()  # Obtém o ID
            
            # Type narrowing para garantir que user.id não é None
            user_id: int = user.id or 0
            if user_id == 0:
                raise ValueError("Falha ao obter ID do usuário")
            
            employee_profile = EmployeeProfile(
                user_id=user_id,
                company_id=company_id,
                department=department,
            )
            session.add(employee_profile)
            session.commit()
            session.refresh(user)
            print(f"[seed-employee] Funcionário criado: id={user.id}, email={user.email}")
            return user
        except Exception as e:
            session.rollback()
            print(f"[seed-employee] Erro ao criar funcionário {email}: {str(e)}")
            raise


def main():
    parser = argparse.ArgumentParser(description="Seed de dados iniciais")
    parser.add_argument("--password", default="teste123", help="Senha padrão para todos")
    parser.add_argument("--company-name", default=os.environ.get("SEED_COMPANY_NAME", "Podium Serviços"))
    parser.add_argument("--company-cnpj", default=os.environ.get("SEED_COMPANY_CNPJ", "12.345.678/0001-99"))
    args = parser.parse_args()

    print("\n=== SEED DE DADOS INICIAIS ===\n")

    # 1. Criar empresa
    company = seed_company(args.company_name, args.company_cnpj)
    
    # 2. Criar centro de custo
    if company.id is None:
        raise ValueError("Company ID não pode ser None")
    
    cost_center = seed_cost_center(company.id, "Operações", "CC-001")
    
    # 3. Criar motorista
    seed_driver(
        email="driver1@podium.com",
        full_name="Motorista 1",
        password=args.password,
        vehicle_model="Sedan",
        vehicle_plate="ABC1D23",
        cnh_number="12345678900"
    )
    
    # 4. Criar mais motoristas (opcional)
    seed_driver(
        email="driver2@podium.com",
        full_name="Motorista 2",
        password=args.password,
        vehicle_model="SUV",
        vehicle_plate="XYZ9K87",
        cnh_number="98765432100"
    )
    
    # 5. Criar funcionários
    seed_employee(
        email="employee1@podium.com",
        full_name="Funcionário 1",
        password=args.password,
        company_id=company.id,
        department="Gerência"
    )
    
    seed_employee(
        email="employee2@podium.com",
        full_name="Funcionário 2",
        password=args.password,
        company_id=company.id,
        department="Operações"
    )
    
    seed_employee(
        email="employee3@podium.com",
        full_name="Funcionário 3",
        password=args.password,
        company_id=company.id,
        department="RH"
    )

    print("\n=== SEED COMPLETADO ===\n")
    print(f"Empresa: {company.name} (ID: {company.id})")
    print(f"Centro de Custo: {cost_center.name} (ID: {cost_center.id})")
    print("\nCredenciais:")
    print("  Admin:      admin@podium.com / Admin123!")
    print(f"  Motorista:  driver1@podium.com / {args.password}")
    print(f"  Motorista:  driver2@podium.com / {args.password}")
    print(f"  Func.:      employee1@podium.com / {args.password}")
    print(f"  Func.:      employee2@podium.com / {args.password}")
    print(f"  Func.:      employee3@podium.com / {args.password}")


if __name__ == "__main__":
    main()

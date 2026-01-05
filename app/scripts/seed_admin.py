import os
import argparse
from sqlmodel import Session, select
from app.core.database import engine
from app.core.security import get_password_hash
from app.models.domain import User

# Seed script para criar o primeiro admin, evitando expor signup público.

def seed_admin(email: str, full_name: str, password: str) -> None:
    hashed = get_password_hash(password)
    with Session(engine) as session:
        stmt = select(User).where(User.email == email)
        existing = session.exec(stmt).first()
        if existing:
            print(f"[seed-admin] Usuário já existe: {email}")
            return
        user = User(
            email=email,
            full_name=full_name,
            hashed_password=hashed,
            role=User.Role.admin,
            is_active=True,
        )
        session.add(user)
        session.commit()
        session.refresh(user)
        print(f"[seed-admin] Admin criado com id={user.id} email={user.email}")


def main():
    parser = argparse.ArgumentParser(description="Seed de admin inicial")
    parser.add_argument("--email", default=os.environ.get("SEED_ADMIN_EMAIL", "admin@podium.com"))
    parser.add_argument("--name", default=os.environ.get("SEED_ADMIN_NAME", "Admin"))
    parser.add_argument("--password", default=os.environ.get("SEED_ADMIN_PASSWORD", "Admin123!"))
    args = parser.parse_args()

    seed_admin(email=args.email, full_name=args.name, password=args.password)


if __name__ == "__main__":
    main()

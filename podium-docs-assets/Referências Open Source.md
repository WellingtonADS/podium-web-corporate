

### 1. Referências Open Source & Assets (O que importar)

Não clonaremos projetos inteiros para não herdar "lixo". Importaremos apenas ativos específicos (Assets) e lógica visual.

#### A. Do Repositório "Uber Clone" (Adrian Hajdin)

* **Fonte:** [github.com/adrianhajdin/uber](https://github.com/adrianhajdin/uber)

* **O que importar (Cópia Manual):**
  
  1. **Imagens da Frota:** Copie a pasta `assets/images` (arquivos `uber-x.png`, `uber-black.png`).
     
     * _Ação:_ Renomeie para `podium-executive.png` e `podium-luxury.png`.
  
  2. **Lógica Visual de Lista:** Estude o arquivo `components/RideOptionsCard.tsx` apenas para copiar a lógica de como ele seleciona o item na lista (o efeito de borda colorida ao clicar).

#### B. Estilo de Mapa (Snazzy Maps)

* **Fonte:** [snazzymaps.com](https://snazzymaps.com/style/151/midnight-commander)

* **O que importar:**
  
  * O arquivo JSON **"Midnight Commander"**.
  
  * _Uso:_ Será importado no componente `<MapView />` do Mobile para dar o visual "Dark/Gold" corporativo.

#### C. Bibliotecas de UI (Web Admin)

* **Fonte:** Chakra UI (Versão 2)

* **O que importar:**
  
  * Componentes prontos: `Card`, `Stat`, `Table`, `Badge`, `SimpleGrid`.
  
  * _Motivo:_ Acelera o desenvolvimento do painel sem precisar escrever CSS para responsividade.

* * *

### 2. Componentes a Serem Instalados (Stack Real)

Estas são as dependências que devem constar no seu `package.json` (Node) e `requirements.txt` (Python).

#### No Mobile (React Native / Expo)

JSON
    {
      "dependencies": {
        "expo": "~50.0.0",
        "react-native-maps": "1.10.0",        // Renderização do Mapa Google/Apple
        "expo-location": "~16.5.5",           // GPS Real do Dispositivo
        "axios": "^1.6.0",                    // Conexão com Python
        "nativewind": "^2.0.11",              // Estilização rápida (Tailwind)
        "socket.io-client": "^4.7.0",         // Comunicação Real-time (Motorista <-> Passageiro)
        "@react-native-async-storage/async-storage": "1.21.0" // Salvar Login
      }
    }

#### No Backend (Python / FastAPI)

Plaintext
    fastapi>=0.100.0
    uvicorn>=0.20.0
    sqlmodel>=0.0.8      # ORM (Banco de Dados)
    psycopg2-binary      # Driver do PostgreSQL
    python-jose[cryptography] # Para gerar Tokens de Login (JWT)
    passlib[bcrypt]      # Para criptografar senhas

* * *

### 3. Modelos de Dados (Database Schema)

Estes são os **Modelos Definitivos** que você deve criar no seu `backend-api/models.py`. Eles representam as regras de negócio B2B da Podium.

#### A. Usuário (User)

Unifica Passageiros (Funcionários) e Motoristas, diferenciados pelo campo `role`.

Python
    from typing import Optional
    from sqlmodel import Field, SQLModel
    from datetime import datetime

    class User(SQLModel, table=True):
        id: Optional[int] = Field(default=None, primary_key=True)
        email: str = Field(index=True, unique=True)
        hashed_password: str
        full_name: str
        role: str  # "admin", "driver", "passenger"
        company_id: Optional[int] = Field(default=None, foreign_key="company.id") # Vínculo B2B
        is_active: bool = True
        created_at: datetime = Field(default_factory=datetime.utcnow)

#### B. Empresa Cliente (Company)

Fundamental para o modelo B2B.

Python
    class Company(SQLModel, table=True):
        id: Optional[int] = Field(default=None, primary_key=True)
        name: str  # Ex: "Samsung Distrito"
        cnpj: str
        contract_status: str = "active"
        cost_centers: str # Pode ser JSON ou tabela separada no futuro

#### C. Corrida (Ride)

O registro financeiro e operacional.

Python
    class Ride(SQLModel, table=True):
        id: Optional[int] = Field(default=None, primary_key=True)
        passenger_id: int = Field(foreign_key="user.id")
        driver_id: Optional[int] = Field(default=None, foreign_key="user.id")

        # Dados Financeiros (B2B)
        cost_center: str      # Ex: "Projeto Alpha"
        price_fixed: float    # Valor calculado (R$ 17.00)
        distance_km: float    # Distância estimada

        # Status e Logística
        status: str           # "requested", "accepted", "in_progress", "completed", "cancelled"
        origin_address: str
        destination_address: str

        created_at: datetime = Field(default_factory=datetime.utcnow)
        finished_at: Optional[datetime] = None

### Resumo da Ação

1. **Mobile:** Use as imagens do Adrian + JSON do Snazzy Maps.

2. **Backend:** Implemente as classes `User`, `Company` e `Ride` usando SQLModel (código acima).

3. **Integração:** O App Mobile envia `POST /rides` preenchendo o modelo `Ride` no banco.

Quer que eu escreva o arquivo `database.py` completo que conecta esses modelos ao **SQLite** (para teste imediato) ou **PostgreSQL** (para produção)?

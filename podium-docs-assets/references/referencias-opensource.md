### 1. Referências Open Source & Assets

Não clonaremos projetos inteiros para não herdar "lixo". Importaremos apenas ativos específicos (assets) e lógica visual.

#### A. Uber Clone (Adrian Hajdin)

- Fonte: <https://github.com/adrianhajdin/uber>
- O que importar:
  1. Imagens da frota: copie `assets/images` (`uber-x.png`, `uber-black.png`)
     e renomeie para `podium-executive.png` e `podium-luxury.png`.
  1. Lógica visual de lista: estudar `components/RideOptionsCard.tsx`
     para copiar a lógica de seleção (borda destacada ao clicar).

#### B. Estilo de Mapa (Snazzy Maps)

- Fonte: <https://snazzymaps.com/style/151/midnight-commander>
- O que importar:
  - Arquivo JSON "Midnight Commander" para usar no `<MapView />` do Mobile com visual Dark/Gold corporativo.

#### C. Bibliotecas de UI (Web Admin)

- Fonte: Chakra UI (versão 2)
- O que importar:
  - Componentes prontos: `Card`, `Stat`, `Table`, `Badge`, `SimpleGrid`.
  - Motivo: acelera o desenvolvimento do painel sem CSS manual para responsividade.

### 2. Componentes a Serem Instalados (Stack Real)

Dependências esperadas em `package.json` (Node) e `requirements.txt` (Python).

#### No Mobile (React Native / Expo)

```json
{
  "dependencies": {
    "expo": "~50.0.0",
    "react-native-maps": "1.10.0",
    "expo-location": "~16.5.5",
    "axios": "^1.6.0",
    "nativewind": "^2.0.11",
    "socket.io-client": "^4.7.0",
    "@react-native-async-storage/async-storage": "1.21.0"
  }
}
```

#### No Backend (Python / FastAPI)

```text
fastapi>=0.100.0
uvicorn>=0.20.0
sqlmodel>=0.0.8
psycopg2-binary
python-jose[cryptography]
passlib[bcrypt]
```

### 3. Modelos de Dados (Database Schema)

Modelos recomendados em `backend-api/models.py` (SQLModel) para refletir regras de negócio B2B.

#### A. Usuário (User)

```python
from typing import Optional
from sqlmodel import Field, SQLModel
from datetime import datetime

class User(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    email: str = Field(index=True, unique=True)
    hashed_password: str
    full_name: str
    role: str  # "admin", "driver", "passenger"
    company_id: Optional[int] = Field(default=None, foreign_key="company.id")
    is_active: bool = True
    created_at: datetime = Field(default_factory=datetime.utcnow)
```

#### B. Empresa Cliente (Company)

```python
class Company(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str
    cnpj: str
    contract_status: str = "active"
    cost_centers: str  # Pode ser JSON ou tabela separada no futuro
```

#### C. Corrida (Ride)

```python
class Ride(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    passenger_id: int = Field(foreign_key="user.id")
    driver_id: Optional[int] = Field(default=None, foreign_key="user.id")
    cost_center: str
    price_fixed: float
    distance_km: float
    status: str  # "requested", "accepted", "in_progress", "completed", "cancelled"
    origin_address: str
    destination_address: str
    created_at: datetime = Field(default_factory=datetime.utcnow)
    finished_at: Optional[datetime] = None
```

### Resumo da Ação

1. Mobile: use as imagens do Adrian + JSON do Snazzy Maps.
1. Backend: implemente `User`, `Company` e `Ride` com SQLModel.
1. Integração: o app envia `POST /rides` preenchendo o modelo `Ride` no banco.

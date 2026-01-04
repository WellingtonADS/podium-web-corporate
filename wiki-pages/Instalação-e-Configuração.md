# Instalação e Configuração

Guia passo-a-passo para configurar o ambiente de desenvolvimento do monorepo Podium.

## Pré-requisitos

Certifique-se de ter instalado:

- **Node.js 18+** - [https://nodejs.org/](https://nodejs.org/)
- **Python 3.11+** - [https://www.python.org/](https://www.python.org/)
- **Git 2.40+** - [https://git-scm.com/](https://git-scm.com/)
- **Yarn** (npm install -g yarn)

## Setup Inicial do Monorepo

```bash
# Clonar repositório
git clone https://github.com/WellingtonADS/podium-monorepo.git
cd podium-monorepo

# Instalar dependências de cada subprojeto
cd podium-backend-api
pip install -r requirements.txt

cd ../podium-web-admin
yarn install

cd ../podium-web-corporate
yarn install

cd ../podium-web-site
yarn install

cd ../podium-mobile-driver
yarn install
```

## Configuração do Backend API

### 1. Criar ambiente virtual Python

```bash
cd podium-backend-api
python -m venv venv
# Windows
venv\Scripts\activate
# macOS/Linux
source venv/bin/activate
```

### 2. Instalar dependências

```bash
pip install -r requirements.txt
```

### 3. Configurar variáveis de ambiente

Criar arquivo `.env` na raiz do `podium-backend-api`:

```env
DATABASE_URL=postgresql://user:password@localhost:5432/podium
SECRET_KEY=sua-chave-secreta-aqui
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

### 4. Executar migrations

```bash
alembic upgrade head
```

### 5. Iniciar servidor

```bash
python -m uvicorn app.main:app --reload
```

O servidor estará disponível em `http://localhost:8000`

## Configuração do Frontend (Web-Admin)

### 1. Instalar dependências

```bash
cd podium-web-admin
yarn install
```

### 2. Configurar variáveis de ambiente

Criar arquivo `.env.local`:

```env
REACT_APP_API_URL=http://localhost:8000
```

### 3. Iniciar servidor de desenvolvimento

```bash
yarn start
```

A aplicação estará disponível em `http://localhost:3000`

## Configuração do Frontend (Web-Corporate)

### 1. Instalar dependências

```bash
cd podium-web-corporate
yarn install
```

### 2. Configurar variáveis de ambiente

Criar arquivo `.env.local`:

```env
VITE_API_URL=http://localhost:8000
```

### 3. Iniciar servidor de desenvolvimento

```bash
yarn dev
```

A aplicação estará disponível em `http://localhost:5173`

## Configuração do Mobile Driver

### 1. Instalar dependências

```bash
cd podium-mobile-driver
yarn install
```

### 2. Configurar variáveis de ambiente

Criar arquivo `.env`:

```env
API_URL=http://localhost:8000
```

### 3. Executar no emulador ou dispositivo

```bash
yarn start
# Escanear QR code com app Expo Go no dispositivo
```

## Verificação

Para verificar se tudo está configurado corretamente:

```bash
# Backend
curl http://localhost:8000/docs

# Web-Admin
curl http://localhost:3000

# Web-Corporate
curl http://localhost:5173
```

---

## Troubleshooting

### Porta já em uso

```bash
# Mudar porta do backend
python -m uvicorn app.main:app --port 8001 --reload

# Mudar porta do web-admin
PORT=3001 yarn start
```

### Erro de dependências Python

```bash
# Reinstalar dependências
pip install --upgrade -r requirements.txt
```

### Erro de dependências Node

```bash
# Limpar cache e reinstalar
yarn cache clean
yarn install
```

---

## Próximos Passos

- Consulte [Guia de Uso](Guia-de-Uso) para instruções de operação
- Veja [Arquitetura](Arquitetura) para entender a estrutura técnica
- Acesse [API](API) para documentação de endpoints

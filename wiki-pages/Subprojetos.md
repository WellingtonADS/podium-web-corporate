# Subprojetos

Documentação sobre os subprojetos que compõem o monorepo Podium.

## Índice

1. [Backend API](#backend-api)
2. [Web-Admin](#web-admin)
3. [Web-Corporate](#web-corporate)
4. [Web-Site](#web-site)
5. [Mobile-Driver](#mobile-driver)

---

## Backend API

**Localização:** `podium-backend-api/`  
**Linguagem:** Python 3.11+  
**Framework:** FastAPI  
**Banco de Dados:** PostgreSQL

### Descrição

API REST centralizada que fornece todos os serviços de backend para a plataforma Podium. Responsável por:

- Autenticação e autorização de usuários
- Gerenciamento de usuários, veículos e reservas
- Processamento de estatísticas e dashboards
- Integração com banco de dados PostgreSQL

### Estrutura Principal

```
podium-backend-api/
├── app/
│   ├── main.py              # Inicialização da aplicação
│   ├── api/v1/              # Endpoints da API v1
│   ├── core/                # Configurações e segurança
│   ├── models/              # Modelos SQLAlchemy
│   ├── schemas/             # Schemas Pydantic
│   ├── services/            # Lógica de negócio
│   └── tests/               # Testes unitários
└── requirements.txt         # Dependências
```

### Tecnologias Principais

- **FastAPI** — Framework web moderno
- **SQLAlchemy** — ORM para banco de dados
- **Pydantic** — Validação de dados
- **Python-Jose** — Autenticação JWT
- **Pytest** — Framework de testes

### Como Iniciar

```bash
cd podium-backend-api
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python -m uvicorn app.main:app --reload
```

---

## Web-Admin

**Localização:** `podium-web-admin/`  
**Linguagem:** TypeScript  
**Framework:** React 18+  
**Estilo:** Chakra UI  
**Build Tool:** Vite

### Descrição

Dashboard administrativo para gerenciamento da plataforma Podium. Oferece:

- Autenticação de administradores
- Gerenciamento de usuários
- Gerenciamento de frota de veículos
- Visualização de reservas e estatísticas
- Controle de acesso baseado em perfil

### Estrutura Principal

```
podium-web-admin/
├── src/
│   ├── components/          # Componentes React reutilizáveis
│   ├── contexts/            # Contextos (Auth, Theme)
│   ├── hooks/               # Custom hooks
│   ├── layouts/             # Layouts de página
│   ├── pages/               # Páginas principais
│   ├── routes/              # Configuração de rotas
│   ├── services/            # Serviços de API
│   └── theme/               # Tema Chakra UI
└── package.json
```

### Tecnologias Principais

- **React 18** — Biblioteca de UI
- **TypeScript** — Type safety
- **Chakra UI** — Componentes de UI
- **React Router** — Roteamento
- **Axios** — Cliente HTTP
- **Vite** — Build tool

### Como Iniciar

```bash
cd podium-web-admin
yarn install
yarn start
```

---

## Web-Corporate

**Localização:** `podium-web-corporate/`  
**Linguagem:** TypeScript  
**Framework:** React 18+  
**Build Tool:** Vite

### Descrição

Portal corporativo para empresas que utilizam a plataforma Podium. Permite:

- Login de usuários corporativos
- Visualização de veículos disponíveis
- Realização de reservas
- Histórico de reservas
- Gerenciamento de centro de custo
- Dashboard corporativo com estatísticas

### Estrutura Principal

```
podium-web-corporate/
├── src/
│   ├── components/          # Componentes React
│   ├── contexts/            # Contextos (Auth)
│   ├── hooks/               # Custom hooks
│   ├── layouts/             # Layouts
│   ├── pages/               # Páginas
│   ├── routes/              # Rotas e PrivateRoute
│   ├── services/            # Serviços de API
│   ├── theme/               # Tema customizado
│   └── types/               # TypeScript interfaces
└── vite.config.ts
```

### Tecnologias Principais

- **React 18** — Biblioteca de UI
- **TypeScript** — Type safety
- **Vite** — Build tool moderno
- **React Router** — Roteamento
- **Axios** — Cliente HTTP

### Integração com Backend

- **AuthContext** — Gerencia autenticação e dados do usuário
- **CorporateService** — Centraliza chamadas à API
- **Types** — Interfaces TypeScript alinhadas com backend

### Como Iniciar

```bash
cd podium-web-corporate
yarn install
yarn dev
```

---

## Web-Site

**Localização:** `podium-web-site/`  
**Linguagem:** TypeScript  
**Framework:** React 18+  
**Build Tool:** Vite

### Descrição

Site institucional e landing page da plataforma Podium. Disponibiliza:

- Informações sobre a plataforma
- Páginas de marketing
- Formulários de contato
- Documentação pública
- Links para login em diferentes portais

### Estrutura Principal

```
podium-web-site/
├── src/
│   ├── components/          # Componentes React
│   ├── pages/               # Páginas
│   ├── layouts/             # Layouts
│   ├── utils/               # Utilitários
│   ├── assets/              # Imagens e mídia
│   └── theme/               # Tema
└── vite.config.ts
```

### Tecnologias Principais

- **React 18** — Biblioteca de UI
- **TypeScript** — Type safety
- **Vite** — Build tool

### Como Iniciar

```bash
cd podium-web-site
yarn install
yarn dev
```

---

## Mobile-Driver

**Localização:** `podium-mobile-driver/`  
**Linguagem:** TypeScript  
**Framework:** React Native  
**Plataforma:** Expo

### Descrição

Aplicação mobile nativa para motoristas. Oferece:

- Autenticação de motoristas
- Visualização de viagens atribuídas
- Rastreamento de localização em tempo real
- Atualização de status de viagem
- Histórico de corridas

### Estrutura Principal

```
podium-mobile-driver/
├── src/
│   ├── components/          # Componentes React Native
│   ├── contexts/            # Contextos
│   ├── screens/             # Telas da aplicação
│   ├── services/            # Serviços de API
│   ├── styles/              # Estilos
│   └── theme/               # Tema
├── assets/                  # Imagens e ícones
└── app.json                 # Configuração Expo
```

### Tecnologias Principais

- **React Native** — Desenvolvimento mobile cross-platform
- **Expo** — Plataforma de desenvolvimento
- **TypeScript** — Type safety
- **React Navigation** — Navegação mobile

### Como Iniciar

```bash
cd podium-mobile-driver
yarn install
yarn start
# Escanear QR code com Expo Go no dispositivo
```

---

## Padrões Compartilhados

### Autenticação

Todos os frontends implementam um contexto de autenticação que:

- Armazena token JWT
- Gerencia estado de login/logout
- Fornece dados do usuário autenticado
- Redireciona para login se não autenticado

### Serviços de API

Cada frontend possui uma camada de serviço que:

- Centraliza chamadas à API
- Configura headers de autenticação
- Trata erros de forma consistente
- Fornece type-safety com TypeScript

### Type Safety

Todos os projetos TypeScript compartilham:

- Interfaces alinhadas com backend
- Validação em tempo de compilação
- IntelliSense para melhor experiência de desenvolvimento

---

## Próximos Passos

- Consulte [Instalação e Configuração](Instalação-e-Configuração) para setup completo
- Veja [API](API) para documentação de endpoints
- Acesse [Arquitetura](Arquitetura) para entender a estrutura técnica geral

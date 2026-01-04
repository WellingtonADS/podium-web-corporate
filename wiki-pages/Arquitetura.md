# Arquitetura

Documentação técnica da arquitetura do monorepo Podium.

## Visão Geral da Arquitetura

O Podium utiliza uma arquitetura de monorepo com separação clara entre camadas:

- **Backend** (Python/FastAPI) — API REST centralizada
- **Frontends** (React/TypeScript) — Múltiplas aplicações web
- **Mobile** (React Native) — Aplicação mobile nativa

```
┌─────────────────────────────────────────────────────────┐
│                    Podium Monorepo                       │
├─────────────────────────────────────────────────────────┤
│                                                           │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐   │
│  │  Web-Admin   │  │  Web-Corp    │  │   Web-Site   │   │
│  │  (React)     │  │  (React)     │  │  (React)     │   │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘   │
│         │                  │                  │           │
│         └──────────────────┼──────────────────┘           │
│                            │                              │
│         ┌──────────────────▼──────────────────┐          │
│         │      Backend API (FastAPI)          │          │
│         │  ┌────────────────────────────────┐ │          │
│         │  │  Authentication & Authorization│ │          │
│         │  │  Business Logic & Services     │ │          │
│         │  │  Database Layer (SQLAlchemy)   │ │          │
│         │  └────────────────────────────────┘ │          │
│         └──────────────────┬───────────────────┘          │
│                            │                              │
│  ┌─────────────────────────▼─────────────────────────┐   │
│  │              Mobile-Driver (React Native)         │   │
│  └─────────────────────────────────────────────────┘   │
│                                                           │
├─────────────────────────────────────────────────────────┤
│            Database (PostgreSQL)                         │
└─────────────────────────────────────────────────────────┘
```

## Estrutura de Diretórios

### Backend API

```
podium-backend-api/
├── app/
│   ├── main.py                  # Aplicação FastAPI principal
│   ├── api/
│   │   └── v1/                  # Endpoints da API versão 1
│   │       ├── auth.py          # Autenticação e autorização
│   │       ├── users.py         # Gerenciamento de usuários
│   │       ├── vehicles.py      # Gerenciamento de veículos
│   │       ├── bookings.py      # Reservas
│   │       └── stats.py         # Estatísticas e dashboard
│   ├── core/
│   │   ├── config.py            # Configurações da aplicação
│   │   ├── database.py          # Conexão com banco de dados
│   │   ├── security.py          # Autenticação JWT
│   │   └── constants.py         # Constantes da aplicação
│   ├── models/                  # Modelos SQLAlchemy (ORM)
│   ├── schemas/                 # Schemas Pydantic (validação)
│   ├── services/                # Lógica de negócio
│   ├── utils/                   # Utilitários
│   └── tests/                   # Testes unitários
├── requirements.txt             # Dependências Python
├── pytest.ini                   # Configuração pytest
└── README.md
```

### Web-Admin

```
podium-web-admin/
├── src/
│   ├── components/              # Componentes React reutilizáveis
│   ├── contexts/                # Contextos (Auth, Theme, etc)
│   ├── hooks/                   # Custom hooks
│   ├── layouts/                 # Layouts de página
│   ├── pages/                   # Páginas (Dashboard, Drivers, etc)
│   ├── routes/                  # Configuração de rotas
│   ├── services/                # Serviços de API (axios)
│   ├── theme/                   # Tema customizado (Chakra UI)
│   ├── App.tsx
│   └── index.tsx
├── public/                      # Assets públicos
├── package.json
├── tsconfig.json
└── vite.config.ts
```

### Web-Corporate

```
podium-web-corporate/
├── src/
│   ├── components/              # Componentes React
│   ├── contexts/                # Contextos (Auth, etc)
│   ├── hooks/                   # Custom hooks
│   ├── layouts/                 # Layouts
│   ├── pages/                   # Páginas
│   ├── routes/                  # Rotas e PrivateRoute
│   ├── services/                # Serviços de API
│   ├── theme/                   # Tema customizado
│   ├── types/                   # TypeScript interfaces
│   ├── App.tsx
│   └── main.tsx
├── public/
├── package.json
├── tsconfig.json
└── vite.config.ts
```

## Padrões Técnicos

### Autenticação

- **Mecanismo**: JWT (JSON Web Token)
- **Fluxo**: Login → Receber token → Usar em Authorization header
- **Duração**: Configurável via `ACCESS_TOKEN_EXPIRE_MINUTES`

```bash
Authorization: Bearer <token>
```

### Validação de Dados

- **Backend**: Pydantic schemas para validação automática
- **Frontend**: TypeScript para type-safety e validação em tempo de compilação

### Versionamento de API

- Endpoints seguem padrão `/api/v1/...`
- Permite evolução da API sem quebrar clientes existentes

### Tratamento de Erros

- Códigos HTTP padrão (200, 400, 401, 404, 500)
- Respostas com estrutura consistente:
  ```json
  {
    "detail": "Descrição do erro",
    "error_code": "ERROR_CODE"
  }
  ```

## Fluxos Principais

### Fluxo de Autenticação

```
1. Usuário faz login com credenciais
2. Backend valida credenciais no banco de dados
3. Backend gera JWT token
4. Frontend armazena token em localStorage/sessionStorage
5. Frontend inclui token em Authorization header para requisições subsequentes
6. Backend valida token e autoriza requisição
```

### Fluxo de Reserva de Veículo

```
1. Usuário acessa página de reservas no web-corporate
2. Frontend busca lista de veículos disponíveis via API
3. Usuário seleciona veículo e datas
4. Frontend envia requisição POST /api/v1/bookings
5. Backend valida disponibilidade
6. Backend cria reserva no banco de dados
7. Frontend exibe confirmação ao usuário
```

---

## Próximos Passos

- Consulte [API](API) para documentação de endpoints
- Veja [Guia de Uso](Guia-de-Uso) para instruções operacionais
- Acesse [Contribuindo](Contribuindo) para diretrizes de desenvolvimento

# Podium Monorepo

<!-- Badges de Status de CI -->
<p align="left">
   <a href="https://github.com/WellingtonADS/podium-monorepo/actions/workflows/web-admin-ci.yml">
      <img alt="web-admin CI" src="https://github.com/WellingtonADS/podium-monorepo/actions/workflows/web-admin-ci.yml/badge.svg" />
   </a>
   <a href="https://github.com/WellingtonADS/podium-monorepo/actions/workflows/backend-api-ci.yml">
      <img alt="backend-api CI" src="https://github.com/WellingtonADS/podium-monorepo/actions/workflows/backend-api-ci.yml/badge.svg" />
   </a>
   <a href="https://github.com/WellingtonADS/podium-monorepo/actions/workflows/mobile-driver-typecheck.yml">
      <img alt="mobile-driver Typecheck" src="https://github.com/WellingtonADS/podium-monorepo/actions/workflows/mobile-driver-typecheck.yml/badge.svg" />
   </a>
</p>

Monorepo central que orquestra e sincroniza os projetos da plataforma Podium:

- **backend-api** (Python/FastAPI) — API REST
- **web-admin** (React/TypeScript) — Dashboard administrativo
- **web-corporate** (React/TypeScript/Vite) — Portal corporativo para empresas
- **web-site** (React/TypeScript/Vite) — Site institucional e landing page
- **mobile-driver** (React Native/Expo) — App mobile para motoristas
- **docs-assets** — Materiais de suporte e documentação

---

## 🎯 Últimas Melhorias: Integração Web-Corporate

### Status: ✅ COMPLETO E DOCUMENTADO

A integração entre `podium-web-corporate` (frontend) e `podium-backend-api` foi completamente refatorada com:

✅ **Tipos unificados** (`src/types/index.ts`)
✅ **Camada de serviço** (`src/services/corporate.ts`)  
✅ **AuthContext real** (busca `/users/me`)
✅ **Dropdowns dinâmicos** (Promise.all())
✅ **Sem dados falsificados** (apenas API real)
✅ **Dashboard corporativo** (novo endpoint)
✅ **100% Type-safe** (TypeScript)

📖 **Documentação completa:**

- [INTEGRATION_COMPLETE.md](INTEGRATION_COMPLETE.md) - Resumo visual
- [INTEGRATION_SUMMARY.md](INTEGRATION_SUMMARY.md) - Análise técnica
- [VALIDATION_CHECKLIST.md](VALIDATION_CHECKLIST.md) - Validações
- [TESTING_GUIDE.md](TESTING_GUIDE.md) - Guia de testes

---

## 📋 Requisitos

- Node.js 18+ (npm 8+)
- Python 3.11+ (para backend)
- Git 2.40+
- Yarn (gerenciador de pacotes Node — web-admin, mobile-driver)

## 📁 Estrutura de Diretórios

```
podium-monorepo/
├── .github/
│   └── workflows/
│       ├── web-admin-ci.yml         # CI/Lint/Build web-admin (yarn)
│       ├── backend-api-ci.yml       # CI/Lint/Tests API (Python)
│       └── mobile-driver-typecheck.yml # Typecheck mobile-driver (yarn)
│
├── backend-api/                      # 📦 API Python/FastAPI
│   ├── app/
│   │   ├── main.py                  # Entrada FastAPI
│   │   ├── api/                      # Rotas v1
│   │   ├── core/                     # Config, DB, segurança
│   │   ├── models/                   # Modelos de domínio
│   │   ├── schemas/                  # Schemas Pydantic
│   │   ├── services/                 # Lógica de negócio
│   │   └── tests/                    # Testes unitários
│   ├── requirements.txt              # Dependências Python
│   ├── pytest.ini                    # Config pytest
│   └── README.md
│
├── web-admin/                        # 🌐 React/TypeScript com Chakra UI
│   ├── src/
│   │   ├── components/               # Componentes React
│   │   ├── contexts/                 # Auth context
│   │   ├── hooks/                    # Custom hooks
│   │   ├── layouts/                  # Layouts
│   │   ├── pages/                    # Páginas (Dashboard, Drivers, etc)
│   │   ├── routes/                   # PrivateRoute, routing
│   │   ├── services/                 # API client (axios)
│   │   ├── theme/                    # Chakra theme customizado
│   │   ├── App.tsx
│   │   └── index.tsx
│   ├── public/                       # Assets públicos
│   ├── package.json                  # Scripts: start, build, test, lint, format:check
│   ├── yarn.lock
│   ├── tsconfig.json
│   └── README.md
│
├── mobile-driver/                    # 📱 React Native/Expo com TypeScript
│   ├── src/
│   │   ├── components/               # Componentes React Native
│   │   ├── contexts/                 # Auth context
│   │   ├── screens/                  # Telas da app
│   │   ├── services/                 # API client
│   │   ├── theme/                    # Tema e estilos
│   │   └── ...
│   ├── assets/                       # Imagens, ícones
│   ├── package.json                  # Scripts: start, android, ios, web, lint, format:check, typecheck
│   ├── yarn.lock
│   ├── tsconfig.json
│   ├── app.json                      # Expo config
│   └── README.md
│
├── web-corporate/                    # 🏢 React/TypeScript/Vite - Portal Corporativo
│   ├── src/
│   │   ├── components/               # Componentes React
│   │   ├── contexts/                 # Auth context
│   │   ├── hooks/                    # Custom hooks
│   │   ├── layouts/                  # Layouts
│   │   ├── pages/                    # Páginas (Dashboard, CostCenters, etc)
│   │   ├── routes/                   # PrivateRoute, routing
│   │   ├── services/                 # API client
│   │   ├── theme/                    # MUI theme customizado
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── package.json
│   ├── vite.config.ts
│   └── README.md
│
├── web-site/                         # 🌐 React/TypeScript/Vite - Site Institucional
│   ├── src/
│   │   ├── components/               # Componentes React
│   │   ├── layouts/                  # Header, Footer, Navbar
│   │   ├── pages/                    # Home, News, etc
│   │   ├── theme/                    # MUI theme
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── public/
│   │   └── images/                   # Imagens do site
│   ├── package.json
│   ├── vite.config.ts
│   └── README.md
│
├── docs-assets/                      # 📚 Materiais de suporte
│   ├── Stack Tecnológica.md
│   ├── Referências Open Source.md
│   └── imagens/                      # Mockups, designs, etc
│
├── package.json                      # Workspaces (web-admin, mobile-driver)
├── .gitignore                        # Global: node_modules, venv, .env
├── README.md                         # Este arquivo
└── .github/
    └── workflows/                    # Workflows de CI/CD
```

## 🆕 Atualizações Recentes

- **Novos Subrepos**: Adicionados `web-corporate` (portal para empresas) e `web-site` (site institucional) como repositórios independentes.
- **Scripts de Sincronização**: Criados scripts PowerShell automatizados (`sync-subtrees-pull.ps1` e `sync-subtrees-push.ps1`) para facilitar a sincronização de todos os 5 subrepos.
- **Shared Library**: Adicionada a pasta `shared` para reutilização de utilitários, constantes e tipos entre os projetos.
- **Scripts Automatizados**: Criado o script `update-dependencies.js` para atualizar dependências automaticamente em todos os subprojetos.
- **Testes End-to-End**: Configurados testes E2E utilizando Playwright na pasta `tests/e2e`.

## 🚀 Instalação e Setup

1. Clone o repositório:
   ```bash
   git clone https://github.com/WellingtonADS/podium-monorepo.git
   ```
2. Instale as dependências na raiz do monorepo:
   ```bash
   yarn install
   ```
3. Execute os scripts de setup específicos para cada subprojeto, se necessário.

## 📦 Estado dos Repositórios

Os subprojetos deste monorepo e seus estados atuais/default são:

| Projeto                                                             | Default Branch | Branch Atual   | Descrição                                 |
| ------------------------------------------------------------------- | -------------- | -------------- | ----------------------------------------- |
| [podium-monorepo](https://github.com/WellingtonADS/podium-monorepo) | main           | main           | Monorepo central da plataforma Podium     |
| [backend-api](https://github.com/WellingtonADS/backend-api)         | release/v0.1.0 | release/v0.1.0 | API REST em Python/FastAPI                |
| [web-admin](https://github.com/WellingtonADS/web-admin)             | release/v0.1.0 | release/v0.1.0 | Dashboard administrativo React/TypeScript |
| [web-corporate](https://github.com/WellingtonADS/web-corporate)     | main           | main           | Portal corporativo para empresas          |
| [web-site](https://github.com/WellingtonADS/podium-website)         | main           | main           | Site institucional e landing page         |
| [mobile-driver](https://github.com/WellingtonADS/mobile-driver)     | main           | release/v1.0.0 | App mobile React Native para motoristas   |

> Para o mobile-driver, também existe branch main:<br>
> Último commit: 6b6c48e (2025-12-16) docs: atualizar README e .gitignore para padrão main/release

Essas referências orientam os comandos de `git subtree` descritos adiante.

### 1. Clonar e entrar no monorepo

```bash
git clone https://github.com/WellingtonADS/podium-monorepo.git
cd podium-monorepo
```

### 2. Instalar dependências (web-admin e mobile-driver)

```bash
npm install
# ou yarn install (monorepo root)
```

> **Nota:** Python não é instalado automaticamente. Configure um venv do backend-api conforme necessário.

### 3. Setup Python (backend-api)

```bash
cd backend-api
python -m venv venv
# Windows
venv\Scripts\activate
# macOS/Linux
source venv/bin/activate

pip install -r requirements.txt
```

## 💻 Desenvolvimento

### Scripts Globais (raiz do monorepo)

```bash
npm run dev:web      # React dev server (web-admin)
npm run dev:mobile   # Expo dev server (mobile-driver)
npm run dev:api      # FastAPI uvicorn (backend-api, usa venv)
npm run dev          # Todos os três em paralelo (concurrently)
```

### Scripts por Workspace

**web-admin (yarn):**

```bash
cd web-admin
yarn start           # Dev server
yarn build           # Build otimizado
yarn test --watch    # Jest em watch mode
yarn lint            # ESLint
yarn format:check    # Prettier check
```

**mobile-driver (yarn):**

```bash
cd mobile-driver
yarn start           # Expo dev server
yarn android         # Rodar no Android
yarn ios             # Rodar no iOS
yarn web             # Rodar web
yarn lint            # ESLint
yarn format:check    # Prettier check
yarn typecheck       # tsc --noEmit
```

**backend-api (Python):**

```bash
cd backend-api
pip install -r requirements.txt
python -m uvicorn app.main:app --reload  # Dev server
pytest                  # Rodar testes
pytest --cov           # Com cobertura
```

## 🔄 Fluxo Git e Subtrees

Este monorepo sincroniza com **5 repositórios independentes** via **git subtree**, preservando histórico completo e permitindo desenvolvimento tanto no monorepo quanto nos subrepos de forma independente.

### Remotes Configurados

- `origin` → WellingtonADS/podium-monorepo (principal)
- `podium-backend-api` → WellingtonADS/podium-backend-api (branch: release/v0.1.0)
- `podium-web-admin` → WellingtonADS/podium-web-admin (branch: release/v0.1.0)
- `podium-web-corporate` → WellingtonADS/podium-web-corporate (branch: main)
- `podium-web-site` → WellingtonADS/podium-web-site (branch: main)
- `podium-mobile-driver` → WellingtonADS/podium-mobile-driver (branch: release/v1.0.0)

### Puxar Mudanças de um Subprojeto

```bash
# Sincronizar remotes
git fetch --all --prune

# Puxar mudanças (exemplo podium-backend-api)
git subtree pull --prefix=podium-backend-api podium-backend-api release/v0.1.0 --squash

# Ou sem squash (preserva todos commits)
git subtree pull --prefix=podium-backend-api podium-backend-api release/v0.1.0

# Sincronizar TODOS os subrepos automaticamente
.\scripts\sync-subtrees-pull.ps1
```

### Enviar Mudanças para um Subprojeto

```bash
# Exportar mudanças do monorepo (exemplo podium-web-admin)
git subtree push --prefix=podium-web-admin podium-web-admin release/v0.1.0

# Exportar para podium-web-site
git subtree push --prefix=podium-web-site podium-web-site main

# Sincronizar TODOS os subrepos automaticamente
.\scripts\sync-subtrees-push.ps1
```

### Fluxo Recomendado

1. **Sempre trabalhe em branches do monorepo:**

   ```bash
   git checkout -b feature/xyz
   ```

2. **Antes de começar, sincronize os subtrees:**

   ```bash
   git fetch --all
   git subtree pull --prefix=podium-backend-api podium-backend-api release/v0.1.0 --squash
   git subtree pull --prefix=podium-web-admin podium-web-admin release/v0.1.0 --squash
   git subtree pull --prefix=podium-web-corporate podium-web-corporate main --squash
   git subtree pull --prefix=podium-web-site podium-web-site main --squash
   git subtree pull --prefix=podium-mobile-driver podium-mobile-driver release/v1.0.0 --squash
   ```

   **Ou use o script automatizado:**

   ```powershell
   .\scripts\sync-subtrees-pull.ps1
   ```

3. **Faça mudanças e teste localmente.**

4. **Abra PR contra `main` do monorepo.**

5. **Após merge, sincronize com os subrepos (se necessário):**

   ```bash
   git subtree push --prefix=podium-backend-api podium-backend-api release/v0.1.0
   git subtree push --prefix=podium-web-admin podium-web-admin release/v0.1.0
   git subtree push --prefix=podium-web-corporate podium-web-corporate main
   git subtree push --prefix=podium-web-site podium-web-site main
   git subtree push --prefix=podium-mobile-driver podium-mobile-driver release/v1.0.0
   ```

   **Ou use o script automatizado:**

   ```powershell
   .\scripts\sync-subtrees-push.ps1
   ```

## 🧪 CI/CD

Workflows GitHub Actions automatizados:

| Workflow                        | Trigger                   | Teste                                |
| ------------------------------- | ------------------------- | ------------------------------------ |
| **web-admin-ci.yml**            | Push/PR em web-admin/     | Lint (ESLint) → Build → Test (React) |
| **backend-api-ci.yml**          | Push/PR em backend-api/   | Lint (Ruff, Flake8) → Test (pytest)  |
| **mobile-driver-typecheck.yml** | Push/PR em mobile-driver/ | Lint (ESLint) → Typecheck (tsc)      |

Todos os workflows rodam em paralelo com cache, resultando em CI rápido.

### Status e Badges

Visualize status em: https://github.com/WellingtonADS/podium-monorepo/actions

## 📊 GitHub Project

Kanban board para planejamento e acompanhamento:

- **URL:** https://github.com/users/WellingtonADS/projects/1
- **Campos:** Status, Area (API/Web/Mobile), Priority (P0-P3), Estimate, T-Shirt (XS-XL)
- **Issues:** Criadas no monorepo com referência aos subprojetos

## 📝 Contribuindo

1. Clone o repositório.
2. Crie uma branch: `git checkout -b feature/nova-feature`.
3. Desenvolva, teste e faça commit com mensagens claras.
4. Abra PR contra `main` — os workflows rodaram automaticamente.
5. Após aprovação, merge e sincronize subtrees conforme necessário.

Para mais detalhes, veja [CONTRIBUTING.md](CONTRIBUTING.md) (em construção).

## 🔐 Licença

Proprietário: WellingtonADS

---

**Última atualização:** 2 de janeiro de 2026

**Total de Subrepos Independentes:** 5 (podium-backend-api, podium-web-admin, podium-web-corporate, podium-web-site, podium-mobile-driver)

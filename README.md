# Podium Monorepo

Este repositório monorepo agrega os projetos:

- `backend-api` (Python/FastAPI)
- `web-admin` (React/TS)
- `mobile-driver` (React Native/Expo)
- `docs-assets` (materiais de apoio)

## Requisitos

- Node.js 18+ (npm 8+)
- Python 3.11+ (para backend)
- Git 2.40+

## Instalação

```bash
# na raiz do monorepo
npm install
```

> Observação: a instalação do Python não é executada automaticamente para evitar conflitos de ambiente.

## Desenvolvimento

- Web: `npm run dev:web`
- Mobile (Expo): `npm run dev:mobile`
- API (FastAPI): `npm run dev:api` (usa venv se existir)
- Tudo junto: `npm run dev` (usa concurrently)

## Estrutura

```
backend-api/   # API Python (FastAPI)
web-admin/     # Admin web (React)
mobile-driver/ # App motorista (Expo)
docs-assets/   # Assets e docs
```

## Fluxo Git (subtrees)

Este monorepo agrega os históricos originais via `git subtree`:

- backend-api @ `release/v0.1.0`
- web-admin @ `release/v0.1.0`
- mobile-driver @ `release/v1.0.0`

### Atualizar um subtree (exemplo backend-api)

```bash
git fetch backend-api
# Mesclar mudanças externas para dentro do monorepo
git subtree pull --prefix=backend-api backend-api release/v0.1.0
```

### Enviar mudanças de volta (exemplo backend-api)

```bash
# Exportar mudanças do monorepo para o repositório de origem
git subtree push --prefix=backend-api backend-api release/v0.1.0
```

## CI/CD

Sugestão: configurar GitHub Actions com jobs independentes para `web-admin` (Node) e `backend-api` (Python) e uma verificação de typecheck para `mobile-driver`.

## Licença

Proprietário: WellingtonADS

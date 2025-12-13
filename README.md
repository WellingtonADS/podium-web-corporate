# Web Admin - Podium Serviços

Painel administrativo moderno desenvolvido com React + TypeScript para gerenciamento de serviços Podium.

**Versão:** 0.1.0

## 📋 Sobre o Projeto

Tecnologias principais:
- React 18.3
- TypeScript 5.9
- Chakra UI 2.8 (UI)
- Framer Motion 10.18 (animações)
- Axios (HTTP)
- React Router DOM (navegação)
- Jest + React Testing Library (testes)

## 🚀 Setup Rápido

### Pré-requisitos
- Node.js 18+
- npm ou yarn

### Instalação

```bash
git clone https://github.com/WellingtonADS/web-admin.git
cd web-admin
yarn install
```

### Desenvolvimento

```bash
yarn start
```
Abra http://localhost:3000.

### Build de Produção

```bash
yarn build
```

### Testes

```bash
yarn test
```

## 📂 Estrutura do Projeto

```
web-admin/
├── public/
├── src/
│   ├── contexts/
│   │   └── AuthContext.tsx        # Contexto de autenticação tipado
│   ├── services/
│   │   └── api.ts                 # Cliente HTTP axios com interceptor
│   ├── App.tsx                    # App com Chakra UI
│   ├── App.css
│   ├── index.tsx                  # Entrada (React 18 + TS)
│   ├── index.css
│   ├── App.test.js
│   ├── reportWebVitals.ts
│   └── setupTests.ts
├── package.json
├── tsconfig.json
└── README.md
```

## 🔐 Autenticação

- Contexto em `src/contexts/AuthContext.tsx` com tipos `User`, `LoginCredentials` e `AuthContextData`.
- Persistência de `@Podium:user` e `@Podium:token` via `localStorage`.
- Interceptor em `src/services/api.ts` injeta `Authorization: Bearer <token>` automaticamente.

Exemplo de uso:

```tsx
import { useAuth } from './contexts/AuthContext';

function LoginButton() {
	const { signIn, signed } = useAuth();
	// ...
}
```

## 🔗 Endpoints e Cliente HTTP

- Base URL: `http://localhost:8000/api/v1`
- `api.post('/login', formData)` com `Content-Type: application/x-www-form-urlencoded`.

## 📄 Licença

Propriedade de Podium Serviços

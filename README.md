# 🎛️ Podium Web Admin

Dashboard administrativo moderno para gerenciamento de motoristas, corridas e estatísticas da plataforma Podium Serviços.

## 📋 Descrição

O Podium Web Admin é o painel de controle da plataforma, responsável por:
- **Gerenciamento de motoristas** - Cadastro, ativação/desativação e acompanhamento
- **Visualização de corridas** - Histórico e status em tempo real
- **Estatísticas e relatórios** - Faturamento, desempenho e métricas
- **Autenticação segura** - Login com validação JWT
- **Interface responsiva** - Otimizada para desktop e tablet

## 🛠️ Tecnologias

| Tecnologia | Versão | Propósito |
|-----------|--------|----------|
| **React** | 18.3+ | UI Framework |
| **TypeScript** | 5.9+ | Type Safety |
| **Vite** | 5+ | Build tool |
| **Chakra UI** | 2.8+ | Design system |
| **Framer Motion** | 10.18+ | Animações |
| **Axios** | 1+ | HTTP client |
| **React Router** | 6+ | Navegação |
| **Jest** | 29+ | Testes unitários |
| **React Testing Library** | 14+ | Testes de componentes |

## 📁 Estrutura de Diretórios

```
podium-web-admin/
├── src/
│   ├── components/             # Componentes React
│   │   ├── Cards/              # Componentes de card
│   │   │   ├── StatCard.tsx    # Card de estatísticas
│   │   │   └── index.ts
│   │   ├── Tables/             # Componentes de tabela
│   │   │   ├── DriversTable.tsx # Tabela de motoristas
│   │   │   └── index.ts
│   │   └── UI/                 # Componentes reutilizáveis
│   │       ├── FormInput.tsx
│   │       ├── FormModal.tsx
│   │       └── index.ts
│   ├── contexts/               # Context API
│   │   └── AuthContext.tsx     # Contexto de autenticação
│   ├── hooks/                  # Custom hooks
│   │   └── useDashboard.ts     # Hook para dados do dashboard
│   ├── layouts/                # Layouts compartilhados
│   │   └── MainLayout.tsx      # Layout principal com sidebar
│   ├── pages/                  # Páginas da aplicação
│   │   ├── Login.tsx           # Página de login
│   │   ├── Dashboard.tsx       # Página inicial
│   │   └── Drivers.tsx         # Página de motoristas
│   ├── routes/                 # Configuração de rotas
│   │   └── PrivateRoute.tsx    # Proteção de rotas
│   ├── services/               # Integração com API
│   │   └── api.ts              # Cliente Axios
│   ├── theme/                  # Customização Chakra UI
│   │   └── index.ts
│   ├── App.tsx                 # Componente raiz
│   ├── index.tsx               # Ponto de entrada
│   └── index.css               # Estilos globais
├── public/                     # Assets estáticos
├── index.html                  # HTML template
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

## 🚀 Início Rápido

### Pré-requisitos
- Node.js 18+ (npm 9+)
- Git
- Backend API rodando (http://localhost:8000)

### Instalação

```bash
# 1. Clone o monorepo (se ainda não fez)
git clone https://github.com/WellingtonADS/podium-monorepo.git
cd podium-monorepo/podium-web-admin

# 2. Instale as dependências
npm install
# ou
yarn install
```

### Desenvolvimento

```bash
# Iniciar dev server (http://localhost:5173)
npm run dev
# ou
yarn dev

# Lint com ESLint
npm run lint

# Verificar tipos com TypeScript
npm run type-check

# Formatar código com Prettier
npm run format

# Verificar formatação sem modificar
npm run format:check
```

### Build para Produção

```bash
# Build otimizado
npm run build
# ou
yarn build

# Pré-visualizar build localmente
npm run preview
# ou
yarn preview
```

### Testes

```bash
# Executar testes
npm run test

# Executar testes em watch mode
npm run test:watch

# Gerar cobertura de testes
npm run test:coverage
```

## 📝 Scripts Disponíveis

| Script | Descrição |
|--------|-----------|
| `npm run dev` | Inicia dev server com hot reload |
| `npm run build` | Build otimizado para produção |
| `npm run preview` | Visualiza build localmente |
| `npm run lint` | Executa ESLint |
| `npm run type-check` | Verifica tipos TypeScript |
| `npm run format` | Formata código com Prettier |
| `npm run format:check` | Verifica formatação |
| `npm run test` | Executa testes |
| `npm run test:watch` | Testes em watch mode |
| `npm run test:coverage` | Relatório de cobertura |

## 🔐 Autenticação

O admin utiliza autenticação JWT com a API backend:

```typescript
// Exemplo: Login
const response = await api.post('/v1/auth/login', {
  email: 'admin@example.com',
  password: 'senha123'
});

// Token armazenado em localStorage
localStorage.setItem('token', response.data.access_token);
```

**Endpoints utilizados:**
- `POST /v1/auth/login` - Fazer login
- `POST /v1/auth/logout` - Fazer logout
- `GET /v1/users` - Listar usuários/motoristas
- `GET /v1/stats` - Obter estatísticas

## 🎨 Customização

### Tema
Os colors e estilos são definidos em `src/theme/index.ts`:

```typescript
const colors = {
  primary: '#1a365d',   // Azul Podium
  secondary: '#f6ad55', // Laranja destaque
  success: '#48bb78',   // Verde
  error: '#f56565',     // Vermelho
};
```

### Componentes
Utilize os componentes do Chakra UI e os componentes customizados:

```tsx
import { StatCard } from '@/components/Cards';
import { FormInput, FormModal } from '@/components/UI';

export function MyComponent() {
  return (
    <>
      <StatCard label="Motoristas" value={42} />
      <FormInput label="Email" type="email" />
      <FormModal title="Adicionar motorista" />
    </>
  );
}
```

## 📊 Context API & State

Use o AuthContext para gerenciar estado de autenticação:

```tsx
import { useContext } from 'react';
import { AuthContext } from '@/contexts/AuthContext';

export function MyComponent() {
  const { user, isAuthenticated, login } = useContext(AuthContext);

  if (!isAuthenticated) {
    return <div>Faça login para continuar</div>;
  }

  return <div>Bem-vindo, {user.name}!</div>;
}
```

## 🧪 Testes

Exemplo de teste de componente:

```tsx
// __tests__/components/StatCard.test.tsx
import { render, screen } from '@testing-library/react';
import { StatCard } from '@/components/Cards';

describe('StatCard', () => {
  it('renderiza label e valor', () => {
    render(<StatCard label="Motoristas" value={42} />);
    expect(screen.getByText('Motoristas')).toBeInTheDocument();
    expect(screen.getByText('42')).toBeInTheDocument();
  });
});
```

## 🔒 Variáveis de Ambiente

Crie um arquivo `.env.local`:

```env
VITE_API_URL=http://localhost:8000
VITE_APP_NAME=Podium Admin
```

Acesse no código:
```typescript
const apiUrl = import.meta.env.VITE_API_URL;
```

## 🔌 Integração com Backend

Certifique-se de que o `podium-backend-api` está rodando:

```bash
cd ../podium-backend-api
python -m uvicorn app.main:app --reload
```

Endpoints esperados:
- `http://localhost:8000/v1/auth/login`
- `http://localhost:8000/v1/users`
- `http://localhost:8000/v1/stats`

## 📱 Responsividade

O admin é otimizado para:
- 🖥️ Desktop (1024px+)
- 📱 Tablet (768px - 1024px)

Utilize as utilities do Chakra:
```tsx
<Box display={{ base: 'block', md: 'grid' }}>
  Mobile: block | Desktop: grid
</Box>
```

## 📚 Documentação Adicional

- [Chakra UI Docs](https://chakra-ui.com)
- [Vite Docs](https://vitejs.dev)
- [React Docs](https://react.dev)
- [TypeScript Docs](https://www.typescriptlang.org/docs)
- [React Router Docs](https://reactrouter.com)

## 🤝 Fluxo de Desenvolvimento

1. Crie uma branch: `git checkout -b feature/nova-feature`
2. Faça suas alterações
3. Commit com mensagem clara: `git commit -m "feat: adicionar nova feature"`
4. Push: `git push origin feature/nova-feature`
5. Abra um Pull Request no GitHub

## 📞 Suporte

Para dúvidas ou issues, abra uma issue no repositório principal:
- [podium-monorepo Issues](https://github.com/WellingtonADS/podium-monorepo/issues)

## 📄 Licença

Proprietário: WellingtonADS

---

**Versão:** 0.1.0  
**Última atualização:** 2 de janeiro de 2026

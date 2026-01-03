# 🏢 Podium Web Corporate

Portal B2B para empresas gerenciarem funcionários, centros de custo, solicitações de transporte e faturamento na plataforma Podium Serviços.

## 📋 Descrição

O Podium Web Corporate é a interface para empresas clientes, responsável por:
- **Gerenciamento de funcionários** - Cadastro, perfis e permissões
- **Centros de custo** - Organização e alocação de funcionários
- **Solicitação de corridas** - Integração com motoristas da plataforma
- **Faturamento** - Consulta de faturas e histórico de despesas
- **Dashboard financeiro** - Relatórios de gastos e análises
- **Autenticação corporativa** - Login por empresa com validação JWT

## 🛠️ Tecnologias

| Tecnologia | Versão | Propósito |
|-----------|--------|----------|
| **React** | 18+ | UI Framework |
| **TypeScript** | 5+ | Type Safety |
| **Vite** | 5+ | Build tool |
| **Material-UI (MUI)** | 5+ | Design system |
| **Axios** | 1+ | HTTP client |
| **React Router** | 6+ | Navegação |
| **React Query** | 3+ | Data fetching |

## 📁 Estrutura de Diretórios

```
podium-web-corporate/
├── src/
│   ├── components/             # Componentes React
│   │   ├── Cards/              # Componentes de card
│   │   │   ├── CostCenterCard.tsx # Card de centros de custo
│   │   │   ├── StatCard.tsx    # Card de estatísticas
│   │   │   └── index.ts
│   │   ├── Tables/             # Componentes de tabela
│   │   │   ├── EmployeesTable.tsx # Tabela de funcionários
│   │   │   └── index.ts
│   │   └── UI/                 # Componentes reutilizáveis
│   │       ├── FormInput.tsx
│   │       ├── FormModal.tsx
│   │       └── index.ts
│   ├── contexts/               # Context API
│   │   └── AuthContext.tsx     # Contexto de autenticação corporativa
│   ├── hooks/                  # Custom hooks
│   │   ├── useDashboard.ts     # Hook para dados do dashboard
│   │   └── useCorporateStats.ts # Hook para estatísticas
│   ├── layouts/                # Layouts compartilhados
│   │   └── MainLayout.tsx      # Layout principal
│   ├── pages/                  # Páginas da aplicação
│   │   ├── Login.tsx           # Página de login
│   │   ├── Dashboard.tsx       # Dashboard principal
│   │   ├── Employees.tsx       # Gerenciamento de funcionários
│   │   ├── CostCenters.tsx     # Gerenciamento de centros de custo
│   │   └── Billing.tsx         # Faturamento e faturas
│   ├── routes/                 # Configuração de rotas
│   │   └── PrivateRoute.tsx    # Proteção de rotas
│   ├── services/               # Integração com API
│   │   └── api.ts              # Cliente Axios
│   ├── theme/                  # Customização MUI
│   │   └── index.ts
│   ├── utils/                  # Funções utilitárias
│   │   └── index.ts
│   ├── App.tsx                 # Componente raiz
│   ├── main.tsx                # Ponto de entrada
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
cd podium-monorepo/podium-web-corporate

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

## 🔐 Autenticação

O portal utiliza autenticação JWT com a API backend:

```typescript
// Exemplo: Login corporativo
const response = await api.post('/v1/auth/login', {
  cnpj: '12.345.678/0001-00',
  email: 'contato@empresa.com',
  password: 'senha123'
});

// Token armazenado em localStorage
localStorage.setItem('token', response.data.access_token);
localStorage.setItem('company', JSON.stringify(response.data.company));
```

**Endpoints utilizados:**
- `POST /v1/auth/login` - Login corporativo
- `GET /v1/employees` - Listar funcionários
- `POST /v1/employees` - Criar funcionário
- `GET /v1/cost-centers` - Listar centros de custo
- `GET /v1/billing` - Consultar faturas
- `GET /v1/stats` - Estatísticas corporativas

## 📊 Funcionalidades Principais

### Dashboard
- Resumo de gastos do mês
- Número de funcionários ativos
- Corridas realizadas
- Gráficos de análise

### Gerenciamento de Funcionários
- Cadastro e edição
- Ativação/desativação
- Alocação a centros de custo
- Histórico de corridas

### Centros de Custo
- Criação e configuração
- Alocação de funcionários
- Análise de despesas por centro
- Relatórios

### Faturamento
- Consulta de faturas
- Download de documentos
- Histórico de pagamentos
- Análise de despesas

## 🎨 Customização

### Tema MUI
Os colors e estilos são definidos em `src/theme/index.ts`:

```typescript
const colors = {
  primary: '#1976d2',   // Azul padrão MUI
  secondary: '#dc004e', // Rosa
  success: '#4caf50',   // Verde
  error: '#f44336',     // Vermelho
};
```

### Componentes
Utilize os componentes do MUI e customizados:

```tsx
import { StatCard, CostCenterCard } from '@/components/Cards';
import { FormInput, FormModal } from '@/components/UI';
import { Box, Grid } from '@mui/material';

export function Dashboard() {
  return (
    <Grid container spacing={2}>
      <Grid item xs={12} sm={6} md={3}>
        <StatCard label="Gastos" value="R$ 10.000" />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <CostCenterCard name="TI" employees={15} />
      </Grid>
    </Grid>
  );
}
```

## 🧪 Testes

Exemplo de teste:

```tsx
// __tests__/components/StatCard.test.tsx
import { render, screen } from '@testing-library/react';
import { StatCard } from '@/components/Cards';

describe('StatCard', () => {
  it('renderiza label e valor', () => {
    render(<StatCard label="Gastos" value="R$ 10.000" />);
    expect(screen.getByText('Gastos')).toBeInTheDocument();
  });
});
```

## 🔒 Variáveis de Ambiente

Crie um arquivo `.env.local`:

```env
VITE_API_URL=http://localhost:8000
VITE_APP_NAME=Podium Corporate
```

## 📱 Responsividade

Otimizado para:
- 🖥️ Desktop (1024px+)
- 📱 Tablet (768px - 1024px)

Utilize as utilities do MUI:
```tsx
import { Box } from '@mui/material';

<Box sx={{ display: { xs: 'block', md: 'grid' } }}>
  Mobile: block | Desktop: grid
</Box>
```

## 🔌 Integração com Backend

Certifique-se de que o `podium-backend-api` está rodando:

```bash
cd ../podium-backend-api
python -m uvicorn app.main:app --reload
```

## 📚 Documentação Adicional

- [MUI Docs](https://mui.com)
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

**Última atualização:** 2 de janeiro de 2026
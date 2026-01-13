# Podium Web Corporate

Portal B2B para corporações gerenciarem e solictarem corridas ou agendar transporte para funcionários, criar e gerenciar funcionarios atribuindo cargos, criar e gerar centros de custo e seus relatório, relatório de fautamento faturamento no ecossistema Podium.

## 🚀 Stack Tecnológica

- **Frontend**: React 18.3 + TypeScript (strict mode)
- **Build Tool**: Vite 5.4
- **UI Library**: Chakra UI com tema customizado Podium
- **State Management**: TanStack Query para server state, Context API para autenticação
- **Routing**: React Router DOM v7 com proteção de rotas privadas

## 🎨 Identidade Visual

O projeto utiliza o tema Podium com as seguintes características:

- **Cores Principais**:
  - `midnight.900` - Background escuro
  - `gold.600` - Primária dourada
- **Tipografia**:
  - Montserrat - Headings
  - Inter - Body
- **Componentes**: Cards com hover gold glow e inputs com foco dourado

## 📋 Pré-requisitos

- Node.js 18+
- Yarn (gerenciador de pacotes preferido)

## 🔧 Instalação

```bash
# Instalar dependências
yarn install
```

## 💻 Desenvolvimento

```bash
# Servidor de desenvolvimento (localhost:5175)
yarn dev

# Verificação de lint com relatórios detalhados
yarn lint

# Verificação de formatação
yarn format:check
```

O servidor de desenvolvimento roda em `http://localhost:5175`

### Scripts de Lint

O comando de lint foi atualizado para incluir extensões específicas e opções de relatório melhorado, fornecendo feedback mais detalhado durante o desenvolvimento.

## 🏗️ Build

```bash
# Build de produção
yarn build
```

O build gera arquivos otimizados e inclui informações de tipo TypeScript para melhor integração com ferramentas de desenvolvimento.

## ⚙️ Variáveis de Ambiente

Configure as seguintes variáveis no arquivo `.env`:

```env
VITE_API_URL=http://localhost:8000  # URL da API backend
```

## 🔐 Autenticação

O sistema utiliza autenticação JWT com as seguintes características:

- Login via `x-www-form-urlencoded` (campo `username` recebe email)
- Token armazenado em `localStorage` com chave `@Podium:token`
- User data em `@Podium:user`
- Interceptor global adiciona `Authorization: Bearer` em todas as requisições

## 📁 Estrutura de Pastas

```
src/
├── components/       # Componentes reutilizáveis
│   ├── Cards/       # Cards de estatísticas e centros de custo
│   ├── Tables/      # Tabelas de dados
│   └── UI/          # Componentes base (FormInput, FormModal)
├── contexts/        # Context API (AuthContext)
├── hooks/           # Custom hooks para lógica de negócio
├── layouts/         # Layouts de página (MainLayout)
├── pages/           # Páginas da aplicação
├── routes/          # Configuração de rotas (PrivateRoute)
├── services/        # Integração com API
├── theme/           # Tema customizado Chakra UI
└── utils/           # Utilitários gerais
```

## 🛣️ Rotas Principais

- `/login` - Autenticação
- `/` - Dashboard com KPIs corporativos
- `/employees` - Gestão de funcionários
- `/cost-centers` - Gestão de centros de custo
- `/billing` - Faturamento e relatórios financeiros

## 🔌 Integração com Backend

A aplicação espera um backend FastAPI com os seguintes endpoints:

- `POST /api/v1/login` - Autenticação (form-urlencoded)
- `GET /api/v1/stats/corporate/dashboard` - Estatísticas do dashboard
- Endpoints corporativos prefixados com `/stats/corporate/`

## 📐 Padrões de Desenvolvimento

### Criação de Componentes

- Sempre exportar via barrel exports (`index.ts`)
- Seguir padrão de props com Chakra `ComponentProps` extension
- Componentes reutilizáveis em `src/components/{Cards|Tables|UI}/`

### Data Fetching

- Criar hooks customizados para lógica de API
- Sempre retornar trio `{ data, loading, error }`
- Preferir TanStack Query para cache e revalidation
- Fallback para dados mockados em `catch` durante dev

### Error Handling

```typescript
catch (err: any) {
  setError(err.response?.data?.detail || "Erro ao conectar");
  // Dados mockados como fallback
}
```

### Formatação de Dados

```typescript
// Moeda sempre em pt-BR
const formatCurrency = (value: number) =>
  new Intl.NumberFormat("pt-BR", { 
    style: "currency", 
    currency: "BRL" 
  }).format(value);
```

## 🧪 Convenções TypeScript

- Strict mode ativado
- Interfaces de API sempre em [src/services/api.ts](src/services/api.ts)
- Config herda de `../tsconfig.base.json` (monorepo)
- Build info de TypeScript gerada para otimização incremental

## 🔄 Histórico de Atualizações

### v1.1.0 - Refatoração Core
- ✨ Configuração aprimorada do Vite com geração de tipos
- ✨ Scripts de lint com opções de relatório melhoradas
- 📦 BuildInfo do TypeScript para builds incrementais mais eficientes
- 🔧 Melhor integração com ferramentas de desenvolvimento

## 📝 Licença

Propriedade da Podium Serviços.
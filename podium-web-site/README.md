# 🌐 Podium Web Site

Site institucional e landing page da plataforma Podium Serviços para captação de leads de transporte executivo premium.

## 📋 Descrição

O Podium Web Site é a porta de entrada da plataforma, responsável por:

- **Apresentação da marca** - Showcasing dos serviços de transporte executivo
- **Captação de leads** - Formulário de contato integrado com a API backend
- **Promoções e serviços** - Galeria de frotas e informações sobre tipos de transporte
- **Responsividade** - Design mobile-first otimizado para conversão

## 🛠️ Tecnologias

| Tecnologia       | Versão | Propósito                   |
| ---------------- | ------ | --------------------------- |
| **React**        | 18+    | UI Framework                |
| **TypeScript**   | 5+     | Type Safety                 |
| **Vite**         | 5+     | Build tool e dev server     |
| **Chakra UI**    | 2+     | Design system e componentes |
| **Axios**        | 1+     | HTTP client                 |
| **React Router** | 6+     | Navegação e routing         |

## 📁 Estrutura de Diretórios

```
podium-web-site/
├── src/
│   ├── api/                    # Integração com backend
│   │   ├── axios.ts            # Configuração Axios
│   │   └── leads.service.ts    # Serviço de leads
│   ├── components/             # Componentes React
│   │   ├── Landing/            # Componentes da página inicial
│   │   │   ├── Hero.tsx
│   │   │   ├── Services.tsx
│   │   │   ├── FleetGallery.tsx
│   │   │   ├── LeadForm.tsx
│   │   │   ├── PromoCarousel.tsx
│   │   │   └── index.ts
│   │   └── UI/                 # Componentes reutilizáveis
│   │       ├── FormInput.tsx
│   │       ├── PodiumButton.tsx
│   │       └── index.ts
│   ├── layouts/                # Layouts compartilhados
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   ├── Navbar.tsx
│   │   └── index.ts
│   ├── pages/                  # Páginas da aplicação
│   │   ├── Home.tsx            # Landing page
│   │   ├── News.tsx            # Notícias
│   │   └── ThankYou.tsx        # Página de confirmação
│   ├── theme/                  # Customização Chakra UI
│   │   └── index.ts
│   ├── utils/                  # Funções utilitárias
│   │   ├── masks.ts            # Máscaras de input
│   │   └── validation.ts       # Validações
│   ├── App.tsx                 # Componente raiz
│   ├── main.tsx                # Ponto de entrada
│   └── index.css               # Estilos globais
├── public/                     # Assets estáticos
│   └── images/                 # Imagens do site
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

### Instalação

```bash
# 1. Clone o monorepo (se ainda não fez)
git clone https://github.com/WellingtonADS/podium-monorepo.git
cd podium-monorepo/podium-web-site

# 2. Instale as dependências
npm install
```

### Desenvolvimento

```bash
# Iniciar dev server (http://localhost:5173)
npm run dev

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

# Pré-visualizar build localmente
npm run preview
```

## 📝 Scripts Disponíveis

| Script                 | Descrição                        |
| ---------------------- | -------------------------------- |
| `npm run dev`          | Inicia dev server com hot reload |
| `npm run build`        | Build otimizado para produção    |
| `npm run preview`      | Visualiza build localmente       |
| `npm run lint`         | Executa ESLint                   |
| `npm run type-check`   | Verifica tipos TypeScript        |
| `npm run format`       | Formata código com Prettier      |
| `npm run format:check` | Verifica formatação              |

## 🔌 Integração com Backend

O site se comunica com o `podium-backend-api` através de:

```typescript
// Exemplo: Enviar lead
const response = await api.post("/v1/leads", {
  name: "João Silva",
  email: "joao@example.com",
  phone: "11999999999",
  service: "sedan-executivo",
});
```

**Endpoints utilizados:**

- `POST /v1/leads` - Criar novo lead
- `GET /v1/pricing` - Obter preços/serviços

## 🎨 Customização

### Tema

Os cores e estilos são definidos em `src/theme/index.ts`:

```typescript
const colors = {
  primary: "#1a365d", // Azul Podium
  secondary: "#f6ad55", // Laranja destaque
};
```

### Componentes

Utilize os componentes do Chakra UI e os componentes customizados:

```tsx
import { PodiumButton, FormInput } from "@/components/UI";

export function MyComponent() {
  return (
    <>
      <FormInput label="Email" type="email" />
      <PodiumButton>Enviar</PodiumButton>
    </>
  );
}
```

## 📱 Responsividade

O site é otimizado para:

- 📱 Mobile (320px - 768px)
- 📱 Tablet (768px - 1024px)
- 🖥️ Desktop (1024px+)

Utilize as utilities do Chakra:

```tsx
<Box display={{ base: "block", md: "flex" }}>Mobile: block | Desktop: flex</Box>
```

## 🧪 Testes

Para adicionar testes, configure Jest:

```bash
npm install --save-dev jest @testing-library/react
```

```tsx
// __tests__/components/Hero.test.tsx
import { render, screen } from "@testing-library/react";
import { Hero } from "@/components/Landing/Hero";

describe("Hero", () => {
  it("renderiza heading", () => {
    render(<Hero />);
    expect(screen.getByRole("heading")).toBeInTheDocument();
  });
});
```

## 🔒 Variáveis de Ambiente

Crie um arquivo `.env.local`:

```env
VITE_API_URL=http://localhost:8000
VITE_APP_NAME=Podium
```

Acesse no código:

```typescript
const apiUrl = import.meta.env.VITE_API_URL;
```

## 📚 Documentação Adicional

- [Chakra UI Docs](https://chakra-ui.com)
- [Vite Docs](https://vitejs.dev)
- [React Docs](https://react.dev)
- [TypeScript Docs](https://www.typescriptlang.org/docs)

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

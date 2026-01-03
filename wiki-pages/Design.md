# Design

Documentação sobre os designs, wireframes e imagens utilizados no projeto Podium.

## Índice

1. [Introdução](#introdução)
2. [Imagens Catalogadas](#imagens-catalogadas)
3. [Estrutura de Componentes](#estrutura-de-componentes)
4. [Tema Visual](#tema-visual)
5. [Padrões de Design](#padrões-de-design)

---

## Introdução

Esta página documenta todos os designs, wireframes e imagens utilizados no projeto Podium. Os arquivos estão organizados na pasta `podium-docs-assets/design/` e catalogados no arquivo [design/indice-imagens.md](../podium-docs-assets/design/indice-imagens.md).

---

## Imagens Catalogadas

Consulte [design/indice-imagens.md](../podium-docs-assets/design/indice-imagens.md) para o catálogo completo de imagens.

As imagens incluem:

- Wireframes de telas mobile
- Mockups de interfaces web
- Designs de componentes
- Screenshots de protótipos
- Esboços de funcionalidades

---

## Estrutura de Componentes

### Web-Admin

Os componentes do Web-Admin seguem estrutura modular:

```
src/components/
├── Header/                  # Cabeçalho da aplicação
├── Sidebar/                 # Menu lateral
├── Dashboard/               # Dashboard e widgets
├── UserTable/               # Tabela de usuários
├── VehicleCard/             # Card de veículo
├── BookingForm/             # Formulário de reserva
├── ErrorBoundary/           # Tratamento de erros
└── Common/                  # Componentes reutilizáveis
    ├── Button
    ├── Modal
    ├── Toast
    └── Spinner
```

### Web-Corporate

Os componentes do Web-Corporate:

```
src/components/
├── Header/                  # Cabeçalho com menu
├── Navigation/              # Barra de navegação
├── VehicleGrid/             # Grid de veículos
├── BookingCalendar/         # Calendário de reservas
├── EmployeeDropdown/        # Dropdown de funcionários
├── CostCenterSelector/      # Seletor de centro de custo
└── Common/                  # Componentes reutilizáveis
```

### Mobile-Driver

Os componentes do Mobile-Driver:

```
src/components/
├── TripCard/                # Card de viagem
├── LocationMap/             # Mapa com localização
├── TripForm/                # Formulário de viagem
├── StatusIndicator/         # Indicador de status
└── Common/                  # Componentes reutilizáveis
```

---

## Tema Visual

### Paleta de Cores

#### Web-Admin e Web-Corporate

```
Primary: #2563EB (Azul)
Secondary: #64748B (Cinza-azulado)
Success: #10B981 (Verde)
Warning: #F59E0B (Âmbar)
Error: #EF4444 (Vermelho)
Background: #F8FAFC (Branco-azulado)
```

### Tipografia

- **Fonte Principal:** Inter, -apple-system, BlinkMacSystemFont
- **Tamanhos:** 12px (small), 14px (base), 16px (lg), 18px (xl), 24px (2xl)

### Espaçamento

- **Base:** 4px (0.25rem)
- **Escala:** 4px, 8px, 12px, 16px, 20px, 24px, 32px

---

## Padrões de Design

### Layout Responsivo

Todos os frontends implementam layouts responsivos:

```
Mobile: < 640px
Tablet: 640px - 1024px
Desktop: > 1024px
```

### Componentes Reutilizáveis

Cada projeto segue padrão de componentes:

```tsx
// Exemplo: Button Component
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({ ... }) => {
  // Implementação
};
```

### Ícones

Os projetos utilizam:

- **Web:** react-icons (FontAwesome, Feather)
- **Mobile:** react-native-vector-icons

### Estados de Componente

Todos os componentes interativos implementam estados:

- **Default:** Estado padrão do componente
- **Hover:** Ao passar mouse (desktop)
- **Active/Pressed:** Ao clicar/pressionar
- **Disabled:** Quando desabilitado
- **Loading:** Durante carregamento
- **Error:** Em caso de erro

---

## Acessibilidade

Os designs seguem diretrizes de acessibilidade:

- Contraste mínimo de 4.5:1 para texto
- Tamanho mínimo de texto: 14px
- Suporte a navegação por teclado
- Labels descritivos em campos de formulário
- Indicadores visuais para elementos interativos

---

## Próximos Passos

- Consulte [Arquitetura](Arquitetura) para entender a estrutura técnica
- Veja [Guia de Uso](Guia-de-Uso) para instruções operacionais
- Acesse [Subprojetos](Subprojetos) para detalhes de cada projeto

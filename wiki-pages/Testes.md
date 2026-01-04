# Testes

Documentação sobre testes na plataforma Podium.

## Índice

1. [Backend (Python)](#backend-python)
2. [Frontend (React)](#frontend-react)
3. [Mobile (React Native)](#mobile-react-native)
4. [E2E (End-to-End)](#e2e-end-to-end)

---

## Backend (Python)

### Framework: pytest

#### Executar Testes

```bash
cd podium-backend-api

# Rodar todos os testes
pytest

# Rodar com saída detalhada
pytest -v

# Rodar testes específicos
pytest tests/test_auth.py

# Rodar com cobertura
pytest --cov=app --cov-report=html

# Rodar em modo watch (reexecuta ao salvar)
pytest-watch
```

#### Estrutura de Testes

```
podium-backend-api/app/tests/
├── __init__.py
├── test_auth.py          # Testes de autenticação
├── test_users.py         # Testes de gerenciamento de usuários
├── test_vehicles.py      # Testes de gerenciamento de veículos
├── test_bookings.py      # Testes de reservas
├── test_stats.py         # Testes de estatísticas
└── conftest.py           # Configuração compartilhada
```

#### Exemplo de Teste

```python
import pytest
from app.services.user_service import create_user, get_user
from app.schemas import UserCreate

def test_create_user_success():
    """Teste: criar usuário com dados válidos."""
    user_data = UserCreate(
        email="test@example.com",
        password="senha123",
        full_name="João Silva"
    )

    user = create_user(user_data)

    assert user is not None
    assert user.email == "test@example.com"
    assert user.full_name == "João Silva"

def test_create_user_duplicate_email():
    """Teste: erro ao criar usuário com email duplicado."""
    user_data = UserCreate(
        email="existing@example.com",
        password="senha123",
        full_name="Novo Usuário"
    )

    with pytest.raises(ValueError):
        create_user(user_data)
```

#### Fixtures Úteis

```python
# conftest.py
import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.database import Base

@pytest.fixture
def db():
    """Fixture: banco de dados de teste."""
    engine = create_engine("sqlite:///:memory:")
    Base.metadata.create_all(engine)
    SessionLocal = sessionmaker(bind=engine)
    db = SessionLocal()
    yield db
    db.close()

@pytest.fixture
def user_data():
    """Fixture: dados de usuário para testes."""
    return {
        "email": "test@example.com",
        "password": "senha123",
        "full_name": "Teste User"
    }
```

---

## Frontend (React)

### Framework: Jest + React Testing Library

#### Executar Testes

```bash
cd podium-web-admin
# ou
cd podium-web-corporate

# Rodar todos os testes
yarn test

# Rodar com modo watch
yarn test:watch

# Rodar com cobertura
yarn test:coverage

# Rodar testes específicos
yarn test UserCard
```

#### Estrutura de Testes

```
src/
├── components/
│   ├── Button/
│   │   ├── Button.tsx
│   │   └── Button.test.tsx
│   ├── Modal/
│   │   ├── Modal.tsx
│   │   └── Modal.test.tsx
│   └── ...
├── pages/
│   ├── Dashboard/
│   │   ├── Dashboard.tsx
│   │   └── Dashboard.test.tsx
│   └── ...
└── services/
    ├── api.ts
    └── api.test.ts
```

#### Exemplo de Teste

```typescript
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Button } from "./Button";

describe("Button Component", () => {
  it("should render button with text", () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText("Click me")).toBeInTheDocument();
  });

  it("should call onClick handler when clicked", () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);

    fireEvent.click(screen.getByText("Click me"));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("should be disabled when disabled prop is true", () => {
    render(<Button disabled>Click me</Button>);
    expect(screen.getByText("Click me")).toBeDisabled();
  });
});
```

#### Testando API

```typescript
import { render, screen, waitFor } from "@testing-library/react";
import axios from "axios";
import { UserList } from "./UserList";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("UserList Component", () => {
  it("should render users fetched from API", async () => {
    mockedAxios.get.mockResolvedValue({
      data: [
        { id: 1, name: "João" },
        { id: 2, name: "Maria" },
      ],
    });

    render(<UserList />);

    await waitFor(() => {
      expect(screen.getByText("João")).toBeInTheDocument();
      expect(screen.getByText("Maria")).toBeInTheDocument();
    });
  });

  it("should show error when API fails", async () => {
    mockedAxios.get.mockRejectedValue(new Error("API Error"));

    render(<UserList />);

    await waitFor(() => {
      expect(screen.getByText(/erro ao carregar/i)).toBeInTheDocument();
    });
  });
});
```

#### Testando Contextos

```typescript
import { render, screen } from "@testing-library/react";
import { AuthProvider, useAuth } from "./AuthContext";

const TestComponent = () => {
  const { user } = useAuth();
  return <div>{user?.email}</div>;
};

describe("AuthContext", () => {
  it("should provide user data", () => {
    const mockUser = { id: 1, email: "test@example.com" };

    render(
      <AuthProvider initialUser={mockUser}>
        <TestComponent />
      </AuthProvider>
    );

    expect(screen.getByText("test@example.com")).toBeInTheDocument();
  });
});
```

---

## Mobile (React Native)

### Framework: Jest + React Native Testing Library

#### Executar Testes

```bash
cd podium-mobile-driver

# Rodar todos os testes
yarn test

# Rodar com modo watch
yarn test:watch

# Rodar com cobertura
yarn test:coverage
```

#### Estrutura de Testes

```
src/
├── components/
│   ├── TripCard/
│   │   ├── TripCard.tsx
│   │   └── TripCard.test.tsx
│   └── ...
├── screens/
│   ├── HomeScreen/
│   │   ├── HomeScreen.tsx
│   │   └── HomeScreen.test.tsx
│   └── ...
└── services/
    ├── api.ts
    └── api.test.ts
```

#### Exemplo de Teste

```typescript
import { render } from "@testing-library/react-native";
import { TripCard } from "./TripCard";

describe("TripCard Component", () => {
  it("should render trip information", () => {
    const trip = {
      id: 1,
      passenger: "João Silva",
      origin: "Avenida Paulista",
      destination: "Centro",
      status: "pending",
    };

    const { getByText } = render(<TripCard trip={trip} />);

    expect(getByText("João Silva")).toBeTruthy();
    expect(getByText("Avenida Paulista")).toBeTruthy();
    expect(getByText("Centro")).toBeTruthy();
  });
});
```

---

## E2E (End-to-End)

### Framework: Playwright

#### Configuração

```bash
cd podium-monorepo

# Instalar Playwright
npm install -D @playwright/test

# Instalar navegadores
npx playwright install
```

#### Executar Testes E2E

```bash
# Rodar todos os testes
npx playwright test

# Rodar com modo UI
npx playwright test --ui

# Rodar testes específicos
npx playwright test login

# Rodar em navegador específico
npx playwright test --project=chromium
```

#### Estrutura de Testes

```
tests/e2e/
├── auth.spec.ts           # Testes de autenticação
├── vehicles.spec.ts       # Testes de veículos
├── bookings.spec.ts       # Testes de reservas
└── fixtures.ts            # Fixtures e setup
```

#### Exemplo de Teste E2E

```typescript
import { test, expect } from "@playwright/test";

test.describe("Login Flow", () => {
  test("should login successfully with valid credentials", async ({ page }) => {
    // Navegar para página de login
    await page.goto("http://localhost:5173/login");

    // Preencher formulário
    await page.fill('input[type="email"]', "user@example.com");
    await page.fill('input[type="password"]', "password123");

    // Submeter formulário
    await page.click('button[type="submit"]');

    // Verificar redirecionamento
    await expect(page).toHaveURL("http://localhost:5173/dashboard");

    // Verificar se usuário está logado
    await expect(page.locator("text=Bem-vindo")).toBeVisible();
  });

  test("should show error with invalid credentials", async ({ page }) => {
    await page.goto("http://localhost:5173/login");

    await page.fill('input[type="email"]', "invalid@example.com");
    await page.fill('input[type="password"]', "wrongpassword");
    await page.click('button[type="submit"]');

    // Verificar mensagem de erro
    await expect(page.locator("text=Credenciais inválidas")).toBeVisible();
  });
});
```

---

## Cobertura de Testes

### Metas de Cobertura

- **Backend:** 80% minimum
- **Frontend:** 70% minimum
- **Crítico:** 100% para autenticação e pagamentos

### Gerar Relatório de Cobertura

```bash
# Backend
cd podium-backend-api
pytest --cov=app --cov-report=html
# Abrir htmlcov/index.html

# Frontend
cd podium-web-admin
yarn test:coverage
# Abrir coverage/index.html
```

---

## Boas Práticas

### 1. Nomear Testes Descritivamente

```typescript
// ✅ Bom
it("should display error message when email is invalid", () => {});

// ❌ Ruim
it("test email validation", () => {});
```

### 2. Testar Comportamento, Não Implementação

```typescript
// ✅ Bom - testa comportamento
fireEvent.click(getByRole("button", { name: /submit/i }));
expect(onSubmit).toHaveBeenCalled();

// ❌ Ruim - testa implementação
expect(form.handleSubmit).toHaveBeenCalled();
```

### 3. Usar Dados Realistas

```typescript
// ✅ Bom
const user = {
  id: 1,
  email: "user@example.com",
  fullName: "João Silva",
  createdAt: new Date(),
};

// ❌ Ruim
const user = { a: 1, b: "x", c: "y", d: Date.now() };
```

### 4. Agrupar Testes Relacionados

```typescript
describe("VehicleService", () => {
  describe("getVehicles", () => {
    it("should return all vehicles", () => {});
    it("should filter by status", () => {});
  });

  describe("createVehicle", () => {
    it("should create new vehicle", () => {});
    it("should validate data", () => {});
  });
});
```

---

## Integração Contínua

Os testes rodam automaticamente via GitHub Actions:

- **Backend:** `backend-api-ci.yml`
- **Frontend:** `web-admin-ci.yml`
- **Mobile:** `mobile-driver-typecheck.yml`
- **Documentação:** `validate-docs.yml`

---

## Próximos Passos

- Consulte [Contribuindo](Contribuindo) para diretrizes de desenvolvimento
- Veja [API](API) para documentação de endpoints
- Acesse [FAQ](FAQ) para perguntas frequentes

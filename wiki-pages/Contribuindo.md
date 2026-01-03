# Contribuindo

Diretrizes para contribuir ao projeto Podium.

## Código de Conduta

Esperamos que todos os contribuidores sigam nosso código de conduta:

- Ser respeitoso e inclusivo
- Aceitar críticas construtivas
- Focar no que é melhor para a comunidade
- Relatar comportamento inadequado aos mantenedores

---

## Processo de Contribuição

### 1. Fork e Clone

```bash
# Fazer fork do repositório no GitHub
# Clonar seu fork
git clone https://github.com/SEU_USERNAME/podium-monorepo.git
cd podium-monorepo

# Adicionar upstream
git remote add upstream https://github.com/WellingtonADS/podium-monorepo.git
```

### 2. Criar Branch

```bash
# Atualizar branch main
git checkout main
git pull upstream main

# Criar nova branch para sua feature
git checkout -b feature/sua-feature
# ou para bugfix
git checkout -b fix/seu-bugfix
```

### 3. Fazer Alterações

Faça suas alterações no código, seguindo os padrões do projeto:

- Python: PEP 8
- TypeScript: ESLint config do projeto
- Commit messages: Convenção Commitizen

### 4. Testar

Certifique-se de testar suas alterações:

```bash
# Backend
cd podium-backend-api
pytest

# Frontend
cd podium-web-admin
yarn test
```

### 5. Commit

```bash
# Commit com mensagem descritiva
git commit -m "feat: adicionar nova funcionalidade"

# Ou use commitizen para commit interativo
npx cz commit
```

### 6. Push e Pull Request

```bash
# Push para seu fork
git push origin feature/sua-feature

# Criar Pull Request no GitHub
# Descrever claramente:
# - O que foi alterado
# - Por quê
# - Como testar
```

---

## Padrões de Código

### Python (Backend)

```python
# Estilo PEP 8
# - Indentação: 4 espaços
# - Linhas: máximo 100 caracteres
# - Nomes: snake_case para funções/variáveis

from typing import List
from app.models import User

def get_active_users() -> List[User]:
    """Obter usuários ativos."""
    return User.query.filter_by(is_active=True).all()
```

### TypeScript (Frontend)

```typescript
// Usar interfaces para type safety
interface VehicleProps {
  id: number;
  model: string;
  status: "available" | "unavailable";
}

// Usar const/let, não var
const handleClick = (id: number): void => {
  console.log(`Clicou em ${id}`);
};

// Usar arrow functions para callbacks
const vehicles = [].map((v: VehicleProps) => ({
  ...v,
  available: v.status === "available",
}));
```

### Convenção de Commits

```
feat: adicionar nova funcionalidade
fix: corrigir bug
docs: atualizar documentação
style: alterar formatação (sem alterar lógica)
refactor: refatorar código
test: adicionar ou atualizar testes
chore: atualizar dependências ou configuração
```

Exemplo:

```bash
git commit -m "feat: integração com web-corporate e backend"
git commit -m "fix: corrigir erro de autenticação JWT"
git commit -m "docs: atualizar README com instruções de setup"
```

---

## Padrões de Projeto

### Estrutura de Diretórios

```
src/
├── components/          # Componentes reutilizáveis
├── contexts/            # Contextos React
├── hooks/               # Custom hooks
├── pages/               # Páginas/Rotas
├── services/            # Serviços de API
├── types/               # TypeScript types/interfaces
└── utils/               # Funções utilitárias
```

### Nomeação de Componentes

```typescript
// PascalCase para componentes
export const UserCard: React.FC<Props> = ({ ... }) => {};

// camelCase para funções
export const useUserData = () => {};

// UPPER_SNAKE_CASE para constantes
export const API_TIMEOUT = 30000;
```

### Estrutura de Tipo

```typescript
// Agrupar tipos relacionados em um arquivo
// types/index.ts
export interface User {
  id: number;
  email: string;
  full_name: string;
}

export interface Vehicle {
  id: number;
  plate: string;
  model: string;
}

// Usar em componentes
import { User, Vehicle } from "../types";
```

---

## Testing

### Backend (Python)

```bash
# Rodar todos os testes
pytest

# Rodar testes com cobertura
pytest --cov=app --cov-report=html

# Rodar testes específicos
pytest tests/test_auth.py
```

Estrutura de testes:

```python
import pytest
from app.services.user_service import get_user

def test_get_user_success():
    """Teste de sucesso ao obter usuário."""
    user = get_user(user_id=1)
    assert user is not None
    assert user.id == 1
```

### Frontend (TypeScript)

```bash
# Rodar testes
yarn test

# Rodar com cobertura
yarn test:coverage

# Watch mode
yarn test:watch
```

Estrutura de testes:

```typescript
import { render, screen } from "@testing-library/react";
import { UserCard } from "./UserCard";

describe("UserCard", () => {
  it("should render user name", () => {
    const user = { id: 1, name: "João" };
    render(<UserCard user={user} />);
    expect(screen.getByText("João")).toBeInTheDocument();
  });
});
```

---

## Pull Request Checklist

Antes de submeter seu PR, confirme que:

- [ ] Código segue padrões do projeto
- [ ] Testes passam e nova cobertura foi adicionada se necessário
- [ ] Documentação foi atualizada se necessário
- [ ] Commits estão bem estruturados e com mensagens descritivas
- [ ] Não há conflitos com a branch main
- [ ] Alterações foram testadas localmente

---

## Reportando Bugs

Se encontrar um bug, abra uma issue com:

1. **Título:** Descrição clara e concisa
2. **Descrição:** Contexto detalhado
3. **Passos para Reproduzir:** Instruções passo-a-passo
4. **Comportamento Esperado:** O que deveria acontecer
5. **Comportamento Atual:** O que está acontecendo
6. **Ambiente:** Node/Python version, OS, etc

Exemplo:

```
Título: Login falha com email contendo caracteres especiais

Descrição:
Ao tentar fazer login com email contendo pontos (ex: joao.silva@example.com),
a autenticação falha mesmo com senha correta.

Passos para Reproduzir:
1. Ir para página de login
2. Inserir email: test.user@example.com
3. Inserir senha válida
4. Clicar em Login

Comportamento Esperado:
Login realizado com sucesso

Comportamento Atual:
Erro: Email inválido

Ambiente:
- Node 18.12.0
- Windows 11
```

---

## Sugestões de Funcionalidades

Sua sugestão é bem-vinda! Abra uma issue com o label `enhancement` descrevendo:

1. **Problema:** Qual problema isso resolve?
2. **Solução Proposta:** Sua ideia de solução
3. **Alternativas Consideradas:** Outras abordagens
4. **Contexto Adicional:** Informações relevantes

---

## Dúvidas?

- Abra uma discussion no GitHub
- Contate os mantenedores
- Consulte a documentação do projeto

---

## Reconhecimento

Contribuições são reconhecidas no arquivo [CONTRIBUTORS.md](CONTRIBUTORS.md).

Obrigado por contribuir ao Podium!

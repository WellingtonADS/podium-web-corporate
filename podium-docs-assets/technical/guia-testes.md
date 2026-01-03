# 🧪 Guia de Testes: Validação da Integração Web-Corporate

## 🎯 Objetivo

Validar que a integração entre `podium-web-corporate` (frontend) e `podium-backend-api` (backend) está funcionando
corretamente após a refatoração.

---

## 📋 Pré-Requisitos

### Backend

```bash

# 1. Certifique-se que o backend está rodando

cd podium-backend-api
python -m venv venv
source venv/bin/activate  # ou venv\Scripts\activate no Windows
pip install -r requirements.txt
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

```bash

Deve estar disponível em: `<http://localhost:8000>`

## Frontend

```bash

# 2. Certifique-se que o frontend está rodando

cd podium-web-corporate
npm install
npm run dev

```bash

Deve estar disponível em: `<http://localhost:5173>`

---

## ✅ Teste 1: Validação de Tipos (TypeScript)

### Passo 1: Compilar TypeScript

```bash
cd podium-web-corporate
npx tsc --noEmit

```bash

#### Resultado Esperado

- ✅ Sem erros de compilação
- ✅ Sem warnings sobre tipos desconhecidos
- ✅ Todos os imports resolvem

#### Se falhar

```bash

Verifique:
- [ ] `src/types/index.ts` existe?
- [ ] `src/services/corporate.ts` existe?
- [ ] Imports estão corretos (sem caminhos relativos errados)?

```bash

---

## ✅ Teste 2: Validação de Imports

### Passo 2: Verificar Imports em Runtime

Abra o console do navegador (F12) em `<http://localhost:5173>`:

```javascript
// Cole no console:
import { CorporateService } from "/src/services/corporate.ts";
console.log(Object.keys(CorporateService));

```bash

#### Resultado Esperado

```bash
[
  'getCostCenters',
  'getCostCenter',
  'createCostCenter',
  'updateCostCenter',
  'deleteCostCenter',
  'getEmployees',
  'getEmployee',
  'createEmployee',
  'updateEmployee',
  'deleteEmployee',
  'getCorporateDashboard',
  'getCurrentUser'
]

```bash

#### Se falhar

- [ ] Verificar se arquivo `src/services/corporate.ts` foi criado
- [ ] Verificar se exports estão corretos
- [ ] Verificar imports dentro do arquivo

---

## ✅ Teste 3: Validação de Endpoints Backend

### Passo 3: Acessar Swagger UI

Acesse: `<http://localhost:8000/docs>`

#### Teste 3.1: Endpoint `/stats/corporate/dashboard`

```bash
GET /api/v1/stats/corporate/dashboard

```json

#### Passos

1. Clique no endpoint
1. Clique em "Try it out"
1. Clique em "Execute"

#### Resultado Esperado

- ✅ Status 200
- ✅ Response JSON com estrutura:

```json
{
  "monthly_consumption": 12500.50,
  "active_employees": 45,
  "rides_completed": 128,
  "remaining_budget": 37499.50
}

```bash

#### Se falhar com 401/403

- [ ] Adicione Bearer token no header Authorization

#### Teste 3.2: Endpoint `/corporate/cost-centers`

```json

GET /api/v1/corporate/cost-centers

```json

#### Resultado Esperado

- ✅ Status 200
- ✅ Response array de CostCenter:

```json
[
  {
    "id": 1,
    "name": "Marketing",
    "code": "MKT-001",
    "budget_limit": 10000,
    "current_spent": 4500,
    "is_active": true,
    "company_id": 1
  }
]

```bash

#### Teste 3.3: Endpoint `/corporate/employees` (via /users?role=employee)

```bash
GET /api/v1/users?role=employee

```bash

#### Resultado Esperado

- ✅ Status 200
- ✅ Response array de User (employees)

---

## ✅ Teste 4: Fluxo de Login

### Passo 4: Fazer Login no Frontend

1. Acesse `http://localhost:5173`
1. Vá para página de login
1. Digite credenciais de teste:

```bash

   Email: <a<dmin@podium.co>m>
   Senha: (confira no banco)

   ```bash

#### Verificações

- [ ] Login bem-sucedido (sem erros no console)
- [ ] Token armazenado em localStorage

  ```javascript
  // No console:
  localStorage.getItem('@Podium:token')

```bash

  Deve retornar um JWT válido

#### Se falhar

- [ ] Verificar se endpoint `/login` existe no backend
- [ ] Verificar se endpoint `/users/me` existe
- [ ] Verificar se AuthContext está buscando dados reais

---

## ✅ Teste 5: Página de Centros de Custo

### Passo 5: Navegar para Centros de Custo

1. Faça login
1. Clique em "Centros de Custo" na sidebar
1. Aguarde carregamento

#### Verificações

- [ ] Página carrega sem erro
- [ ] Lista de CCs aparece (se existirem)
- [ ] Cada CC mostra: Nome, Código, Orçamento, Gasto
- [ ] Botão "+ Novo Centro de Custo" funciona

#### No Console do Navegador

```javascript
// Verifique que está fazendo a chamada correta:
// Deve ver: GET /api/v1/corporate/cost-centers

```bash

#### Se vir erro

```json
❌ ERRO: "Mock data que tinha aqui..."

```json

Significa que o catch block ainda está lá. Verifique se refactoring foi feito corretamente.

---

## ✅ Teste 6: Criar Novo Centro de Custo

### Passo 6: Testar Criação de CC

1. Na página Centros de Custo
1. Clique em "+ Novo Centro de Custo"
1. Preencha o formulário:

   ```bash
   Nome: Test CC
   Código: TST-001
   Orçamento: 5000

   ```json

1. Clique em "Criar"

#### Verificações

- [ ] Modal desaparece
- [ ] Toast "✅ Centro de Custo criado!" aparece
- [ ] Nova lista carrega com o CC criado
- [ ] No Network tab: POST /api/v1/corporate/cost-centers

#### Se falhar

```json

❌ "Erro ao criar centro de custo"

```bash

- [ ] Verifique autorização (token válido?)
- [ ] Verifique campos obrigatórios preenchidos
- [ ] Check backend logs para erro específico

---

## ✅ Teste 7: Página de Funcionários

### Passo 7: Navegar para Funcionários

1. Clique em "Funcionários" na sidebar
1. Aguarde carregamento

#### Verificações

- [ ] Página carrega sem erro
- [ ] Lista de funcionários aparece
- [ ] Dropdown "Centro de Custo" mostra opções **da API** (não hardcoded!)
  - Verificar que contém CCs reais criados anteriormente
- [ ] Botão "+ Novo Funcionário" funciona

#### No Console do Navegador

```javascript
// Verifique que está fazendo 2 chamadas em paralelo:
// GET /api/v1/users?role=employee
// GET /api/v1/corporate/cost-centers

```json

#### Se vir erro ou mock data

```json
❌ ERRO: "João Silva, Maria Santos"

```bash

Significa que mock data ainda está no catch block.

---

## ✅ Teste 8: Criar Novo Funcionário

### Passo 8: Testar Criação de Funcionário

1. Na página Funcionários
1. Clique em "+ Novo Funcionário"
1. Preencha o formulário:

   ```bash
   Nome: João da Silva
   Email: <joao@empresa.com>
   Senha: Senha123!
   Departamento: Marketing
   Centro de Custo: (selecione um da lista)

```json

1. Clique em "Salvar Funcionário"

#### Verificações

- [ ] Modal desaparece
- [ ] Toast "✅ Funcionário cadastrado!" aparece
- [ ] Lista recarrega com novo funcionário
- [ ] No Network tab: POST /api/v1/corporate/employees

#### Se dropdown não carregar CCs

- [ ] Promise.all() não está executando corretamente
- [ ] Verifique CorporateService.getCostCenters()
- [ ] Verifique se try/catch está correto

---

## ✅ Teste 9: Dashboard

### Passo 9: Validar Dashboard

1. Clique em "Dashboard" na sidebar
1. Aguarde carregamento

#### Verificações

- [ ] Página carrega sem erro
- [ ] StatCard mostra valores reais (não "0" ou mock)
- [ ] Valores fazem sentido:
  - Consumo mensal deve ser > 0 se houve corridas
  - Funcionários ativos deve corresponder à contagem
  - Orçamento restante deve ser Orçamento Total - Consumo

#### No Console do Navegador

```javascript
// Verifique que está buscando dados reais:
// GET /api/v1/stats/corporate/dashboard

```json

#### Se vir mock data

```json
{
  "monthly_consumption": 12500,
  "active_employees": 45,
  "rides_completed": 128,
  "remaining_budget": 37500
}

```bash

Significa que o endpoint está retornando fallback. Verifique hook useDashboard.

---

## ✅ Teste 10: Verificação de Soberania

### Passo 10: Testar Isolamento de Empresa

**Cenário:** Dois usuários de empresas diferentes não devem ver dados um do outro.

#### Como testar

1. Login como usuário da Empresa A
1. Verifique CCs e Funcionários listados
1. Logout
1. Login como usuário da Empresa B
1. Verifique que vê dados **diferentes**

#### Verificações

- [ ] Cada usuário vê apenas seus dados
- [ ] Backend filtra corretamente por company_id
- [ ] Nenhum "vazamento" de dados entre empresas

#### Se falhar

- [ ] Backend não está validando company_id corretamente
- [ ] User context não está armazenando company_id
- [ ] Verifique `require_role()` no backend

---

## 🐛 Debugging: Network Tab

Abra Developer Tools (F12) → Network Tab

### Esperado para Employees.tsx

```bash
GET /api/v1/users?role=employee        [200] ~50ms
GET /api/v1/corporate/cost-centers     [200] ~50ms
POST /api/v1/corporate/employees       [201] ~100ms (on create)

```bash

### Esperado para CostCenters.tsx

```bash
GET /api/v1/corporate/cost-centers     [200] ~50ms
POST /api/v1/corporate/cost-centers    [201] ~100ms (on create)

```bash

### Esperado para Dashboard.tsx

```bash
GET /api/v1/stats/corporate/dashboard  [200] ~100ms

```bash

---

## 🐛 Debugging: Console Browser

Se ver erros como:

```bash
TypeError: Cannot read property 'getEmployees' of undefined

```json

### Solução

```javascript
// No console, verifique:
import { CorporateService } from "/src/services/corporate.ts";
CorporateService.getEmployees()
  .then(data => console.log(data))
  .catch(err => console.error(err))

```bash

---

## 📊 Resultado Esperado Final

| Teste | Status | Evidência |
| --- | --- | --- |
| TypeScript compila | ✅ | `npx tsc --noEmit` retorna 0 |
| Imports resolvem | ✅ | CorporateService tem 12 métodos |
| Backend inicia | ✅ | Swagger em /docs |
| Endpoints existem | ✅ | /stats/corporate/dashboard retorna 200 |
| Login funciona | ✅ | Token em localStorage |
| CCs carregam | ✅ | Sem mock data, dados reais da API |
| Criar CC funciona | ✅ | Toast sucesso, lista atualiza |
| Employees carregam | ✅ | CCs dinâmicos no dropdown |
| Criar Employee funciona | ✅ | Toast sucesso, lista atualiza |
| Dashboard carrega | ✅ | Stats reais, sem fallback |
| Soberania funciona | ✅ | Dados isolados por empresa |

---

## ✅ Se Tudo Passar

### Parabéns! Integração está 100% funcional

Próximos passos:

1. [ ] Code review com time
1. [ ] Testes E2E (Cypress/Playwright)
1. [ ] Deploy em staging
1. [ ] Testes de performance
1. [ ] Deploy em produção

---

## ❌ Se Algo Falhar

1. Verifique o console do navegador (F12)
1. Verifique os logs do backend
1. Verifique Network tab para ver requisições
1. Consulte INTEGRATION_SUMMARY.md para detalhes
1. Verifique se todos os arquivos foram criados/modificados

---

**Data:** 2024
**Versão:** 1.0
**Status:** Pronto para Testes


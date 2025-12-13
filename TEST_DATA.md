# Dados de Teste - v0.1.0

**Data de criação:** 13 de dezembro de 2025  
**Script:** `app/scripts/seed_data.py`  
**Senha padrão:** `teste123`

---

## 📊 Dados Criados

### 🏢 Empresa

| Campo | Valor |
|-------|-------|
| **ID** | 1 |
| **Nome** | Podium Serviços |
| **CNPJ** | 12.345.678/0001-99 |
| **Status** | active |

---

### 🏷️ Centro de Custo

| Campo | Valor |
|-------|-------|
| **ID** | 1 |
| **Nome** | Operações |
| **Código** | CC-001 |
| **Empresa** | Podium Serviços (ID: 1) |

---

## 👥 Usuários

### 👨‍💼 Admin

| Campo | Valor |
|-------|-------|
| **ID** | 2 |
| **Email** | `admin@podium.com` |
| **Senha** | `Admin123!` |
| **Nome** | Admin |
| **Role** | admin |
| **Status** | ativo |

**Permissões:**
- ✅ Criar motoristas
- ✅ Criar funcionários
- ✅ Criar outros admins

---

### 🚗 Motoristas

#### Motorista 1

| Campo | Valor |
|-------|-------|
| **ID** | 3 |
| **Email** | `driver1@podium.com` |
| **Senha** | `teste123` |
| **Nome** | Motorista 1 |
| **Role** | driver |
| **Modelo Veículo** | Sedan |
| **Placa** | ABC1D23 |
| **CNH** | 12345678900 |
| **Rating** | 5.0 ⭐ |
| **Status** | ativo |

#### Motorista 2

| Campo | Valor |
|-------|-------|
| **ID** | 4 |
| **Email** | `driver2@podium.com` |
| **Senha** | `teste123` |
| **Nome** | Motorista 2 |
| **Role** | driver |
| **Modelo Veículo** | SUV |
| **Placa** | XYZ9K87 |
| **CNH** | 98765432100 |
| **Rating** | 5.0 ⭐ |
| **Status** | ativo |

---

### 👨‍💼 Funcionários

#### Funcionário 1 - Gerência

| Campo | Valor |
|-------|-------|
| **ID** | 5 |
| **Email** | `employee1@podium.com` |
| **Senha** | `teste123` |
| **Nome** | Funcionário 1 |
| **Role** | employee |
| **Empresa** | Podium Serviços (ID: 1) |
| **Departamento** | Gerência |
| **Status** | ativo |

#### Funcionário 2 - Operações

| Campo | Valor |
|-------|-------|
| **ID** | 6 |
| **Email** | `employee2@podium.com` |
| **Senha** | `teste123` |
| **Nome** | Funcionário 2 |
| **Role** | employee |
| **Empresa** | Podium Serviços (ID: 1) |
| **Departamento** | Operações |
| **Status** | ativo |

#### Funcionário 3 - RH

| Campo | Valor |
|-------|-------|
| **ID** | 7 |
| **Email** | `employee3@podium.com` |
| **Senha** | `teste123` |
| **Nome** | Funcionário 3 |
| **Role** | employee |
| **Empresa** | Podium Serviços (ID: 1) |
| **Departamento** | RH |
| **Status** | ativo |

---

## 🔐 Como Fazer Login

### 1. Via Swagger UI (Recomendado)

Acesse: `http://127.0.0.1:8000/docs`

1. Clique em **"Authorize"** (ícone de cadeado)
2. Selecione **"OAuth2PasswordBearer"**
3. Execute a rota **`POST /api/v1/login`**
4. Preencha:
   - `username`: seu email
   - `password`: sua senha
5. Copie o `access_token` gerado

### 2. Via cURL

```bash
curl -X POST "http://127.0.0.1:8000/api/v1/login" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "username=admin@podium.com&password=Admin123!"
```

**Resposta esperada:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer"
}
```

### 3. Via Python requests

```python
import requests

response = requests.post(
    "http://127.0.0.1:8000/api/v1/login",
    data={
        "username": "admin@podium.com",
        "password": "Admin123!"
    }
)
token = response.json()["access_token"]
```

---

## 🧪 Testes Recomendados

### Teste 1: Login do Admin

```bash
curl -X POST "http://127.0.0.1:8000/api/v1/login" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "username=admin@podium.com&password=Admin123!"
```

**Esperado:** 200 OK com access_token

---

### Teste 2: Login de Motorista

```bash
curl -X POST "http://127.0.0.1:8000/api/v1/login" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "username=driver1@podium.com&password=teste123"
```

**Esperado:** 200 OK com access_token

---

### Teste 3: Login de Funcionário

```bash
curl -X POST "http://127.0.0.1:8000/api/v1/login" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "username=employee1@podium.com&password=teste123"
```

**Esperado:** 200 OK com access_token

---

### Teste 4: Criar Novo Motorista (como Admin)

```bash
# 1. Login como admin (get token)
TOKEN=$(curl -s -X POST "http://127.0.0.1:8000/api/v1/login" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "username=admin@podium.com&password=Admin123!" | jq -r '.access_token')

# 2. Criar novo motorista
curl -X POST "http://127.0.0.1:8000/api/v1/signup/driver" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "driver3@podium.com",
    "full_name": "Motorista 3",
    "password": "teste123",
    "role": "driver",
    "vehicle_model": "Hatch",
    "vehicle_plate": "DEF4G56",
    "cnh_number": "11111111111"
  }'
```

**Esperado:** 200 OK com dados do novo motorista

---

### Teste 5: Criar Novo Funcionário (como Admin)

```bash
# 1. Login como admin (get token)
TOKEN=$(curl -s -X POST "http://127.0.0.1:8000/api/v1/login" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "username=admin@podium.com&password=Admin123!" | jq -r '.access_token')

# 2. Criar novo funcionário
curl -X POST "http://127.0.0.1:8000/api/v1/signup/employee" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "employee4@podium.com",
    "full_name": "Funcionário 4",
    "password": "teste123",
    "role": "employee",
    "company_id": 1,
    "department": "Marketing"
  }'
```

**Esperado:** 200 OK com dados do novo funcionário

---

### Teste 6: Tentar Criar Motorista sem ser Admin (deve falhar)

```bash
# 1. Login como motorista (get token)
TOKEN=$(curl -s -X POST "http://127.0.0.1:8000/api/v1/login" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "username=driver1@podium.com&password=teste123" | jq -r '.access_token')

# 2. Tentar criar novo motorista (deve falhar)
curl -X POST "http://127.0.0.1:8000/api/v1/signup/driver" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "driver4@podium.com",
    "full_name": "Motorista 4",
    "password": "teste123",
    "role": "driver",
    "vehicle_model": "Pickup",
    "vehicle_plate": "GHI7J89",
    "cnh_number": "22222222222"
  }'
```

**Esperado:** 403 Forbidden (acesso negado - não é admin)

---

## 🔄 Scripts de Seed

### Reexecutar Seed de Admin

```bash
python -m app.scripts.seed_admin \
  --email admin@podium.com \
  --name "Admin" \
  --password "Admin123!"
```

### Reexecutar Seed de Dados Iniciais

```bash
python -m app.scripts.seed_data \
  --password teste123 \
  --company-name "Podium Serviços" \
  --company-cnpj "12.345.678/0001-99"
```

---

## 📝 Notas Importantes

1. **Senhas:** 
   - Admin: `Admin123!` (diferente dos outros)
   - Todos os outros: `teste123`

2. **Roles:**
   - `admin`: Pode criar outros usuários
   - `driver`: Motorista disponível para corridas
   - `employee`: Funcionário da empresa (passageiro)

3. **Segurança:**
   - Todas as senhas estão hashadas com bcrypt
   - Tokens JWT com expiração configurável
   - Rotas protegidas exigem token válido

4. **Banco de Dados:**
   - PostgreSQL local
   - Tabelas criadas automaticamente no primeiro startup
   - Dados persistentes

5. **API Endpoints:**
   - Login: `POST /api/v1/login`
   - Signup Admin: `POST /api/v1/signup/admin` (requer admin)
   - Signup Driver: `POST /api/v1/signup/driver` (requer admin)
   - Signup Employee: `POST /api/v1/signup/employee` (requer admin)
   - Docs: `GET /docs` (Swagger UI)
   - OpenAPI: `GET /api/v1/openapi.json`

---

## 🧩 Fluxo de Teste Recomendado

1. ✅ Teste login com **admin@podium.com**
2. ✅ Teste login com **driver1@podium.com**
3. ✅ Teste login com **employee1@podium.com**
4. ✅ Teste criar novo motorista (como admin)
5. ✅ Teste criar novo funcionário (como admin)
6. ✅ Teste tentar criar usuário sem ser admin (deve falhar)
7. ✅ Teste rotas futuras com tokens de diferentes papéis

---

## 📞 Contato & Suporte

Para dúvidas sobre os dados de teste, consulte:
- [README.md](README.md) - Instruções de setup
- [CONTRIBUTING.md](CONTRIBUTING.md) - Contribuição ao projeto
- [FIXES_AND_IMPROVEMENTS.md](FIXES_AND_IMPROVEMENTS.md) - Histórico de correções

---

**Última atualização:** 13 de dezembro de 2025  
**Versão:** v0.1.0  
**Status:** ✅ Produção

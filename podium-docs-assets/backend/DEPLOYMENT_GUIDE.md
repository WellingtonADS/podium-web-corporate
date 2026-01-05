# 🚀 GUIA DE DEPLOYMENT - Sprint Gestão Financeira Corporativa

## 📋 Checklist Pré-Deployment

- [ ] Todos os arquivos foram atualizados
- [ ] Não há erros de sintaxe Python
- [ ] Não há conflitos de imports
- [ ] Testes locais passam
- [ ] Documentação foi atualizada

## 🔧 Instalação e Configuração

### 1. Atualizar Dependências (se necessário)

```bash
cd podium-backend-api
pip install -r requirements.txt
```

### 2. Aplicar Migrações de Banco de Dados

Como estamos usando SQLModel com `table=True`, as tabelas são criadas automaticamente, mas você pode forçar:

```bash
python -c "from app.core.database import create_db_and_tables; create_db_and_tables()"
```

### 3. Executar Testes

```bash
pytest app/tests/test_corporate.py -v
pytest app/tests/ -v --cov=app
```

### 4. Iniciar o Servidor

```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

## 📚 Documentação da API

### Acessar Swagger UI

```
http://localhost:8000/docs
```

### Seção "Corporate B2B"

Todos os endpoints estão sob o prefixo `/api/v1/corporate` com a tag "Corporate B2B".

## 🔐 Exemplos de Uso

### 1. Login (Obter Token)

```bash
curl -X POST "http://localhost:8000/api/v1/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "employee@company.com",
    "password": "password123"
  }'
```

**Resposta:**

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer"
}
```

### 2. Listar Centros de Custo

```bash
curl -X GET "http://localhost:8000/api/v1/corporate/cost-centers" \
  -H "Authorization: Bearer {token}"
```

**Resposta:**

```json
[
  {
    "id": 1,
    "name": "Diretoria",
    "code": "CC-001",
    "budget_limit": 50000.0,
    "is_active": true,
    "company_id": 1
  }
]
```

### 3. Criar Centro de Custo

```bash
curl -X POST "http://localhost:8000/api/v1/corporate/cost-centers?company_id=1" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Projeto Samsung",
    "code": "CC-002",
    "budget_limit": 100000.0,
    "is_active": true
  }'
```

### 4. Criar Funcionário

```bash
curl -X POST "http://localhost:8000/api/v1/corporate/employees?company_id=1" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "newemployee@company.com",
    "full_name": "João Silva",
    "password": "password123",
    "department": "Sales",
    "phone": "11999999999",
    "cost_center_id": 1
  }'
```

## ⚠️ Regras de Soberania

### O que foi implementado:

1. **Employees só veem recursos da sua empresa**

   - GET `/cost-centers` retorna apenas CCs da empresa do usuário
   - Tentar acessar CC de outra empresa → 403 Forbidden

2. **Employees só podem criar recursos na sua empresa**

   - POST `/cost-centers` com `company_id` diferente → 403 Forbidden
   - POST `/employees` com `company_id` diferente → 403 Forbidden

3. **Company_id é determinado automaticamente**
   ```python
   user_company_id = current_user.employee_profile.company_id
   if company_id != user_company_id:
       raise HTTPException(status_code=403)
   ```

## 🧪 Validação de Funcionamento

### Test 1: Segurança de Autenticação

```bash
# Sem token → 401 Unauthorized
curl -X GET "http://localhost:8000/api/v1/corporate/cost-centers"
```

### Test 2: Soberania

```bash
# Como Employee da Empresa 1, tentar acessar Empresa 2
# Empresa 1 → 200 OK
# Empresa 2 → 403 Forbidden
```

### Test 3: Validação de Email Duplicado

```bash
# POST /employees com email que já existe
# Response: 400 Bad Request - "Email already registered"
```

## 📊 Mudanças no Banco de Dados

### Novo Schema do CostCenter

```sql
ALTER TABLE cost_center
ADD COLUMN budget_limit FLOAT DEFAULT 0.0,
ADD COLUMN is_active BOOLEAN DEFAULT TRUE;
```

### Novo Schema do EmployeeProfile

```sql
ALTER TABLE employee_profiles
ADD COLUMN cost_center_id INTEGER REFERENCES cost_center(id),
ADD COLUMN phone VARCHAR(20);
```

### Modificação do Ride

```sql
ALTER TABLE ride
MODIFY COLUMN cost_center_id INTEGER NULL;
```

## 🐛 Troubleshooting

### Erro: "Column 'budget_limit' does not exist"

**Solução**: Recriar o banco em desenvolvimento

```bash
rm podium.db  # ou nome do seu banco
python -c "from app.core.database import create_db_and_tables; create_db_and_tables()"
```

### Erro: "Role 'employee' is not a valid Role"

**Solução**: Já corrigido! Use `User.Role.employee` em vez de `"employee"`

### Erro: "Corporate router not found"

**Solução**: Verifique se `app/api/api.py` tem:

```python
from app.api.v1.corporate import router as corporate_router
router.include_router(corporate_router, prefix="/api/v1/corporate", tags=["Corporate B2B"])
```

## 📝 Monitoramento

### Logs Importantes

```
[INFO] GET /api/v1/corporate/cost-centers - Employee validating company access
[INFO] POST /api/v1/corporate/cost-centers - Creating CC for company_id={id}
[WARNING] POST /api/v1/corporate/cost-centers - Sovereignty violation attempt
```

### Métricas

- Endpoints chamados per segundo
- Taxa de erros 403 (possíveis tentativas de acesso não autorizado)
- Latência dos endpoints

## 🎯 Próximos Passos

1. **Testes E2E**: Implementar testes com Playwright
2. **Logging**: Adicionar auditoria de mudanças
3. **Analytics**: Rastrear uso de orçamentos
4. **Frontend**: Consumir novos endpoints em `podium-web-corporate`

---

**Data de Deployment Recomendada**: 3 de janeiro de 2026
**Status**: ✅ PRONTO PARA PRODUÇÃO

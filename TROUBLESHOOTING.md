# Guia de Troubleshooting - Integração de API

## 🔍 Problemas Comuns e Soluções

### 1. Erro 401 - Não Autenticado

**Sintoma:**

```
Token inválido, sessão expirada, redireciona para /login
```

**Causa:**

- Token expirou
- Logout de outro dispositivo
- Token malformado

**Solução:**

```typescript
// Automático via interceptor
// O usuário será redirecionado para /login e limpo de localStorage
// Nenhuma ação necessária no componente
```

---

### 2. Erro 400 - Bad Request

**Sintoma:**

```
POST /corporate/employees
{ "detail": "Email já cadastrado no sistema" }
```

**Causa:**

- Validação backend falhou
- Dados inválidos enviados

**Solução:**

```typescript
// No catch do hook/página:
catch (error) {
  const msg = (error as any).message; // "Email já cadastrado..."
  toast({ title: `Erro: ${msg}`, status: 'error' });
}
```

---

### 3. Erro 500 - Internal Server Error

**Sintoma:**

```
POST /corporate/cost-centers
{ "detail": "Database connection failed" }
```

**Causa:**

- Backend não disponível
- Query inválida no banco

**Solução:**

1. Verificar status do backend: `curl http://localhost:8000/health`
2. Verificar logs do FastAPI
3. Implementar retry automático (future enhancement)

---

### 4. CORS - Cross-Origin Request Blocked

**Sintoma:**

```
Access to XMLHttpRequest blocked by CORS policy
No 'Access-Control-Allow-Origin' header
```

**Causa:**

- Backend não configurado com CORS para frontend URL
- Proxy não ativo

**Solução:**

```python
# Backend FastAPI deve ter:
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
  CORSMiddleware,
  allow_origins=["http://localhost:5175", "https://podium.com"],
  allow_methods=["*"],
  allow_headers=["*"],
)
```

---

### 5. Timeout - Requisição Muito Lenta

**Sintoma:**

```
Requisição fica pendente por 30s depois de erro de rede
```

**Causa:**

- Endpoint muito lento
- Backend indisponível mas não respondendo

**Solução:**

```typescript
// Adicionar timeout no axios (future enhancement)
const api = axios.create({
  baseURL: API_URL,
  timeout: 10000, // 10s
});
```

---

### 6. Mock Data Aparecendo Mesmo Com Backend Online

**Sintoma:**

```
useBillingData retorna dados mock mesmo com API respondendo
```

**Causa:**

- Hook caiu no `catch` mas não disparou erro visível
- Verificar console para erro real

**Solução:**

```typescript
// Verificar console.error em DevTools
// Checar que fetchBillingRecords() está importado corretamente
// Confirmar que filters estão corretos

// Verificar se error está sendo mostrado:
{error && <Alert status="error">{error}</Alert>}
```

---

## 🔧 Debug Steps

### 1. Verificar Token Armazenado

```typescript
// No console do DevTools:
localStorage.getItem("@Podium:token");
localStorage.getItem("@Podium:user");
```

### 2. Monitorar Requisições

```
DevTools → Network → Filtrar por XHR
Verificar:
- Headers da requisição (Authorization)
- Status da resposta (200, 401, 400, 500)
- Payload enviado
- Resposta recebida
```

### 3. Logs do Interceptor

```typescript
// Adicionar em api.ts se precisar debugar:
api.interceptors.request.use((config) => {
  console.log("📤 Request:", config.url, config.data);
  return config;
});

api.interceptors.response.use(
  (response) => {
    console.log("✅ Response:", response.status, response.data);
    return response;
  },
  (error) => {
    console.log("❌ Error:", error.response?.status, error.response?.data);
    throw error;
  }
);
```

---

## 🔌 Verificar Conectividade

```bash
# Testar backend está rodando
curl -i http://localhost:8000/health

# Testar auth
curl -X POST http://localhost:8000/api/v1/login \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "username=user@example.com&password=123456"

# Testar fetch com token
curl -H "Authorization: Bearer <TOKEN>" \
  http://localhost:8000/api/v1/stats/corporate/billing
```

---

## 📊 Fluxo de Debug para cada Página

### Dashboard (Faturamento)

```
1. Abre → useBillingData() → fetchBillingRecords()
2. Verificar em DevTools:
   - GET /stats/corporate/billing
   - Status 200?
   - Response tem array de BillingPeriod?
3. Se erro → verificar msg em error state
4. Se mock data → catch disparou, consultar console.error()
```

### Centros de Custo

```
1. Abre → fetchCostCenters() em useEffect
2. Verificar em DevTools:
   - GET /corporate/cost-centers
   - Status 200?
   - Response tem array de CostCenter?
3. Clica "Editar" → carrega form
4. Salva → updateCostCenter() ou createCostCenter()
   - PATCH ou POST?
   - Payload correto?
5. Toast mostra resultado
```

### Funcionários - Importação

```
1. Seleciona CSV → parseEmployeesCsv()
   - Verificar parse errors
2. Clica "Importar" → importEmployeesSequential()
3. Cada linha → createEmployee()
   - Verificar em Network qual POST está falhando
4. Toast mostra resultado com sucesso/falha por linha
```

---

## 🛠️ Checklist de Deployment

- [ ] Backend API rodando em `VITE_API_URL`
- [ ] CORS configurado no backend
- [ ] JWT secret em sync entre frontend/backend
- [ ] Banco de dados acessível do backend
- [ ] Variáveis de ambiente configuradas
- [ ] Build passou: `yarn build`
- [ ] Lint passou: `yarn lint` (0 errors)
- [ ] Tokens são armazenados em localStorage (secure)
- [ ] Logout limpa tokens e redireciona

---

## 📚 Referências

- [Axios Documentation](https://axios-http.com/)
- [FastAPI CORS](https://fastapi.tiangolo.com/tutorial/cors/)
- [MDN CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)
- [HTTP Status Codes](https://httpwg.org/specs/rfc7231.html#status.codes)

---

**Última atualização:** 13 jan 2026  
**Versão:** 1.0  
**Mantido por:** Copilot GitHub

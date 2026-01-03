# FAQ

Perguntas frequentes sobre o projeto Podium.

## Geral

### O que é Podium?

Podium é uma plataforma de mobilidade que oferece solução centralizada para:

- Gerenciamento de frota de veículos
- Reservas e agendamento de veículos
- Portal corporativo para empresas
- App mobile para motoristas
- Dashboard administrativo

### Quais são os requisitos de sistema?

- **Node.js 18+** (npm 8+) para frontends
- **Python 3.11+** para backend
- **PostgreSQL** para banco de dados
- **Git 2.40+** para versionamento

### Qual é a arquitetura do projeto?

Podium utiliza uma arquitetura de monorepo com:

- Backend centralizado (FastAPI)
- Múltiplos frontends especializados (React, React Native)
- Separação clara entre responsabilidades
- API REST para comunicação

Veja [Arquitetura](Arquitetura) para mais detalhes.

---

## Instalação e Configuração

### Como configuro o ambiente?

Consulte [Instalação e Configuração](Instalação-e-Configuração) para guia completo de setup.

### Qual porta o backend usa?

Por padrão, o backend FastAPI executa em `http://localhost:8000`.

### Como acessar a documentação da API?

Inicie o backend e acesse:

- **Swagger UI:** `http://localhost:8000/docs`
- **ReDoc:** `http://localhost:8000/redoc`

### O banco de dados é necessário?

Sim, o backend requer PostgreSQL. Configure a URL no arquivo `.env`:

```env
DATABASE_URL=postgresql://user:password@localhost:5432/podium
```

### Como criar um novo ambiente virtual Python?

```bash
python -m venv venv
# Windows
venv\Scripts\activate
# macOS/Linux
source venv/bin/activate
```

---

## Desenvolvimento

### Como criei uma nova página React?

1. Crie o arquivo em `src/pages/MyPage.tsx`
2. Crie componentes necessários em `src/components/`
3. Adicione a rota em `src/routes/`
4. Implemente o layout com tema do projeto

Exemplo:

```typescript
// src/pages/MyPage.tsx
import React from "react";

export const MyPage: React.FC = () => {
  return (
    <div>
      <h1>Minha Página</h1>
    </div>
  );
};
```

### Como adiciono um novo endpoint ao backend?

1. Crie o schema Pydantic em `app/schemas/`
2. Crie o modelo SQLAlchemy em `app/models/` se necessário
3. Crie a lógica em `app/services/`
4. Adicione a rota em `app/api/v1/`

Exemplo:

```python
# app/api/v1/items.py
from fastapi import APIRouter, Depends
from app.schemas import ItemCreate, ItemResponse

router = APIRouter(prefix="/items", tags=["items"])

@router.post("/", response_model=ItemResponse)
async def create_item(item: ItemCreate):
    """Criar novo item."""
    return item.dict()
```

### Como uso TypeScript corretamente?

- Sempre defina tipos e interfaces
- Use `interface` para objetos, `type` para unions/tuples
- Evite `any`, prefira tipos genéricos
- Use strict mode no tsconfig.json

### Como faço testes no backend?

```bash
cd podium-backend-api
pytest
```

Exemplo de teste:

```python
def test_create_user():
    user_data = {"email": "test@example.com", "password": "123"}
    response = client.post("/api/v1/users", json=user_data)
    assert response.status_code == 201
```

### Como faço testes no frontend?

```bash
cd podium-web-admin
yarn test
```

---

## Autenticação e Segurança

### Como funciona a autenticação?

1. Usuário faz login com credenciais
2. Backend valida e gera JWT token
3. Frontend armazena token em localStorage
4. Frontend inclui token em Authorization header para requisições
5. Backend valida token para cada requisição

### Tokens expiram?

Sim. Configure o tempo de expiração em:

```env
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

### Como protejo uma rota?

Use o componente `PrivateRoute`:

```typescript
<PrivateRoute>
  <Dashboard />
</PrivateRoute>
```

### Como logout funciona?

1. Frontend remove token do localStorage
2. Frontend redireciona para página de login
3. Requisições subsequentes falham sem token (esperado)

---

## Comum Erros e Soluções

### Erro: "CORS policy: No 'Access-Control-Allow-Origin' header"

Seu frontend está em uma porta diferente do backend. Configure CORS no backend:

```python
# app/main.py
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### Erro: "Port already in use"

Mude a porta:

```bash
# Backend
python -m uvicorn app.main:app --port 8001 --reload

# Frontend
PORT=3001 yarn start
```

### Erro: "Module not found"

Reinstale dependências:

```bash
# Backend
pip install --upgrade -r requirements.txt

# Frontend
yarn cache clean
yarn install
```

### Erro: "401 Unauthorized"

Você não está autenticado. Faça login novamente e verifique se o token é válido.

### Erro: "TypeError: Cannot read property 'user' of undefined"

Seu contexto não foi inicializado. Certifique-se de que a aplicação está envolvida em Provider:

```typescript
<AuthProvider>
  <App />
</AuthProvider>
```

---

## Performance

### Como otimizar a performance do frontend?

- Use `React.memo()` para componentes que não mudam frequentemente
- Implemente lazy loading com `React.lazy()`
- Use splitting de código com `react-router`
- Otimize imagens (use WebP)
- Minimize bundle size

### Como otimizar a performance do backend?

- Use indexação no banco de dados
- Implemente caching com Redis
- Use paginação em listagens
- Otimize queries SQLAlchemy
- Use async/await para operações I/O

---

## Deployment

### Como faço deploy do backend?

1. Configure variáveis de ambiente em produção
2. Use gerenciador de processos (gunicorn, supervisor)
3. Configure reverse proxy (nginx)
4. Configure SSL/TLS
5. Configure backup do banco de dados

### Como faço deploy do frontend?

1. Build da aplicação: `yarn build`
2. Serve arquivos estáticos via web server (nginx, Apache)
3. Configure redirecionamento de rotas para index.html
4. Configure cache headers apropriados

---

## Contribuição

### Como posso contribuir?

Consulte [Contribuindo](Contribuindo) para diretrizes completas.

### Qual é o processo de PR?

1. Fork repositório
2. Crie branch para feature/fix
3. Faça alterações e commit
4. Push para seu fork
5. Abra Pull Request com descrição clara

---

## Obtenha Ajuda

- **Documentação:** Consulte as páginas do wiki
- **Issues:** Abra issue no GitHub
- **Discussões:** Participe de discussões no GitHub
- **Contato:** Entre em contato com mantenedores

---

## Links Úteis

- [Documentação Oficial](Home)
- [Instalação e Configuração](Instalação-e-Configuração)
- [Arquitetura](Arquitetura)
- [API](API)
- [Subprojetos](Subprojetos)
- [Contribuindo](Contribuindo)

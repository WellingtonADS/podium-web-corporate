# API

Documentação técnica dos endpoints da API Podium.

## Base URL

```
http://localhost:8000/api/v1
```

Em produção, substituir localhost pelo domínio do servidor.

## Autenticação

Todos os endpoints requerem autenticação via JWT token (exceto `/auth/login`).

```bash
Authorization: Bearer <token>
```

## Endpoints Principais

### Autenticação

#### Login

```http
POST /auth/login
Content-Type: application/x-www-form-urlencoded

username=usuario&password=senha
```

**Resposta (200):**

```json
{
  "access_token": "eyJhbGc...",
  "token_type": "bearer",
  "user_id": 1
}
```

#### Obter Usuário Atual

```http
GET /auth/me
Authorization: Bearer <token>
```

**Resposta (200):**

```json
{
  "id": 1,
  "email": "usuario@example.com",
  "full_name": "João Silva",
  "is_active": true
}
```

### Usuários

#### Listar Usuários

```http
GET /users
Authorization: Bearer <token>
```

**Parâmetros Query:**

- `skip` (int): Número de registros a pular (default: 0)
- `limit` (int): Número máximo de registros (default: 100)

**Resposta (200):**

```json
[
  {
    "id": 1,
    "email": "usuario@example.com",
    "full_name": "João Silva",
    "is_active": true
  }
]
```

#### Obter Usuário por ID

```http
GET /users/{user_id}
Authorization: Bearer <token>
```

**Resposta (200):**

```json
{
  "id": 1,
  "email": "usuario@example.com",
  "full_name": "João Silva",
  "is_active": true
}
```

#### Criar Usuário

```http
POST /users
Authorization: Bearer <token>
Content-Type: application/json

{
  "email": "novo@example.com",
  "password": "senha123",
  "full_name": "Novo Usuário"
}
```

**Resposta (201):**

```json
{
  "id": 2,
  "email": "novo@example.com",
  "full_name": "Novo Usuário",
  "is_active": true
}
```

### Veículos

#### Listar Veículos

```http
GET /vehicles
Authorization: Bearer <token>
```

**Resposta (200):**

```json
[
  {
    "id": 1,
    "plate": "ABC-1234",
    "model": "Toyota Corolla",
    "status": "available",
    "location": "Garagem Central"
  }
]
```

#### Obter Veículo por ID

```http
GET /vehicles/{vehicle_id}
Authorization: Bearer <token>
```

**Resposta (200):**

```json
{
  "id": 1,
  "plate": "ABC-1234",
  "model": "Toyota Corolla",
  "status": "available",
  "location": "Garagem Central"
}
```

### Reservas (Bookings)

#### Listar Reservas

```http
GET /bookings
Authorization: Bearer <token>
```

**Resposta (200):**

```json
[
  {
    "id": 1,
    "user_id": 1,
    "vehicle_id": 1,
    "start_date": "2026-01-05T10:00:00",
    "end_date": "2026-01-06T10:00:00",
    "status": "confirmed"
  }
]
```

#### Criar Reserva

```http
POST /bookings
Authorization: Bearer <token>
Content-Type: application/json

{
  "vehicle_id": 1,
  "start_date": "2026-01-05T10:00:00",
  "end_date": "2026-01-06T10:00:00"
}
```

**Resposta (201):**

```json
{
  "id": 1,
  "user_id": 1,
  "vehicle_id": 1,
  "start_date": "2026-01-05T10:00:00",
  "end_date": "2026-01-06T10:00:00",
  "status": "confirmed"
}
```

### Estatísticas e Dashboard

#### Dashboard Corporativo

```http
GET /stats/corporate/dashboard
Authorization: Bearer <token>
```

**Resposta (200):**

```json
{
  "total_vehicles": 50,
  "available_vehicles": 35,
  "active_bookings": 15,
  "total_users": 100
}
```

## Códigos de Resposta HTTP

| Código | Descrição                |
| ------ | ------------------------ |
| 200    | Sucesso                  |
| 201    | Criado com sucesso       |
| 400    | Requisição inválida      |
| 401    | Não autenticado          |
| 403    | Não autorizado           |
| 404    | Recurso não encontrado   |
| 500    | Erro interno do servidor |

## Documentação Interativa

Acesse a documentação interativa Swagger em:

```
http://localhost:8000/docs
```

Para documentação ReDoc:

```
http://localhost:8000/redoc
```

---

## Próximos Passos

- Consulte [Arquitetura](Arquitetura) para entender a estrutura técnica
- Veja [Guia de Uso](Guia-de-Uso) para instruções operacionais

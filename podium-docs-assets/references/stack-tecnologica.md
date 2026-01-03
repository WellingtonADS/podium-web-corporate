### 1. Aplicações Móveis (Passageiro & Motorista)

Tecnologia Base: React Native (via Expo)

O Expo continua sendo a escolha definitiva pela facilidade de deploy (EAS) e acesso a APIs nativas sem precisar de um
Mac inicialmente.

| **Componente**|**Tecnologia / Biblioteca**|**Função Real (Produção)**                           |
| --- | --- | --- |
| **Core**|**Expo SDK 50+**                        | Base do sistema (gerenciamento de build e updates).  |
| **Linguagem**|** TypeScript**                         | Lógica da interface.                                 |
| **Mapas**|**`react-native-maps`**                 | Renderização do mapa nativo (Google/Apple).          |
| **Geolocalização**|**`expo-location`**                     | Captura de coordenadas GPS do dispositivo.           |
| **HTTP Client**|**`axios`**                             | Comunicação segura com sua API Python.               |
| **Armazenamento**|**`@react-native-async-storage`**       | Salvar Token JWT e sessão do usuário (persistência). |
| **Navegação**|**`expo-router`** ou `react-navigation` | Fluxo de telas (Login -> Home -> Corrida).           |
| **Estilização**|**NativeWind** (Tailwind) ou StyleSheet | Manter o visual Dark/Gold consistente.               |

### 2. Painel Administrativo (Web B2B & Dispatch)

Tecnologia Base: React.js (Single Page Application)

Focado na gestão de Centros de Custo e monitoramento da frota.

| **Componente**|**Tecnologia / Biblioteca**|**Função Real (Produção)**                                           |
| --- | --- | --- |
| **Build Tool**|**Vite** ou CRA             | Performance superior para desenvolvimento web.                       |
| **UI Framework**|**Chakra UI (v2)**          | Componentes prontos (Cards, Tabelas) com suporte nativo a Dark Mode. |
| **Gráficos**|**Recharts**                | Visualização real de faturamento e volume de corridas.               |
| **Conexão API**|**`axios`**                 | Consumo dos endpoints do Backend.                                    |
| **Mapas Web**|**`react-leaflet`**         | Visualização da frota no navegador (mais barato que Google Maps JS). |

### 3. Backend (O "Cérebro" & Regras de Negócio)

Tecnologia Base: Python 3.12+ com FastAPI

Aqui reside a lógica do Preço Fixo e a segurança dos dados.

| **Componente**|**Tecnologia / Biblioteca**|**Função Real (Produção)**                                       |
| --- | --- | --- |
| **Framework**|**FastAPI**                        | Alta performance (Async) e documentação automática (Swagger).    |
| **Servidor**|**Uvicorn** (com Gunicorn em prod) | Servidor ASGI para produção.                                     |
| **Banco de Dados**|**PostgreSQL**                     | O padrão para dados relacionais e financeiros2.                  |
| **Extensão Geo**|**PostGIS**|**Crítico:** Permite queries como "Motoristas num raio de 5km".  |
| **ORM**|**SQLModel** (ou SQLAlchemy)       | Interação Python <-> Banco de Dados.                             |
| **Autenticação**|**`python-jose` (JWT)**            | Geração de tokens de segurança para Login.                       |
| **Real-time**|**`python-socketio`**              | Comunicação bidirecional (Passageiro chama -> Motorista recebe). |
| **Migrações**|**Alembic**                        | Versionamento do banco de dados (evita quebrar produção).        |

### 4. Infraestrutura & Serviços Externos (Cloud)

#### Onde o sistema vai viver no mundo real

| **Serviço**|**Provedor Recomendado**|**Custo Inicial**                                                      |
| --- | --- | --- |
| **Hospedagem API**|**Render**ou**Railway**             | Baixo (Free Tier ou ~$5/mês). Suportam Docker/Python nativo.           |
| **Banco de Dados**|**NeonDB**ou**Supabase** (Postgres) | Free Tier generoso para MVP.                                           |
| **Hospedagem Web**|**Vercel**                            | Grátis para Frontend.                                                  |
| **Build Mobile**|**Expo EAS**                          | Grátis (limitado) ou Pay-as-you-go.                                    |
| **Mapas & Places**|**Google Maps Platform**              | $200 crédito mensal grátis (Essencial para Autocomplete e Directions). |

###

1. 

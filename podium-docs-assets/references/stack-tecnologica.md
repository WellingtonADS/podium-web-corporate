### 1. Aplicações Móveis (Passageiro & Motorista)

Tecnologia base: React Native (via Expo). O Expo facilita deploy (EAS) e acesso a APIs nativas sem precisar de Mac.

- **Core:** Expo SDK 50+ para builds e updates.
- **Linguagem:** TypeScript para tipagem de UI.
- **Mapas:** `react-native-maps` para mapas Google/Apple.
- **Geolocalização:** `expo-location` para GPS do dispositivo.
- **HTTP Client:** `axios` para chamadas à API Python.
- **Armazenamento:** `@react-native-async-storage` para token JWT/sessão.
- **Navegação:** `expo-router` ou `react-navigation` para fluxo de telas.
- **Estilização:** NativeWind (Tailwind) ou StyleSheet com visual Dark/Gold.

### 2. Painel Administrativo (Web B2B & Dispatch)

Tecnologia base: React.js (SPA) focada em gestão de Centros de Custo e monitoramento da frota.

- **Build Tool:** Vite (ou CRA) para DX e performance.
- **UI Framework:** Chakra UI (v2) com componentes prontos e Dark Mode.
- **Gráficos:** Recharts para faturamento e volume de corridas.
- **Conexão API:** `axios` para endpoints do backend.
- **Mapas Web:** `react-leaflet` para visão da frota (mais barato que Google Maps JS).

### 3. Backend (Regras de Negócio)

Tecnologia base: Python 3.12+ com FastAPI. Aqui vive o preço fixo e a segurança dos dados.

- **Framework:** FastAPI com docs automáticas (Swagger).
- **Servidor:** Uvicorn (Gunicorn em produção) como ASGI.
- **Banco:** PostgreSQL como padrão financeiro.
- **Extensão Geo:** PostGIS para queries como "motoristas num raio de 5km".
- **ORM:** SQLModel ou SQLAlchemy para persistência.
- **Autenticação:** `python-jose` (JWT) para tokens.
- **Real-time:** `python-socketio` para comunicação passageiro <-> motorista.
- **Migrações:** Alembic para versionar schema.

### 4. Infraestrutura & Serviços Externos (Cloud)

Onde o sistema roda no mundo real.

- **Hospedagem API:** Render ou Railway (free tier / ~$5/mês, suporte Docker/Python).
- **Banco de Dados:** NeonDB ou Supabase (Postgres) com free tier.
- **Hospedagem Web:** Vercel grátis para frontend.
- **Build Mobile:** Expo EAS (free limitado ou pay-as-you-go).
- **Mapas & Places:** Google Maps Platform com $200 de crédito mensal.

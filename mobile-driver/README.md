# Podium Driver App 🚗

Aplicativo mobile para motoristas da plataforma Podium, desenvolvido com React Native e Expo. Permite gerenciamento de corridas, rastreamento GPS em tempo real, visualização de ganhos e perfil do motorista.

## 🚀 Stack Tecnológico

- **React Native 0.81.5** com TypeScript
- **Expo 54.0** para build e deployment
- **React Navigation** para navegação (Stack + Bottom Tabs)
- **React Native Maps** para geolocalização
- **Expo Location** para GPS em tempo real
- **Axios** para requisições HTTP
- **Expo Secure Store** para armazenamento seguro de tokens
- **FastAPI** Backend (em desenvolvimento separado)

## 📋 Pré-requisitos

- Node.js 18+ ou superior
- Yarn (gerenciador de pacotes recomendado)
- Expo CLI: `npm install -g expo-cli`
- Dispositivo Android/iOS ou emulador

## 📦 Instalação

```bash
# Clone o repositório
git clone https://github.com/WellingtonADS/mobile-driver.git
cd mobile-driver

# Instale as dependências com yarn
yarn install

# Reinicie o Expo (se necessário)
yarn start --clear
```

## 🔧 Scripts Disponíveis

```bash
# Iniciar o Expo (Metro Bundler)
yarn start

# Limpar cache e reiniciar
yarn start --clear

# Abrir no Android
yarn android

# Abrir no iOS
yarn ios

# Abrir na web
yarn web

# Verificar tipos TypeScript
yarn tsc --noEmit

# Validar código com ESLint
yarn eslint .
```

## ⚙️ Configuração do Backend

### IP e Porta

O app conecta ao backend FastAPI configurado em `src/services/api.ts`:

```typescript
const BASE_URL = 'http://192.168.15.18:8000/api/v1';
```

**Ajuste conforme seu ambiente:**
- **Android Emulador:** `http://10.0.2.2:8000/api/v1`
- **Dispositivo Físico/iOS:** `http://SEU_IPV4:8000/api/v1`

Para descobrir seu IPv4 no Windows:
```powershell
ipconfig
```

Procure pelo IPv4 da interface ativa (ex: `192.168.x.x`).

### Variáveis de Ambiente

Crie um arquivo `.env.local` na raiz do projeto (opcional, para produção):

```env
EXPO_PUBLIC_API_URL=http://192.168.15.18:8000/api/v1
```

## 🔐 Autenticação

- **Endpoint:** `POST /api/v1/login`
- **Body:** `application/x-www-form-urlencoded`
  ```
  username=driver1@podium.com&password=teste123
  ```
- **Response:** Token JWT armazenado em `SecureStore`
- **Headers em requisições:** `Authorization: Bearer {token}`

### Fluxo de Login

1. Usuário insere email e senha na `LoginScreen`
2. `AuthContext.signIn()` envia credenciais para `/login`
3. Token retornado é salvo no `SecureStore` (criptografado)
4. Interceptor de requisições injeta o token automaticamente
5. Navegação muda para `MainTabs` (abas de Home, Ganhos, Perfil)

## 📍 Funcionalidades Principais

### HomeScreen (Mapa)
- Exibição do mapa com localização do motorista
- Rastreamento GPS em tempo real (a cada 5s ou 10m)
- Status Online/Offline com switch
- Painel inferior com ganhos do dia, corridas e nota do motorista

### RideScreen (Durante a Corrida)
- Mapa com rota até o destino
- Instruções de navegação em tempo real
- Informações do passageiro
- Botão para finalizar corrida

### EarningsScreen (Ganhos)
- Histórico de ganhos diários/mensais
- Estatísticas de corridas

### ProfileScreen (Perfil)
- Informações do motorista
- Configurações de conta

## 🐛 Troubleshooting

### Erro: "Não é possível localizar o módulo './src/screens/MapScreen'"
- Verifique se o arquivo existe: `src/screens/MapScreen.tsx`
- Certifique-se de que exporta `default`
- Rode `yarn start --clear` para limpar cache

### Erro 401 (Acesso Negado) ao enviar localização
- Token pode estar expirado
- Verifique se o backend está retornando token válido
- Confirme a formatação do endpoint `/users/me/location`

### Erro de Conexão (IP errado ou Firewall)
- Abra `ipconfig` e confirme o IPv4
- Atualize `BASE_URL` em `src/services/api.ts`
- Verifique se o backend está rodando na porta 8000
- Adicione exceção no Firewall do Windows para porta 8000

### Permissão de GPS negada
- App força o Android/iOS a solicitar permissão ao abrir `MapScreen`
- Se recusar, clique em "Configurações > Permissões > Localização" no celular

## 📁 Estrutura do Projeto

```
mobile-driver/
├── src/
│   ├── components/       # Componentes reutilizáveis (PodiumButton, PodiumInput)
│   ├── contexts/         # Contextos React (AuthContext)
│   ├── screens/          # Telas (Login, Home, Ride, Earnings, Profile)
│   ├── services/         # Serviços (api.ts com Axios + interceptors)
│   ├── styles/           # Estilos globais
│   └── theme/            # Tema e cores (COLORS, GLOBAL_STYLES)
├── assets/               # Imagens, ícones
├── App.tsx              # Entrada principal com navegação
├── app.json             # Configuração Expo
├── tsconfig.json        # Configuração TypeScript
├── eslint.config.cjs    # ESLint v9 (flat config)
├── .gitignore           # Arquivos ignorados no Git
├── package.json         # Dependências e scripts
└── README.md            # Este arquivo
```

## 🌐 Endpoints do Backend Esperados

| Método | Endpoint | Body | Resposta |
|--------|----------|------|----------|
| POST | `/login` | `username`, `password` | `{ access_token }` |
| PATCH | `/users/me/location` | `{ lat, lng }` | `{ status: "ok" }` |
| GET | `/users/me` | - | Dados do motorista |
| GET | `/earnings` | - | Lista de ganhos |

## 👨‍💻 Desenvolvimento

### Adicionar novo serviço
1. Crie arquivo em `src/services/meuservico.ts`
2. Use `api` (Axios) para requisições
3. O interceptor injetará o token automaticamente

### Adicionar nova tela
1. Crie `src/screens/MinhaScreen.tsx`
2. Importe em `App.tsx`
3. Adicione ao Stack ou Tab Navigator

### Estilo e Tema
- Use `COLORS` de `src/theme/index.ts`
- Reutilize `GLOBAL_STYLES` para consistência
- Cores principais: `#D4AF37` (dourado), `#0b1437` (azul escuro)

## 📝 Versionamento

- **Versão Atual:** 1.0.0
- **Branch Principal:** `main`
- **Branch de Release:** `release/v1.0.0`
- **Tags Git:** `release/v1.0.0` (primeiro release)
- Siga [Semantic Versioning](https://semver.org/)

### Workflow de Branches

- `main`: Branch principal com código estável
- `release/vX.Y.Z`: Branches de release para cada versão
- `feature/*`: Branches de desenvolvimento de novas funcionalidades
- `fix/*`: Branches para correções de bugs

### Comandos Git Úteis

```bash
# Clonar e mudar para branch de desenvolvimento
git clone https://github.com/WellingtonADS/mobile-driver.git
git checkout -b feature/minha-feature

# Publicar mudanças
git add .
git commit -m "feat: descrição da feature"
git push origin feature/minha-feature

# Criar release
git checkout -b release/v1.1.0 main
git tag -a release/v1.1.0 -m "Release v1.1.0"
git push origin release/v1.1.0 --tags
```

## 🚀 Deployment

### EAS Build (Expo)
```bash
# Build para Android
eas build --platform android

# Build para iOS
eas build --platform ios
```

### APK/IPA Local
```bash
# Gerar APK
expo export --platform android
```

## 📄 Licença

Propriedade da Podium Serviços. Todos os direitos reservados.

## 👥 Autor

Wellington ADS - Desenvolvedor

---

Para dúvidas ou issues, contate o time de desenvolvimento.

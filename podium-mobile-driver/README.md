# 📱 Podium Mobile Driver

Aplicativo mobile para motoristas da plataforma Podium, desenvolvido com React Native e Expo. Permite gerenciamento de corridas, rastreamento GPS em tempo real, visualização de ganhos e perfil do motorista.

## 📋 Descrição

O Podium Mobile Driver é o aplicativo para motoristas, responsável por:
- **Gerenciamento de corridas** - Aceitar, acompanhar e finalizar corridas
- **Rastreamento GPS** - Localização em tempo real e navegação
- **Visualização de ganhos** - Histórico de faturamento e estatísticas
- **Perfil do motorista** - Gerenciamento de dados pessoais e documentos
- **Sistema de avaliações** - Feedback de passageiros
- **Suporte em tempo real** - Chat com atendimento

## 🛠️ Stack Tecnológico

| Tecnologia | Versão | Propósito |
|-----------|--------|----------|
| **React Native** | 0.81.5+ | Framework mobile |
| **Expo** | 54.0+ | Build e deployment |
| **TypeScript** | 5+ | Type Safety |
| **React Navigation** | 6+ | Navegação (Stack + Tabs) |
| **React Native Maps** | 1+ | Geolocalização e mapas |
| **Expo Location** | 15+ | GPS em tempo real |
| **Axios** | 1+ | HTTP client |
| **Expo Secure Store** | 13+ | Armazenamento seguro |
| **Jest** | 29+ | Testes unitários |
| **React Native Testing Library** | 12+ | Testes de componentes |

## 📁 Estrutura de Diretórios

```
podium-mobile-driver/
├── src/
│   ├── components/             # Componentes React Native
│   │   ├── __tests__/
│   │   │   ├── PodiumButton.test.tsx
│   │   │   └── PodiumInput.test.tsx
│   │   ├── PodiumButton.tsx
│   │   └── PodiumInput.tsx
│   ├── contexts/               # Context API
│   │   ├── __tests__/
│   │   │   └── AuthContext.test.tsx
│   │   └── AuthContext.tsx
│   ├── screens/                # Telas da aplicação
│   │   ├── LoginScreen.tsx     # Login
│   │   ├── HomeScreen.tsx      # Início
│   │   ├── MapScreen.tsx       # Mapa com localização
│   │   ├── EarningsScreen.tsx  # Ganhos e estatísticas
│   │   ├── ProfileScreen.tsx   # Perfil do motorista
│   │   └── RideScreen.tsx      # Detalhes da corrida
│   ├── services/               # Integração com API
│   │   ├── __tests__/
│   │   │   └── api.test.ts
│   │   └── api.ts              # Cliente Axios
│   ├── theme/                  # Tema e estilos
│   │   ├── __tests__/
│   │   │   └── index.test.ts
│   │   └── index.ts
│   ├── App.tsx                 # Componente raiz
│   └── index.ts                # Ponto de entrada
├── assets/                     # Assets estáticos
│   ├── images/
│   │   └── icons/
│   ├── adaptive-icon.png
│   ├── splash-icon.png
│   └── favicon.png
├── app.json                    # Configuração Expo
├── package.json
├── tsconfig.json
├── jest.config.js
├── jest.setup.js
└── README.md
```

## 📋 Pré-requisitos

- Node.js 18+
- Yarn (gerenciador de pacotes recomendado)
- Expo CLI: `npm install -g expo-cli`
- Dispositivo Android/iOS ou emulador
- Backend API rodando (http://localhost:8000)

## 📦 Instalação

```bash
# 1. Clone o monorepo (se ainda não fez)
git clone https://github.com/WellingtonADS/podium-monorepo.git
cd podium-monorepo/podium-mobile-driver

# 2. Instale as dependências com yarn
yarn install

# 3. Reinicie o Expo (se necessário)
yarn start --clear
```

## 🔧 Scripts Disponíveis

| Script | Descrição |
|--------|-----------|
| `yarn start` | Iniciar o Expo (Metro Bundler) |
| `yarn start --clear` | Limpar cache e reiniciar |
| `yarn android` | Abrir no Android |
| `yarn ios` | Abrir no iOS |
| `yarn web` | Abrir na web |
| `yarn typecheck` | Verificar tipos TypeScript |
| `yarn lint` | Validar código com ESLint |
| `yarn test` | Executar testes |
| `yarn test:watch` | Testes em modo watch |
| `yarn test:coverage` | Relatório de cobertura |

## 🚀 Desenvolvimento

### Iniciar Dev Server

```bash
# Terminal 1: Expo
yarn start

# Terminal 2 (opcional): Backend
cd ../podium-backend-api
python -m uvicorn app.main:app --reload
```

Escolha na CLI:
- Pressione `a` para Android
- Pressione `i` para iOS
- Pressione `w` para Web
- Pressione `j` para abrir no navegador
- Escaneie QR code com Expo Go

## 📱 Plataformas Suportadas

- ✅ **Android** (API 24+)
- ✅ **iOS** (14+)
- ✅ **Web** (Navegador moderno)

## 🔐 Autenticação

O aplicativo utiliza autenticação JWT com armazenamento seguro:

```typescript
// Exemplo: Login
const response = await api.post('/v1/auth/login', {
  email: 'motorista@example.com',
  password: 'senha123'
});

// Token armazenado com Expo Secure Store
await SecureStore.setItemAsync('token', response.data.access_token);
```

**Endpoints utilizados:**
- `POST /v1/auth/login` - Login
- `POST /v1/auth/logout` - Logout
- `GET /v1/rides` - Listar corridas
- `POST /v1/rides/{id}/accept` - Aceitar corrida
- `GET /v1/earnings` - Obter ganhos

## 🗺️ Geolocalização

O MapScreen utiliza React Native Maps com localização em tempo real:

```typescript
import { useEffect, useState } from 'react';
import * as Location from 'expo-location';
import MapView, { Marker } from 'react-native-maps';

export function MapScreen() {
  const [location, setLocation] = useState<Location.LocationObject | null>(null);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        const loc = await Location.getCurrentPositionAsync({});
        setLocation(loc);
      }
    })();
  }, []);

  return (
    <MapView
      initialRegion={{
        latitude: location?.coords.latitude || 0,
        longitude: location?.coords.longitude || 0,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      }}
    >
      <Marker coordinate={{...}} />
    </MapView>
  );
}
```

## 🎨 Tema

Os estilos são definidos em `src/theme/index.ts`:

```typescript
const colors = {
  primary: '#1a365d',   // Azul Podium
  secondary: '#f6ad55', // Laranja destaque
  success: '#48bb78',   // Verde
  error: '#f56565',     // Vermelho
};
```

## 🧪 Testes

### Estrutura de Testes

Os testes estão em subdiretórios `__tests__`:

```
src/
├── components/__tests__/
├── contexts/__tests__/
├── services/__tests__/
└── theme/__tests__/
```

### Executar Testes

```bash
# Todos os testes
yarn test

# Watch mode
yarn test:watch

# Com cobertura
yarn test:coverage
```

### Exemplo de Teste

```tsx
// src/components/__tests__/PodiumButton.test.tsx
import { render, screen } from '@testing-library/react-native';
import { PodiumButton } from '@/components/PodiumButton';

describe('PodiumButton', () => {
  it('renderiza com título', () => {
    render(<PodiumButton title="Clique" />);
    expect(screen.getByText('Clique')).toBeOnTheScreen();
  });
});
```

## 🔒 Variáveis de Ambiente

Crie um arquivo `.env.local`:

```env
VITE_API_URL=http://localhost:8000
EXPO_PUBLIC_API_URL=http://localhost:8000
```

Acesse no código:
```typescript
const apiUrl = process.env.EXPO_PUBLIC_API_URL;
```

## 📊 Performance

### Otimizações
- Lazy loading de screens
- Memoização de componentes
- Otimização de renderização com FlatList
- Cache de imagens com FastImage

### Build Otimizado

```bash
# Android
yarn build:android

# iOS
yarn build:ios
```

## 📚 Documentação Adicional

- [Expo Docs](https://docs.expo.dev)
- [React Native Docs](https://reactnative.dev)
- [React Navigation](https://reactnavigation.org)
- [TypeScript Docs](https://www.typescriptlang.org/docs)

## 🤝 Fluxo de Desenvolvimento

1. Crie uma branch: `git checkout -b feature/nova-feature`
2. Faça suas alterações
3. Commit com mensagem clara: `git commit -m "feat: adicionar nova feature"`
4. Push: `git push origin feature/nova-feature`
5. Abra um Pull Request no GitHub

## 🐛 Debugging

### Hermes Debugger
```bash
yarn start
# Pressione `j` para abrir debugger
```

### React Native Debugger
```bash
# Instalar: https://github.com/jhen0409/react-native-debugger
# Conectar: React Native Debugger → Tools → Set RN Debugger
```

## 📞 Suporte

Para dúvidas ou issues, abra uma issue no repositório principal:
- [podium-monorepo Issues](https://github.com/WellingtonADS/podium-monorepo/issues)

## 📄 Licença

Proprietário: WellingtonADS

---

**Versão:** 1.0.0  
**Última atualização:** 2 de janeiro de 2026

### Executando Testes

```bash
# Executar todos os testes
npm test

# Executar testes em modo watch (útil durante desenvolvimento)
npm run test:watch

# Executar testes com relatório de cobertura
npm run test:coverage
```

### Escrevendo Novos Testes

1. **Testes de Componentes**: Crie arquivos `.test.tsx` em `__tests__/` dentro do diretório do componente

```typescript
import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { MeuComponente } from '../MeuComponente';

describe('MeuComponente', () => {
  it('deve renderizar corretamente', () => {
    const { getByText } = render(<MeuComponente title="Teste" />);
    expect(getByText('Teste')).toBeTruthy();
  });

  it('deve chamar função ao clicar', () => {
    const onPress = jest.fn();
    const { getByText } = render(
      <MeuComponente title="Click" onPress={onPress} />
    );
    
    fireEvent.press(getByText('Click'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });
});
```

2. **Testes de Contextos**: Use `renderHook` para testar hooks e contextos

```typescript
import { renderHook, act } from '@testing-library/react-native';
import { MeuProvider, useMeuContexto } from '../MeuContexto';

describe('MeuContexto', () => {
  const wrapper = ({ children }) => <MeuProvider>{children}</MeuProvider>;

  it('deve fornecer valores iniciais', () => {
    const { result } = renderHook(() => useMeuContexto(), { wrapper });
    expect(result.current.valor).toBe('inicial');
  });
});
```

3. **Testes de Serviços**: Teste funções e lógica de negócio

```typescript
import { minhaFuncao } from '../meuServico';

describe('meuServico', () => {
  it('deve processar dados corretamente', () => {
    const resultado = minhaFuncao('input');
    expect(resultado).toBe('esperado');
  });
});
```

### Mocks Disponíveis

Os seguintes módulos já estão mockados em `jest.setup.js`:

- `expo-secure-store`: Armazenamento seguro
- `expo-location`: GPS e localização
- `react-native-maps`: Mapas
- `@react-navigation/native`: Navegação

Para adicionar novos mocks, edite o arquivo `jest.setup.js` na raiz do projeto.

### Interpretando Resultados

- ✅ **PASS**: Todos os testes do arquivo passaram
- ❌ **FAIL**: Um ou mais testes falharam
- **Cobertura**: Mostra % de código testado (Stmts, Branch, Funcs, Lines)

Meta de cobertura: Manter > 80% para código crítico (componentes, contextos, serviços).


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
- **Tags Git:** `v1.0.0` (primeiro release)
- Siga [Semantic Versioning](https://semver.org/)

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

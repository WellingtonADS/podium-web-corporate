# Podium Monorepo

Documentação centralizada da plataforma de mobilidade Podium.

## Índice

1. [Instalação e Configuração](Instalação-e-Configuração)
2. [Guia de Uso](Guia-de-Uso)
3. [Arquitetura](Arquitetura)
4. [API](API)
5. [Subprojetos](Subprojetos)
6. [Design](Design)
7. [Contribuindo](Contribuindo)
8. [FAQ](FAQ)

---

## Visão Geral

O **Podium** é uma plataforma de mobilidade completa que oferece solução centralizada para gerenciamento de frota de veículos, reservas e mobilidade corporativa.

### Estrutura do Monorepo

O monorepo centraliza os seguintes projetos:

- **podium-backend-api** (Python/FastAPI) — API REST central
- **podium-web-admin** (React/TypeScript) — Dashboard administrativo
- **podium-web-corporate** (React/TypeScript/Vite) — Portal corporativo para empresas
- **podium-web-site** (React/TypeScript/Vite) — Site institucional e landing page
- **podium-mobile-driver** (React Native/Expo) — App mobile para motoristas

### Requisitos

- Node.js 18+ (npm 8+)
- Python 3.11+ (para backend)
- Git 2.40+
- Yarn (gerenciador de pacotes Node)

---

## Links Úteis

- [Integração Web-Corporate](Integração-Web-Corporate)
- [Documentação de Design](Design)
- [Guias de Teste](Testes)

Para informações detalhadas sobre cada tópico, consulte as páginas do wiki listadas acima.

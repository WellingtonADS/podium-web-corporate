# Documentação do Projeto Podium

Esta pasta contém toda a documentação técnica e de suporte do monorepo Podium.

## Estrutura de Arquivos

### 📚 Documentos de Referência Rápida

| Arquivo                                                                | Descrição                                 |
| ---------------------------------------------------------------------- | ----------------------------------------- |
| [guides/inicio-rapido.md](guides/inicio-rapido.md)                     | Guia rápido do Wiki e primeiros passos    |
| [guides/resumo-wiki.md](guides/resumo-wiki.md)                         | Resumo executivo da implementação do Wiki |
| [guides/checklist-implementacao.md](guides/checklist-implementacao.md) | Checklist das tarefas implementadas       |
| [guides/visao-geral-projeto.md](guides/visao-geral-projeto.md)         | Visão geral consolidada do projeto        |

### 🔧 Documentos Técnicos

| Arquivo                                                              | Descrição                                    |
| -------------------------------------------------------------------- | -------------------------------------------- |
| [technical/integracao-completa.md](technical/integracao-completa.md) | Resumo da integração Web-Corporate + Backend |
| [technical/resumo-integracao.md](technical/resumo-integracao.md)     | Análise técnica da integração                |
| [technical/guia-testes.md](technical/guia-testes.md)                 | Guia completo de testes                      |
| [technical/checklist-validacao.md](technical/checklist-validacao.md) | Checklist de validações implementadas        |
| [technical/status-final.md](technical/status-final.md)               | Status final da integração                   |
| [technical/resumo.txt](technical/resumo.txt)                         | Resumo em texto plano                        |

### 📖 Referências

| Arquivo                                                                      | Descrição                    |
| ---------------------------------------------------------------------------- | ---------------------------- |
| [references/stack-tecnologica.md](references/stack-tecnologica.md)           | Stack tecnológica do projeto |
| [references/referencias-opensource.md](references/referencias-opensource.md) | Referências open source      |

### 🎨 Design e Imagens

| Item                                                 | Descrição                                              |
| ---------------------------------------------------- | ------------------------------------------------------ |
| [design/](design/)                                   | Imagens catalogadas (wireframes, mockups, screenshots) |
| [design/indice-imagens.md](design/indice-imagens.md) | Índice das imagens catalogadas                         |

## Como Usar

### Para Começar

1. **Leia primeiro:** [guides/inicio-rapido.md](guides/inicio-rapido.md)

   - Contém instruções rápidas para integrar ao GitHub Wiki

1. **Visão Geral:** [guides/visao-geral-projeto.md](guides/visao-geral-projeto.md)

   - Entenda a estrutura do monorepo
   - Veja links para toda documentação

### Para Integração

1. **Resumo da Implementação:** [guides/resumo-wiki.md](guides/resumo-wiki.md)

   - O que foi feito
   - Como integrar ao GitHub
   - Próximos passos

1. **Checklist:** [guides/checklist-implementacao.md](guides/checklist-implementacao.md)

   - Verificar tarefas concluídas
   - Estatísticas finais
   - Notas importantes

### Para Desenvolvedores

1. **Guias Técnicos:**

   - [technical/integracao-completa.md](technical/integracao-completa.md) — Integração Web-Corporate
   - [technical/guia-testes.md](technical/guia-testes.md) — Como testar
   - [references/stack-tecnologica.md](references/stack-tecnologica.md) — Tecnologias usadas

1. **Design:**

   - [design/indice-imagens.md](design/indice-imagens.md) — Catálogo de imagens
   - [design/](design/) — Wireframes e mockups

## Padrões

### Formatação

Todos os arquivos Markdown seguem:

- Padrão técnico (sem ícones/emojis em conteúdo)
- Formatação validada por `.markdownlint.json`
- Links internos funcionais
- Estrutura clara e hierárquica

### Organização

- **Documentos de suporte** ficam na raiz desta pasta
- **Imagens** ficam em `design/`
- **Índices** são gerados automaticamente
- **Referências** entre documentos usam links relativos

## Manutenção

### Atualizar Documentação

Ao modificar a documentação:

1. Edite o arquivo relevante
1. Atualize a data de "Última atualização"
1. Se adicionar imagens, atualize `design/indice-imagens.md`
1. Se criar novos documentos, adicione ao índice em `guides/visao-geral-projeto.md`

### Validação

A documentação é validada automaticamente via:

- `.github/workflows/validate-docs.yml`
- Verifica formatação Markdown
- Valida links internos
- Confirma estrutura de arquivos

## Wiki do GitHub

As páginas do wiki estão em `../wiki-pages/` e incluem:

- Home
- Instalação e Configuração
- Arquitetura
- API
- Subprojetos
- Design
- Guia de Uso
- Contribuindo
- FAQ
- Testes

Consulte [guides/inicio-rapido.md](guides/inicio-rapido.md) para instruções de integração.

---

**Última atualização:** 03 de janeiro de 2026

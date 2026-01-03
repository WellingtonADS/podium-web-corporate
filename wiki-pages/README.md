# Instruções de Integração com GitHub Wiki

Este diretório contém as páginas de documentação que devem ser integradas ao GitHub Wiki do repositório.

## Como Integrar ao GitHub Wiki

O GitHub Wiki utiliza um repositório `.wiki.git` separado. Você pode integrar as páginas de duas formas:

### Opção 1: Interface Web do GitHub (Recomendado)

1. Vá para o repositório no GitHub
2. Clique na aba **"Wiki"**
3. Para cada arquivo `.md` neste diretório:
   - Clique em **"Create the first page"** (se vazio) ou **"New Page"**
   - Copie o conteúdo do arquivo
   - Cole no editor do GitHub
   - Configure o título (remova `.md` e use espaços em vez de hífens)
   - Clique em **"Save Page"**

### Opção 2: Via Git (Avançado)

```bash
# Clonar o repositório wiki
git clone https://github.com/WellingtonADS/podium-monorepo.wiki.git

# Copiar arquivos para o repositório wiki
cp -r wiki-pages/*.md podium-monorepo.wiki/

# Fazer push dos arquivos
cd podium-monorepo.wiki
git add .
git commit -m "docs: adicionar documentação wiki"
git push origin master
```

## Estrutura de Páginas

| Arquivo                      | Título Wiki               | Descrição                    |
| ---------------------------- | ------------------------- | ---------------------------- |
| Home.md                      | Home                      | Página inicial com índice    |
| Instalação-e-Configuração.md | Instalação e Configuração | Setup do ambiente            |
| Arquitetura.md               | Arquitetura               | Estrutura técnica do projeto |
| API.md                       | API                       | Documentação de endpoints    |
| Subprojetos.md               | Subprojetos               | Detalhes de cada subprojeto  |
| Design.md                    | Design                    | Designs e componentes        |
| Guia-de-Uso.md               | Guia de Uso               | Como usar a plataforma       |
| Contribuindo.md              | Contribuindo              | Diretrizes de contribuição   |
| FAQ.md                       | FAQ                       | Perguntas frequentes         |

## Links Internos no Wiki

No GitHub Wiki, para criar links entre páginas, use:

```markdown
[[Nome da Página]]
```

Por exemplo:

```markdown
Consulte [[Instalação e Configuração]] para setup completo.
```

**Nota:** Os nomes devem corresponder exatamente aos títulos das páginas no Wiki (com espaços, não hífens).

## Dicas

1. **Links Externos:** Use markdown normal `[texto](url)`
2. **Imagens:** Referencie a pasta `podium-docs-assets/design/` do repositório principal
3. **Atualizações:** Quando atualizar arquivos aqui, atualize correspondentemente no Wiki
4. **Índice:** Mantenha links na página Home sincronizados com outras páginas

## Validação

Os arquivos `.md` neste diretório são validados por:

- **Formatação Markdown:** `.markdownlint.json`
- **Links:** Validação de links em CI/CD
- **Nomes de arquivo:** Convenção com hífens em vez de espaços

## Próximos Passos

1. Integre as páginas ao GitHub Wiki
2. Teste os links navegando entre páginas
3. Atualize o README.md principal com link para o Wiki
4. Configure notificações para manter Wiki sincronizado com documentação

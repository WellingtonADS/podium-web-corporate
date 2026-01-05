# Contribuição

Este projeto segue um fluxo simples de versionamento e publicação para garantir estabilidade.

## Fluxo de Branches

- **main**: branch padrão e protegida; apenas merges via Pull Request.
- **release/x.y.z**: branches de release/hotfix preparados para publicar uma versão específica.

## Política de Versionamento (SemVer)

- MAJOR: mudanças incompatíveis com versões anteriores
- MINOR: novas funcionalidades compatíveis
- PATCH: correções de bugs

Ex.: `v0.1.0`, `v0.1.1`.

## Regras para Pull Requests

- PRs sempre de `release/x.y.z` → `main`.
- **Revisão**: mínimo 1 aprovação.
- **Checks**: todos devem passar (tests/CI, se aplicável).
- Resolver todas as conversas antes do merge.
- Usar títulos e descrições claros, com escopo e impacto.

## Commits

- Siga o padrão convencional:
  - `feat: ...` nova funcionalidade
  - `fix: ...` correção
  - `docs: ...` documentação
  - `refactor: ...` refatoração
  - `chore: ...` tarefas gerais

## Releases

1. Crie branch: `release/x.y.z` a partir de `main`.
2. Faça commits de hotfixes.
3. Abra PR para `main`.
4. Após merge, crie a tag `vx.y.z` e publique.

## Proteções de Branch (GitHub)

Configure em Settings → Branches → Branch protection rules:
- `main`:
  - Require pull request before merging
  - Require approvals (≥1)
  - Require status checks to pass (se houver CI)
  - Require conversation resolution
  - Require linear history
  - Restrict who can push (opcional, apenas admins)
- `release/*`:
  - Restrict direct push; permitir apenas merges via PR.

## Como rodar localmente

Consulte o `README.md` para instalação, variáveis `.env` e execução da API.

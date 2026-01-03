# Guia de Uso

Guia prático para usar a plataforma Podium.

## Índice

1. [Web-Admin](#web-admin)
2. [Web-Corporate](#web-corporate)
3. [Mobile-Driver](#mobile-driver)

---

## Web-Admin

Dashboard administrativo para gerenciar a plataforma Podium.

### Login

```
URL: http://localhost:3000
Usuário: admin@podium.com
Senha: admin123
```

### Dashboard

A página inicial exibe:

- Número total de veículos
- Veículos disponíveis
- Reservas ativas
- Estatísticas gerais

### Gerenciar Usuários

**Seção:** Menu → Usuários

Ações disponíveis:

1. **Listar Usuários**

   - Visualizar tabela de usuários
   - Filtrar por status (ativo/inativo)
   - Paginar resultados

2. **Criar Novo Usuário**

   - Clique em "Novo Usuário"
   - Preencha email, nome completo
   - Defina senha (mínimo 8 caracteres)
   - Clique em "Criar"

3. **Editar Usuário**

   - Clique no usuário na tabela
   - Altere informações desejadas
   - Clique em "Salvar"

4. **Desativar Usuário**
   - Acione toggle "Ativo/Inativo"
   - Confirme operação

### Gerenciar Veículos

**Seção:** Menu → Veículos

Ações disponíveis:

1. **Listar Veículos**

   - Visualizar grid de veículos
   - Filtrar por status (disponível/ocupado)
   - Buscar por placa ou modelo

2. **Adicionar Veículo**

   - Clique em "Adicionar Veículo"
   - Preencha:
     - Placa (ex: ABC-1234)
     - Modelo (ex: Toyota Corolla)
     - Localização
   - Clique em "Salvar"

3. **Editar Veículo**

   - Clique no card do veículo
   - Altere informações
   - Clique em "Salvar"

4. **Marcar como Indisponível**
   - Clique em "Status" no card
   - Selecione "Indisponível"
   - Confirme

### Visualizar Reservas

**Seção:** Menu → Reservas

- Filtrar por data, usuário, veículo
- Visualizar detalhes da reserva
- Cancelar reserva se necessário
- Exportar relatório

---

## Web-Corporate

Portal corporativo para empresas.

### Login

```
URL: http://localhost:5173
Usuário: empresa@podium.com
Senha: empresa123
```

### Página Inicial

Exibe:

- Bem-vindo ao portal corporativo
- Links para funcionalidades principais
- Informações de conta

### Visualizar Veículos Disponíveis

**Seção:** Menu → Veículos

1. **Filtrar Veículos**

   - Selecione data inicial
   - Selecione data final
   - Clique em "Filtrar"

2. **Informações do Veículo**

   - Modelo e placa
   - Localização
   - Disponibilidade

3. **Reservar Veículo**
   - Clique em "Reservar" no card
   - Confirme datas
   - Preencha formulário
   - Clique em "Confirmar Reserva"

### Gerenciar Funcionários

**Seção:** Menu → Funcionários

1. **Listar Funcionários**

   - Visualizar dropdown de funcionários
   - Pesquisar por nome/email

2. **Adicionar Funcionário**
   - Clique em "Adicionar"
   - Preencha nome, email
   - Selecione centro de custo
   - Clique em "Salvar"

### Gerenciar Centros de Custo

**Seção:** Menu → Centros de Custo

1. **Listar Centros de Custo**

   - Visualizar centros de custo cadastrados
   - Ver responsáveis

2. **Criar Centro de Custo**
   - Clique em "Novo Centro"
   - Preencha nome
   - Atribua responsável
   - Clique em "Criar"

### Dashboard Corporativo

**Seção:** Menu → Dashboard

Visualiza:

- Total de veículos da empresa
- Veículos disponíveis agora
- Reservas ativas
- Histórico de reservas
- Gráficos de uso

### Histórico de Reservas

**Seção:** Menu → Minhas Reservas

1. **Listar Minhas Reservas**

   - Data da reserva
   - Veículo
   - Período
   - Status

2. **Cancelar Reserva**
   - Clique em "Cancelar"
   - Confirme operação
   - Reserva será cancelada

---

## Mobile-Driver

App mobile para motoristas.

### Login

```
Email: driver@podium.com
Senha: driver123
```

### Tela Inicial

Exibe:

- Status de disponibilidade
- Viagens atribuídas
- Histórico de corridas
- Perfil do motorista

### Viagens Atribuídas

1. **Visualizar Viagem**

   - Toque na viagem na lista
   - Visualize detalhes:
     - Passageiro
     - Localização de origem
     - Localização de destino
     - Horário

2. **Iniciar Viagem**

   - Toque em "Iniciar"
   - Sistema ativa navegação GPS
   - Confirme quando chegou

3. **Finalizar Viagem**
   - Toque em "Finalizar"
   - Sistema solicita confirmação
   - Viagem é registrada no histórico

### Localização em Tempo Real

- Sistema rastreia localização do motorista
- Atualizações a cada 10 segundos
- Compartilhada com empresa

### Perfil

1. **Visualizar Informações**

   - Nome completo
   - Email
   - Número de viagens
   - Avaliação

2. **Editar Perfil**
   - Toque em "Editar"
   - Altere informações
   - Toque em "Salvar"

### Histórico de Viagens

1. **Listar Viagens**

   - Visualize viagens realizadas
   - Ordene por data
   - Visualize detalhes

2. **Avaliação**
   - Visualize avaliação recebida
   - Comentários de passageiros

---

## Tarefas Comuns

### Como alterar senha?

**Web-Admin / Web-Corporate:**

1. Clique em seu avatar no canto superior direito
2. Clique em "Configurações"
3. Clique em "Alterar Senha"
4. Digite senha atual
5. Digite nova senha (2x)
6. Clique em "Salvar"

**Mobile:**

1. Menu → Perfil
2. Toque em "Alterar Senha"
3. Digite senha atual
4. Digite nova senha (2x)
5. Toque em "Salvar"

### Como relatório de problema?

1. Clique em "Ajuda" no menu
2. Clique em "Relatar Problema"
3. Descreva o problema
4. Clique em "Enviar"
5. Você receberá um ticket de suporte

### Como exportar dados?

**Web-Admin:**

1. Vá para a seção desejada (Usuários, Veículos, etc)
2. Clique em "Exportar"
3. Selecione formato (CSV, Excel, PDF)
4. Clique em "Baixar"

### Como desativar minha conta?

**Web-Admin / Web-Corporate:**

1. Clique em seu avatar
2. Clique em "Configurações"
3. Clique em "Desativar Conta"
4. Digite sua senha para confirmar
5. Clique em "Desativar"

---

## Troubleshooting

### Não consigo fazer login

- Verifique se o backend está rodando
- Verifique credenciais (usuário/senha)
- Tente limpar cache/cookies do navegador
- Tente em modo incógnito

### Página carrega muito lentamente

- Verifique conexão de internet
- Feche outras abas/aplicações
- Limpe cache do navegador
- Atualize a página

### Erro ao criar nova reserva

- Verifique se há veículos disponíveis na data selecionada
- Verifique se suas informações de centro de custo estão completas
- Tente novamente em alguns minutos

### App mobile não conecta ao backend

- Verifique conexão WiFi/dados
- Verifique URL da API em `.env`
- Tente reiniciar o app
- Verifique se o backend está rodando

---

## Próximos Passos

- Consulte [FAQ](FAQ) para perguntas frequentes
- Veja [API](API) para documentação técnica
- Acesse [Contribuindo](Contribuindo) para enviar feedback

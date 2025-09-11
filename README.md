🚗 Sistema de Aluguel de Carros – Histórias de Usuário

Este documento descreve as histórias de usuário e seus critérios de aceitação para o Sistema de Aluguel de Carros, com base no diagrama de classes e nos requisitos levantados.


📜 Histórias de Usuário



| ID  | História de Usuário                                         | Critérios de Aceitação                                                                                                                                     |
|-----|-------------------------------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------|
| US1 | **Cadastro de Cliente**<br>Como um novo usuário, quero me cadastrar no sistema para ter acesso às funcionalidades de aluguel de automóveis. | - Deve ser possível inserir todos os dados obrigatórios.<br>- O sistema deve validar os campos antes de salvar.<br>- O cliente deve acessar sua conta após cadastro. |
| US2 | **Criação de Pedido de Aluguel**<br>Como cliente, quero criar um pedido de aluguel para reservar um automóvel. | - Pedido vinculado a cliente e veículo existente.<br>- Sistema deve verificar disponibilidade do veículo.<br>- Pedido deve iniciar com status "Pendente". |
| US3 | **Consulta de Pedidos e Status**<br>Como cliente, quero visualizar meus pedidos e status para acompanhar minhas solicitações. | - Tela deve exibir todos os pedidos do cliente.<br>- Permitir filtro por período ou status.                                                                |
| US4 | **Modificação de Pedido**<br>Como cliente, quero editar informações de um pedido antes da aprovação.          | - Pedido só pode ser editado enquanto estiver "Pendente".<br>- Alterações de datas e veículo devem ser validadas.                                           |
| US5 | **Cancelamento de Pedido**<br>Como cliente, quero cancelar um pedido que não desejo mais concluir.             | - Pedido só pode ser cancelado se não estiver aprovado.<br>- Status deve mudar para "Cancelado".                                                            |
| US6 | **Análise Financeira do Pedido**<br>Como agente financeiro, quero analisar um pedido para verificar viabilidade. | - Agente deve acessar dados do cliente e pedido.<br>- Sistema deve registrar a decisão: "Aprovado" ou "Reprovado".                                          |
| US7 | **Aprovação e Geração de Contrato**<br>Como agente, quero aprovar o pedido e gerar contrato automaticamente.    | - Contrato só para pedidos aprovados.<br>- Documento deve conter dados do cliente, veículo, período e valor.<br>- Contrato associado ao pedido aprovado.    |
| US8 | **Gestão de Automóveis**<br>Como empresário, quero cadastrar, editar e remover veículos para manter a frota atualizada. | - Cadastrar veículos com dados completos.<br>- Remoção apenas se veículo não tiver contrato ativo.<br>- Alterações devem refletir nos pedidos.               |
| US9 | **Autenticação e Perfis de Acesso**<br>Como usuário, quero acessar o sistema com login e senha para segurança.  | - Sistema deve validar login e senha.<br>- Perfis devem ter permissões distintas.<br>- Mensagem de erro para login inválido.                                 |

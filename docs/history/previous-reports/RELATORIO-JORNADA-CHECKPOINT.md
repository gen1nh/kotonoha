# Kotonoha — Continuação da jornada guiada

## Implementado
- Ao concluir a fila de revisão, o botão contextual abre diretamente o checkpoint da etapa atual quando ela está pronta.
- O componente da trilha recebe o pedido de abertura e valida se a etapa está desbloqueada, se houve exposição ao conteúdo e se existem questões suficientes.
- Se ainda não há checkpoint disponível, o botão continua levando à trilha.
- Nenhuma sincronização em nuvem foi adicionada.

## Validação
- `npm test`: 36/36 aprovados.
- `npm ci` excedeu o tempo disponível; build de produção e Playwright não executados.
- Áudio no Safari iOS e fluxos mobile ainda precisam de testes reais.

## Observações
- A passagem por revisão não equivale a domínio; o checkpoint continua exigindo aprovação.
- Esta entrega não deve ser considerada homologação completa para produção.

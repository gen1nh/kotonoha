# Kotonoha — Jornada guiada (continuação)

## Implementado
- Uma próxima ação determinística para a Home: estudar, realizar checkpoint ou revisar a trilha.
- Ao atingir a condição de exposição e haver cinco questões, a Home encaminha à trilha para avaliação.
- Depois de checkpoint aprovado, a Home aponta para a próxima lição.
- Mensagens contextuais na timeline para estudo e avaliação.
- Três testes de regressão para a jornada guiada.
- Não foi adicionada sincronização remota.

## Verificação
- `npm test`: 36/36 aprovados.
- `npm run build`: não executável neste ambiente (`vite: not found`, dependências não instaladas).
- Playwright, iOS Safari e testes de UX em dispositivo: não executados.

## Limites
- O checkpoint ainda exige retorno à trilha, não abre automaticamente em um modal pela Home.
- O critério de exposição ainda depende de cartões vistos, não de domínio prévio.
- Ainda falta homologação de produção e validação em iPhone real.

# Kotonoha — Revisão de continuidade (fases 8–10)

## Alterações efetivamente aplicadas nesta entrega
- Mantida a meta diária configurável de 1–3 atividades e a contagem por ações reais da fase anterior.
- Safari/iOS: retenção da instância `SpeechSynthesisUtterance` durante a fala, evitando descarte prematuro por coleta de lixo; limpeza da referência ao encerrar/errar.
- Layout mobile: cabeçalho com melhor quebra e espaçamento, XP oculto em telas estreitas para evitar sobreposição, fundo e sidebar com tokens semânticos compatíveis com tema escuro.
- Área de estudo: margem inferior segura para navegação fixa e proteção contra overflow horizontal.
- Trilha: rótulo acessível para etapas bloqueadas, indicando o pré-requisito.
- Home: texto da meta diária simplificado.

## Verificações
- `npm test`: 27/27 passaram.
- `npm run build`: não executável sem `vite` instalado; `npm ci` não concluiu dentro do limite do ambiente.
- Playwright e Safari iOS: não executados; áudio requer teste em dispositivo físico.

## Limitações / pendências antes de chamar de versão 1.0
- Inspecionar os fluxos de aprendizagem em navegador e dispositivos reais, especialmente a transição entre lições N5 e ferramentas.
- Validar acessibilidade com axe e teste por teclado/leitor de tela.
- Confirmar áudio japonês em Safari iOS, incluindo disponibilidade das vozes no sistema.
- Confirmar compatibilidade visual de todos os laboratórios em telas pequenas e modo escuro.
- Executar `npm ci && npm run build && npm run test:e2e` em ambiente com dependências instaladas.
- A expansão integral N5–N1 e sincronização entre dispositivos não estão incluídas.

## Atenção
Esta entrega é incremental e não foi homologada para produção. Os testes unitários não substituem a validação funcional e visual.

# QA e homologação — Kotonoha

## Testes automatizados

Com Node.js 22.12+ e acesso às dependências npm:

```bash
npm ci
npm test
npm run build
npx playwright install --with-deps chromium webkit
npm run test:e2e
```

No CI (`.github/workflows/quality.yml`) os comandos executam automaticamente a cada push/pull request. **A existência do pipeline não equivale a um build aprovado neste ambiente**.

## Matriz de aceite antes de publicar

| Área | Passos a validar | Aprovação |
| --- | --- | --- |
| Iniciante | Instalar/abrir → onboarding → próxima microlição | Sem escolher entre múltiplas trilhas |
| Fluxo | Estudar → praticar cartões → checkpoint → próxima | Sem tela errada, sem aula duplicada |
| Bloqueio | Alterar filtro N1 na Biblioteca, depois abrir rota de N1 | Nível de consulta não desbloqueia nada |
| Gramática | Estudar um tópico e voltar | Outros tópicos não aparecem concluídos |
| Retomada | Responder parte da avaliação, fechar e reabrir | Alternativas preservadas |
| SRS | Criar cartão no Caderno e abrir revisão geral | Novo cartão elegível |
| Metas | Concluir checkpoint e revisar; tentar novamente | Sem atividade duplicada ou XP indevido |
| Backup | Importar arquivo legado com notas/cartões/checkpoints | Dados preservados e migração versionada |
| Navegação | Abas, botão Voltar, refresh e URL direta | Destino/contexto corretos |
| Offline | Instalar PWA, carregar uma vez, desligar conexão | Trilha básica funciona; recursos remotos sinalizados |
| Acessibilidade | Tab, Enter, setas de abas, foco em diálogos, leitor de tela | Sem armadilha de foco, foco visível |
| Dark | Home, Trilha, Lição, Caderno, laboratórios, modais | Contraste e elementos consistentes |
| 320–430px | Pequeno iPhone/Android, retrato e landscape | Sem scroll lateral, CTA alcançável |
| iOS físico | Voz japonesa, alternar apps, microfone, reabrir gravação | Reprodução e encerramento sem falha |
| Canvas | Desenhar com dedo, rotação, limpar e desfazer | Indicadores não interceptam traços |
| Teclado iOS | Texto no caderno, busca, modal | Campo e botão permanecem acessíveis |
| Impressão | Exercício no papel em A4 | Só folha de atividade é impressa |

## Ambientes e evidências

- **Unitários:** Node nativo (`tests/*.test.js`).
- **E2E:** Chromium desktop e WebKit em emulação iPhone (`tests/browser/flows.spec.js`). O WebKit do Playwright não substitui Safari real instalado num iPhone.
- **Capturas:** screenshot de Home, Trilha, Lição, Revisão, Caderno e Configurações em 320×568, 375×812, 390×844, 430×932, 768×1024 e 1440×900, claro e escuro.
- **Axe:** verificar violações críticas/graves; revisão manual complementar de contraste, VoiceOver, foco e teclado.
- **Evidência de release:** gravar hash do commit, testes, browser/OS e data do teste; qualquer falha P1 bloqueia publicação.

## Limitação conhecida nesta execução

O projeto foi validado por **56 testes unitários** e parsing de JSX/JS, mas a instalação npm não pôde ser concluída no ambiente de geração. Build Vite e testes Playwright/WebKit não foram executados; áudio/gravação e PWA no iPhone físico precisam ser homologados separadamente.

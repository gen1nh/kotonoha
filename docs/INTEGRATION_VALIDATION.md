# Integração e validação local — 2026-10-13

O pacote `kotonoha-pessoal-voz-nativa-n5.zip` foi integrado sobre `d10d356` na branch `feat/pedagogical-engine-foundation`, preservando a `main` em `7cb261a`.

- O checkout estava limpo; não havia alterações não commitadas. Um Git bundle com o histórico e as refs anteriores foi criado e verificado antes da integração.
- Arquivos do pacote foram incorporados, evitando diferenças apenas de fim de linha. Componentes antigos foram arquivados em `docs/history/legacy-components`.
- A versão permanece `0.9.0`; a integração não libera o N5 como curso certificado nem autoriza publicação da versão 1.0.
- O teste de persistência do checkpoint passou a aguardar a escrita assíncrona de 250 ms com `expect.poll`, mantendo a verificação da atividade diária salva.
- `vercel.json` desativa deploys automáticos somente de `feat/pedagogical-engine-foundation`. Merge e publicação dependem de autorização separada.

## Resultados no Windows

| Verificação | Resultado |
| --- | --- |
| `npm ci` | Aprovado; 357 pacotes instalados, 0 vulnerabilidades reportadas |
| `npm test` | 82 aprovados, 0 falhas |
| `npm run build` | Aprovado; PWA gerada |
| `npx playwright test` | 15 aprovados, 1 ignorado, 0 falhas em Chromium e WebKit |
| `npm run dev -- --port 5173 --strictPort` | Servidor local iniciado em `http://127.0.0.1:5173/` |
| `npm run audit:n5-release` | Bloqueio esperado: 0 itens editoriais aprovados; faltam ao menos 20 por habilidade e cobertura de competências |

O E2E cobre microlição, revisão, checkpoint, retomada após recarga, navegação, controle de acesso, tema, backup, desenho, responsividade, acessibilidade e PWA offline em Chromium. O caso offline em WebKit é ignorado explicitamente pela suíte.

## Limitações restantes

- O build avisa sobre um pacote JavaScript de aproximadamente 526 kB minificado; não impede compilação.
- O npm avisa que a dependência transitiva `glob@11.1.0` está obsoleta; a auditoria desta instalação reportou zero vulnerabilidades.
- WebKit automatizado no Windows não substitui Safari em iPhone físico. Voz japonesa audível, microfone e retomada de áudio precisam de teste no aparelho.
- Questões editoriais e áudio para a prova de passagem N5 → N4 continuam pendentes. A prática com voz sintética é formativa.

Documentação Vercel usada para impedir o deploy desta branch: https://vercel.com/docs/project-configuration/git-configuration#git.deploymentenabled.

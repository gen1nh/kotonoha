# Kotonoha pessoal — áudio sem infraestrutura própria

## Objetivo

O objetivo da v1.0 pessoal é aprender N5 com app estático, PWA, progresso local e voz japonesa provida pelo dispositivo. Não precisamos de VOICEVOX, áudio hospedado, conta, backend ou chave de API para as aulas e exercícios formativos.

## Implementação da experiência

- `src/speech.js` centraliza a síntese japonesa via `speechSynthesis` e a seleção de vozes `ja`, respeitando acionamento por clique (Safari/iOS).
- `src/components/N5ListeningPractice.jsx` oferece prática opcional N5 sem arquivos de áudio nem servidor; transcript pode ser revelada manualmente em caso de problema de acessibilidade. Nesse caso o resultado **não** é tratado como evidência auditiva.
- `src/pedagogy/formativeListening.js` contém seis atividades autorais de demonstração **não certificadoras**. A nota não libera níveis, não alimenta provas e não representa o JLPT.
- Vozes podem precisar de download ou rede. A síntese offline e a qualidade do áudio não são garantidas universalmente; validar em Safari/iOS e dispositivos Android antes da v1.0.

## Limite de certificação

A prova abrangente N5 (`engine.js`, `readiness.js`) continua exigindo itens auditivos editoralmente aprovados com gravações de qualidade suficiente. Não substituir esse requisito por TTS de forma silenciosa. A prova de passagem N5 → N4 permanece BLOQUEADA enquanto o conteúdo não for validado. Exercícios formativos não equivalem ao exame.

## Integração no GitHub

O último ZIP refatorado ainda difere da branch `main`. Os arquivos do pacote devem ser reconciliados e verificados no pull request antes do merge. Não substituir `.git`, não fazer merge automático, não publicar como `1.0.0` até homologação.

## Testes

`npm test` (82/82 no ambiente local). `npm run audit:n5-release` deve falhar intencionalmente enquanto o banco certificado estiver incompleto. O build e o Playwright dependem de instalar as dependências com `npm ci` em ambiente que tenha acesso ao registro do npm.

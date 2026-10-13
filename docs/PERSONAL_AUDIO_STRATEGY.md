# Kotonoha pessoal — estratégia de áudio sem infraestrutura própria

> Atualização de 2026-10-13: o ZIP foi integrado em `feat/pedagogical-engine-foundation`. A validação atual está em [INTEGRATION_VALIDATION.md](INTEGRATION_VALIDATION.md); as referências abaixo ao pacote ainda separado descrevem o estado anterior à integração. A `main` permanece inalterada.

## Visão
O Kotonoha é um projeto pessoal gratuito, com PWA estático, estudo N5–N1 progressivo e progresso local. Não usar VOICEVOX, conta, servidor de áudio, armazenamento de mídia ou IA paga como dependências obrigatórias da aprendizagem.

## Implementação introduzida nesta branch
- `src/speech.js`: síntese nativa japonesa com `speechSynthesis`, preferência por voz local ja-JP e manejo de interrupções, sem rede, serviço externo ou chave de API.
- `src/pedagogy/formativeListening.js`: seis exercícios autorais de escuta N5; resultados marcados como *formativos*, nunca certificadores.
- `src/components/N5ListeningPractice.jsx`: ouvir, responder, ajustar voz e velocidade e consultar transcrição quando falhar. Mostrar transcrição muda classificação para prática de leitura.
- O hub Praticar recebeu o componente; o App reutiliza o adaptador.
- `tests/speech-formative.test.js`: testes de seleção de voz, indisponibilidade, limite de velocidade e separação entre prática e certificação.

## Limitações honestas
1. As vozes dependem do navegador/SO; podem não existir ou exigir instalação de pacote de idioma/conectividade. No iPhone/Safari o usuário deve testar em dispositivo real. O código chama `speak()` durante um clique, evitando timers assíncronos que podem quebrar ativação de áudio.
2. Voz sintética não substitui áudio gravado e revisado para uma avaliação abrangente equivalente à compreensão auditiva JLPT.
3. A certificação interna N5 e o avanço para N4 **continuam bloqueados** até existir banco editorial suficientemente abrangente e aprovado. Não afrouxar o gate apenas para poder lançar uma versão de estudo pessoal.
4. Não há login, nuvem, mídia hospedada ou arquivo de áudio novo. Cada usuário mantém suas preferências e progresso no próprio navegador.
5. GitHub `main` e o último ZIP refatorado ainda não foram completamente conciliados. O pacote refatorado entregue na conversa é mais completo que esta branch. Não mesclar PR sem resolver essa diferença e validar build/Playwright.

## Validação
No pacote ZIP refatorado local: 82/82 testes unitários aprovados; 77 arquivos de código JS/JSX analisados sintaticamente sem erros. Auditoria N5 falha intencionalmente com 0 itens editoralmente aprovados. Build Vite indisponível no ambiente de preparação (dependência npm sem cache).

## Comandos
```bash
npm ci
npm test
npm run build
npm run test:e2e
npm run audit:n5-release
```

Último comando falha até que as avaliações cumpram a cobertura mínima.

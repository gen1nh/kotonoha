# Kotonoha — Reestruturação UX (Fase 5)

## Implementado
- Navegação primária em Início, Trilha, Praticar e Revisar; biblioteca e currículo detalhado permanecem acessíveis por fluxos secundários.
- Timeline de aprendizagem por nível com indicador de conclusão, próximo passo e etapas futuras visualmente bloqueadas.
- Tema claro/escuro/sistema com preferência local, usando tokens semânticos existentes.
- Indicadores de caligrafia deixam de capturar gestos e o canvas recebe os eventos de desenho no iOS.
- Botões de prévia de LINE e Pitch bloqueados para N5 no hub de prática.
- Reprodução via speechSynthesis seleciona voz japonesa quando disponível e informa falhas.
- Ajuste de padding e scroll para safe area da navegação móvel.

## Verificação
- npm test: 22/22 aprovados.
- Build e testes Playwright não executados nesta etapa por ausência de dependências instaladas.
- Compatibilidade de áudio com iOS real não validada; vozes dependem da instalação/configuração do dispositivo.

## Pendências importantes
- Refatorar a Home inteira: há seções redundantes e a meta diária ainda é baseada em minutos.
- Fazer testes visuais e de acessibilidade em Safari iOS e Android.
- Revisar bloqueios também nas rotas diretas (não apenas nos botões do hub).
- Rever progressão N5: conclusão atual de algumas etapas depende de cartões vistos, não de domínio comprovado.
- Uniformizar todos os ícones e revisar contraste de todas as combinações no tema escuro.
- Sincronização entre aparelhos requer backend e autenticação; currículo N5–N1 ainda não é completo.

Esta entrega é incremental, não uma validação de produção.

## 0.9.1 — Trilha N5 pessoal ampliada (candidata)

- 220 unidades com exercícios de kana, vocabulário, kanji, gramática, leitura e escuta.
- 554 vocábulos e 105 kanji em contexto; 46 tópicos gramaticais; 25 leituras e 40 escutas formativas.
- Reforço das atividades com voz nativa do aparelho, sem arquivos ou backend.
- Revisão final pessoal de 32 questões, resultado por competência e retomada por backup; não certificadora.
- Agrupamento da Trilha em capítulos, evitando uma lista contínua de centenas de cartões.
- Compatibilidade retroativa: aprovações antigas não desbloqueiam conteúdo expandido.
- Auditoria estrutural N5 separada do gate de certificação, que continua bloqueado.
- A publicação de 1.0 continua sujeita a revisão linguística e testes completos.

# Histórico de alterações do Kotonoha

## 0.9.0 — 13/10/2026 — Refatoração de arquitetura (pré-homologação)

- Trilha única para curso guiado, com microlições N5 por competência e checkpoints de 80%.
- Sessão guiada paralela retirada do app ativo; prática livre não decide mais conteúdo do curso.
- Biblioteca como referência; consulta N1 não muda desbloqueios.
- Corrigido registro de gramática por tópico, em vez de marcar vários conteúdos por uma resposta.
- Checkpoints com rascunhos e variação por tentativa, preservando progresso legado.
- Revisão com lotes menores e cartões pessoais recém-criados elegíveis.
- Unificadas as áreas de Caderno/erros, separadas a meta diária e a proficiência.
- Melhorados persistência local e backup versionado; falhas de gravação têm alerta e exportação de emergência.
- Restauradas Nunito e M PLUS Rounded 1c; tokens de contraste e CSS mobile atualizado.
- Ajustadas gravação de voz e síntese TTS com tratamentos de compatibilidade, ainda não homologados em aparelho iOS real.
- Atualizados testes de lógica, testes E2E de Chromium/WebKit, CI e documentação.
- Sem autenticação nem sincronização em nuvem.

**Verificação local:** 56 testes unitários aprovados; build e E2E aguardam instalação npm e validação no navegador.

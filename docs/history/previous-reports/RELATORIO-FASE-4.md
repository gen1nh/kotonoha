# Kotonoha — Fase 4 (entrega incremental)

## Implementado nesta entrega
- Banco autoral de 12 questões introdutórias N5 (`src/n5Questions.js`), com alternativas, gabarito e explicação.
- Diagnóstico N5 agora utiliza oito questões em vez de apenas uma. Continua sendo prática exploratória, **não é avaliação JLPT calibrada**.
- Dois testes adicionais de integridade do banco e correção do diagnóstico.
- Pipeline GitHub Actions (`.github/workflows/quality.yml`) para instalar dependências, testar, gerar build e executar Playwright Chromium em pushes e pull requests.

## Verificações
- `npm test`: 22/22 testes aprovados.
- `npm ci`: não foi concluído no ambiente (timeout de transporte); por isso build e Playwright **não foram verificados localmente**.

## Ainda pendente / requer decisões externas
- Sincronização automática entre aparelhos: requer provedor remoto, autenticação, autorização de acesso, política de conflito e implantação; não foi incluída uma solução insegura ou fictícia.
- Conteúdo completo N5–N1: demanda centenas de unidades e revisão por especialista, além de licenciamento das questões oficiais.
- Testes manuais de Safari iOS e Chrome Android e auditoria visual completa: exigem execução em dispositivos/navegadores.
- Pipeline CI só comprovará build e testes E2E quando for executado no GitHub.

Não publicar como versão final sem confirmar os testes de produção e revisar o conteúdo pedagógico.

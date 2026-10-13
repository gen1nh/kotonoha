# Kotonoha — Fase 3: melhorias pedagógicas verificáveis

## Implementado
- Autoavaliação autoral por nível N5–N1 usando questões existentes no currículo, com explicações após envio.
- Persistência de histórico de resultados, limitada aos últimos 30 registros e validada na importação.
- Exercícios orientados para prática no papel e impressão, reutilizando conteúdo autoral existente.
- Três testes de integridade das questões, pontuação e persistência.
- 20/20 testes unitários aprovados (`npm test`).

## Limites e pendências
- O diagnóstico é uma amostra não calibrada; NÃO equivale a prova oficial nem estima chance de aprovação.
- N5 tem apenas uma questão disponível nesse banco; expandir e revisar pedagogicamente antes de utilizar como avaliação de nível.
- Sincronização entre dispositivos NÃO implementada: precisa de serviço remoto, autenticação, gestão de conflitos e consentimento de usuário. Backups locais permanecem disponíveis.
- Currículo integral N5–N1 e provas anteriores NÃO incluídos; exigem elaboração, revisão pedagógica e checagem de direitos de reprodução.
- Não foi possível verificar build nem testes de navegador: instalação de dependências expirou no ambiente.
- Não foram realizados testes manuais em Safari iOS e Chrome Android.

## Próximas verificações
`npm ci && npm test && npm run build && npm run test:e2e`

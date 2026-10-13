# Alterações da auditoria — Kotonoha

## Implementado
- Proteção contra sobrescrita automática do armazenamento local quando o JSON existente não pode ser lido; aviso e download dos dados brutos, com opção de restaurar um backup válido.
- Navegação principal sincronizada com URL e histórico do navegador (query `view`).
- Retomada de sessões guiadas com lição, etapa, cartões de aquecimento, resposta e duração; limpeza após conclusão.
- Validação de sessão salva na normalização de backups e descarte de referências de cartões inexistentes.
- IA: indicação explícita de necessidade de chave Groq em produção, timeout e validação de resposta.
- Testes adicionais para recuperação de sessão.

## Limitações / pendências
- O ambiente não contém todas as dependências npm em cache; o build Vite e Playwright não puderam ser executados.
- Não foi implementado backend hospedado, sincronização entre dispositivos, nem conteúdo JLPT N5–N1 completo. Dependem de decisões de infraestrutura, curadoria e direitos de reprodução.
- Integração Groq continua usando chave pessoal em sessionStorage e chamada direta pelo navegador. Não inserir chave compartilhada ou secreta no frontend.
- Revisão visual e teste manual mobile precisam ocorrer com aplicação executada.
- A recuperação automática cobre JSON inválido; outras falhas de armazenamento podem requerer procedimento manual.

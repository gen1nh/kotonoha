# Kotonoha — fase 2 (auditoria e melhorias)

## Implementado nesta entrega
- Indicadores separados de retenção estimada por flashcards: novos, em aprendizado, com dificuldade e estáveis, com contagem de revisões pendentes. Autoavaliação não é prova de domínio nem pontuação JLPT.
- Recomendação de próxima ação na página inicial, priorizando revisões vencidas, depois conteúdo novo.
- Status online/offline na barra superior, atualizado por eventos do navegador. Indica conectividade reportada pelo browser, não disponibilidade real de serviços.
- Importação de backup com resumo do nível e número de revisões e confirmação explícita de substituição.
- Tutor de IA identificado como personagem fictício, sem credenciais profissionais inventadas.
- Três testes automatizados adicionais para indicadores e recomendação de revisão.

## Verificações
- `npm test`: 17 testes passaram.
- `npm run build`: não executado com sucesso: Vite não está instalado neste ambiente; instalação npm indisponível. Portanto a compilação React/JSX e os testes Playwright continuam não verificados.

## Limitações importantes
- Sincronização automática entre dispositivos exige uma infraestrutura/autenticação (ou provedor escolhido); não foi implementada. Exportação/importação manual permanece disponível.
- Conteúdo completo e curado N5–N1 e provas anteriores não foram adicionados: precisam de elaboração pedagógica e verificação de direitos de uso.
- Não foi realizada revisão visual completa em navegadores móveis nem teste de acessibilidade com browser.
- O modo Groq requer chave pessoal e internet; não foi adicionado proxy hospedado com segredo de servidor.
- Não confundir `stable` (intervalo SRS) com proficiência validada em exame.

## Próximos passos antes do deploy
1. Em máquina com acesso ao npm: `npm ci` (se lockfile compatível) ou `npm install`.
2. `npm test`, `npm run build`, `npm run test:e2e`.
3. Testar Safari iOS e Chrome Android, inclusive uso offline e atualizações PWA.
4. Escolher backend/provedor e política de autenticação para sincronização opcional.
5. Revisar conteúdo com fontes pedagógicas confiáveis e não publicar provas oficiais sem licença.

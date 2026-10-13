# Fase 6 — Home orientada à trilha

## Implementado
- Home simplificada para um próximo passo único, vinculado à primeira lição não concluída do nível atual.
- Progresso da trilha calculado por lições efetivamente concluídas.
- Meta diária explícita e verificável: responder à questão diária (0/1 ou 1/1), sem equiparar tempo de estudo a aprendizagem.
- Revisões vencidas separadas da meta e acesso à prática livre agrupado.
- Removidos atalhos redundantes de seis laboratórios na Home; disponíveis pela Central de Prática.
- Proteção adicional na navegação interna para laboratórios LINE e Pitch Accent no N5.

## Verificação
- `npm test`: 22/22 aprovados.
- Build Vite e Playwright não executados: dependências de frontend indisponíveis neste ambiente.

## Pendências importantes
- Testes visuais em iOS Safari, especialmente áudio, caligrafia e safe areas.
- Guardar também URLs digitadas diretamente e navegação via histórico, de modo coerente com pré-requisitos de currículo.
- Transformar meta diária em escolha configurável de atividades de aprendizagem e registrar sua conclusão com eventos datados.
- Revisar o mapeamento de lições N5 para páginas específicas (hoje os tópicos levam à biblioteca de aprendizado).
- Sincronização remota opcional e currículo N5–N1 validado não incluídos nesta etapa.

# Ajustes do fluxo pedagógico

- A trilha N5 separa Hiragana e Katakana em etapas diferentes, seguidas de vocabulário e gramática.
- A conclusão de uma etapa de kana verifica apenas cartões do próprio alfabeto; antes, a etapa única misturava os dois alfabetos.
- Biblioteca agora oferece uma ação contextual de prática com cartões, filtrando o tipo correspondente para hiragana, katakana e vocabulário; gramática abre revisão geral.
- Texto redundante de etapas da timeline simplificado.
- Dois testes adicionais verificam a ordem e a independência dos pré-requisitos.

## Verificações
- `npm test`: 29/29 aprovados.
- `npm run build`: não executado com sucesso (`vite: not found`, dependências não instaladas).
- Safari/iPhone e Playwright não verificados.

## Limitações
A conclusão da etapa ainda depende de marcar todos os cartões como vistos, o que não é avaliação de domínio. O currículo N5 é introdutório, não completo. Recomenda-se substituir progressivamente esse critério por checkpoints com respostas avaliadas e validar os fluxos em dispositivos reais antes do deploy.

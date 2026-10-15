# Homologação editorial do N5 — fluxo de trabalho

## Estado do curso
O currículo tem 220 microlições. A versão situacional v2 foi implementada e preserva os IDs. **Ainda não há revisão linguística independente**. Os testes verificam estrutura e regressões, não atestam proficiência, correção de todas as traduções ou licença de áudio.

## Fila reproduzível por unidade

Execute:
```bash
npm run editorial:prerequisites
npm run editorial:prerequisites -- --write
```

O primeiro comando apenas inspeciona a estrutura e conta os 220 registros; o segundo cria `data/editorial/n5-prerequisite-review.json` caso ainda não exista. Se houver uma cópia com anotações, a geração **recusa sobrescrever**. O relatório é uma fila de *candidatos a revisão*, nunca um carimbo de aprovação.

Cada unidade tem: etapa e modalidade, último pré-requisito de **acesso**, até seis unidades anteriores de gramática como *contexto candidato*, inventário de questões, flags estruturais e campos vazios para dependências gramaticais, vocabulário e escrita. O contexto candidato não prova que a frase seja linguisticamente acessível: só uma revisão por texto/áudio determina os pré-requisitos reais.

### Rubrica de conferência humana
1. **Objetivo observável**: o aluno deve saber o que vai conseguir compreender ao final.
2. **Pré-requisitos reais por exemplo**: detectar estruturas gramaticais, palavras, kana e kanji ainda não apresentados. Resolver antes de bloquear o aluno com um exercício.
3. **Explicação**: apresentar significado, contexto e regra, sem confundir tradução livre com literal.
4. **Distratores**: verificar cada alternativa incorreta e explicar o contraste. Evitar pistas de posição, idioma ou comprimento.
5. **Leitura/escuta**: conferir enunciado, transcrição, texto, resposta e qualidade do áudio/licença. TTS não certifica capacidade auditiva.
6. **Parecer rastreável**: nome de revisor competente e data. Não preencher automaticamente `reviewer`, `reviewedAt`, `editorialStatus` ou o banco certificador.

## Checkpoint da experiência
Depois de finalizar, o aluno percorre **todas** as questões com anterior/próxima e vê a justificativa; se houver alternativa errada associada a outro cartão da unidade, aparece uma comparação fundamentada nesses cartões. O aplicativo não revela gabaritos antes da correção nem muda a nota ou o desbloqueio.

## Critério de saída da 1.0
A prova editorial permanece indisponível enquanto o banco independente e o áudio autorizado não forem revisados. Requer também homologação de Safari/iPhone e Android reais, sincronização em dois dispositivos e período real de estudo. `audit:n5-release` deve continuar bloqueado até esses requisitos serem cumpridos.

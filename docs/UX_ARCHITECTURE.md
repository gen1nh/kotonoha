# Arquitetura de experiência — Kotonoha

## Uma fonte de verdade

`src/courseUnits.js` define microlições e habilidades; `src/learning.js` calcula nível do curso, itens completos e próxima ação; `src/routeAccess.js` valida qualquer entrada, inclusive deep links e histórico; `src/checkpoints.js` define avaliação; `src/state.js` trata armazenamento, revisão e migração. As telas NÃO devem reproduzir essas regras por conta própria.

### Fluxo oficial

```
Início (Continuar)
   ↓
Microlição da Trilha (estudar um pequeno conjunto)
   ↓
Prática contextual (cartões correspondentes)
   ↓
Checkpoint por competência (acerto ≥80%)
   ├─ não aprovado → correção e nova prática
   └─ aprovado → registra domínio → próxima microlição

SRS: atividade de manutenção sugerida à parte, não altera bloqueio já conquistado.
Praticar: ferramentas opcionais, não gera segundo currículo.
Biblioteca: consulta; nível escolhido nesta área não é nível desbloqueado.
```

### Papéis de cada área

- **Home:** uma CTA a partir de `nextGuidedAction`. Um microresumo de onde está; revisões pendentes; meta diária sem selecionar currículo.
- **Trilha:** timeline ordenada, agrupa unidades N5 por conteúdo e lições avançadas por nível. Mostra impedimentos com linguagem legível.
- **Lição:** visualização, exemplos e áudio do conteúdo *daquele* passo. Para N5, prática com cartões da unidade; para níveis N4–N1, questões introdutórias conforme conteúdo existente.
- **Checkpoint:** banco por microcompetência, tentativa variável e rascunho persistido. Aprovação em 80%, tentativas reabertas após feedback.
- **Revisão:** sessões pequenas, inclui novos cartões pessoais; regista atividade diária ao concluir sessão significativa, não por cada classificação de cartão.
- **Praticar:** SRS prioritário, uma ação para voltar à Trilha, materiais extras recolhidos. Laboratórios avançados bloqueados por progresso real, não filtro.
- **Progresso:** indicadores de resultado, não mapa duplicado; diagnóstico e papel são atividades auxiliares.
- **Caderno:** notas/erros/dúvidas e cartões pessoais, evitando rotas diferentes para o mesmo conteúdo.

### Compatibilidade e backups

- A chave do dispositivo continua `kotonoha.v1` para preservar instalações anteriores.
- `schemaVersion: 2` normaliza versões anteriores; dados legados continuam aceitos.
- Checkpoints N5 legados aprovados equivalem à aprovação das microlições que substituíram os quatro blocos antigos, impedindo retrocesso do usuário.
- Os rascunhos `drafts` e tentativas `attempts` sobrevivem a refresh e importação.
- Qualquer migração deve ser testada com backups antigos e dados criados pelo Caderno, inclusive cartões nunca estudados.
- Sincronização em nuvem **não será implementada nesta versão**. Transferência somente por backup manual.

### Nível de conteúdo real

Fundamentos N5 reestruturados em microlições. N4–N1 são conjuntos **introdutórios/autoriais** e não devem ser anunciados como cursos completos. As provas diagnósticas não equivalem às provas oficiais JLPT.

### Caminhos alternativos e retornos

- URL `/` ou `?view=home` → Início; `?view=path` → Trilha.
- As telas de lição e checkpoint recebem `topic` específico; rotas inválidas/bloqueadas voltam à Trilha.
- Abrir revisão a partir de uma lição guarda a origem; concluir/voltar retorna à atividade correspondente.
- A barra inferior tem quatro destinos em contexto geral; desaparece em estudo imersivo.

### Regras de alteração

Antes de alterar o fluxo, verificar **Home → Trilha → Lição → Revisão → Checkpoint → próximo passo**, navegação direta por URL, histórico, restauração, modo escuro, iOS e backup legado. Não adicionar um atalho que pule guardas, segunda meta ou segundo motor de progressão.

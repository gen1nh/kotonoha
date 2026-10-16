# Arquitetura de experiência — Kotonoha

## Uma fonte de verdade

`src/entities/study/model/courseUnits.js` define microlições e habilidades; `src/entities/study/model/learning.js` calcula nível do curso, itens completos e próxima ação; `src/entities/study/model/routeAccess.js` valida qualquer entrada, inclusive deep links e histórico; `src/entities/study/model/checkpoints.js` define avaliação; `src/entities/study/model/state.js` trata armazenamento, revisão e migração. As telas NÃO devem reproduzir essas regras por conta própria.

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

SRS: revisão sugerida no momento adequado, sem alterar bloqueio já conquistado.
Meu espaço: abriga recursos opcionais; nenhuma ferramenta gera um segundo currículo.
Biblioteca: apenas consulta; níveis exibidos não equivalem a níveis desbloqueados.
```

### Papéis de cada área

- **Hoje (Home):** exatamente uma CTA orientada por `nextGuidedAction`, com revisão contextual; meta diária compacta.
- **Trilha:** timeline ordenada, agrupa unidades N5 por conteúdo e lições avançadas por nível. Mostra impedimentos com linguagem legível.
- **Lição:** visualização, exemplos e áudio do conteúdo *daquele* passo. Para N5, prática com cartões da unidade; para níveis N4–N1, questões introdutórias conforme conteúdo existente.
- **Checkpoint:** banco por microcompetência, tentativa variável e rascunho persistido. Aprovação em 80%, tentativas reabertas após feedback.
- **Revisão:** sessões pequenas, inclui novos cartões pessoais; regista atividade diária ao concluir sessão significativa, não por cada classificação de cartão.
- **Treinos extras (rota legada `practice`):** acessados por Meu espaço; revisão como ação sugerida e demais modalidades recolhidas. Laboratórios avançados bloqueados por progresso real, não filtro.
- **Meu espaço (rota `progress`):** progresso resumido e recursos pessoais: revisão, Biblioteca, Caderno, treinos extras, avaliações e Preferências. Estatísticas detalhadas ficam recolhidas.
- **Caderno:** notas/erros/dúvidas e cartões pessoais, evitando rotas diferentes para o mesmo conteúdo.

### Compatibilidade e backups

- A chave do dispositivo continua `kotonoha.v1` para preservar instalações anteriores.
- `schemaVersion: 2` normaliza versões anteriores; dados legados continuam aceitos.
- Checkpoints N5 legados aprovados equivalem à aprovação das microlições que substituíram os quatro blocos antigos, impedindo retrocesso do usuário.
- Os rascunhos `drafts` e tentativas `attempts` sobrevivem a refresh e importação.
- Qualquer migração deve ser testada com backups antigos e dados criados pelo Caderno, inclusive cartões nunca estudados.
- Sincronização opcional Supabase e login Google já estão implementados, mediante configuração. Conflitos exigem escolha explícita e snapshots; backups manuais permanecem disponíveis.

### Nível de conteúdo real

Fundamentos N5 reestruturados em microlições. N4–N1 são conjuntos **introdutórios/autoriais** e não devem ser anunciados como cursos completos. As provas diagnósticas não equivalem às provas oficiais JLPT.

### Caminhos alternativos e retornos

- URL `/` ou `?view=home` → Início; `?view=path` → Trilha.
- As telas de lição e checkpoint recebem `topic` específico; rotas inválidas/bloqueadas voltam à Trilha.
- Abrir revisão a partir de uma lição guarda a origem; concluir/voltar retorna à atividade correspondente.
- A barra inferior possui três destinos: Hoje, Trilha e Meu espaço. Recursos antigos continuam acessíveis por suas URLs internas; a barra desaparece em estudo imersivo.

### Regras de alteração

Antes de alterar o fluxo, verificar **Home → Trilha → Lição → Revisão → Checkpoint → próximo passo**, navegação direta por URL, histórico, restauração, modo escuro, iOS e backup legado. Não adicionar um atalho que pule guardas, segunda meta ou segundo motor de progressão.

## Subpáginas e retorno (outubro de 2026)

As áreas Praticar, Biblioteca, Caderno, Progresso, Simulados e Preferências usam parâmetros `sub_<área>` na URL. A navegação por mini-cards registra histórico do navegador; retorno visual e voltar/avançar sincronizam a subpágina. Rotas diretas inválidas caem no menu inicial da área.

Não expor informações editoriais internas ao aluno. A Trilha continua sendo o único currículo; níveis de Simulados são filtros locais e não alteram progresso nem nível global.

## Direção aprovada em outubro/2026

Confira `CHECKIN.md` na raiz para estado da implementação e pendências. Prioridade: **guiar o aluno para a próxima tarefa, uma ação principal por tela, menus progressivos e linguagem sem jargões**. Não criar outro motor de progressão. Alterar navegação exige validar links internos e histórico/back no navegador.

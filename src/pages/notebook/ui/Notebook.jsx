import React, { useState } from "react";
import {useSubpageNavigation} from "../../../shared/lib/useSubpageNavigation.js";
import Icon from "../../../shared/ui/Icon.jsx";
import {NavigationTile} from "../../../shared/ui/index.jsx";
import ErrorMemory from "./ErrorMemory.jsx";
import { chatCompletion } from "../../../entities/study/index.js";

const NOTE_TEMPLATES = {
  vocab: {
    title: "Nova Palavra: [Kanji / Palavra]",
    content:
      "### Palavra: \n- **Leitura:** \n- **Significado:** \n\n### Frase de Exemplo:\n- \n*Tradução:* \n\n### Como usar no dia a dia:\n- ",
    tags: ["Vocabulário", "N5"],
  },
  grammar: {
    title: "Gramática: [Ponto Gramatical]",
    content:
      "### Estrutura:\n[Elemento] + [Partícula/Terminação] + [Verbo]\n\n### Explicação em Português:\n\n\n### Contrastes e Atenção:\n- Cuidado para não confundir com: \n\n### Frases de Exemplo:\n1. \n2. ",
    tags: ["Gramática", "Regras"],
  },
  diary: {
    title: "Diário de Hoje: [Data]",
    content:
      "### Meu dia em 3 frases:\n1. 今日は... (Hoje...)\n2. ...をしました。(Eu fiz...)\n3. 明日は... (Amanhã...)\n\n### Palavras novas que usei:\n- ",
    tags: ["Diário", "Produção"],
  },
  summary: {
    title: "Resumo da Lição: [Tema]",
    content:
      "### O que aprendi hoje:\n- [ ] Ponto 1\n- [ ] Ponto 2\n- [ ] Ponto 3\n\n### Minha maior dúvida que preciso rever:\n- ",
    tags: ["Resumo", "Revisão"],
  },
};

export default function Notebook({ state, update, toast, speak, go }) {
  const [tab,setTab,backTab]=useSubpageNavigation("notebook","menu",["menu","kanban","notes","doubts","errors"]);
  const showMenu=tab==="menu";
  const [search, setSearch] = useState("");
  const [activeNoteId, setActiveNoteId] = useState(
    () => state.notebook?.notes?.[0]?.id || null,
  );
  const [isEditing, setIsEditing] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);

  const notes = state.notebook?.notes || [];
  const kanban = state.notebook?.kanban || [];
  const doubts = state.notebook?.doubts || [];

  const activeNote = notes.find((n) => n.id === activeNoteId) || notes[0];

  // Filtro de notas por busca
  const filteredNotes = notes.filter((n) =>
    (n.title + " " + n.content + " " + (n.tags || []).join(" "))
      .toLowerCase()
      .includes(search.toLowerCase()),
  );

  // Criar nota vazia ou a partir de modelo
  const handleCreateNote = (templateKey = null) => {
    const template = templateKey
      ? NOTE_TEMPLATES[templateKey]
      : { title: "Nova Anotação", content: "", tags: ["Estudo"] };
    const newId = `note-${Date.now()}`;
    const newNote = {
      id: newId,
      title: template.title,
      content: template.content,
      tags: [...template.tags],
      updatedAt: Date.now(),
    };

    update((s) => {
      if (!s.notebook) s.notebook = { notes: [], kanban: [], doubts: [] };
      s.notebook.notes.unshift(newNote);
    });

    setActiveNoteId(newId);
    setIsEditing(true);
    if (toast) toast("Nova nota criada!");
  };

  // Salvar nota editada
  const handleUpdateActiveNote = (fields) => {
    update((s) => {
      const idx = s.notebook?.notes?.findIndex((n) => n.id === activeNote?.id);
      if (idx !== -1 && s.notebook?.notes?.[idx]) {
        s.notebook.notes[idx] = {
          ...s.notebook.notes[idx],
          ...fields,
          updatedAt: Date.now(),
        };
      }
    });
  };

  // Excluir nota
  const handleDeleteNote = (id) => {
    update((s) => {
      if (s.notebook?.notes) {
        s.notebook.notes = s.notebook.notes.filter((n) => n.id !== id);
      }
    });
    if (activeNoteId === id) {
      const remaining = notes.filter((n) => n.id !== id);
      setActiveNoteId(remaining[0]?.id || null);
    }
    if (toast) toast("Nota removida.");
  };

  // Transformar nota em cartão SRS
  const handleConvertToSrs = (note) => {
    if (!note) return;
    const cardId = `custom:${Date.now()}`;
    update((s) => {
      s.cards[cardId] = {
        id: cardId,
        type: "Caderno Pessoal",
        prompt: note.title,
        answer: note.content.slice(0, 150),
        seen: true,
        reps: 0,
        interval: 1,
        ease: 2.5,
        due: Date.now(),
      };
    });
    if (toast) toast("Transformado em cartão de revisão!");
  };

  // Mover cartão do Kanban
  const handleMoveKanban = (itemId, newStatus) => {
    update((s) => {
      const item = s.notebook?.kanban?.find((k) => k.id === itemId);
      if (item) {
        item.status = newStatus;
      }
    });
    if (toast) toast("Cartão atualizado!");
  };

  // Adicionar novo item ao Kanban
  const handleAddKanban = (status) => {
    const title = prompt("O que você deseja adicionar a esta coluna?");
    if (!title || !title.trim()) return;

    const newItem = {
      id: `kanban-${Date.now()}`,
      title: title.trim(),
      tag: "Personalizado",
      level: state.selectedLevel || "N5",
      notes: "Adicionado manualmente ao plano de estudos",
      status,
    };

    update((s) => {
      if (!s.notebook?.kanban) s.notebook.kanban = [];
      s.notebook.kanban.unshift(newItem);
    });
    if (toast) toast("Adicionado ao seu Kanban!");
  };

  // Consultar Sensei IA sobre uma dúvida
  const handleAskSensei = async (doubt) => {
    setAiLoading(true);
    try {
      const reply = await chatCompletion(
        `Explique de forma simples e didática para um estudante brasileiro de japonês iniciante/intermediário: Minha dúvida é sobre "${doubt.topic}". Frase de referência: "${doubt.phrase}". Por que essa estrutura funciona dessa forma? Dê 2 exemplos práticos claros.`,
        {
          systemPrompt:
            "Você é o Sensei do Kotonoha, um tutor paciente, acolhedor e especialista em ensinar japonês para brasileiros.",
        },
      );
      update((s) => {
        const item = s.notebook?.doubts?.find((d) => d.id === doubt.id);
        if (item) item.answer = reply;
      });
      if (toast) toast("O Sensei respondeu sua dúvida!");
    } catch (err) {
      if (toast)
        toast(`Não foi possível conectar ao OmniRoute: ${err.message}`);
    } finally {
      setAiLoading(false);
    }
  };

  const kanbanColumns = [
    {
      id: "want_to_learn",
      title: "Quero Aprender",
      icon: "arrow",
      badge: "Objetivo",
      dot: "bg-amber",
      pill: "bg-amber-soft text-amber-ink border border-amber/30",
    },
    {
      id: "studying",
      title: "Estou Estudando",
      icon: "learn",
      badge: "Em Foco",
      dot: "bg-indigo",
      pill: "bg-indigo-soft text-indigo-ink border border-indigo/30",
    },
    {
      id: "need_practice",
      title: "Preciso Praticar",
      icon: "paper",
      badge: "Treino",
      dot: "bg-flame",
      pill: "bg-flame-soft text-flame-ink border border-flame/30",
    },
    {
      id: "mastered",
      title: "Já Consigo Usar",
      icon: "check",
      badge: "Dominado",
      dot: "bg-success",
      pill: "bg-success-soft text-success border border-success/30",
    },
  ];

  return (
    <div className="w-full space-y-6">
      {showMenu&&<section className="space-y-3" aria-label="Áreas do Caderno">
        <button type="button" className="min-h-11 text-sm font-bold text-primary-strong" onClick={()=>go("progress")}>← Voltar ao meu espaço</button>
        <h1 className="text-2xl font-black text-ink-strong">Caderno</h1>
        <p className="text-sm text-muted">Encontre suas anotações, dúvidas e registros sem misturar as ferramentas.</p>
        <div className="grid grid-cols-2 gap-3">
          {[
            {id:'notes',title:'Minhas anotações',description:'Notas e resumos de estudo.',icon:'learn',meta:notes.length+' notas'},
            {id:'errors',title:'Meus erros',description:'Respostas que precisam de revisão.',icon:'review',meta:(state.errorMemory?.length||0)+' registros'},
            {id:'doubts',title:'Minhas dúvidas',description:'Perguntas guardadas nas lições.',icon:'chat',meta:doubts.length+' dúvidas'},
          ].map(item=><NavigationTile key={item.id} {...item} onClick={()=>{setTab(item.id);}}/>)}
        </div>
        <details className="rounded-xl border border-line bg-paper p-3">
         <summary className="min-h-11 cursor-pointer text-sm font-semibold text-ink-strong">Organização pessoal · opcional</summary>
         <div className="mt-3"><NavigationTile title="Meu planejamento" description="Organize tarefas e ideias." icon="review" meta={kanban.length+' itens'} onClick={()=>setTab('kanban')}/></div>
        </details>
      </section>}
      {!showMenu&&<>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <button type="button" className="min-h-11 text-sm font-bold text-primary-strong" onClick={backTab}>← Voltar ao Caderno</button>
          {tab==='notes'&&<button type="button" className="min-h-11 rounded-xl bg-primary text-white px-4 text-sm font-bold" onClick={()=>handleCreateNote()}>+ Nova Nota</button>}
        </div>
        <h1 className="text-xl font-black text-ink-strong">{({notes:'Minhas anotações',errors:'Meus erros',doubts:'Minhas dúvidas',kanban:'Meu planejamento'})[tab]}</h1>

      {/* ABA 1: QUADRO KANBAN ("Meu Fluxo de Japonês") */}
      {tab === "kanban" && (
        <div className="space-y-6">
          <div className="p-4 rounded-xl border border-line bg-paper">
            <h2 className="text-base font-bold text-ink">
              Seu Fluxo de Aprendizagem
            </h2>
            <p className="text-xs text-muted mt-1 leading-relaxed">
              Acompanhe o que você quer aprender, o que está estudando agora e
              celebre o que já consegue usar no mundo real.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full min-w-0">
            {kanbanColumns.map((col) => {
              const items = kanban.filter((k) => k.status === col.id);
              return (
                <details
                  key={col.id}
                  className="kanban-column w-full min-w-0 border border-line rounded-xl bg-surface p-4"
                >
                  <summary className="flex items-center justify-between gap-3 cursor-pointer min-h-11 text-sm font-semibold text-ink">
                    <div className="flex items-center gap-2">
                      <span className={`h-2.5 w-2.5 rounded-full ${col.dot}`} />
                      <h3 className="font-bold">{col.title}</h3>
                    </div>
                    <span className="text-xs font-black text-muted tabular-nums">
                      {items.length}
                    </span>
                  </summary>

                  <div className="space-y-2.5 pt-4">
                    {items.map((item) => (
                      <article
                        key={item.id}
                        className="p-3.5 rounded-lg border border-line bg-surface space-y-2 select-none hover:border-edge transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-medium text-muted">
                            {item.level}
                          </span>
                          <span className="text-xs font-semibold text-muted">
                            {item.tag}
                          </span>
                        </div>
                        <h4 className="text-sm font-bold text-ink">
                          {item.title}
                        </h4>
                        {item.notes && (
                          <p className="text-xs text-muted leading-relaxed line-clamp-3">
                            {item.notes}
                          </p>
                        )}

                        {/* Controles de Mudança de Coluna */}
                        <div className="flex items-center justify-between pt-2 border-t border-line/60 text-xs">
                          {col.id !== "want_to_learn" ? (
                            <button
                              className="px-2 py-0.5 rounded border border-line bg-paper text-muted hover:text-ink hover:border-edge cursor-pointer transition-colors"
                              title="Voltar coluna"
                              onClick={() => {
                                const idx = kanbanColumns.findIndex(
                                  (c) => c.id === col.id,
                                );
                                if (idx > 0)
                                  handleMoveKanban(
                                    item.id,
                                    kanbanColumns[idx - 1].id,
                                  );
                              }}
                            >
                              ←
                            </button>
                          ) : (
                            <span />
                          )}
                          <span className="text-[10px] text-muted font-medium">
                            Mover
                          </span>
                          {col.id !== "mastered" ? (
                            <button
                              className="px-2 py-0.5 rounded border border-line bg-paper text-muted hover:text-ink hover:border-edge cursor-pointer transition-colors"
                              title="Avançar coluna"
                              onClick={() => {
                                const idx = kanbanColumns.findIndex(
                                  (c) => c.id === col.id,
                                );
                                if (idx < kanbanColumns.length - 1)
                                  handleMoveKanban(
                                    item.id,
                                    kanbanColumns[idx + 1].id,
                                  );
                              }}
                            >
                              →
                            </button>
                          ) : (
                            <span />
                          )}
                        </div>
                      </article>
                    ))}

                    <button
                      className="w-full py-2 px-3 rounded-lg border border-dashed border-line text-xs font-semibold text-muted hover:text-ink hover:border-edge bg-surface/40 hover:bg-surface cursor-pointer transition-colors"
                      onClick={() => handleAddKanban(col.id)}
                    >
                      + Adicionar item
                    </button>
                  </div>
                </details>
              );
            })}
          </div>
        </div>
      )}

      {/* ABA 2: PÁGINAS & NOTAS (Estilo Notion) */}
      {tab === "notes" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Painel Esquerdo: Lista de Notas & Templates */}
          <aside className="lg:col-span-4 space-y-4">
            <div>
              <input
                type="text"
                placeholder="Buscar notas ou tags..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-line bg-surface text-xs text-ink placeholder:text-muted focus:outline-edge"
              />
            </div>

            <div className="p-3 rounded-xl border border-line bg-paper space-y-2">
              <small className="text-[11px] font-bold text-muted uppercase tracking-wider block">
                Modelos prontos:
              </small>
              <div className="flex flex-wrap gap-1.5">
                {[
                  ["vocab", "Palavra"],
                  ["grammar", "Gramática"],
                  ["diary", "Diário"],
                  ["summary", "Resumo"],
                ].map(([k, label]) => (
                  <button
                    key={k}
                    className="px-2.5 py-1 rounded-lg border border-line bg-surface text-xs font-medium text-ink hover:border-edge hover:bg-paper cursor-pointer transition-colors"
                    onClick={() => handleCreateNote(k)}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2 max-h-[60svh] overflow-y-auto">
              {filteredNotes.map((note) => (
                <div
                  key={note.id}
                  className={`p-3 rounded-xl border cursor-pointer transition-all ${
                    note.id === activeNoteId
                      ? "border-primary/40 bg-accent-soft/30"
                      : "border-line bg-surface hover:border-edge"
                  }`}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      setActiveNoteId(note.id);
                      setIsEditing(false);
                    }
                  }}
                  onClick={() => {
                    setActiveNoteId(note.id);
                    setIsEditing(false);
                  }}
                >
                  <strong className="block text-sm font-bold text-ink">
                    {note.title || "Sem título"}
                  </strong>
                  <div className="flex items-center gap-2 mt-1 text-xs text-muted">
                    <span>
                      {new Intl.DateTimeFormat("pt-BR", {
                        day: "2-digit",
                        month: "short",
                      }).format(new Date(note.updatedAt || Date.now()))}
                    </span>
                    {(note.tags || []).slice(0, 2).map((t) => (
                      <span key={t} className="text-xs text-muted">
                        #{t}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </aside>

          {/* Painel Direito: Conteúdo da Nota Ativa */}
          <section
            aria-label="Nota selecionada"
            className="lg:col-span-8 p-6 rounded-xl border border-line bg-surface space-y-4"
          >
            {activeNote ? (
              <div className="space-y-4">
                <header className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-line">
                  {isEditing ? (
                    <input
                      type="text"
                      aria-label="Título da nota"
                      className="text-lg sm:text-xl font-bold text-ink px-2 py-1 rounded border border-edge bg-paper flex-1"
                      value={activeNote.title}
                      onChange={(e) =>
                        handleUpdateActiveNote({ title: e.target.value })
                      }
                    />
                  ) : (
                    <h2 className="text-lg sm:text-xl font-bold text-ink">
                      {activeNote.title}
                    </h2>
                  )}

                  <div className="flex items-center gap-2">
                    <button
                      className="px-3 py-1.5 rounded-lg border border-line bg-surface text-xs font-semibold text-ink hover:bg-paper cursor-pointer transition-colors"
                      onClick={() => setIsEditing(!isEditing)}
                    >
                      {isEditing ? "Visualizar" : "Editar"}
                    </button>
                    <button
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-line bg-surface text-xs font-semibold text-ink hover:bg-paper cursor-pointer transition-colors"
                      onClick={() => handleConvertToSrs(activeNote)}
                      title="Transformar esta nota em um flashcard de revisão"
                    >
                      <Icon name="bolt" /> Criar Cartão SRS
                    </button>
                    <button
                      className="px-3 py-1.5 rounded-lg border border-danger/30 text-danger hover:bg-danger-soft text-xs font-semibold cursor-pointer transition-colors"
                      onClick={() => handleDeleteNote(activeNote.id)}
                    >
                      Excluir
                    </button>
                  </div>
                </header>

                <div className="flex flex-wrap gap-2 text-xs font-bold text-muted">
                  {(activeNote.tags || []).map((tag, i) => (
                    <span key={i}>
                      #{tag}
                    </span>
                  ))}
                </div>

                <div>
                  {isEditing ? (
                    <textarea
                      className="w-full p-4 rounded-xl border border-edge bg-paper text-sm text-ink tabular-nums focus:outline-none"
                      value={activeNote.content}
                      onChange={(e) =>
                        handleUpdateActiveNote({ content: e.target.value })
                      }
                      placeholder="Escreva suas anotações, regras, frases ou checklists aqui..."
                      rows={16}
                    />
                  ) : (
                    <div className="space-y-3 text-sm text-ink leading-relaxed">
                      {activeNote.content ? (
                        activeNote.content.split("\n").map((line, idx) => {
                          if (line.startsWith("### "))
                            return (
                              <h3
                                key={idx}
                                className="text-base font-bold text-primary-strong pt-2"
                              >
                                {line.replace("### ", "")}
                              </h3>
                            );
                          if (line.startsWith("- [ ] "))
                            return (
                              <label
                                key={idx}
                                className="flex items-center gap-2 text-ink"
                              >
                                <input
                                  type="checkbox"
                                  readOnly
                                  className="accent-primary"
                                />{" "}
                                <span>{line.replace("- [ ] ", "")}</span>
                              </label>
                            );
                          if (line.startsWith("- "))
                            return (
                              <li key={idx} className="ml-4 list-disc">
                                {line.replace("- ", "")}
                              </li>
                            );
                          return <p key={idx}>{line}</p>;
                        })
                      ) : (
                        <p className="text-xs text-muted">
                          Nota vazia. Clique em <strong>Editar</strong> para
                          escrever suas impressões ou exercícios.
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="p-12 text-center text-muted space-y-2">
                <Icon name="paper" />
                <p className="text-sm">
                  Nenhuma nota selecionada. Escolha uma ao lado ou crie uma
                  nova.
                </p>
              </div>
            )}
          </section>
        </div>
      )}

      {/* ABA 3: CAIXA DE DÚVIDAS (Sensei IA) */}
      {tab === 'errors' && <ErrorMemory state={state} update={update} toast={toast} speak={speak} go={go}/> }
      {tab === "doubts" && (
        <div className="space-y-6">
          <div className="p-4 rounded-xl border border-line bg-paper flex items-start gap-3">
            <span className="p-2 rounded-lg bg-surface border border-line text-muted">
              <Icon name="help" />
            </span>
            <div>
              <h2 className="text-base font-bold text-ink">Caixa de Dúvidas</h2>
              <p className="text-xs text-muted mt-1 leading-relaxed">
                Dúvidas que você guardou durante suas sessões de estudo. Você
                pode revê-las com calma ou pedir uma explicação detalhada ao
                Sensei IA.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full min-w-0">
            {doubts.length > 0 ? (
              doubts.map((doubt) => (
                <article
                  key={doubt.id}
                  className="p-5 rounded-xl border border-line bg-surface space-y-3"
                >
                  <div className="flex items-center justify-between text-xs text-muted">
                    <span className="px-2 py-0.5 rounded bg-index text-ink font-semibold border border-line">
                      {doubt.topic}
                    </span>
                    <small>
                      {new Intl.DateTimeFormat("pt-BR", {
                        day: "2-digit",
                        month: "short",
                      }).format(new Date(doubt.createdAt || Date.now()))}
                    </small>
                  </div>
                  <h3 className="text-base font-bold text-ink">
                    "{doubt.phrase}"
                  </h3>

                  {doubt.answer ? (
                    <div className="p-4 rounded-xl border border-primary/20 bg-accent-soft/20 space-y-1.5 text-xs text-ink leading-relaxed">
                      <div className="font-bold text-primary-strong flex items-center gap-1">
                        <Icon name="leaf" /> <span>Sensei Kotonoha</span>
                      </div>
                      <p>{doubt.answer}</p>
                    </div>
                  ) : (
                    <div className="pt-2 flex items-center justify-between gap-3">
                      <span className="text-xs text-muted">
                        Ainda não esclarecida
                      </span>
                      <button
                        className="px-3 py-1.5 rounded-lg bg-primary text-white font-bold text-xs cursor-pointer hover:bg-primary-strong transition-colors disabled:opacity-50"
                        disabled={aiLoading}
                        onClick={() => handleAskSensei(doubt)}
                      >
                        {aiLoading
                          ? "Consultando Sensei..."
                          : "Perguntar ao Sensei IA"}
                      </button>
                    </div>
                  )}
                </article>
              ))
            ) : (
              <div className="col-span-2 p-12 text-center rounded-xl border border-line bg-paper text-muted space-y-2">
                <Icon name="check" />
                <p className="text-sm font-medium text-ink">
                  Nenhuma dúvida pendente!
                </p>
                <p className="text-xs text-muted">
                  Quando encontrar uma frase difícil nas lições, clique em
                  "Guardar dúvida" para trazê-la aqui.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
      </>}
    </div>
  );
}

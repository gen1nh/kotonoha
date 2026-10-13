import React, { useState, useEffect, useRef } from "react";
import Icon from "./Icon.jsx";
import { chatCompletion } from "../ai.js";

export const SCENARIOS = [
  {
    id: "self_intro",
    title: "Apresentação Pessoal (自己紹介)",
    character: "Aoi (Estudante)",
    role: "Colega de turma amigável",
    avatar: "青",
    description:
      "Aprenda a dizer seu nome, de onde você vem e seu prazer em conhecer.",
    starter: {
      ja: "はじめまして！葵（あおい）です。日本から来ました。お名前は何ですか？",
      ro: "Hajimemashite! Aoi desu. Nihon kara kimashita. O-namae wa nan desu ka?",
      pt: "Prazer em conhecer! Sou a Aoi. Vim do Japão. Qual é o seu nome?",
    },
    quickReplies: [
      {
        text: "はじめまして！ブラジルから来ました。(Prazer! Vim do Brasil)",
        reply: {
          ja: "ブラジルからですか！すごいですね！日本語はお上手ですね。",
          ro: "Burajiru kara desu ka! Sugoi desu ne! Nihongo wa o-jouzu desu ne.",
          pt: "Do Brasil! Que incrível! Seu japonês é muito bom.",
        },
      },
      {
        text: "はじめまして、よろしくお願いします。(Prazer, conto com você)",
        reply: {
          ja: "こちらこそ、よろしくお願いします！何が好きですか？",
          ro: "Kochira koso, yoroshiku onegaishimasu! Nani ga suki desu ka?",
          pt: "Igualmente, muito prazer! Do que você gosta?",
        },
      },
      {
        text: "日本語を少し勉強しています。(Estudo um pouco de japonês)",
        reply: {
          ja: "いいですね！一緒に楽しく練習しましょう。",
          ro: "Ii desu ne! Issho ni tanoshiku renshuu shimashou.",
          pt: "Que bom! Vamos praticar juntos de forma divertida.",
        },
      },
    ],
    culturalTip:
      "No Japão, a primeira apresentação sempre termina com 'Yoroshiku onegaishimasu' acompanhado de uma leve reverência (ojigi).",
  },
  {
    id: "konbini",
    title: "No Konbini (コンビニ)",
    character: "Tanaka (Atendente)",
    role: "Atendente do 7-Eleven",
    avatar: "店",
    description:
      "Sobreviva à loja de conveniência japonesa: sacolas, esquentar comida e recibo.",
    starter: {
      ja: "いらっしゃいませ！お弁当（べんとう）温めますか？",
      ro: "Irasshaimase! O-bentou atatamemasu ka?",
      pt: "Bem-vindo(a)! Deseja que esquente o bentô (marmita)?",
    },
    quickReplies: [
      {
        text: "はい、お願いします。(Sim, por favor)",
        reply: {
          ja: "かしこまりました。少々お待ちください。袋（ふくろ）はご利用ですか？",
          ro: "Kashikomarimashita. Shou-shou o-machi kudasai. Fukuro wa go-riyou desu ka?",
          pt: "Com certeza. Aguarde um instante, por favor. Vai precisar de sacola?",
        },
      },
      {
        text: "いいえ、大丈夫です。(Não, não precisa)",
        reply: {
          ja: "承知いたしました。レシートはご利用ですか？",
          ro: "Shouchi itashimashita. Reshiito wa go-riyou desu ka?",
          pt: "Entendido. Deseja a nota fiscal / comprovante?",
        },
      },
      {
        text: "袋を一枚ください。(Uma sacola, por favor)",
        reply: {
          ja: "はい、袋は3円になります。合計で650円です。",
          ro: "Hai, fukuro wa san-en ni narimasu. Goukei de roppyaku-gojuu-en desu.",
          pt: "Sim, a sacola custa 3 ienes. O total fica em 650 ienes.",
        },
      },
    ],
    culturalTip:
      "As sacolas plásticas nos konbinis custam de 3 a 5 ienes. Se não quiser, basta dizer 'Fukuro wa daijoubu desu'.",
  },
  {
    id: "restaurant",
    title: "No Restaurante / Café (カフェ)",
    character: "Kenji (Garçom)",
    role: "Atendente do café",
    avatar: "珈",
    description:
      "Peça seu pedido, bebidas e pergunte o preço com tranquilidade.",
    starter: {
      ja: "いらっしゃいませ！何名様（なんめいさま）ですか？",
      ro: "Irasshaimase! Nan-mei-sama desu ka?",
      pt: "Bem-vindo! Quantas pessoas?",
    },
    quickReplies: [
      {
        text: "一人です。(Uma pessoa)",
        reply: {
          ja: "お一人様ですね。こちらのお席へどうぞ！メニューをどうぞ。",
          ro: "O-hitori-sama desu ne. Kochira no o-seki e douzo! Menyuu o douzo.",
          pt: "Uma pessoa, pois não. Sente-se aqui, por favor! Aqui está o cardápio.",
        },
      },
      {
        text: "二人です。(Duas pessoas)",
        reply: {
          ja: "二名様ですね。奥のテーブル席へご案内いたします。",
          ro: "Ni-mei-sama desu ne. Oku no teeburu-seki e go-annai itashimasu.",
          pt: "Duas pessoas. Vou conduzi-los à mesa do fundo.",
        },
      },
      {
        text: "コーヒーを一つください。(Um café, por favor)",
        reply: {
          ja: "アイスコーヒーとホットコーヒー、どちらになさいますか？",
          ro: "Aisu koohii to hotto koohii, dochira ni nasaimasu ka?",
          pt: "Café gelado ou quente, qual o senhor(a) prefere?",
        },
      },
    ],
    culturalTip:
      "Para chamar o garçom no Japão, basta levantar a mão discretamente e dizer 'Sumimasen!' (com licença).",
  },
  {
    id: "asking_help",
    title: "Pedindo Ajuda e Direções (道案内)",
    character: "Satou (Pedestre)",
    role: "Morador de Tóquio",
    avatar: "街",
    description:
      "Pergunte onde fica o metrô ou o banheiro em caso de necessidade.",
    starter: {
      ja: "はい、どうしましたか？何かお困りですか？",
      ro: "Hai, doushimashita ka? Nanika o-komari desu ka?",
      pt: "Olá, o que houve? Está precisando de alguma ajuda?",
    },
    quickReplies: [
      {
        text: "すみません、駅はどこですか？ (Com licença, onde fica a estação?)",
        reply: {
          ja: "駅ですね。まっすぐ行って、右に曲がるとすぐですよ！徒歩3分です。",
          ro: "Eki desu ne. Massugu itte, migi ni magaru to sugu desu yo! Toho san-pun desu.",
          pt: "A estação? Vá em frente e vire à direita, é logo ali! Fica a 3 minutos a pé.",
        },
      },
      {
        text: "トイレはどこですか？ (Onde fica o banheiro?)",
        reply: {
          ja: "あそこのコンビニの中にありますよ。",
          ro: "Asoko no konbini no naka ni arimasu yo.",
          pt: "Tem um dentro daquela loja de conveniência ali.",
        },
      },
      {
        text: "ありがとうございます！ (Muito obrigado!)",
        reply: {
          ja: "どういたしまして！良い一日を！",
          ro: "Dou itashimashite! Yoi ichinichi o!",
          pt: "De nada! Tenha um ótimo dia!",
        },
      },
    ],
    culturalTip:
      "Dizer 'Sumimasen' antes de fazer qualquer pergunta a um desconhecido é o segredo para ser atendido com a máxima cordialidade.",
  },
];

export default function ConversationChat({ speak, toast }) {
  const [mode, setMode] = useState("guided"); // "guided" ou "ai"
  const [selectedScenarioIndex, setSelectedScenarioIndex] = useState(0);
  const scenario = SCENARIOS[selectedScenarioIndex];

  // Histórico de mensagens
  const [messages, setMessages] = useState([]);
  const [inputVal, setInputVal] = useState("");
  const [loadingAi, setLoadingAi] = useState(false);
  const [showFurigana, setShowFurigana] = useState(true);
  const chatBottomRef = useRef(null);

  // Inicializa o chat quando o cenário muda
  useEffect(() => {
    if (mode === "guided") {
      setMessages([
        {
          id: "m0",
          sender: "bot",
          author: scenario.character,
          avatar: scenario.avatar,
          ja: scenario.starter.ja,
          ro: scenario.starter.ro,
          pt: scenario.starter.pt,
          time: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        },
      ]);
    } else {
      setMessages([
        {
          id: "m0-ai",
          sender: "bot",
          author: "Sensei IA (OmniRoute)",
          avatar: "先",
          ja: "こんにちは！何についてお話ししましょうか？ (Konnichiwa! Nani ni tsuite o-hanashi shimashou ka?)",
          ro: "Konnichiwa! Nani ni tsuite o-hanashi shimashou ka?",
          pt: "Olá! Sobre o que gostaria de conversar hoje? Pode digitar em japonês ou português!",
          time: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        },
      ]);
    }
  }, [selectedScenarioIndex, mode]);

  // Scroll automático
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loadingAi]);

  const handleSpeak = (text) => {
    if (speak) speak(text);
  };

  // Enviar réplica no modo guiado
  const handleSendQuickReply = (qr) => {
    const userMsg = {
      id: `u-${Date.now()}`,
      sender: "user",
      author: "Você",
      text: qr.text,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    const botMsg = {
      id: `b-${Date.now() + 1}`,
      sender: "bot",
      author: scenario.character,
      avatar: scenario.avatar,
      ja: qr.reply.ja,
      ro: qr.reply.ro,
      pt: qr.reply.pt,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages((prev) => [...prev, userMsg, botMsg]);
    if (qr.reply.ja) {
      setTimeout(() => handleSpeak(qr.reply.ja), 300);
    }
  };

  // Envio de texto (Modo Livre ou Modo IA)
  const handleSendMessage = async (e) => {
    e?.preventDefault();
    if (!inputVal.trim()) return;

    const userText = inputVal.trim();
    setInputVal("");

    const userMsg = {
      id: `u-${Date.now()}`,
      sender: "user",
      author: "Você",
      text: userText,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages((prev) => [...prev, userMsg]);

    if (mode === "guided") {
      // No modo guiado, se digitar livremente, simula resposta positiva
      setTimeout(() => {
        const botMsg = {
          id: `b-${Date.now()}`,
          sender: "bot",
          author: scenario.character,
          avatar: scenario.avatar,
          ja: "分かりました！よくできましたね。(Wakarimashita! Yoku dekimashita ne.)",
          ro: "Wakarimashita! Yoku dekimashita ne.",
          pt: "Entendi! Muito bem, continue praticando!",
          time: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        };
        setMessages((prev) => [...prev, botMsg]);
      }, 600);
      return;
    }

    // Modo IA (OmniRoute)
    setLoadingAi(true);
    try {
      const systemPrompt = `Você é o Sensei do Kotonoha, um aplicativo de aprendizado de japonês calmo, zen e acolhedor.
O usuário está praticando conversação. 
Instruções estritas:
1. Responda em japonês simples adequado para alunos N5/N4.
2. Sempre forneça a leitura em romaji e a tradução em português.
3. Se o aluno cometeu um pequeno erro, aponte com gentileza e ensine a forma correta.
4. Mantenha as respostas concisas (máximo 2 a 3 frases em japonês).
5. Estruture a resposta assim:
[Japonês]: <frase em japonês>
[Romaji]: <leitura em romaji>
[Tradução]: <tradução em português>
[Dica/Correção]: <dica breve, se aplicável>`;

      const aiReply = await chatCompletion(userText, {
        systemPrompt,
        model: "auto",
      });

      // Parse da resposta da IA
      let ja = aiReply;
      let ro = "";
      let pt = "";

      const jaMatch = aiReply.match(/\[Japonês\]:\s*(.*?)(?=\[Romaji\]|$)/is);
      const roMatch = aiReply.match(/\[Romaji\]:\s*(.*?)(?=\[Tradução\]|$)/is);
      const ptMatch = aiReply.match(
        /\[Tradução\]:\s*(.*?)(?=\[Dica\/Correção\]|$)/is,
      );

      if (jaMatch) ja = jaMatch[1].trim();
      if (roMatch) ro = roMatch[1].trim();
      if (ptMatch) pt = ptMatch[1].trim();

      const botMsg = {
        id: `ai-${Date.now()}`,
        sender: "bot",
        author: "Sensei IA",
        avatar: "先",
        ja: ja || aiReply,
        ro: ro,
        pt: pt || "Resposta gerada pelo Sensei IA.",
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };

      setMessages((prev) => [...prev, botMsg]);
      if (ja) handleSpeak(ja.replace(/\[.*?\]/g, ""));
    } catch (err) {
      if (toast) toast("OmniRoute offline. Usando modo guiado local.");
      const fallbackMsg = {
        id: `ai-err-${Date.now()}`,
        sender: "bot",
        author: "Sensei (Offline)",
        avatar: "先",
        ja: "大丈夫ですよ。一緒に練習しましょう。(Daijoubu desu yo. Issho ni renshuu shimashou.)",
        ro: "Daijoubu desu yo. Issho ni renshuu shimashou.",
        pt: "Não tem problema! Vamos continuar praticando juntos. (O servidor OmniRoute local não respondeu, mas você pode usar os Cenários Guiados sem limites!).",
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setLoadingAi(false);
    }
  };

  const handleResetChat = () => {
    if (mode === "guided") {
      setMessages([
        {
          id: `m0-${Date.now()}`,
          sender: "bot",
          author: scenario.character,
          avatar: scenario.avatar,
          ja: scenario.starter.ja,
          ro: scenario.starter.ro,
          pt: scenario.starter.pt,
          time: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        },
      ]);
    } else {
      setMessages([
        {
          id: `m0-ai-${Date.now()}`,
          sender: "bot",
          author: "Sensei IA",
          avatar: "先",
          ja: "リセットしました！また何でも聞いてくださいね。(Risetto shimashita! Mata nandemo kiite kudasai ne.)",
          ro: "Risetto shimashita! Mata nandemo kiite kudasai ne.",
          pt: "Conversa reiniciada! Pode falar o que quiser.",
          time: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        },
      ]);
    }
  };

  return (
    <div className="w-full space-y-6">
      {/* Topo do Módulo de Conversação */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-1.5 bg-paper rounded-xl border border-line">
        <div className="flex flex-wrap gap-1">
          <button
            type="button"
            className={`px-3.5 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 cursor-pointer transition-colors border ${
              mode === "guided"
                ? "bg-surface text-ink font-bold border-line"
                : "text-muted hover:text-ink hover:bg-surface/50 border-transparent"
            }`}
            onClick={() => setMode("guided")}
          >
            <Icon name="learn" />
            <span>Cenários do Dia a Dia (Offline)</span>
          </button>
          <button
            type="button"
            className={`px-3.5 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 cursor-pointer transition-colors border ${
              mode === "ai"
                ? "bg-surface text-ink font-bold border-line"
                : "text-muted hover:text-ink hover:bg-surface/50 border-transparent"
            }`}
            onClick={() => setMode("ai")}
          >
            <Icon name="bolt" />
            <span>Conversa com IA</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            className="px-3 py-1.5 rounded-lg border border-line bg-surface text-xs font-semibold text-ink hover:bg-paper cursor-pointer transition-colors"
            onClick={() => setShowFurigana((v) => !v)}
            title="Alternar leitura fonética e tradução"
          >
            <span>{showFurigana ? "Ocultar Leitura" : "Mostrar Leitura"}</span>
          </button>
          <button
            type="button"
            className="px-3 py-1.5 rounded-lg border border-line bg-surface text-xs font-semibold text-ink hover:bg-paper cursor-pointer transition-colors"
            onClick={handleResetChat}
            title="Reiniciar diálogo do início"
          >
            <span>Reiniciar</span>
          </button>
        </div>
      </div>

      {/* Seletor de Cenários (Apenas no Modo Guiado) */}
      {mode === "guided" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 w-full min-w-0">
          {SCENARIOS.map((sc, i) => (
            <button
              key={sc.id}
              type="button"
              className={`p-3 rounded-xl border text-left cursor-pointer transition-all flex items-center gap-3 ${
                i === selectedScenarioIndex
                  ? "border-primary bg-accent-soft/30 font-bold"
                  : "border-line bg-surface hover:border-edge"
              }`}
              onClick={() => setSelectedScenarioIndex(i)}
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-paper font-jp text-lg font-bold text-primary-strong border border-line">
                {sc.avatar}
              </span>
              <div className="min-w-0 flex-1">
                <strong className="text-xs block text-ink truncate">
                  {sc.title}
                </strong>
                <small className="text-[11px] text-muted block truncate">
                  {sc.character} · {sc.role}
                </small>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Área do Chat */}
      {/* Painel Central do Chat com Maior Altura e Borda 3D */}
      <div className="p-4 sm:p-6 rounded-3xl border-2 border-b-6 border-[#e5e5e5] bg-white space-y-4">
        {mode === "guided" && scenario.culturalTip && (
          <div className="p-4 rounded-2xl border-2 border-[#ff9600]/30 bg-[#ffebd1]/40 text-xs sm:text-sm text-[#b86200] flex items-start gap-2.5 leading-relaxed">
            <span className="text-[#ff9600] pt-0.5">
              <Icon name="torii" className="w-4 h-4 shrink-0" />
            </span>
            <div>
              <strong className="text-[#b86200] font-black">Dica de Cultura e Etiqueta:</strong>{" "}
              <span>{scenario.culturalTip}</span>
            </div>
          </div>
        )}

        {/* Mensagens com maior altura */}
        <div className="min-h-[460px] max-h-[680px] overflow-y-auto space-y-4 pr-1">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex items-start gap-3 ${
                m.sender === "user"
                  ? "justify-end ml-auto max-w-[85%]"
                  : "max-w-[85%]"
              }`}
            >
              {m.sender === "bot" && (
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-accent-soft border border-primary/25 font-jp text-xs font-bold text-primary">
                  {m.avatar || "言"}
                </div>
              )}
              <div
                className={`p-4 rounded-2xl border text-sm space-y-2 ${
                  m.sender === "user"
                    ? "border-primary/25 bg-accent-soft/60 text-ink"
                    : "border-line bg-paper text-ink"
                }`}
              >
                <div className="flex items-center justify-between gap-3 text-xs text-muted pb-1 border-b border-line/60">
                  <strong className="text-ink font-semibold">{m.author}</strong>
                  <span className="text-[10px]">{m.time}</span>
                </div>

                {m.sender === "user" ? (
                  <p className="leading-relaxed">{m.text}</p>
                ) : (
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between gap-2">
                      <span
                        className="font-jp text-base font-bold text-primary-strong"
                        lang="ja"
                      >
                        {m.ja}
                      </span>
                      <button
                        type="button"
                        className="p-1 rounded-md text-muted hover:text-ink hover:bg-surface cursor-pointer transition-colors"
                        onClick={() => handleSpeak(m.ja)}
                        aria-label="Ouvir pronúncia"
                      >
                        <Icon name="sound" />
                      </button>
                    </div>

                    {showFurigana && m.ro && (
                      <p className="text-xs text-muted font-medium">{m.ro}</p>
                    )}
                    {showFurigana && m.pt && (
                      <p className="text-xs text-ink/80 pt-0.5 border-t border-line/50">
                        {m.pt}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}

          {loadingAi && (
            <div className="flex items-start gap-3 max-w-[85%]">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-paper border border-line font-jp text-xs font-bold text-primary-strong">
                先
              </div>
              <div className="p-3.5 rounded-2xl border border-line bg-paper text-xs text-muted italic">
                <span>Sensei pensando...</span>
              </div>
            </div>
          )}
          <div ref={chatBottomRef} />
        </div>

        {/* Sugestões de Respostas Rápidas (Modo Guiado) */}
        {mode === "guided" && scenario.quickReplies?.length > 0 && (
          <div className="pt-2 border-t border-line space-y-2">
            <span className="text-xs font-bold text-muted uppercase tracking-wider block">
              Como você pode responder:
            </span>
            <div className="flex flex-wrap gap-2">
              {scenario.quickReplies.map((qr, idx) => (
                <button
                  key={idx}
                  type="button"
                  className="px-3 py-1.5 rounded-xl border border-line bg-surface hover:border-edge text-xs font-semibold text-ink cursor-pointer transition-colors flex items-center gap-2"
                  onClick={() => handleSendQuickReply(qr)}
                >
                  <span>{qr.text}</span>
                  <Icon name="arrow" />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input de Envio Livre */}
        <form
          className="flex gap-2 pt-2 border-t border-line"
          onSubmit={handleSendMessage}
        >
          <input
            type="text"
            className="flex-1 px-4 py-2.5 rounded-xl border border-line bg-paper text-sm text-ink placeholder:text-muted focus:outline-edge focus:bg-surface transition-colors"
            placeholder={
              mode === "guided"
                ? "Ou digite sua própria resposta em japonês..."
                : "Converse com o Sensei IA em japonês ou tire uma dúvida..."
            }
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            disabled={loadingAi}
          />
          <button
            type="submit"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white font-bold text-sm cursor-pointer hover:bg-primary-strong disabled:opacity-50 transition-colors"
            disabled={!inputVal.trim() || loadingAi}
          >
            <span>Enviar</span>
            <Icon name="arrow" />
          </button>
        </form>
      </div>
    </div>
  );
}

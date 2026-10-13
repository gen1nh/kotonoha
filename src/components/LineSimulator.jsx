import React, { useState, useRef, useEffect } from "react";
import Icon from "./Icon.jsx";
import { Button, Card } from "./ui/index.jsx";
import { PageHeading } from "./UI.jsx";
import { chatCompletion } from "../ai.js";

export const LINE_SCENARIOS = [
  {
    id: "kyoto_hotel",
    title: "Check-in em Hotel / Ryokan em Kyoto",
    character: "Yamada (Recepcionista)",
    avatar: "宿",
    defaultFormality: "keigo",
    levelBadge: "N3+ · Keigo",
    context: "Chegando à recepção após uma longa viagem de Shinkansen.",
    culturalNuance:
      "Hospitalidade Japonesa (Omotenashi): O recepcionista usa Keigo polidíssimo (Kenjougo e Sonkeigo). Responda com Desu/Masu sem pressa.",
    starter: {
      ja: "いらっしゃいませ。京都ホテルへようこそ。ご予約のお名前をお伺いしてもよろしいでしょうか？",
      ro: "Irasshaimase. Kyouto Hoteru e youkoso. Go-yoyaku no o-namae o o-ukagai shitemo yoroshii deshou ka?",
      pt: "Seja muito bem-vindo ao Kyoto Hotel. Poderia, por gentileza, me informar o nome da sua reserva?",
    },
    quickReplies: [
      {
        text: "ブラジルから来ました[Seu Nome]です。3泊で予約しました。",
        meaning: "Sou [Nome] do Brasil. Reservei por 3 noites.",
      },
      {
        text: "パスポートはこちらです。チェックインをお願いします。",
        meaning: "Aqui está o passaporte. O check-in, por favor.",
      },
      {
        text: "荷物を先に預けることはできますか？",
        meaning: "Posso deixar minhas malas guardadas antes?",
      },
    ],
  },
  {
    id: "tokyo_business",
    title: "Reunião de Negócios / Trabalho em Tóquio",
    character: "Sato (Gerente de Projetos)",
    avatar: "社",
    defaultFormality: "keigo",
    levelBadge: "N3+ · Corporativo",
    context: "Iniciando uma reunião presencial no escritório em Marunouchi.",
    culturalNuance:
      "Tatemae corporativo: Sempre comece com agradecimento pelo tempo e cooperação mútua (O-sewa ni natte orimasu).",
    starter: {
      ja: "いつも大変お世話になっております。本日はお時間をいただき、誠にありがとうございます。",
      ro: "Itsumo taihen o-sewa ni natte orimasu. Honjitsu wa o-jikan o itadaki, makoto ni arigatou gozaimasu.",
      pt: "Agradeço sempre por nossa parceria. Muito obrigado por dedicar seu valioso tempo no dia de hoje.",
    },
    quickReplies: [
      {
        text: "こちらこそ、本日はよろしくお願いいたします。",
        meaning: "Eu que agradeço. Conto com a sua colaboração hoje.",
      },
      {
        text: "プロジェクトの進捗についてご報告いたします。",
        meaning: "Gostaria de relatar o andamento do projeto.",
      },
    ],
  },
  {
    id: "friends_shibuya",
    title: "Combinando Rolê em Shibuya com Amigos",
    character: "Ren (Colega de Faculdade)",
    avatar: "友",
    defaultFormality: "tameguchi",
    levelBadge: "N4+ · Casual",
    context: "Mensagens rápidas no chat do LINE para se encontrar na estátua do Hachiko.",
    culturalNuance:
      "Modo Tameguchi (Casual): Amigos dispensam 'Desu/Masu' e usam partículas finais como 'ne', 'yo', 'sa'.",
    starter: {
      ja: "ハチ公前着いたよ！今どこ？今日めちゃ混んでるね！",
      ro: "Hachikou-mae tsuita yo! Ima doko? Kyou mecha konderu ne!",
      pt: "Cheguei na frente do Hachiko! Onde você tá? Tá lotado hoje!",
    },
    quickReplies: [
      {
        text: "今改札出たところ！あと2分で着く！",
        meaning: "Acabei de sair da catraca! Chego em 2 minutos!",
      },
      {
        text: "ごめん、ちょっと電車遅れてて、あと5分待って！",
        meaning: "Desculpa, o trem atrasou um pouco, me espera 5 min!",
      },
      {
        text: "スタバの横にいるよ！緑の服着てる！",
        meaning: "Tô do lado do Starbucks! Tô de roupa verde!",
      },
    ],
  },
];

export default function LineSimulator({ toast, speak }) {
  const [scenarioIndex, setScenarioIndex] = useState(0);
  const [formality, setFormality] = useState("keigo"); // "keigo", "tameguchi"
  const [messages, setMessages] = useState([]);
  const [inputVal, setInputVal] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scenario = LINE_SCENARIOS[scenarioIndex];

  useEffect(() => {
    setFormality(scenario.defaultFormality);
    setMessages([
      {
        id: "msg-0",
        sender: "bot",
        author: scenario.character,
        avatar: scenario.avatar,
        ja: scenario.starter.ja,
        ro: scenario.starter.ro,
        pt: scenario.starter.pt,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      },
    ]);
  }, [scenarioIndex]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleSendMessage = async (textToSend) => {
    const text = textToSend || inputVal.trim();
    if (!text || loading) return;

    const userMsg = {
      id: `u-${Date.now()}`,
      sender: "user",
      author: "Você",
      text,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputVal("");
    setLoading(true);

    try {
      const systemPrompt = `Você está atuando no simulador de conversas do LINE no papel de: ${scenario.character}.
Cenário: ${scenario.title}.
Modo de Formalidade Selecionado: ${formality === "keigo" ? "KEIGO (Formal / Corporativo / Omotenashi)" : "TAMEGUCHI (Casual / Amigável / Sem Desu/Masu)"}.
Regra Cultural: ${scenario.culturalNuance}.

Responda como uma pessoa nativa japonesa trocaria mensagens no LINE. Mantenha as mensagens curtas (1 a 3 frases no máximo), naturais, usando a formalidade solicitada.
Formate a resposta exatamente assim:
[Japonês]: <frase em japonês>
[Romaji]: <leitura romaji>
[Tradução]: <tradução em português>
[Nuance]: <dica breve sobre Honne/Tatemae ou vocabulário usado>`;

      const aiReply = await chatCompletion(text, { systemPrompt });

      let ja = aiReply;
      let ro = "";
      let pt = "";
      let nuance = "";

      const jaMatch = aiReply.match(/\[Japonês\]:\s*(.*?)(?=\[Romaji\]|$)/is);
      const roMatch = aiReply.match(/\[Romaji\]:\s*(.*?)(?=\[Tradução\]|$)/is);
      const ptMatch = aiReply.match(/\[Tradução\]:\s*(.*?)(?=\[Nuance\]|$)/is);
      const nuanceMatch = aiReply.match(/\[Nuance\]:\s*(.*?)$/is);

      if (jaMatch) ja = jaMatch[1].trim();
      if (roMatch) ro = roMatch[1].trim();
      if (ptMatch) pt = ptMatch[1].trim();
      if (nuanceMatch) nuance = nuanceMatch[1].trim();

      const botMsg = {
        id: `bot-${Date.now()}`,
        sender: "bot",
        author: scenario.character,
        avatar: scenario.avatar,
        ja: ja || aiReply,
        ro,
        pt: pt || "Resposta recebida no LINE.",
        nuance,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      setMessages((prev) => [...prev, botMsg]);
      if (ja && speak) speak(ja.replace(/\[.*?\]/g, ""));
    } catch (err) {
      if (toast) toast("Conexão instável. Simulando resposta local do LINE.");
      const fallbackMsg = {
        id: `fb-${Date.now()}`,
        sender: "bot",
        author: scenario.character,
        avatar: scenario.avatar,
        ja: formality === "keigo" ? "かしこまりました。承知いたしました。" : "了解！わかったよ！",
        ro: formality === "keigo" ? "Kashikomarimashita. Shouchi itashimashita." : "Ryoukai! Wakatta yo!",
        pt: formality === "keigo" ? "Entendido, perfeitamente." : "Beleza, entendi!",
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full space-y-6">
      {/* Seletor de Cenários e Formalidade */}
      <PageHeading
        title="Simulador de Vida Real · Modo LINE"
        description="Treine mensagens do dia a dia com variação de polidez (Keigo formal vs Tameguchi casual)."
        icon="phone"
        iconBg="bg-accent-soft"
        iconColor="text-primary"
      >
        {/* Alternador Keigo vs Tameguchi */}
        <div className="flex items-center gap-1.5 p-1 bg-raised rounded-2xl border-2 border-line">
          <button
            type="button"
            onClick={() => setFormality("keigo")}
            className={`px-3.5 py-1.5 rounded-xl type-caption cursor-pointer transition-colors ${
              formality === "keigo"
                ? "bg-blue text-white shadow-xs"
                : "text-muted hover:text-ink-strong"
            }`}
          >
            敬語 Keigo (Polido)
          </button>
          <button
            type="button"
            onClick={() => setFormality("tameguchi")}
            className={`px-3.5 py-1.5 rounded-xl type-caption cursor-pointer transition-colors ${
              formality === "tameguchi"
                ? "bg-primary text-white shadow-xs"
                : "text-muted hover:text-ink-strong"
            }`}
          >
            タメ口 Tameguchi (Casual)
          </button>
        </div>
      </PageHeading>

      {/* Cartões dos Cenários Disponíveis */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full min-w-0">
        {LINE_SCENARIOS.map((sc, idx) => (
          <button
            key={sc.id}
            type="button"
            onClick={() => setScenarioIndex(idx)}
            className={`p-4 rounded-2xl border-2 text-left cursor-pointer transition-all active:translate-y-px ${
              idx === scenarioIndex
                ? "border-primary bg-accent-soft/40 border-b-4 border-b-primary-dark shadow-xs"
                : "border-line bg-paper hover:bg-raised border-b-4 border-b-edge"
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-raised border-2 border-line text-base font-black font-jp text-ink-strong">
                {sc.avatar}
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-1">
                  <strong className="type-h3 text-ink-strong block truncate">
                    {sc.title}
                  </strong>
                  <span className="type-caption text-primary bg-accent-soft px-1.5 py-0.5 rounded-md text-[10px] shrink-0 border border-primary/20">
                    {sc.levelBadge}
                  </span>
                </div>
                <span className="type-body-sm text-muted block truncate mt-0.5">
                  {sc.character}
                </span>
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Interface do Aplicativo LINE com visual limpo e bordas 3D */}
      <div className="rounded-3xl border-2 border-b-6 border-line bg-raised overflow-hidden shadow-xs flex flex-col min-h-[min(680px,74dvh)]">
        {/* Header do Chat LINE */}
        <div className="bg-paper border-b-2 border-line text-ink-strong px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary text-white font-jp font-black text-base border-2 border-primary-dark shadow-xs">
              {scenario.avatar}
            </div>
            <div>
              <strong className="type-h3 block text-ink-strong leading-tight">
                {scenario.character}
              </strong>
              <span className="type-caption text-primary block mt-0.5">
                {formality === "keigo" ? "Modo Formal (Keigo)" : "Modo Casual (Tameguchi)"}
              </span>
            </div>
          </div>
          <span className="type-caption px-3 py-1.5 rounded-xl bg-raised border-2 border-line text-ink-strong flex items-center gap-1.5">
            <Icon name="phone" className="w-3.5 h-3.5 text-primary" />
            <span>LINE Sim</span>
          </span>
        </div>

        {/* Nuance Cultural do Cenário */}
        <div className="bg-gold-soft text-gold-ink px-4 py-2 text-xs font-bold flex items-center gap-2 border-b border-gold/20">
          <Icon name="torii" className="w-4 h-4 text-gold-dark shrink-0" />
          <span className="truncate">{scenario.culturalNuance}</span>
        </div>

        {/* Área de Mensagens (Fundo Suave LINE com maior altura) */}
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4 min-h-[min(320px,45dvh)] max-h-[48dvh]">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex items-start gap-2.5 ${
                m.sender === "user" ? "justify-end ml-auto max-w-[85%]" : "max-w-[85%]"
              }`}
            >
              {m.sender === "bot" && (
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-paper font-jp text-xs font-black text-ink-strong border-2 border-line shadow-xs mt-1">
                  {m.avatar}
                </div>
              )}
              <div
                className={`p-4 rounded-2xl text-xs space-y-1.5 relative ${
                  m.sender === "user"
                    ? "bg-primary text-white font-bold rounded-tr-none border-b-4 border-primary-dark shadow-xs"
                    : "bg-paper text-ink-strong rounded-tl-none border-2 border-b-4 border-line shadow-xs"
                }`}
              >
                {m.sender === "user" ? (
                  <p className="text-sm leading-relaxed">{m.text}</p>
                ) : (
                  <div>
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-jp text-sm font-black text-ink-strong" lang="ja">
                        {m.ja}
                      </span>
                      {speak && (
                        <button
                          type="button"
                          onClick={() => speak(m.ja)}
                          className="p-1 rounded-lg text-muted hover:text-ink-strong cursor-pointer"
                          title="Ouvir áudio"
                        >
                          <Icon name="sound" />
                        </button>
                      )}
                    </div>
                    {m.ro && <p className="text-[11px] text-muted mt-0.5">{m.ro}</p>}
                    {m.pt && (
                      <p className="text-[11px] text-muted pt-1 mt-1 border-t border-line">
                        {m.pt}
                      </p>
                    )}
                    {m.nuance && (
                      <div className="mt-1.5 p-2 rounded-lg bg-gold-soft text-gold-ink text-[10px] leading-snug flex items-start gap-1.5">
                        <Icon name="sparkles" className="w-3.5 h-3.5 shrink-0 text-flame mt-0.5" />
                        <span>{m.nuance}</span>
                      </div>
                    )}
                  </div>
                )}
                <span
                  className={`text-[9px] block text-right mt-1 ${
                    m.sender === "user" ? "text-white/70" : "text-muted"
                  }`}
                >
                  {m.time}
                </span>
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex items-start gap-2 max-w-[85%]">
              <div className="p-3 bg-paper rounded-2xl rounded-tl-none text-xs text-muted italic border-2 border-line">
                Digitando no LINE...
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Respostas Rápidas Sugeridas */}
        {scenario.quickReplies && scenario.quickReplies.length > 0 && (
          <div className="p-3.5 bg-paper/95 border-t-2 border-line space-y-2">
            <span className="type-caption text-muted block">
              Sugestões de Respostas em Japonês:
            </span>
            <div className="flex flex-wrap gap-2">
              {scenario.quickReplies.map((qr, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSendMessage(qr.text)}
                  className="px-3.5 py-2 rounded-xl border-2 border-b-4 border-line hover:border-primary active:translate-y-px bg-paper text-xs text-left cursor-pointer transition-all"
                >
                  <strong className="block text-xs font-black text-ink-strong font-jp">{qr.text}</strong>
                  <span className="type-caption text-muted block mt-0.5">{qr.meaning}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input de Envio do LINE */}
        <form
          className="p-3 bg-paper flex gap-2 border-t-2 border-line"
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
        >
          <input
            type="text"
            className="flex-1 px-4 py-2.5 rounded-xl border-2 border-b-4 border-line bg-raised text-sm font-bold text-ink-strong focus:outline-primary focus:bg-paper"
            placeholder="Digite em japonês ou português para o LINE..."
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            disabled={loading}
          />
          <Button
            variant="primary"
            size="md"
            type="submit"
            disabled={!inputVal.trim() || loading}
          >
            Enviar
          </Button>
        </form>
      </div>
    </div>
  );
}

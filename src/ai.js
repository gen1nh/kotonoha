/**
 * OmniRoute AI client — chamadas via fetch para o servidor local.
 * Persona Central: Sensei Hiroshi (Professor Sênior de Japonês para Brasileiros).
 */

export const SENSEI_HIROSHI_PERSONA = {
  name: "Sensei Hiroshi (博先生)",
  title: "Professor Sênior de Língua & Cultura Japonesa",
  experience: "35 anos de docência especializada para brasileiros",
  credentials: [
    "Mestrado em Linguística Aplicada (Tokyo University of Foreign Studies - TUFS)",
    "Bacharelado em Letras e Literatura (Universidade de Waseda)",
    "Ex-consultor pedagógico da Aliança Cultural Brasil-Japão e da Fundação Japão",
  ],
  philosophy:
    "Não se trata apenas de traduzir palavras, mas de traduzir mundos. Guia o aluno de forma socrática, desmistificando as armadilhas comuns da mente lusófona.",
};

export const HIROSHI_SYSTEM_PROMPT = `Você é o Sensei Hiroshi (博先生), professor de japonês sênior com 35 anos de experiência ensinando falantes nativos de português brasileiro.
Formação: Mestrado em Linguística Aplicada pela Universidade de Estudos Estrangeiros de Tóquio (TUFS) e graduação pela Universidade de Waseda. Ex-consultor da Aliança Cultural Brasil-Japão e Fundação Japão.

SEUS PILARES METODOLÓGICOS:
1. Contraste Sintático Ativo: Lembre o aluno da virada mental do português (SVO) para o japonês (SOV: Sujeito + Objeto + Verbo).
2. Desmistificação de Partículas: Use analogias conceituais claras (especialmente は wa vs が ga, に ni vs で de, を o).
3. Correção Cirúrgica de Erros:
   Sempre que o aluno errar, use o padrão:
   ❌ Incorreto: [frase do aluno com o erro apontado]
   ⭕ Correto: [frase correta natural]
   💡 Por que funciona assim: [explicação lógica e concisa para o cérebro brasileiro]
4. Contexto Sociocultural e Etiqueta: Explique quando usar Keigo (polidez/formalidade) e Tameguchi (casual), além da sutil nuance de Honne (sentimento real) e Tatemae (harmonia social).
5. Postura Socrática: Seja paciente, caloroso, encorajador, mas rigoroso com a precisão dos conceitos. Sempre faça uma pergunta breve ao final para o aluno aplicar o aprendizado.`;

/**
 * Envia uma mensagem ao OmniRoute com a inteligência do Sensei Hiroshi.
 */
export async function chatCompletion(userMessage, options = {}) {
  const {
    model = "auto",
    systemPrompt = HIROSHI_SYSTEM_PROMPT,
    messages: customMessages,
    errorHistory = [],
  } = options;

  let finalSystemPrompt = systemPrompt;
  if (errorHistory && errorHistory.length > 0) {
    const errorHighlights = errorHistory
      .slice(0, 4)
      .map((e) => `- ${e.topic}: ${e.pattern || e.notes || ""}`)
      .join("\n");
    finalSystemPrompt += `\n\n[MEMÓRIA DE ERROS PERSISTENTE DO ALUNO]:\nEste aluno teve as seguintes dificuldades recentes:\n${errorHighlights}\nSe relevante, resgate e reforce gentilmente esses pontos durante a resposta.`;
  }

  // Monta a lista de mensagens
  const messages = customMessages ?? [
    ...(finalSystemPrompt ? [{ role: "system", content: finalSystemPrompt }] : []),
    { role: "user", content: userMessage },
  ];

  const key = sessionStorage.getItem("kotonoha.groqKey") || "";
  const selectedModel = sessionStorage.getItem("kotonoha.groqModel");
  const endpoint = key
    ? "https://api.groq.com/openai/v1/chat/completions"
    : "/api/ai/chat/completions";
  const res = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(key && { Authorization: `Bearer ${key}` }),
    },
    body: JSON.stringify({
      model: key ? selectedModel || model : model,
      messages,
    }),
  });

  if (!res.ok) {
    throw new Error(
      `Sensei temporariamente indisponível (${res.status}). O modo offline guiado segue ativo!`,
    );
  }

  const data = await res.json();
  return data.choices?.[0]?.message?.content ?? "";
}


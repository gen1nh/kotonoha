/** Author-written listening exercises using browser TTS; NOT an N5 certification bank. */
export const FORMATIVE_LISTENING_N5 = Object.freeze([
  {
    id: 'n5-hearing-01',
    spokenText: '明日は月曜日です。',
    prompt: 'Que dia da semana será amanhã?',
    choices: ['Segunda-feira', 'Terça-feira', 'Domingo', 'Sábado'],
    answerIndex: 0,
    explanation: '明日 (あした) significa amanhã e 月曜日 (げつようび) é segunda-feira.',
  },
  {
    id: 'n5-hearing-02',
    spokenText: 'わたしは水を飲みます。',
    prompt: 'O que a pessoa vai beber?',
    choices: ['Chá', 'Água', 'Leite', 'Café'],
    answerIndex: 1,
    explanation: '水 (みず) é água; 飲みます (のみます) significa beber.',
  },
  {
    id: 'n5-hearing-03',
    spokenText: '今、七時半です。',
    prompt: 'Que horas são?',
    choices: ['7h', '7h30', '8h30', '6h30'],
    answerIndex: 1,
    explanation: '七時 (しちじ) é sete horas e 半 (はん) significa meia hora.',
  },
  {
    id: 'n5-hearing-04',
    spokenText: '田中さんは先生です。',
    prompt: 'Qual é a profissão de Tanaka?',
    choices: ['Estudante', 'Motorista', 'Professor(a)', 'Médico(a)'],
    answerIndex: 2,
    explanation: '先生 (せんせい) significa professor(a).',
  },
  {
    id: 'n5-hearing-05',
    spokenText: '本は机の上にあります。',
    prompt: 'Onde está o livro?',
    choices: ['Embaixo da mesa', 'Em cima da mesa', 'Dentro da bolsa', 'Ao lado da porta'],
    answerIndex: 1,
    explanation: '机の上 (つくえのうえ) significa em cima da mesa.',
  },
  {
    id: 'n5-hearing-06',
    spokenText: 'きのう、映画を見ました。',
    prompt: 'O que a pessoa fez ontem?',
    choices: ['Leu um livro', 'Foi trabalhar', 'Viu um filme', 'Comprou comida'],
    answerIndex: 2,
    explanation: 'きのう significa ontem e 映画を見ました (えいがをみました) significa viu um filme.',
  },
]);

export function gradeFormativeListening(question, answerIndex, heardAudio) {
  if (!question || !Number.isInteger(answerIndex) || answerIndex < 0 || answerIndex > 3) return { status: 'incomplete' };
  return {
    status: 'practice-result',
    correct: answerIndex === question.answerIndex,
    heardAudio: Boolean(heardAudio),
    skillEvidence: heardAudio ? 'formative-tts-listening' : 'reading-assistance',
    certificationEligible: false,
    officialJlptCertification: false,
  };
}

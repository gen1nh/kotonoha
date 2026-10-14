/** Curriculum editorial N5; references are descriptors, not an official fixed JLPT item list. */
export const N5_CURRICULUM_VERSION = 1;
export const N5_CURRICULUM = Object.freeze([
  { id:'n5-kana-hiragana', domain:'writing-system', topic:'hiragana', title:'Reconhecer e ler hiragana', outcomes:['Ler as 46 formas básicas','Reconhecer combinações com dakuten e yōon','Usar a escrita em palavras conhecidas'] },
  { id:'n5-kana-katakana', domain:'writing-system', topic:'katakana', title:'Reconhecer e ler katakana', outcomes:['Ler as 46 formas básicas','Reconhecer empréstimos comuns','Entender vogais longas e pequenas combinações'] },
  { id:'n5-vocab-daily', domain:'vocabulary', topic:'words', title:'Vocabulário cotidiano', outcomes:['Reconhecer pessoas, família e objetos','Entender comida, compras e locais','Compreender expressões frequentes'] },
  { id:'n5-vocab-time', domain:'vocabulary', topic:'words', title:'Tempo e números', outcomes:['Entender números, datas e horários','Distinguir frequências e períodos','Aplicar contadores frequentes'] },
  { id:'n5-kanji-recognition', domain:'vocabulary', topic:'words', title:'Kanji contextualizado', outcomes:['Ler caracteres comuns em frases simples','Reconhecer significados e leituras em contexto','Não depender exclusivamente de tradução'] },
  { id:'n5-grammar-basic', domain:'grammar', topic:'grammar', title:'Frases básicas e partículas', outcomes:['Construir enunciados com です e ます','Usar は, が, を, に, で, へ, の em contextos simples','Formular perguntas e negações'] },
  { id:'n5-grammar-verbs', domain:'grammar', topic:'grammar', title:'Tempos, adjetivos e pedidos', outcomes:['Distinguir presente e passado educados','Reconhecer adjetivos い e な','Compreender pedidos e permissões simples'] },
  { id:'n5-reading-messages', domain:'reading', topic:'words', title:'Ler mensagens curtas', outcomes:['Interpretar avisos e frases cotidianas','Localizar quem, onde e quando','Identificar intenção pelo contexto'] },
  { id:'n5-reading-connected', domain:'reading', topic:'grammar', title:'Ler textos básicos', outcomes:['Interpretar parágrafos curtos de tema familiar','Rastrear referências entre frases','Identificar a informação solicitada'] },
  { id:'n5-listening-dialogues', domain:'listening', topic:null, title:'Compreender diálogos lentos', outcomes:['Entender apresentações e cumprimentos','Identificar lugares, horas e pedidos','Escolher informações em diálogos curtos'] },
  { id:'n5-listening-tasks', domain:'listening', topic:null, title:'Compreender instruções simples', outcomes:['Seguir orientação curta e clara','Entender perguntas frequentes','Selecionar respostas adequadas pelo contexto'] },
]);
export const N5_CURRICULUM_SOURCES = Object.freeze([
  { title:'JLPT – objetivos e formato',url:'https://www.jlpt.jp/e/about/levelsummary.html',type:'reference-only' },
  { title:'JF Standard – competências comunicativas',url:'https://www.jfstandard.jpf.go.jp/',type:'reference-only' },
]);

export function validateN5Curriculum(items=N5_CURRICULUM){
  const errors=[];const seen=new Set();
  for(const item of items){
    if(!item?.id || seen.has(item.id))errors.push('missing or duplicate curriculum id');
    seen.add(item?.id);
    if(!item?.title || !Array.isArray(item.outcomes) || item.outcomes.length<2)errors.push(`missing goals: ${item?.id}`);
  }
  const domains=new Set(items.map(item=>item.domain));
  for(const domain of ['writing-system','vocabulary','grammar','reading','listening'])if(!domains.has(domain))errors.push(`uncovered domain: ${domain}`);
  return errors;
}

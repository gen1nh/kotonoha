/** Formative application of existing lesson examples. Independent review pending. */
const verbs=['ます','ません','ました','ませんでした'];
const nominals=['です','じゃありません','でした','じゃありませんでした'];
const adjectives=['い','くない','かった','くなかった'];
const rows=[
 [14,'ます',verbs],[15,'ません',verbs],[16,'ました',verbs],[17,'ませんでした',verbs],
 [18,'じゃありません',nominals],[19,'でした',nominals],[20,'じゃありませんでした',nominals],
 [21,'新しい',['新しい','新しくない','新しかった','新しくなかった']],
 [22,'くない',adjectives],[23,'かった',adjectives],[24,'くなかった',adjectives],
 [26,'あります',['あります','います','ありません','いません']],
 [27,'います',['います','あります','いません','ありません']],
 [32,'書いてください',['書いてください','書かないでください','書きました','書きません']],
 [33,'撮らないでください',['撮らないでください','撮ってください','撮りました','撮りたいです']],
 [34,'読んでいます',['読んでいます','読みません','読みました','読みたいです']],
 [35,'座ってもいいですか',['座ってもいいですか','座ってはいけません','座りましたか','座りません']],
 [36,'吸ってはいけません',['吸ってはいけません','吸ってもいいです','吸いたいです','吸いました']],
 [37,'行きましょう',['行きましょう','行きませんでした','行きました','行かないでください']],
 [38,'飲みませんか',['飲みませんか','飲みました','飲みませんでした','飲まないでください']],
 [39,'行きたいです',['行きたいです','行きました','行きません','行かないでください']],
];
// New contexts on retry assess transfer, not just recall of the lesson sentence.
// Drafts remain tied to their attempt, and the original first-attempt item is unchanged.
// These are formative editorial candidates, not certified exam questions.
const transferRows=new Map([
 [14,{sentence:'毎朝パンを食べます。',meaning:'Como pão todas as manhãs.',answer:'ます',options:verbs}],
 [15,{sentence:'今日は学校へ行きません。',meaning:'Hoje não vou à escola.',answer:'ません',options:verbs}],
 [16,{sentence:'昨日、友達と話しました。',meaning:'Ontem conversei com um amigo.',answer:'ました',options:verbs}],
 [17,{sentence:'昨日はテレビを見ませんでした。',meaning:'Ontem não assisti à televisão.',answer:'ませんでした',options:verbs}],
]);
export function grammarApplication(unit,attempt=0){
 const row=rows.find(([index])=>index===unit.index);
 if(!row)return null;
 const [,answer,options]=row,g=unit.items[0];
 const transfer=attempt>0?transferRows.get(unit.index):null;
 if(transfer){
  if(transfer.sentence.split(transfer.answer).length!==2)throw new Error(`Invalid transfer target in ${unit.id}`);
  return {id:`${unit.id}:transfer-v1`,prompt:`Complete para expressar: “${transfer.meaning}”`,
   text:transfer.sentence.replace(transfer.answer,'＿＿＿'),answer:transfer.answer,options:transfer.options,
   explanation:`${g.text} Neste novo contexto, a frase é ${transfer.sentence} (${transfer.meaning}). Compare a marcação de tempo e a forma verbal.`};
 }
 if(!g.example.includes(answer))throw new Error(`Missing application target in ${unit.id}`);
 return {id:`${unit.id}:application-v2`,prompt:`Complete para expressar: “${g.meaning}”`,text:g.example.replace(answer,'＿＿＿'),answer,options,explanation:`${g.text} A frase completa é ${g.example} (${g.meaning}). Compare a intenção e o tempo indicados na tradução com a forma escolhida.`};
}

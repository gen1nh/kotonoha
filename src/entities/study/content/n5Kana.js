/** Kana beyond the 46 basic signs: voiced sounds, semi-voiced sounds and yōon.
 * For small っ/ッ and long vowels, see explicit pronunciation lessons in grammar. */
const voiced=`が ga
ぎ gi
ぐ gu
げ ge
ご go
ざ za
じ ji
ず zu
ぜ ze
ぞ zo
だ da
ぢ ji
づ zu
で de
ど do
ば ba
び bi
ぶ bu
べ be
ぼ bo
ぱ pa
ぴ pi
ぷ pu
ぺ pe
ぽ po`;
const yoon=`きゃ kya
きゅ kyu
きょ kyo
しゃ sha
しゅ shu
しょ sho
ちゃ cha
ちゅ chu
ちょ cho
にゃ nya
にゅ nyu
にょ nyo
ひゃ hya
ひゅ hyu
ひょ hyo
みゃ mya
みゅ myu
みょ myo
りゃ rya
りゅ ryu
りょ ryo
ぎゃ gya
ぎゅ gyu
ぎょ gyo
じゃ ja
じゅ ju
じょ jo
びゃ bya
びゅ byu
びょ byo
ぴゃ pya
ぴゅ pyu
ぴょ pyo`;
const rows=(txt)=>txt.trim().split('\n').map(row=>row.trim().split(/\s+/));
export const HIRAGANA_EXTENSIONS=Object.freeze([...rows(voiced),...rows(yoon)]);
export const KATAKANA_EXTENSIONS=Object.freeze(HIRAGANA_EXTENSIONS.map(([glyph,ro])=>[glyph.replace(/[ぁ-ゖ]/g,ch=>String.fromCharCode(ch.charCodeAt(0)+0x60)),ro]));
export const KANA_PRONUNCIATION_NOTES=Object.freeze([
 {title:'Dakuten e handakuten',example:'か → が / は → ば / は → ぱ',detail:'As marcas ゛ e ゜ mudam a família do som: か/が, は/ば/ぱ.'},
 {title:'Combinações yōon',example:'き + ゃ = きゃ / し + ゅ = しゅ',detail:'や・ゆ・よ pequenos combinam com a kana anterior para formar um único bloco sonoro.'},
 {title:'Pequeno っ / ッ',example:'きって / キット',detail:'っ e ッ representam uma pausa/consoante geminada; não são pronunciados como um tsu independente.'},
 {title:'Vogais longas',example:'おばさん / おばあさん / コーヒー',detail:'A duração da vogal muda o significado. Em katakana, o traço ー normalmente prolonga a vogal anterior.'},
]);

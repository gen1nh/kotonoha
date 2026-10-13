/** Original short reading tasks. Draft teaching content, not official JLPT test items. */
const RAW = `
Apresentação|わたしは田中です。日本語の先生です。|Qual é a profissão de Tanaka?|Professor(a) de japonês|Estudante|Médico(a)|Atendente|先生 significa professor(a), e 日本語 especifica japonês.
Rotina|母は毎朝六時に起きます。それから朝ご飯を作ります。|O que a mãe faz depois de acordar?|Prepara o café da manhã|Vai ao trabalho|Lê um jornal|Pega o trem|それから indica a ação seguinte: 朝ご飯を作ります.
Chuva|明日は雨です。出かけるとき、傘を持って行きます。|O que a pessoa levará?|Um guarda-chuva|Um casaco novo|Um livro|Uma bicicleta|雨 significa chuva e 傘 é guarda-chuva.
Biblioteca|図書館は午前九時から午後五時までです。|Quando a biblioteca fecha?|Às 17h|Às 9h|Às 15h|Às 19h|午後五時 indica cinco da tarde; まで marca o fim.
Encontro|今日は火曜日です。友達と木曜日に会います。|Em que dia acontecerá o encontro?|Quinta-feira|Terça-feira|Quarta-feira|Domingo|木曜日に会います indica encontro na quinta-feira.
Cafeteria|この店のコーヒーは三百円です。お茶は二百円です。|Qual bebida é mais barata?|O chá|O café|As duas custam o mesmo|Nenhuma está à venda|お茶 custa 200 ienes; コーヒー custa 300.
Localização|銀行は駅の前にあります。郵便局は銀行の隣です。|Onde fica a agência dos correios?|Ao lado do banco|Dentro da estação|Atrás do parque|No hospital|銀行の隣 indica ao lado do banco.
Escola|山田さんは学生です。毎日大学で日本語を勉強します。|Onde Yamada estuda japonês?|Na universidade|Em casa|No parque|Na biblioteca|大学で marca o local da atividade de estudar.
Compras|スーパーでりんごを三つ買いました。バナナは買いませんでした。|O que foi comprado?|Três maçãs|Três bananas|Uma maçã e uma banana|Quatro bananas|りんごを三つ買いました: comprou três maçãs.
Família|兄は二十五歳です。妹は十八歳です。|Quem é mais jovem?|A irmã mais nova|O irmão mais velho|Ambos têm a mesma idade|Não há informações|妹 tem 18 anos, enquanto 兄 tem 25.
Fim de semana|土曜日は仕事がありません。日曜日も休みです。|Em quais dias a pessoa descansa?|Sábado e domingo|Só sábado|Só domingo|Quarta e quinta|土曜日は仕事がありません e 日曜日も休みです.
Restaurante|わたしは魚が好きです。でも、今日は肉を食べます。|O que a pessoa comerá hoje?|Carne|Peixe|Legumes|Arroz|今日は肉を食べます indica comer carne hoje.
Bilhete|駅で切符を買って、電車に乗りました。|Qual transporte a pessoa pegou?|Trem|Táxi|Avião|Bicicleta|電車に乗りました indica embarcar no trem.
Quarto|わたしの部屋には机と椅子があります。テレビはありません。|O que NÃO existe no quarto?|Televisão|Mesa|Cadeira|Mesa e cadeira|テレビはありません é a frase negativa.
Clima|昨日は寒かったですが、今日は暖かいです。|Como está o tempo hoje?|Agradavelmente quente|Muito frio|Chuvoso|Nevando|今日は暖かいです informa a condição atual.
Convite|あした、友達と映画を見ませんか。午後三時に駅で会いましょう。|Onde será o encontro?|Na estação|Na biblioteca|No cinema|No restaurante|駅で会いましょう informa o ponto de encontro.
Viagem|来週、家族と京都に行きます。飛行機ではなく、電車で行きます。|Como a família viajará?|De trem|De avião|De ônibus|A pé|電車で行きます e 飛行機ではなく indicam trem, não avião.
Estudos|今日は宿題が多いです。だから、友達と遊びません。|Por que a pessoa não vai brincar/sair?|Tem muita lição de casa|Está doente|Vai viajar|Está chovendo|だから apresenta o motivo: 宿題が多いです.
Agenda|月曜日と水曜日は日本語の授業があります。金曜日は英語です。|Qual matéria acontece sexta-feira?|Inglês|Japonês|Matemática|História|金曜日は英語です.
Aviso|この部屋で食べてはいけません。水は飲んでもいいです。|O que é permitido na sala?|Beber água|Comer doces|Comer arroz|Fumar|水は飲んでもいいです indica permissão.
Preferência|父はお茶が好きです。母はコーヒーが好きです。|Quem gosta de café?|A mãe|O pai|Os dois|Ninguém|母はコーヒーが好きです.
Deslocamento|家から学校まで歩いて十五分です。|Quanto tempo leva para ir a pé à escola?|15 minutos|5 minutos|30 minutos|Uma hora|歩いて十五分 indica quinze minutos caminhando.
Consultório|田中さんは昨日病院に行きました。今日は元気です。|Como Tanaka está hoje?|Bem|No hospital|Dormindo|Na escola|今日は元気です indica que hoje está bem.
Pedido|すみません。りんごを二つとパンを一つください。|Quantos pães foram pedidos?|Um|Dois|Três|Quatro|パンを一つ significa um pão.
Mensagem|今、図書館にいます。あとで家に帰ります。|Onde a pessoa está agora?|Na biblioteca|Em casa|Na estação|No parque|今 indica agora; 図書館にいます informa onde está.
`;
export const N5_READING_TASKS=Object.freeze(RAW.trim().split('\n').map((line,i)=>{
 const [title,text,prompt,answer,...remaining]=line.trim().split('|');
 const [wrong1,wrong2,wrong3,explanation]=remaining;
 if(!explanation)throw new Error(`Incomplete reading item ${i+1}`);
 return Object.freeze({id:`n5-reading-${String(i+1).padStart(2,'0')}`,title,text,prompt,choices:[answer,wrong1,wrong2,wrong3],answerIndex:0,explanation});
}));

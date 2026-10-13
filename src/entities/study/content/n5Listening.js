/** Author-written spoken situations for formative Japanese listening.
 * Browser voices differ by device and are NOT a substitute for reviewed recordings
 * in an exam-calibrated listening assessment. These remain formative teaching items.
 */
const RAW = `
No restaurante|水を一つください。|O que a pessoa pede?|Água|Chá|Café|Leite|水 significa água.
Em uma reunião|会議は午後三時からです。|Quando começa a reunião?|15h|13h|17h|10h|午後三時 significa três da tarde.
Localização|すみません。駅はどこですか。|O que a pessoa está procurando?|A estação|O hospital|A escola|O banco|駅はどこですか pergunta onde fica a estação.
Previsão|明日は雨です。傘を持って行ってください。|O que é recomendado levar?|Guarda-chuva|Livro|Relógio|Mala|傘 é guarda-chuva.
Apresentação|はじめまして。私は佐藤です。学生です。|Qual é a ocupação da pessoa?|Estudante|Médico(a)|Motorista|Professor(a)|学生です quer dizer sou estudante.
Na loja|この本は五百円です。|Quanto custa o livro?|500 ienes|100 ienes|300 ienes|800 ienes|五百円 corresponde a 500 ienes.
Na estação|次の電車は九時十分です。|Em que horário sai o próximo trem?|9h10|9h30|10h09|8h10|九時十分 é nove horas e dez minutos.
Sobre a família|妹は高校生です。|Quem é estudante do ensino médio?|A irmã mais nova|O pai|O irmão mais velho|A mãe|妹 é irmã mais nova.
Rotina|毎朝七時に起きます。|A que horas a pessoa acorda?|7h|6h|8h|9h|七時に起きます: acorda às sete.
Convite|いっしょに映画を見ませんか。|Qual convite foi feito?|Assistir a um filme|Ir ao mercado|Ler um livro|Cozinhar|映画を見ませんか é um convite para assistir a um filme.
Clima|今日はとても寒いですね。|Como está o tempo?|Muito frio|Muito quente|Chuvoso|Com vento forte|寒い significa frio; とても intensifica.
Pergunta|お名前は何ですか。|O que é perguntado?|O nome|A idade|A profissão|A nacionalidade|お名前は何ですか pergunta o nome da pessoa.
Comida|私は魚が好きです。|Do que a pessoa gosta?|Peixe|Carne|Fruta|Arroz|魚が好きです expressa gostar de peixe.
Dias|明日は日曜日です。|Que dia será amanhã?|Domingo|Sábado|Segunda-feira|Sexta-feira|日曜日 significa domingo.
Viagem|来週、京都に行きます。|Para onde a pessoa vai?|Kyoto|Tóquio|Osaka|Nagoya|京都に行きます indica destino Kyoto.
Compras|りんごを三つ買いました。|Quantas maçãs foram compradas?|Três|Duas|Quatro|Cinco|三つ indica três unidades.
Casa|猫は椅子の下にいます。|Onde está o gato?|Embaixo da cadeira|Em cima da cadeira|Dentro da caixa|Atrás da porta|椅子の下 indica embaixo da cadeira.
Sala de aula|教科書を開いてください。|O que a pessoa pede?|Abrir o livro didático|Fechar o caderno|Apagar o quadro|Levantar-se|教科書を開いてください pede para abrir o livro didático.
Transporte|私はバスで学校に行きます。|Como a pessoa vai à escola?|De ônibus|De bicicleta|De trem|A pé|バスで indica meio de transporte ônibus.
No mercado|牛乳はどこですか。|Qual produto é procurado?|Leite|Açúcar|Sal|Pão|牛乳 significa leite.
Ligação|もしもし、田中さんはいますか。|Com quem a pessoa deseja falar?|Tanaka|Suzuki|Yamada|Sato|田中さんはいますか pergunta por Tanaka.
Após a escola|授業のあとで、図書館に行きます。|Para onde a pessoa vai depois da aula?|Biblioteca|Casa|Hospital|Restaurante|授業のあとで significa depois da aula; 図書館に行きます indica biblioteca.
Horário|今は七時半です。|Que horas são?|7h30|7h15|8h30|6h30|七時半 significa sete e meia.
Objetos|机の上に鍵があります。|O que está sobre a mesa?|Chaves|Celular|Jornal|Carteira|鍵 significa chave.
Esportes|日曜日に公園でサッカーをします。|Que atividade será realizada?|Jogar futebol|Nadar|Correr|Ler|サッカーをします significa jogar futebol.
Trabalho|父は銀行で働いています。|Onde o pai trabalha?|Banco|Hospital|Universidade|Aeroporto|銀行で働いています: trabalha no banco.
Idioma|日本語は少し分かります。|Quanto japonês a pessoa entende?|Um pouco|Nada|Tudo|Muito bem|少し分かります indica entender um pouco.
Tempo livre|今日は休みです。家で本を読みます。|O que a pessoa fará em casa?|Ler um livro|Cozinhar|Dormir|Ver televisão|本を読みます significa ler um livro.
No hospital|頭が痛いです。|Qual é o problema mencionado?|Dor de cabeça|Dor no pé|Febre|Dor de barriga|頭が痛いです indica dor de cabeça.
Visita|友達は明日来ます。|Quando o amigo virá?|Amanhã|Hoje|Ontem|Semana que vem|明日 significa amanhã.
Na cozinha|母は今、料理をしています。|O que a mãe está fazendo agora?|Cozinhando|Dormindo|Estudando|Comprando|料理をしています descreve cozinhar agora.
No ônibus|次のバス停で降ります。|Onde a pessoa vai descer?|No próximo ponto|Na última estação|No aeroporto|Na escola|次のバス停 indica o próximo ponto de ônibus.
Na escola|金曜日に宿題を出してください。|Em que dia é preciso entregar a lição?|Sexta-feira|Segunda-feira|Quarta-feira|Domingo|金曜日に indica na sexta-feira.
Despedida|じゃあ、また明日。|Quando as pessoas se verão novamente?|Amanhã|Hoje à noite|Na próxima semana|No mês que vem|また明日 significa até amanhã.
Preferência|コーヒーは飲みません。お茶をください。|O que a pessoa deseja beber?|Chá|Café|Água|Suco|お茶をください significa dê-me chá, por favor.
Descrição|このかばんは新しいです。|Como é a bolsa?|Nova|Velha|Pequena|Cara|新しい significa nova.
Passeio|駅からここまで歩いて10分かかります。|Quanto tempo leva a pé da estação até aqui?|Dez minutos|Cinco minutos|Quinze minutos|Vinte minutos|10分かかります indica que leva dez minutos.
Em uma foto|右の人は兄です。左の人は友達です。|Quem está à direita?|Irmão mais velho|Amigo|Pai|Professor|右の人は兄です indica irmão à direita.
Problema no quarto|この部屋は暑いです。窓を開けてもいいですか。|O que a pessoa pede permissão para fazer?|Abrir a janela|Fechar a porta|Ligar o computador|Entrar no quarto|窓を開けてもいいですか pergunta se pode abrir a janela.
Consulta|すみません。もう一度言ってください。|O que a pessoa solicita?|Que repitam a fala|Que esperem um pouco|Que escrevam o nome|Que telefonem depois|もう一度言ってください significa diga mais uma vez.
`;
export const N5_LISTENING_TASKS=Object.freeze(RAW.trim().split('\n').map((line,i)=>{
 const [context,spokenText,prompt,answer,wrong1,wrong2,wrong3,explanation]=line.trim().split('|');
 if(!explanation)throw new Error(`Incomplete listening item ${i+1}`);
 return Object.freeze({id:`n5-listening-${String(i+1).padStart(2,'0')}`,context,spokenText,prompt,choices:[answer,wrong1,wrong2,wrong3],answerIndex:0,explanation});
}));

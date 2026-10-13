import {N5_MORE_WORD_GROUPS} from "./n5WordsMore.js";
/** Curated Kotonoha N5 candidate vocabulary, thematic and expandable.
 * There is no official exhaustive JLPT N5 vocabulary list.
 * Text and translations are editorial drafts, not independently reviewed content.
 */
const GROUPS = [
 ...N5_MORE_WORD_GROUPS,
 ['pessoas','Pessoas e família',`
 私|わたし|eu
 私たち|わたしたち|nós
 あなた|あなた|você
 名前|なまえ|nome
 男|おとこ|homem
 女|おんな|mulher
 男の子|おとこのこ|menino
 女の子|おんなのこ|menina
 子供|こども|criança
 大人|おとな|adulto
 父|ちち|meu pai
 母|はは|minha mãe
 お父さん|おとうさん|pai (tratamento)
 お母さん|おかあさん|mãe (tratamento)
 兄|あに|meu irmão mais velho
 姉|あね|minha irmã mais velha
 弟|おとうと|irmão mais novo
 妹|いもうと|irmã mais nova
 家族|かぞく|família
 友達|ともだち|amigo(a)
 彼|かれ|ele
 彼女|かのじょ|ela
 皆さん|みなさん|todos (tratamento)
 医者|いしゃ|médico(a)
 会社員|かいしゃいん|funcionário de empresa
 店員|てんいん|atendente de loja
 `],
 ['expressoes','Cumprimentos e expressões',`
 おはよう|おはよう|bom dia (informal)
 おはようございます|おはようございます|bom dia (polido)
 こんばんは|こんばんは|boa noite (cumprimento)
 おやすみなさい|おやすみなさい|boa noite (ao dormir)
 さようなら|さようなら|adeus
 じゃあまた|じゃあまた|até mais (informal)
 また明日|またあした|até amanhã
 どうも|どうも|obrigado; muito (depende do contexto)
 ありがとうございます|ありがとうございます|muito obrigado(a)
 すみません|すみません|com licença; desculpe
 ごめんなさい|ごめんなさい|desculpe
 お願いします|おねがいします|por favor (ao solicitar)
 どうぞ|どうぞ|por favor; fique à vontade
 はい|はい|sim
 いいえ|いいえ|não
 そうです|そうです|é isso mesmo
 いいです|いいです|está bom; não é necessário (conforme contexto)
 はじめまして|はじめまして|prazer em conhecer
 よろしくお願いします|よろしくおねがいします|conto com você; prazer
 いただきます|いただきます|expressão antes de comer
 ごちそうさまでした|ごちそうさまでした|agradecimento após a refeição
 `],
 ['casa','Casa e objetos',`
 家|いえ|casa
 部屋|へや|quarto; cômodo
 玄関|げんかん|entrada de casa
 台所|だいどころ|cozinha
 トイレ|といれ|banheiro; toalete
 お風呂|おふろ|banho; banheira
 窓|まど|janela
 ドア|どあ|porta
 机|つくえ|mesa de estudo; escrivaninha
 椅子|いす|cadeira
 ベッド|べっど|cama
 電気|でんき|luz elétrica; eletricidade
 時計|とけい|relógio
 鍵|かぎ|chave
 傘|かさ|guarda-chuva
 鞄|かばん|bolsa; pasta
 財布|さいふ|carteira
 携帯電話|けいたいでんわ|telefone celular
 電話|でんわ|telefone
 写真|しゃしん|fotografia
 紙|かみ|papel
 ペン|ぺん|caneta
 鉛筆|えんぴつ|lápis
 消しゴム|けしごむ|borracha escolar
 新聞|しんぶん|jornal
 `],
 ['lugares','Lugares e cidade',`
 駅|えき|estação
 電車|でんしゃ|trem
 バス停|ばすてい|ponto de ônibus
 空港|くうこう|aeroporto
 図書館|としょかん|biblioteca
 病院|びょういん|hospital
 銀行|ぎんこう|banco
 郵便局|ゆうびんきょく|agência dos correios
 公園|こうえん|parque
 スーパー|すーぱー|supermercado
 店|みせ|loja
 本屋|ほんや|livraria
 レストラン|れすとらん|restaurante
 喫茶店|きっさてん|cafeteria
 ホテル|ほてる|hotel
 会社|かいしゃ|empresa
 大学|だいがく|universidade
 教室|きょうしつ|sala de aula
 町|まち|cidade; bairro
 国|くに|país
 外国|がいこく|país estrangeiro
 日本語|にほんご|língua japonesa
 英語|えいご|língua inglesa
 `],
 ['alimentos','Alimentos e compras',`
 ご飯|ごはん|arroz cozido; refeição
 朝ご飯|あさごはん|café da manhã
 昼ご飯|ひるごはん|almoço
 晩ご飯|ばんごはん|jantar
 パン|ぱん|pão
 卵|たまご|ovo
 肉|にく|carne
 魚|さかな|peixe
 野菜|やさい|legumes; verduras
 果物|くだもの|fruta
 りんご|りんご|maçã
 みかん|みかん|tangerina
 バナナ|ばなな|banana
 お茶|おちゃ|chá verde; chá
 紅茶|こうちゃ|chá preto
 牛乳|ぎゅうにゅう|leite
 コーヒー|こーひー|café
 ジュース|じゅーす|suco
 お菓子|おかし|doce; guloseima
 砂糖|さとう|açúcar
 塩|しお|sal
 お金|おかね|dinheiro
 円|えん|iene
 値段|ねだん|preço
 買い物|かいもの|compras
 `],
 ['tempo','Tempo e calendário',`
 昨日|きのう|ontem
 一昨日|おととい|anteontem
 明後日|あさって|depois de amanhã
 今|いま|agora
 朝|あさ|manhã (período)
 昼|ひる|meio-dia; período diurno
 夜|よる|noite
 夕方|ゆうがた|fim da tarde
 午前|ごぜん|antes do meio-dia; AM
 午後|ごご|depois do meio-dia; PM
 今日|きょう|hoje
 毎日|まいにち|todos os dias
 毎朝|まいあさ|todas as manhãs
 毎晩|まいばん|todas as noites
 週|しゅう|semana
 今週|こんしゅう|esta semana
 来週|らいしゅう|semana que vem
 先週|せんしゅう|semana passada
 月曜日|げつようび|segunda-feira
 火曜日|かようび|terça-feira
 水曜日|すいようび|quarta-feira
 木曜日|もくようび|quinta-feira
 金曜日|きんようび|sexta-feira
 土曜日|どようび|sábado
 日曜日|にちようび|domingo
 時間|じかん|tempo; duração
 分|ふん|minuto
 半|はん|meia unidade; meia hora
 `],
 ['numeros','Números e contadores',`
 一|いち|um
 二|に|dois
 三|さん|três
 四|よん|quatro (leitura comum)
 五|ご|cinco
 六|ろく|seis
 七|なな|sete (leitura comum)
 八|はち|oito
 九|きゅう|nove (leitura comum)
 十|じゅう|dez
 百|ひゃく|cem
 千|せん|mil
 万|まん|dez mil
 一つ|ひとつ|uma unidade (genérico)
 二つ|ふたつ|duas unidades (genérico)
 三つ|みっつ|três unidades (genérico)
 四つ|よっつ|quatro unidades (genérico)
 五つ|いつつ|cinco unidades (genérico)
 人|にん|contador de pessoas (leitura contextual)
 枚|まい|contador de objetos planos
 本|ほん|contador de objetos longos (leitura contextual)
 個|こ|contador de itens pequenos
 歳|さい|anos de idade (contador)
 いくら|いくら|quanto custa
 `],
 ['transportes','Transportes e movimento',`
 車|くるま|carro
 自転車|じてんしゃ|bicicleta
 自動車|じどうしゃ|automóvel
 飛行機|ひこうき|avião
 タクシー|たくしー|táxi
 地下鉄|ちかてつ|metrô
 切符|きっぷ|bilhete; passagem
 道|みち|caminho; rua
 交差点|こうさてん|cruzamento
 信号|しんごう|semáforo
 右|みぎ|direita
 左|ひだり|esquerda
 前|まえ|frente; antes
 後ろ|うしろ|atrás
 近く|ちかく|perto
 遠く|とおく|longe
 入り口|いりぐち|entrada
 出口|でぐち|saída
 歩く|あるく|andar a pé
 乗る|のる|embarcar; pegar transporte
 降りる|おりる|descer de transporte
 着く|つく|chegar
 `],
 ['descricao','Adjetivos e descrições',`
 新しい|あたらしい|novo(a)
 古い|ふるい|antigo(a); velho(a) (objeto)
 高い|たかい|alto(a); caro(a)
 安い|やすい|barato(a)
 低い|ひくい|baixo(a)
 長い|ながい|comprido(a)
 短い|みじかい|curto(a)
 速い|はやい|rápido(a)
 遅い|おそい|lento(a); atrasado(a)
 多い|おおい|numeroso(a); muito(a)
 少ない|すくない|pouco(a) (quantidade)
 暑い|あつい|quente (clima)
 寒い|さむい|frio (clima)
 熱い|あつい|quente (ao toque)
 冷たい|つめたい|frio (ao toque)
 暖かい|あたたかい|morno(a); agradável (temperatura)
 難しい|むずかしい|difícil
 易しい|やさしい|fácil
 面白い|おもしろい|interessante; divertido
 楽しい|たのしい|divertido; prazeroso
 忙しい|いそがしい|ocupado(a)
 眠い|ねむい|com sono
 おいしい|おいしい|gostoso(a)
 甘い|あまい|doce
 辛い|からい|apimentado(a)
 きれい|きれい|bonito(a); limpo(a)
 静か|しずか|silencioso(a)
 にぎやか|にぎやか|animado(a); movimentado(a)
 便利|べんり|prático(a); conveniente
 元気|げんき|bem; saudável; disposto(a)
 有名|ゆうめい|famoso(a)
 大切|たいせつ|importante; precioso(a)
 好き|すき|gostar de (adjetivo な)
 嫌い|きらい|não gostar de (adjetivo な)
 `],
 ['verbos','Verbos do cotidiano',`
 する|する|fazer
 勉強する|べんきょうする|estudar
 仕事する|しごとする|trabalhar
 起きる|おきる|acordar; levantar-se
 寝る|ねる|dormir
 洗う|あらう|lavar
 浴びる|あびる|tomar (banho de chuveiro)
 着る|きる|vestir (parte de cima)
 脱ぐ|ぬぐ|tirar roupa; calçados
 履く|はく|calçar; vestir (parte de baixo)
 読む|よむ|ler
 書く|かく|escrever
 聞く|きく|ouvir; perguntar
 話す|はなす|falar
 言う|いう|dizer
 買う|かう|comprar
 売る|うる|vender
 待つ|まつ|esperar
 会う|あう|encontrar alguém
 帰る|かえる|voltar para casa
 入る|はいる|entrar
 出る|でる|sair
 開ける|あける|abrir (algo)
 閉める|しめる|fechar (algo)
 開く|あく|abrir-se
 閉まる|しまる|fechar-se
 使う|つかう|usar
 作る|つくる|fazer; fabricar
 料理する|りょうりする|cozinhar
 泳ぐ|およぐ|nadar
 走る|はしる|correr
 遊ぶ|あそぶ|brincar; divertir-se
 休む|やすむ|descansar; faltar
 働く|はたらく|trabalhar
 教える|おしえる|ensinar; informar
 習う|ならう|aprender com alguém
 借りる|かりる|pegar emprestado
 貸す|かす|emprestar
 あげる|あげる|dar (a outra pessoa)
 もらう|もらう|receber
 取る|とる|pegar; tirar
 持つ|もつ|segurar; possuir
 置く|おく|colocar
 立つ|たつ|ficar de pé
 座る|すわる|sentar
 分かる|わかる|entender
 知る|しる|saber; conhecer
 思う|おもう|pensar; achar
 できる|できる|conseguir; ser possível
 ある|ある|existir (inanimado)
 いる|いる|existir (ser animado)
 `],
 ['natureza','Clima e natureza',`
 天気|てんき|tempo meteorológico
 晴れ|はれ|tempo ensolarado
 雨|あめ|chuva
 雪|ゆき|neve
 風|かぜ|vento
 空|そら|céu
 海|うみ|mar
 川|かわ|rio
 山|やま|montanha
 木|き|árvore
 花|はな|flor
 春|はる|primavera
 夏|なつ|verão
 秋|あき|outono
 冬|ふゆ|inverno
 犬|いぬ|cachorro
 鳥|とり|pássaro
 動物|どうぶつ|animal
 `],
 ['estudo','Escola e aprendizado',`
 宿題|しゅくだい|lição de casa
 テスト|てすと|teste
 試験|しけん|exame
 質問|しつもん|pergunta
 答え|こたえ|resposta
 意味|いみ|significado
 言葉|ことば|palavra; idioma
 漢字|かんじ|kanji
 平仮名|ひらがな|hiragana
 片仮名|かたかな|katakana
 教科書|きょうかしょ|livro didático
 辞書|じしょ|dicionário
 ノート|のーと|caderno
 授業|じゅぎょう|aula
 練習|れんしゅう|prática; exercício
 先生|せんせい|professor(a)
 生徒|せいと|aluno(a) (escolar)
 `],
 ['posicao','Posição e direção',`
 上|うえ|em cima
 下|した|embaixo
 中|なか|dentro; meio
 外|そと|fora
 横|よこ|ao lado; lateral
 隣|となり|ao lado (adjacente)
 そば|そば|perto; ao lado
 ここ|ここ|aqui
 そこ|そこ|aí
 あそこ|あそこ|ali
 どこ|どこ|onde
 こちら|こちら|por aqui; esta direção (polido)
 そちら|そちら|por aí; essa direção (polido)
 あちら|あちら|por ali; aquela direção (polido)
 どちら|どちら|qual direção; qual (polido)
 `],
 ['perguntas','Perguntas e conectores',`
 何|なに|o que
 誰|だれ|quem
 いつ|いつ|quando
 どう|どう|como
 どうして|どうして|por que
 どれ|どれ|qual (entre objetos)
 どの|どの|qual (antes do substantivo)
 これ|これ|isto
 それ|それ|isso
 あれ|あれ|aquilo
 この|この|este (antes do substantivo)
 その|その|esse (antes do substantivo)
 あの|あの|aquele (antes do substantivo)
 そして|そして|e então; além disso
 でも|でも|mas; porém
 だから|だから|por isso
 もう|もう|já
 まだ|まだ|ainda
 とても|とても|muito
 少し|すこし|um pouco
 たくさん|たくさん|muitos; bastante
 `],
 ['corpo','Corpo e saúde cotidiana',`
 体|からだ|corpo
 頭|あたま|cabeça
 顔|かお|rosto
 目|め|olho
 耳|みみ|orelha; ouvido
 口|くち|boca
 鼻|はな|nariz
 手|て|mão
 足|あし|pé; perna
 お腹|おなか|barriga
 痛い|いたい|dolorido(a)
 病気|びょうき|doença
 薬|くすり|remédio
 風邪|かぜ|resfriado
 元気です|げんきです|estou bem (saudação)
 `],
];

// Small, explicit mora -> romaji transliterator. Romanization is scaffolding, not an
// alternate pronunciation standard. Students should switch to kana as soon as possible.
const MAP = Object.fromEntries(Object.entries({
 あ:'a',い:'i',う:'u',え:'e',お:'o',か:'ka',き:'ki',く:'ku',け:'ke',こ:'ko',
 さ:'sa',し:'shi',す:'su',せ:'se',そ:'so',た:'ta',ち:'chi',つ:'tsu',て:'te',と:'to',
 な:'na',に:'ni',ぬ:'nu',ね:'ne',の:'no',は:'ha',ひ:'hi',ふ:'fu',へ:'he',ほ:'ho',
 ま:'ma',み:'mi',む:'mu',め:'me',も:'mo',や:'ya',ゆ:'yu',よ:'yo',
 ら:'ra',り:'ri',る:'ru',れ:'re',ろ:'ro',わ:'wa',を:'o',ん:'n',
 が:'ga',ぎ:'gi',ぐ:'gu',げ:'ge',ご:'go',ざ:'za',じ:'ji',ず:'zu',ぜ:'ze',ぞ:'zo',
 だ:'da',ぢ:'ji',づ:'zu',で:'de',ど:'do',ば:'ba',び:'bi',ぶ:'bu',べ:'be',ぼ:'bo',
 ぱ:'pa',ぴ:'pi',ぷ:'pu',ぺ:'pe',ぽ:'po',ぁ:'a',ぃ:'i',ぅ:'u',ぇ:'e',ぉ:'o',
 ゔ:'vu',ー:'-',
 }));
const PAIRS={ふぁ:'fa',ふぃ:'fi',ふぇ:'fe',ふぉ:'fo',てぃ:'ti',でぃ:'di',うぃ:'wi',うぇ:'we',うぉ:'wo',しぇ:'she',じぇ:'je',ちぇ:'che',つぁ:'tsa',つぃ:'tsi',つぇ:'tse',つぉ:'tso',きゃ:'kya',きゅ:'kyu',きょ:'kyo',しゃ:'sha',しゅ:'shu',しょ:'sho',
 ちゃ:'cha',ちゅ:'chu',ちょ:'cho',にゃ:'nya',にゅ:'nyu',にょ:'nyo',
 ひゃ:'hya',ひゅ:'hyu',ひょ:'hyo',みゃ:'mya',みゅ:'myu',みょ:'myo',
 りゃ:'rya',りゅ:'ryu',りょ:'ryo',ぎゃ:'gya',ぎゅ:'gyu',ぎょ:'gyo',
 じゃ:'ja',じゅ:'ju',じょ:'jo',びゃ:'bya',びゅ:'byu',びょ:'byo',
 ぴゃ:'pya',ぴゅ:'pyu',ぴょ:'pyo'};
export function kanaToRomaji(kana) {
 let text='';
 const hiragana=String(kana).replace(/[ァ-ヶ]/g,ch=>String.fromCharCode(ch.charCodeAt(0)-0x60));
 for(let i=0;i<hiragana.length;i++){
  const ch=hiragana[i];
  if(ch==='ー'){const match=text.match(/[aeiou](?!.*[aeiou])/);if(match)text+=match[0];continue;}
  if(ch==='っ') { const next=PAIRS[hiragana.slice(i+1,i+3)]||MAP[hiragana[i+1]]||''; text += next.startsWith('ch')?'t':next.slice(0,1);continue; }
  const pair=PAIRS[hiragana.slice(i,i+2)];if(pair){text+=pair;i++;continue;}
  text+=MAP[ch]??ch;
 }
 // Conventions for greetings are handled in existing seed data, not romanization.
 return text;
}
const parsed = GROUPS.map(([id,title,source])=>({id,title,words:source.trim().split('\n').map(line=>line.trim()).filter(Boolean).map(line=>{
 const [written,kana,meaning] = line.split('|');
 if(!written||!kana||!meaning) throw new Error(`Malformed N5 word in ${id}: ${line}`);
 return [written,kana,kanaToRomaji(kana),meaning];
})}));
export const N5_VOCAB_GROUPS = Object.freeze(parsed);
export const N5_EXTRA_VOCAB = Object.freeze(parsed.flatMap(g=>g.words));

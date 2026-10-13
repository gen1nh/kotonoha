/** Context-first introductory kanji, original editorial candidate set. One example
 * reading per graph does not cover all readings and compounds for that graph. */
const RAW=`
一|いち|um|一つ|ひとつ
二|に|dois|二つ|ふたつ
三|さん|três|三つ|みっつ
四|よん|quatro|四つ|よっつ
五|ご|cinco|五つ|いつつ
六|ろく|seis|六時|ろくじ
七|なな|sete|七時|しちじ
八|はち|oito|八時|はちじ
九|きゅう|nove|九時|くじ
十|じゅう|dez|十分|じゅっぷん
百|ひゃく|cem|百円|ひゃくえん
千|せん|mil|千円|せんえん
万|まん|dez mil|一万円|いちまんえん
日|ひ|dia; sol|日曜日|にちようび
月|つき|lua; mês|月曜日|げつようび
火|ひ|fogo|火曜日|かようび
水|みず|água|水曜日|すいようび
木|き|árvore; madeira|木曜日|もくようび
金|かね|ouro; dinheiro|金曜日|きんようび
土|つち|terra|土曜日|どようび
曜|よう|elemento dos dias da semana|日曜日|にちようび
年|とし|ano|来年|らいねん
時|とき|hora; momento|七時|しちじ
分|ふん|minuto; parte|十分|じゅっぷん
半|はん|metade|七時半|しちじはん
今|いま|agora|今日|きょう
先|さき|antes; à frente|先生|せんせい
来|く|vir|来週|らいしゅう
毎|まい|cada; todo|毎日|まいにち
週|しゅう|semana|今週|こんしゅう
午|ご|meio-dia|午後|ごご
前|まえ|frente; antes|午前|ごぜん
後|あと|depois; atrás|午後|ごご
人|ひと|pessoa|日本人|にほんじん
男|おとこ|homem|男の子|おとこのこ
女|おんな|mulher|女の子|おんなのこ
子|こ|criança|子供|こども
父|ちち|pai|お父さん|おとうさん
母|はは|mãe|お母さん|おかあさん
友|とも|amigo|友達|ともだち
名|な|nome|名前|なまえ
生|せい|vida; estudante|学生|がくせい
学|がく|estudar; aprender|学校|がっこう
校|こう|escola|学校|がっこう
何|なに|o que|何時|なんじ
本|ほん|livro; origem|本屋|ほんや
語|ご|idioma; língua|日本語|にほんご
字|じ|letra; caractere|漢字|かんじ
大|おお|grande|大きい|おおきい
小|ちい|pequeno|小さい|ちいさい
高|たか|alto; caro|高い|たかい
安|やす|barato; tranquilo|安い|やすい
新|あたら|novo|新しい|あたらしい
古|ふる|velho; antigo|古い|ふるい
長|なが|longo|長い|ながい
多|おお|muito; muitos|多い|おおい
少|すく|pouco|少ない|すくない
上|うえ|em cima|上|うえ
下|した|embaixo|下|した
中|なか|dentro|中|なか
外|そと|fora|外|そと
左|ひだり|esquerda|左|ひだり
右|みぎ|direita|右|みぎ
東|ひがし|leste|東京|とうきょう
西|にし|oeste|西|にし
南|みなみ|sul|南|みなみ
北|きた|norte|北|きた
入|はい|entrar|入り口|いりぐち
出|で|sair|出口|でぐち
行|い|ir|行く|いく
帰|かえ|voltar|帰る|かえる
見|み|ver|見る|みる
聞|き|ouvir|聞く|きく
読|よ|ler|読む|よむ
書|か|escrever|書く|かく
食|た|comer|食べる|たべる
飲|の|beber|飲む|のむ
買|か|comprar|買う|かう
会|あ|encontrar|会う|あう
話|はな|falar|話す|はなす
車|くるま|carro|電車|でんしゃ
電|でん|eletricidade|電話|でんわ
駅|えき|estação|駅|えき
町|まち|cidade; bairro|町|まち
店|みせ|loja|店|みせ
家|いえ|casa|家|いえ
国|くに|país|外国|がいこく
円|えん|iene; círculo|百円|ひゃくえん
山|やま|montanha|山|やま
川|かわ|rio|川|かわ
海|うみ|mar|海|うみ
雨|あめ|chuva|雨|あめ
天|てん|céu|天気|てんき
気|き|espírito; energia|元気|げんき
白|しろ|branco|白い|しろい
黒|くろ|preto|黒い|くろい
赤|あか|vermelho|赤い|あかい
青|あお|azul|青い|あおい
手|て|mão|手|て
足|あし|pé; perna|足|あし
目|め|olho|目|め
耳|みみ|orelha|耳|みみ
口|くち|boca|口|くち
花|はな|flor|花|はな
空|そら|céu|空|そら
`; 
export const N5_KANJI=Object.freeze(RAW.trim().split('\n').map(line=>{
 const [glyph,reading,meaning,example,exampleReading]=line.trim().split('|');
 if(!exampleReading)throw new Error('Malformed kanji item: '+line);
 return Object.freeze({glyph,reading,meaning,example,exampleReading});
}));

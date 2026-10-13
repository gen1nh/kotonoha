// Questões autorais introdutórias; não são itens oficiais nem avaliação calibrada.
const make = (id, skill, prompt, sentence, choices, answer, explanation) => ({id,skill,prompt,sentence,choices,answer,explanation});
export const N5_QUESTIONS = [
make('n5-basic-01','Vocabulário','Qual é o significado de 水?','水を飲みます。',['Água','Fogo','Comida','Livro'],0,'水 (みず) significa água.'),
make('n5-basic-02','Partículas','Qual partícula marca o objeto direto?','パン（　）食べます。',['は','を','に','で'],1,'を marca o objeto direto de 食べます.'),
make('n5-basic-03','Leitura','Qual é a tradução mais adequada?','私は学生です。',['Eu sou estudante.','Eu sou professor.','Você é estudante.','Eu fui estudante.'],0,'私は indica o tópico eu, e 学生です significa ser estudante.'),
make('n5-basic-04','Vocabulário','O que significa 今日?','今日は月曜日です。',['Ontem','Amanhã','Hoje','Semana'],2,'今日 (きょう) significa hoje.'),
make('n5-basic-05','Gramática','Qual forma é uma pergunta educada?','これは本です（　）。',['を','か','に','で'],1,'A partícula か no final torna a frase uma pergunta.'),
make('n5-basic-06','Partículas','Qual partícula indica o local onde a ação acontece?','図書館（　）勉強します。',['で','を','は','が'],0,'で indica o lugar onde ocorre a ação de estudar.'),
make('n5-basic-07','Vocabulário','O que significa 大きい?','大きい犬です。',['Pequeno','Grande','Rápido','Velho'],1,'大きい (おおきい) significa grande.'),
make('n5-basic-08','Gramática','Qual é o passado educado de 食べます?','昨日、すしを（　）。',['食べません','食べました','食べます','食べましょう'],1,'食べました é a forma passada educada de 食べる.'),
make('n5-basic-09','Leitura','Quando a pessoa vai à escola?','毎朝、学校へ行きます。',['Toda manhã','Toda noite','Aos domingos','Ontem'],0,'毎朝 (まいあさ) significa toda manhã.'),
make('n5-basic-10','Partículas','Qual partícula indica destino nesta frase?','日本（　）行きます。',['を','で','へ','が'],2,'へ indica a direção ou destino do deslocamento.'),
make('n5-basic-11','Vocabulário','O que significa 友だち?','友だちと話します。',['Professor','Família','Amigo','Criança'],2,'友だち (ともだち) significa amigo.'),
make('n5-basic-12','Gramática','Qual é a forma negativa educada de 飲みます?','コーヒーを（　）。',['飲みません','飲みました','飲みたい','飲みましょう'],0,'飲みません é a forma negativa educada de 飲む.'),
];

import React from 'react';
import { diagnosticQuestions } from '../../../entities/study/index.js';
import { Card, Button } from '../../../shared/ui/index.jsx';
export default function PaperPractice({ level }) {
 const questions = diagnosticQuestions(level).slice(0, 5);
 return <Card className="paper-practice space-y-3" aria-labelledby="paper-title"><h3 id="paper-title" className="font-bold text-lg">Prática no papel · {level}</h3>
 <p className="text-sm text-muted">Copie as frases à mão, marque partículas e explique o sentido com suas palavras. Depois compare com as explicações da lição.</p>
 <ol className="list-decimal pl-5 space-y-2">{questions.map(q => <li key={q.id}><span lang="ja">{q.sentence || q.prompt}</span><p className="text-xs text-muted">Escreva a leitura, tradução e uma frase semelhante.</p></li>)}</ol>
 <Button variant="secondary" onClick={() => window.print()}>Imprimir exercícios</Button>
 </Card>;
}

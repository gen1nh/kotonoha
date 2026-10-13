const fs = require('node:fs');
const path = require('node:path');
const out = path.join(__dirname, 'kit');
fs.mkdirSync(out, {recursive:true});
const green='#2c7458', ink='#252b27';
const shape='M40 220V128C40 73 77 36 132 36H216V116C216 169 181 204 128 204H72L40 220Z';
const holes='M84 80V108H176V80H84ZM84 132V160H148V132H84Z';
const reverseHoles='M82 78V110H178V78H82ZM82 130V162H150V130H82Z';
const mark=(color,reverse=false)=>`<path fill="${color}" fill-rule="evenodd" d="${shape}${reverse?reverseHoles:holes}"/>`;
const glyphs={
 K:'M0 0H12V34L46 0H62L23 39L64 80H47L12 45V80H0Z',
 o:'M28 18C46 18 56 30 56 50C56 70 46 82 28 82C10 82 0 70 0 50C0 30 10 18 28 18ZM28 29C17 29 12 37 12 50C12 63 17 71 28 71C39 71 44 63 44 50C44 37 39 29 28 29Z',
 t:'M10 4H22V20H39V31H22V60C22 68 25 71 32 71H39V82H31C17 82 10 75 10 60V31H0V20H10Z',
 n:'M0 20H12V27C17 21 24 18 32 18C48 18 56 28 56 46V80H44V47C44 35 39 29 30 29C19 29 12 37 12 48V80H0Z',
 h:'M0 0H12V27C17 21 24 18 32 18C48 18 56 28 56 46V80H44V47C44 35 39 29 30 29C19 29 12 37 12 48V80H0Z',
 a:'M28 18C35 18 41 21 45 26V20H57V80H45V74C41 79 35 82 28 82C10 82 0 70 0 50C0 30 10 18 28 18ZM28 29C17 29 12 37 12 50C12 63 17 71 28 71C39 71 45 63 45 50C45 37 39 29 28 29Z'
};
const letters=[['K',0],['o',75],['t',145],['o',198],['n',269],['o',340],['h',411],['a',482]];
const word=color=>`<g fill="${color}" fill-rule="evenodd">${letters.map(([c,x])=>`<path transform="translate(${x} 0)" d="${glyphs[c]}"/>`).join('')}</g>`;
function svg(name,box,body){const [,,w,h]=box.split(' ');fs.writeFileSync(path.join(out,name),`<svg xmlns="http://www.w3.org/2000/svg" viewBox="${box}" width="${w}" height="${h}" role="img" aria-labelledby="title"><title id="title">Kotonoha — folha de conversa</title>${body}</svg>`);}
for(const [suffix,color,text] of [['color',green,ink],['black','#000000','#000000'],['white','#ffffff','#ffffff']]){
 const m=mark(color,suffix==='white');
 svg(`symbol-${suffix}.svg`,'0 0 256 256',m);
 svg(`horizontal-${suffix}.svg`,'0 0 960 256',m+`<g transform="translate(296 78) scale(1.14)">${word(text)}</g>`);
 svg(`wordmark-${suffix}.svg`,'0 0 571 114',`<g transform="translate(16 16)">${word(text)}</g>`);
 svg(`stacked-${suffix}.svg`,'0 0 640 440',`<g transform="translate(160 0) scale(1.25)">${m}</g><g transform="translate(50 332)">${word(text)}</g>`);
}
svg('symbol-small.svg','0 0 256 256',`<path fill="${green}" fill-rule="evenodd" d="M32 224V128C32 68 72 32 132 32H224V116C224 176 184 208 128 208H64L32 224ZM80 80V112H176V80H80ZM80 136V168H144V136H80Z"/>`);
svg('app-icon.svg','0 0 256 256',`<rect width="256" height="256" fill="${green}"/><g transform="translate(26 26) scale(.8)">${mark('#ffffff',true)}</g>`);
const spec={brand:'Kotonoha',tagline:'Seu japonês, um dia de cada vez.',brief:'Um espaço pessoal, calmo e acolhedor para aprender japonês.',adjectives:['calmo','claro','acolhedor'],industry:'consumer-app',nav:['Aprender','Revisar','No papel'],brand_color:green,greyscale:false,final:true,concepts:[{name:'Folha de conversa',symbol:'symbol-color.svg',lockup:'horizontal-color.svg',stacked:'stacked-color.svg',symbol_on_tile:'symbol-white.svg',lockup_on_dark:'horizontal-white.svg',idea:'Uma folha com palavras: aprender é cultivar sua própria voz.',rationale:['Silhueta compacta para celular e computador.','Verde do projeto preservado.','Letras desenhadas em vetor, sem dependência de fontes.']}],recommendation:'Direção A escolhida. Marca preparada para o app, ícones e materiais de estudo.',next_steps:['Usar os arquivos vetoriais como originais.','Consultar o guia de uso incluído.']};
fs.writeFileSync(path.join(out,'presentation.json'),JSON.stringify(spec,null,2));


const fs=require('node:fs');
const folder=__dirname;
const symbols={
 a:'<path fill-rule="evenodd" d="M40 224V132C40 77 77 40 132 40H216V120C216 173 181 208 128 208H72L40 224ZM88 88V112H176V88H88ZM88 136V160H144V136H88Z"/>',
 b:'<path d="M48 48H80V208H48Z M104 120V104C104 68 132 40 168 40H208V56C208 92 180 120 144 120H104Z M104 144H144C180 144 208 172 208 208V224H168C132 224 104 196 104 160V144Z"/>',
 c:'<path d="M48 152H80V208H48Z M104 104H136V208H104Z M160 48H192V208H160Z"/>',
};
const word='<g fill="none" stroke="currentColor" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"><path d="M0 0V76M44 0L2 39L48 76"/><ellipse cx="86" cy="50" rx="23" ry="27"/><path d="M135 5V57Q135 77 153 77M122 24H153"/><ellipse cx="193" cy="50" rx="23" ry="27"/><path d="M244 76V24M244 44C244 15 286 15 286 44V76"/><ellipse cx="329" cy="50" rx="23" ry="27"/><path d="M380 0V76M380 44C380 15 422 15 422 44V76"/><ellipse cx="465" cy="50" rx="23" ry="27"/><path d="M488 24V76"/></g>';
function write(version,marks){for(const [key,body] of Object.entries(marks)){
 const svg=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" role="img"><title>Kotonoha — conceito ${key.toUpperCase()}</title><g fill="#171d19">${body}</g></svg>`;
 fs.writeFileSync(`${folder}/${key}-${version}.svg`,svg);
 fs.writeFileSync(`${folder}/${key}-lockup-${version}.svg`,`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 960 256" role="img"><title>Kotonoha — assinatura ${key.toUpperCase()}</title><g fill="#171d19">${body}</g><g transform="translate(306 77) scale(1.18)" color="#171d19">${word}</g></svg>`);
}}
write('v1',symbols);
// Refinement: wider speech aperture, softer K stem, rhythm with a shared curved finish.
symbols.a='<path fill-rule="evenodd" d="M40 224V132C40 77 77 40 132 40H216V120C216 173 181 208 128 208H72L40 224ZM84 84V112H176V84H84ZM84 136V164H148V136H84Z"/>';
symbols.b='<path d="M48 40H80V216H48Z M104 120V104C104 68 132 40 168 40H208V56C208 92 180 120 144 120H104Z M104 144H144C180 144 208 172 208 208V216H168C132 216 104 188 104 152V144Z"/>';
symbols.c='<path d="M40 144H72V184H112V216H72C54 216 40 202 40 184V144Z M96 96H128V160H96V96Z M152 40H184C202 40 216 54 216 72V112H184V72H152V40Z"/>';
write('v2',symbols);

# Publicar Kotonoha na Vercel

1. Extraia o ZIP e envie o conteúdo da pasta `kotonoha-main` para a raiz do repositório GitHub.
2. Na Vercel, importe o repositório (ou faça redeploy após enviar os arquivos).
3. Framework: Vite; Build Command: `npm run build`; Output Directory: `dist`; Install Command: `npm ci`.
4. Publique e teste a navegação por URL, PWA, áudio e desenho no Safari do iOS.

## Tutor de IA

O modo de produção usa uma chave pessoal Groq configurada em Preferências (guardada na sessão do navegador). Sem chave, o tutor não funciona; as lições offline continuam disponíveis. Não configure `VITE_GROQ_API_KEY` ou segredos como variáveis `VITE_`: elas seriam expostas no bundle público.

## Limitações de validação

Os 27 testes unitários passaram neste ambiente. O build e o Playwright não foram executados com sucesso porque a instalação das dependências não pôde ser concluída aqui. A Vercel precisa confirmar o build antes de considerar a publicação validada.

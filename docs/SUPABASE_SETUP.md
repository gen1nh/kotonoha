# Conta e sincronização — ativação

Implementação opcional; o aplicativo continua funcionando localmente sem configuração.
A URL e chave pública fornecidas foram salvas em `.env.local` (ignorado pelo Git).
Não colocar chave secret/service_role ou senha do banco em variáveis VITE_.

## 1. Criar a tabela e as regras

No projeto `mrcqakxoraxukiwbreyy`, abrir SQL Editor → New query.
Copiar e executar `supabase/migrations/001_personal_sync.sql`.
O script cria uma tabela privada, leitura restrita à conta por RLS e uma função
de gravação com conferência atômica de versão. Não apaga progresso existente.

## 2. Ativar Google

Seguir https://supabase.com/docs/guides/auth/social-login/auth-google.
No Google Cloud, configurar a tela de consentimento e criar um cliente OAuth Web.
Se estiver em modo de teste, adicionar seu próprio e-mail como usuário de teste.
URI de redirecionamento autorizada no Google:

`https://mrcqakxoraxukiwbreyy.supabase.co/auth/v1/callback`

No Supabase → Authentication → Sign In / Providers → Google, ativar o provedor
e preencher Client ID e Client Secret. O segredo fica somente nesse painel.

## 3. URLs do aplicativo

No Supabase → Authentication → URL Configuration:
- Site URL durante desenvolvimento: `http://127.0.0.1:5173`
- Redirect URLs: `http://127.0.0.1:5173/?view=settings`
- Para testes do build: `http://127.0.0.1:4173/?view=settings`
- Se abrir por localhost, cadastrar também a URL equivalente com localhost.

Ao publicar, definir Site URL como endereço HTTPS definitivo e adicionar
`https://SEU-ENDERECO/?view=settings` nos retornos autorizados.
Configurar VITE_SUPABASE_URL e VITE_SUPABASE_PUBLISHABLE_KEY na hospedagem e reconstruir.
O endereço 127.0.0.1 no iPhone aponta para o próprio iPhone, não para o computador.

## 4. Primeiro uso

Exportar um backup em Preferências. Entrar com Google no computador e escolher
“Usar este aparelho” para enviar o progresso existente. No iPhone, entrar na
mesma conta e escolher “Usar a nuvem”. O login é opcional.

## Comportamento desta primeira versão

- O snapshot de estudo inclui cartões, lições, notas e estatísticas, mantendo IDs e formato de backup.
- Tema visual permanece por dispositivo. Chaves Groq, tokens de login, arquivos de mídia e conteúdo estático não entram no snapshot.
- Alterações locais são verificadas/enviadas a cada 30 segundos com app aberto e visível, ao reconectar e ao retornar ao app. Não há sincronização em segundo plano com app fechado.
- Receber uma versão diferente exige escolha explícita em Preferências. Esta versão não mescla notas, revisões e exclusões automaticamente: conflitos interrompem o envio e oferecem os dois backups.
- Antes de substituir uma versão, as duas cópias são preservadas no navegador e podem ser exportadas na mesma tela. Falta de espaço impede a substituição.
- Revisão esperada é conferida atomicamente no banco; dois aparelhos não sobrescrevem silenciosamente a mesma versão.
- Alteração em outra aba pausa a sincronização nesta aba e pede recarga; estudar em várias abas simultâneas não é suportado.
- Sair não apaga estudo local. Nova entrada exige vincular novamente. Não usar em aparelho compartilhado.
- Reinício local fica desativado enquanto há conta conectada. Importar backup continua sendo uma alteração local que pode ser sincronizada.

## Validação externa pendente

A chave pública não permite executar migrações, ativar provedores ou testar uma
conta sem login do titular. Validar no Supabase após ativação: duas contas não
leem nem gravam os dados uma da outra; acesso anônimo não lê a tabela; gravação
com revisão antiga retorna lista vazia. Testar login real, duas sessões, modo
offline, reconexão e Safari no iPhone. Testes locais com API simulada não provam RLS implantada.

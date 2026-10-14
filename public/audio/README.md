# Kotonoha — efeitos de interface

Três efeitos originais, sintetizados pelo script `scripts/generate-ui-sounds.py`.
Nenhuma amostra de terceiros, gravação do Duolingo ou serviço externo é usada.
Formato PCM WAV mono, 22.050 Hz. Reprodução com Howler.js (MIT).

- correct.wav: resposta correta.
- incorrect.wav: tentativa que precisa de revisão.
- complete.wav: sessão/atividade concluída.

Todos entram no precache da PWA. Ativação e volume são por dispositivo,
independentes da voz japonesa; efeitos são omitidos enquanto o navegador fala.

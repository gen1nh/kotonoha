"""Original Kotonoha interface tones. Standard library, deterministic, no samples."""
from pathlib import Path
import math
import struct
import wave

root = Path(__file__).resolve().parent.parent / 'public' / 'audio'
root.mkdir(exist_ok=True)
rate = 22050
sounds = {
    'correct': [(0, 659.25, .18), (.09, 880, .28)],
    'incorrect': [(0, 293.66, .22), (.10, 261.63, .24)],
    'complete': [(0, 523.25, .24), (.12, 659.25, .25), (.24, 783.99, .36), (.36, 1046.5, .44)],
}
for name, notes in sounds.items():
    samples = []
    for i in range(int((max(start + duration for start, _, duration in notes) + .04) * rate)):
        t = i / rate
        value = 0
        for start, frequency, duration in notes:
            age = t - start
            if 0 <= age < duration:
                envelope = min(1, age / .008) * (1 - age / duration) ** 2
                value += .24 * envelope * (math.sin(2 * math.pi * frequency * age) + .12 * math.sin(4 * math.pi * frequency * age))
        samples.append(struct.pack('<h', round(max(-1, min(1, value)) * 32767)))
    with wave.open(str(root / f'{name}.wav'), 'wb') as output:
        output.setparams((1, 2, rate, 0, 'NONE', 'not compressed'))
        output.writeframes(b''.join(samples))
print('Three original UI sounds generated.')

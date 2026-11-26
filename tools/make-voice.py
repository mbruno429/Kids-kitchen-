#!/usr/bin/env python3
"""Records the chef's voice lines as small MP3 files in assets/voice/.

The game plays these recordings instead of the phone's built-in (robotic) voice.
They are made with Kokoro, an open (Apache-2.0) neural text-to-speech model, using a warm,
upbeat voice, slowed down a little and brightened so it suits small children.

Run this again whenever you change what the chef says (js/lines.js, the `say` lines in
js/recipes.js, the ingredient names in js/art.js or the friends' names in js/store.js):

    # Python 3.12 or older (the pronunciation library does not build on 3.13 yet)
    pip install kokoro-onnx "misaki[en]" numpy soundfile     # plus ffmpeg and node on your PATH
    python -m spacy download en_core_web_sm
    # download kokoro-v1.0.onnx and voices-v1.0.bin from
    # https://github.com/thewh1teagle/kokoro-onnx/releases/tag/model-files-v1.0
    python3 tools/make-voice.py --model kokoro-v1.0.onnx --voices voices-v1.0.bin

Only new lines are recorded; add --force to redo them all, --prune to delete unused clips.
"""
import argparse, hashlib, json, os, re, subprocess, sys, tempfile

import numpy as np
import soundfile as sf
from kokoro_onnx import Kokoro
from misaki import en

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, 'assets', 'voice')

ap = argparse.ArgumentParser()
ap.add_argument('--model', default='kokoro-v1.0.onnx')
ap.add_argument('--voices', default='voices-v1.0.bin')
ap.add_argument('--voice', default='af_heart:0.6,af_bella:0.4', help='voice, or a blend like name:weight,name:weight')
ap.add_argument('--speed', type=float, default=0.86, help='speaking speed before brightening (1 = normal)')
ap.add_argument('--bright', type=float, default=1.04, help='pitch lift; 1 = none')
ap.add_argument('--force', action='store_true')
ap.add_argument('--prune', action='store_true')
args = ap.parse_args()

lines = json.loads(subprocess.check_output(['node', os.path.join(ROOT, 'tools', 'voice-lines.js')]))
os.makedirs(OUT, exist_ok=True)
tts = Kokoro(args.model, args.voices)
g2p = en.G2P(trf=False, british=False, fallback=None)  # the pronunciation alphabet the voice was trained on

parts = [p.split(':') for p in args.voice.split(',')]
if len(parts) == 1 and len(parts[0]) == 1:
    style = parts[0][0]
else:
    total = sum(float(w) for _, w in parts)
    style = sum(tts.get_voice_style(n) * (float(w) / total) for n, w in parts)


def tidy(x, sr):
    """Trim silence, even out the loudness, soften the edges."""
    x = np.asarray(x, dtype=np.float32)
    loud = np.where(np.abs(x) > 0.01)[0]
    if len(loud):
        x = x[max(0, loud[0] - int(sr * 0.02)): loud[-1] + int(sr * 0.06)]
    rms = float(np.sqrt(np.mean(x ** 2))) or 1e-6
    x = x * (0.11 / rms)
    peak = float(np.abs(x).max()) or 1e-6
    if peak > 0.97:
        x = x * (0.97 / peak)
    f = int(sr * 0.012)
    x[:f] *= np.linspace(0, 1, f)
    x[-f:] *= np.linspace(1, 0, f)
    return np.concatenate([x, np.zeros(int(sr * 0.03), dtype=np.float32)])


LEAD = 'Okay...'

# How to say food words the pronunciation library gets wrong or does not know.
# (Sounds: A = "ay", O = "oh", I = "eye", ɑ = "ah", i = "ee", u = "oo", ˈ marks the loud part.)
SAY = {
    'jalapeño': 'hˌɑləpˈAnjO',   # hah-luh-PAY-nyoh
    'étouffée': 'ˌAtufˈA',        # ay-too-FAY
    'lumpia': 'lˈumpiɑ',          # LOOM-pee-ah
    'sopas': 'sˈOpɑs',            # SOH-pahs
    'sinigang': 'sˌiniɡˈɑŋ',      # see-nee-GAHNG
    'pancit': 'pɑnsˈɪt',          # pahn-SIT
    'flan': 'flˈɑn',              # flahn
    'mein': 'mˈAn',               # chow MAYN
    'broccoli': 'bɹˈɑkəli',       # BROK-uh-lee
    'donuts': 'dˈOnʌts',          # DOH-nuts
    'donut': 'dˈOnʌt',            # DOH-nut
    'brrr': 'bɹˈɜɹ',              # brrr (it is cold)
}
SAY_RE = re.compile(r'(?<!\w)(' + '|'.join(sorted(SAY, key=len, reverse=True)) + r')(?!\w)', re.IGNORECASE)


def marked(text):
    return SAY_RE.sub(lambda m: f'[{m.group(1)}](/{SAY[m.group(1).lower()]}/)', text)



def speak(text):
    """Very short lines start with a little "uh" if the voice begins cold, so every line is
    recorded as "Okay... <line>" and the "Okay..." is cut off at the pause that follows it."""
    x, sr = tts.create(g2p(LEAD + ' ' + marked(text))[0], voice=style, speed=args.speed, is_phonemes=True, trim=False)
    x = np.asarray(x, dtype=np.float32)
    fr = int(sr * 0.01)
    quiet = np.array([np.sqrt(np.mean(x[i:i + fr] ** 2)) for i in range(0, len(x) - fr, fr)]) < 0.006
    i = int(np.argmax(~quiet)) + 12  # skip the silence before the lead-in and its first 120 ms
    while i < len(quiet):
        if not quiet[i]:
            i += 1
            continue
        j = i
        while j < len(quiet) and quiet[j]:
            j += 1
        rest = x[max(0, (j - 2) * fr):]
        if j - i >= 10 and np.abs(rest).max() > 0.05:
            return rest, sr
        i = j
    print('  (no clean pause after the lead-in, recorded without it)', text)
    x, sr = tts.create(g2p(marked(text))[0], voice=style, speed=args.speed, is_phonemes=True)
    return np.asarray(x, dtype=np.float32), sr


unknown = [t for t in lines if '❓' in g2p(marked(t))[0]]
if unknown:
    sys.exit('The pronunciation library does not know a word in these lines; add it to SAY:\n  ' + '\n  '.join(unknown))

index, made, secs = {}, 0, 0.0
for text in lines:
    name = hashlib.sha1(text.encode('utf-8')).hexdigest()[:10] + '.mp3'
    index[text] = name
    path = os.path.join(OUT, name)
    if os.path.exists(path) and not args.force:
        continue
    audio, sr = speak(text)
    audio = tidy(audio, sr)
    secs += len(audio) / sr / args.bright
    with tempfile.NamedTemporaryFile(suffix='.wav', delete=False) as tmp:
        sf.write(tmp.name, audio, sr)
    try:
        subprocess.check_call(['ffmpeg', '-v', 'error', '-y', '-i', tmp.name,
                               '-af', f'asetrate={int(sr * args.bright)},aresample=24000',
                               '-ac', '1', '-c:a', 'libmp3lame', '-b:a', '56k', path])
    finally:
        os.unlink(tmp.name)
    made += 1
    print(f'{name}  {text}')

if args.prune:
    for f in os.listdir(OUT):
        if f.endswith('.mp3') and f not in index.values():
            os.remove(os.path.join(OUT, f))
            print('removed', f)

with open(os.path.join(OUT, 'index.js'), 'w', encoding='utf-8') as fh:
    fh.write('/* Made by tools/make-voice.py — which recording goes with which line. */\n')
    fh.write('window.VOICE = ' + json.dumps(index, ensure_ascii=False, indent=1, sort_keys=True) + ';\n')
    # a stamp that changes whenever any recording changes: phones then save the recordings again (see sw.js)
    stamp = hashlib.sha1()
    for name in sorted(set(index.values())):
        with open(os.path.join(OUT, name), 'rb') as clip:
            stamp.update(name.encode() + hashlib.sha1(clip.read()).digest())
    fh.write('window.VOICE_V = ' + json.dumps(stamp.hexdigest()[:10]) + ';\n')
print(f'{made} recorded ({secs:.0f}s of speech), {len(index)} lines in total')

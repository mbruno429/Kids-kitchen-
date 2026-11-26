/* Kids Kitchen — sound.
   - Sound effects and the background music are made on the spot with WebAudio (no files to download).
   - The chef's voice is a set of small recordings (assets/voice, see tools/make-voice.py).
     If a recording is missing or cannot load, the phone's own voice reads the line instead. */
window.SFX = (function () {
  'use strict';
  const VOICE = window.VOICE || {};
  let ctx = null, sfxOut = null, voiceOut = null, musicOut = null;
  let muted = false;
  const on = { voice: true, sfx: true, music: true }; // the grown-ups' switches
  let musicWanted = false, voiceDuck = false, duckUntil = 0;
  try { muted = localStorage.getItem('kk-mute') === '1'; } catch (e) { /* private mode */ }
  // iPhone: keep playing when the ring/silent switch is on silent (the game has its own mute button)
  try { if (navigator.audioSession) navigator.audioSession.type = 'playback'; } catch (e) { /* older iOS */ }

  function make() {
    if (ctx) return ctx;
    const C = window.AudioContext || window.webkitAudioContext;
    if (!C) return null;
    ctx = new C();
    const comp = ctx.createDynamicsCompressor(); // stops loud moments from crackling
    comp.threshold.value = -14; comp.ratio.value = 6; comp.attack.value = 0.004; comp.release.value = 0.2;
    comp.connect(ctx.destination);
    sfxOut = ctx.createGain(); sfxOut.connect(comp);
    voiceOut = ctx.createGain(); voiceOut.connect(comp);
    musicOut = ctx.createGain(); musicOut.gain.value = 0; musicOut.connect(comp);
    levels();
    return ctx;
  }
  // the music plays quietly, and even more quietly while the chef is talking
  const musicLevel = () => (muted || !on.music || !musicWanted ? 0 : voiceDuck || ctx.currentTime < duckUntil ? 0.28 : 0.7);
  function setMusic() { if (ctx) { try { musicOut.gain.setTargetAtTime(musicLevel(), ctx.currentTime, 0.2); } catch (e) { /* closed */ } } }
  function levels() {
    if (!ctx) return;
    sfxOut.gain.value = muted || !on.sfx ? 0 : 0.6;
    voiceOut.gain.value = muted || !on.voice ? 0 : 1.15;
    setMusic();
  }
  function duck(seconds) {
    if (!ctx) return;
    duckUntil = Math.max(duckUntil, ctx.currentTime + seconds);
    setMusic();
    setTimeout(setMusic, seconds * 1000 + 60);
  }
  function ac() {
    const c = make();
    if (c && c.state !== 'running') { try { c.resume(); } catch (e) { /* needs a tap first */ } }
    return c;
  }

  /* ---------- building blocks ---------- */
  // a note: {f, f1 (slide to), d seconds, type, v volume, t delay (or at = exact time), a attack, out}
  function tone(o) {
    const c = o.out ? ctx : ac(); if (!c) return;
    const t = o.at != null ? o.at : c.currentTime + (o.t || 0), d = o.d || 0.15, osc = c.createOscillator(), g = c.createGain();
    osc.type = o.type || 'sine';
    osc.frequency.setValueAtTime(o.f, t);
    if (o.f1 && o.f1 !== o.f) osc.frequency.exponentialRampToValueAtTime(o.f1, t + d);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(o.v || 0.4, t + (o.a || 0.012));
    g.gain.exponentialRampToValueAtTime(0.0001, t + d);
    osc.connect(g).connect(o.out || sfxOut); osc.start(t); osc.stop(t + d + 0.03);
  }
  let whiteBuf = null, crackleBuf = null;
  function white(c) {
    if (!whiteBuf) {
      whiteBuf = c.createBuffer(1, c.sampleRate * 2, c.sampleRate);
      const d = whiteBuf.getChannelData(0);
      for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    }
    return whiteBuf;
  }
  // frying-pan crackle: hiss plus lots of tiny random pops
  function crackle(c) {
    if (!crackleBuf) {
      crackleBuf = c.createBuffer(1, c.sampleRate * 3, c.sampleRate);
      const d = crackleBuf.getChannelData(0), k = Math.pow(0.5, 1 / (c.sampleRate * 0.004));
      let env = 0;
      for (let i = 0; i < d.length; i++) {
        if (Math.random() < 30 / c.sampleRate) env = 0.5 + Math.random() * 0.5;
        env *= k;
        d[i] = (Math.random() * 2 - 1) * (0.1 + env);
      }
    }
    return crackleBuf;
  }
  // a burst of hiss: {d, f, f1, q, v, t, type (bandpass|highpass|lowpass), a}
  function noise(o) {
    const c = ac(); if (!c) return;
    const t = c.currentTime + (o.t || 0), d = o.d || 0.1, s = c.createBufferSource(), b = c.createBiquadFilter(), g = c.createGain();
    s.buffer = white(c); s.loop = true;
    b.type = o.type || 'bandpass'; b.Q.value = o.q || 1;
    b.frequency.setValueAtTime(o.f, t);
    if (o.f1) b.frequency.exponentialRampToValueAtTime(o.f1, t + d);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(o.v || 0.4, t + (o.a || 0.008));
    g.gain.exponentialRampToValueAtTime(0.0001, t + d);
    s.connect(b).connect(g).connect(sfxOut); s.start(t, Math.random() * 1.5); s.stop(t + d + 0.03);
  }
  const bell = (f, v, t, d) => { tone({ f, d: d || 1.1, v: v || 0.4, t }); tone({ f: f * 2.76, d: (d || 1.1) * 0.6, v: (v || 0.4) * 0.35, t }); tone({ f: f * 5.4, d: (d || 1.1) * 0.3, v: (v || 0.4) * 0.15, t }); };
  const tune = (arr, step, type, v, len, t0) => arr.forEach((f, i) => f && tone({ f, d: len || 0.2, type: type || 'triangle', v: v || 0.35, t: (t0 || 0) + i * step }));
  const R = (a, b) => a + Math.random() * (b - a);
  function applause(t0, len) {
    for (let i = 0; i < 70; i++) {
      const t = t0 + Math.pow(Math.random(), 0.8) * len;
      noise({ f: R(900, 2400), q: 1.4, d: R(0.025, 0.05), v: R(0.12, 0.3) * (1 - (t - t0) / len * 0.6), t });
    }
  }

  /* ---------- the sounds ---------- */
  const sounds = {
    // picking things up and putting them down
    pick() { tone({ f: 500, f1: 820, d: 0.09, v: 0.3 }); },
    nope() { tone({ f: 300, f1: 150, d: 0.18, type: 'triangle', v: 0.35 }); tone({ f: 200, f1: 120, d: 0.14, type: 'triangle', v: 0.25, t: 0.12 }); },
    plop() { tone({ f: 560, f1: 170, d: 0.17, v: 0.55 }); },
    thud() { tone({ f: 190, f1: 75, d: 0.16, v: 0.7 }); noise({ type: 'lowpass', f: 380, d: 0.09, v: 0.5 }); },
    splat() { tone({ f: 320, f1: 110, d: 0.16, v: 0.55 }); noise({ type: 'lowpass', f: 1000, d: 0.12, v: 0.45, t: 0.02 }); },
    crack() { noise({ f: 3600, q: 2.5, d: 0.035, v: 0.85 }); noise({ f: 2400, q: 2, d: 0.03, v: 0.5, t: 0.045 }); tone({ f: 520, f1: 200, d: 0.14, v: 0.5, t: 0.11 }); },
    pour() {
      noise({ f: 700, f1: 1500, q: 1.2, d: 0.55, v: 0.22, a: 0.06 });
      for (let i = 0; i < 6; i++) { const f = R(320, 680); tone({ f, f1: f * 1.6, d: 0.07, v: 0.3, t: 0.03 + i * 0.085 }); }
    },
    poof() { noise({ type: 'lowpass', f: 900, f1: 300, d: 0.34, v: 0.55, a: 0.04 }); tone({ f: 130, f1: 80, d: 0.14, v: 0.35 }); },
    shake() { [0, 0.09, 0.18, 0.27].forEach((t, i) => noise({ type: 'highpass', f: 4200, d: 0.05, v: i % 2 ? 0.3 : 0.42, t })); },
    squirt() { noise({ f: 1900, f1: 520, q: 5, d: 0.24, v: 0.55 }); tone({ f: 720, f1: 300, d: 0.2, v: 0.14 }); },
    // tools
    stir() { noise({ f: 700, f1: 1500, d: 0.18, v: 0.2, a: 0.03 }); if (Math.random() < 0.45) tone({ f: R(2100, 2600), d: 0.09, v: 0.1, t: 0.05 }); },
    roll() { noise({ type: 'lowpass', f: 320, d: 0.26, v: 0.5, a: 0.05 }); tone({ f: 95, f1: 80, d: 0.2, v: 0.25 }); },
    chop() { noise({ type: 'highpass', f: 2600, d: 0.025, v: 0.6 }); tone({ f: 175, f1: 80, d: 0.11, type: 'triangle', v: 0.65 }); noise({ f: 1300, q: 1.5, d: 0.06, v: 0.35, t: 0.01 }); },
    // cooking
    ignite() { noise({ type: 'lowpass', f: 160, f1: 1500, d: 0.4, v: 0.55, a: 0.05 }); tone({ f: 75, f1: 50, d: 0.32, v: 0.5 }); tone({ f: 1400, d: 0.03, type: 'square', v: 0.12 }); },
    flip() {
      noise({ f: 420, f1: 2800, d: 0.24, v: 0.4, a: 0.03 }); tone({ f: 300, f1: 780, d: 0.2, v: 0.25, t: 0.03 });
      tone({ f: 260, f1: 120, d: 0.12, v: 0.5, t: 0.5 }); noise({ type: 'highpass', f: 2600, d: 0.5, v: 0.4, t: 0.5 });
    },
    door() { tone({ f: 135, f1: 70, d: 0.14, v: 0.7 }); noise({ f: 900, q: 2, d: 0.035, v: 0.4 }); },
    whoosh() { noise({ f: 380, f1: 1900, d: 0.32, v: 0.32, a: 0.05 }); },
    ding() { bell(1318, 0.45, 0, 1.4); bell(1318, 0.3, 0.16, 1.2); },
    tick() { noise({ f: 2600, q: 6, d: 0.02, v: 0.5 }); },
    tock() { noise({ f: 1700, q: 6, d: 0.022, v: 0.45 }); },
    // washing hands
    scrub() { [0, 0.11, 0.22].forEach((t, i) => noise({ f: 2300, f1: 3500, q: 3, d: 0.08, v: i === 1 ? 0.22 : 0.3, t })); tone({ f: 880, f1: 1250, d: 0.08, v: 0.07, t: 0.05 }); },
    water() {
      noise({ f: 1500, f1: 1000, q: 0.8, d: 1.0, v: 0.28, a: 0.08 });
      for (let i = 0; i < 9; i++) { const f = R(420, 900); tone({ f, f1: f * 1.5, d: 0.06, v: 0.2, t: 0.05 + i * 0.1 }); }
    },
    pop() { tone({ f: 420, f1: 980, d: 0.06, v: 0.3 }); },
    // too hot!
    uhoh() { tone({ f: 440, f1: 330, d: 0.2, type: 'triangle', v: 0.4 }); tone({ f: 330, f1: 235, d: 0.26, type: 'triangle', v: 0.4, t: 0.24 }); },
    smoke() { noise({ type: 'lowpass', f: 700, f1: 240, d: 0.5, v: 0.35, a: 0.08 }); },
    // eating
    munch() { noise({ type: 'lowpass', f: 1150, d: 0.1, v: 0.75 }); tone({ f: 210, f1: 130, d: 0.09, v: 0.4 }); noise({ type: 'lowpass', f: 950, d: 0.1, v: 0.6, t: 0.17 }); tone({ f: 190, f1: 120, d: 0.08, v: 0.3, t: 0.17 }); },
    crunch() {
      [0, 0.045, 0.1, 0.24, 0.3].forEach((t, i) => noise({ type: 'highpass', f: R(1500, 2600), d: R(0.03, 0.06), v: i < 3 ? R(0.55, 0.8) : R(0.3, 0.45), t }));
      tone({ f: 170, f1: 95, d: 0.08, v: 0.35 });
    },
    slurp() { noise({ f: 480, f1: 2900, q: 7, d: 0.42, v: 0.6, a: 0.05 }); tone({ f: 280, f1: 950, d: 0.4, v: 0.1, a: 0.05 }); },
    gulp() { tone({ f: 250, f1: 125, d: 0.09, v: 0.5 }); tone({ f: 150, f1: 320, d: 0.11, v: 0.45, t: 0.1 }); },
    // celebrating
    yay() { [523, 659, 784, 1047].forEach((f, i) => bell(f, 0.22, i * 0.085, 0.5)); },
    tada() { tune([392, 523, 659, 784], 0.1, 'triangle', 0.33, 0.24); bell(1568, 0.2, 0.42, 0.9); },
    star() { bell(1760, 0.25, 0, 0.6); bell(2349, 0.18, 0.07, 0.6); },
    heart() { tone({ f: 660, f1: 990, d: 0.12, v: 0.25 }); bell(1320, 0.14, 0.09, 0.45); },
    sticker() { noise({ type: 'lowpass', f: 1400, d: 0.05, v: 0.5 }); bell(1568, 0.22, 0.05, 0.5); bell(2093, 0.18, 0.14, 0.6); },
    fanfare() { tune([523, 659, 784, 1047, 1319], 0.09, 'triangle', 0.3, 0.22); bell(2093, 0.2, 0.5, 1.0); },
    win() {
      tune([523, 523, 659, 784, 0, 659, 784, 1047], 0.13, 'triangle', 0.36, 0.26);
      tune([262, 0, 330, 0, 392, 0, 523], 0.15, 'sine', 0.24, 0.32);
      bell(2093, 0.22, 0.95, 1.2);
      applause(0.5, 2.4);
    },
  };

  /* ---------- sounds that keep going while something cooks ---------- */
  let loopStops = [];
  function loop(kind) {
    stopLoop();
    const c = ac(); if (!c) return;
    const hold = (src, filterType, freq, vol, q) => {
      const f = c.createBiquadFilter(), g = c.createGain();
      f.type = filterType; f.frequency.value = freq; if (q) f.Q.value = q;
      g.gain.setValueAtTime(0.0001, c.currentTime);
      g.gain.exponentialRampToValueAtTime(vol, c.currentTime + 0.35);
      src.connect(f).connect(g).connect(sfxOut); src.start();
      loopStops.push(() => { try { g.gain.setTargetAtTime(0, c.currentTime, 0.07); src.stop(c.currentTime + 0.4); } catch (e) { /* already stopped */ } });
    };
    const every = (ms, fn) => { const id = setInterval(fn, ms); loopStops.push(() => clearInterval(id)); };
    const buf = (b) => { const s = c.createBufferSource(); s.buffer = b; s.loop = true; return s; };
    if (kind === 'sizzle') {
      hold(buf(crackle(c)), 'highpass', 2200, 0.34);
      hold(buf(white(c)), 'bandpass', 5200, 0.05, 0.7);
    } else if (kind === 'boil') {
      hold(buf(white(c)), 'lowpass', 420, 0.4);
      every(95, () => { if (Math.random() < 0.8) { const f = R(170, 430); tone({ f, f1: f * R(1.5, 2.1), d: R(0.05, 0.09), v: R(0.14, 0.3) }); } });
    } else if (kind === 'oven') {
      const hum = c.createOscillator(); hum.type = 'sine'; hum.frequency.value = 72;
      hold(hum, 'lowpass', 300, 0.3);
      hold(buf(white(c)), 'lowpass', 240, 0.25);
      let n = 0;
      every(430, () => sounds[n++ % 2 ? 'tock' : 'tick']());
    }
  }
  function stopLoop() { loopStops.forEach(f => f()); loopStops = []; }

  /* ---------- background music: a gentle, slow tune that loops ---------- */
  const hz = (m) => 440 * Math.pow(2, (m - 69) / 12); // note number -> pitch
  const CHORD = { C: [48, 60, 64, 67], Am: [45, 57, 60, 64], F: [53, 57, 60, 65], G: [55, 59, 62, 67] }; // bass note + three notes
  const BARS = ['C', 'Am', 'F', 'G', 'C', 'Am', 'F', 'G'];
  // eight bars of eight steps each; 0 = rest
  const TUNE_A = [76, 0, 79, 0, 76, 0, 72, 0, 69, 0, 72, 0, 76, 0, 72, 0, 69, 0, 72, 0, 77, 0, 72, 0, 74, 0, 71, 0, 67, 0, 0, 0,
    76, 0, 79, 0, 84, 0, 79, 0, 81, 0, 79, 0, 76, 0, 72, 0, 77, 0, 76, 0, 74, 0, 72, 0, 74, 0, 0, 0, 67, 71, 74, 0];
  const TUNE_B = [72, 0, 0, 76, 79, 0, 76, 0, 72, 0, 0, 76, 81, 0, 76, 0, 72, 0, 0, 77, 81, 0, 77, 0, 74, 0, 0, 79, 83, 0, 79, 0,
    84, 0, 79, 0, 76, 0, 79, 0, 81, 0, 76, 0, 72, 0, 76, 0, 77, 0, 72, 0, 69, 0, 72, 0, 74, 0, 71, 0, 67, 0, 0, 0];
  const STEP = 0.3, STEPS = 24 * 8; // 100 beats a minute; tune A, tune B, then a quiet part
  let mStep = 0, mNext = 0, mTimer = 0;
  const note = (m, t, d, v, type) => tone({ f: hz(m), at: t, d, v, type: type || 'sine', out: musicOut, a: 0.01 });
  function musicStep(step, t) {
    const bar = Math.floor(step / 8), k = step % 8, part = Math.floor(bar / 8), ch = CHORD[BARS[bar % 8]];
    if (k === 0) note(ch[0], t, 0.55, 0.2, 'triangle');
    if (k === 4) note(ch[0] + 7, t, 0.4, 0.13, 'triangle');
    if (k === 2 || k === 6) ch.slice(1).forEach((m, i) => note(m, t + i * 0.02, 0.3, 0.07, 'triangle'));
    const tuneNow = part === 0 ? TUNE_A : part === 1 ? TUNE_B : null;
    const m = tuneNow && tuneNow[(bar % 8) * 8 + k];
    if (m) { note(m, t, 0.45, 0.17); note(m + 12, t, 0.12, 0.035); }
    else if (!tuneNow && k === 0 && bar % 2 === 0) note(ch[2] + 12, t, 1.0, 0.08);
  }
  function musicTick() {
    if (!ctx || ctx.state !== 'running' || muted || !on.music || !musicWanted) return;
    if (mNext < ctx.currentTime) mNext = ctx.currentTime + 0.08; // (re)start cleanly after a pause
    while (mNext < ctx.currentTime + 0.6) { musicStep(mStep, mNext); mStep = (mStep + 1) % STEPS; mNext += STEP; }
  }
  function music(want) {
    musicWanted = !!want;
    if (musicWanted && !mTimer) mTimer = setInterval(musicTick, 150);
    setMusic();
  }
  // going to another app or locking the phone: everything pauses, and carries on when the child comes back
  document.addEventListener('visibilitychange', () => {
    if (!ctx) return;
    try { if (document.hidden) { ctx.suspend(); stopVoice(); } else ctx.resume(); } catch (e) { /* not allowed right now */ }
  });

  /* ---------- the chef's voice ---------- */
  const clips = new Map(); // line -> Promise<AudioBuffer | null>
  function load(text) {
    if (!VOICE[text]) return Promise.resolve(null);
    if (!clips.has(text)) {
      const c = make();
      if (!c || !window.fetch) return Promise.resolve(null);
      clips.set(text, fetch('assets/voice/' + VOICE[text])
        .then(r => (r.ok ? r.arrayBuffer() : Promise.reject(new Error('missing'))))
        .then(ab => new Promise((res, rej) => c.decodeAudioData(ab, res, rej)))
        .catch(() => { clips.delete(text); return null; }));
    }
    return clips.get(text);
  }
  // get lines ready before they are needed; forget the ones we no longer need
  function preload(texts, keep) {
    if (keep) { const want = new Set(texts.concat(keep)); [...clips.keys()].forEach(k => { if (!want.has(k)) clips.delete(k); }); }
    texts.forEach(t => { load(t); });
  }

  let sayId = 0, cur = null, speaking = false;
  function stopVoice() {
    if (cur) { try { cur.stop(); } catch (e) { /* not started */ } cur = null; }
    try { if ('speechSynthesis' in window && (speechSynthesis.speaking || speechSynthesis.pending)) speechSynthesis.cancel(); } catch (e) { /* no speech */ }
  }
  function playClip(buf) {
    return new Promise((done) => {
      const c = ac(), s = c.createBufferSource();
      s.buffer = buf; s.connect(voiceOut);
      cur = s;
      const end = () => { if (cur === s) cur = null; done(); };
      s.onended = end;
      setTimeout(end, buf.duration * 1000 + 500); // in case the sound never starts
      s.start();
    });
  }
  // fallback: the phone's own voice, choosing the most natural one it has
  let sysVoice = null;
  function pickVoice() {
    try {
      const score = (v) => (/premium|enhanced|natural|neural|siri/i.test(v.name) ? 8 : 0) + (/ava|samantha|allison|zoe|joelle|jenny|aria|google us/i.test(v.name) ? 4 : 0)
        + (/en[-_]US/i.test(v.lang) ? 2 : 0) + (/compact|eloquence|novelty/i.test(v.name + v.voiceURI) ? -6 : 0);
      sysVoice = speechSynthesis.getVoices().filter(v => /^en/i.test(v.lang)).sort((a, b) => score(b) - score(a))[0] || null;
    } catch (e) { sysVoice = null; }
  }
  if ('speechSynthesis' in window) {
    pickVoice();
    try { speechSynthesis.addEventListener('voiceschanged', pickVoice); } catch (e) { /* old Safari */ }
  }
  function speakSystem(text) {
    return new Promise((done) => {
      if (!('speechSynthesis' in window)) { done(); return; }
      try {
        const u = new SpeechSynthesisUtterance(text);
        u.lang = 'en-US'; u.rate = 0.9; u.pitch = 1.15;
        if (sysVoice) u.voice = sysVoice;
        u.onend = done; u.onerror = done;
        setTimeout(done, text.length * 95 + 1500);
        speechSynthesis.speak(u);
      } catch (e) { done(); }
    });
  }
  // say one line, or several one after another. Resolves when the chef has finished (or was interrupted).
  function say(lines) {
    const list = [].concat(lines).filter(Boolean), id = ++sayId;
    stopVoice();
    if (muted || !on.voice || !list.length) { speaking = false; voiceDuck = false; setMusic(); return Promise.resolve(); }
    list.forEach(t => { load(t); });
    speaking = true; voiceDuck = true; setMusic();
    const one = (text) => load(text).then(buf => {
      if (id !== sayId || muted) return null;
      return buf ? playClip(buf) : speakSystem(text);
    });
    return list.reduce((p, text) => p.then(() => (id === sayId ? one(text) : null)), Promise.resolve())
      .catch(() => null)
      .then(() => { if (id === sayId) { speaking = false; voiceDuck = false; setMusic(); } });
  }
  const talking = () => speaking;

  return {
    play(name) {
      if (muted || !on.sfx || !sounds[name]) return;
      try { sounds[name](); if (name === 'win') duck(3.4); else if (name === 'tada' || name === 'fanfare') duck(1.3); } catch (e) { /* audio blocked */ }
    },
    loop(kind) { if (!muted && on.sfx) { try { loop(kind); } catch (e) { /* audio blocked */ } } },
    stopLoop, say, talking, preload, music,
    // the grown-ups' switches: {voice, sfx, music}
    setChannels(o) {
      Object.assign(on, o);
      levels();
      if (!on.sfx) stopLoop();
      if (!on.voice) { sayId++; speaking = false; voiceDuck = false; stopVoice(); setMusic(); }
    },
    has: (name) => !!sounds[name],
    unlock() { ac(); },
    get muted() { return muted; },
    setMuted(m) {
      muted = m;
      try { localStorage.setItem('kk-mute', m ? '1' : '0'); } catch (e) { /* private mode */ }
      levels();
      if (m) { stopLoop(); sayId++; speaking = false; voiceDuck = false; stopVoice(); }
    },
  };
})();

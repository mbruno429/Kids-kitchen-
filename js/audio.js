/* Kids Kitchen — sounds (made with WebAudio, no files) and the talking chef. */
window.SFX = (function () {
  'use strict';
  let ctx = null, master = null, loopStop = null, voice = null;
  let muted = false;
  try { muted = localStorage.getItem('kk-mute') === '1'; } catch (e) { /* private mode */ }

  function ac() {
    if (!ctx) {
      const C = window.AudioContext || window.webkitAudioContext;
      if (!C) return null;
      ctx = new C();
      master = ctx.createGain();
      master.gain.value = muted ? 0 : 0.5;
      master.connect(ctx.destination);
    }
    if (ctx.state === 'suspended') ctx.resume();
    return ctx;
  }
  function tone(f0, f1, dur, type, vol, delay) {
    const c = ac(); if (!c) return;
    const t = c.currentTime + (delay || 0), o = c.createOscillator(), g = c.createGain();
    o.type = type || 'sine';
    o.frequency.setValueAtTime(f0, t);
    if (f1 !== f0) o.frequency.exponentialRampToValueAtTime(f1, t + dur);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(vol || 0.4, t + 0.012);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g).connect(master); o.start(t); o.stop(t + dur + 0.03);
  }
  let noiseBuf = null;
  function noiseSrc(c) {
    if (!noiseBuf) {
      noiseBuf = c.createBuffer(1, c.sampleRate * 2, c.sampleRate);
      const d = noiseBuf.getChannelData(0);
      for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    }
    const s = c.createBufferSource(); s.buffer = noiseBuf; s.loop = true; return s;
  }
  function noise(dur, f, vol, delay, f1, q) {
    const c = ac(); if (!c) return;
    const t = c.currentTime + (delay || 0), s = noiseSrc(c), b = c.createBiquadFilter(), g = c.createGain();
    b.type = 'bandpass'; b.Q.value = q || 1; b.frequency.setValueAtTime(f, t);
    if (f1) b.frequency.exponentialRampToValueAtTime(f1, t + dur);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(vol, t + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    s.connect(b).connect(g).connect(master); s.start(t, Math.random()); s.stop(t + dur + 0.03);
  }
  const notes = (arr, step, type, vol, len) => arr.forEach((f, i) => f && tone(f, f, len || 0.18, type || 'triangle', vol || 0.35, i * step));

  const sounds = {
    pick() { tone(520, 800, 0.09, 'sine', 0.3); },
    plop() { tone(560, 170, 0.17, 'sine', 0.55); },
    nope() { tone(230, 150, 0.15, 'triangle', 0.35); },
    chop() { noise(0.07, 1900, 0.7); tone(150, 70, 0.1, 'triangle', 0.55); },
    stir() { noise(0.16, 800, 0.22, 0, 1500); },
    roll() { noise(0.2, 260, 0.35, 0, 420); },
    flip() { noise(0.26, 500, 0.4, 0, 2600); tone(300, 760, 0.2, 'sine', 0.3, 0.05); },
    ding() { tone(1320, 1320, 1.0, 'sine', 0.45); tone(1976, 1976, 0.7, 'sine', 0.2); },
    yay() { notes([523, 659, 784], 0.09); },
    munch() { noise(0.08, 1300, 0.7); noise(0.09, 900, 0.6, 0.12); },
    tada() { notes([392, 523, 659, 784], 0.1, 'triangle', 0.35, 0.22); },
    win() { notes([523, 523, 659, 784, 0, 659, 784, 1047], 0.13, 'triangle', 0.38, 0.24); notes([262, 0, 330, 0, 392, 0, 523], 0.15, 'sine', 0.25, 0.3); },
    tick() { tone(1100, 1100, 0.03, 'square', 0.1); },
    whoosh() { noise(0.3, 400, 0.3, 0, 1800); },
  };

  function loop(kind) {
    stopLoop();
    const c = ac(); if (!c) return;
    if (kind === 'tick') {
      const id = setInterval(() => sounds.tick(), 420);
      loopStop = () => clearInterval(id);
      return;
    }
    const s = noiseSrc(c), f = c.createBiquadFilter(), g = c.createGain(), lfo = c.createOscillator(), lg = c.createGain();
    if (kind === 'boil') { f.type = 'lowpass'; f.frequency.value = 520; g.gain.value = 0.3; lfo.frequency.value = 7; lg.gain.value = 0.18; }
    else { f.type = 'highpass'; f.frequency.value = 3200; g.gain.value = 0.11; lfo.frequency.value = 13; lg.gain.value = 0.05; }
    lfo.connect(lg).connect(g.gain);
    s.connect(f).connect(g).connect(master);
    s.start(); lfo.start();
    loopStop = () => { try { g.gain.setTargetAtTime(0, c.currentTime, 0.08); s.stop(c.currentTime + 0.4); lfo.stop(c.currentTime + 0.4); } catch (e) { /* already stopped */ } };
  }
  function stopLoop() { if (loopStop) { loopStop(); loopStop = null; } }

  /* the chef reads every instruction out loud, for little ones who cannot read yet */
  function pickVoice() {
    try {
      const vs = speechSynthesis.getVoices().filter(v => /^en/i.test(v.lang));
      voice = vs.find(v => /samantha/i.test(v.name)) || vs.find(v => /en[-_]US/i.test(v.lang) && v.localService) || vs.find(v => /en[-_]US/i.test(v.lang)) || vs[0] || null;
    } catch (e) { voice = null; }
  }
  if ('speechSynthesis' in window) {
    pickVoice();
    try { speechSynthesis.addEventListener('voiceschanged', pickVoice); } catch (e) { /* old Safari */ }
  }
  let sayT = 0, spoke = false;
  function say(text) {
    if (muted || !('speechSynthesis' in window)) return;
    try {
      clearTimeout(sayT);
      const go = () => {
        const u = new SpeechSynthesisUtterance(text);
        u.lang = 'en-US'; u.rate = 0.92; u.pitch = 1.2;
        if (voice) u.voice = voice;
        speechSynthesis.speak(u);
        spoke = true;
      };
      // speak straight away when we can (iOS wants the first one inside a tap)
      if (speechSynthesis.speaking || speechSynthesis.pending) { speechSynthesis.cancel(); sayT = setTimeout(go, 90); }
      else go();
    } catch (e) { /* speech not available */ }
  }
  // iOS only lets a page talk after a tap: say nothing, quietly, on the first tap
  function unlockSpeech() {
    if (spoke || muted || !('speechSynthesis' in window)) return;
    try { const u = new SpeechSynthesisUtterance(' '); u.volume = 0; speechSynthesis.speak(u); spoke = true; } catch (e) { /* no speech */ }
  }
  function talking() { try { return 'speechSynthesis' in window && (speechSynthesis.speaking || speechSynthesis.pending); } catch (e) { return false; } }

  return {
    play(name) { if (!muted && sounds[name]) { try { sounds[name](); } catch (e) { /* audio blocked */ } } },
    loop(kind) { if (!muted) { try { loop(kind); } catch (e) { /* audio blocked */ } } },
    stopLoop, say, talking,
    unlock() { ac(); unlockSpeech(); },
    get muted() { return muted; },
    setMuted(m) {
      muted = m;
      try { localStorage.setItem('kk-mute', m ? '1' : '0'); } catch (e) { /* private mode */ }
      if (master) master.gain.value = m ? 0 : 0.5;
      if (m) { stopLoop(); try { speechSynthesis.cancel(); } catch (e) { /* no speech */ } }
    },
  };
})();

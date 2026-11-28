// Checks the game files: every recipe has its pictures, every line has a recording,
// and everything the page loads is on the "works without internet" list.
// Run with: node tools/check.js   (GitHub runs it on every push)
const fs = require('fs');
const path = require('path');
process.chdir(path.join(__dirname, '..'));

global.window = {};
['js/art.js', 'js/recipes.js', 'js/lines.js', 'js/store.js', 'assets/voice/index.js'].forEach(f => require(path.resolve(f)));
const { V, VESSEL } = window.ART;
let bad = 0;
const fail = (...a) => { console.error(...a); bad++; };

// recipes
const need = (id, where) => { if (!V[id]) fail('Missing picture', id, 'in', where); };
for (const r of window.RECIPES) {
  if (!window.STORE.CATS.some(c => c[0] === r.cat)) fail('Unknown cookbook section', r.cat, 'in', r.id);
  if (r.art) need(r.art, r.id);
  for (const s of r.steps) {
    if (s.on && !VESSEL[s.on]) fail('Missing vessel', s.on, 'in', r.id);
    const items = (s.items || []).map(it => (typeof it === 'string' ? { v: it } : it));
    for (const it of items) { need(it.v, r.id); if (it.as) need(it.as, r.id); if (it.out) need(it.out, r.id); }
    for (const o of s.out || []) need(o.v, r.id);
    for (const k in s.turn || {}) need(s.turn[k], r.id);
    const choices = items.filter(it => it.opt).length;
    if (s.pick && s.pick >= choices) fail('Step in', r.id, 'asks to pick', s.pick, 'but offers only', choices, 'choices');
    if (!s.pick && choices) fail('Step in', r.id, 'has choices but no pick: N');
  }
}

// voice
const lines = window.LINES.all(window.RECIPES, V, window.STORE.FRIENDS, window.STORE.CATS);
for (const l of lines) {
  const f = window.VOICE[l];
  if (!f) console.warn('No recording yet (the phone voice will read it): ' + l);
  else if (!fs.existsSync('assets/voice/' + f)) fail('Recording file missing for: ' + l);
}
if (!window.VOICE_V) fail('assets/voice/index.js has no VOICE_V stamp: run tools/make-voice.py again');

// playing without internet: sw.js must list every file the page loads
const sw = fs.readFileSync('sw.js', 'utf8');
const listed = JSON.parse(sw.slice(sw.indexOf('['), sw.indexOf('];') + 1).replace(/'/g, '"').replace(/,\s*\]/, ']'));
const html = fs.readFileSync('index.html', 'utf8');
const loaded = [...html.matchAll(/(?:src|href)="([^":]+\.(?:js|css|svg|png|webmanifest))"/g)].map(m => m[1]);
for (const f of loaded) if (!listed.includes(f)) fail('index.html loads', f, 'but sw.js does not list it (the game would break without internet)');
for (const f of listed) if (f !== './' && !fs.existsSync(f)) fail('sw.js lists a file that does not exist:', f);

console.log(`${window.RECIPES.length} recipes, ${lines.length} voice lines, ${window.STORE.FRIENDS.length} friends and ${listed.length} offline files checked`);
process.exit(bad ? 1 : 0);

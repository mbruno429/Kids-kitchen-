/* Kids Kitchen — lets the game work without internet.
   The game's own files are fetched fresh whenever there is a connection (so updates show up
   straight away) and come from the phone's saved copy when there is none.
   The chef's recordings are saved the first time the game is opened. */
const SHELL = 'kk-shell-1';
const FILES = [
  './', 'index.html', 'manifest.webmanifest', 'css/style.css',
  'js/art.js', 'js/recipes.js', 'js/lines.js', 'js/store.js', 'js/audio.js', 'js/game.js', 'js/screens.js',
  'assets/voice/index.js', 'assets/icon.svg', 'assets/icon-180.png', 'assets/icon-512.png',
];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(SHELL)
    .then(c => c.addAll(FILES.map(f => new Request(f, { cache: 'reload' }))))
    .then(() => self.skipWaiting()));
});
self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys()
    .then(keys => Promise.all(keys.filter(k => k.startsWith('kk-shell-') && k !== SHELL).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});

const clean = (url) => { const u = new URL(url); return u.origin + u.pathname; }; // ignore things like ?fast

// game files: the network first, the saved copy when offline (or when the network is very slow).
// `no-cache` asks the server every time (a quick "not changed" when nothing is new), so right after an
// update the phone never mixes old and new game files from the browser's own short-term cache.
async function shell(req) {
  const cache = await caches.open(SHELL), key = clean(req.url);
  const saved = await cache.match(key);
  const fresh = fetch(req, { cache: 'no-cache' }).then((res) => {
    if (res.ok && res.type === 'basic') cache.put(key, res.clone());
    return res.ok || !saved ? res : saved;
  });
  if (!saved) return fresh;
  return Promise.race([fresh.catch(() => saved), new Promise(done => setTimeout(() => done(saved), 3000))]);
}

// recordings: the saved copy first
let voiceCache = null;
async function voice(req) {
  const key = clean(req.url);
  const hit = (voiceCache && await (await caches.open(voiceCache)).match(key)) || await caches.match(key);
  return hit || fetch(req);
}

self.addEventListener('fetch', (e) => {
  const req = e.request, url = new URL(req.url);
  if (req.method !== 'GET' || url.origin !== self.location.origin) return;
  e.respondWith(/\/assets\/voice\/[^/]+\.mp3$/.test(url.pathname) ? voice(req) : shell(req));
});

// save every recording on the phone. `v` changes whenever the recordings are made again.
async function saveVoice(v, files, client) {
  const name = 'kk-voice-' + v;
  voiceCache = name;
  const cache = await caches.open(name);
  const have = new Set((await cache.keys()).map(r => r.url.slice(r.url.lastIndexOf('/') + 1)));
  const todo = files.filter(f => !have.has(f));
  let done = files.length - todo.length, next = 0;
  const tell = (finished) => { try { if (client) client.postMessage({ type: 'offline', done, total: files.length, finished }); } catch (e) { /* page closed */ } };
  tell(false);
  const worker = async () => {
    while (next < todo.length) {
      const url = new URL('assets/voice/' + todo[next++], self.registration.scope).href;
      try {
        const res = await fetch(url, { cache: 'no-cache' });
        if (res.ok) { await cache.put(url, res); done++; if (done % 16 === 0) tell(false); }
      } catch (e) { /* no connection: the rest is saved next time */ }
    }
  };
  await Promise.all([worker(), worker(), worker(), worker()]);
  if (done >= files.length) {
    const keys = await caches.keys();
    await Promise.all(keys.filter(k => k.startsWith('kk-voice-') && k !== name).map(k => caches.delete(k)));
  }
  tell(true);
}
self.addEventListener('message', (e) => {
  const d = e.data || {};
  if (d.type !== 'voice' || !Array.isArray(d.files) || !/^[\w-]{1,40}$/.test(String(d.v))) return;
  e.waitUntil(saveVoice(String(d.v), d.files.filter(f => /^[\w-]+\.mp3$/.test(f)), e.source));
});

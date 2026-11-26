/* Kids Kitchen — the sticker book, the grown-ups' corner, and playing without internet. */
(function () {
  'use strict';
  const STORE = window.STORE, SFX = window.SFX, LINES = window.LINES, KK = window.__KK;
  const { $, $$, el, show, dishPic, wobble, sparkle } = KK;
  const FAST = /[?&]fast\b/.test(location.search);

  /* ---------- sticker book ---------- */
  let bookBack = 'home';
  function paintBook() {
    const box = $('#bookBody'), list = STORE.visible(), stars = STORE.save.stars, n = STORE.dishCount();
    box.innerHTML = '';
    $('#bookTotal').textContent = `${list.filter(r => stars[r.id]).length} / ${list.length}`;

    box.append(el('<h3 class="cat cat-lunch"><span>🐾</span>Friends</h3>'));
    const pals = el('<div class="pals"></div>');
    STORE.FRIENDS.forEach((f) => {
      const here = f.at <= n;
      const b = el(here
        ? `<button class="pal" aria-label="${f.name}"><span class="pal-face">${f.face}</span><span class="pal-name">${f.name}</span><span class="pal-sub">❤️ ${STORE.save.hearts[f.id] || 0}</span></button>`
        : `<button class="pal locked" aria-label="A new friend comes when ${f.at} dishes are cooked"><span class="pal-face">❓</span><span class="pal-name">&nbsp;</span><span class="pal-sub">⭐ ${f.at}</span></button>`);
      b.addEventListener('click', () => { wobble(b, 'tapped'); SFX.play(here ? 'heart' : 'nope'); });
      pals.append(b);
    });
    box.append(pals);

    box.append(el('<h3 class="cat cat-breakfast"><span>⭐</span>Stickers</h3>'));
    const grid = el('<div class="stickers"></div>');
    list.forEach((r, i) => {
      const got = stars[r.id] || 0;
      const b = el(`<button class="sticker${got ? '' : ' empty'}" style="--tilt:${((i * 37) % 13) - 6}deg" aria-label="${r.name}${got ? '' : ' (not cooked yet)'}">
        <span>${dishPic(r)}</span>${got > 1 ? `<b>×${got}</b>` : ''}</button>`);
      b.addEventListener('click', () => { wobble(b, 'tapped'); SFX.play(got ? 'star' : 'nope'); if (got) sparkle(b, 50, 50, 4); });
      grid.append(b);
    });
    box.append(grid);

    box.append(el('<h3 class="cat cat-treats"><span>🏅</span>Badges</h3>'));
    const badges = el('<div class="badges"></div>');
    STORE.BADGES.filter(b => !b.cat || list.some(r => r.cat === b.cat)).forEach((b) => {
      const e = el(`<button class="badge${STORE.earned(b) ? '' : ' locked'}" aria-label="${b.name}"><span>${b.icon}</span><small>${b.name}</small></button>`);
      e.addEventListener('click', () => { wobble(e, 'tapped'); SFX.play(STORE.earned(b) ? 'star' : 'nope'); });
      badges.append(e);
    });
    box.append(badges);
    box.scrollTop = 0;
  }
  function openBook(from) {
    bookBack = from;
    paintBook();
    show('book');
    SFX.unlock(); SFX.play('sticker'); SFX.say(LINES.book);
  }
  $('#bookBtn').addEventListener('click', () => openBook('home'));
  $('.book-open').addEventListener('click', () => openBook('menu'));
  $('#book .back').addEventListener('click', () => { SFX.play('pick'); if (bookBack === 'menu') KK.toMenu(); else KK.toHome(); });

  /* ---------- playing without internet ---------- */
  const off = { state: 'none', done: 0, total: 0 };
  function offlineText() {
    if (off.state === 'ready') return '✅ Saved on this device. The game now works without internet.';
    if (off.state === 'saving') return `⏳ Saving the game on this device… ${off.done} of ${off.total || '…'} recordings.`;
    if (off.state === 'partial') return `⚠️ ${off.done} of ${off.total} recordings are saved. Open the game once more with a good connection to save the rest.`;
    return 'This browser cannot save the game for playing without internet.';
  }
  function paintOffline() { const n = $('#offState'); if (n) n.textContent = offlineText(); }
  if ('serviceWorker' in navigator && /^https?:$/.test(location.protocol)) {
    off.state = 'saving';
    navigator.serviceWorker.addEventListener('message', (e) => {
      const d = e.data || {};
      if (d.type !== 'offline') return;
      off.done = d.done; off.total = d.total;
      off.state = !d.finished ? 'saving' : d.done >= d.total ? 'ready' : 'partial';
      paintOffline();
    });
    const start = () => navigator.serviceWorker.register('sw.js').then(() => navigator.serviceWorker.ready).then((reg) => {
      const files = [...new Set(Object.values(window.VOICE || {}))];
      // let the first screen settle before the recordings are saved
      setTimeout(() => { if (reg.active) reg.active.postMessage({ type: 'voice', v: window.VOICE_V || '0', files }); }, FAST ? 300 : 2500);
    }).catch(() => { off.state = 'none'; paintOffline(); });
    if (document.readyState === 'complete') start(); else window.addEventListener('load', start);
  }

  /* ---------- grown-ups' corner ---------- */
  const HOLD = FAST ? 400 : 3000;
  let holdT = 0;
  const holdBtn = $('#holdBtn');
  function holdEnd() { clearTimeout(holdT); holdT = 0; holdBtn.classList.remove('holding'); }
  function holdStart(e) {
    if (e.button > 0) return;
    e.preventDefault();
    holdEnd();
    holdBtn.style.setProperty('--hold', HOLD + 'ms');
    holdBtn.classList.add('holding');
    holdT = setTimeout(() => { holdEnd(); $('#grownGate').hidden = true; $('#grownBody').hidden = false; paintGrown(); }, HOLD);
  }
  holdBtn.addEventListener('pointerdown', holdStart);
  ['pointerup', 'pointerleave', 'pointercancel'].forEach(t => holdBtn.addEventListener(t, holdEnd));
  $('#grownBtn').addEventListener('click', () => { holdEnd(); $('#grownGate').hidden = false; $('#grownBody').hidden = true; show('grown'); });
  $('#grown .back').addEventListener('click', () => { holdEnd(); KK.toHome(); });

  const channels = () => SFX.setChannels({ voice: STORE.opts.voice, sfx: STORE.opts.sfx, music: STORE.opts.music });
  function row(title, sub, isOn, change) {
    const r = el(`<div class="row"><span class="row-txt">${title}${sub ? `<small>${sub}</small>` : ''}</span>
      <button class="sw${isOn ? ' on' : ''}" role="switch" aria-checked="${!!isOn}" aria-label="${title}"><i></i></button></div>`);
    const b = $('.sw', r);
    b.addEventListener('click', () => {
      const want = !b.classList.contains('on');
      if (change(want) === false) { wobble(r, 'no'); return; }
      b.classList.toggle('on', want);
      b.setAttribute('aria-checked', want);
    });
    return r;
  }
  const opt = (key, title, sub, after) => row(title, sub, STORE.opts[key], (v) => { STORE.opts[key] = v; STORE.persist(); if (after) after(v); });
  function paintGrown() {
    const box = $('#grownBody'), o = STORE.opts;
    box.innerHTML = '';
    const head = (t) => box.append(el(`<h3 class="g-head">${t}</h3>`));

    head('Sound');
    box.append(row('All sound', 'The same as the 🔊 button in the game.', !SFX.muted, (v) => { SFX.setMuted(!v); KK.paintSnd(); }));
    box.append(opt('voice', 'The chef’s voice', 'Reads every instruction aloud.', channels));
    box.append(opt('sfx', 'Sound effects', 'Sizzling, chopping, munching…', channels));
    box.append(opt('music', 'Music', 'A quiet tune in the background.', (v) => { channels(); if (v) { SFX.unlock(); SFX.music(true); } }));
    const check = el(`<div class="row check"><span class="row-txt">Sound check<small>Tap each one. If you hear nothing, turn up the volume.</small></span>
      <span class="check-btns"><button data-k="voice">Voice</button><button data-k="sfx">Effect</button><button data-k="music">Music</button></span></div>`);
    $$('button', check).forEach(b => b.addEventListener('click', () => {
      SFX.unlock();
      if (b.dataset.k === 'voice') SFX.say(LINES.hello);
      else if (b.dataset.k === 'sfx') SFX.play('tada');
      else SFX.music(true);
    }));
    box.append(check);

    head('Cooking');
    box.append(opt('wash', 'Wash hands first', 'Every recipe starts at the sink.'));
    box.append(opt('tips', '“Ask a grown-up” reminders', 'Said when a recipe uses the stove, the oven or a knife.'));
    box.append(opt('crispy', 'Food can get a little crispy', 'If the heat is left on too long. Turn this off for the youngest cooks: the heat then turns off by itself.'));

    head('Cookbook sections');
    STORE.CATS.forEach(([name, icon, key]) => box.append(row(`${icon} ${name}`, '', !o.hide[key], (v) => {
      if (!v && STORE.CATS.filter(c => !o.hide[c[2]]).length <= 1) return false; // keep at least one section
      if (v) delete o.hide[key]; else o.hide[key] = true;
      STORE.persist();
      return true;
    })));

    head('Playing without internet');
    box.append(el(`<p class="g-note" id="offState">${offlineText()}</p>`));
    box.append(el('<p class="g-note">On iPhone, add the game to the Home Screen: open this page in Safari, tap Share, then “Add to Home Screen”. It then runs full screen, and Safari will not clear its saved game and stickers. (The Home Screen app keeps its own progress, separate from Safari.)</p>'));

    head('Progress');
    box.append(el(`<p class="g-note">${STORE.dishCount()} of ${window.RECIPES.length} dishes cooked, ${STORE.friends().length} of ${STORE.FRIENDS.length} friends.</p>`));
    const erase = el('<button class="erase">Erase stars, stickers and friends</button>');
    let armed = 0;
    erase.addEventListener('click', () => {
      if (!armed) { erase.textContent = 'Tap again to erase everything'; erase.classList.add('armed'); armed = setTimeout(() => { armed = 0; erase.textContent = 'Erase stars, stickers and friends'; erase.classList.remove('armed'); }, 4000); return; }
      clearTimeout(armed);
      STORE.reset();
      paintGrown();
    });
    box.append(erase);
    box.append(el('<p class="g-note small">Kids Kitchen keeps everything on this device. No accounts, no ads, nothing is sent anywhere.</p>'));
    box.scrollTop = 0;
  }

  window.__KK.openBook = openBook;
  window.__KK.offline = off;
})();

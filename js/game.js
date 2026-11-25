/* Kids Kitchen — the game. */
(function () {
  'use strict';
  const { V, VESSEL, OVEN, chef, E } = window.ART;
  const RECIPES = window.RECIPES;
  const SFX = window.SFX;
  const LINES = window.LINES;

  const $ = (s, root) => (root || document).querySelector(s);
  const $$ = (s, root) => [...(root || document).querySelectorAll(s)];
  const el = (html) => { const t = document.createElement('template'); t.innerHTML = html.trim(); return t.content.firstElementChild; };
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const rand = (a, b) => a + Math.random() * (b - a);
  const FAST = /[?&]fast\b/.test(location.search) ? 0.15 : 1; // ?fast speeds everything up (used by the tests)

  const app = $('#app'), kitchen = $('#kitchen'), stage = $('#stage'), tray = $('#tray'), hand = $('#hand');

  /* ---------- saved progress ---------- */
  let save = { stars: {} };
  try { save = Object.assign(save, JSON.parse(localStorage.getItem('kk-save') || '{}')); } catch (e) { /* private mode */ }
  const persist = () => { try { localStorage.setItem('kk-save', JSON.stringify(save)); } catch (e) { /* private mode */ } };

  /* ---------- game state ---------- */
  const G = { r: null, i: 0, pieces: [], top: 97, z: 10, run: 0, cleanup: [] };

  function show(id) { $$('.screen').forEach(s => s.classList.toggle('on', s.id === id)); }

  /* ---------- title + cookbook ---------- */
  $('#homeChef').innerHTML = chef; $('#menuChef').innerHTML = chef; $('#bubbleChef').innerHTML = chef;
  (function floaters() {
    const box = $('.floaters');
    ['🥞', '🍕', '🍔', '🧁', '🍪', '🌮', '🥕', '🍓', '🧀', '🥚', '🌽', '🍎'].forEach((ch, i) => {
      box.append(el(`<i style="left:${(i * 37 + 8) % 92}%;top:${(i * 53 + 6) % 90}%;animation-delay:${-i * 0.7}s;font-size:${34 + (i % 3) * 10}px">${ch}</i>`));
    });
  })();

  const CATS = [['Breakfast', '☀️', 'breakfast'], ['Lunch', '🥪', 'lunch'], ['Dinner', '🍽️', 'dinner'], ['Tex-Mex', '🌮', 'texmex'],
    ['Cajun & Creole', '🦞', 'cajun'], ['Filipino', '🥟', 'filipino'], ['Treats', '🧁', 'treats']];
  const dishPic = (r) => (r.art ? V[r.art].h : E(r.icon));
  function buildMenu() {
    const box = $('#dishes'); box.innerHTML = '';
    CATS.forEach(([cat, icon, key]) => {
      box.append(el(`<h3 class="cat cat-${key}"><span>${icon}</span>${cat}</h3>`));
      const grid = el('<div class="grid"></div>');
      RECIPES.filter(r => r.cat === cat).forEach(r => {
        const b = el(`<button class="card cat-${key}${save.stars[r.id] ? ' done' : ''}" data-id="${r.id}" aria-label="${r.name}">
          <span class="card-pic">${dishPic(r)}</span><span class="card-name">${r.name}</span><span class="card-star">⭐</span></button>`);
        b.addEventListener('click', () => { SFX.unlock(); SFX.play('pick'); startRecipe(r); });
        grid.append(b);
      });
      box.append(grid);
    });
  }
  function toMenu() {
    endStep(); G.run++;
    $('#win').hidden = true; stopConfetti();
    buildMenu(); show('menu');
  }
  $('#playBtn').addEventListener('click', () => { SFX.unlock(); SFX.play('yay'); SFX.say(LINES.hello); toMenu(); });
  $('#homeBtn').addEventListener('click', () => { SFX.play('pick'); toMenu(); });
  $('#winMenu').addEventListener('click', () => { SFX.play('pick'); toMenu(); });
  $('#winAgain').addEventListener('click', () => { SFX.play('pick'); startRecipe(G.r); });
  $('#winNext').addEventListener('click', () => { SFX.play('pick'); startRecipe(RECIPES[(RECIPES.indexOf(G.r) + 1) % RECIPES.length]); });
  $('#bubble').addEventListener('click', () => SFX.say(G.said || $('#say').textContent));

  function paintSnd() { $$('.snd').forEach(b => { b.textContent = SFX.muted ? '🔇' : '🔊'; }); }
  $$('.snd').forEach(b => b.addEventListener('click', () => { SFX.setMuted(!SFX.muted); paintSnd(); if (!SFX.muted) { SFX.unlock(); SFX.play('yay'); } }));
  paintSnd();

  /* ---------- running a recipe ---------- */
  const DEFAULT_SAY = { eat: LINES.eat };
  const pickOne = (arr) => arr[Math.floor(Math.random() * arr.length)];
  const pause = (ms) => new Promise(r => setTimeout(r, ms));
  SFX.preload(LINES.common());

  function startRecipe(r) {
    G.r = r; G.pieces = [];
    SFX.preload(LINES.forRecipe(r, V), LINES.common());
    $('#win').hidden = true; stopConfetti();
    show('kitchen');
    $('#dots').innerHTML = r.steps.map(() => '<i></i>').join('');
    goStep(0);
  }
  function setSay(text, spoken) {
    $('#say').textContent = text;
    G.said = text;
    const done = SFX.say(spoken || text);
    const b = $('#bubble'); b.classList.remove('talk'); void b.offsetWidth; b.classList.add('talk');
    return done;
  }
  function endStep() {
    G.cleanup.forEach(f => { try { f(); } catch (e) { /* ignore */ } });
    G.cleanup = [];
    clearHint();
    $$('.ghost', kitchen).forEach(g => g.remove());
    SFX.stopLoop();
  }
  function goStep(i) {
    endStep();
    G.i = i;
    const s = G.r.steps[i], tok = ++G.run;
    if (s.t === 'add' && !s.keep) { G.pieces = []; G.top = 97; G.z = 10; }
    stage.className = 'stage'; stage.innerHTML = '';
    tray.className = 'tray'; tray.innerHTML = '';
    const text = s.say || DEFAULT_SAY[s.t] || '';
    setSay(text, i === 0 ? [LINES.intro(G.r), text] : text);
    $$('#dots i').forEach((d, k) => { d.className = k < i ? 'done' : k === i ? 'now' : ''; });
    STEPS[s.t](s, tok);
  }
  function stepDone(tok) {
    if (tok !== G.run) return;
    clearHint();
    SFX.play('yay');
    sparkle(stage, 50, 45, 9);
    const s = G.r.steps[G.i];
    const said = setSay(pickOne(LINES.praise[s.t === 'rub' ? s.tool : s.t] || LINES.praise.add));
    $$('#dots i')[G.i].className = 'done';
    // move on once the chef has finished cheering (but never keep a child waiting long)
    Promise.all([pause(1250 * FAST), FAST < 1 ? null : Promise.race([said, pause(3200)])])
      .then(() => { if (tok === G.run && G.i + 1 < G.r.steps.length) goStep(G.i + 1); });
  }

  /* ---------- pieces + vessels ---------- */
  function mkPiece(o) {
    return { v: o.v, w: o.w || 32, x: o.x == null ? 50 : o.x, y: o.y == null ? 50 : o.y, rot: o.rot || 0, z: o.z == null ? G.z++ : o.z, cook: o.raw ? 0 : 1 };
  }
  function pieceEl(p) {
    const v = V[p.v], e = document.createElement('div');
    e.className = 'pc';
    e.style.cssText = `left:${p.x}%;top:${p.y}%;width:${p.w}%;z-index:${p.z};--rot:${p.rot || 0}deg;--cook:${p.cook}`;
    e.innerHTML = v.r ? `<div class="rw">${v.r}</div><div class="ck">${v.h}</div>` : v.h;
    if (!v.r && p.cook < 1) e.classList.add('flt');
    p.el = e;
    return e;
  }
  function mkVessel(type) {
    const d = VESSEL[type];
    const v = el(`<div class="vessel v-${type}${d.stove ? ' on-stove' : ''}"><div class="v-art">${d.art}</div>
      <div class="v-food"><div class="v-in" style="left:${d.box[0]}%;top:${d.box[1]}%;width:${d.box[2]}%;height:${d.box[2]}%"></div></div><div class="v-fx">${d.front || ''}</div></div>`);
    stage.append(v);
    v.vin = $('.v-in', v); v.food = $('.v-food', v); v.fx = $('.v-fx', v); v.def = d;
    return v;
  }
  function paint(ves, pop) {
    ves.vin.innerHTML = '';
    G.pieces.forEach(p => { const e = pieceEl(p); if (pop) e.classList.add('pop'); ves.vin.append(e); });
  }
  function setCook(p, c) { p.cook = c; if (p.el) { p.el.style.setProperty('--cook', c); if (c >= 1) p.el.classList.remove('flt'); } }
  // after cooking / baking: swap the food for its finished look
  function applyResult(s, ves) {
    G.pieces.forEach(p => setCook(p, 1));
    if (s.out) { G.pieces = s.out.map(mkPiece); paint(ves, true); }
    if (s.turn) {
      G.pieces.forEach(p => {
        if (!s.turn[p.v]) return;
        p.v = s.turn[p.v];
        const old = p.el, e = pieceEl(p); e.classList.add('pop'); old.replaceWith(e);
      });
    }
  }
  function mkBar() {
    const b = el('<div class="bar"><i></i><b>⭐</b></div>');
    stage.append(b);
    const f = $('i', b);
    return { set(p) { f.style.width = clamp(p, 0, 1) * 100 + '%'; b.classList.toggle('full', p >= 1); } };
  }
  function mkTile(html, n) {
    const t = el(`<button class="tile"><span class="ti">${html}</span>${n > 1 ? `<b class="cnt">${n}</b>` : ''}</button>`);
    tray.append(t);
    return t;
  }
  const mid = (node) => { const r = node.getBoundingClientRect(); return [r.left + r.width / 2, r.top + r.height / 2]; };

  /* ---------- little effects ---------- */
  function sparkle(host, xPct, yPct, n) {
    for (let i = 0; i < n; i++) {
      const a = (i / n) * Math.PI * 2 + rand(0, 0.5), d = rand(60, 130);
      const s = el(`<i class="spark" style="left:${xPct}%;top:${yPct}%;--dx:${Math.cos(a) * d}px;--dy:${Math.sin(a) * d}px;animation-delay:${i * 18}ms">${i % 2 ? '✨' : '⭐'}</i>`);
      host.append(s);
      s.addEventListener('animationend', () => s.remove());
    }
  }
  function puff(ves, kind) {
    const p = el(`<i class="${kind}" style="left:${rand(22, 78)}%;top:${kind === 'bub' ? rand(24, 76) : rand(20, 55)}%;--s:${rand(0.6, 1.3)}"></i>`);
    ves.fx.append(p);
    p.addEventListener('animationend', () => p.remove());
  }
  function wobble(node, cls) { node.classList.remove(cls); void node.offsetWidth; node.classList.add(cls); }

  /* ---------- the pointing hand (shows what to do when a child is stuck) ---------- */
  let hintFn = null, hintT = 0, hintAnim = null;
  function hint(fn) { hintFn = fn; nudge(2600); }
  function nudge(ms) {
    clearTimeout(hintT);
    if (hintAnim) { hintAnim.cancel(); hintAnim = null; }
    hand.classList.remove('show');
    if (hintFn) hintT = setTimeout(showHint, (ms || 4200));
  }
  function clearHint() { hintFn = null; nudge(); }
  function showHint() {
    const pair = hintFn && hintFn();
    if (!pair || !pair[0] || !pair[1] || !hand.animate) { if (hintFn) hintT = setTimeout(showHint, 2500); return; }
    const kr = kitchen.getBoundingClientRect(), a = mid(pair[0]), b = mid(pair[1]);
    const A = `translate(${a[0] - kr.left - 14}px,${a[1] - kr.top - 4}px)`, B = `translate(${b[0] - kr.left - 14}px,${b[1] - kr.top - 4}px)`;
    hand.classList.add('show');
    const tap = pair[0] === pair[1];
    hintAnim = hand.animate(tap
      ? [{ transform: A + ' scale(1.25)', opacity: 0 }, { transform: A + ' scale(1)', opacity: 1, offset: 0.2 }, { transform: A + ' scale(.8)', opacity: 1, offset: 0.4 }, { transform: A + ' scale(1)', opacity: 1, offset: 0.6 }, { transform: A + ' scale(.8)', opacity: 1, offset: 0.8 }, { transform: A + ' scale(1.1)', opacity: 0 }]
      : [{ transform: A + ' scale(1.2)', opacity: 0 }, { transform: A + ' scale(.9)', opacity: 1, offset: 0.18 }, { transform: B + ' scale(.9)', opacity: 1, offset: 0.78 }, { transform: B + ' scale(1.2)', opacity: 0 }],
      { duration: 1700, easing: 'ease-in-out' });
    hintAnim.onfinish = () => { hand.classList.remove('show'); if (hintFn) hintT = setTimeout(showHint, 3200); };
  }
  kitchen.addEventListener('pointerdown', () => nudge(), true);

  /* ---------- tapping ---------- */
  // Every action in the game is one tap. We react the moment a finger touches the screen
  // (little fingers wobble and slide), and also to a keyboard or switch-control "click".
  function tappable(node, fn) {
    let last = 0;
    node.addEventListener('pointerdown', (e) => {
      if (e.button > 0) return;
      e.preventDefault();
      SFX.unlock();
      last = performance.now();
      fn(e);
    });
    node.addEventListener('click', (e) => { if (performance.now() - last > 700) fn(e); });
  }
  // a picture hops from one thing to a spot on the screen, then `done` runs
  function fly(from, to, html, done) {
    const kr = kitchen.getBoundingClientRect(), a = mid(from), size = clamp(from.offsetWidth * 1.15, 72, 104);
    const g = el(`<div class="ghost" style="width:${size}px;height:${size}px">${html}</div>`);
    kitchen.append(g);
    const at = (x, y, sc) => `translate(${x - kr.left - size / 2}px,${y - kr.top - size / 2}px) scale(${sc})`;
    const ms = FAST < 1 ? 90 : 420;
    let ended = false;
    const end = () => { if (ended) return; ended = true; g.remove(); done(); };
    if (g.animate) {
      g.animate([
        { transform: at(a[0], a[1], 0.8) },
        { transform: at((a[0] + to[0]) / 2, Math.min(a[1], to[1]) - 46, 1.25), offset: 0.55 },
        { transform: at(to[0], to[1], 0.85) },
      ], { duration: ms, easing: 'ease-in-out' }).onfinish = end;
    }
    setTimeout(end, ms + 150);
  }

  // pick the emptiest of some candidate spots
  function emptiest(cands, taken) {
    if (!taken.length) return cands[Math.floor(Math.random() * cands.length)];
    let best = cands[0], bd = -1;
    cands.forEach(pt => {
      let d = 1e9;
      taken.forEach(p => { d = Math.min(d, Math.hypot(p.x - pt[0], p.y - pt[1])); });
      d += Math.random() * 3;
      if (d > bd) { bd = d; best = pt; }
    });
    return best;
  }
  const ring = (n, r, a0) => Array.from({ length: n }, (_, i) => [50 + Math.cos(a0 + i * 6.2832 / n) * r, 50 + Math.sin(a0 + i * 6.2832 / n) * r]);
  const grid = (x0, y0, x1, y1, nx, ny) => { const c = []; for (let i = 0; i < nx; i++) for (let j = 0; j < ny; j++) c.push([x0 + (x1 - x0) * i / (nx - 1), y0 + (y1 - y0) * j / (ny - 1)]); return c; };
  // a spot for an ingredient that is scattered in a bowl / pot / pan / tray
  function freeSpot(round, single) {
    if (single) return [50, 50];
    const c = round ? [[50, 50]].concat(ring(5, 14, 0.4), ring(10, 27, 0)) : grid(23, 23, 77, 77, 4, 4);
    const taken = G.pieces.filter(p => p.w < 60);
    if (!taken.length) return c[round ? 6 + Math.floor(Math.random() * 10) : Math.floor(Math.random() * 16)];
    return emptiest(c, taken);
  }
  // a spot for a topping (pepperoni on the pizza, sprinkles on the cupcake ...): spread them out nicely
  function toppingSpot(it, round) {
    const m = it.max || 34;
    const c = it.box ? grid(it.box[0], it.box[1], it.box[2], it.box[3], 5, 4)
      : round ? [[50, 50]].concat(ring(6, m * 0.52, 0.5), ring(11, m, 0)) : grid(18, 18, 82, 82, 5, 5);
    const sp = emptiest(c, G.pieces.filter(p => p.free));
    return [sp[0] + rand(-2, 2), sp[1] + rand(-2, 2)];
  }

  const STEPS = {};

  /* ---------- ADD: tap an ingredient and it hops into the bowl / pan / plate ---------- */
  STEPS.add = (s, tok) => {
    const ves = mkVessel(s.on), d = ves.def;
    paint(ves);
    const items = s.items.map(raw => {
      const it = typeof raw === 'string' ? { v: raw } : Object.assign({}, raw);
      const dv = (!it.as && V[it.v].d) || {};
      it.as = it.as || dv.as || it.v;
      it.at = it.pos ? 'pos' : it.at || dv.at || (d.side ? 'stack' : d.slots ? 'slot' : 'scatter');
      if (it.raw === undefined) it.raw = !!dv.raw;
      it.w = it.w || dv.w || (it.at === 'fill' ? 100 : s.w || 32);
      it.left = it.n || 1;
      return it;
    });
    if (items.length > 4) tray.classList.add('rows2');
    if (d.side) stage.classList.add('sideview');
    const scatterTotal = items.reduce((n, it) => n + (it.at === 'scatter' ? it.left : 0), 0) + G.pieces.length;
    const before = (k) => items.slice(0, k).every(x => x.left === 0);
    const enabled = (i) => {
      const q = s.seq;
      if (!q) return true;
      if (q === true) return before(i);
      if (q === 'ends') return i === 0 ? true : i === items.length - 1 ? before(i) : items[0].left === 0;
      return i < q ? before(i) : before(q);
    };
    let flying = 0;
    function refresh() {
      let first = true;
      items.forEach((it, i) => {
        const on = enabled(i);
        it.tile.classList.toggle('off', it.left > 0 && !on);
        it.tile.classList.toggle('next', !!s.seq && it.left > 0 && on && first);
        if (it.left > 0 && on) first = false;
      });
    }
    // decide where the ingredient will land
    function landing(it) {
      const look = V[it.as];
      const p = { v: it.as, w: it.w, cook: it.raw ? 0 : 1, rot: 0, z: it.z != null ? it.z : it.pos && it.pos.z != null ? it.pos.z : G.z++ };
      if (it.spots) { const sp = it.spots[(it.n || 1) - it.left] || [50, 50]; p.x = sp[0]; p.y = sp[1]; }
      else if (it.at === 'pos') { p.x = it.pos.x; p.y = it.pos.y; }
      else if (it.at === 'center') { p.x = 50; p.y = 50; }
      else if (it.at === 'fill') { p.x = 50; p.y = 50; p.w = 100; p.z = 1; }
      else if (it.at === 'free') {
        const sp = toppingSpot(it, d.round);
        p.x = sp[0]; p.y = sp[1]; p.rot = rand(-22, 22); p.free = true;
      } else if (it.at === 'slot') {
        const used = G.pieces.map(q => q.slot);
        let k = d.slots.findIndex((sl, i) => !used.includes(i));
        if (k < 0) k = 0;
        p.x = d.slots[k][0]; p.y = d.slots[k][1]; p.slot = k;
      } else if (it.at === 'stack') {
        const h = p.w * (look.ar || 1), first = G.top >= 97;
        const bottom = G.top + (first ? 0 : (look.sink == null ? 0.1 : look.sink) * h);
        p.x = 50 + (first ? 0 : rand(-1.2, 1.2)); p.y = bottom - h / 2;
        G.top = bottom - h;
      } else {
        const sp = freeSpot(d.round, scatterTotal === 1);
        p.x = sp[0]; p.y = sp[1]; p.rot = rand(-18, 18);
      }
      return p;
    }
    function send(it, i, pic) {
      if (tok !== G.run || it.left <= 0) return;
      if (!enabled(i)) { wobble(it.tile, 'no'); SFX.play('nope'); return; }
      const look = V[it.v];
      if (look.n && !SFX.talking()) SFX.say(LINES.name(look.n));
      SFX.play('pick');
      const p = landing(it);
      G.pieces.push(p);
      it.left--;
      const cnt = $('.cnt', it.tile);
      if (cnt) { cnt.textContent = it.left; if (it.left <= 1) cnt.remove(); }
      if (it.left === 0) it.tile.classList.add('gone'); else wobble(it.tile, 'tapped');
      refresh();
      flying++;
      const r = ves.vin.getBoundingClientRect();
      fly(it.tile, [r.left + p.x / 100 * r.width, r.top + p.y / 100 * r.height], pic, () => {
        flying--;
        if (tok !== G.run) return;
        const e = pieceEl(p); e.classList.add('pop'); ves.vin.append(e);
        wobble(ves, 'bump');
        SFX.play(look.s || 'plop');
        if (flying === 0 && items.every(q => q.left === 0)) stepDone(tok);
      });
    }
    items.forEach((it, i) => {
      const look = V[it.v], pic = (it.raw || it.tileRaw) && look.r ? look.r : look.h;
      it.tile = mkTile(pic, it.left);
      it.tile.setAttribute('aria-label', look.n || it.v);
      tappable(it.tile, () => send(it, i, pic));
    });
    refresh();
    hint(() => { const it = items.find((q, i) => q.left > 0 && enabled(i)); return it ? [it.tile, it.tile] : null; });
  };

  /* ---------- RUB: tap, tap, tap to stir with the spoon / roll with the rolling pin ---------- */
  STEPS.rub = (s, tok) => {
    const ves = mkVessel(s.on), TAPS = 5;
    paint(ves);
    const olds = G.pieces.map(p => p.el);
    const outs = (s.out || []).map(mkPiece);
    const news = outs.map(p => { const e = pieceEl(p); e.style.opacity = 0; ves.vin.append(e); return e; });
    const bar = mkBar(), grow = s.fx === 'grow', spin = !grow && s.fx !== 'mix';
    let n = 0, fin = false;
    const tile = mkTile(V[s.tool].h);
    tile.classList.add('next');
    tile.setAttribute('aria-label', V[s.tool].n);
    const tool = el(`<div class="tool-fx ${grow ? 'pin' : 'spoon'}">${V[s.tool].h}</div>`);
    ves.append(tool);
    olds.concat(news).forEach(e => { e.style.transition = 'opacity .4s, scale .4s'; });
    if (spin) ves.vin.style.transition = 'transform .45s ease-out';
    function finish() {
      if (tok !== G.run) return;
      G.pieces = outs;
      olds.forEach(e => e.remove());
      news.forEach(e => { e.style.transition = ''; e.style.opacity = 1; e.style.scale = ''; });
      ves.vin.style.transition = ''; ves.vin.style.transform = ''; // 5 taps x 144 degrees = two full turns
      tool.remove();
      tile.classList.add('gone');
      wobble(ves, 'bump');
      stepDone(tok);
    }
    function tap() {
      if (fin || tok !== G.run) return;
      n++;
      const pr = n / TAPS;
      SFX.play(grow ? 'roll' : 'stir');
      setTimeout(() => SFX.play(grow ? 'roll' : 'stir'), 190);
      tool.classList.add('on');
      wobble(tool, 'go');
      wobble(tile, 'tapped');
      bar.set(pr);
      olds.forEach(e => { e.style.opacity = grow ? clamp(1 - pr * 2.5, 0, 1) : 1 - pr; });
      news.forEach(e => { e.style.opacity = grow ? clamp(pr * 2.5, 0, 1) : pr; if (grow) e.style.scale = 0.42 + 0.58 * pr; });
      if (spin) ves.vin.style.transform = `rotate(${n * 144}deg)`;
      if (n >= TAPS) { fin = true; setTimeout(finish, 520 * FAST); }
    }
    tappable(tile, tap);
    tappable(ves, tap);
    hint(() => (fin ? null : [tile, tile]));
  };

  /* ---------- CHOP: tap, tap, tap with the knife ---------- */
  STEPS.chop = (s, tok) => {
    const ves = mkVessel('board'), bar = mkBar(), TIMES = 4;
    G.pieces = [];
    let k = 0, c = 0, cur = null, bits = null, busy = false;
    const tile = mkTile(V.knife.h);
    tile.classList.add('next');
    tile.setAttribute('aria-label', V.knife.n);
    function load() {
      ves.vin.innerHTML = '';
      const it = s.items[k];
      bits = pieceEl({ v: it.out, w: 96, x: 50, y: 50, z: 1, rot: 0, cook: it.raw ? 0 : 1 });
      cur = pieceEl({ v: it.v, w: 76, x: 50, y: 50, z: 2, rot: 0, cook: 1 });
      bits.style.clipPath = 'inset(0 0 0 100%)';
      cur.classList.add('pop');
      ves.vin.append(bits, cur);
      c = 0; busy = false;
    }
    function chop() {
      if (busy || tok !== G.run) return;
      c++;
      SFX.play('chop');
      wobble(ves, 'chopped');
      wobble(tile, 'tapped');
      const f = c / TIMES;
      cur.style.clipPath = `inset(0 ${f * 100}% 0 0)`;
      bits.style.clipPath = `inset(0 0 0 ${(1 - f) * 100}%)`;
      const line = el(`<i class="cut" style="left:${(1 - f) * 100}%"></i>`);
      const knife = el(`<div class="tool-fx knife" style="left:${clamp((1 - f) * 100, 12, 100)}%">${V.knife.h}</div>`);
      ves.vin.append(line, knife);
      line.addEventListener('animationend', () => line.remove());
      knife.addEventListener('animationend', () => knife.remove());
      bar.set((k * TIMES + c) / (s.items.length * TIMES));
      if (c >= TIMES) {
        busy = true;
        sparkle(ves, 50, 50, 5);
        setTimeout(() => {
          if (tok !== G.run) return;
          k++;
          if (k < s.items.length) load(); else { tile.classList.add('gone'); stepDone(tok); }
        }, 750 * FAST);
      }
    }
    tappable(tile, chop);
    tappable(ves, chop);
    load();
    hint(() => (k < s.items.length ? [tile, tile] : null));
  };

  /* ---------- COOK: tap the heat to turn on the stove, tap the spatula to flip ---------- */
  STEPS.cook = (s, tok) => {
    const ves = mkVessel(s.on), bar = mkBar();
    paint(ves);
    const boil = s.on === 'pot', dur = 4400 * FAST, hiss = boil && !s.fry ? 'boil' : 'sizzle';
    const start = G.pieces.map(p => p.cook);
    let prog = 0, state = 'idle', flipped = false, last = 0, raf = 0, fx = 0, spat = null;
    const fire = mkTile(V.fire.h);
    fire.classList.add('next');
    fire.setAttribute('aria-label', 'Turn on the heat');
    const look = () => (!s.flip ? prog : !flipped ? prog * 0.6 : 0.78 + (prog - 0.5) * 0.44);
    const paintCook = () => { const c = look(); G.pieces.forEach((p, i) => setCook(p, start[i] + (1 - start[i]) * c)); };
    function begin() {
      if (tok !== G.run) return;
      state = 'on';
      ves.classList.add('hot');
      SFX.play('ignite');
      SFX.loop(hiss);
      last = performance.now();
      raf = requestAnimationFrame(tick);
      fx = setInterval(() => { if (state === 'on') puff(ves, boil ? 'bub' : 'steam'); }, boil ? 150 : 300);
    }
    function tick(now) {
      if (tok !== G.run) return;
      const dt = Math.min(100, now - last); last = now;
      if (state === 'on') {
        prog = Math.min(1, prog + dt / dur);
        paintCook(); bar.set(prog);
        if (s.flip && !flipped && prog >= 0.5) { state = 'flip'; askFlip(); }
        else if (prog >= 1) { finish(); return; }
      }
      raf = requestAnimationFrame(tick);
    }
    function askFlip() {
      SFX.stopLoop();
      setSay(LINES.flip);
      spat = mkTile(V.spatula.h);
      spat.classList.add('next', 'pop');
      spat.setAttribute('aria-label', 'Flip');
      tappable(spat, act);
    }
    function doFlip() {
      if (tok !== G.run) return;
      flipped = true;
      SFX.play('flip');
      G.pieces.forEach((p, i) => { p.el.style.animationDelay = i * 70 + 'ms'; wobble(p.el, 'flipping'); });
      setTimeout(() => { if (tok === G.run) paintCook(); }, 260);
      setTimeout(() => { if (tok === G.run) { state = 'on'; last = performance.now(); SFX.loop(hiss); } }, 720);
    }
    function finish() {
      state = 'done';
      clearInterval(fx);
      SFX.stopLoop();
      ves.classList.remove('hot');
      applyResult(s, ves);
      SFX.play('ding');
      wobble(ves, 'bump');
      stepDone(tok);
    }
    // one tap (on the tile or on the stove) does whatever comes next
    function act() {
      if (tok !== G.run) return;
      if (state === 'idle') {
        state = 'lighting';
        SFX.play('pick');
        fire.classList.add('gone');
        fly(fire, mid(ves), V.fire.h, begin);
      } else if (state === 'flip' && spat) {
        state = 'flipping';
        SFX.play('pick');
        spat.classList.add('gone');
        fly(spat, mid(ves), V.spatula.h, doFlip);
      }
    }
    tappable(fire, act);
    tappable(ves, act);
    hint(() => (state === 'idle' ? [fire, fire] : state === 'flip' && spat ? [spat, spat] : null));
    G.cleanup.push(() => { cancelAnimationFrame(raf); clearInterval(fx); });
  };

  /* ---------- BAKE: tap the tray and it slides into the oven ---------- */
  STEPS.bake = (s, tok) => {
    stage.classList.add('baking');
    tray.classList.add('hide');
    const ves = mkVessel(s.on), bar = mkBar();
    ves.classList.add('carry');
    ves.setAttribute('role', 'button');
    ves.setAttribute('tabindex', '0');
    ves.setAttribute('aria-label', 'Put it in the oven');
    paint(ves);
    const oven = el(`<div class="oven open">${OVEN}</div>`);
    stage.append(oven);
    const dur = 4600 * FAST;
    let state = 'idle', raf = 0;

    function goIn() {
      if (state !== 'idle' || tok !== G.run) return;
      state = 'in';
      SFX.play('pick');
      const base = ves.getBoundingClientRect(), o = oven.getBoundingClientRect();
      const dx = o.left + o.width / 2 - (base.left + base.width / 2);
      const dy = o.top + o.height * 0.5 - (base.top + base.height / 2);
      ves.style.transition = 'transform .5s ease-in-out, opacity .25s .42s';
      ves.style.transform = `translate(${dx}px,${dy}px) scale(${(o.width * 0.5) / base.width})`;
      ves.style.opacity = 0;
      SFX.play('whoosh');
      setTimeout(() => {
        if (tok !== G.run) return;
        oven.classList.remove('open');
        SFX.play('door');
        setTimeout(() => {
          if (tok !== G.run) return;
          oven.classList.add('on');
          SFX.loop('oven');
          const t0 = performance.now();
          const tick = (now) => {
            if (tok !== G.run) return;
            const pr = Math.min(1, (now - t0) / dur);
            bar.set(pr);
            if (pr < 1) { raf = requestAnimationFrame(tick); return; }
            SFX.stopLoop();
            SFX.play('ding');
            SFX.play('door');
            oven.classList.remove('on');
            oven.classList.add('open');
            applyResult(s, ves);
            ves.style.transition = 'transform .55s cubic-bezier(.3,1.4,.5,1), opacity .2s';
            ves.style.opacity = 1;
            ves.style.transform = '';
            for (let i = 0; i < 5; i++) setTimeout(() => { if (tok === G.run) puff(ves, 'steam'); }, 300 + i * 160);
            setTimeout(() => stepDone(tok), 620);
          };
          raf = requestAnimationFrame(tick);
        }, 480);
      }, 520);
    }
    tappable(ves, goIn);
    tappable(oven, goIn);
    hint(() => (state === 'idle' ? [ves, ves] : null));
    G.cleanup.push(() => cancelAnimationFrame(raf));
  };

  /* ---------- EAT: tap, tap, tap ---------- */
  STEPS.eat = (s, tok) => {
    stage.classList.add('eating');
    tray.classList.add('hide');
    const ves = mkVessel(s.on || 'plate');
    if (ves.def.side) stage.classList.add('sideview');
    paint(ves);
    ves.classList.add('tada');
    SFX.play('tada');
    sparkle(stage, 50, 45, 10);
    const BITES = [[76, 24], [22, 40], [64, 78]];
    let n = 0;
    tappable(ves, () => {
      if (n > BITES.length || tok !== G.run) return;
      n++;
      SFX.play(G.r.eat || 'munch');
      wobble(ves, 'bump');
      const word = LINES.bites[n - 1] || LINES.bites[0];
      SFX.say(word);
      const yum = el(`<i class="yum" style="top:${rand(10, 34)}%">${word}</i>`);
      stage.append(yum);
      yum.addEventListener('animationend', () => yum.remove());
      if (n <= BITES.length) {
        const R = ves.getBoundingClientRect().width * 0.27;
        const m = BITES.slice(0, n).map(b => `radial-gradient(circle ${R}px at ${b[0]}% ${b[1]}%, transparent 0, transparent 98%, #000 100%)`).join(',');
        ves.food.style.webkitMaskImage = m; ves.food.style.maskImage = m;
        sparkle(ves, BITES[n - 1][0], BITES[n - 1][1], 3);
      } else {
        ves.food.classList.add('eaten');
        clearHint();
        setTimeout(() => SFX.play('gulp'), 260);
        // let the chef finish "All gone!" before the party starts
        const quiet = new Promise(r => { const t = setInterval(() => { if (!SFX.talking()) { clearInterval(t); r(); } }, 80); });
        Promise.all([pause(650 * FAST), FAST < 1 ? null : Promise.race([quiet, pause(2600)])]).then(() => win(tok));
      }
    });
    hint(() => (n <= BITES.length ? [ves, ves] : null));
  };

  /* ---------- You did it! ---------- */
  function win(tok) {
    if (tok !== G.run) return;
    const r = G.r;
    save.stars[r.id] = (save.stars[r.id] || 0) + 1;
    persist();
    $('#winDish').innerHTML = dishPic(r);
    $('#winName').textContent = `You made ${r.name}!`;
    [250, 450, 650].forEach(ms => setTimeout(() => SFX.play('star'), ms));
    const w = $('#win');
    w.hidden = false;
    wobble($('.win-card', w), 'in');
    SFX.play('win');
    SFX.say(LINES.win(r));
    startConfetti();
  }
  let confRaf = 0;
  function stopConfetti() { cancelAnimationFrame(confRaf); confRaf = 0; }
  function startConfetti() {
    stopConfetti();
    const cv = $('#confetti'), r = app.getBoundingClientRect(), dpr = Math.min(2, window.devicePixelRatio || 1);
    cv.width = r.width * dpr; cv.height = r.height * dpr;
    const c = cv.getContext('2d');
    const cols = ['#ff5a4e', '#ffc93c', '#3dccb0', '#5cb8ff', '#9b6bff', '#ff8fb3'];
    const ps = Array.from({ length: 110 }, (_, i) => ({
      x: rand(0, r.width), y: rand(-r.height, 0), vx: rand(-1, 1), vy: rand(2, 5), s: rand(7, 13), a: rand(0, 6.3), va: rand(-0.2, 0.2), c: cols[i % cols.length],
    }));
    const t0 = performance.now();
    const step = (now) => {
      c.setTransform(dpr, 0, 0, dpr, 0, 0);
      c.clearRect(0, 0, r.width, r.height);
      ps.forEach(p => {
        p.x += p.vx; p.y += p.vy; p.a += p.va;
        if (p.y > r.height + 20 && now - t0 < 4500) { p.y = -20; p.x = rand(0, r.width); }
        c.save(); c.translate(p.x, p.y); c.rotate(p.a); c.fillStyle = p.c;
        c.fillRect(-p.s / 2, -p.s / 4, p.s, p.s / 2); c.restore();
      });
      if (now - t0 < 7000) confRaf = requestAnimationFrame(step); else c.clearRect(0, 0, r.width, r.height);
    };
    confRaf = requestAnimationFrame(step);
  }

  // iOS only starts sound from a finished tap, and pauses it when the app goes to the background
  ['pointerup', 'click', 'touchend'].forEach(t => document.addEventListener(t, () => SFX.unlock(), { passive: true }));

  /* ---------- keep iOS from zooming / scrolling the page while playing ---------- */
  ['gesturestart', 'gesturechange', 'dblclick'].forEach(t => document.addEventListener(t, e => e.preventDefault(), { passive: false }));
  document.addEventListener('contextmenu', e => e.preventDefault());
  document.addEventListener('touchmove', e => { if (!e.target.closest || !e.target.closest('#dishes')) e.preventDefault(); }, { passive: false });

  window.__KK = { G, RECIPES, startRecipe, toMenu }; // handy for tests
})();

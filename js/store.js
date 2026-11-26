/* Kids Kitchen — what the game remembers on this phone:
   stars and stickers, the animal friends, badges, and the grown-ups' settings. */
window.STORE = (function () {
  'use strict';
  const KEY = 'kk-save';
  const RECIPES = window.RECIPES || [];

  // cookbook sections: [name, picture, short key]
  const CATS = [['Breakfast', '☀️', 'breakfast'], ['Lunch', '🥪', 'lunch'], ['Dinner', '🍽️', 'dinner'], ['Tex-Mex', '🌮', 'texmex'],
    ['Cajun & Creole', '🦞', 'cajun'], ['Filipino', '🥟', 'filipino'], ['Japanese', '🍣', 'japanese'], ['Thai', '🍛', 'thai'],
    ['Chinese', '🥡', 'chinese'], ['Treats', '🧁', 'treats']];

  // the friends who come to eat. `at` = how many different dishes must be cooked before they visit
  const FRIENDS = [
    { id: 'bear', name: 'Bear', face: '🐻', at: 0 }, { id: 'bunny', name: 'Bunny', face: '🐰', at: 0 },
    { id: 'kitty', name: 'Kitty', face: '🐱', at: 0 }, { id: 'puppy', name: 'Puppy', face: '🐶', at: 0 },
    { id: 'panda', name: 'Panda', face: '🐼', at: 3 }, { id: 'fox', name: 'Fox', face: '🦊', at: 6 },
    { id: 'froggy', name: 'Froggy', face: '🐸', at: 9 }, { id: 'monkey', name: 'Monkey', face: '🐵', at: 12 },
    { id: 'piggy', name: 'Piggy', face: '🐷', at: 16 }, { id: 'lion', name: 'Lion', face: '🦁', at: 20 },
    { id: 'tiger', name: 'Tiger', face: '🐯', at: 24 }, { id: 'koala', name: 'Koala', face: '🐨', at: 28 },
    { id: 'unicorn', name: 'Unicorn', face: '🦄', at: 32 }, { id: 'dragon', name: 'Dragon', face: '🐲', at: 36 },
    { id: 'penguin', name: 'Penguin', face: '🐧', at: 44 }, { id: 'zebra', name: 'Zebra', face: '🦓', at: 52 },
  ];

  const BADGES = [
    { id: 'n1', icon: '🥄', name: 'First dish', need: 1 }, { id: 'n5', icon: '🥉', name: '5 dishes', need: 5 },
    { id: 'n10', icon: '🥈', name: '10 dishes', need: 10 }, { id: 'n20', icon: '🥇', name: '20 dishes', need: 20 },
    { id: 'n40', icon: '💎', name: '40 dishes', need: 40 }, { id: 'all', icon: '🏆', name: 'Every dish', need: RECIPES.length || 56 },
  ].concat(CATS.map(c => ({ id: 'cat-' + c[2], icon: c[1], name: 'All of ' + c[0], cat: c[0] })));

  const blankOpts = () => ({ voice: true, sfx: true, music: true, wash: true, tips: true, crispy: true, hide: {} });
  const blank = () => ({ stars: {}, hearts: {}, order: null, opts: blankOpts() });
  let save = blank();
  try {
    const old = JSON.parse(localStorage.getItem(KEY) || '{}');
    save = Object.assign(save, old, { opts: Object.assign(blankOpts(), old.opts) });
    ['stars', 'hearts'].forEach(k => { if (!save[k] || typeof save[k] !== 'object') save[k] = {}; });
    if (!save.opts.hide || typeof save.opts.hide !== 'object') save.opts.hide = {};
  } catch (e) { /* private mode, or nothing saved yet */ }
  const persist = () => { try { localStorage.setItem(KEY, JSON.stringify(save)); } catch (e) { /* private mode */ } };

  const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
  const dishCount = () => RECIPES.filter(r => save.stars[r.id]).length;
  const friend = (id) => FRIENDS.find(f => f.id === id);
  const friends = () => { const n = dishCount(); return FRIENDS.filter(f => f.at <= n); };
  const catKey = (cat) => (CATS.find(c => c[0] === cat) || [])[2];
  const shown = (r) => !save.opts.hide[catKey(r.cat)];
  const visible = () => { const v = RECIPES.filter(shown); return v.length ? v : RECIPES; };
  const earned = (b) => (b.cat ? RECIPES.filter(r => r.cat === b.cat).every(r => save.stars[r.id]) : dishCount() >= b.need);
  const badges = () => BADGES.filter(earned).map(b => b.id);

  // a friend is always waiting with an order: {f: friend, d: dish}
  function order() {
    const o = save.order, ok = o && friends().some(f => f.id === o.f) && visible().some(r => r.id === o.d);
    if (!ok) {
      const list = visible(), fresh = list.filter(r => !save.stars[r.id]);
      const dishes = (fresh.length && Math.random() < 0.7 ? fresh : list).filter(r => r.id !== save.last);
      save.order = { f: pick(friends()).id, d: pick(dishes.length ? dishes : list).id };
      persist();
    }
    return { friend: friend(save.order.f), dish: RECIPES.find(r => r.id === save.order.d) };
  }
  // who comes to eat this dish: the friend who ordered it, or someone else
  function guestFor(r) {
    const o = order();
    if (o.dish === r) return o.friend;
    const others = friends().filter(f => f !== o.friend);
    return pick(others.length ? others : friends());
  }
  // a dish was cooked and served: returns what is new {first, order, friend, badges}
  function served(r, f) {
    const before = dishCount(), had = badges();
    const first = !save.stars[r.id];
    const isOrder = !!save.order && save.order.d === r.id && save.order.f === f.id;
    save.stars[r.id] = (save.stars[r.id] || 0) + 1;
    save.hearts[f.id] = (save.hearts[f.id] || 0) + (isOrder ? 2 : 1);
    save.last = r.id;
    if (isOrder) save.order = null;
    const now = dishCount();
    persist();
    return {
      first, order: isOrder, hearts: isOrder ? 2 : 1,
      friend: FRIENDS.find(x => x.at > before && x.at <= now) || null,
      badges: BADGES.filter(b => earned(b) && !had.includes(b.id)),
    };
  }
  function reset() { const opts = save.opts; save = blank(); save.opts = opts; persist(); }

  return {
    CATS, FRIENDS, BADGES, persist, reset, dishCount, friend, friends, shown, visible, earned, order, guestFor, served,
    get save() { return save; }, get opts() { return save.opts; },
  };
})();

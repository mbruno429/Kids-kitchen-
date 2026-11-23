/* Kids Kitchen — everything the chef says.
   Each line is recorded ahead of time (see tools/make-voice.py) so the chef sounds warm and
   friendly on every phone. If a recording is missing, the phone's own voice reads the line. */
(function () {
  'use strict';
  const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);
  const L = {
    hello: 'Hi friend! What shall we cook today?',
    flip: 'Flip it over! Flip, flip, flip!',
    eat: 'Yummy! Tap, tap, tap to eat it up!',
    // said when a step is finished
    praise: {
      add: ['Yay! Good job!', 'Wow! You did it!', 'Great job, little chef!', 'Yay, yay, yay! Well done!'],
      spoon: ['Wow! Great stirring!', 'Yay! All mixed up!'],
      pin: ['Wow! Great rolling!', 'Yay! Nice and flat!'],
      chop: ['Chop, chop, chop! Good job!', 'Wow! Great chopping!'],
      cook: ['Ding! All cooked! Good job!', 'Yay! That smells so good!'],
      bake: ['Ding! It is ready! Good job!', 'Wow! That smells so yummy!'],
    },
    // said while eating
    bites: ['Yum, yum, yum!', 'Munch, munch, munch!', 'So yummy!', 'All gone! Delicious!'],
    intro: (r) => `Let's make ${r.sp || r.name.toLowerCase()}!`,
    win: (r) => `Yay! You made ${r.sp || r.name.toLowerCase()}! Good job!`,
    name: (n) => cap(n) + '!',
    // lines used all the time: kept ready so they never lag
    common() {
      return [L.hello, L.flip, L.eat].concat(...Object.values(L.praise), L.bites);
    },
    // every line one recipe needs
    forRecipe(r, V) {
      const out = [L.intro(r), L.win(r)];
      r.steps.forEach((s) => {
        if (s.say) out.push(s.say);
        (s.items || []).forEach((it) => { const v = V[typeof it === 'string' ? it : it.v]; if (v && v.n) out.push(L.name(v.n)); });
      });
      return [...new Set(out)];
    },
    // every line in the whole game (used by the recording script)
    all(RECIPES, V) {
      const out = L.common();
      RECIPES.forEach((r) => out.push(...L.forRecipe(r, V)));
      Object.values(V).forEach((v) => { if (v.n) out.push(L.name(v.n)); });
      return [...new Set(out)];
    },
  };
  window.LINES = L;
})();

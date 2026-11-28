/* Kids Kitchen — everything the chef says.
   Each line is recorded ahead of time (see tools/make-voice.py) so the chef sounds warm and
   friendly on every phone. If a recording is missing, the phone's own voice reads the line. */
(function () {
  'use strict';
  const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);
  const L = {
    hello: 'Hi friend! What shall we cook today?',
    flip: 'Flip it over! Flip, flip, flip!',
    eat: 'Yummy! Tap, tap, tap to feed your friend!',
    // washing hands before cooking
    wash: 'First, wash your hands!',
    scrub: 'Scrub, scrub, scrub!',
    clean: 'All clean! Good job!',
    // kitchen safety, said the first time a recipe uses the stove, the oven or the knife
    tips: {
      stove: 'The stove is hot! Ask a grown-up to help!',
      oven: 'The oven is hot! Ask a grown-up to help!',
      knife: 'Knives are sharp! Ask a grown-up to help!',
    },
    // the food is cooked: time to turn off the heat / take it out
    ready: { cook: 'It is ready! Turn off the heat!', bake: 'Ding! It is ready! Take it out!', cold: 'Brrr! All frozen! Take it out!' },
    hot: 'Uh oh! Too hot!',
    oops: { crispy: 'Oops! A little bit crispy! That is okay!', spill: 'Oops! It bubbled over! That is okay!' },
    // said when a step is finished
    praise: {
      add: ['Yay! Good job!', 'Wow! You did it!', 'Great job, little chef!', 'Yay, yay, yay! Well done!'],
      spoon: ['Wow! Great stirring!', 'Yay! All mixed up!'],
      pin: ['Wow! Great rolling!', 'Yay! Nice and flat!'],
      chop: ['Chop, chop, chop! Good job!', 'Wow! Great chopping!'],
      cook: ['Ding! All cooked! Good job!', 'Yay! That smells so good!'],
      bake: ['Ding! It is ready! Good job!', 'Wow! That smells so yummy!'],
      cold: ['Brrr! So cold! Good job!', 'Wow! Frozen and yummy!'],
    },
    // said while the friend eats
    bites: ['Yum, yum, yum!', 'Munch, munch, munch!', 'So yummy!', 'All gone! Delicious!'],
    // stickers, friends and badges
    sticker: 'You got a new sticker!',
    friend: 'You made a new friend!',
    badge: 'You won a new badge!',
    book: 'This is your sticker book!',
    hungry: (f) => `${f.name} is hungry!`,
    thanks: (f) => `${f.name} says, thank you!`,
    meet: (f) => `Say hello to ${f.name}!`,
    intro: (r) => `Let's make ${r.sp || r.name.toLowerCase()}!`,
    win: (r) => `Yay! You made ${r.sp || r.name.toLowerCase()}! Good job!`,
    name: (n) => cap(n) + '!',
    // the cookbook section buttons: "Breakfast!", "Italian food!"
    section: (cat) => ({ Breakfast: 'Breakfast!', Lunch: 'Lunch!', Dinner: 'Dinner!', Treats: 'Yummy treats!' })[cat] || cap(cat.replace(/ & /g, ' and ')) + ' food!',
    // lines used all the time: kept ready so they never lag
    common() {
      return [L.hello, L.flip, L.eat, L.wash, L.scrub, L.clean, L.hot, L.sticker, L.friend, L.badge, L.name('soap'), L.name('water')]
        .concat(Object.values(L.tips), Object.values(L.ready), Object.values(L.oops), ...Object.values(L.praise), L.bites);
    },
    // every line one recipe needs (and the friend who comes to eat it)
    forRecipe(r, V, f) {
      const out = [L.intro(r), L.win(r)];
      if (f) out.push(L.hungry(f), L.thanks(f));
      r.steps.forEach((s) => {
        if (s.say) out.push(s.say);
        (s.items || []).forEach((it) => { const v = V[typeof it === 'string' ? it : it.v]; if (v && v.n) out.push(L.name(v.n)); });
      });
      return [...new Set(out)];
    },
    // every line in the whole game (used by the recording script)
    all(RECIPES, V, FRIENDS, CATS) {
      const out = L.common().concat(L.book, (CATS || []).map(c => L.section(c[0])));
      RECIPES.forEach((r) => out.push(...L.forRecipe(r, V)));
      Object.values(V).forEach((v) => { if (v.n) out.push(L.name(v.n)); });
      (FRIENDS || []).forEach((f) => { out.push(L.hungry(f), L.thanks(f)); if (f.at > 0) out.push(L.meet(f)); });
      return [...new Set(out)];
    },
  };
  window.LINES = L;
})();

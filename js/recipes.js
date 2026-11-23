/* Kids Kitchen — the cookbook.
   Step types:
     add   tap ingredients and they hop onto a bowl / pot / pan / board / sheet / plate
     rub   tap to stir with a spoon or roll with a rolling pin
     chop  tap to chop with the knife
     cook  tap the heat to turn on the stove (and tap the spatula to flip)
     bake  tap the tray and it slides into the oven
     eat   tap to eat it all up
   Item fields: v picture, n how many, as what it looks like once dropped,
   at where it lands (scatter | center | free | fill | slot | stack), raw = needs cooking,
   w width in %, pos exact spot {x, y, z}.
   Recipe fields: sp = how the chef says the name, eat = the eating sound (crunch | slurp | munch).
   seq: true = strict order, a number = first N in order, 'ends' = first first and last last. */
window.RECIPES = [
  /* ---------------- Breakfast ---------------- */
  {
    id: 'pancakes', sp: 'pancakes', name: 'Pancakes', icon: '🥞', cat: 'Breakfast',
    steps: [
      { t: 'add', on: 'bowl', say: 'Put it all in the bowl!', items: ['flour', { v: 'egg', n: 2 }, 'milk'] },
      { t: 'rub', on: 'bowl', tool: 'spoon', say: 'Stir, stir, stir!', out: [{ v: 'batter', w: 96 }] },
      { t: 'add', on: 'pan', say: 'Pour the batter in the pan!', w: 40, items: [{ v: 'batterBowl', n: 3, as: 'pancake', raw: true }] },
      { t: 'cook', on: 'pan', flip: true, say: 'Turn on the heat!' },
      { t: 'add', on: 'side', seq: true, say: 'Stack them up!', w: 80, items: [{ v: 'pancake', n: 3 }, { v: 'butterPat', w: 80 }, { v: 'syrup', w: 82 }] },
      { t: 'eat', on: 'side' },
    ],
  },
  {
    id: 'waffles', sp: 'waffles', eat: 'crunch', name: 'Waffles', icon: '🧇', cat: 'Breakfast',
    steps: [
      { t: 'add', on: 'bowl', say: 'Put it all in the bowl!', items: ['flour', 'egg', 'milk', 'butter'] },
      { t: 'rub', on: 'bowl', tool: 'spoon', say: 'Stir, stir, stir!', out: [{ v: 'batter', w: 96 }] },
      { t: 'add', on: 'iron', say: 'Pour the batter on the waffle maker!', items: [{ v: 'batterBowl', as: 'waffle', at: 'center', w: 92, raw: true }] },
      { t: 'cook', on: 'iron', say: 'Cook the waffle!' },
      { t: 'add', on: 'plate', seq: 1, say: 'Add yummy toppings!', items: [{ v: 'waffle', at: 'center', w: 78 }, { v: 'syrup', as: 'syrupPool', at: 'center', w: 56 }, { v: 'strawberry', n: 3, at: 'free', w: 24 }, { v: 'blueberry', n: 3, at: 'free', w: 20 }] },
      { t: 'eat', on: 'plate' },
    ],
  },
  {
    id: 'eggs', sp: 'bacon and eggs', name: 'Bacon & Eggs', icon: '🍳', cat: 'Breakfast',
    steps: [
      { t: 'add', on: 'pan', say: 'Crack the eggs! Add the bacon!', w: 40, items: [{ v: 'egg', n: 2 }, { v: 'bacon', n: 2, raw: true }] },
      { t: 'cook', on: 'pan', say: 'Sizzle, sizzle! Turn on the heat!' },
      { t: 'add', on: 'plate', say: 'Put breakfast on the plate!', items: [{ v: 'eggIn', n: 2, at: 'free', w: 38 }, { v: 'bacon', n: 2, at: 'free', w: 40 }, { v: 'toast', at: 'free', w: 40 }] },
      { t: 'eat', on: 'plate' },
    ],
  },

  /* ---------------- Lunch ---------------- */
  {
    id: 'pbj', sp: 'a peanut butter and jelly sandwich', name: 'PB & J', icon: '🥪', cat: 'Lunch',
    steps: [
      { t: 'chop', say: 'Slice the banana!', items: [{ v: 'banana', out: 'bananaCoins' }] },
      { t: 'add', on: 'side', seq: true, say: 'Build your sandwich!', w: 84, items: [{ v: 'slice', tileRaw: true }, 'pb', 'bananaCoins', 'jelly', { v: 'slice', tileRaw: true }] },
      { t: 'eat', on: 'side' },
    ],
  },
  {
    id: 'grilledcheese', sp: 'a grilled cheese sandwich', eat: 'crunch', name: 'Grilled Cheese', icon: '🧀', art: 'grilledCheese', cat: 'Lunch',
    steps: [
      { t: 'add', on: 'pan', seq: true, say: 'Build a sandwich in the pan!', items: [
        { v: 'butter', as: 'butterMelt', at: 'center', w: 84 },
        { v: 'slice', as: 'slice', raw: true, pos: { x: 47, y: 52 }, w: 66 },
        { v: 'cheese', as: 'cheeseSq', n: 2, at: 'center', w: 56 },
        { v: 'slice', as: 'slice', raw: true, pos: { x: 54, y: 47 }, w: 66 }] },
      { t: 'cook', on: 'pan', flip: true, say: 'Cook it until it is golden!', out: [{ v: 'grilledCheese', w: 82 }] },
      { t: 'eat', on: 'plate' },
    ],
  },
  {
    id: 'hotdog', sp: 'a hot dog', name: 'Hot Dog', icon: '🌭', cat: 'Lunch',
    steps: [
      { t: 'add', on: 'pan', say: 'Put the hot dogs in the pan!', w: 66, items: [{ v: 'sausage', n: 2, raw: true }] },
      { t: 'cook', on: 'pan', flip: true, say: 'Cook the hot dogs!' },
      { t: 'add', on: 'plate', seq: 2, say: 'Bun first! Then the toppings!', items: [{ v: 'hotdogBun', at: 'center', w: 90 }, { v: 'sausage', at: 'center', w: 84 }, { v: 'ketchup', pos: { x: 50, y: 47 }, w: 70 }, { v: 'mustard', pos: { x: 50, y: 53 }, w: 70 }] },
      { t: 'eat', on: 'plate' },
    ],
  },
  {
    id: 'mac', sp: 'mac and cheese', eat: 'slurp', name: 'Mac & Cheese', icon: '🧀', art: 'macCheese', cat: 'Lunch',
    steps: [
      { t: 'add', on: 'pot', say: 'Water and noodles in the pot!', w: 44, items: ['water', { v: 'macBox', n: 2 }, 'salt'] },
      { t: 'cook', on: 'pot', say: 'Boil the noodles!', out: [{ v: 'mac', w: 46, x: 34, y: 38 }, { v: 'mac', w: 46, x: 66, y: 44 }, { v: 'mac', w: 46, x: 46, y: 68 }] },
      { t: 'add', on: 'pot', keep: true, say: 'Add cheese, milk and butter!', items: [{ v: 'cheese', n: 2 }, 'milk', 'butter'] },
      { t: 'rub', on: 'pot', tool: 'spoon', say: 'Stir it up!', out: [{ v: 'macCheese', w: 96 }] },
      { t: 'eat', on: 'bowl2' },
    ],
  },
  {
    id: 'soup', sp: 'chicken noodle soup', eat: 'slurp', name: 'Chicken Noodle Soup', icon: '🍲', cat: 'Lunch',
    steps: [
      { t: 'chop', say: 'Chop the veggies!', items: [{ v: 'carrot', out: 'carrotCoins' }, { v: 'onion', out: 'onionBits' }] },
      { t: 'add', on: 'pot', say: 'Everything in the pot!', w: 38, items: ['water', { v: 'chickenRaw', n: 2, raw: true, w: 30 }, 'carrotCoins', 'onionBits', 'noodleBox'] },
      { t: 'cook', on: 'pot', say: 'Cook the soup!', turn: { waterFill: 'broth' } },
      { t: 'eat', on: 'bowl2' },
    ],
  },
  {
    id: 'salad', sp: 'a garden salad', eat: 'crunch', name: 'Garden Salad', icon: '🥗', cat: 'Lunch',
    steps: [
      { t: 'chop', say: 'Chop the veggies!', items: [{ v: 'lettuce', out: 'lettuceBits' }, { v: 'tomato', out: 'tomatoBits' }, { v: 'cucumber', out: 'cucumberSlices' }, { v: 'carrot', out: 'carrotCoins' }] },
      { t: 'add', on: 'bowl', say: 'Fill the salad bowl!', w: 40, items: [{ v: 'lettuceBits', n: 2 }, 'tomatoBits', 'cucumberSlices', 'carrotCoins', 'dressing'] },
      { t: 'rub', on: 'bowl', tool: 'spoon', say: 'Toss the salad!', out: [{ v: 'salad', w: 98 }] },
      { t: 'eat', on: 'bowl' },
    ],
  },

  /* ---------------- Dinner ---------------- */
  {
    id: 'burger', sp: 'a cheeseburger', name: 'Cheeseburger', icon: '🍔', cat: 'Dinner',
    steps: [
      { t: 'add', on: 'pan', say: 'Put the burgers in the pan!', w: 42, items: [{ v: 'patty', n: 2, as: 'patty', raw: true }] },
      { t: 'cook', on: 'pan', flip: true, say: 'Cook the burgers!' },
      { t: 'add', on: 'side', seq: 'ends', say: 'Build your burger!', w: 84, items: ['bunBottom', 'patty', { v: 'cheese', as: 'cheeseSide' }, { v: 'lettuce', as: 'lettuceSide' }, { v: 'tomato', as: 'tomatoSide' }, 'bunTop'] },
      { t: 'eat', on: 'side' },
    ],
  },
  {
    id: 'fries', sp: 'french fries', eat: 'crunch', name: 'French Fries', icon: '🍟', cat: 'Dinner',
    steps: [
      { t: 'chop', say: 'Chop the potatoes!', items: [{ v: 'potato', out: 'fries', raw: true }, { v: 'potato', out: 'fries', raw: true }] },
      { t: 'add', on: 'sheet', say: 'Put the fries on the tray!', w: 44, items: [{ v: 'fries', n: 3, raw: true }, 'oil', 'salt'] },
      { t: 'bake', on: 'sheet', say: 'Bake them in the oven!' },
      { t: 'add', on: 'plate', say: 'Fries and ketchup on the plate!', items: [{ v: 'fries', n: 3, at: 'free', w: 46 }, { v: 'ketchup', as: 'dip', at: 'free', w: 32 }] },
      { t: 'eat', on: 'plate' },
    ],
  },
  {
    id: 'pizza', sp: 'a pizza', name: 'Pizza', icon: '🍕', cat: 'Dinner',
    steps: [
      { t: 'add', on: 'board', say: 'Put the dough on the board!', items: [{ v: 'doughBall', at: 'center', w: 44 }] },
      { t: 'rub', on: 'board', tool: 'pin', fx: 'grow', say: 'Roll, roll, roll the dough!', out: [{ v: 'crust', w: 100, raw: true }] },
      { t: 'add', on: 'board', keep: true, seq: 2, say: 'Sauce, cheese and toppings!', items: [{ v: 'sauce', at: 'center', w: 80 }, { v: 'cheese', as: 'pizzaCheese', at: 'center', w: 76, raw: true }, { v: 'pepperoni', n: 5, at: 'free', w: 18, max: 34 }, { v: 'pepper', n: 3, at: 'free', w: 17, max: 34 }] },
      { t: 'bake', on: 'sheet', say: 'Bake the pizza!' },
      { t: 'eat', on: 'plate' },
    ],
  },
  {
    id: 'spaghetti', sp: 'spaghetti and meatballs', eat: 'slurp', name: 'Spaghetti & Meatballs', icon: '🍝', cat: 'Dinner',
    steps: [
      { t: 'add', on: 'pot', say: 'Water and spaghetti in the pot!', items: ['water', { v: 'spaghettiBox', at: 'center', w: 82 }, 'salt'] },
      { t: 'cook', on: 'pot', say: 'Boil the spaghetti!', out: [{ v: 'noodleNest', w: 92 }] },
      { t: 'add', on: 'pan', say: 'Now the sauce and meatballs!', w: 28, items: [{ v: 'sauce', as: 'sauceFill', at: 'fill' }, { v: 'meatball', n: 4, raw: true }] },
      { t: 'cook', on: 'pan', say: 'Cook the meatballs!' },
      { t: 'add', on: 'plate', seq: 2, say: 'Fill the plate!', items: [{ v: 'noodleNest', at: 'center', w: 88 }, { v: 'sauce', at: 'center', w: 54 }, { v: 'meatball', n: 4, at: 'free', w: 23, max: 26 }, { v: 'cheese', as: 'parm', at: 'center', w: 62 }] },
      { t: 'eat', on: 'plate' },
    ],
  },
  {
    id: 'tacos', sp: 'tacos', eat: 'crunch', name: 'Tacos', icon: '🌮', cat: 'Dinner',
    steps: [
      { t: 'add', on: 'pan', say: 'Put the meat in the pan!', w: 50, items: [{ v: 'beef', n: 2 }, 'spice'] },
      { t: 'cook', on: 'pan', say: 'Cook the meat!' },
      { t: 'chop', say: 'Chop the veggies!', items: [{ v: 'lettuce', out: 'lettuceBits' }, { v: 'tomato', out: 'tomatoBits' }] },
      { t: 'add', on: 'plate', seq: 1, say: 'Fill your taco!', items: [
        { v: 'tacoShell', pos: { x: 50, y: 60, z: 20 }, w: 92 },
        { v: 'groundBeef', as: 'tacoBeef', pos: { x: 50, y: 39, z: 6 }, w: 76 },
        { v: 'lettuceBits', as: 'tacoLettuce', pos: { x: 50, y: 31, z: 3 }, w: 82 },
        { v: 'tomatoBits', as: 'tacoTomato', pos: { x: 50, y: 34, z: 5 }, w: 76 },
        { v: 'cheese', as: 'tacoCheese', pos: { x: 50, y: 41, z: 8 }, w: 76 }] },
      { t: 'eat', on: 'plate' },
    ],
  },
  {
    id: 'nuggets', sp: 'chicken nuggets', eat: 'crunch', name: 'Chicken Nuggets', icon: '🍗', art: 'nugget', cat: 'Dinner',
    steps: [
      { t: 'add', on: 'bowl', say: 'Chicken, egg and crumbs in the bowl!', items: [{ v: 'chickenRaw', n: 3, raw: true }, 'egg', 'crumbs'] },
      { t: 'rub', on: 'bowl', tool: 'spoon', say: 'Mix it all up!', out: [{ v: 'nugget', w: 34, raw: true, x: 32, y: 34 }, { v: 'nugget', w: 34, raw: true, x: 68, y: 36 }, { v: 'nugget', w: 34, raw: true, x: 50, y: 62 }, { v: 'nugget', w: 30, raw: true, x: 26, y: 66 }, { v: 'nugget', w: 30, raw: true, x: 74, y: 68 }] },
      { t: 'add', on: 'sheet', say: 'Put the nuggets on the tray!', w: 30, items: [{ v: 'nugget', n: 5, raw: true }] },
      { t: 'bake', on: 'sheet', say: 'Bake them in the oven!' },
      { t: 'add', on: 'plate', say: 'Nuggets and ketchup on the plate!', items: [{ v: 'nugget', n: 5, at: 'free', w: 28 }, { v: 'ketchup', as: 'dip', at: 'free', w: 30 }] },
      { t: 'eat', on: 'plate' },
    ],
  },
  {
    id: 'corn', sp: 'corn on the cob', eat: 'crunch', name: 'Corn on the Cob', icon: '🌽', cat: 'Dinner',
    steps: [
      { t: 'add', on: 'pot', say: 'Water and corn in the pot!', w: 46, items: ['water', { v: 'corn', n: 3, raw: true }, 'salt'] },
      { t: 'cook', on: 'pot', say: 'Boil the corn!' },
      { t: 'add', on: 'plate', say: 'Corn and butter on the plate!', items: [{ v: 'corn', n: 2, at: 'free', w: 56 }, { v: 'butter', n: 2, at: 'free', w: 22 }, 'salt'] },
      { t: 'eat', on: 'plate' },
    ],
  },
  {
    id: 'potato', sp: 'a baked potato', name: 'Baked Potato', icon: '🥔', cat: 'Dinner',
    steps: [
      { t: 'add', on: 'sheet', say: 'Potatoes on the tray!', w: 46, items: [{ v: 'potato', n: 2 }, 'oil', 'salt'] },
      { t: 'bake', on: 'sheet', say: 'Bake them in the oven!', turn: { potato: 'potatoOpen' } },
      { t: 'add', on: 'plate', seq: 1, say: 'Add your toppings!', items: [{ v: 'potatoOpen', at: 'center', w: 96 }, { v: 'butter', at: 'free', w: 20, max: 22 }, { v: 'cheese', as: 'cheeseShreds', at: 'free', w: 40, max: 20 }, { v: 'bacon', as: 'baconBits', at: 'free', w: 38, max: 20 }, { v: 'sourCream', at: 'free', w: 30, max: 22 }] },
      { t: 'eat', on: 'plate' },
    ],
  },

  /* ---------------- Treats ---------------- */
  {
    id: 'cookies', sp: 'chocolate chip cookies', eat: 'crunch', name: 'Chocolate Chip Cookies', icon: '🍪', cat: 'Treats',
    steps: [
      { t: 'add', on: 'bowl', say: 'Put it all in the bowl!', items: ['flour', 'sugar', 'butter', 'egg', 'chocolate'] },
      { t: 'rub', on: 'bowl', tool: 'spoon', say: 'Stir, stir, stir!', out: [{ v: 'cookieDough', w: 96 }] },
      { t: 'add', on: 'sheet', say: 'Put the cookie dough on the tray!', w: 30, items: [{ v: 'cookie', n: 6, raw: true }] },
      { t: 'bake', on: 'sheet', say: 'Bake the cookies!' },
      { t: 'eat', on: 'plate' },
    ],
  },
  {
    id: 'cupcakes', sp: 'cupcakes', name: 'Cupcakes', icon: '🧁', cat: 'Treats',
    steps: [
      { t: 'add', on: 'bowl', say: 'Put it all in the bowl!', items: ['flour', 'sugar', 'egg', 'milk', 'butter'] },
      { t: 'rub', on: 'bowl', tool: 'spoon', say: 'Stir, stir, stir!', out: [{ v: 'batter', w: 96 }] },
      { t: 'add', on: 'tin', say: 'Fill the cupcake cups!', items: [{ v: 'batterBowl', n: 6, as: 'cupcakeTop', at: 'slot', w: 21, raw: true }] },
      { t: 'bake', on: 'tin', say: 'Bake the cupcakes!' },
      { t: 'add', on: 'side', seq: 1, say: 'Decorate your cupcake!', items: [
        { v: 'cupcake', pos: { x: 50, y: 68, z: 1 }, w: 62 },
        { v: 'frostPink', pos: { x: 50, y: 37, z: 2 }, w: 66 },
        { v: 'frostBlue', pos: { x: 50, y: 37, z: 2 }, w: 66 },
        { v: 'sprinkles', n: 3, at: 'free', w: 26, z: 4, box: [35, 27, 65, 48] },
        { v: 'cherry', pos: { x: 50, y: 8, z: 5 }, w: 24 }] },
      { t: 'eat', on: 'side' },
    ],
  },
  {
    id: 'pie', sp: 'an apple pie', name: 'Apple Pie', icon: '🥧', cat: 'Treats',
    steps: [
      { t: 'chop', say: 'Slice the apples!', items: [{ v: 'apple', out: 'appleSlices' }, { v: 'apple', out: 'appleSlices' }] },
      { t: 'add', on: 'pie', seq: 'ends', say: 'Fill the pie!', w: 40, items: [
        { v: 'doughBall', as: 'pieCrust', at: 'center', w: 104, raw: true },
        { v: 'appleSlices', n: 3 }, 'sugar', 'cinnamon',
        { v: 'lattice', at: 'center', w: 100, raw: true }] },
      { t: 'bake', on: 'pie', say: 'Bake the pie!' },
      { t: 'eat', on: 'plate' },
    ],
  },
];

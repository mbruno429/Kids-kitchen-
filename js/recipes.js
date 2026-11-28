/* Kids Kitchen — the cookbook.
   Step types:
     add   tap ingredients and they hop onto a bowl / pot / pan / board / sheet / plate
     rub   tap to stir with a spoon or roll with a rolling pin
     chop  tap to chop with the knife
     cook  tap the heat to turn on the stove (and tap the spatula to flip); fry: true = frying in a pot of oil
     bake  tap the tray and it slides into the oven
     eat   tap to eat it all up
   Item fields: v picture, n how many, as what it looks like once dropped,
   at where it lands (scatter | center | free | fill | slot | stack), raw = needs cooking,
   w width in %, pos exact spot {x, y, z}, spots a list of exact spots [[x, y], ...] used one after another,
   opt: true = one of the things to choose from (the step says how many with pick: N).
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
      { t: 'add', on: 'plate', seq: 2, pick: 2, say: 'Syrup first! Then pick two toppings!', items: [{ v: 'waffle', at: 'center', w: 78 }, { v: 'syrup', as: 'syrupPool', at: 'center', w: 56 },
        { v: 'strawberry', n: 3, at: 'free', w: 24, opt: true }, { v: 'blueberry', n: 3, at: 'free', w: 20, opt: true }, { v: 'banana', n: 3, as: 'bananaCoin', at: 'free', w: 20, opt: true }] },
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
      { t: 'add', on: 'side', seq: 'ends', pick: 2, say: 'Build your burger! Pick two toppings!', w: 84, items: ['bunBottom', 'patty', { v: 'cheese', as: 'cheeseSide', opt: true }, { v: 'lettuce', as: 'lettuceSide', opt: true }, { v: 'tomato', as: 'tomatoSide', opt: true }, 'bunTop'] },
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
      { t: 'add', on: 'board', keep: true, seq: 2, pick: 2, say: 'Sauce and cheese! Then pick two toppings!', items: [{ v: 'sauce', at: 'center', w: 80 }, { v: 'cheese', as: 'pizzaCheese', at: 'center', w: 76, raw: true },
        { v: 'pepperoni', n: 5, at: 'free', w: 18, max: 34, opt: true }, { v: 'pepper', n: 3, at: 'free', w: 17, max: 34, opt: true },
        { v: 'mushroom', n: 4, at: 'free', w: 17, max: 34, opt: true }, { v: 'pineapple', n: 4, at: 'free', w: 14, max: 34, opt: true }] },
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
      { t: 'add', on: 'plate', seq: 1, pick: 3, say: 'Pick three yummy toppings!', items: [{ v: 'potatoOpen', at: 'center', w: 96 }, { v: 'butter', at: 'free', w: 20, max: 22, opt: true }, { v: 'cheese', as: 'cheeseShreds', at: 'free', w: 40, max: 20, opt: true },
        { v: 'bacon', as: 'baconBits', at: 'free', w: 38, max: 20, opt: true }, { v: 'sourCream', at: 'free', w: 30, max: 22, opt: true }] },
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
      { t: 'add', on: 'side', seq: 1, pick: 1, say: 'Pick your frosting! Then decorate!', items: [
        { v: 'cupcake', pos: { x: 50, y: 68, z: 1 }, w: 62 },
        { v: 'frostPink', pos: { x: 50, y: 37, z: 2 }, w: 66, opt: true },
        { v: 'frostBlue', pos: { x: 50, y: 37, z: 2 }, w: 66, opt: true },
        { v: 'frostChoc', pos: { x: 50, y: 37, z: 2 }, w: 66, opt: true },
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
  {
    id: 'icecream', sp: 'an ice cream cone', name: 'Ice Cream Cone', icon: '🍦', cat: 'Treats',
    steps: [
      { t: 'add', on: 'stand', seq: 1, pick: 2, say: 'Cone first! Then pick two scoops!', items: [
        { v: 'cone', w: 34 },
        { v: 'scoopVanilla', w: 40, opt: true }, { v: 'scoopChoc', w: 40, opt: true }, { v: 'scoopBerry', w: 40, opt: true },
        { v: 'sprinkles', n: 2, at: 'free', w: 20, z: 40, box: [41, 18, 59, 46] },
        { v: 'cherry', pos: { x: 50, y: 6, z: 41 }, w: 16 }] },
      { t: 'eat', on: 'stand' },
    ],
  },
  {
    id: 'icepops', sp: 'ice pops', eat: 'crunch', name: 'Ice Pops', icon: '🧊', art: 'icePops', cat: 'Treats',
    steps: [
      { t: 'add', on: 'bowl', say: 'Strawberries, juice and sugar!', items: [{ v: 'strawberry', n: 3 }, 'juice', 'sugar'] },
      { t: 'rub', on: 'bowl', tool: 'spoon', say: 'Stir, stir, stir!', out: [{ v: 'juiceMix', w: 96 }] },
      { t: 'add', on: 'molds', seq: 1, say: 'Pour the juice! Then add the sticks!', items: [
        { v: 'juiceBowl', n: 4, as: 'popFill', at: 'slot', w: 13, raw: true },
        { v: 'popStick', n: 4, spots: [[20, 77], [40, 77], [60, 77], [80, 77]], w: 4.4 }] },
      { t: 'bake', on: 'molds', cold: true, say: 'Put them in the freezer!', out: [{ v: 'icePop', w: 17, x: 20, y: 50 }, { v: 'icePop', w: 17, x: 40, y: 50 }, { v: 'icePop', w: 17, x: 60, y: 50 }, { v: 'icePop', w: 17, x: 80, y: 50 }] },
      { t: 'eat', on: 'plate' },
    ],
  },
  {
    id: 'milkshake', sp: 'a strawberry milkshake', eat: 'slurp', name: 'Strawberry Milkshake', icon: '🥤', art: 'milkshake', cat: 'Treats',
    steps: [
      { t: 'add', on: 'glass', seq: true, say: 'Fill the glass all the way up!', items: [{ v: 'strawberry', as: 'berryLayer', w: 44 }, { v: 'scoopVanilla', n: 2, w: 40 }, { v: 'milk', as: 'hhMilk', w: 46 }] },
      { t: 'rub', on: 'glass', tool: 'spoon', fx: 'mix', say: 'Mix, mix, mix the milkshake!', out: [{ v: 'shakeMixed', w: 45, x: 50, y: 68.5 }] },
      { t: 'add', on: 'glass', keep: true, seq: true, say: 'Whipped cream and a cherry on top!', items: [{ v: 'whip', pos: { x: 50, y: 33, z: 30 }, w: 42 }, { v: 'cherry', pos: { x: 50, y: 17, z: 31 }, w: 15 }] },
      { t: 'eat', on: 'glass' },
    ],
  },
  {
    id: 'donuts', sp: 'donuts', name: 'Donuts', icon: '🍩', cat: 'Treats',
    steps: [
      { t: 'add', on: 'bowl', say: 'Put it all in the bowl!', items: ['flour', 'sugar', 'egg', 'milk'] },
      { t: 'rub', on: 'bowl', tool: 'spoon', say: 'Stir, stir, stir!', out: [{ v: 'dough', w: 96 }] },
      { t: 'add', on: 'pot', seq: 1, say: 'Oil first! Then the dough!', w: 36, items: [{ v: 'oil', as: 'oilFill', at: 'fill' }, { v: 'doughBall', n: 3, as: 'donut', raw: true }] },
      { t: 'cook', on: 'pot', fry: true, say: 'Fry the donuts!', out: [{ v: 'donut', w: 36, x: 32, y: 34 }, { v: 'donut', w: 36, x: 68, y: 36 }, { v: 'donut', w: 36, x: 50, y: 70 }] },
      { t: 'add', on: 'plate', keep: true, pick: 1, say: 'Pick your frosting! Then add sprinkles!', items: [
        { v: 'frostPink', as: 'glazePink', at: 'center', w: 100, z: 20, opt: true },
        { v: 'frostChoc', as: 'glazeChoc', at: 'center', w: 100, z: 20, opt: true },
        { v: 'frostBlue', as: 'glazeBlue', at: 'center', w: 100, z: 20, opt: true },
        { v: 'sprinkles', n: 3, spots: [[32, 34], [68, 36], [50, 70]], w: 25, z: 30 }] },
      { t: 'eat', on: 'plate' },
    ],
  },
  {
    id: 'brownies', sp: 'brownies', name: 'Brownies', icon: '🍫', art: 'brownies', cat: 'Treats',
    steps: [
      { t: 'add', on: 'bowl', say: 'Put it all in the bowl!', items: ['flour', 'sugar', 'butter', 'egg', 'chocolate'] },
      { t: 'rub', on: 'bowl', tool: 'spoon', say: 'Stir, stir, stir!', out: [{ v: 'brownieBatter', w: 96 }] },
      { t: 'add', on: 'sheet', say: 'Pour the batter on the tray!', items: [{ v: 'chocBowl', as: 'brownieSlab', at: 'center', w: 94, raw: true }] },
      { t: 'bake', on: 'sheet', say: 'Bake the brownies!', out: [{ v: 'brownie', w: 36, x: 30, y: 30 }, { v: 'brownie', w: 36, x: 70, y: 30 }, { v: 'brownie', w: 36, x: 30, y: 70 }, { v: 'brownie', w: 36, x: 70, y: 70 }] },
      { t: 'add', on: 'plate', keep: true, say: 'Lots of powdered sugar on top!', items: [{ v: 'powderSugar', n: 2 }] },
      { t: 'eat', on: 'plate' },
    ],
  },

  /* ---------------- Tex-Mex ---------------- */
  {
    id: 'quesadilla', sp: 'a quesadilla', eat: 'crunch', name: 'Quesadilla', icon: '🫓', art: 'quesadilla', cat: 'Tex-Mex',
    steps: [
      { t: 'add', on: 'pan', seq: true, say: 'Tortilla, cheese, tortilla!', items: [
        { v: 'tortilla', at: 'center', w: 92, raw: true },
        { v: 'cheese', as: 'pizzaCheese', at: 'center', w: 76, raw: true },
        { v: 'tortilla', pos: { x: 52, y: 48 }, w: 92, raw: true }] },
      { t: 'cook', on: 'pan', flip: true, say: 'Cook it until it is crispy!', out: [{ v: 'quesadilla', w: 96 }] },
      { t: 'add', on: 'plate', seq: 1, say: 'Add salsa and guacamole!', items: [{ v: 'quesadilla', at: 'center', w: 86 }, { v: 'salsa', at: 'free', w: 26, max: 30 }, { v: 'guac', at: 'free', w: 26, max: 30 }] },
      { t: 'eat', on: 'plate' },
    ],
  },
  {
    id: 'nachos', sp: 'nachos', eat: 'crunch', name: 'Nachos', icon: '🧀', art: 'nachos', cat: 'Tex-Mex',
    steps: [
      { t: 'add', on: 'sheet', seq: 1, say: 'Chips, beans and lots of cheese!', w: 46, items: [{ v: 'chipBag', n: 3 }, { v: 'beans', w: 40 }, { v: 'cheese', as: 'pizzaCheese', at: 'center', w: 56, raw: true }, { v: 'jalapeno', n: 2, at: 'free', w: 26 }] },
      { t: 'bake', on: 'sheet', say: 'Melt the cheese in the oven!' },
      { t: 'add', on: 'plate', keep: true, pick: 2, say: 'Pick two yummy toppings!', items: [{ v: 'salsa', at: 'free', w: 26, opt: true }, { v: 'guac', at: 'free', w: 26, opt: true }, { v: 'sourCream', at: 'free', w: 26, opt: true }] },
      { t: 'eat', on: 'plate' },
    ],
  },
  {
    id: 'enchiladas', sp: 'cheese enchiladas', name: 'Cheese Enchiladas', icon: '🌯', art: 'enchiladas', cat: 'Tex-Mex',
    steps: [
      { t: 'chop', say: 'Chop the onion!', items: [{ v: 'onion', out: 'onionBits' }] },
      { t: 'add', on: 'sheet', seq: true, say: 'Roll them up! Then sauce and cheese!', items: [
        { v: 'tortilla', as: 'enchilada', n: 3, spots: [[50, 26], [50, 50], [50, 74]], w: 84 },
        { v: 'chiliSauce', at: 'center', w: 64 },
        { v: 'cheese', as: 'pizzaCheese', at: 'center', w: 50, raw: true },
        { v: 'onionBits', at: 'center', w: 40 }] },
      { t: 'bake', on: 'sheet', say: 'Bake the enchiladas!' },
      { t: 'eat', on: 'plate' },
    ],
  },
  {
    id: 'fajitas', sp: 'fajitas', name: 'Fajitas', icon: '🌯', art: 'fajitaMix', cat: 'Tex-Mex',
    steps: [
      { t: 'chop', say: 'Slice the pepper and the onion!', items: [{ v: 'pepper', out: 'pepperStrips' }, { v: 'onion', out: 'onionBits' }] },
      { t: 'add', on: 'pan', say: 'Everything in the hot pan!', w: 44, items: [{ v: 'steak', n: 2 }, 'pepperStrips', 'onionBits', 'chiliSpice'] },
      { t: 'cook', on: 'pan', say: 'Sizzle, sizzle! Cook the fajitas!', out: [{ v: 'fajitaMix', w: 96 }] },
      { t: 'add', on: 'plate', seq: 2, say: 'Fill your tortilla!', items: [{ v: 'tortilla', at: 'center', w: 98 }, { v: 'fajitaMix', at: 'center', w: 64 }, { v: 'guac', at: 'free', w: 24, max: 24 }, { v: 'sourCream', at: 'free', w: 24, max: 24 }] },
      { t: 'eat', on: 'plate' },
    ],
  },
  {
    id: 'chili', sp: 'chili', name: 'Chili', icon: '🌶️', art: 'chili', cat: 'Tex-Mex',
    steps: [
      { t: 'chop', say: 'Chop the onion!', items: [{ v: 'onion', out: 'onionBits' }] },
      { t: 'add', on: 'pot', say: 'Everything in the pot!', w: 42, items: [{ v: 'sauce', as: 'sauceFill', at: 'fill' }, { v: 'beef', n: 2 }, 'onionBits', 'beans', 'chiliSpice'] },
      { t: 'cook', on: 'pot', say: 'Cook the chili!' },
      { t: 'rub', on: 'pot', tool: 'spoon', say: 'Stir the chili!', out: [{ v: 'chili', w: 96 }] },
      { t: 'add', on: 'bowl2', keep: true, say: 'Cheese on top!', items: [{ v: 'cheese', as: 'cheeseShreds', at: 'center', w: 50 }] },
      { t: 'eat', on: 'bowl2' },
    ],
  },

  /* ---------------- Cajun & Creole (Breaux Bridge, Louisiana: the crawfish capital) ---------------- */
  {
    id: 'etouffee', sp: 'crawfish étouffée', name: 'Crawfish Étouffée', icon: '🦞', art: 'etouffee', cat: 'Cajun & Creole',
    steps: [
      { t: 'chop', say: 'Chop the onion, pepper and celery!', items: [{ v: 'onion', out: 'onionBits' }, { v: 'pepper', out: 'pepperBits' }, { v: 'celery', out: 'celeryBits' }] },
      { t: 'add', on: 'pan', say: 'Everything in the pan!', w: 36, items: [{ v: 'butter', as: 'butterMelt', at: 'center', w: 86 }, 'onionBits', 'pepperBits', 'celeryBits', { v: 'crawfish', n: 3, raw: true }, 'cajun'] },
      { t: 'cook', on: 'pan', say: 'Cook the étouffée!', out: [{ v: 'etouffee', w: 96 }] },
      { t: 'add', on: 'bowl2', seq: true, say: 'Rice first! Then the étouffée!', items: [{ v: 'rice', at: 'center', w: 88 }, { v: 'etouffee', at: 'center', w: 62 }] },
      { t: 'eat', on: 'bowl2' },
    ],
  },
  {
    id: 'crawfishboil', sp: 'a crawfish boil', name: 'Crawfish Boil', icon: '🦞', cat: 'Cajun & Creole',
    steps: [
      { t: 'add', on: 'pot', say: 'Everything in the big pot!', w: 36, items: ['water', { v: 'crawfish', n: 3, raw: true }, { v: 'corn', n: 2, raw: true, w: 40 }, { v: 'potato', n: 2, w: 30 }, 'cajun', { v: 'lemon', w: 26 }] },
      { t: 'cook', on: 'pot', say: 'Boil, boil, boil!' },
      { t: 'add', on: 'sheet', say: 'Pour it all out! Time to eat!', items: [{ v: 'crawfish', n: 3, at: 'free', w: 36 }, { v: 'corn', n: 2, at: 'free', w: 40 }, { v: 'potato', n: 2, at: 'free', w: 30 }, { v: 'lemon', at: 'free', w: 24 }] },
      { t: 'eat', on: 'sheet' },
    ],
  },
  {
    id: 'gumbo', sp: 'gumbo', eat: 'slurp', name: 'Gumbo', icon: '🍲', art: 'gumbo', cat: 'Cajun & Creole',
    steps: [
      { t: 'add', on: 'pot', say: 'Oil and flour in the pot!', items: ['oil', 'flour'] },
      { t: 'rub', on: 'pot', tool: 'spoon', say: 'Stir, stir, stir the roux!', out: [{ v: 'roux', w: 92, raw: true }] },
      { t: 'cook', on: 'pot', fry: true, say: 'Cook the roux until it is brown!' },
      { t: 'add', on: 'pot', keep: true, say: 'Now add everything else!', w: 30, items: ['water', { v: 'chickenRaw', n: 2, raw: true, w: 28 }, { v: 'andouille', n: 2 }, { v: 'trinity', w: 40 }] },
      { t: 'cook', on: 'pot', say: 'Cook the gumbo!', out: [{ v: 'gumboFill', w: 100, z: 1 }, { v: 'chickenRaw', w: 26, x: 30, y: 36 }, { v: 'chickenRaw', w: 26, x: 68, y: 66 }, { v: 'sausageCoins', w: 34, x: 66, y: 32 }, { v: 'sausageCoins', w: 34, x: 32, y: 68 }, { v: 'trinity', w: 44, x: 50, y: 50 }] },
      { t: 'add', on: 'bowl2', keep: true, say: 'A scoop of rice on top!', items: [{ v: 'rice', at: 'center', w: 42 }] },
      { t: 'eat', on: 'bowl2' },
    ],
  },
  {
    id: 'jambalaya', sp: 'jambalaya', name: 'Jambalaya', icon: '🥘', art: 'jambalaya', cat: 'Cajun & Creole',
    steps: [
      { t: 'chop', say: 'Chop the veggies!', items: [{ v: 'onion', out: 'onionBits' }, { v: 'pepper', out: 'pepperBits' }] },
      { t: 'add', on: 'pot', say: 'Everything in the pot!', w: 30, items: [{ v: 'sauce', as: 'sauceFill', at: 'fill' }, { v: 'andouille', n: 2 }, { v: 'chickenRaw', n: 2, raw: true, w: 28 }, { v: 'onionBits', w: 36 }, { v: 'pepperBits', w: 36 }, { v: 'rice', as: 'riceGrains', at: 'center', w: 84 }] },
      { t: 'cook', on: 'pot', say: 'Cook the jambalaya!' },
      { t: 'rub', on: 'pot', tool: 'spoon', say: 'Stir it up!', out: [{ v: 'jambalaya', w: 96 }] },
      { t: 'eat', on: 'bowl2' },
    ],
  },
  {
    id: 'beignets', sp: 'beignets', name: 'Beignets', icon: '🍩', art: 'beignetPlate', cat: 'Cajun & Creole',
    steps: [
      { t: 'add', on: 'bowl', say: 'Put it all in the bowl!', items: ['flour', 'sugar', 'egg', 'milk'] },
      { t: 'rub', on: 'bowl', tool: 'spoon', say: 'Stir, stir, stir!', out: [{ v: 'dough', w: 96 }] },
      { t: 'add', on: 'pot', seq: 1, say: 'Oil first! Then the dough!', w: 32, items: [{ v: 'oil', as: 'oilFill', at: 'fill' }, { v: 'doughBall', n: 4, as: 'beignet', raw: true }] },
      { t: 'cook', on: 'pot', fry: true, say: 'Fry the beignets!', out: [{ v: 'beignet', w: 36, x: 32, y: 32, rot: -8 }, { v: 'beignet', w: 36, x: 68, y: 34, rot: 10 }, { v: 'beignet', w: 36, x: 34, y: 68, rot: 6 }, { v: 'beignet', w: 36, x: 68, y: 68, rot: -12 }] },
      { t: 'add', on: 'plate', keep: true, say: 'Lots of powdered sugar on top!', items: [{ v: 'powderSugar', n: 2 }] },
      { t: 'eat', on: 'plate' },
    ],
  },

  /* ---------------- Filipino ---------------- */
  {
    id: 'lumpia', sp: 'lumpia', eat: 'crunch', name: 'Lumpia', icon: '🥟', art: 'lumpiaPlate', cat: 'Filipino',
    steps: [
      { t: 'add', on: 'bowl', say: 'Put the filling in the bowl!', w: 36, items: [{ v: 'pork', n: 2, as: 'groundBeef', raw: true, w: 40 }, 'carrot', 'onion', 'egg'] },
      { t: 'rub', on: 'bowl', tool: 'spoon', say: 'Mix it all up!', out: [{ v: 'porkMix', w: 94 }] },
      { t: 'add', on: 'board', seq: true, say: 'Wrapper first! Then the filling!', items: [{ v: 'wrapper', at: 'center', w: 96 }, { v: 'porkMix', at: 'center', w: 66 }] },
      { t: 'rub', on: 'board', tool: 'hands', say: 'Roll, roll, roll the lumpia!', out: [{ v: 'lumpia', w: 76, x: 50, y: 28, raw: true }, { v: 'lumpia', w: 76, x: 50, y: 50, raw: true }, { v: 'lumpia', w: 76, x: 50, y: 72, raw: true }] },
      { t: 'add', on: 'pot', seq: 1, say: 'Oil first! Then the lumpia!', w: 62, items: [{ v: 'oil', as: 'oilFill', at: 'fill' }, { v: 'lumpia', n: 3, raw: true, spots: [[50, 28], [50, 50], [50, 72]] }] },
      { t: 'cook', on: 'pot', fry: true, say: 'Fry the lumpia!', out: [{ v: 'lumpia', w: 62, x: 42, y: 26, rot: -6 }, { v: 'lumpia', w: 62, x: 42, y: 46, rot: 4 }, { v: 'lumpia', w: 62, x: 42, y: 66, rot: -3 }, { v: 'sweetChili', w: 30, x: 76, y: 76 }] },
      { t: 'eat', on: 'plate' },
    ],
  },
  {
    id: 'sopas', sp: 'sopas', eat: 'slurp', name: 'Sopas', icon: '🍲', art: 'sopas', cat: 'Filipino',
    steps: [
      { t: 'chop', say: 'Chop the veggies!', items: [{ v: 'carrot', out: 'carrotCoins' }, { v: 'cabbage', out: 'cabbageBits' }] },
      { t: 'add', on: 'pot', say: 'Everything in the pot!', w: 36, items: ['water', { v: 'chickenRaw', n: 2, raw: true, w: 28 }, { v: 'macBox', w: 44 }, 'carrotCoins', 'cabbageBits'] },
      { t: 'cook', on: 'pot', say: 'Cook the soup!', turn: { waterFill: 'broth' } },
      { t: 'add', on: 'pot', keep: true, say: 'Now pour in the milk!', items: [{ v: 'milk', at: 'center', w: 70 }] },
      { t: 'rub', on: 'pot', tool: 'spoon', say: 'Stir it up!', out: [{ v: 'sopas', w: 100 }] },
      { t: 'eat', on: 'bowl2' },
    ],
  },
  {
    id: 'sinigang', sp: 'sinigang', eat: 'slurp', name: 'Sinigang', icon: '🍲', art: 'sinigang', cat: 'Filipino',
    steps: [
      { t: 'chop', say: 'Chop the veggies!', items: [{ v: 'tomato', out: 'tomatoBits' }, { v: 'radish', out: 'radishCoins' }] },
      { t: 'add', on: 'pot', say: 'Everything in the pot!', w: 34, items: ['water', { v: 'pork', n: 2, raw: true, w: 30 }, 'tomatoBits', 'radishCoins', 'greens', { v: 'tamarind', w: 30 }] },
      { t: 'cook', on: 'pot', say: 'Cook the sinigang! So sour and yummy!', turn: { waterFill: 'sinigangBroth' } },
      { t: 'eat', on: 'bowl2' },
    ],
  },
  {
    id: 'adobo', sp: 'chicken adobo', name: 'Chicken Adobo', icon: '🍗', art: 'adoboPlate', cat: 'Filipino',
    steps: [
      { t: 'add', on: 'pot', say: 'Chicken, soy sauce and vinegar!', w: 34, items: [{ v: 'chickenRaw', n: 3, as: 'adoboChicken', raw: true }, { v: 'soy', as: 'soyFill', at: 'fill' }, 'vinegar', { v: 'garlic', n: 2, w: 22 }, { v: 'bayLeaf', w: 24 }] },
      { t: 'cook', on: 'pot', say: 'Cook the adobo!' },
      { t: 'add', on: 'plate', seq: 1, say: 'Rice and chicken on the plate!', items: [{ v: 'rice', pos: { x: 34, y: 50 }, w: 58 }, { v: 'adoboChicken', n: 3, spots: [[68, 30], [74, 54], [62, 76]], w: 30 }] },
      { t: 'eat', on: 'plate' },
    ],
  },
  {
    id: 'pancit', sp: 'pancit', eat: 'slurp', name: 'Pancit', icon: '🍜', art: 'pancit', cat: 'Filipino',
    steps: [
      { t: 'chop', say: 'Chop the veggies!', items: [{ v: 'carrot', out: 'carrotCoins' }, { v: 'cabbage', out: 'cabbageBits' }] },
      { t: 'add', on: 'pan', say: 'Everything in the pan!', w: 38, items: [{ v: 'noodleBox', w: 50 }, { v: 'shrimp', n: 2, raw: true, w: 28 }, 'carrotCoins', 'cabbageBits', 'soy'] },
      { t: 'cook', on: 'pan', say: 'Cook the pancit!', out: [{ v: 'pancit', w: 96 }] },
      { t: 'add', on: 'plate', seq: 1, say: 'Add a squeeze of lemon!', items: [{ v: 'pancit', at: 'center', w: 90 }, { v: 'lemon', n: 2, at: 'free', w: 22, max: 34 }] },
      { t: 'eat', on: 'plate' },
    ],
  },
  {
    id: 'halohalo', sp: 'halo-halo', eat: 'slurp', name: 'Halo-Halo', icon: '🍧', cat: 'Filipino',
    steps: [
      { t: 'add', on: 'glass', seq: true, say: 'Fill the glass all the way up!', w: 44, items: ['sweetBeans', 'gulaman', 'ice', { v: 'milk', as: 'hhMilk', w: 46 }, { v: 'ube', w: 40 }, { v: 'flan', w: 24 }] },
      { t: 'rub', on: 'glass', tool: 'spoon', fx: 'mix', say: 'Mix, mix, mix! Halo-halo!', out: [{ v: 'haloMixed', w: 45, x: 50, y: 68.5 }] },
      { t: 'eat', on: 'glass' },
    ],
  },

  /* ---------------- Japanese ---------------- */
  {
    id: 'sushi', sp: 'sushi rolls', name: 'Sushi Rolls', icon: '🍣', cat: 'Japanese',
    steps: [
      { t: 'chop', say: 'Slice the cucumber and the avocado!', items: [{ v: 'cucumber', out: 'cucumberSticks' }, { v: 'avocado', out: 'avocadoSlices' }] },
      { t: 'add', on: 'board', seq: 2, say: 'Seaweed, rice, then the filling!', items: [
        { v: 'nori', at: 'center', w: 98 }, { v: 'rice', as: 'riceLayer', at: 'center', w: 86 },
        { v: 'salmon', at: 'center', w: 62 }, { v: 'cucumberSticks', at: 'center', w: 60 }, { v: 'avocadoSlices', at: 'center', w: 56 }] },
      { t: 'rub', on: 'board', tool: 'hands', say: 'Roll, roll, roll the sushi!', out: [{ v: 'maki', w: 25, x: 80, y: 50 }, { v: 'maki', w: 25, x: 65, y: 76 }, { v: 'maki', w: 25, x: 35, y: 76 }, { v: 'maki', w: 25, x: 20, y: 50 }, { v: 'maki', w: 25, x: 35, y: 24 }, { v: 'maki', w: 25, x: 65, y: 24 }] },
      { t: 'add', on: 'plate', keep: true, say: 'Soy sauce for dipping!', items: [{ v: 'soy', as: 'soyDip', pos: { x: 50, y: 50 }, w: 28 }] },
      { t: 'eat', on: 'plate' },
    ],
  },
  {
    id: 'onigiri', sp: 'onigiri rice balls', name: 'Onigiri', icon: '🍙', cat: 'Japanese',
    steps: [
      { t: 'add', on: 'bowl', say: 'Rice and salt in the bowl!', items: [{ v: 'rice', n: 2, as: 'riceMound', w: 48 }, 'salt'] },
      { t: 'rub', on: 'bowl', tool: 'hands', say: 'Squish, squish! Make rice balls!', out: [{ v: 'onigiri', w: 38, x: 30, y: 34 }, { v: 'onigiri', w: 38, x: 70, y: 34 }, { v: 'onigiri', w: 38, x: 50, y: 70 }] },
      { t: 'add', on: 'plate', keep: true, say: 'Wrap them in seaweed!', items: [{ v: 'nori', as: 'noriStrip', n: 3, spots: [[30, 43], [70, 43], [50, 79]], w: 19 }] },
      { t: 'eat', on: 'plate' },
    ],
  },
  {
    id: 'ramen', sp: 'ramen', eat: 'slurp', name: 'Ramen', icon: '🍜', cat: 'Japanese',
    steps: [
      { t: 'chop', say: 'Chop the green onion!', items: [{ v: 'scallion', out: 'scallionBits' }] },
      { t: 'add', on: 'pot', say: 'Water, noodles and soy sauce!', w: 44, items: ['water', { v: 'noodleBox', n: 2 }, 'soy'] },
      { t: 'cook', on: 'pot', say: 'Boil the noodles!', out: [{ v: 'ramenBroth', w: 100, z: 1 }, { v: 'ramenNoodles', w: 84 }] },
      { t: 'add', on: 'bowl2', keep: true, say: 'Add the yummy toppings!', items: [
        { v: 'egg', n: 2, as: 'eggHalf', at: 'free', w: 24, max: 30 }, { v: 'fishCake', n: 2, at: 'free', w: 22, max: 30 }, { v: 'scallionBits', at: 'center', w: 46 }] },
      { t: 'eat', on: 'bowl2' },
    ],
  },
  {
    id: 'tempura', sp: 'tempura', eat: 'crunch', name: 'Tempura', icon: '🍤', cat: 'Japanese',
    steps: [
      { t: 'add', on: 'bowl', say: 'Make the batter!', items: ['flour', 'egg', 'water'] },
      { t: 'rub', on: 'bowl', tool: 'spoon', say: 'Stir, stir, stir!', out: [{ v: 'batter', w: 96 }] },
      { t: 'add', on: 'pot', seq: 1, say: 'Oil first! Then shrimp and broccoli!', items: [{ v: 'oil', as: 'oilFill', at: 'fill' }, { v: 'shrimp', n: 3, as: 'tempuraShrimp', raw: true, w: 46 }, { v: 'broccoli', n: 2, as: 'tempuraVeg', raw: true, w: 28 }] },
      { t: 'cook', on: 'pot', fry: true, say: 'Fry the tempura!', out: [{ v: 'tempuraShrimp', w: 56, x: 38, y: 28, rot: -8 }, { v: 'tempuraShrimp', w: 56, x: 40, y: 50, rot: 5 }, { v: 'tempuraShrimp', w: 56, x: 38, y: 72, rot: -4 },
        { v: 'tempuraVeg', w: 24, x: 80, y: 34 }, { v: 'tempuraVeg', w: 24, x: 82, y: 56 }, { v: 'tempuraDip', w: 26, x: 74, y: 79 }] },
      { t: 'eat', on: 'plate' },
    ],
  },
  {
    id: 'bento', sp: 'a bento box', name: 'Bento Box', icon: '🍱', cat: 'Japanese',
    steps: [
      { t: 'add', on: 'pan', say: 'Chicken and teriyaki sauce!', w: 36, items: [{ v: 'teriyaki', at: 'center', w: 84, z: 2 }, { v: 'chickenRaw', n: 3, as: 'teriyakiChicken', raw: true }] },
      { t: 'cook', on: 'pan', flip: true, say: 'Cook the chicken!' },
      { t: 'add', on: 'bento', say: 'Fill the lunch box!', items: [
        { v: 'rice', as: 'riceMound', pos: { x: 30, y: 50 }, w: 41 },
        { v: 'teriyakiChicken', n: 3, spots: [[63, 25], [81, 26], [72, 39]], w: 17 },
        { v: 'broccoli', n: 2, spots: [[63, 62], [64, 77]], w: 15 },
        { v: 'tamago', n: 2, spots: [[81, 62], [81, 77]], w: 15 }] },
      { t: 'eat', on: 'bento' },
    ],
  },
  {
    id: 'miso', sp: 'miso soup', eat: 'slurp', name: 'Miso Soup', icon: '🍲', art: 'misoSoup', cat: 'Japanese',
    steps: [
      { t: 'chop', say: 'Chop the tofu and the green onion!', items: [{ v: 'tofu', out: 'tofuCubes' }, { v: 'scallion', out: 'scallionBits' }] },
      { t: 'add', on: 'pot', say: 'Everything in the pot!', w: 38, items: ['water', 'miso', 'tofuCubes', { v: 'nori', as: 'wakame' }, 'scallionBits'] },
      { t: 'cook', on: 'pot', say: 'Cook the miso soup!', out: [{ v: 'misoSoup', w: 100, z: 1 }] },
      { t: 'eat', on: 'bowl2' },
    ],
  },
  {
    id: 'omurice', sp: 'omurice', name: 'Omurice', icon: '🍳', art: 'omurice', cat: 'Japanese',
    steps: [
      { t: 'add', on: 'pan', say: 'Everything in the pan!', w: 36, items: [{ v: 'rice', as: 'riceGrains', at: 'center', w: 84 }, { v: 'chickenRaw', n: 2, raw: true, w: 28 }, 'peas', { v: 'ketchup', as: 'squiggleRed', at: 'center', w: 70 }] },
      { t: 'cook', on: 'pan', say: 'Cook the rice!', out: [{ v: 'ketchupRice', w: 96 }] },
      { t: 'add', on: 'pan', say: 'Crack in the eggs!', items: [{ v: 'egg', n: 2, as: 'omuEgg', at: 'center', w: 88, raw: true }] },
      { t: 'cook', on: 'pan', say: 'Turn on the heat!' },
      { t: 'add', on: 'plate', seq: true, say: 'Rice, then the egg, then a ketchup heart!', items: [
        { v: 'ketchupRice', as: 'omuRice', at: 'center', w: 84 }, { v: 'omuEgg', as: 'omuBlanket', at: 'center', w: 74 }, { v: 'ketchup', as: 'ketchupHeart', pos: { x: 50, y: 50 }, w: 32 }] },
      { t: 'eat', on: 'plate' },
    ],
  },
  {
    id: 'mochi', sp: 'mochi', name: 'Mochi', icon: '🍡', art: 'mochiPlate', cat: 'Japanese',
    steps: [
      { t: 'add', on: 'bowl', say: 'Put it all in the bowl!', items: ['riceFlour', 'sugar', 'water'] },
      { t: 'rub', on: 'bowl', tool: 'spoon', say: 'Stir, stir, stir!', out: [{ v: 'mochiDough', w: 96, raw: true }] },
      { t: 'cook', on: 'steamer', say: 'Steam the mochi!' },
      { t: 'rub', on: 'board', tool: 'hands', say: 'Squish and roll the mochi!', out: [[21, 32], [50, 32], [79, 32], [21, 68], [50, 68], [79, 68]].map(p => ({ v: 'mochiWhite', w: 27, x: p[0], y: p[1] })) },
      { t: 'add', on: 'board', keep: true, pick: 2, say: 'Pick two colors!', items: [
        { v: 'mochiPink', n: 2, spots: [[21, 32], [79, 68]], w: 27, opt: true },
        { v: 'mochiGreen', n: 2, spots: [[50, 32], [21, 68]], w: 27, opt: true },
        { v: 'mochiYellow', n: 2, spots: [[79, 32], [50, 68]], w: 27, opt: true }] },
      { t: 'eat', on: 'plate' },
    ],
  },

  /* ---------------- Thai ---------------- */
  {
    id: 'padthai', sp: 'pad thai', eat: 'slurp', name: 'Pad Thai', icon: '🍜', art: 'padThai', cat: 'Thai',
    steps: [
      { t: 'chop', say: 'Chop the green onion!', items: [{ v: 'scallion', out: 'scallionBits' }] },
      { t: 'add', on: 'pan', say: 'Everything in the pan!', w: 38, items: [{ v: 'noodleBox', w: 50 }, { v: 'shrimp', n: 2, raw: true, w: 28 }, 'egg', 'scallionBits', 'padThaiSauce'] },
      { t: 'cook', on: 'pan', say: 'Cook the pad thai!', out: [{ v: 'padThai', w: 96 }] },
      { t: 'add', on: 'plate', seq: 1, say: 'Peanuts and lime on top!', items: [{ v: 'padThai', at: 'center', w: 90 }, 'peanuts', { v: 'lime', n: 2, at: 'free', w: 22, max: 34 }] },
      { t: 'eat', on: 'plate' },
    ],
  },
  {
    id: 'greencurry', sp: 'green curry', name: 'Green Curry', icon: '🍛', art: 'greenCurry', cat: 'Thai',
    steps: [
      { t: 'chop', say: 'Chop the veggies!', items: [{ v: 'eggplant', out: 'eggplantCoins' }, { v: 'pepper', out: 'pepperStrips' }] },
      { t: 'add', on: 'pot', say: 'Everything in the pot!', w: 34, items: ['coconut', 'curryPaste', { v: 'chickenRaw', n: 2, raw: true, w: 28 }, 'eggplantCoins', 'pepperStrips', { v: 'basil', w: 24 }] },
      { t: 'cook', on: 'pot', say: 'Cook the curry!', out: [{ v: 'greenCurryFill', w: 100, z: 1 }, { v: 'chickenRaw', w: 28, x: 30, y: 36 }, { v: 'chickenRaw', w: 28, x: 68, y: 64 }, { v: 'eggplantCoins', w: 36, x: 66, y: 32 }, { v: 'pepperStrips', w: 36, x: 32, y: 68 }, { v: 'basil', w: 22, x: 50, y: 50 }] },
      { t: 'add', on: 'bowl2', keep: true, say: 'A scoop of rice on top!', items: [{ v: 'rice', at: 'center', w: 42 }] },
      { t: 'eat', on: 'bowl2' },
    ],
  },
  {
    id: 'tomyum', sp: 'tom yum soup', eat: 'slurp', name: 'Tom Yum Soup', icon: '🍲', art: 'tomYum', cat: 'Thai',
    steps: [
      { t: 'chop', say: 'Chop the mushroom and the tomato!', items: [{ v: 'mushroom', out: 'mushroomSlices' }, { v: 'tomato', out: 'tomatoBits' }] },
      { t: 'add', on: 'pot', say: 'Everything in the pot!', w: 34, items: ['water', { v: 'shrimp', n: 3, raw: true, w: 28 }, 'mushroomSlices', 'tomatoBits', { v: 'lemongrass', w: 30 }, { v: 'lime', w: 24 }] },
      { t: 'cook', on: 'pot', say: 'Cook the tom yum soup!', turn: { waterFill: 'tomYumBroth' } },
      { t: 'eat', on: 'bowl2' },
    ],
  },
  {
    id: 'satay', sp: 'chicken satay', name: 'Chicken Satay', icon: '🍢', art: 'satayPlate', cat: 'Thai',
    steps: [
      { t: 'add', on: 'board', seq: 1, say: 'Put the chicken on the sticks!', items: [
        { v: 'skewer', n: 3, spots: [[50, 28], [50, 50], [50, 72]], w: 84 },
        { v: 'chickenRaw', n: 3, as: 'satay', raw: true, spots: [[50, 28], [50, 50], [50, 72]], w: 84 }] },
      { t: 'cook', on: 'pan', flip: true, say: 'Cook the satay!', out: [{ v: 'satay', w: 70, x: 42, y: 28, rot: -5 }, { v: 'satay', w: 70, x: 42, y: 48, rot: 4 }, { v: 'satay', w: 70, x: 42, y: 68, rot: -3 }] },
      { t: 'add', on: 'plate', keep: true, say: 'Peanut sauce for dipping!', items: [{ v: 'peanutSauce', pos: { x: 76, y: 78 }, w: 28 }] },
      { t: 'eat', on: 'plate' },
    ],
  },
  {
    id: 'mangorice', sp: 'mango sticky rice', name: 'Mango Sticky Rice', icon: '🥭', art: 'mangoRice', cat: 'Thai',
    steps: [
      { t: 'chop', say: 'Slice the mango!', items: [{ v: 'mango', out: 'mangoSlices' }] },
      { t: 'add', on: 'pot', say: 'Rice, coconut milk and sugar!', items: [{ v: 'coconut' }, { v: 'rice', as: 'riceGrains', at: 'center', w: 84 }, 'sugar'] },
      { t: 'cook', on: 'pot', say: 'Cook the sticky rice!', out: [{ v: 'stickyRice', w: 84 }] },
      { t: 'add', on: 'plate', seq: true, say: 'Leaf first! Then rice, mango and coconut milk!', items: [{ v: 'bananaLeaf', at: 'center', w: 96, z: 2 }, { v: 'stickyRice', pos: { x: 36, y: 52 }, w: 50 }, { v: 'mangoSlices', pos: { x: 70, y: 50 }, w: 40 }, { v: 'coconut', as: 'coconutDrizzle', pos: { x: 36, y: 52 }, w: 36 }] },
      { t: 'eat', on: 'plate' },
    ],
  },
  {
    id: 'pineapplerice', sp: 'pineapple fried rice', name: 'Pineapple Fried Rice', icon: '🍍', art: 'pineappleBoatDish', cat: 'Thai',
    steps: [
      { t: 'chop', say: 'Chop the pineapple!', items: [{ v: 'pineapple', out: 'pineappleChunks' }] },
      { t: 'add', on: 'pan', say: 'Everything in the pan!', w: 34, items: [{ v: 'rice', as: 'riceGrains', at: 'center', w: 84 }, 'egg', 'pineappleChunks', 'peas', { v: 'shrimp', n: 2, raw: true, w: 26 }, 'cashews'] },
      { t: 'cook', on: 'pan', say: 'Cook the fried rice!', out: [{ v: 'pineappleRice', w: 96 }] },
      { t: 'add', on: 'pineappleBoat', seq: true, say: 'Fill the pineapple!', items: [{ v: 'pineappleRice', at: 'center', w: 98 }, { v: 'cilantro', at: 'center', w: 56 }] },
      { t: 'eat', on: 'pineappleBoat' },
    ],
  },
  {
    id: 'roti', sp: 'banana roti', eat: 'crunch', name: 'Banana Roti', icon: '🍌', art: 'rotiPlate', cat: 'Thai',
    steps: [
      { t: 'chop', say: 'Slice the banana!', items: [{ v: 'banana', out: 'bananaCoins' }] },
      { t: 'add', on: 'pan', seq: true, say: 'Butter first! Then dough and banana!', items: [
        { v: 'butter', as: 'butterMelt', at: 'center', w: 84 }, { v: 'doughBall', as: 'rotiDisc', at: 'center', w: 90, raw: true }, { v: 'bananaCoins', as: 'bananaCoins', at: 'center', w: 46 }] },
      { t: 'rub', on: 'pan', tool: 'hands', say: 'Fold, fold, fold the roti!', out: [{ v: 'rotiSquare', w: 72, raw: true }] },
      { t: 'cook', on: 'pan', flip: true, say: 'Cook the roti!' },
      { t: 'add', on: 'plate', keep: true, pick: 2, say: 'Pick two yummy toppings!', items: [
        { v: 'sweetMilk', as: 'sweetMilkDrizzle', at: 'center', w: 68, opt: true }, { v: 'chocSauce', as: 'chocDrizzle', at: 'center', w: 68, opt: true }, { v: 'sugar', as: 'sugarDust', at: 'center', w: 70, opt: true }] },
      { t: 'eat', on: 'plate' },
    ],
  },
  {
    id: 'coconuticecream', sp: 'coconut ice cream', name: 'Coconut Ice Cream', icon: '🥥', art: 'coconutIceCream', cat: 'Thai',
    steps: [
      { t: 'add', on: 'bowl', say: 'Coconut milk, cream and sugar!', items: ['coconut', 'cream', 'sugar'] },
      { t: 'rub', on: 'bowl', tool: 'spoon', say: 'Stir, stir, stir!', out: [{ v: 'coconutMix', w: 96 }] },
      { t: 'bake', on: 'bowl', cold: true, say: 'Put it in the freezer!', turn: { coconutMix: 'coconutFrozen' } },
      { t: 'add', on: 'coconutShell', seq: 1, pick: 2, say: 'Scoop it in! Then pick two toppings!', items: [
        { v: 'coconutScoop', n: 3, spots: [[34, 38], [65, 37], [50, 65]], w: 42 },
        { v: 'peanuts', as: 'peanutBits', at: 'center', w: 72, opt: true }, { v: 'corn', as: 'cornBits', at: 'center', w: 68, opt: true }, { v: 'mango', as: 'mangoCubes', at: 'center', w: 64, opt: true }] },
      { t: 'eat', on: 'coconutShell' },
    ],
  },

  /* ---------------- Chinese ---------------- */
  {
    id: 'dumplings', sp: 'dumplings', name: 'Dumplings', icon: '🥟', cat: 'Chinese',
    steps: [
      { t: 'add', on: 'board', seq: true, say: 'Wrapper first! Then the filling!', items: [{ v: 'roundWrapper', at: 'center', w: 92 }, { v: 'porkMix', as: 'porkMix', at: 'center', w: 44 }] },
      { t: 'rub', on: 'board', tool: 'hands', say: 'Fold, fold, fold the dumplings!', out: [{ v: 'dumpling', w: 32, x: 50, y: 24, raw: true }, { v: 'dumpling', w: 32, x: 77, y: 50, raw: true }, { v: 'dumpling', w: 32, x: 50, y: 77, raw: true }, { v: 'dumpling', w: 32, x: 23, y: 50, raw: true }] },
      { t: 'add', on: 'steamer', say: 'Put the dumplings in the steamer!', items: [{ v: 'dumpling', n: 4, raw: true, spots: [[50, 24], [77, 50], [50, 77], [23, 50]], w: 32 }] },
      { t: 'cook', on: 'steamer', say: 'Steam the dumplings!' },
      { t: 'add', on: 'plate', keep: true, say: 'Soy sauce for dipping!', items: [{ v: 'soy', as: 'soyDip', pos: { x: 50, y: 50 }, w: 24 }] },
      { t: 'eat', on: 'plate' },
    ],
  },
  {
    id: 'friedrice', sp: 'fried rice', name: 'Fried Rice', icon: '🍚', art: 'friedRice', cat: 'Chinese',
    steps: [
      { t: 'chop', say: 'Chop the veggies!', items: [{ v: 'carrot', out: 'carrotCoins' }, { v: 'scallion', out: 'scallionBits' }] },
      { t: 'add', on: 'pan', say: 'Everything in the pan!', w: 34, items: [{ v: 'egg', n: 2 }, { v: 'rice', as: 'riceGrains', at: 'center', w: 84 }, 'carrotCoins', 'peas', 'scallionBits', 'soy'] },
      { t: 'cook', on: 'pan', say: 'Cook the fried rice!' },
      { t: 'rub', on: 'pan', tool: 'spoon', say: 'Stir it up!', out: [{ v: 'friedRice', w: 96 }] },
      { t: 'eat', on: 'bowl2' },
    ],
  },
  {
    id: 'chowmein', sp: 'chow mein', eat: 'slurp', name: 'Chow Mein', icon: '🍜', art: 'chowMein', cat: 'Chinese',
    steps: [
      { t: 'chop', say: 'Slice the pepper and the cabbage!', items: [{ v: 'pepper', out: 'pepperStrips' }, { v: 'cabbage', out: 'cabbageBits' }] },
      { t: 'add', on: 'pot', say: 'Water and noodles in the pot!', w: 44, items: ['water', { v: 'noodleBox', n: 2 }] },
      { t: 'cook', on: 'pot', say: 'Boil the noodles!', out: [{ v: 'chowNoodles', w: 92 }] },
      { t: 'add', on: 'pan', say: 'Everything in the pan!', w: 34, items: [{ v: 'chowNoodles', at: 'center', w: 88 }, { v: 'chickenRaw', n: 2, raw: true, w: 28 }, 'pepperStrips', 'cabbageBits', 'soy'] },
      { t: 'cook', on: 'pan', say: 'Cook the chow mein!', out: [{ v: 'chowMein', w: 96 }] },
      { t: 'eat', on: 'plate' },
    ],
  },
  {
    id: 'sweetsour', sp: 'sweet and sour chicken', name: 'Sweet & Sour Chicken', icon: '🍍', art: 'sweetSour', cat: 'Chinese',
    steps: [
      { t: 'chop', say: 'Chop the pepper and the pineapple!', items: [{ v: 'pepper', out: 'pepperBits' }, { v: 'pineapple', out: 'pineappleChunks' }] },
      { t: 'add', on: 'pot', seq: 1, say: 'Oil first! Then the chicken!', w: 30, items: [{ v: 'oil', as: 'oilFill', at: 'fill' }, { v: 'chickenRaw', n: 4, as: 'crispyChicken', raw: true }] },
      { t: 'cook', on: 'pot', fry: true, say: 'Fry the chicken!', out: [{ v: 'crispyChicken', w: 30, x: 32, y: 32 }, { v: 'crispyChicken', w: 30, x: 68, y: 34 }, { v: 'crispyChicken', w: 30, x: 34, y: 68 }, { v: 'crispyChicken', w: 30, x: 68, y: 68 }] },
      { t: 'add', on: 'pan', say: 'Chicken, veggies and sauce in the pan!', w: 30, items: ['ssSauce', { v: 'crispyChicken', n: 4 }, 'pepperBits', 'pineappleChunks'] },
      { t: 'cook', on: 'pan', say: 'Cook it in the sauce!', out: [{ v: 'sweetSour', w: 96 }] },
      { t: 'eat', on: 'plate' },
    ],
  },
  {
    id: 'eggdrop', sp: 'egg drop soup', eat: 'slurp', name: 'Egg Drop Soup', icon: '🥣', art: 'eggDrop', cat: 'Chinese',
    steps: [
      { t: 'chop', say: 'Chop the green onion!', items: [{ v: 'scallion', out: 'scallionBits' }] },
      { t: 'add', on: 'pot', say: 'Chicken broth, corn and green onion!', w: 40, items: ['chickenBroth', { v: 'corn', as: 'cornBits' }, 'scallionBits'] },
      { t: 'cook', on: 'pot', say: 'Heat up the soup!' },
      { t: 'add', on: 'pot', keep: true, say: 'Crack in the eggs!', w: 36, items: [{ v: 'egg', n: 2 }] },
      { t: 'rub', on: 'pot', tool: 'spoon', say: 'Stir, stir! Make egg ribbons!', out: [{ v: 'eggDrop', w: 100 }] },
      { t: 'eat', on: 'bowl2' },
    ],
  },
  {
    id: 'bao', sp: 'bao buns', name: 'Bao Buns', icon: '🥟', art: 'baoPlate', cat: 'Chinese',
    steps: [
      { t: 'add', on: 'bowl', say: 'Put it all in the bowl!', items: ['flour', 'sugar', 'milk'] },
      { t: 'rub', on: 'bowl', tool: 'spoon', say: 'Stir, stir, stir!', out: [{ v: 'dough', w: 96 }] },
      { t: 'add', on: 'board', seq: 1, say: 'Dough first! Then the filling!', items: [
        { v: 'doughBall', n: 4, as: 'roundWrapper', spots: [[29, 29], [71, 29], [29, 71], [71, 71]], w: 38 },
        { v: 'porkMix', n: 4, as: 'porkMix', spots: [[29, 29], [71, 29], [29, 71], [71, 71]], w: 17 }] },
      { t: 'rub', on: 'board', tool: 'hands', say: 'Pinch, pinch, pinch the buns!', out: [[29, 29], [71, 29], [29, 71], [71, 71]].map(p => ({ v: 'baoBun', w: 36, x: p[0], y: p[1], raw: true })) },
      { t: 'cook', on: 'steamer', say: 'Steam the buns!' },
      { t: 'eat', on: 'plate' },
    ],
  },
  {
    id: 'eggtarts', sp: 'egg tarts', name: 'Egg Tarts', icon: '🥧', art: 'eggTarts', cat: 'Chinese',
    steps: [
      { t: 'add', on: 'bowl', say: 'Put it all in the bowl!', items: [{ v: 'egg', n: 2 }, 'milk', 'sugar'] },
      { t: 'rub', on: 'bowl', tool: 'spoon', say: 'Stir, stir, stir!', out: [{ v: 'custardMix', w: 96 }] },
      { t: 'add', on: 'tartTin', seq: 1, say: 'Pastry first! Then the custard!', items: [
        { v: 'doughBall', n: 6, as: 'tartShell', raw: true, spots: [[20.7, 34], [50, 34], [79.3, 34], [20.7, 65.3], [50, 65.3], [79.3, 65.3]], w: 25 },
        { v: 'custardBowl', n: 6, as: 'tartCustard', raw: true, spots: [[20.7, 34], [50, 34], [79.3, 34], [20.7, 65.3], [50, 65.3], [79.3, 65.3]], w: 16 }] },
      { t: 'bake', on: 'tartTin', say: 'Bake the egg tarts!' },
      { t: 'eat', on: 'plate' },
    ],
  },
  {
    id: 'fortune', sp: 'fortune cookies', eat: 'crunch', name: 'Fortune Cookies', icon: '🥠', cat: 'Chinese',
    steps: [
      { t: 'add', on: 'bowl', say: 'Put it all in the bowl!', items: ['flour', 'sugar', 'egg', 'butter'] },
      { t: 'rub', on: 'bowl', tool: 'spoon', say: 'Stir, stir, stir!', out: [{ v: 'batter', w: 96 }] },
      { t: 'add', on: 'sheet', say: 'Make circles on the tray!', items: [{ v: 'batterBowl', n: 4, as: 'fortuneDisc', raw: true, spots: [[29, 29], [71, 29], [29, 71], [71, 71]], w: 38 }] },
      { t: 'bake', on: 'sheet', say: 'Bake the cookies!' },
      { t: 'add', on: 'sheet', keep: true, say: 'Put in the fortunes!', items: [{ v: 'fortunePaper', n: 4, spots: [[29, 29], [71, 29], [29, 71], [71, 71]], w: 30 }] },
      { t: 'rub', on: 'sheet', tool: 'hands', say: 'Fold, fold, fold the cookies!', out: [[29, 30], [71, 30], [29, 72], [71, 72]].map(p => ({ v: 'fortuneCookie', w: 40, x: p[0], y: p[1] })) },
      { t: 'eat', on: 'plate', say: 'Your fortune says: you are a super chef! Tap, tap, tap to feed your friend!' },
    ],
  },
];

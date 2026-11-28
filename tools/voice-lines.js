// Prints every line the chef can say, as JSON. Used by tools/make-voice.py.
global.window = {};
require('../js/art.js');
require('../js/recipes.js');
require('../js/lines.js');
require('../js/store.js');
process.stdout.write(JSON.stringify(window.LINES.all(window.RECIPES, window.ART.V, window.STORE.FRIENDS, window.STORE.CATS)));

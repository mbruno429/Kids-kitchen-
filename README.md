# Kids Kitchen

A drag-and-drop cooking game for little chefs aged 3–7. Pick a dish, drag the raw
ingredients into the bowl, stir, chop, cook on the stove, bake in the oven — then eat it all up.

![Kids Kitchen screenshots](assets/preview.png)

No reading needed: the chef says every instruction out loud, a pointing hand shows what to do
if a child gets stuck, and nothing can burn or go wrong.

## The 20 dishes

| Breakfast | Lunch | Dinner | Treats |
| --- | --- | --- | --- |
| Pancakes | PB & J | Cheeseburger | Chocolate Chip Cookies |
| Waffles | Grilled Cheese | French Fries | Cupcakes |
| Bacon & Eggs | Hot Dog | Pizza | Apple Pie |
| | Mac & Cheese | Spaghetti & Meatballs | |
| | Chicken Noodle Soup | Tacos | |
| | Garden Salad | Chicken Nuggets | |
| | | Corn on the Cob | |
| | | Baked Potato | |

## How to play

- **Drag** ingredients from the tray onto the bowl, pot, pan, tray or plate.
- **Stir / roll** by dragging the spoon or rolling pin around.
- **Chop** by dragging the knife back and forth over the food (tapping the food works too).
- **Cook** by dragging the 🔥 onto the stove; drag the spatula on to flip.
- **Bake** by dragging the tray into the oven.
- **Eat** by tapping the finished dish. Every finished dish earns a ⭐ in the cookbook.

## Play it on an iPhone

The layout is tuned for the iPhone 16 (393 × 852 pt, portrait) and respects the Dynamic Island
and home-indicator safe areas. For a full-screen, app-like game: open the site in Safari →
Share → **Add to Home Screen**.

Sound plays even when the phone's ring/silent switch is on silent; use the 🔊 button in the game to mute.

## Publishing (GitHub Pages)

The site is plain static files, so GitHub Pages serves it straight from the repository:
**Settings → Pages → Source: Deploy from a branch → `main` / `(root)`**. Every push to `main`
republishes it a minute or so later. `.github/workflows/check.yml` only checks the files.

## Run it locally

It is a plain static site with no build step and no dependencies:

```sh
python3 -m http.server 8000
# then open http://localhost:8000
```

## The chef's voice and the sounds

- **Voice:** every line the chef says is a small recording in `assets/voice/`, made ahead of time with
  [Kokoro](https://github.com/hexgrad/kokoro) (an open, Apache-2.0 text-to-speech model) using a warm,
  upbeat, slightly slowed-down voice in the style of a preschool teacher. It is a synthetic voice, not a
  recording or imitation of any real person. If a recording is missing, the phone's own voice reads the line.
- **Changing what the chef says:** edit `js/lines.js`, the `say:` lines in `js/recipes.js` or the names in
  `js/art.js`, then run `tools/make-voice.py` (instructions at the top of that file) to record the new lines.
- **Sound effects** (sizzling, boiling, the oven, chopping, pouring, egg cracks, crunching, slurping,
  applause and more) are generated in the browser by `js/audio.js` — there are no sound files.

## Adding a dish

Recipes are data in `js/recipes.js` — a list of steps (`add`, `rub`, `chop`, `cook`, `bake`, `eat`).
Pictures live in `js/art.js` (inline SVG and emoji, no image files). The game engine is `js/game.js`,
sounds and the talking chef are `js/audio.js`. Give a recipe `sp:` (how the chef says its name) and,
if you like, `eat:` (`crunch`, `slurp` or `munch`).

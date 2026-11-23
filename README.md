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

If there is no sound, check the ring/silent switch — iOS mutes web games when it is on silent.

## Publishing (GitHub Pages)

`.github/workflows/pages.yml` publishes the site every time `main` changes.
One-time setup: **Settings → Pages → Build and deployment → Source: GitHub Actions**.

## Run it locally

It is a plain static site with no build step and no dependencies:

```sh
python3 -m http.server 8000
# then open http://localhost:8000
```

## Adding a dish

Recipes are data in `js/recipes.js` — a list of steps (`add`, `rub`, `chop`, `cook`, `bake`, `eat`).
Pictures live in `js/art.js` (inline SVG and emoji, no image files). The game engine is `js/game.js`,
sounds and the talking chef are `js/audio.js`.

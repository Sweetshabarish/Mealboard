# The Meal Board

Plan a week of South Indian home cooking. Seventy dishes with full recipes, six ready-made
weeks, a board you fill yourself, a shopping list that builds itself, and a cooking mode.
In six languages. No accounts, no server, and it works offline once opened.

Build **2026.10.09** — redesign: bottom tab bar on phones, compact header with a profile panel (language, settings, how to use it), week tools in one ⋯ menu, dish filters folded behind one button, "Full recipe" vs "Recipe coming" cards, 44 px buttons, Leaf-green buttons in dark mode, and ready-week protein shown per person from the real recipes.

## What goes in the repo

Upload every file below to the **root** of the repository — not inside a folder.

| File | What it is |
|---|---|
| `index.html` | The front page — what Meal Board is and why to use it |
| `app.html` | The whole app |
| `credits.html` | Photo credits for every dish photo |
| `sw.js` | Makes it work offline. Must sit next to `index.html` and `app.html` |
| `manifest.webmanifest` | Lets phones install it as an app |
| `icon-192.png`, `icon-512.png`, `icon-maskable-512.png` | Home-screen icons |
| `icon-180.png` | iPhone home-screen icon |
| `favicon-32.png` | Browser tab icon |
| `og.png` | The picture shown when the link is shared on WhatsApp and elsewhere |
| `validate.js` | Checks the dish list before you push. Not loaded by the site |
| `build-front.js` | Rebuilds `index.html` and `credits.html` from the data in `app.html`. Not loaded by the site |
| `logo/` | The mark and lockups. Not loaded by the site |
| `README.md` | This file |

## Put it online with GitHub Pages

1. Repo → **Add file** → **Upload files** → drag in everything above → **Commit changes**.
2. Settings → Pages → Source: **Deploy from a branch**, Branch `main`, folder `/ (root)` → Save.
3. Live at `https://<username>.github.io/<repo>/` within a minute or two.

**Releasing an update:** change `VERSION` at the top of `sw.js` to a new value every time
you upload a new `app.html` or `index.html`. That is what tells installed copies to fetch the new build.
Without it, people keep seeing the old one until their cache clears.

## Install it on a phone

- **Android (Chrome):** open the site → menu ⋮ → **Add to Home screen** / **Install app**.
- **iPhone (Safari):** open the site → Share → **Add to Home Screen**.

It then opens full screen with the tiffin icon and works with no signal.

## What it does

**Today** — opens by default when today is planned. The three meals, a Start cooking button
on each, and tonight's soaking job for tomorrow.

**My week**
- Week switcher: plan this week, next week, or look back. Each week is kept separately.
- **Auto-fill** from rules: which diets, diet needs (vegan, gluten-free and so on), a time
  limit on weekdays, no repeats, skip what was on the last two weeks, and — if you set one —
  a protein target it aims for. It relaxes repeats first, then the weekday time limit, if the
  rules leave nothing that fits.
- **Lock** a meal so auto-fill, loading a ready week and clearing the week all leave it alone.
- **Move** a meal to another slot (tap Move, then the destination). On a computer you can drag.
- **Leftovers**: cook double and the next meal fills itself — tonight's dinner becomes
  tomorrow's tiffin. The shopping list counts it once, for both meals.
- **Copy a day** to another day, or **copy last week** into this one.
- **Undo** after any load, fill, copy, clear or remove.
- Per day (tap ⋯): add guests so that day scales up, mark it **eating out** so it drops off the
  shopping list and the protein count, or **send** that day's meals to someone.
- Protein per day as a chart. With a target set in Settings, days under it show in amber.
- **Share week** sends a link that loads your week into someone else's board, on their phone.
- **Print** gives a one-page week.

**Dishes**
- Filters for type, region, meal, time and diet needs; sort by house favourites, most cooked,
  quickest or most protein.
- **+ Add your own dish** through a form. Diet tags are worked out from its ingredients.
- **Make it our way** on any built-in dish keeps your version and lets you go back to the
  original any time.

**Every recipe**
- Serves control that rescales every quantity. Times are left alone on purpose.
- Tap an ingredient or a step to tick it off.
- What equipment it needs, worked out from the method.
- Substitutions when you are out of coconut, curd, tamarind, ghee, paneer, jaggery, or have no
  pressure cooker, and how to cook it without onion or garlic.
- Star rating, how many times cooked and when, your own notes, and a pinned video.
- **Cooking mode**: everything to get out first, then one step per screen in large type, a
  timer on any step with a time in it (it beeps and vibrates), the screen kept awake, arrow
  keys on a computer.

**Dishes** — one library of 607 dishes from 89 countries. 96 are full recipes you can plan,
shop and cook; the other 511 are a directory with the name in its own script where it has one,
country and region, veg or non-veg, course, and links to videos and written recipes.
- Filter by region, country and — for India — **state**. India groups by state.
- Type: veg, egg, meat, fish and seafood, or made both ways. Course: breakfast, tiffin, main,
  rice, bread, snack, soup, side, sweet, drink.
- Time and diet needs (vegan, gluten-free, no dairy, no onion or garlic, nut-free) apply to full
  recipes, since those have ingredient lists.
- **Want the full recipe** on any directory dish saves it to a wanted list you can copy and send.
- Choosing a dish for the board shows full recipes only.

Diet marks: green veg, amber egg, red meat, blue fish and seafood, dashed for dishes commonly
made both ways.

**Shopping**
- By section, by shop (vegetable shop, meat shop, kirana), or by dish.
- The same ingredient across dishes is added together where the units match — onions,
  cups of dal, tablespoons of ghee. Measures that cannot be added, like lime-sized tamarind,
  are listed against each dish instead.
- Scaled to your household and any guests. Eating-out days and leftover meals are left out.
- Pantry staples (set in Settings) fold into a separate list so salt and oil are not on it
  every week.
- **Copy for WhatsApp** copies only what you have not ticked.

**Settings** — household size, protein target (off by default), text size, high contrast,
pantry staples, backup and restore, a dish list check, and the build number.

## The front page and the app

`index.html` is the front page: what Meal Board is, why to use it, how it works, a sample week,
cooking mode, the six ready weeks and how to install it. **Open the board** goes to `app.html`.
Old share links (`…/Mealboard/#…`) are passed straight on to the app, so nothing sent earlier breaks.
Installed phones open straight into the app.

## Cooking mode

Step by step, with a segmented progress bar, the dish name, the step in large type and — on
any step that has a time in it — a timer ring. Tap the ring to start, tap again to pause, tap
once more to carry on. It beeps and vibrates when it runs out. Back and Next step sit at the bottom.

## Dish photos

490 of the 607 dishes have a photo, taken from Wikimedia Commons, where photos are free to
reuse under the licence each one carries (mostly Creative Commons). They are loaded from
Wikimedia's servers, cached for offline use once seen, and credited on the recipe itself and in
full on `credits.html`. Dishes without a good match show the tiffin mark. Photos are in
`window.IMG` in `app.html`, one line per dish: `name: [path, author, licence, file name, has-thumbnail]`.
Do not add photos copied from recipe sites or search results — they belong to someone else.
Commissioned photography should replace these before a commercial launch.

## Where people's data lives

Everything — weeks, ratings, notes, their own dishes — is saved in that browser on that
device. Nothing is sent anywhere. **Settings → Save a backup file** writes it all to one file,
and **Restore** on another phone carries it across. Clearing the browser's site data erases it.

## Editing dishes

Full recipes live in `window.DISHES`; the directory lives in `window.WORLD`, one line per
dish: `[name, name in its own script, country, region, diet, course, one line]`, with diet
`v e m f x` and course `b m i r s p a d k` (breakfast, main, rice, bread, snack, soup, side,
sweet, drink). When a directory dish gets a full recipe, add it to `window.DISHES` and delete
its line from `window.WORLD`.

Open `app.html` and find `window.DISHES`. Each dish is one object:

```js
{id:"k1", name:"Neer Dosa", local:"...", region:"Karnataka", diet:"veg", tags:["vegan",...],
 slots:["breakfast"], time:25, ahead:"Soak rice 4 hrs", protein:8, heat:0,
 blurb:"...", ings:["Raw rice — 1 cup","..."], steps:["...","..."], tip:"..."}
```

- `region`: Karnataka, Tamil Nadu, Andhra & Telangana, Kerala, North, West & Pan-India, East & Northeast
- `states`: one or more Indian states, or `North India` / `All India`
- `diet`: veg, egg, chicken, mutton, fish
- `status: "draft"` marks a recipe that has not been cook-tested yet
- `slots`: breakfast, tiffin, lunch, dinner, side
- `tags`: vegan, nodairy, glutenfree, noallium, nuts — worked out from `ings`
- Write ingredients as `Name — quantity` so the shopping list can add them up.
- Recipes are written for **four**. Serves and the shopping list scale from that.
- `video` is optional and pins one clip for everyone.

The easiest way to add a dish for everyone: add it in the app with **+ Add your own dish**,
open it, tap **Copy as code**, and paste the line into `window.DISHES`.

Before you push, run:

```
node validate.js
node build-front.js
```

The second line refreshes the front page and the credits page so their counts, sample week and
photos match the app.

It checks every dish for missing fields, unknown regions, diets or slots, ingredients with
no quantity, and ready weeks that point at dishes that do not exist.

## Languages

English, हिंदी, ಕನ್ನಡ, தமிழ், తెలుగు, മലയാളം. `window.UI` holds every interface string per
language; `window.RX` holds recipe translations by dish id, falling back to English.

The controls added in this build are in English in all six languages for now, and fall back
cleanly until they are translated. Recipes: Neer Dosa is done in Kannada and Tamil; the rest
are being added in batches.

## Diet needs

Vegan, gluten-free, no dairy and no onion or garlic are worked out from each dish's
ingredient list, with a warning where there are nuts. Gluten-free is judged from the
ingredients only: most Indian asafoetida is cut with wheat flour, so anyone strict should
check the packet.

## The logo

The mark is a tiffin carrier: three tiers for three meals, and the top tier — in turmeric — is
the next meal. Beside it the wordmark **mealboard**, lowercase, in Manrope ExtraBold. Tapping
the mark takes you to Today. The banana-leaf panel (what goes where on a leaf at a sadya, and
why food is served on it) is now opened from **Why a banana leaf?** at the bottom of every page.

Colours: Cocoa `#3B2A1E` (type, tiers), Turmeric `#E7A24A` (top tier), Sand `#EFE3D1`
(background), Leaf `#3D6B35` (accent). Dark mode uses Night `#16140F` with Chilli `#FF6A3D`.
Type: DM Serif Display for headings, Manrope for text, JetBrains Mono for labels.
The `logo/` folder has the mark as SVG (colour, dark background, one colour) and PNG lockups.

## Before you publish or sell it

The app is built to scale, but some things a publisher will need cannot come from code:

- **Recipe testing.** 26 recipes are marked `status: "draft"` — written, not yet cooked and
  checked. `node validate.js` lists them. Every recipe should be cooked from the page by
  someone who did not write it before it goes out under a brand.
- **Nutrition figures.** Protein per serving is an estimate. For sale, calculate it from a food
  composition table (IFCT 2017 for Indian foods, USDA FoodData Central for the rest) or have a
  nutritionist sign it off. Claims such as "high protein" are regulated — FSSAI in India, and the
  equivalent bodies in each country you sell into.
- **Allergens.** Diet tags are worked out from ingredient text. They are a useful filter, not an
  allergen declaration, and should be reviewed by a person before being presented as one.
- **Translation.** The interface and the two translated recipes are drafts. Use native-speaker
  translators and a second reviewer per language before release. Controls added after the first
  translation pass are still in English.
- **Ownership.** Confirm who owns the original 70 recipes and their text, and run a trademark
  search on the name and the tiffin mark in each market.
- **Photography.** The dish photos are community photos from Wikimedia Commons, credited on each
  recipe and in `credits.html`. Their licences allow reuse, including commercial, as long as the
  credit and licence stay with them; share-alike ones also require derivative images to carry the
  same licence. Commissioned food photography is still the biggest change in how the product will look.
- **Accounts, sync and household sharing** need a server, with a privacy policy and compliance
  with India's DPDP Act 2023 and the GDPR if you sell in Europe. Today nothing leaves the device.

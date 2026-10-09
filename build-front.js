#!/usr/bin/env node
/* Builds the front page (index.html) and the photo credits page (credits.html)
   from the dish data in app.html. Run after changing dishes, weeks or photos:
       node build-front.js                                                    */
const fs = require("fs"), vm = require("vm");
const html = fs.readFileSync(__dirname + "/app.html", "utf8");
const box = { window: {} };
[...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m => m[1])
  .filter(s => /window\.(DISHES|TRACKS|WORLD|IMG)\s*=/.test(s) && !/function T\(/.test(s))
  .forEach(s => vm.runInNewContext(s, box));
const { DISHES, TRACKS, WORLD, IMG } = box.window;
const BUILD = (html.match(/name="app-version" content="([^"]+)"/) || [])[1] || "";
const BY = {}; DISHES.forEach(d => BY[d.id] = d);
const ALL = [].concat(...Object.values(WORLD));
const nDishes = DISHES.length + ALL.length;
const nCountries = new Set(ALL.map(w => w[2]).concat(["India"])).size;
const esc = s => String(s == null ? "" : s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const url = (p, w) => p[4] ? "https://thumb.wikimedia.org/wikipedia/commons/thumb/" + p[0] + "/" + (w || 500) + "px-" + p[0].split("/").pop()
                           : "https://upload.wikimedia.org/wikipedia/commons/" + p[0];
const img = (name, w, cls) => {
  const p = IMG[name];
  if (!p) return `<span class="ph none ${cls || ""}" aria-hidden="true">${TIFF}</span>`;
  return `<span class="ph ${cls || ""}"><img src="${esc(url(p, w))}" alt="${esc(name)}" loading="lazy" decoding="async" referrerpolicy="no-referrer" title="${esc(name + " — photo: " + (p[1] || "unknown") + ", " + p[2] + ", Wikimedia Commons")}" onerror="this.parentNode.classList.add('none');this.remove()"></span>`;
};
const TIFF = '<svg viewBox="0 0 40 46" aria-hidden="true"><path d="M12 10V6Q12 2 16 2H24Q28 2 28 6V10" fill="none" stroke="currentColor" stroke-width="3"/><rect x="3" y="11" width="34" height="10" rx="4" fill="#e7a24a"/><rect x="3" y="23" width="34" height="10" rx="4" fill="currentColor"/><rect x="3" y="35" width="34" height="10" rx="4" fill="currentColor"/></svg>';
const DC = { veg: "#3d6b35", egg: "#e7a24a", chicken: "#b5452a", mutton: "#b5452a", fish: "#2d6a8a" };
const FONTS = '<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>' +
  '<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;700;800&family=DM+Serif+Display:ital@0;1&family=JetBrains+Mono:wght@400;600&family=Anek+Kannada:wght@500&family=Anek+Tamil:wght@500&family=Anek+Telugu:wght@500&family=Anek+Malayalam:wght@500&family=Anek+Devanagari:wght@500&display=swap">';
const HEAD = (title, desc) => `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${title}</title>
<meta name="description" content="${esc(desc)}">
<meta name="theme-color" content="#3B2A1E">
<meta property="og:title" content="The Meal Board">
<meta property="og:description" content="Decide the week once. ${DISHES.length} full recipes, six ready weeks, a shopping list that builds itself.">
<meta property="og:type" content="website">
<meta property="og:image" content="https://sweetshabarish.github.io/Mealboard/og.png">
<meta name="twitter:card" content="summary_large_image">
<link rel="manifest" href="manifest.webmanifest">
<link rel="apple-touch-icon" href="icon-180.png">
<link rel="icon" type="image/png" sizes="32x32" href="favicon-32.png">
${FONTS}`;

const CSS = `
:root{color-scheme:light;--sand:#efe3d1;--paper:#f7efe2;--cocoa:#3b2a1e;--ink2:#5a4636;--mute:#7a6552;--line:#d9c6ab;--turmeric:#e7a24a;--rust:#a0643a;--leaf:#3d6b35;--leaf2:#5f8c54;--night:#16140f}
*{box-sizing:border-box}
html{scroll-behavior:smooth}
body{margin:0;background:var(--sand);color:var(--cocoa);font-family:"Manrope",system-ui,sans-serif;font-weight:500;-webkit-font-smoothing:antialiased;overflow-x:hidden}
a{color:var(--leaf)}
img{display:block;max-width:100%}
.wrap{max-width:1240px;margin:0 auto;padding-inline:clamp(16px,3vw,32px)}
.serif{font-family:"DM Serif Display",Georgia,serif;font-weight:400}
.mono{font-family:"JetBrains Mono",ui-monospace,monospace}
.eyebrow{font-family:"JetBrains Mono",monospace;font-size:12px;letter-spacing:.14em;text-transform:uppercase;color:var(--rust)}
h1,h2,h3{margin:0;font-family:"DM Serif Display",Georgia,serif;font-weight:400;text-wrap:balance}
h2{font-size:clamp(38px,5.4vw,68px);line-height:1;letter-spacing:-.01em}
p{text-wrap:pretty}
.btn{display:inline-block;text-decoration:none;border-radius:999px;padding:15px 26px;font-weight:800;font-size:16px;line-height:1.1;border:1.5px solid transparent}
.btn.dark{background:var(--cocoa);color:var(--sand)}
.btn.leaf{background:var(--leaf);color:var(--paper)}
.btn.line{border-color:var(--cocoa);color:var(--cocoa)}
.btn.sun{background:var(--turmeric);color:var(--night)}
.btn:hover{filter:brightness(1.08)}
:focus-visible{outline:2.5px solid var(--turmeric);outline-offset:3px}
.ph{display:block;position:relative;overflow:hidden;background:#e6d6bd;color:#c9b395}
.ph img{width:100%;height:100%;object-fit:cover}
.ph.none{display:flex;align-items:center;justify-content:center}
.ph.none svg{width:28%;max-width:44px;opacity:.6}

/* header */
header{position:sticky;top:0;z-index:20;background:rgba(239,227,209,.92);backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px)}
.hd{display:flex;align-items:center;gap:24px;padding-block:18px}
.brand{display:flex;align-items:center;gap:11px;text-decoration:none;color:var(--cocoa)}
.brand svg{width:28px;height:33px;color:var(--cocoa)}
.brand b{font-weight:800;font-size:25px;letter-spacing:-.03em;line-height:1}
nav.top{display:flex;gap:24px;margin-left:auto;font-weight:700;font-size:14.5px}
nav.top a{color:var(--cocoa);text-decoration:none}
nav.top a:hover{color:var(--leaf)}
.hd .btn{padding:11px 20px;font-size:14.5px;white-space:nowrap}
@media (max-width:420px){.hd .btn{padding:10px 15px;font-size:13.5px}.brand b{font-size:22px}}
@media (max-width:900px){nav.top{display:none}.hd .btn{margin-left:auto}}

/* hero */
.hero{padding-block:clamp(36px,6vw,64px) clamp(56px,8vw,96px);display:flex;flex-direction:column;gap:clamp(36px,5vw,56px)}
.hero-top{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,460px),1fr));gap:28px 64px;align-items:end}
.hero h1{font-size:clamp(56px,8.6vw,124px);line-height:.92;letter-spacing:-.025em}
.hero h1 i{color:var(--leaf)}
.hero p.lead{margin:0;font-size:clamp(17px,1.6vw,20px);line-height:1.5;max-width:42ch;color:var(--ink2)}
.ctas{display:flex;gap:12px;flex-wrap:wrap;margin-top:24px}
.band{background:var(--leaf);border-radius:36px clamp(36px,16vw,220px) clamp(36px,16vw,220px) 36px;padding:clamp(24px,4.5vw,60px) clamp(24px,9vw,150px) clamp(24px,4.5vw,60px) clamp(24px,4.5vw,60px);position:relative;display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:clamp(12px,3.5vw,48px)}
.band::before{content:"";position:absolute;left:28px;right:100px;top:44%;height:3px;background:var(--leaf2);border-radius:2px}
.plate{position:relative;display:flex;flex-direction:column;align-items:center;gap:12px;text-align:center}
.plate .ph{width:100%;max-width:260px;aspect-ratio:1;border-radius:50%;box-shadow:0 0 0 8px var(--paper),0 14px 0 8px rgba(0,0,0,.14)}
.plate:first-child .ph{box-shadow:0 0 0 8px var(--turmeric),0 14px 0 8px rgba(0,0,0,.14)}
.plate b{font-family:"DM Serif Display",serif;font-weight:400;font-size:clamp(24px,2.6vw,32px);color:var(--paper);margin-top:10px}
.plate span{font-size:13px;font-weight:700;color:#d9e6cf}
@media (max-width:620px){.plate .ph{box-shadow:0 0 0 4px var(--paper),0 8px 0 4px rgba(0,0,0,.14)}.plate:first-child .ph{box-shadow:0 0 0 4px var(--turmeric),0 8px 0 4px rgba(0,0,0,.14)}.plate b{font-size:19px;margin-top:4px}.plate span{font-size:11px}.band{border-radius:28px 90px 90px 28px;padding:22px 34px 22px 18px}.band::before{left:14px;right:40px}}
.facts{display:flex;gap:10px 28px;flex-wrap:wrap;font-family:"JetBrains Mono",monospace;font-size:13px;color:var(--mute)}

/* what */
.what{background:var(--paper);padding-block:clamp(64px,9vw,110px)}
.what-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,420px),1fr));gap:40px 72px;align-items:start}
.what p{font-size:17.5px;line-height:1.62;color:var(--ink2);margin:0 0 16px;max-width:56ch}
.what p b{color:var(--cocoa)}
.stats{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));border-top:1.5px solid var(--cocoa);margin-top:56px}
.stat{padding:20px 16px 4px 0;display:flex;flex-direction:column;gap:4px}
.stat b{font-family:"DM Serif Display",serif;font-weight:400;font-size:clamp(44px,5vw,64px);line-height:1}
.stat span{font-size:14px;color:var(--mute);font-weight:700}

/* why */
.why{background:var(--cocoa);color:var(--paper);padding-block:clamp(64px,9vw,110px)}
.why h2{max-width:15ch}
.why .eyebrow{color:var(--turmeric)}
.reasons{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,330px),1fr));gap:0 40px;margin-top:56px}
.reason{border-top:1.5px solid var(--turmeric);padding:24px 0 34px;display:flex;flex-direction:column;gap:12px}
.reason .n{font-family:"JetBrains Mono",monospace;font-size:13px;color:var(--turmeric)}
.reason h3{font-size:30px;line-height:1.1}
.reason p{margin:0;font-size:16px;line-height:1.58;color:#d9c6ab}

/* how */
.how{padding-block:clamp(64px,9vw,110px)}
.steps{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,300px),1fr));gap:0 40px;margin-top:50px}
.step{border-top:1.5px solid var(--cocoa);padding:24px 0 12px;display:flex;flex-direction:column;gap:12px}
.step .big{font-family:"DM Serif Display",serif;font-size:72px;line-height:1;color:var(--leaf)}
.step h3{font-size:32px}
.step p{margin:0;font-size:16px;line-height:1.55;color:var(--ink2)}

/* cooking mode */
.cook{background:var(--night);color:var(--paper);padding-block:clamp(64px,9vw,110px);overflow:hidden}
.cook-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,400px),1fr));gap:56px 80px;align-items:center}
.cook .eyebrow{color:var(--turmeric)}
.cook ul{list-style:none;padding:0;margin:28px 0 0;display:flex;flex-direction:column;gap:14px}
.cook li{display:flex;gap:12px;font-size:16.5px;line-height:1.5;color:#d9c6ab}
.cook li::before{content:"";flex:none;width:10px;height:10px;border-radius:50%;background:var(--turmeric);margin-top:8px}
.cook li b{color:var(--paper)}
.phone{justify-self:center;width:min(100%,360px);background:#16140f;border:10px solid #2a241c;border-radius:44px;padding:22px 20px 20px;box-shadow:0 30px 80px rgba(0,0,0,.5);display:flex;flex-direction:column;gap:0;aspect-ratio:9/17.5}
.p-top{display:flex;justify-content:space-between;align-items:center}
.p-top span{font-family:"JetBrains Mono",monospace;font-size:12px;color:var(--turmeric)}
.p-top i{width:34px;height:34px;border-radius:50%;border:1.5px solid #3a3228;display:flex;align-items:center;justify-content:center;font-style:normal;color:var(--paper);font-size:18px}
.p-seg{display:flex;gap:5px;margin-top:14px}
.p-seg i{flex:1;height:4px;border-radius:4px;background:#2c271f}
.p-seg i.on{background:var(--turmeric)}
.p-name{margin:20px 0 8px;font-size:12.5px;font-weight:700;color:#b3a18a}
.p-step{margin:0;font-weight:800;font-size:clamp(19px,5.2vw,23px);line-height:1.24;letter-spacing:-.01em}
.p-ring{margin:auto auto 0;width:62%;aspect-ratio:1;position:relative}
.p-ring svg{width:100%;height:100%;transform:rotate(-90deg)}
.p-ring circle{fill:none;stroke-width:9}
.p-ring .t{stroke:#2c271f}
.p-ring .f{stroke:var(--turmeric);stroke-linecap:round;animation:tick 180s linear infinite}
@keyframes tick{from{stroke-dashoffset:0}to{stroke-dashoffset:553}}
.p-ring div{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:2px}
.p-ring b{font-family:"JetBrains Mono",monospace;font-weight:600;font-size:clamp(30px,8vw,38px)}
.p-ring small{font-size:11px;color:#b3a18a}
.p-nav{display:flex;gap:10px;margin-top:22px}
.p-nav span{border-radius:999px;padding:13px 0;text-align:center;font-weight:800;font-size:14px}
.p-nav .b{flex:0 0 38%;border:1.5px solid #3a3228}
.p-nav .n{flex:1;background:var(--turmeric);color:var(--night)}
@media (prefers-reduced-motion:reduce){.p-ring .f{animation:none;stroke-dashoffset:120}}

/* board */
.board{padding-block:clamp(64px,9vw,110px)}
.board-hd{display:flex;justify-content:space-between;align-items:flex-end;gap:24px;flex-wrap:wrap;margin-bottom:34px}
.board-hd p{margin:0;font-size:16px;line-height:1.5;color:var(--ink2);max-width:40ch}
.scroll{overflow-x:auto;border-radius:24px;-webkit-overflow-scrolling:touch}
.grid7{min-width:980px;display:grid;grid-template-columns:104px repeat(7,minmax(0,1fr));background:var(--paper);border-radius:24px;overflow:hidden}
.grid7 .dh{padding:16px 12px 12px;font-family:"DM Serif Display",serif;font-size:22px;border-left:1px solid #e3d5bf}
.grid7 .sl{padding:14px;border-top:1px solid #e3d5bf;font-family:"JetBrains Mono",monospace;font-size:11px;letter-spacing:.12em;text-transform:uppercase;color:var(--rust)}
.cell{border-top:1px solid #e3d5bf;border-left:1px solid #e3d5bf;padding:10px;display:flex;flex-direction:column;gap:6px}
.cell .ph{aspect-ratio:4/3;border-radius:12px}
.cell .nm{display:flex;gap:6px;align-items:flex-start;font-weight:800;font-size:13px;line-height:1.25}
.cell .nm i{flex:none;width:8px;height:8px;border-radius:50%;margin-top:4px}
.cell .lc{font-family:"Anek Kannada","Anek Tamil","Anek Telugu","Anek Malayalam","Anek Devanagari",sans-serif;font-size:13px;color:var(--leaf);padding-left:14px}
.cell .tm{margin-top:auto;font-family:"JetBrains Mono",monospace;font-size:11px;color:var(--mute);padding-left:14px}
.hint{margin:12px 0 0;font-size:13px;color:var(--mute)}

/* library mosaic */
.lib{background:var(--paper);padding-block:clamp(64px,9vw,110px)}
.mosaic{display:grid;grid-template-columns:repeat(auto-fill,minmax(min(100%,210px),1fr));gap:14px;margin-top:40px}
.tile{position:relative;border-radius:22px;overflow:hidden;aspect-ratio:1;background:#e6d6bd}
.tile .ph{position:absolute;inset:0}
.tile figcaption{position:absolute;left:10px;right:10px;bottom:10px;background:rgba(22,20,15,.72);color:var(--paper);border-radius:14px;padding:8px 11px;display:flex;flex-direction:column;gap:1px}
.tile figcaption b{font-size:14px;font-weight:800;line-height:1.2}
.tile figcaption span{font-size:11.5px;color:#d9c6ab}
.lib .ctas{margin-top:34px}

/* weeks */
.weeks{padding-block:clamp(64px,9vw,110px)}
.tracks{display:grid;grid-template-columns:repeat(auto-fill,minmax(min(100%,340px),1fr));border-top:1.5px solid var(--cocoa);margin-top:40px}
.track{padding:22px 22px 26px 0;border-bottom:1px solid var(--line);display:flex;flex-direction:column;gap:8px}
.track .row{display:flex;flex-wrap:wrap;justify-content:space-between;align-items:baseline;gap:4px 12px}
.track h3{font-size:28px}
.track .pro{font-family:"JetBrains Mono",monospace;font-size:12px;color:var(--leaf);white-space:normal}
.track .tag{font-size:13px;font-weight:700;color:var(--rust)}
.track p{margin:0;font-size:14.5px;line-height:1.5;color:var(--ink2)}

/* languages */
.langs{background:var(--leaf);color:var(--paper);padding-block:clamp(56px,8vw,90px)}
.langs .eyebrow{color:var(--turmeric)}
.langs .row{display:flex;flex-wrap:wrap;gap:12px 40px;align-items:baseline;font-size:clamp(32px,5vw,64px);line-height:1.15;margin-top:26px}

/* install */
.install{padding-block:clamp(64px,9vw,110px) 50px}
.install-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,360px),1fr));gap:48px}
.install p{margin:20px 0 26px;font-size:17px;line-height:1.55;color:var(--ink2);max-width:44ch}
.cards{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:14px;align-items:start}
.card{background:var(--paper);border-radius:24px;padding:24px;display:flex;flex-direction:column;gap:10px}
.card b{font-size:17px;font-weight:800}
.card span{font-size:15px;line-height:1.5;color:var(--ink2)}
footer{margin-top:80px;padding-block:22px 40px;border-top:1px solid var(--line);display:flex;justify-content:space-between;gap:16px;flex-wrap:wrap;font-size:13px;color:var(--mute)}
footer a{color:var(--leaf);font-weight:700}
`;

/* ---------- content ---------- */
const hero = [["Breakfast", "Masala Dosa", "dosa · idli · pongal"], ["Lunch", "Bisi Bele Bath", "sambar · rasam · rice"], ["Dinner", "Appam with Vegetable Stew", "appam · stew · curd rice"]];
const reasons = [
  ["The 6 pm question, answered on Sunday", "Deciding what to cook, three times a day, is the tiring part. Fill the week once — or load a ready one — and every meal after that is already decided."],
  ["One shopping list that adds itself up", "The list builds from the board and totals the same ingredient across dishes. Sort it by vegetable shop, meat shop or kirana, and send it on WhatsApp."],
  ["Protein you can actually see", "Every dish carries its protein per serving. The board shows each day as a bar, so a low day is obvious before you cook it, not after."],
  ["Cook without squinting at a phone", "Cooking mode shows one step at a time in large type, with a timer ring on any step that has a time in it. It beeps, vibrates and keeps the screen awake."],
  ["Less waste, fewer pans", "Cook double and tonight's dinner becomes tomorrow's tiffin. Leftovers fill the next slot on their own and are counted once on the list."],
  ["Your kitchen, your language, your phone", "Six Indian languages, no account, no server. It works offline, and your weeks, ratings and notes never leave the device."]
];
const tr = TRACKS[0];
const heads = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const boardRows = [["b", "Breakfast"], ["l", "Lunch"], ["n", "Dinner"]].map(([k, slot]) =>
  `<span class="sl">${slot}</span>` + tr.days.map(day => {
    const d = BY[day[k]]; if (!d) return '<div class="cell"></div>';
    return `<div class="cell">${img(d.name, 330)}<span class="nm"><i style="background:${DC[d.diet] || "#999"}"></i>${esc(d.name)}</span>` +
      (d.local ? `<span class="lc">${esc(d.local)}</span>` : "") + `<span class="tm">${d.time} min</span></div>`;
  }).join("")).join("");
const akki = BY.k2 && BY.k2.name === "Akki Roti" ? BY.k2 : DISHES.find(d => d.name === "Akki Roti");
const mosaicNames = ["Masala Dosa", "Idli, Sambar and Coconut Chutney", "Neer Dosa", "Avial", "Puttu with Kadala Curry", "Chicken Chettinad", "Bisi Bele Bath", "Pesarattu with Upma", "Hyderabadi Chicken Dum Biryani", "Karimeen Pollichathu", "Mysore Pak", "Unniyappam", "Pav Bhaji", "Rogan Josh", "Momo", "Pad Thai", "Shakshuka", "Jollof Rice"].filter(n => IMG[n]);
const where = n => { const d = DISHES.find(x => x.name === n); if (d) return d.region; const w = ALL.find(x => x[0] === n); return w ? (w[3] ? w[3] + ", " : "") + w[2] : ""; };

const front = HEAD("The Meal Board — plan a week of home cooking", `Plan a week of South Indian home cooking: ${DISHES.length} full recipes, six ready weeks, a shopping list that builds itself, and a cooking mode with timers. Free, no sign-up, works offline.`) + `
<script>/* old share links (…/#w=…) belong to the app */if(location.hash.length>1)location.replace("app.html"+location.hash);</script>
<style>${CSS}</style>
</head>
<body>
<header><div class="wrap hd">
  <a class="brand" href="./" aria-label="The Meal Board">${TIFF}<b>mealboard</b></a>
  <nav class="top" aria-label="Sections"><a href="#what">What it is</a><a href="#why">Why</a><a href="#how">How it works</a><a href="#weeks">Ready weeks</a><a href="#install">Install</a></nav>
  <a class="btn dark" href="app.html">Open the board</a>
</div></header>

<main>
<section class="wrap hero" aria-labelledby="h1">
  <div class="hero-top">
    <h1 id="h1">Decide the week <i>once.</i></h1>
    <div>
      <p class="lead">The Meal Board plans a week of home cooking — breakfast, lunch and dinner — then gives you the recipes, a cooking mode with timers, and the shopping list. South Indian first, with ${nDishes} dishes from ${nCountries} countries.</p>
      <div class="ctas"><a class="btn leaf" href="app.html">Plan a week</a><a class="btn line" href="#what">What is it?</a></div>
    </div>
  </div>
  <div class="band">
    ${hero.map(([m, n, s]) => `<div class="plate">${img(n, 500)}<b>${m}</b><span>${s}</span></div>`).join("\n    ")}
  </div>
  <div class="facts"><span>No account</span><span>Works offline</span><span>Six languages</span><span>Free</span></div>
</section>

<section id="what" class="what" aria-labelledby="what-h">
  <div class="wrap">
    <div class="what-grid">
      <div><div class="eyebrow">What it is</div><h2 id="what-h" style="margin-top:12px">A weekly meal planner for Indian kitchens.</h2></div>
      <div>
        <p>The Meal Board is a <b>board of 21 meals</b> — three a day for seven days. You fill it with dishes, or load one of six ready-made weeks and change what you like.</p>
        <p>Every one of the <b>${DISHES.length} full recipes</b> scales to your household, lists what to soak or grind the night before, and opens into a step-by-step <b>cooking mode</b>. The board then writes your <b>shopping list</b>, added up across the week.</p>
        <p>Beyond the recipes sits a library of <b>${ALL.length} more dishes</b> from every Indian state and the wider world, with the name in its own script, where it comes from, and links to watch it made.</p>
      </div>
    </div>
    <div class="stats">
      <div class="stat"><b>${DISHES.length}</b><span>full recipes</span></div>
      <div class="stat"><b>${nDishes}</b><span>dishes in the library</span></div>
      <div class="stat"><b>${nCountries}</b><span>countries</span></div>
      <div class="stat"><b>6</b><span>ready weeks</span></div>
      <div class="stat"><b>6</b><span>languages</span></div>
    </div>
  </div>
</section>

<section id="why" class="why" aria-labelledby="why-h">
  <div class="wrap">
    <div class="eyebrow">Why use it</div>
    <h2 id="why-h" style="margin-top:12px">Less deciding. Better eating. One trip to the shop.</h2>
    <div class="reasons">
      ${reasons.map(([h, p], i) => `<div class="reason"><span class="n">0${i + 1}</span><h3>${h}</h3><p>${p}</p></div>`).join("\n      ")}
    </div>
  </div>
</section>

<section id="how" class="how" aria-labelledby="how-h">
  <div class="wrap">
    <div class="eyebrow">How it works</div>
    <h2 id="how-h" style="margin-top:12px;max-width:14ch">Plan once. Cook and shop from it all week.</h2>
    <div class="steps">
      <div class="step"><span class="big">1</span><h3>Plan</h3><p>Fill three meals a day for seven days, or load a ready week. Auto-fill works from your rules: diet, a weekday time limit, no repeats, a protein target.</p></div>
      <div class="step"><span class="big">2</span><h3>Cook</h3><p>Each recipe rescales to your household. Cooking mode shows one step at a time, with a timer on every step that has a time in it.</p></div>
      <div class="step"><span class="big">3</span><h3>Shop</h3><p>The list builds from the board, adding up the same ingredient across dishes. Sort it by shop, tick as you go, and copy it into WhatsApp.</p></div>
    </div>
  </div>
</section>

<section class="cook" aria-labelledby="cook-h">
  <div class="wrap cook-grid">
    <div>
      <div class="eyebrow">Cooking mode</div>
      <h2 id="cook-h" style="margin-top:12px">Hands full? The screen keeps up.</h2>
      <ul>
        <li><span><b>One step per screen</b>, in type you can read from the stove.</span></li>
        <li><span><b>A timer ring</b> on any step with a time in it — tap to start, tap to pause. It beeps and vibrates when it is done.</span></li>
        <li><span><b>Everything to get out first</b>, scaled to how many you are cooking for.</span></li>
        <li><span><b>The screen stays awake</b>, and arrow keys move between steps on a computer.</span></li>
      </ul>
    </div>
    <div class="phone" role="img" aria-label="Cooking mode on a phone: step 4 of 5 of Akki Roti with a 3 minute timer running">
      <div class="p-top"><span>Step 4 of ${akki.steps.length}</span><i>×</i></div>
      <div class="p-seg">${akki.steps.map((_, i) => `<i${i < 4 ? ' class="on"' : ""}></i>`).join("")}</div>
      <p class="p-name">${esc(akki.name)}</p>
      <p class="p-step">${esc(akki.steps[3])}</p>
      <div class="p-ring"><svg viewBox="0 0 200 200"><circle class="t" cx="100" cy="100" r="88"/><circle class="f" cx="100" cy="100" r="88" stroke-dasharray="553"/></svg><div><b>3:00</b><small>running</small></div></div>
      <div class="p-nav"><span class="b">Back</span><span class="n">Next step</span></div>
    </div>
  </div>
</section>

<section class="board" aria-labelledby="board-h">
  <div class="wrap">
    <div class="board-hd">
      <div><div class="eyebrow">The board · ${esc(tr.name)}</div><h2 id="board-h" style="margin-top:10px">Twenty-one meals on one page.</h2></div>
      <p>This is one of the six ready weeks, as it looks on the board. Every dish opens to its full recipe.</p>
    </div>
    <div class="scroll" tabindex="0" aria-label="A sample week, scrolls sideways">
      <div class="grid7"><span></span>${heads.map(h => `<span class="dh">${h}</span>`).join("")}${boardRows}</div>
    </div>
  </div>
</section>

<section class="lib" aria-labelledby="lib-h">
  <div class="wrap">
    <div class="eyebrow">From the library</div>
    <h2 id="lib-h" style="margin-top:12px;max-width:16ch">South Indian first. The world after.</h2>
    <div class="mosaic">
      ${mosaicNames.map(n => `<figure class="tile" style="margin:0">${img(n, 500)}<figcaption><b>${esc(n)}</b><span>${esc(where(n))}</span></figcaption></figure>`).join("\n      ")}
    </div>
    <div class="ctas"><a class="btn dark" href="app.html">Browse all ${nDishes} dishes</a></div>
  </div>
</section>

<section id="weeks" class="weeks" aria-labelledby="weeks-h">
  <div class="wrap">
    <h2 id="weeks-h" style="max-width:16ch">Six weeks, ready to load.</h2>
    <div class="tracks">
      ${TRACKS.map(t => `<div class="track"><div class="row"><h3>${esc(t.name)}</h3><span class="pro">${esc(t.protein)}</span></div><span class="tag">${esc(t.tag)} · ${esc(t.diet)}</span><p>${esc(t.about)}</p></div>`).join("\n      ")}
    </div>
  </div>
</section>

<section class="langs" aria-label="Languages">
  <div class="wrap">
    <div class="eyebrow">In six languages</div>
    <div class="row">
      <span class="serif">English</span><span style="font-family:'Anek Devanagari',sans-serif">हिंदी</span><span style="font-family:'Anek Kannada',sans-serif">ಕನ್ನಡ</span><span style="font-family:'Anek Tamil',sans-serif">தமிழ்</span><span style="font-family:'Anek Telugu',sans-serif">తెలుగు</span><span style="font-family:'Anek Malayalam',sans-serif">മലയാളം</span>
    </div>
  </div>
</section>

<section id="install" class="wrap install" aria-labelledby="inst-h">
  <div class="install-grid">
    <div>
      <h2 id="inst-h">Nothing leaves your device.</h2>
      <p>No accounts and no server. Your weeks, ratings and notes stay in this browser, and a backup file carries them to a new phone.</p>
      <a class="btn dark" href="app.html">Open the board</a>
    </div>
    <div class="cards">
      <div class="card"><b>Android</b><span>Open in Chrome, tap the menu ⋮, then <b>Install app</b>.</span></div>
      <div class="card"><b>iPhone</b><span>Open in Safari, tap Share, then <b>Add to Home Screen</b>.</span></div>
    </div>
  </div>
</section>
</main>
<script>if("serviceWorker" in navigator&&/^https?:$/.test(location.protocol))window.addEventListener("load",function(){navigator.serviceWorker.register("sw.js").catch(function(){})});</script>
</body>
</html>
`;
fs.writeFileSync(__dirname + "/index.html", front);

/* ---------- credits ---------- */
const rows = Object.keys(IMG).sort((a, b) => a.localeCompare(b)).map(n => {
  const p = IMG[n];
  return `<tr><td>${esc(n)}</td><td><a href="https://commons.wikimedia.org/wiki/File:${encodeURIComponent(p[3].replace(/ /g, "_"))}" target="_blank" rel="noopener noreferrer">${esc(p[3])}</a></td><td>${esc(p[1] || "Unknown")}</td><td>${esc(p[2])}</td></tr>`;
}).join("\n");
const credits = HEAD("Photo credits — The Meal Board", "Credits for the dish photographs used on The Meal Board.") + `
<style>${CSS}
.cr{padding-block:40px 60px}.cr p{max-width:70ch;line-height:1.6;color:var(--ink2)}
table{width:100%;border-collapse:collapse;margin-top:26px;background:var(--paper);border-radius:18px;overflow:hidden;font-size:14px}
th,td{text-align:left;padding:10px 14px;border-bottom:1px solid #e3d5bf;vertical-align:top}
th{font-family:"JetBrains Mono",monospace;font-size:11px;letter-spacing:.12em;text-transform:uppercase;color:var(--rust);font-weight:400}
td a{word-break:break-word}
.tw{overflow-x:auto}
</style>
</head>
<body>
<header><div class="wrap hd"><a class="brand" href="./" aria-label="The Meal Board">${TIFF}<b>mealboard</b></a><a class="btn dark" href="app.html">Open the board</a></div></header>
<main class="wrap cr">
<h1 style="font-size:clamp(40px,6vw,72px)">Photo credits</h1>
<p>The dish photographs come from <a href="https://commons.wikimedia.org/">Wikimedia Commons</a> and are used under the licences shown, most of them Creative Commons. Each is by the person named. They are shown as they are, apart from cropping to fit. Click a file to see its full licence and history. A photo shows the dish, or a close relative of it, as someone made it — not necessarily the Meal Board recipe.</p>
<p>${Object.keys(IMG).length} of ${nDishes} dishes have a photo. The rest show the tiffin mark until one is added.</p>
<div class="tw"><table><thead><tr><th>Dish</th><th>File</th><th>Author</th><th>Licence</th></tr></thead><tbody>
${rows}
</tbody></table></div>
<footer><span>The Meal Board · Build ${esc(BUILD)}</span><a href="./">Back to the front page</a></footer>
</main>
</body>
</html>
`;
fs.writeFileSync(__dirname + "/credits.html", credits);
console.log("Wrote index.html and credits.html —", Object.keys(IMG).length, "photos,", nDishes, "dishes,", nCountries, "countries");

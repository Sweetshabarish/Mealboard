#!/usr/bin/env node
/* Checks every dish in app.html before you push.
   Usage:  node validate.js            (from the repo folder)                */
const fs = require("fs");
const vm = require("vm");
const html = fs.readFileSync(__dirname + "/app.html", "utf8");
const data = html.split("<script>")[1].split("</script>")[0];   // the dish library block
const box = { window: {} };
vm.runInNewContext(data, box);
const DISHES = box.window.DISHES || [], TRACKS = box.window.TRACKS || [];
const REGIONS = ["Karnataka", "Tamil Nadu", "Andhra & Telangana", "Kerala", "North", "West & Pan-India", "East & Northeast"];
const STATES = ["Andhra Pradesh","Assam","Bihar","Delhi","Goa","Gujarat","Himachal Pradesh","Jammu & Kashmir","Karnataka","Kerala",
  "Madhya Pradesh","Maharashtra","Manipur","Meghalaya","Nagaland","Odisha","Punjab","Rajasthan","Tamil Nadu","Telangana",
  "Uttar Pradesh","Uttarakhand","West Bengal","North India","All India"];
const SLOTS = ["breakfast", "tiffin", "lunch", "dinner", "side"];
const DIETS = ["veg", "egg", "chicken", "mutton", "fish"];
const TAGS = ["vegan", "nodairy", "glutenfree", "noallium", "nuts"];
const issues = [], seen = {}, ids = {};
DISHES.forEach(d => { ids[d.id] = 1; });
DISHES.forEach(d => {
  const p = `${d.id || "?"} ${d.name || ""}`;
  if (seen[d.id]) issues.push(`${p}: duplicate id`); seen[d.id] = 1;
  ["name", "region", "diet", "blurb", "tip"].forEach(k => { if (!d[k]) issues.push(`${p}: missing ${k}`); });
  if (!(d.time > 0)) issues.push(`${p}: time must be a positive number`);
  if (!(d.protein >= 0)) issues.push(`${p}: protein must be a number`);
  if (!DIETS.includes(d.diet)) issues.push(`${p}: unknown diet "${d.diet}"`);
  if (!REGIONS.includes(d.region)) issues.push(`${p}: unknown region "${d.region}"`);
  if (!d.slots || !d.slots.length) issues.push(`${p}: no meal slots`);
  (d.slots || []).forEach(s => { if (!SLOTS.includes(s)) issues.push(`${p}: unknown slot "${s}"`); });
  (d.tags || []).forEach(t => { if (!TAGS.includes(t)) issues.push(`${p}: unknown tag "${t}"`); });
  if (!d.tags) issues.push(`${p}: no diet tags`);
  if (!d.states || !d.states.length) issues.push(`${p}: no states`);
  (d.states || []).forEach(x => { if (!STATES.includes(x)) issues.push(`${p}: unknown state "${x}"`); });
  if (!d.ings || d.ings.length < 2) issues.push(`${p}: fewer than two ingredients`);
  if (!d.steps || d.steps.length < 2) issues.push(`${p}: fewer than two steps`);
  (d.ings || []).forEach((x, i) => {
    if (!/\d|to taste|pinch|handful|few|little|for |as needed|sprig|small|to serve|leaves|salt|^oil|sized|to finish|serve with|coriander|lemon/i.test(x))
      issues.push(`${p}: ingredient ${i + 1} has no quantity — "${x}"`);
  });
});
TRACKS.forEach(t => (t.days || []).forEach(day => ["b", "l", "n"].forEach(m => {
  if (day[m] && !ids[day[m]]) issues.push(`week ${t.id}: ${day.d} uses unknown dish ${day[m]}`);
})));
const drafts = DISHES.filter(d => d.status === "draft");
if (drafts.length) console.log(`${drafts.length} recipes are marked draft — cook-test them before release:\n  ` +
  drafts.map(d => d.name).join(", ") + "\n");
if (issues.length) {
  console.log(`${issues.length} things to look at:\n`);
  issues.forEach(x => console.log("  - " + x));
  process.exitCode = 1;
} else {
  console.log(`All ${DISHES.length} dishes and ${TRACKS.length} ready weeks look complete.`);
}

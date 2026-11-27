(function(){
"use strict";
function strip(){var s=document.getElementById("toolstrip");if(!s){s=document.createElement("div");s.id="toolstrip";var f=document.getElementById("composer");f.parentNode.insertBefore(s,f);}return s;}
function panel(title,btn){var p=document.createElement("div");p.className="toolpanel hidden";var h=document.createElement("div");h.className="tphead";var t=document.createElement("div");t.className="tlabel";t.textContent=title;var x=document.createElement("button");x.className="tpx";x.textContent="\u2715";x.addEventListener("click",function(){p.classList.add("hidden");btn.classList.remove("active");});h.appendChild(t);h.appendChild(x);p.appendChild(h);document.body.appendChild(p);return p;}
function tog(p,btn){var open=!p.classList.contains("hidden");document.querySelectorAll(".toolpanel").forEach(function(z){z.classList.add("hidden");});document.querySelectorAll(".toolbtn").forEach(function(z){z.classList.remove("active");});if(!open){p.classList.remove("hidden");btn.classList.add("active");}}
var T = [
["FPS gun", "name, damage, fire rate, mag, reload secs", "Build a full Roblox FPS gun.\n- Tool named [NAME], damage [DAMAGE], fire rate [RATE] shots/sec, mag size [MAG], reload [SEC]s\n- Client: mouse/touch input, raycast to hit position, muzzle flash + sound\n- Server: receives the hit position, does its own raycast + sanity checks (range, fire rate), applies damage\n- Say exactly where every script goes (Tool, ServerScriptService, StarterPlayerScripts)"],
["Server-sided shop", "currency name, item list, prices", "Build a server-sided Roblox shop.\n- Currency leaderstat [COINS]\n- Shop GUI with [N] items and prices\n- Purchase through a RemoteEvent; server checks price and coins before granting, all state stays server-side\n- Owned items persist with the player data save\n- Say where every script goes"],
["Round-based loop", "lobby wait, round length, roles", "Build a Roblox round-based game loop.\n- Lobby wait [N]s, round [M]s, intermission\n- Teleport players to the arena, pick random [X] as [ROLE]\n- Status billboard GUI for timers, winner announced, stats saved\n- Server-authoritative, say where every script goes"],
["Admin commands", "commands list, ranks", "Build an admin command system.\n- UserId allowlist with rank levels\n- Commands: :speed [N], :heal, :tp [player], :kick [player] [reason], :bring, :god\n- Everything executes server-side only, usage logged\n- Mobile-friendly chat command input"],
["Player data module", "data fields, autosave interval", "Build a full player data module (ProfileService-style).\n- Session lock, UpdateAsync retry loop, autosave every [N]s, save on leave and BindToClose\n- Data: coins, kills, owned items\n- ModuleScript API: Data.Get(plr, key), Data.Increment(plr, key, n)\n- Say where the module and its callers go"],
["Global leaderboard", "stat, board size, refresh", "Build a global leaderboard.\n- OrderedDataStore updated when [STAT] changes\n- Top [N] board GUI refreshing every [M]s\n- Handles ties, shows this server's players with rank, paginated full board\n- Rate-limit the store writes"],
["Enemy spawner", "count, interval, max alive", "Build an NPC/enemy spawner.\n- Spawns [N] NPCs every [S]s, max [MAX] alive\n- NPCs pathfind to the nearest player, attack [DAMAGE] per hit, die at 0 health\n- Despawn on round end, clean up corpses"],
["Dialog NPC", "branching lines, quest reward", "Build a dialog NPC.\n- ProximityPrompt to start, branching dialogue GUI\n- Server holds the dialogue tree, choices fire back through a RemoteEvent\n- After the final choice, reward [REWARD]\n- Say where every script goes"],
["Kill feed + counter", "feed size, fade time", "Build a kill feed and kill counter.\n- Tag system on Humanoid to find who dealt the killing blow\n- Feed GUI top-right, last [N] kills, fades after [S]s\n- +1 kill to the killer's leaderstats, all server-side"],
["Anti-cheat layer", "speed/jump limits, strike count", "Build a server-side anti-cheat layer for my shooter.\n- Detect impossible speed/jump by comparing position deltas server-side\n- Validate remote fire rate and damage claims against server-known weapon stats\n- Flag repeat offenders, kick after [N] strikes, log everything\n- No false positives on lagging mobile players"]
];
var btn = document.createElement("button");
btn.className = "toolbtn"; btn.textContent = "build"; btn.title = "Script template generator";
var p = panel("script builder", btn);
var sel = document.createElement("select");
sel.className = "tinput";
T.forEach(function(t,i){ var o = document.createElement("option"); o.value = String(i); o.textContent = t[0]; sel.appendChild(o); });
p.appendChild(sel);
var hint = document.createElement("div");
hint.className = "tsub";
p.appendChild(hint);
function syncHint(){ hint.textContent = "fill the [brackets] after inserting: " + T[sel.value|0][1]; }
sel.addEventListener("change", syncHint); syncHint();
var go = document.createElement("button");
go.className = "tbtn"; go.textContent = "insert prompt";
go.addEventListener("click", function(){
  KODEX.inputEl.value = T[sel.value|0][2];
  KODEX.inputEl.focus();
  p.classList.add("hidden"); btn.classList.remove("active");
});
p.appendChild(go);
btn.addEventListener("click", function(){ tog(p, btn); });
strip().appendChild(btn);
})();

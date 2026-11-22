/* JARVIS up9.js v1 - abilities pack: memory vault, connect 4 vs AI, real speed test */
(function(){
"use strict";
function $(i){return document.getElementById(i)}
var s=document.createElement("style");
s.textContent=".abrow{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:10px}.abbtn{font-size:10px;letter-spacing:1px;padding:6px 10px;border:1px solid rgba(55,209,255,.4);border-radius:8px;color:#bfe0ff;background:rgba(4,10,18,.6)}.abbtn.red{border-color:rgba(255,43,58,.5);color:#ffd9dc}#about{font-size:12px;line-height:1.6;color:#bfe0ff;max-height:260px;overflow-y:auto;white-space:pre-wrap}#about b{color:#8fd6ff}#mvkey{color:#8fd6ff;font-weight:600}.c4wrap{display:grid;grid-template-columns:repeat(7,34px);gap:3px;justify-content:center;margin:8px auto}.c4cell{width:34px;height:34px;border-radius:50%;background:rgba(255,255,255,.06);border:1px solid rgba(120,180,220,.2);cursor:pointer}.c4cell.p1{background:radial-gradient(circle at 35% 35%,#ff7a85,#a30f1c);box-shadow:0 0 8px rgba(255,43,58,.7)}.c4cell.p2{background:radial-gradient(circle at 35% 35%,#9fe8ff,#0a6f96);box-shadow:0 0 8px rgba(55,209,255,.7)}#c4msg{text-align:center;font-size:12px;color:#ffd9dc;margin-top:6px}";
document.head.appendChild(s);
function panel(title,id){var p=document.createElement("div");p.className="panel";p.id=id;p.innerHTML='<h3>'+title+'</h3>';var br=$("bottomrow");br.parentNode.insertBefore(p,br);return p}
/* 1. memory vault (the claude-mem / swarmvault ability, browser-safe) */
(function(){
 var p=panel("MEMORY VAULT \u2014 what jarvis remembers","abmem");
 var keys=[];for(var i=0;i<localStorage.length;i++){var k=localStorage.key(i);if(/jv|hist|mem|chat|jarvis/i.test(k))keys.push(k)}
 p.innerHTML+='<div class="abrow"><button class="abbtn" data-a="reload">refresh</button><button class="abbtn red" data-a="wipe">wipe all memory</button></div><div id="about"></div>';
 function render(){var o=p.querySelector("#about"),n=0;for(var i=0;i<localStorage.length;i++){var k=localStorage.key(i);if(!/jv|hist|mem|chat|jarvis/i.test(k))continue;var v=localStorage.getItem(k)||"";n++;o.innerHTML+='<div><span class="mvkey">'+k+'</span> <span style="color:#7f95ad">('+v.length+' chars)</span><br>'+v.slice(0,140).replace(/</g,"&lt;")+(v.length>140?"\u2026":"")+'</div><hr style="border-color:rgba(120,180,220,.1)">'}
  if(!n)o.innerHTML='<span style="color:#7f95ad">memory is empty right now.</span>'}
 render();
 p.querySelectorAll(".abbtn").forEach(function(b){b.onclick=function(){
  if(b.dataset.a==="reload"){render()}
  else{if(confirm("wipe everything jarvis remembers on this device?")){var keep=[];for(var i=0;i<localStorage.length;i++){var k=localStorage.key(i);if(/jv|hist|mem|chat|jarvis/i.test(k))keep.push(k)}keep.forEach(function(k){localStorage.removeItem(k)});render();feedline("Memory vault: wiped "+keep.length+" keys.")}}}});
 feedline("Memory vault: "+keys.length+" memory keys found.")})();
/* 2. connect 4 vs AI (the poke.AI game ability, browser-safe) */
(function(){
 var p=panel("CONNECT 4 \u2014 you are red, jarvis is blue","abc4");
 p.innerHTML+='<div class="c4wrap" id="c4"></div><div id="c4msg">your move. tap a column.</div><div class="abrow" style="justify-content:center"><button class="abbtn" data-a="reset">new game</button></div>';
 var B,W,d=p.querySelector("#c4"),m=p.querySelector("#c4msg");
 function reset(){B=[];for(var r=0;r<6;r++)B.push([0,0,0,0,0,0,0]);W=0;m.textContent="your move. tap a column.";draw()}
 function drop(col,v){for(var r=5;r>=0;r--)if(!B[r][col]){B[r][col]=v;return r}return -1}
 function win(v){for(var r=0;r<6;r++)for(var c=0;c<7;c++){if(c<4&&B[r][c]===v&&B[r][c+1]===v&&B[r][c+2]===v&&B[r][c+3]===v)return 1;if(r<3&&B[r][c]===v&&B[r+1][c]===v&&B[r+2][c]===v&&B[r+3][c]===v)return 1;if(r<3&&c<4&&B[r][c]===v&&B[r+1][c+1]===v&&B[r+2][c+2]===v&&B[r+3][c+3]===v)return 1;if(r<3&&c>2&&B[r][c]===v&&B[r+1][c-1]===v&&B[r+2][c-2]===v&&B[r+3][c-3]===v)return 1}return 0}
 function full(){for(var c=0;c<7;c++)if(!B[0][c])return 0;return 1}
 function ai(){var c,i;for(i=0;i<7;i++){c=[3,2,4,1,5,0,6][i];if(!B[0][c]){var r=drop(c,2);if(win(2)){B[r][c]=0;return c}B[r][c]=0}}for(i=0;i<7;i++){c=[3,2,4,1,5,0,6][i];if(!B[0][c]){var r2=drop(c,1);if(win(1)){B[r2][c]=0;return c}B[r2][c]=0}}for(i=0;i<7;i++){c=[3,2,4,1,5,0,6][i];if(!B[0][c])return c}return 3}
 function draw(){d.innerHTML="";for(var r=0;r<6;r++)for(var c=0;c<7;c++){(function(r,c){var cell=document.createElement("div");cell.className="c4cell"+(B[r][c]===1?" p1":B[r][c]===2?" p2":"");cell.onclick=function(){if(W)return;var row=drop(c,1);if(row<0)return;draw();if(win(1)){W=1;m.textContent="you win this round.";feedline("Connect 4: Trevor beat jarvis.");return}if(full()){W=1;m.textContent="draw.";return}var ac=ai(),ar=drop(ac,2);draw();if(win(2)){W=1;m.textContent="jarvis wins. run it back?";feedline("Connect 4: jarvis won.")}else if(full()){W=1;m.textContent="draw."}else m.textContent="your move. tap a column."};d.appendChild(cell)})(r,c)}}
 p.querySelector('[data-a="reset"]').onclick=reset;reset()})();
/* 3. real speed test (the network ability, browser-safe) */
(function(){
 var p=panel("SPEED TEST \u2014 real download check","absp");
 p.innerHTML+='<div class="abrow"><button class="abbtn" data-a="go">run speed test</button></div><div id="spout">measures your real download speed right now.</div>';
 p.querySelector('[data-a="go"]').onclick=function(){
  var o=p.querySelector("#spout");o.textContent="testing\u2026 downloading 2 MB";
  var t0=performance.now();
  fetch("https://speed.cloudflare.com/__down?bytes=2000000",{cache:"no-store"}).then(function(r){return r.arrayBuffer()}).then(function(b){
   var sec=(performance.now()-t0)/1000,mbps=(b.byteLength*8/1e6)/sec;
   o.innerHTML="<b>"+mbps.toFixed(1)+" Mbps down</b> ("+(b.byteLength/1e6).toFixed(2)+" MB in "+sec.toFixed(1)+" s)";
   feedline("Speed test: "+mbps.toFixed(1)+" Mbps down.")}).catch(function(){o.textContent="the test server did not answer. try again in a minute."})}})();
function feedline(t){var f=$("feed");if(!f)return;var d=document.createElement("div");d.innerHTML="<b>[BOOT]</b>";d.appendChild(document.createTextNode(" "+t));f.insertBefore(d,f.firstChild)}
console.log("[JARVIS up9.js v1] abilities pack on: memory vault, connect 4 vs AI, real speed test.");
})();

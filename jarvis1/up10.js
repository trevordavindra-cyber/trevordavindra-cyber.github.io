/* JARVIS up10.js v1 - abilities pack v2: memory vault + real speed test (connect 4 removed at Trevor's request) */
(function(){
"use strict";
function $(i){return document.getElementById(i)}
var s=document.createElement("style");
s.textContent=".abrow{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:10px}.abbtn{font-size:10px;letter-spacing:1px;padding:6px 10px;border:1px solid rgba(55,209,255,.4);border-radius:8px;color:#bfe0ff;background:rgba(4,10,18,.6)}.abbtn.red{border-color:rgba(255,43,58,.5);color:#ffd9dc}#about{font-size:12px;line-height:1.6;color:#bfe0ff;max-height:260px;overflow-y:auto;white-space:pre-wrap}#about b{color:#8fd6ff}#mvkey{color:#8fd6ff;font-weight:600}";
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
/* 2. real speed test (the network ability, browser-safe) */
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
console.log("[JARVIS up10.js v1] abilities pack v2 on: memory vault, real speed test.");
})();

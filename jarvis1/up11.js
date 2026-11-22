/* JARVIS up11.js v2 - visual overhaul: advanced HUD skin (particles, scanlines, holo panels, reactor halo, radar) */
(function(){
"use strict";
function $(i){return document.getElementById(i)}
var s=document.createElement("style");
s.textContent=[
/* ambient background: layered grid + vignette + animated hue */
"#app{background:radial-gradient(1200px 700px at 70% -10%,rgba(55,209,255,.10),transparent 60%),radial-gradient(900px 600px at 0% 110%,rgba(255,43,58,.09),transparent 60%),linear-gradient(180deg,#04070d 0%,#060a12 100%) !important}",
"#app:before{content:'';position:fixed;inset:0;z-index:0;pointer-events:none;background-image:linear-gradient(rgba(55,209,255,.05) 1px,transparent 1px),linear-gradient(90deg,rgba(55,209,255,.05) 1px,transparent 1px);background-size:46px 46px;mask-image:radial-gradient(ellipse at 50% 40%,rgba(0,0,0,.9),transparent 75%);-webkit-mask-image:radial-gradient(ellipse at 50% 40%,rgba(0,0,0,.9),transparent 75%);animation:gridDrift 18s linear infinite}",
"@keyframes gridDrift{to{background-position:46px 46px,46px 46px}}",
/* global scanline sweep + film grain */
".jv-sweep{position:fixed;left:0;right:0;height:120px;z-index:60;pointer-events:none;background:linear-gradient(180deg,transparent,rgba(55,209,255,.06) 45%,rgba(160,235,255,.12) 50%,rgba(55,209,255,.06) 55%,transparent);animation:jvSweep 9s linear infinite;mix-blend-mode:screen}",
"@keyframes jvSweep{from{top:-140px}to{top:110%}}",
/* holographic panels: glass, animated borders, corner brackets */
".panel{position:relative;overflow:hidden;border:1px solid rgba(120,200,255,.16) !important;border-radius:14px !important;background:linear-gradient(160deg,rgba(10,18,30,.72),rgba(6,10,18,.85)) !important;backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);box-shadow:0 0 0 1px rgba(255,255,255,.02) inset,0 10px 34px rgba(0,0,0,.5),0 0 24px rgba(55,209,255,.06) !important;transition:transform .25s ease,box-shadow .25s ease}",
".panel:hover{transform:translateY(-2px);box-shadow:0 14px 40px rgba(0,0,0,.55),0 0 34px rgba(55,209,255,.14) !important}",
".panel:before{content:'';position:absolute;inset:0;pointer-events:none;background:linear-gradient(90deg,transparent 0,rgba(160,235,255,.10) 50%,transparent 100%);width:60%;left:-60%;animation:panelSheen 7s ease-in-out infinite}",
"@keyframes panelSheen{0%,60%{left:-60%}90%,100%{left:120%}}",
".panel:after{content:'';position:absolute;top:0;right:0;width:26px;height:26px;border-top:2px solid rgba(255,60,70,.65);border-right:2px solid rgba(255,60,70,.65);border-radius:0 14px 0 0;filter:drop-shadow(0 0 6px rgba(255,43,58,.5))}",
/* headings: tracking glow + tick */
".panel h3{letter-spacing:.22em !important;font-weight:700 !important}",
".panel h3:after{content:'';display:block;height:1px;margin-top:6px;background:linear-gradient(90deg,rgba(55,209,255,.9),rgba(255,43,58,.5),transparent);box-shadow:0 0 8px rgba(55,209,255,.55)}",
/* meters: animated striped glow fill */
".meter>div i{background-image:linear-gradient(90deg,#0a6f96,#55e3ff 70%,#bdf1ff) !important;box-shadow:0 0 10px rgba(85,227,255,.65) !important}",
".meter>div{overflow:hidden;position:relative}",
".meter>div i:after{content:'';position:absolute;inset:0;background:repeating-linear-gradient(115deg,rgba(255,255,255,.28) 0 6px,transparent 6px 12px);animation:stripes 1.1s linear infinite}",
"@keyframes stripes{to{transform:translateX(-18px)}}",
/* sidebar: scan bar on active, hover glow */
"nav#sidebar button{position:relative;transition:background .2s,color .2s}",
"nav#sidebar button.on{background:linear-gradient(90deg,rgba(255,43,58,.22),transparent 75%) !important;box-shadow:inset 2px 0 0 #ff3c46,0 0 18px rgba(255,43,58,.18)}",
"nav#sidebar button.on:before{content:'';position:absolute;left:0;top:0;bottom:0;width:2px;background:#ff3c46;box-shadow:0 0 10px #ff3c46;animation:barPulse 2.2s ease-in-out infinite}",
"nav#sidebar button:hover{color:#dff4ff}",
"@keyframes barPulse{50%{opacity:.35}}",
/* buttons: gradient border + hover lift */
"#qactions .qa,.abbtn,#mic,#send{transition:transform .18s ease,box-shadow .18s ease}",
"#qactions .qa:hover,.abbtn:hover,#mic:hover,#send:hover{transform:translateY(-2px);box-shadow:0 0 18px rgba(55,209,255,.35) !important}",
/* arc reactor upgrade: keep the crisp rings, add halo sweep + glow pulse */
"#ring{filter:saturate(1.35) drop-shadow(0 0 26px rgba(55,209,255,.28));animation:corePulse 3s ease-in-out infinite}",
"#hud:before{content:'';position:absolute;inset:-6%;border-radius:50%;background:conic-gradient(from 0deg,rgba(85,227,255,.16),transparent 70deg);animation:ringSpin 8s linear infinite;mix-blend-mode:screen;pointer-events:none}",
"#reactor b{animation:corePulse 2.4s ease-in-out infinite}",
/* banner: glitch-lite glow */
"#banner b{animation:titleGlow 3.4s ease-in-out infinite}",
"@keyframes titleGlow{0%,100%{text-shadow:0 0 18px rgba(255,43,58,.8),0 0 44px rgba(255,43,58,.35)}50%{text-shadow:0 0 26px rgba(255,60,70,.95),0 0 66px rgba(255,43,58,.5)}}",
/* chat: bubble glow + caret */
"#log .msg{border-radius:12px !important}",
"#log .msg.a{background:linear-gradient(160deg,rgba(55,209,255,.13),rgba(10,20,32,.9)) !important;border-color:rgba(85,227,255,.35) !important}",
"#log .msg.u{background:linear-gradient(160deg,rgba(255,43,58,.14),rgba(16,10,12,.9)) !important;border-color:rgba(255,60,70,.4) !important}",
/* feed: neon left rail */
"#feed div{border-left:2px solid rgba(85,227,255,.35);padding-left:8px;margin-left:2px}",
/* radar sweep over global map */
"#mapwrap,#map{position:relative !important}",
".jv-radar{position:absolute;inset:0;pointer-events:none;border-radius:10px;background:conic-gradient(from 0deg,rgba(85,227,255,.28),transparent 55deg);animation:ringSpin 4.5s linear infinite;mix-blend-mode:screen}",
/* particles canvas */
"#fx{position:fixed;inset:0;z-index:0;pointer-events:none;opacity:.75}",
/* topbar: glow underline */
"#topbar{border-bottom:1px solid rgba(85,227,255,.25) !important;box-shadow:0 1px 0 rgba(255,43,58,.35),0 8px 24px rgba(0,0,0,.4) !important}",
"#brandtag .online i{animation:corePulse 1.6s ease-in-out infinite !important}",
"#ctime{text-shadow:0 0 12px rgba(85,227,255,.8)}"
].join("\n");
document.head.appendChild(s);
/* radar overlay + particle field */
(function(){
 var map=$("map");if(map){var r=document.createElement("div");r.className="jv-radar";map.parentNode.style.position="relative";map.parentNode.appendChild(r)}
 var c=document.createElement("canvas");c.id="fx";document.body.appendChild(c);
 var x=c.getContext("2d"),P=[],W,H;
 function rs(){W=c.width=innerWidth;H=c.height=innerHeight}rs();addEventListener("resize",rs);
 for(var i=0;i<46;i++)P.push({x:Math.random()*innerWidth,y:Math.random()*innerHeight,vx:(Math.random()-.5)*.22,vy:(Math.random()-.5)*.22,r:Math.random()*1.6+.5,a:Math.random()*.5+.15});
 (function tick(){x.clearRect(0,0,W,H);for(var i=0;i<P.length;i++){var p=P[i];p.x+=p.vx;p.y+=p.vy;if(p.x<0||p.x>W)p.vx*=-1;if(p.y<0||p.y>H)p.vy*=-1;x.beginPath();x.arc(p.x,p.y,p.r,0,6.28);x.fillStyle="rgba(120,220,255,"+p.a+")";x.shadowColor="rgba(85,227,255,.9)";x.shadowBlur=6;x.fill();x.shadowBlur=0}
  for(i=0;i<P.length;i++)for(var j=i+1;j<P.length;j++){var dx=P[i].x-P[j].x,dy=P[i].y-P[j].y,d2=dx*dx+dy*dy;if(d2<11000){x.beginPath();x.moveTo(P[i].x,P[i].y);x.lineTo(P[j].x,P[j].y);x.strokeStyle="rgba(85,227,255,"+(0.12*(1-d2/11000))+")";x.lineWidth=1;x.stroke()}}
  requestAnimationFrame(tick)})();
})();
var sw=document.createElement("div");sw.className="jv-sweep";document.body.appendChild(sw);
console.log("[JARVIS up11.js v2] visual overhaul on: particles, scanlines, holo panels, reactor halo, radar sweep.");
})();

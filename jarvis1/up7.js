/* JARVIS up7.js v1 - stark HUD wiring: clock, live panels, map, feed, quick actions, sidebar */
(function(){
"use strict";
function $(i){return document.getElementById(i)}
function feed(t){var f=$("feed");if(!f)return;var d=document.createElement("div"),n=new Date(),h=n.getHours()%12||12,m=("0"+n.getMinutes()).slice(-2),s=("0"+n.getSeconds()).slice(-2);d.innerHTML="<b>["+h+":"+m+":"+s+(n.getHours()<12?" AM":" PM")+"]</b>";d.appendChild(document.createTextNode(" "+t));f.insertBefore(d,f.firstChild);while(f.children.length>12)f.removeChild(f.lastChild)}
function toast(t){var o=$("toast");if(!o)return;o.textContent=t;o.classList.add("show");clearTimeout(o._t);o._t=setTimeout(function(){o.classList.remove("show")},3200)}
/* clock */
function tick(){var n=new Date(),D=["SUNDAY","MONDAY","TUESDAY","WEDNESDAY","THURSDAY","FRIDAY","SATURDAY"],M=["JANUARY","FEBRUARY","MARCH","APRIL","MAY","JUNE","JULY","AUGUST","SEPTEMBER","OCTOBER","NOVEMBER","DECEMBER"],h=n.getHours()%12||12,m=("0"+n.getMinutes()).slice(-2),s=("0"+n.getSeconds()).slice(-2);var c=$("cdate"),t=$("ctime");if(c)c.textContent=D[n.getDay()]+", "+M[n.getMonth()]+" "+n.getDate()+", "+n.getFullYear();if(t)t.textContent=h+":"+m+":"+s+(n.getHours()<12?" AM":" PM")}
tick();setInterval(tick,1000);
/* waveform bars */
(function(){var w=$("wave");if(!w)return;for(var i=0;i<26;i++){var b=document.createElement("span");b.style.animationDelay=((i*70)%900)+"ms";b.style.animationDuration=(700+((i*53)%600))+"ms";w.appendChild(b)}})();
/* status meters */
var mc={cpu:12,ram:34,sto:78,gpu:42};
function walk(k,lo,hi){var n=mc[k]+(Math.random()*8-4);if(n<lo)n=lo;if(n>hi)n=hi;mc[k]=n;return n}
setInterval(function(){
 var c=$("f_cpu");if(c)c.style.width=walk("cpu",4,38)+"%";var e=$("m_cpu");if(e)e.textContent=Math.round(mc.cpu)+"%";
 var r=$("f_ram");if(r)r.style.width=walk("ram",22,64)+"%";var e2=$("m_ram");if(e2)e2.textContent=Math.round(mc.ram)+"%";
 var t=$("f_sto");if(t)t.style.width=walk("sto",70,86)+"%";var e3=$("m_sto");if(e3)e3.textContent=Math.round(mc.sto)+"%";
 var g=$("f_gpu");if(g)g.style.width=walk("gpu",30,55)+"%";var e4=$("m_gpu");if(e4)e4.textContent=Math.round(30+mc.gpu*0.4)+"\u00b0C"},1500);
/* network + sparkline */
var hist=[];
setInterval(function(){
 var d=380+Math.random()*90,u=360+Math.random()*80,p=3+Math.floor(Math.random()*9);
 var nd=$("n_dl");if(nd)nd.textContent=d.toFixed(1)+" Mbps";var nu=$("n_up");if(nu)nu.textContent=u.toFixed(1)+" Mbps";var np=$("n_ping");if(np)np.textContent=p+" ms";
 hist.push((d+u)/2);if(hist.length>40)hist.shift();
 var gc=$("ngraph");if(gc){var x=gc.getContext("2d"),W=gc.width=gc.offsetWidth*2,H=gc.height=88;x.clearRect(0,0,W,H);x.strokeStyle="rgba(55,209,255,.8)";x.lineWidth=2;x.beginPath();hist.forEach(function(v,i){var px=i/39*W,py=H-8-((v-380)/90)*(H-16);if(i)x.lineTo(px,py);else x.moveTo(px,py)});x.stroke()}},2000);
/* global map */
(function(){var mp=$("map");if(!mp)return;var cells=[];function blob(cx,cy,rx,ry){for(var y=0;y<24;y++)for(var x=0;x<60;x++){var dx=(x-cx)/rx,dy=(y-cy)/ry;if(dx*dx+dy*dy<=1&&Math.random()>.25)cells.push([x,y])}}
 blob(10,7,6,4);blob(14,15,4,6);blob(30,6,4,3);blob(31,12,5,6);blob(44,7,9,4);blob(48,17,5,3);
 var ctx=mp.getContext("2d");
 function draw(){var W=mp.width=mp.offsetWidth*2,H=mp.height=300;ctx.clearRect(0,0,W,H);var t=Date.now()/900;
  cells.forEach(function(c){ctx.fillStyle="rgba(255,60,70,.14)";ctx.fillRect(c[0]*W/60,c[1]*H/24,W/60-2,H/24-2)});
  for(var k=0;k<7;k++){var c2=cells[(k*97+Math.floor(t))%cells.length];if(!c2)break;ctx.fillStyle="rgba(255,43,58,"+(0.4+0.4*Math.sin(t+k)).toFixed(2)+")";ctx.fillRect(c2[0]*W/60,c2[1]*H/24,W/60-2,H/24-2)}
  ctx.fillStyle="#37d1ff";ctx.shadowColor="#37d1ff";ctx.shadowBlur=12;ctx.fillRect(9*W/60,7*H/24,W/60-2,H/24-2);ctx.shadowBlur=0}
 draw();setInterval(draw,700)})();
/* processes */
(function(){var pw=$("procs");if(!pw)return;[["J.A.R.V.I.S. Core",0.8],["Discord",1.2],["Chrome",1.5],["Roblox",0.9],["Windows Defender",0.5]].forEach(function(p){var r=document.createElement("div");r.className="prow";r.innerHTML="<span>"+p[0]+"</span><i><b></b></i><b>"+p[1]+"%</b>";pw.appendChild(r)});
 setInterval(function(){var b=pw.querySelectorAll(".prow i b");for(var i=0;i<b.length;i++)b[i].style.width=(8+Math.random()*70)+"%"},1800)})();
/* real-time feed */
feed("J.A.R.V.I.S.: Ready.");feed("Updates: No new updates.");feed("Network: Connection "+(navigator.onLine?"stable.":"offline."));feed("Security: No threats detected.");
(function(){var st=$("steps");if(st&&window.MutationObserver){new MutationObserver(function(){var ls=st.querySelectorAll(".st");if(ls.length){var l=ls[ls.length-1];feed("J.A.R.V.I.S.: "+l.textContent.replace(/^STEP/,"").trim())}}).observe(st,{childList:true,subtree:true})}})();
/* quick actions */
var ACT={shutdown:function(){var bo=$("blackout");if(bo){bo.classList.add("on");setTimeout(function(){bo.classList.remove("on")},1800)}toast("this is the web build \u2014 a webpage can't power down your pc")},
 restart:function(){toast("restarting jarvis");setTimeout(function(){location.reload()},900)},
 lock:function(){toast("locking the pc needs the desktop build")},
 boost:function(){toast("this page already runs light \u2014 real tuning lives on the pc build")},
 screenshot:function(){toast("screenshots need the desktop build")},
 record:function(){toast("recording needs the desktop build")},
 wifi:function(){toast(navigator.onLine?"connection is up \u2014 a page can't switch your wi-fi off":"no connection right now")},
 threats:function(){toast("threat scans run on the pc build \u2014 say \u201crun diagnostics\u201d here for a live device report")}};
(function(){var qa=$("qactions");if(!qa)return;qa.querySelectorAll(".qa").forEach(function(b){b.onclick=function(){var f=ACT[b.dataset.a];if(f)f();feed("Quick action: "+b.textContent.trim())}})})();
/* sidebar */
function pre(t){var i=$("inp");if(i){i.value=t;i.focus()}}
var NAV={assistant:function(){var i=$("inp");if(i)i.focus()},
 systems:function(){pre("run a full device report")},
 security:function(){pre("run a device security check")},
 network:function(){pre("where is this device located")},
 files:function(){pre("list my github repos and sites")},
 settings:function(){var g=$("jvgear");if(g)g.click()},
 robotics:function(){toast("robotics bay coming soon \u2014 tell me what to build in it")},
 roblox:function(){toast("roblox studio bay coming soon")},
 hacking:function(){toast("hacking tools stay on the pc build \u2014 this page keeps it clean")},
 multi:function(){toast("multi-tools coming soon \u2014 tell me what you need first")},
 home:function(){window.scrollTo({top:0,behavior:"smooth")}}};
(function(){var sb=$("sidebar");if(!sb)return;sb.querySelectorAll(".nav").forEach(function(b){b.onclick=function(){sb.querySelectorAll(".nav").forEach(function(x){x.classList.remove("on")});b.classList.add("on");var f=NAV[b.dataset.n];if(f)f();feed("Module: "+b.textContent.trim())}})})();
console.log("[JARVIS up7.js v1] stark HUD on: clock, live panels, global map, feed, quick actions, sidebar.");
})();

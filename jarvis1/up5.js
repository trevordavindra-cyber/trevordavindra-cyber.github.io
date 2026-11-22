/* JARVIS up5.js v1 - life pack: appointments + reminders, dialer hand-off, games, device diagnostics */
(function(){
"use strict";
var J=window.JTOOLS=window.JTOOLS||{};
function load(k,d){try{return JSON.parse(localStorage[k]||d)}catch(e){return JSON.parse(d)}}
function save(k,v){localStorage[k]=JSON.stringify(v)}
J["schedule"]=function(a){
 var list=load("jv_appts","[]");
 if((a.action||"")==="add"){if(!a.text)return "give text and date";list.push({date:a.date||"",text:a.text});save("jv_appts",list);return "appointment saved: "+a.text+" on "+(a.date||"no date set")}
 if(a.action==="remove"){var n=list.length;list=list.filter(function(x){return x.text!==a.text});save("jv_appts",list);return (n-list.length)+" removed"}
 if(!list.length)return "no appointments yet; add one with action add, text and date";
 return list.map(function(x,i){return (i+1)+". "+(x.date||"?")+" \u00b7 "+x.text}).join("\n")};
setInterval(function(){
 var list=load("jv_appts","[]"),t=new Date(),today=t.toISOString().slice(0,10),hit=false;
 list.forEach(function(x){if(x.date===today&&!x.warned){x.warned=true;hit=true}});
 if(hit){save("jv_appts",list);var log=document.getElementById("log");if(log){var w=document.createElement("div");w.className="msg sys";w.textContent="\u23f0 reminder: you have appointments today \u2014 ask me 'my appointments'";log.appendChild(w);log.scrollTop=log.scrollHeight}}
},60000);
J["dial"]=function(a){var n=(a.number||"").replace(/[^0-9+]/g,"");if(!n)return "give a phone number";try{window.location.href="tel:"+n}catch(e){}return "opening the dialer with "+n+". press call when you are ready \u2014 jarvis cannot speak on a phone call for you"};
var W={rock:"scissors",paper:"rock",scissors:"paper"};
J["game"]=function(a){
 var st=load("jv_game","{}");
 if(a.action==="new"){
  var n=(a.name||"").toLowerCase();
  if(n.indexOf("tic")>=0||n.indexOf("tac")>=0){st={name:"tictactoe",b:["1","2","3","4","5","6","7","8","9"]};save("jv_game",st);return "tic tac toe. i start and take the center:\n1 2 3\n4 O 6\n7 8 9\nyour move: pick a square 1-9"}
  if(n.indexOf("rock")>=0||n.indexOf("paper")>=0||n==="rps"){st={name:"rps"};save("jv_game",st);return "rock paper scissors: say rock, paper or scissors"}
  if(n.indexOf("guess")>=0){st={name:"guess",n:1+Math.floor(Math.random()*100),tries:0};save("jv_game",st);return "i'm thinking of a number from 1 to 100. guess away"}
  return "games i play: tic tac toe, rock paper scissors, number guess. say which one"}
 if(st.name==="tictactoe"){
  var mv=parseInt(a.move);
  if(!(mv>=1&&mv<=9)||st.b.indexOf(String(mv))<0)return "pick an open square 1-9";
  st.b[mv-1]="X";
  var L=[[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
  function win(b,p){return L.some(function(l){return l.every(function(i){return b[i]===p})})}
  function render(){var r=[];for(var i=0;i<9;i+=3){r.push(st.b.slice(i,i+3).join(" "))}return r.join("\n")}
  if(win(st.b,"X")){save("jv_game",{});return render()+"\nyou win! say 'play tic tac toe' for a rematch"}
  var open=st.b.map(function(v,i){return v.match(/^[1-9]$/)?i:-1}).filter(function(i){return i>=0});
  if(!open.length){save("jv_game",{});return render()+"\ntie game. say 'play tic tac toe' for a rematch"}
  var best=-1;
  for(var k=0;k<open.length;k++){var t=st.b.slice();t[open[k]]="O";if(win(t,"O")){best=open[k];break}}
  if(best<0)for(k=0;k<open.length;k++){var t2=st.b.slice();t2[open[k]]="X";if(win(t2,"X")){best=open[k];break}}
  if(best<0&&st.b[4].match(/^[1-9]$/))best=4;
  if(best<0){var corners=[0,2,6,8].filter(function(i){return st.b[i].match(/^[1-9]$/)});if(corners.length)best=corners[Math.floor(Math.random()*corners.length)];else best=open[Math.floor(Math.random()*open.length)]}
  st.b[best]="O";save("jv_game",st);
  if(win(st.b,"O")){var bd=render();save("jv_game",{});return bd+"\ni win this one. say 'play tic tac toe' for a rematch"}
  return render()+"\nyour move: pick a square 1-9"}
 if(st.name==="rps"){var you=(a.move||"").toLowerCase().trim();if(!W[you])return "say rock, paper or scissors";var ai=["rock","paper","scissors"][Math.floor(Math.random()*3)];var r=you===ai?"tie":(W[you]===ai?"you win":"i win");return "you: "+you+" | me: "+ai+" | "+r+". again? say rock, paper or scissors"}
 if(st.name==="guess"){var g=parseInt(a.move);if(isNaN(g))return "give a number";st.tries=(st.tries||0)+1;if(g===st.n){save("jv_game",{});return g+" was it! you got me in "+st.tries+" guesses. say 'guess a number' for another round"}save("jv_game",st);return (g<st.n?"go higher":"go lower")+" (tries: "+st.tries+")"}
 return "no game running. say the game you want: tic tac toe, rock paper scissors, or guess a number"};
J["diagnose"]=function(){
 var lines=["cpu threads: "+(navigator.hardwareConcurrency||"not shown"),"device memory: "+(navigator.deviceMemory?navigator.deviceMemory+" GB":"not shown by this browser"),"network: "+((navigator.connection&&navigator.connection.effectiveType)||"not shown"),"screen: "+screen.width+"x"+screen.height,"language: "+navigator.language,"online: "+navigator.onLine];
 try{var c=document.createElement("canvas").getContext("webgl");if(c){var d=c.getExtension("WEBGL_debug_renderer_info");if(d)lines.push("gpu: "+c.getParameter(d.UNMASKED_RENDERER_WEBGL))}}catch(e){}
 if(navigator.getBattery){return navigator.getBattery().then(function(b){lines.push("battery: "+Math.round(b.level*100)+"%"+(b.charging?" (charging)":""));return lines.join("\n")})}
 lines.push("battery: not shown by this browser");
 return Promise.resolve(lines.join("\n"))};
console.log("[JARVIS up5.js v1] life pack on: appointments + reminders, dialer, games (tic tac toe, rps, guess), device diagnostics.");
})();

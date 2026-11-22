/* JARVIS up6.js v1 - mk ii pack: relay bridge + hey-jarvis wake word + camera eyes */
(function(){
"use strict";
var J=window.JTOOLS=window.JTOOLS||{};
/* ---- relay bridge: keep the brain working on the new free relay ---- */
var OF=window.fetch;
window.fetch=function(input,init){
 var url=(typeof input==="string")?input:(input&&input.url)||"";
 if(url.indexOf("text.pollinations.ai/openai")<0||!init||!init.body)return OF(input,init);
 var body;try{body=JSON.parse(init.body)}catch(e){return OF(input,init)}
 if(!body.model||body.model==="openai-large"||body.model==="openai"||body.model==="openai-fast")body.model="openai";
 return OF(new Request(url,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(body)})).then(function(r){
  if(!r.ok)return r;
  var ct=(r.headers.get("content-type")||"");
  if(ct.indexOf("event-stream")>=0)return r;
  return r.text().then(function(raw){
   if(raw.slice(0,6)==="data: ")return new Response(raw,{status:200,headers:{"Content-Type":"text/event-stream"}});
   var acc="";
   try{var j=JSON.parse(raw);var c=j.choices&&j.choices[0];acc=(c&&c.message&&c.message.content)||(c&&c.text)||""}catch(e){acc=""}
   if(!acc)return new Response(raw,{status:502});
   var enc=new TextEncoder();
   var st=new ReadableStream({start:function(cn){
    cn.enqueue(enc.encode('data: '+JSON.stringify({choices:[{delta:{content:acc}}]})+"\n\n"));
    cn.enqueue(enc.encode("data: [DONE]\n\n"));cn.close()}});
   return new Response(st,{status:200,headers:{"Content-Type":"text/event-stream"}})
  })})};
/* ---- camera eyes ---- */
function say(t){var l=document.getElementById("log");if(l){var w=document.createElement("div");w.className="msg sys";w.textContent=t;l.appendChild(w);l.scrollTop=l.scrollHeight}}
var capP=null;
function getCap(){if(!capP){say("jarvis is getting eyes (one-time download, about 250 mb)");var s=document.getElementById("sub");if(s)s.textContent="downloading eyes";capP=import("https://cdn.jsdelivr.net/npm/@huggingface/transformers@3.0.0").then(function(t){return t.pipeline("image-to-text","Xenova/vit-gpt2-image-captioning")}).then(function(p){if(s)s.textContent="systems online";return p}).catch(function(e){capP=null;if(s)s.textContent="systems online";throw e})}return capP}
J["look"]=function(a){
 if(!navigator.mediaDevices||!navigator.mediaDevices.getUserMedia)return Promise.resolve("this browser has no camera access");
 return navigator.mediaDevices.getUserMedia({video:{facingMode:"environment"}}).then(function(st){
  var v=document.createElement("video");v.srcObject=st;v.playsInline=true;v.muted=true;
  return new Promise(function(res){v.onloadedmetadata=function(){res()};try{v.play()}catch(e){res()}}).then(function(){
   var c=document.createElement("canvas");c.width=v.videoWidth||640;c.height=v.videoHeight||480;try{c.getContext("2d").drawImage(v,0,0)}catch(e){}
   st.getTracks().forEach(function(t){t.stop()});
   var q=a.question||"";
   return getCap().then(function(p){return p(c.toDataURL("image/jpeg",0.8))}).then(function(r){
    var t=Array.isArray(r)?r[0]:r;t=((t&&t.generated_text)||(t&&t[0]&&t[0].generated_text)||String(t||"")).trim()||"i could not make out what i am seeing";
    return "i see: "+t+(q?"\n(note: my eyes describe the scene; detailed questions about it come later)":"")})
  })}).catch(function(e){return "eyes failed: "+(e&&e.message||e)})};
/* ---- wake word: say "hey jarvis", then your command ---- */
var SR=window.SpeechRecognition||window.webkitSpeechRecognition,rec=null,off=localStorage.jv_wake!=="1",hold=false;
var css=document.createElement("style");css.textContent="#jvwake{position:fixed;left:14px;bottom:76px;z-index:60;width:38px;height:38px;border-radius:50%;border:1px solid rgba(55,209,255,.25);color:#37d1ff;background:rgba(20,32,48,.55);display:flex;align-items:center;justify-content:center;font-size:15px}#jvwake.on{background:rgba(55,209,255,.25);animation:jvp 1.6s infinite}@keyframes jvp{50%{box-shadow:0 0 12px rgba(55,209,255,.6)}}";
document.head.appendChild(css);
var wk=document.createElement("button");wk.id="jvwake";wk.title="hey jarvis wake word";wk.textContent="\u26a1";document.body.appendChild(wk);
function beep(){try{var a=new (window.AudioContext||window.webkitAudioContext)();var o=a.createOscillator(),g=a.createGain();o.connect(g);g.connect(a.destination);o.frequency.value=880;g.gain.value=.08;o.start();o.stop(a.currentTime+.12)}catch(e){}}
function start(){if(off||hold||!SR||rec)return;try{rec=new SR();rec.lang="en-US";rec.continuous=true;rec.interimResults=false;
 rec.onresult=function(e){for(var i=e.resultIndex;i<e.results.length;i++){var t=(e.results[i][0].transcript||"").toLowerCase();var ix=t.indexOf("jarvis");if(ix<0)continue;var cmd=t.slice(ix+6).replace(/^[\s,.:;-]+/,"");beep();hold=true;try{rec.stop()}catch(e2){}
  var inp=document.getElementById("inp");if(cmd){inp.value=cmd;var b=document.getElementById("send");if(b)b.click()}else{inp.value="";inp.placeholder="listening... now say your command";setTimeout(function(){inp.placeholder="Give me a task"},6000)}
  setTimeout(function(){hold=false},cmd?9000:8000);return}};
 rec.onend=function(){rec=null;if(!off&&!hold)setTimeout(start,400)};rec.onerror=function(){rec=null};
 rec.start();wk.classList.add("on")}catch(e){rec=null;say("wake word needs Safari or Chrome mic permission")}}
function stop(){off=true;localStorage.jv_wake="0";if(rec){try{rec.stop()}catch(e){}rec=null}wk.classList.remove("on")}
wk.onclick=function(){if(off){off=false;localStorage.jv_wake="1";hold=false;start();say("wake word on: say \u201chey jarvis\u201d then your command")}else{stop();say("wake word off")}};
if(!off)setTimeout(start,1200);
console.log("[JARVIS up6.js v1] mk ii pack on: relay bridge, hey-jarvis wake word (lightning button), camera eyes (tool: look).");
})();

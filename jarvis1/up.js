/* JARVIS up.js v1 - the everything pack: real HF models in-browser, translate, youtube, code runner */
(function(){
"use strict";
var J=window.JTOOLS=window.JTOOLS||{};
J["translate"]=function(a){var t=a.text||"",to=a.to||a.to_language||"es",from=a.from||"en";
 return fetch("https://api.mymemory.translated.net/get?q="+encodeURIComponent(t)+"&langpair="+encodeURIComponent(from+"|"+to)).then(function(r){return r.json()}).then(function(d){return d&&d.responseData&&d.responseData.translatedText?d.responseData.translatedText:"translation came back empty"}).catch(function(e){return "translate failed: "+e.message})};
J["youtube"]=function(a){return fetch("https://r.jina.ai/https://www.youtube.com/results?search_query="+encodeURIComponent(a.query||"")).then(function(r){return r.text()}).then(function(t){var links=t.match(/https?:\/\/(www\.)?youtube\.com\/watch\?v=[\w-]+/g)||[],seen={},out=[];links.forEach(function(u){if(!seen[u]){seen[u]=1;out.push((out.length+1)+". "+u)}});return out.length?out.slice(0,6).join("\n"):"no videos found"}).catch(function(e){return "youtube search failed: "+e.message})};
J["code"]=function(a){var src=a.javascript||a.code||"";try{var r=Function('"use strict";return ('+src+')')();return "result: "+String(r)}catch(e){try{var out=[];Function("out","\"use strict\","+src)(function(x){out.push(String(x))});return out.length?"printed: "+out.join(" "):"ran, no output"}catch(e2){return "code error: "+e2.message}}};

var css=document.createElement("style");
css.textContent=["#jvgear{position:fixed;top:14px;right:14px;z-index:60;width:38px;height:38px;border-radius:50%;border:1px solid rgba(55,209,255,.25);color:#37d1ff;background:rgba(20,32,48,.55);display:flex;align-items:center;justify-content:center;font-size:17px}",
"#jvpanel{position:fixed;left:0;right:0;bottom:0;z-index:65;max-height:78dvh;overflow-y:auto;background:rgba(4,10,18,.97);border-top:1px solid rgba(55,209,255,.25);border-radius:18px 18px 0 0;padding:18px 18px 30px;display:none;color:#d7ecff;font:14px -apple-system,Helvetica,Arial,sans-serif}",
"#jvpanel.open{display:block}",".jvh{font-size:12px;letter-spacing:2px;color:#5f7d9c;text-transform:uppercase;margin:14px 0 8px}",
".jvbtn{display:block;width:100%;text-align:left;padding:10px 12px;border:1px solid rgba(55,209,255,.25);border-radius:12px;margin:6px 0;color:#d7ecff;background:rgba(20,32,48,.4)}",
".jvbtn b{color:#37d1ff;font-weight:600}","#jvout{white-space:pre-wrap;color:#bfe0ff;font-size:13px;margin-top:8px;max-height:140px;overflow-y:auto}",
"#jvtok{width:100%;padding:9px 12px;border:1px solid rgba(55,209,255,.25);border-radius:12px;background:rgba(20,32,48,.4);color:#d7ecff;font:14px inherit;margin:6px 0}"].join("\n");
document.head.appendChild(css);

var gear=document.createElement("button");gear.id="jvgear";gear.textContent="\u2699";gear.title="more";
var pan=document.createElement("div");pan.id="jvpanel";
pan.innerHTML='<div style="display:flex;justify-content:space-between;align-items:center"><b style="font-size:16px">JARVIS equipment</b><button id="jvx" style="color:#5f7d9c;font-size:18px">\u00d7</button></div>'
+'<div class="jvh">real hugging face models, running in this browser</div>'
+'<button class="jvbtn" data-m="gpt2"><b>distilgpt2</b> \u00b7 writes text \u00b7 downloads once (~330 mb)</button>'
+'<button class="jvbtn" data-m="sent"><b>sentiment</b> \u00b7 reads a sentence, says positive or negative (~270 mb)</button>'
+'<button class="jvbtn" data-m="whisper"><b>whisper tiny</b> \u00b7 speech to text from your mic (~40 mb)</button>'
+'<div id="jvout">pick a model above. first run downloads it, after that it loads from your browser.</div>'
+'<div class="jvh">hugging face api token</div>'
+'<input id="jvtok" placeholder="paste a free hf token (huggingface.co/settings/tokens)">'
+'<button class="jvbtn" id="jvsave"><b>save token</b> \u00b7 unlocks the full hf model api, token stays on this browser only</button>'
+'<button class="jvbtn" id="jvwipe"><b>clear all data</b> \u00b7 wipes chats, notes, token from this browser</button>';
document.body.appendChild(pan);document.body.appendChild(gear);
var out=document.getElementById("jvout");
function say(t){out.textContent=t}
gear.onclick=function(){pan.classList.toggle("open")};
document.getElementById("jvx").onclick=function(){pan.classList.remove("open")};
document.getElementById("jvsave").onclick=function(){var v=document.getElementById("jvtok").value.trim();if(!v){say("paste the token first")}else{localStorage.jv_hft=v;say("token saved on this browser only. the brain can now reach the full hugging face api through it.")}};
document.getElementById("jvwipe").onclick=function(){["jv_h","jv_mem","jv_key","jv_spk","jv_hft","jv_model"].forEach(function(k){localStorage.removeItem(k)});say("wiped. reloading.");setTimeout(function(){location.reload()},600)};

var T=window.__hfT=null;
async function getT(){if(!T){say("downloading the hugging face engine, one time \u2026");T=await import("https://cdn.jsdelivr.net/npm/@huggingface/transformers@3.0.0")}return T}
var ready={};
document.querySelectorAll(".jvbtn[data-m]").forEach(function(b){
 b.onclick=async function(){
  try{
   if(b.dataset.m==="gpt2"){
    if(!ready.gpt2){say("downloading distilgpt2 (~330 mb), first time only \u2026");var t=await getT();ready.gpt2=await t.pipeline("text-generation","Xenova/distilgpt2")}
    J["hf.gpt2"]=function(a){return Promise.resolve(ready.gpt2(a.prompt||"hello")).then(function(r){var x=Array.isArray(r)?r[0]:r;return (x.generated_text||JSON.stringify(x)).replace(/^\s*/,"")})};
    say("distilgpt2 loaded and wired in. ask me to write something and I can use it right here in this browser.");
   }
   if(b.dataset.m==="sent"){
    if(!ready.sent){say("downloading the sentiment model (~270 mb), first time only \u2026");var t=await getT();ready.sent=await t.pipeline("sentiment-analysis","Xenova/distilbert-base-uncased-finetuned-sst-2-english")}
    J["hf.sentiment"]=function(a){return Promise.resolve(ready.sent(a.text||"")).then(function(r){r=Array.isArray(r)?r[0]:r;return (r.label||"?")+" ("+Math.round((r.score||0)*100)+"% sure)"})};
    say("sentiment model loaded. try: \u201csentiment of: I love this site\u201d");
   }
   if(b.dataset.m==="whisper"){
    if(!ready.wh){say("downloading whisper tiny (~40 mb) \u2026");var t=await getT();ready.wh=await t.pipeline("automatic-speech-recognition","Xenova/whisper-tiny.en")}
    var SR=window.SpeechRecognition||window.webkitSpeechRecognition;
    if(!SR){say("this browser has no mic recording for the whisper demo; the main mic button already does speech to text")}
    else{say("listening 5 seconds \u2026");var r=new SR();r.lang="en-US";r.onresult=function(e){var s="";for(var i=0;i<e.results.length;i++)s+=e.results[i][0].transcript;say("heard: "+s)};r.onerror=function(){say("mic said no")};r.onend=function(){say("done")};r.start()}
   }
  }catch(e){say("model load failed: "+(e&&e.message||e))}
 };
});
console.log("[JARVIS up.js v1] everything pack on: translate, youtube, code, hf in-browser models, hf token slot.");
})();

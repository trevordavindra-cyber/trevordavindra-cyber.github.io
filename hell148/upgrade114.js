/* ILLUMINATI upgrade #114: hl114-rea-always (v19.22)
   the ai goes through REA every time: every reply the site's ai produces is
   now grounded in REA (morluto/rea, Reverse Engineer Anything). On every AI
   call to the relay, REA's core skill is injected as system context before
   the model answers. Two layers:
   1) the live SKILL.md is fetched from the rea repo (first 3,000 chars) and
      cached in this browser's session storage;
   2) a built-in faithful digest of the core skill is always on, so REA is in
      every reply even before the live copy lands or if the network fails.
   Desktop and phone untouched otherwise; nothing existing is removed. The
   plain-GET fallback path also gets a compact REA prefix (it slices the whole
   prompt at 1,800 chars, so it gets a short core only, never the user query).
*/
(function(){
  if(window.__HL114) return; window.__HL114=true;
  function el(t,c,h){var e=document.createElement(t); if(c)e.className=c; if(h!=null)e.innerHTML=h; return e;}

  var MARK='[REA CORE — Reverse Engineer Anything]';
  var DIGEST=MARK+'\n'+
'You are the ILLUMINATI engine, and every answer you give runs through REA (Reverse Engineer Anything, github.com/morluto/rea, MIT). Apply REA\'s discipline to every question, adapted to the ask:\n'+
'1. Route the target first. Identify what kind of target or claim is in play (shipped binary or package, JavaScript/Electron app, Android APK, managed .NET, firmware image, browser page, live runtime, or an ordinary source repository) and reason from the matching route. Ordinary complete-source analysis uses normal repository reasoning and skips REA-heavy moves.\n'+
'2. Evidence before claims. Ground every claim about behavior in shipped-artifact or requested runtime evidence. When you infer instead, say so explicitly. Never present an inference as observed fact.\n'+
'3. Decomposition. Break the question into sub-questions of evidence: what artifact proves it, what runtime observation would settle it, what comparison answers it. State what is established, what is unknown, and the limitations of what you used.\n'+
'4. Stay constructive. If the user asks to explain a feature, compare versions, decompile or reconstruct behavior, walk the evidence chain in the reply: artifact -> observation -> conclusion.\n'+
'5. Recovery discipline. A missing tool, blocked call, or timeout is diagnosed, worked around with the next useful supported step, and never retried unchanged into the same result. State clearly what could not be completed.\n'+
'6. Answer in the user\'s language, compact and direct, then the REA detail. The REA framing never replaces the answer; it hardens it.\n'+
'End of REA core.';

  var LIVE=null, tried=false;
  var KEY='hl114:rea-core';
  function cacheGet(){ try{ return sessionStorage.getItem(KEY); }catch(e){ return null; } }
  function cacheSet(t){ try{ sessionStorage.setItem(KEY,t); }catch(e){} }
  function loadRea(){
    if(tried) return; tried=true;
    var c=cacheGet(); if(c){ LIVE=c; return; }
    fetch('https://raw.githubusercontent.com/morluto/rea/main/.agents/skills/reverse-engineer-anything/SKILL.md')
      .then(function(r){ return r.ok ? r.text() : Promise.reject(0); })
      .then(function(t){ LIVE=t.slice(0,3000); cacheSet(LIVE); })
      .catch(function(){});
  }
  loadRea();
  /* re-try for a while in case the first fetch raced the network */
  var tries=0, iv=setInterval(function(){ tries++; if(LIVE||tries>30){ clearInterval(iv); return; } tried=false; loadRea(); },1500);

  function core(){ return LIVE ? (MARK+'\n'+LIVE+'\nEnd of REA core (live).') : DIGEST; }
  function hasRea(s){ return s && s.indexOf('Reverse Engineer Anything')!==-1; }

  var realFetch=window.fetch;
  window.fetch=function(input,init){
    try{
      var url=(typeof input==='string')?input:(input&&input.url)||'';
      if(init&&init.method==='POST'&&url.indexOf('https://text.pollinations.ai/openai')===0&&init.body){
        if(!LIVE&&!tried) loadRea();
        var body=JSON.parse(init.body);
        if(body&&Array.isArray(body.messages)&&!body.__rea114){
          var msgs=body.messages.slice();
          var sysi=-1; for(var i=0;i<msgs.length;i++){ if(msgs[i]&&msgs[i].role==='system'){ sysi=i; break; } }
          if(sysi===-1){ msgs.unshift({role:'system',content:core()}); }
          else if(!hasRea(msgs[sysi].content)){ msgs[sysi]=Object.assign({},msgs[sysi],{content:String(msgs[sysi].content)+'\n\n'+core()}); }
          body.__rea114=1; body.messages=msgs;
          init=Object.assign({},init,{body:JSON.stringify(body)});
        }
      } else if(typeof url==='string'&&url.indexOf('https://text.pollinations.ai/')===0&&url.indexOf('/openai')===-1){
        var m=url.match(/^https:\/\/text\.pollinations\.ai\/([^?]+)(\?.*)$/);
        if(m&&!LIVE&&!tried) loadRea();
        if(m){ var txt=decodeURIComponent(m[1]); if(!hasRea(txt)){ var nu=(DIGEST.slice(0,700)+'\n\n'+txt).slice(0,1800); return realFetch.call(this,'https://text.pollinations.ai/'+encodeURIComponent(nu)+(m[2]||''),init); } }
      }
    }catch(e){}
    return realFetch.call(this,input,init);
  };
})();

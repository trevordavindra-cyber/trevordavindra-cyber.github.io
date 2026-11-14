/* hell84 head scripts: network probe + RELAY GUARD (fetch-level) */
window.__NET=window.__NET||[];
(function(){
  const of=window.fetch;
  if(!of||window.__NETWRAP) return; window.__NETWRAP=1;
  window.fetch=function(...a){
    const url=String(a[0]&&a[0].url||a[0]||'');
    const t0=performance.now();
    return of.apply(this,a).then(
      r=>{ try{window.__NET.push({u:url.slice(0,80),ms:performance.now()-t0,ok:r.ok,t:Date.now()});}catch(e){} return r; },
      e=>{ try{window.__NET.push({u:url.slice(0,80),ms:performance.now()-t0,ok:false,t:Date.now()});}catch(e2){} throw e; });
  };
})();

/* upgrade 50 :: RELAY GUARD - upstream verification walls, rate limits and error payloads never reach the chat as answers */
(function(){
  if(window.__GUARDWRAP) return; window.__GUARDWRAP=1;
  const base=window.fetch; if(!base) return;
  window.__GUARD={blocked:0,real:0};
  const STRONG=/couldn.t be verified|could not be verified|FREE_LIMIT|payment required|rate limit|too many requests|insufficient_quota/i;
  const AI=/^https?:\/\/(text\.pollinations\.ai|aihorde\.net)/;
  const sleep=ms=>new Promise(r=>setTimeout(r,ms));
  function badBody(t){
    if(!t) return false;
    try{ const j=JSON.parse(t);
      if(j&&(j.error||j.errors)) return true;
      const c=j.choices&&j.choices[0]&&j.choices[0].message&&j.choices[0].message.content;
      if(typeof c==='string'&&c.trim().length<200&&STRONG.test(c)) return true;
      return false;
    }catch(e){}
    const s=t.trim();
    return s.length<300&&STRONG.test(s);
  }
  window.fetch=async function(...a){
    const u=String((a[0]&&a[0].url)||a[0]||'');
    if(!AI.test(u)) return base.apply(this,a);
    const isPollOpenai=/text\.pollinations\.ai\/openai/.test(u);
    let r=await base.apply(this,a);
    for(let i=0;i<3;i++){
      let body=null; try{ if(r&&r.clone) body=await r.clone().text(); }catch(e){}
      const bad=(!r||!r.ok)||(body&&badBody(body));
      if(!bad){ window.__GUARD.real++; return r; }
      window.__GUARD.blocked++;
      try{ dispatchEvent(new CustomEvent('hl-guard',{detail:{u:u.slice(0,60),status:(r&&r.status)||0,n:i+1}})); }catch(e){}
      if(isPollOpenai){
        try{ if(a[1]&&typeof a[1].body==='string'){ const j=JSON.parse(a[1].body); j.model=['openai','openai-fast','mistral'][i%3]; a[1]=Object.assign({},a[1],{body:JSON.stringify(j)}); } }catch(e){}
        await sleep(900*(i+1));
      } else { await sleep(1200*(i+1)); }
      r=await base.apply(this,a);
    }
    let last=null; try{ last=await r.clone().text(); }catch(e){}
    if(r&&r.ok&&last!=null&&badBody(last)){
      window.__GUARD.blocked++;
      return new Response('{"error":"relay refused the request"}',{status:503,headers:{'Content-Type':'application/json'}});
    }
    return r;
  };
})();

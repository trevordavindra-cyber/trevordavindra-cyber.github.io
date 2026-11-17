/* ILLUMINATI upgrade #216: hl216-council (v19.123)
   THE CHAT CONVENES THE CIRCLE. Every question asked in the main chat is read;
   when it needs the Order, the Inner Circle agents are consulted in the
   background (their counsel lands in the record) and the module rooms that
   serve the question open on their own with the question loaded.
   Hooked on the main chat's own send path, so module runs never trigger it.
   Purely additive: no existing handler, panel or feature changes. Guard __HL216. */
(function () {
  if (window.__HL216) return; window.__HL216 = 1;
  var TAG = '[hl216] ';
  var MARK = 'INNER CIRCLE CONSULT';

  /* ---------- the seven mandates (the same jobs AGENT OPS runs) ---------- */
  var AGENTS = [
    ['RESEARCHER', /research|find out|what is|who is|how does|explain|latest|news|history of|learn|source|background|info(rmation)? about|tell me about/,
     'You are the RESEARCHER of the Inner Circle. Gather the facts that matter on the question: what is known, what the useful background is, what a good source would check. Be concrete.'],
    ['ANALYST', /analy[sz]e|analy[sz]is|compare|pros and cons|data|numbers|statistic|trend|evaluate|break down|worth|pattern|why is/,
     'You are the ANALYST of the Inner Circle. Break the question down: the real drivers, the trade-offs, the one pattern that decides it. Be concrete.'],
    ['PROGRAMMER', /\bcode\b|program|script|website|web site|\bapp\b|\bapi\b|deploy|javascript|python|\bhtml\b|\bcss\b|\bbug\b|\bfix\b|error|roblox|game|build (me|a|an|it)/,
     'You are the PROGRAMMER of the Inner Circle. Answer in build terms: the right approach, the parts, the order to build in, the pitfall to avoid. Be concrete.'],
    ['CREATIVE DIRECTOR', /\bdesign\b|\blogo\b|brand|name for|\bart\b|story|creative|idea for|image|visual|aesthetic|theme|style/,
     'You are the CREATIVE DIRECTOR of the Inner Circle. Give the strong angle: the look, the hook, the one idea that makes it land. Be concrete.'],
    ['FACT CHECKER', /\btrue\b|\breal\b|\bfake\b|\blie\b|\bliar\b|verify|proof|myth|debunk|accurate|actually true|is it real/,
     'You are the FACT CHECKER of the Inner Circle. Say what in the question holds up, what is shaky, and what single check would settle it. Be concrete.'],
    ['STRATEGIST', /money|make money|monetiz|business|\bsell\b|\bselling\b|\bgrow(th)?\b|marketing|strateg|invest|profit|income|rich|career|hustle|pricing|revenue|customer|audience|leverage/,
     'You are the STRATEGIST of the Inner Circle. Answer with the play: where the leverage is, the first concrete move, and the move to skip. Be concrete.'],
    ['COORDINATOR', /schedule|organiz|organis|manage|workflow|delegate|checklist|to.?do|plan my|priorit|step by step|order of/,
     'You are the COORDINATOR of the Inner Circle. Order the work: what happens first, what waits, what to hand off. Be concrete.']
  ];

  /* ---------- the rooms the chat can open on its own ---------- */
  var MODS = [
    ['market',  'THE MARKET',   null,      null,    false, /money|market|stock|crypto|invest|trading|profit|revenue|earn|income|monetiz/],
    ['research','THE LAB',      'rs-q',    'rs-run', true,  /research|deep dive|investigat|study\b|sources|learn about|\bpaper\b/],
    ['debate',  'THE COUNCIL',  'db-topic','db-run', true,  /debate|argue|two sides|both sides|disagree|perspective/],
    ['arena',   'THE GAUNTLET', 'ar-prompt','ar-run',true,  /\barena\b|battle|gauntlet|duel|versus|\bvs\b/],
    ['search',  'THE SEARCH',   'us-q',    'us-run', true,  /\bsearch\b|look up|find online|googl/],
    ['graph',   'THE OBSERVATORY','gr-q',  'gr-re',  true,  /\bmap\b|connection|relationship|visualiz|\bgraph\b/],
    ['diag',    'DIAGNOSTICS',  null,      'dg-run', true,  /broken|not working|\bbug\b|\berror\b|problem with/],
    ['studio',  'THE ATELIER',  null,      null,     false, /\bimage\b|\bdraw\b|\bart\b|picture|\blogo\b|poster|illustration/],
    ['projects','THE WORKS',    'pj-q',    null,     false, /project|roadmap|task list|milestone/],
    ['flow',    'THE FLOW',     null,      null,     false, /workflow|automate|pipeline|\bprocess\b/]
  ];

  var last=0, modAt={}, agentAt={};
  function chatEl(){ return document.getElementById('chat'); }
  function scrollEnd(){ var c=chatEl(); if(c){ try{ c.scrollTop=c.scrollHeight; }catch(e){} } }

  function css(){
    if(document.getElementById('hl216-style')) return;
    var st=document.createElement('style'); st.id='hl216-style';
    st.textContent='.hl216-cnote{font-size:11px;letter-spacing:.12em;font-style:italic;text-align:center;color:var(--acc,#C9A35C);background:rgba(201,163,92,.06);border:1px dashed rgba(201,163,92,.35);border-radius:8px;padding:6px 10px;margin:6px auto;max-width:92%}'+
      '.hl216-counsel{border-left:2px solid var(--acc,#C9A35C)!important}'+
      '.hl216-who{font:600 9px ui-monospace,Menlo,monospace;letter-spacing:.22em;text-transform:uppercase;color:var(--acc,#C9A35C);margin-bottom:3px}';
    (document.head||document.documentElement).appendChild(st);
  }
  function note(text){ var c=chatEl(); if(!c) return; css();
    var d=document.createElement('div'); d.className='line omen hl216-cnote'; d.textContent=text;
    c.appendChild(d); scrollEnd(); }
  function counsel(name,text){ var c=chatEl(); if(!c) return; css();
    var d=document.createElement('div'); d.className='line imp hl216-counsel';
    var w=document.createElement('div'); w.className='hl216-who'; w.textContent='\u27E1 '+name;
    var b=document.createElement('div'); b.className='hl216-body'; b.textContent=text;
    d.appendChild(w); d.appendChild(b); c.appendChild(d); scrollEnd(); }

  function waking(t){ t=String(t||'').toLowerCase();
    return t.indexOf('still waking')>-1 || t.indexOf('loads once')>-1 || t.length<25; }

  function ask(agent,q,attempt){
    var body={model:'openai-fast',private:true,messages:[
      {role:'system',content:MARK+' (counsel only, plain prose, no code unless asked) '+agent[2]},
      {role:'user',content:'THE QUESTION: '+q+'\nCounsel in at most three short sentences: one concrete recommendation and one thing to avoid. Plain text, no preamble, no greeting.'}
    ]};
    fetch('https://text.pollinations.ai/openai',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)})
      .then(function(r){ return r.ok? r.json(): null; })
      .then(function(d){
        var t=d&&d.choices&&d.choices[0]&&d.choices[0].message?d.choices[0].message.content:'';
        t=String(t||'').trim().slice(0,700);
        if(t && !waking(t)){ counsel(agent[0],t); return; }
        if((attempt||0)<1) setTimeout(function(){ ask(agent,q,1); },4000);
      })['catch'](function(){ if((attempt||0)<1) setTimeout(function(){ ask(agent,q,1); },4000); });
  }

  function engage(mod,q){
    var now=Date.now();
    if(modAt[mod[0]] && now-modAt[mod[0]]<12000) return;
    modAt[mod[0]]=now;
    try{
      var btn=document.querySelector('#nav button[data-m="'+mod[0]+'"]');
      if(!btn) return; btn.click();
      if(mod[2]){ var el=document.getElementById(mod[2]);
        if(el){ el.value=q; try{ el.dispatchEvent(new Event('input',{bubbles:true})); }catch(e){} } }
      if(mod[4] && mod[3]){ var run=document.getElementById(mod[3]);
        if(run && !run.disabled) run.click(); }
      note('\u27E1 '+mod[1]+' ENGAGED'+(mod[2]?(mod[4]?' \u2014 your question is running there':' \u2014 your question is loaded there'):' \u2014 opened for you'));
    }catch(e){}
  }

  function convene(q){
    try{
      var now=Date.now();
      if(q && q.length>=12 && q.charAt(0)!=='/' && now-last>4000){
        last=now; var low=q.toLowerCase();
        var picked=[], mods=[];
        for(var a=0;a<AGENTS.length&&picked.length<2;a++) if(AGENTS[a][1].test(low)) picked.push(AGENTS[a]);
        for(var m=0;m<MODS.length&&mods.length<2;m++) if(MODS[m][5].test(low)) mods.push(MODS[m]);
        if(picked.length||mods.length){
          var names=[]; for(var p=0;p<picked.length;p++) names.push(picked[p][0]);
          if(names.length) note('\u27E1 THE CIRCLE CONVENES \u2014 '+names.join(' \u00B7 '));
          setTimeout(function(){ for(var p=0;p<picked.length;p++){
            var ag=picked[p], at=agentAt[ag[0]];
            if(at && Date.now()-at<45000) continue;
            agentAt[ag[0]]=Date.now();
            setTimeout(function(a){ return function(){ ask(a,q,0); }; }(ag), 2200+p*1800);
          } },0);
          setTimeout(function(){ for(var mm=0;mm<mods.length;mm++) engage(mods[mm],q); },260);
        }
      }
    }catch(e){}
  }

  /* the main chat's own send path: the SEND button and the composer's Enter key.
   Captured on the way down, so module runs never trigger the council. */
  function hookSend(){
    var txt=document.getElementById('txt'), send=document.getElementById('send');
    if(!txt||!send) return false;
    document.addEventListener('click',function(e){
      try{
        var t=e.target;
        while(t && t!==document){
          if(t.id==='send'){ convene(String(txt.value||'').trim()); break; }
          t=t.parentNode;
        }
      }catch(e){}
    },true);
    txt.addEventListener('keydown',function(e){
      try{ if(e.key==='Enter' && !e.shiftKey) convene(String(txt.value||'').trim()); }catch(err){}
    },true);
    return true;
  }

  var tries=0;
  (function arm(){ if(hookSend()) return; if(++tries>40) return; setTimeout(arm,250); })();
  try{ console.log(TAG+'council online'); }catch(e){}
})();

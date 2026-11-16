/* ILLUMINATI upgrade #128: hl128-institutional-ui (v19.36)
   INSTITUTIONAL REDESIGN - behavior layer (pairs with hl127 CSS).
   Adds: sidebar reorganization + collapse + mobile drawer, live status bar (real values only),
   per-message actions (copy / regenerate / edit / read aloud), composer attachment + model chip,
   welcome screen with working suggested prompts, gold particle ambience.
   Everything wires into the EXISTING engine (nav data-m buttons, #send pipeline, REA routing):
   nothing is removed, nothing faked. __HL128 guard. */
(function(){
  try{
    if(window.__HL128) return; window.__HL128=1;
    var $=function(id){return document.getElementById(id);};
    function mk(tag,cls,id){var d=document.createElement(tag); if(cls)d.className=cls; if(id)d.id=id; return d;}

    /* ---------- nav icons (line geometry, stroke currentColor) ---------- */
    var IC={
      home:'M12 3 L21 19 H3 Z M12 10 L16.5 19 M12 10 L7.5 19',
      hist:'M4 5h16M4 10h16M4 15h10M4 20h13',
      logs:'M4 7h16v13H4z M4 7l2-3h12l2 3 M9 11h6',
      vault:'M4 4h16v16H4z M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z M12 4v2 M12 18v2 M4 12h2 M18 12h2',
      brain:'M7 4h10v16H7z M10 4v16 M14 4v16 M7 9h3 M7 15h3 M14 9h3 M14 15h3',
      diag:'M3 12h4l2-6 4 12 2-6h6',
      set:'M4 7h10 M18 7h2 M14 5v4 M4 17h4 M12 17h8 M8 15v4',
      status:'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18z M12 8v4l3 2',
      agents:'M6 4h12v13H6z M9 21h6 M12 17v4 M9 9h6',
      arena:'M4 4h16v16H4z M4 12h16 M12 4v16',
      debate:'M5 4h11v9H8l-3 3z M19 9v9h-3l-2 2v-2h-3',
      research:'M10 3a7 7 0 1 0 0 14 7 7 0 0 0 0-14z M15 15l6 6',
      persona:'M12 4a4 4 0 1 0 0 8 4 4 0 0 0 0-8z M4 21c0-4 4-6 8-6s8 2 8 6',
      studio:'M4 6h16v12H4z M8 10h8 M8 14h5',
      projects:'M4 5h6l2 2h8v12H4z',
      market:'M3 8h18l-2 11H5z M8 8V5a4 4 0 0 1 8 0v3',
      search:'M10 4a6 6 0 1 0 0 12 6 6 0 0 0 0-12z M15 15l6 6',
      flow:'M4 6h6v4H4z M14 6h6v4h-6z M4 14h6v4H4z M14 14h6v4h-6z M10 8h4 M12 12v2',
      graph:'M4 20V6 M4 20h16 M7 16l4-6 3 3 5-7',
      analytics:'M4 20V4 M4 20h16 M8 20v-7 M12 20V9 M16 20v-4',
      about:'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18z M12 10v6 M12 7.5v.5'
    };
    var PRIMARY=[
      ['home','COMMAND CENTER'],
      ['hist','AI CONVERSATIONS'],
      ['logs','INTELLIGENCE ARCHIVES'],
      ['vault','KNOWLEDGE VAULT'],
      ['brain','AI MODEL SELECTION'],
      ['diag','SYSTEM DIAGNOSTICS'],
      ['set','PREFERENCES']
    ];
    var SECOND={
      status:'STATUS',agents:'AGENT OPS',arena:'ARENA',debate:'DEBATE',research:'RESEARCH LAB',
      persona:'PERSONA',studio:'STUDIO',projects:'PROJECTS',market:'MARKET',search:'SEARCH',
      flow:'FLOW',graph:'GRAPH',analytics:'ANALYTICS',about:'ABOUT'
    };

    function init(){
      var nav=$('nav'); if(!nav||!$('app')) return;

      /* ---------- hamburger (mobile drawer) ---------- */
      var row1=document.querySelector('#hdr .row1');
      if(row1&&!$('ordmenu')){
        var mb=mk('button','','ordmenu'); mb.type='button'; mb.title='Menu';
        mb.innerHTML='<i></i>'; mb.setAttribute('aria-label','Open navigation');
        mb.onclick=function(){document.body.classList.toggle('ord-nav');};
        row1.insertBefore(mb,row1.firstChild);
      }
      if(!$('ordscim')){
        var sc=mk('div','','ordscim'); sc.onclick=function(){document.body.classList.remove('ord-nav');};
        (document.body||document.documentElement).appendChild(sc);
      }

      /* ---------- reorganize nav: primary seven, then modules ---------- */
      var byM={}; nav.querySelectorAll('button[data-m]').forEach(function(b){byM[b.dataset.m]=b;});
      var frag=document.createDocumentFragment();
      var g1=mk('div','ordg'); g1.textContent='COMMAND';
      frag.appendChild(g1);
      PRIMARY.forEach(function(p){
        var b=byM[p[0]]; if(!b) return;
        b.innerHTML='<svg class="ordi" viewBox="0 0 24 24" aria-hidden="true"><path d="'+(IC[p[0]]||IC.home)+'"/></svg><span class="olbl">'+p[1]+'</span>';
        frag.appendChild(b); delete byM[p[0]];
      });
      var rest=Object.keys(byM);
      if(rest.length){
        var g2=mk('div','ordg'); g2.textContent='MODULES';
        frag.appendChild(g2);
        rest.sort(function(a,b){return (SECOND[a]||a).localeCompare(SECOND[b]||b);}).forEach(function(k){
          var b=byM[k];
          var lbl=SECOND[k]||b.textContent.trim();
          b.innerHTML='<svg class="ordi" viewBox="0 0 24 24" aria-hidden="true"><path d="'+(IC[k]||IC.flow)+'"/></svg><span class="olbl">'+lbl+'</span>';
          frag.appendChild(b);
        });
      }
      nav.appendChild(frag);
      nav.onclick=function(e){ if(e.target.closest('button')) document.body.classList.remove('ord-nav'); };

      /* ---------- desktop collapse ---------- */
      if(!$('ordfold')){
        var fl=mk('button','','ordfold'); fl.type='button';
        fl.innerHTML='<span>COLLAPSE</span>';
        fl.onclick=function(){
          document.body.classList.toggle('ord-rail');
          try{localStorage.setItem('ordrail',document.body.classList.contains('ord-rail')?'1':'0');}catch(e){}
        };
        nav.appendChild(fl);
      }
      try{ if(localStorage.getItem('ordrail')==='1') document.body.classList.add('ord-rail'); }catch(e){}

      /* ---------- status bar (mirrors live values only) ---------- */
      if(!$('ordbar')&&$('hdr')){
        var bar=mk('div','','ordbar');
        function cell(k,id){var c=mk('span','oc'); c.innerHTML='<i>'+k+'</i><b id="'+id+'">--</b>'; return c;}
        bar.appendChild(cell('SYSTEM STATUS','ord-sys'));
        bar.appendChild(cell('AI CONNECTION','ord-conn'));
        bar.appendChild(cell('ACTIVE MODEL','ord-model-val'));
        bar.appendChild(cell('SESSION','ord-sess'));
        bar.appendChild(cell('TIME','ord-time'));
        var hdr=$('hdr'); hdr.parentNode.insertBefore(bar,hdr.nextSibling);
        var last='';
        setInterval(function(){
          var sys=navigator.onLine?'ONLINE':'OFFLINE';
          var connEl=$('conn-t')||$('st-state'); var conn=(connEl&&connEl.textContent||'').trim()||'STANDBY';
          var pm=$('p-model'); var model=(pm&&pm.textContent||'').trim();
          if(model){ model=model.split('::')[0].trim(); } else { model='OMNI FUSION'; }
          if(model.length>34) model=model.slice(0,33)+'\u2026';
          var sessEl=$('sess'); var sess=(sessEl&&sessEl.textContent||'').replace(/^SESSION\s*/i,'').trim()||'ACTIVE';
          var ck=$('clock'); var t=(ck&&ck.textContent||'').trim();
          var sig=[sys,conn,model,sess,t].join('|');
          if(sig===last) return; last=sig;
          var a=$('ord-sys'); if(a)a.textContent=sys;
          var b2=$('ord-conn'); if(b2)b2.textContent=conn;
          var c2=$('ord-model-val'); if(c2)c2.textContent=model;
          var d2=$('ord-sess'); if(d2)d2.textContent=sess;
          var e2=$('ord-time'); if(e2)e2.textContent=t||'--';
        },900);
      }

      /* ---------- welcome screen with working prompt cards ---------- */
      var chat=$('chat');
      if(chat&&!$('ordwelcome')){
        var w=mk('div','','ordwelcome');
        w.innerHTML=
          '<svg class="ow-emb" viewBox="0 0 100 100" aria-hidden="true">'
          +'<g fill="none" stroke="#C5A45B" stroke-width="1.4">'
          +'<circle cx="50" cy="50" r="46"/><circle cx="50" cy="50" r="33"/>'
          +'<path d="M50 14 L86 78 L14 78 Z"/><path d="M50 26 L74 72 L26 72 Z"/>'
          +'<circle cx="50" cy="58" r="7"/><circle cx="50" cy="58" r="2.4" fill="#C5A45B" stroke="none"/>'
          +'</g></svg>'
          +'<h2>ILLUMINATI</h2>'
          +'<div class="ow-sub">PRIVATE INTELLIGENCE TERMINAL</div>'
          +'<div class="ow-quote">\u201CKnowledge is the ultimate instrument of influence.\u201D</div>'
          +'<div class="ow-note">The terminal answers through open relays. Nothing leaves this browser but your query itself.</div>'
          +'<div class="ow-cards">'
          +'<div class="ow-card" data-q="/help"><b>ORIENTATION</b><span>List every command the terminal answers to.</span></div>'
          +'<div class="ow-card" data-q="Brief me on what is happening in the world right now. Keep it sharp."><b>BRIEFING</b><span>A fast intelligence brief on the world right now.</span></div>'
          +'<div class="ow-card" data-q="Draft a classified-style memo, sealed and authoritative, on any topic I name next."><b>DRAFT MEMO</b><span>An institutional memo, written in the Order\u2019s voice.</span></div>'
          +'<div class="ow-card" data-q="/image a golden geometric sigil of knowledge and power, dark background"><b>ETCH A VISION</b><span>The image forge paints a golden geometric sigil.</span></div>'
          +'</div>';
        w.querySelectorAll('.ow-card').forEach(function(c){
          c.onclick=function(){ var q=c.dataset.q; var t=$('txt'); if(!t) return; t.value=q; var s=$('send'); if(s&&!s.disabled) s.click(); };
        });
        chat.insertBefore(w,chat.firstChild);
        if(chat.querySelector('.line.you')) w.style.display='none';
      }

      /* ---------- per-message actions ---------- */
      if(chat){
        function actBar(lineEl,kind,body){
          var bar=mk('div','ordact');
          function btn(l,f){var b=mk('button'); b.type='button'; b.textContent=l; b.onclick=function(e){e.stopPropagation();f();}; bar.appendChild(b); return b;}
          btn('COPY',function(){
            var txt=body.textContent||'';
            var b0=bar.firstChild;
            var done=function(){ b0.textContent='COPIED'; setTimeout(function(){b0.textContent='COPY';},1200); };
            function fallback(){ try{ var ta=mk('textarea'); ta.value=txt; ta.style.position='fixed'; ta.style.opacity='0'; document.body.appendChild(ta); ta.select(); document.execCommand('copy'); ta.remove(); done(); }catch(e){} }
            if(navigator.clipboard&&navigator.clipboard.writeText){ navigator.clipboard.writeText(txt).then(done,fallback); }
            else fallback();
          });
          if(kind==='imp'&&$('send')) btn('REGEN',function(){
            var lastYou=null, lines=chat.querySelectorAll('.line.you');
            for(var i=lines.length-1;i>=0;i--){ var b=lines[i].querySelector('.lbody'); if(b&&b.textContent.trim()){lastYou=b.textContent.trim();break;} }
            if(!lastYou) return;
            var t=$('txt'), s=$('send'); if(!t||!s||s.disabled) return;
            t.value=lastYou; s.click();
          });
          if(kind==='you'&&$('txt')) btn('EDIT',function(){
            var t=$('txt'); t.value=body.textContent||''; t.focus();
            try{t.setSelectionRange(t.value.length,t.value.length);}catch(e){}
          });
          if(window.speechSynthesis&&window.SpeechSynthesisUtterance) btn('SPEAK',function(){
            var b1=bar.children[bar.children.length-1];
            if(window.__ordspeaking){ try{speechSynthesis.cancel();}catch(e){} window.__ordspeaking=false; b1.textContent='SPEAK'; return; }
            var u=new SpeechSynthesisUtterance((body.textContent||'').slice(0,4000));
            u.rate=1; u.onend=function(){window.__ordspeaking=false; b1.textContent='SPEAK';};
            window.__ordspeaking=true; b1.textContent='STOP';
            try{speechSynthesis.speak(u);}catch(e){ window.__ordspeaking=false; b1.textContent='SPEAK'; }
          });
          return bar;
        }
        function decorate(n){
          if(!n.classList||!n.classList.contains('line')||n.dataset.ord) return;
          n.dataset.ord='1';
          if(n.classList.contains('omen')) return;
          var kind=n.classList.contains('you')?'you':(n.classList.contains('imp')?'imp':null);
          if(!kind) return;
          var body=n.querySelector('.lbody'); if(!body) return;
          n.appendChild(actBar(n,kind,body));
        }
        Array.prototype.slice.call(chat.querySelectorAll('.line')).forEach(decorate);
        new MutationObserver(function(ms){
          ms.forEach(function(m){ Array.prototype.slice.call(m.addedNodes).forEach(decorate); });
          var wEl=$('ordwelcome'); if(wEl&&chat.querySelector('.line.you')) wEl.style.display='none';
        }).observe(chat,{childList:true});
      }

      /* ---------- composer: attachment + model chip ---------- */
      var foot=$('foot');
      if(foot&&!$('ordclip')){
        var inp=mk('input'); inp.type='file'; inp.id='ordfile'; inp.style.display='none';
        inp.accept='.txt,.md,.json,.csv,.js,.py,.html,.css,.xml,.log,text/*';
        inp.onchange=function(){
          var f=inp.files&&inp.files[0]; if(!f) return;
          if(f.size>2*1024*1024){ inp.value=''; return; }
          var r=new FileReader();
          r.onload=function(){
            var t=String(r.result||'');
            if(t.length>16000) t=t.slice(0,16000)+'\n[TRUNCATED]';
            var tEl=$('txt'); if(!tEl) return;
            tEl.value=(tEl.value||'')+'\n\n[ATTACHED FILE: '+f.name+']\n'+t;
            tEl.focus(); try{tEl.setSelectionRange(tEl.value.length,tEl.value.length);}catch(e){}
          };
          r.readAsText(f); inp.value='';
        };
        foot.appendChild(inp);
        var clip=mk('button','','ordclip'); clip.type='button'; clip.title='Attach a text file';
        clip.textContent='+'; clip.onclick=function(){ inp.click(); };
        var mic=$('mic'); if(mic) foot.insertBefore(clip,mic); else foot.appendChild(clip);
      }
      if(foot&&!$('ordmodel')){
        var mo=mk('button','','ordmodel'); mo.type='button'; mo.title='Switch AI brain';
        mo.textContent='MODEL';
        mo.onclick=function(){ var nb=document.querySelector('#nav button[data-m="brain"]'); if(nb) nb.click(); };
        var send=$('send'); if(send) foot.insertBefore(mo,send); else foot.appendChild(mo);
        setInterval(function(){
          var pm=$('p-model');
          var v=(pm&&pm.textContent||'').trim();
          if(v){ v=v.split('::')[0].trim(); if(v.length>12) v=v.slice(0,11)+'\u2026'; }
          mo.textContent=v||'MODEL';
        },1500);
      }

      /* ---------- gold particle ambience ---------- */
      if(!$('ordfx')&&!document.body.classList.contains('rm')&&!window.matchMedia('(prefers-reduced-motion: reduce)').matches){
        var cv=mk('canvas','','ordfx'); document.body.appendChild(cv);
        var cx=cv.getContext('2d'); var P=[]; var running=true;
        function size(){ cv.width=innerWidth; cv.height=innerHeight; }
        size(); addEventListener('resize',size);
        var N=Math.min(42,Math.max(24,Math.round(innerWidth/34)));
        for(var i=0;i<N;i++) P.push({x:Math.random()*innerWidth,y:Math.random()*innerHeight,r:.6+Math.random()*1.7,s:.06+Math.random()*.22,a:.05+Math.random()*.2,ph:Math.random()*6.28,sw:.2+Math.random()*.6});
        document.addEventListener('visibilitychange',function(){ running=!document.hidden; if(running) tick(); });
        var lastT=0;
        function tick(ts){
          if(!running) return;
          if(!ts||ts-lastT>33){ lastT=ts||0;
            cx.clearRect(0,0,cv.width,cv.height);
            for(var j=0;j<P.length;j++){ var p=P[j];
              p.y-=p.s; p.ph+=.24*p.sw; p.x+=Math.sin(p.ph)*.08;
              if(p.y<-6){ p.y=cv.height+6; p.x=Math.random()*cv.width; }
              var tw=.7+.3*Math.sin(p.ph*2.2);
              cx.beginPath(); cx.arc(p.x,p.y,p.r,0,6.283);
              cx.fillStyle='rgba(197,164,91,'+(p.a*tw).toFixed(3)+')'; cx.fill();
            }
          }
          requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
      }

      /* ---------- geometry backdrop ---------- */
      if(!$('ordbg')){
        var bg=mk('div','','ordbg'); document.body.appendChild(bg);
        var vg=mk('div','','ordbgvig'); document.body.appendChild(vg);
      }
    }

    if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',init);
    else init();
    setTimeout(function(){ var nav=$('nav'); if(nav&&!nav.querySelector('.ordi')){ window.__HL128=0; try{init();}catch(e){} window.__HL128=1; } },2500);
  }catch(e){ try{console.log('[HL128]',e);}catch(_){} }
})();

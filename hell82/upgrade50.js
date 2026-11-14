/* ILLUMINATI upgrade #50: hl50-relay-guard (v18.56)
   the order's circuit armor: when a public relay refuses or rate-limits a request, the guard
   reroutes it automatically and says so in the feed - an upstream error never reaches the chat
   dressed up as an answer. works with the fetch-level guard wired into index.html. */
(function(){
  const $=(id)=>document.getElementById(id);
  function stamp(){ const d=new Date(); const p=(n)=>String(n).padStart(2,'0'); return '['+p(d.getHours())+':'+p(d.getMinutes())+':'+p(d.getSeconds())+']'; }
  function feedLine(txt){
    const f=$('feedlist'); if(!f) return;
    const d=document.createElement('div');
    const t=document.createElement('span'); t.textContent=stamp()+' ';
    const s=document.createElement('span'); s.textContent='[LIVE] '+txt;
    d.appendChild(t); d.appendChild(s); f.appendChild(d);
    while(f.children.length>60) f.removeChild(f.firstChild);
    if(f.lastChild) f.lastChild.scrollIntoView({block:'nearest'});
  }
  let n=0;
  addEventListener('hl-guard',function(e){
    n++;
    const st=e&&e.detail&&e.detail.status?e.detail.status:'blocked';
    feedLine('RELAY GUARD :: relay answered '+st+' - rerouted and retrying automatically ('+n+' this session)');
  });
  /* the SYSTEM page gains a live guard line */
  function paintGuard(){
    const sys=$('sys-about'); if(!sys) return;
    if(document.getElementById('guard-line')) return;
    const d=document.createElement('div');
    d.id='guard-line'; d.className='pdesc'; d.style.marginTop='6px';
    d.textContent='RELAY GUARD: every AI request is screened - refused or rate-limited relays are retried and rerouted automatically, and nothing an upstream relay says in error ever reaches the chat as an answer.';
    sys.appendChild(d);
  }
  const iv=setInterval(function(){ try{ paintGuard(); }catch(e){} },1500);
  setTimeout(function(){ clearInterval(iv); try{ paintGuard(); }catch(e){} },20000);
})();
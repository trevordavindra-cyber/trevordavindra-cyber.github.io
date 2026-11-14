// ILLUMINATI upgrade #72: hl72-rite-omen (v18.80)
// A left-edge chip counting this session's summonings: "SUMMONS N",
// N = taps on the [SEND] button since page load. Hidden while N is
// 0, event-driven click counter, no timers. No app changes.
(function(){
  try{
    if(window.__HL72) return; window.__HL72=1;
    var el=document.createElement('div');
    el.id='hl72-rite'; el.setAttribute('aria-hidden','true');
    el.setAttribute('style','position:fixed;left:14px;bottom:234px;z-index:9000;pointer-events:none;font:10px/1 monospace;letter-spacing:2px;color:rgba(80,220,220,.5);text-shadow:0 0 6px rgba(40,200,200,.2);user-select:none;white-space:nowrap;opacity:0;transition:opacity .4s;');
    (document.body||document.documentElement).appendChild(el);
    var n=0;
    document.addEventListener('click',function(ev){
      try{
        var b=ev.target&&ev.target.closest?ev.target.closest('#send'):null;
        if(!b) return;
        n++;
        el.textContent='SUMMONS '+n;
        el.style.opacity='1';
      }catch(e){}
    },true);
  }catch(e){}
})();

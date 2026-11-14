// ILLUMINATI upgrade #59: hl59-echo-omen (v18.67)
// When anything is copied out of the terminal — the copy buttons on
// answers, or a manual Ctrl+C — a brief centered toast confirms it:
// "COPIED TO THE ARCHIVE", fading after two seconds. Catches both the
// site's clipboard writes (wrapped, original behavior untouched) and
// native copy events. Event-driven, no polling, pointer-events none.
(function(){
  try{
    if(window.__HL59) return; window.__HL59=1;
    var el=document.createElement('div');
    el.id='hl59-echo'; el.setAttribute('aria-hidden','true');
    el.setAttribute('style','position:fixed;left:50%;bottom:84px;transform:translateX(-50%);z-index:9002;pointer-events:none;font:11px/1 monospace;letter-spacing:2px;color:rgba(80,220,220,.8);background:rgba(5,10,10,.85);border:1px solid rgba(80,220,220,.25);padding:6px 14px;text-shadow:0 0 8px rgba(40,200,200,.3);user-select:none;transition:opacity .5s;opacity:0;');
    (document.body||document.documentElement).appendChild(el);
    var t=null;
    var flash=function(){
      el.textContent='COPIED TO THE ARCHIVE';
      el.style.opacity='1';
      if(t)clearTimeout(t);
      t=setTimeout(function(){ el.style.opacity='0'; },2000);
    };
    document.addEventListener('copy',flash,true);
    if(navigator.clipboard && navigator.clipboard.writeText){
      var orig=navigator.clipboard.writeText.bind(navigator.clipboard);
      navigator.clipboard.writeText=function(s){
        try{ flash(); }catch(e){}
        return orig(s);
      };
    }
  }catch(e){}
})();

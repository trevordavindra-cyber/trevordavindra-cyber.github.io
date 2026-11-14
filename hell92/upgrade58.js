// ILLUMINATI upgrade #58: hl58-focus-omen (v18.66)
// A vertical sentinel on the mid-left edge: when the terminal loses
// focus or the tab is hidden it fades in "THE EYE ELSEWHERE", and on
// return it flashes "THE EYE RETURNS" for three seconds. Pure event
// listeners (blur, focus, visibilitychange), no polling, pointer-events
// none, adds nothing but one hidden chip.
(function(){
  try{
    if(window.__HL58) return; window.__HL58=1;
    var el=document.createElement('div');
    el.id='hl58-focus'; el.setAttribute('aria-hidden','true');
    el.setAttribute('style','position:fixed;left:12px;top:50%;transform:translateY(-50%);writing-mode:vertical-rl;z-index:9000;pointer-events:none;font:10px/1 monospace;letter-spacing:4px;color:rgba(220,80,80,.45);text-shadow:0 0 6px rgba(200,40,40,.25);user-select:none;transition:opacity 1.5s;opacity:0;');
    (document.body||document.documentElement).appendChild(el);
    var t=null;
    var say=function(txt){
      if(t){clearTimeout(t);t=null;}
      el.textContent=txt;
      el.style.opacity='1';
      t=setTimeout(function(){ el.style.opacity='0'; },3000);
    };
    var away=function(){
      if(t){clearTimeout(t);t=null;}
      el.textContent='THE EYE ELSEWHERE';
      el.style.opacity='1';
    };
    var back=function(){ say('THE EYE RETURNS'); };
    window.addEventListener('blur',away);
    window.addEventListener('focus',back);
    document.addEventListener('visibilitychange',function(){
      if(document.hidden) away(); else back();
    });
  }catch(e){}
})();

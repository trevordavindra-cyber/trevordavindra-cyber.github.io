// ILLUMINATI upgrade #55: hl55-count-omen (v18.63)
// A chip at the bottom-left (stacked above the latency chip) counts
// what you are typing into the input: characters and words, updated
// live as you type, cut or paste. Hidden while the input is empty, so
// the corner stays clean between messages. Pure input listeners, no
// polling, no timers, adds nothing else.
(function(){
  try{
    if(window.__HL55) return; window.__HL55=1;
    var el=document.createElement('div');
    el.id='hl55-count'; el.setAttribute('aria-hidden','true');
    el.setAttribute('style','position:fixed;left:14px;bottom:74px;z-index:9000;pointer-events:none;font:10px/1 monospace;letter-spacing:1.5px;color:rgba(80,220,220,0);text-shadow:0 0 6px rgba(40,200,200,.25);user-select:none;transition:color .4s;');
    (document.body||document.documentElement).appendChild(el);
    var paint=function(){
      var ta=document.getElementById('txt');
      var t=(ta&&ta.value)||'';
      var n=t.length;
      if(!n){ el.textContent=''; el.style.color='rgba(80,220,220,0)'; return; }
      var w=t.trim()?t.trim().split(/\s+/).length:0;
      el.textContent=n+' CH \u00b7 '+w+' W';
      el.style.color='rgba(80,220,220,.5)';
    };
    var ta=document.getElementById('txt');
    if(ta){
      ta.addEventListener('input',paint);
      ta.addEventListener('cut',paint);
      ta.addEventListener('paste',function(){setTimeout(paint,50);});
    }
    paint();
  }catch(e){}
})();

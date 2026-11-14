// ILLUMINATI upgrade #57: hl57-idle-omen (v18.65)
// A faint vertical sentinel on the mid-right edge that fades in
// "THE EYE WATCHES" after two minutes without input or movement, and
// vanishes the instant any activity returns. One timeout reset by
// every real event (pointer, key, wheel, scroll, touch) — no polling,
// no animation loop, pointer-events none, adds nothing but one hidden
// chip.
(function(){
  try{
    if(window.__HL57) return; window.__HL57=1;
    var el=document.createElement('div');
    el.id='hl57-idle'; el.setAttribute('aria-hidden','true');
    el.setAttribute('style','position:fixed;right:12px;top:50%;transform:translateY(-50%);writing-mode:vertical-rl;z-index:9000;pointer-events:none;font:10px/1 monospace;letter-spacing:4px;color:rgba(80,220,220,.35);text-shadow:0 0 6px rgba(40,200,200,.25);user-select:none;transition:opacity 2s;opacity:0;');
    (document.body||document.documentElement).appendChild(el);
    var t=null;
    var show=function(){ el.style.opacity='1'; };
    var wake=function(){
      el.style.opacity='0';
      if(t)clearTimeout(t);
      t=setTimeout(show,120000);
    };
    ['pointerdown','pointermove','keydown','wheel','scroll','touchstart'].forEach(function(ev){
      window.addEventListener(ev,wake,{passive:true});
    });
    wake();
  }catch(e){}
})();

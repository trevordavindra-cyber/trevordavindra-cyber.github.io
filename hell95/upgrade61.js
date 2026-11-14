// ILLUMINATI upgrade #61: hl61-forge-omen (v18.69)
// A centered chip (bottom, above the copy toast) that reads
// "THE FORGE IS HOT" only while a summon is actually in flight
// (the [CUT] button is visible). Pure observer: it watches the stop
// button's own style changes and never touches the app's flow.
(function(){
  try{
    if(window.__HL61) return; window.__HL61=1;
    var stop=document.getElementById('stop');
    if(!stop) return;
    var el=document.createElement('div');
    el.id='hl61-forge'; el.setAttribute('aria-hidden','true');
    el.setAttribute('style','position:fixed;left:50%;bottom:110px;transform:translateX(-50%);z-index:9001;pointer-events:none;font:10px/1 monospace;letter-spacing:3px;color:rgba(255,90,90,.75);text-shadow:0 0 8px rgba(255,60,60,.35);opacity:0;transition:opacity .4s;user-select:none;white-space:nowrap;');
    (document.body||document.documentElement).appendChild(el);
    function sync(){
      var on=false;
      try{ on = getComputedStyle(stop).display!=='none'; }catch(e){}
      el.textContent = on ? 'THE FORGE IS HOT' : '';
      el.style.opacity = on ? '.9' : '0';
    }
    try{
      new MutationObserver(sync).observe(stop,{attributes:true,attributeFilter:['style','class']});
    }catch(e){}
    sync();
    setTimeout(sync,600);
  }catch(e){}
})();

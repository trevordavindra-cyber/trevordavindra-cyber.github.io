// ILLUMINATI upgrade #2: Easter Egg Clicker (v18.8)
// Adds a small overlay counter that increments each time the background is clicked.
// Additive only. Injected by overnight upgrade run.
(function(){
  function init(){
    if(document.getElementById('hl2-counter'))return;
    var counter=document.createElement('div');
    counter.id='hl2-counter';
    counter.style.cssText='position:fixed;bottom:4px;right:4px;font-size:10px;color:rgba(255,255,255,.4);pointer-events:none;z-index:9999;';
    counter.textContent='👁 0';
    document.body.appendChild(counter);
    var n=0;
    document.addEventListener('click',function(e){
      if(e.target.closest('#app'))return;
      n++;
      var el=document.getElementById('hl2-counter');
      if(el)el.textContent='👁 '+n;
    });
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
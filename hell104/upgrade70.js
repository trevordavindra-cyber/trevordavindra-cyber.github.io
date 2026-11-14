// ILLUMINATI upgrade #70: hl70-frame-omen (v18.78)
// A left-edge chip showing the real render speed: "FPS 60",
// measured over a one-second window via requestAnimationFrame.
// Measured only while the page is visible; pauses when hidden.
// No app changes.
(function(){
  try{
    if(window.__HL70) return; window.__HL70=1;
    var el=document.createElement('div');
    el.id='hl70-fps'; el.setAttribute('aria-hidden','true');
    el.setAttribute('style','position:fixed;left:14px;bottom:202px;z-index:9000;pointer-events:none;font:10px/1 monospace;letter-spacing:2px;color:rgba(80,220,220,.5);text-shadow:0 0 6px rgba(40,200,200,.2);user-select:none;white-space:nowrap;');
    (document.body||document.documentElement).appendChild(el);
    var frames=0, running=false;
    function loop(t){
      frames++;
      if(!running) return;
      requestAnimationFrame(loop);
    }
    function measure(){
      frames=0; running=true;
      requestAnimationFrame(loop);
      setTimeout(function(){
        running=false;
        var fps=frames;
        el.textContent='FPS '+fps;
        if(!document.hidden) setTimeout(measure,2000);
      },1000);
    }
    if(!document.hidden) measure();
    document.addEventListener('visibilitychange',function(){
      if(!document.hidden && !running) measure();
      if(document.hidden) running=false;
    });
  }catch(e){}
})();

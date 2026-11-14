// ILLUMINATI upgrade #73: hl73-dawn-omen (v18.81)
// A left-edge chip counting down to the next midnight: "MIDNIGHT IN 6H 07M",
// flashing "MIDNIGHT" for the first minute of the new day. Recomputed
// every 30s, no app changes, __HL73 guard.
(function(){
  try{
    if(window.__HL73) return; window.__HL73=1;
    var el=document.createElement('div');
    el.id='hl73-dawn'; el.setAttribute('aria-hidden','true');
    el.setAttribute('style','position:fixed;left:14px;bottom:250px;z-index:9000;pointer-events:none;font:10px/1 monospace;letter-spacing:2px;color:rgba(200,80,80,.55);text-shadow:0 0 6px rgba(200,60,60,.25);user-select:none;white-space:nowrap;opacity:0;transition:opacity .4s;');
    (document.body||document.documentElement).appendChild(el);
    function tick(){
      try{
        var now=new Date();
        var mid=new Date(now.getFullYear(),now.getMonth(),now.getDate()+1,0,0,0);
        var s=Math.floor((mid-now)/1000);
        if(s>86399) s=86399;
        if(s<60){
          el.textContent='MIDNIGHT';
        }else{
          var h=Math.floor(s/3600), m=Math.floor((s%3600)/60);
          el.textContent='MIDNIGHT IN '+h+'H '+String(m).padStart(2,'0')+'M';
        }
        el.style.opacity='1';
      }catch(e){}
    }
    tick();
    setInterval(tick,30000);
  }catch(e){}
})();

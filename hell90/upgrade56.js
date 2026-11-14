// ILLUMINATI upgrade #56: hl56-offline-omen (v18.64)
// A sentinel chip at the bottom-right (stacked above the battery chip)
// that watches the device connection: a red "LINK DOWN — OFFLINE MODE"
// warning appears the moment the browser goes offline, and a short
// "LINK RESTORED" flash shows when it comes back (fades after 3s).
// Invisible the whole time the link is healthy, so the corner stays
// untouched. Pure online/offline event listeners, no polling.
(function(){
  try{
    if(window.__HL56) return; window.__HL56=1;
    var el=document.createElement('div');
    el.id='hl56-offline'; el.setAttribute('aria-hidden','true');
    el.setAttribute('style','position:fixed;right:12px;bottom:60px;z-index:9000;pointer-events:none;font:10px/1 monospace;letter-spacing:1.5px;color:rgba(255,90,90,.85);text-shadow:0 0 6px rgba(255,60,60,.35);user-select:none;transition:opacity .4s;opacity:0;');
    (document.body||document.documentElement).appendChild(el);
    var t=null;
    var down=function(){
      if(t){clearTimeout(t);t=null;}
      el.textContent='\u26a0 LINK DOWN \u2014 OFFLINE MODE';
      el.style.opacity='1';
    };
    var up=function(){
      el.textContent='\u2713 LINK RESTORED';
      el.style.opacity='1';
      if(t)clearTimeout(t);
      t=setTimeout(function(){ el.style.opacity='0'; t=null; },3000);
    };
    if(!navigator.onLine) down();
    window.addEventListener('offline',down);
    window.addEventListener('online',up);
  }catch(e){}
})();

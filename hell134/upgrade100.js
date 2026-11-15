// ILLUMINATI upgrade #100: hl100-gpu-omen (v19.08)
// Century chip. A left-edge tag naming the real GPU behind the
// terminal: "GPU <renderer>" from the WebGL debug-renderer info,
// read once at boot, fallback "GPU --" when the browser withholds
// it. Reads only, never blocks anything. __HL100 guard.
(function(){
  try{
    if(window.__HL100) return; window.__HL100=1;
    var el=document.createElement('div');
    el.id='hl100-gpu'; el.setAttribute('aria-hidden','true');
    el.setAttribute('style','position:fixed;left:14px;bottom:682px;z-index:9000;pointer-events:none;font:10px/1 monospace;letter-spacing:2px;color:rgba(140,255,180,.4);text-shadow:0 0 6px rgba(100,255,150,.18);user-select:none;white-space:nowrap;max-width:60vw;overflow:hidden;text-overflow:ellipsis;opacity:0;transition:opacity .4s;');
    (document.body||document.documentElement).appendChild(el);
    function show(){
      try{
        var c=document.createElement('canvas');
        var gl=c.getContext('webgl')||c.getContext('experimental-webgl');
        var name='';
        if(gl){
          var ext=gl.getExtension('WEBGL_debug_renderer_info');
          if(ext){ name=gl.getParameter(ext.UNMASKED_RENDERER_WEBGL)||''; }
        }
        name=(name||'--').replace(/\s+/g,' ');
        el.textContent='GPU '+name;
        el.style.opacity='1';
      }catch(e){}
    }
    if(document.readyState!=='loading'){ show(); }
    else{ document.addEventListener('DOMContentLoaded',show,{once:true}); }
  }catch(e){}
})();

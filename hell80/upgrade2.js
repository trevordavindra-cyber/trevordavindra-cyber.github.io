// ILLUMINATI upgrade #2: Easter Egg Clicker (v18.8)
// Adds a small overlay that appears after 10 rapid background clicks as an easter egg, without changing existing features.
// Additive only. Injected by overnight upgrade run.
(function(){
  // Defensively check document
  if (!document) return;
  // Utility: create and append element
  function createOverlay(){
    var overlay = document.createElement('div');
    overlay.id = 'hl2-easter';
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100%';
    overlay.style.height = '100%';
    overlay.style.background = 'rgba(0,0,0,0.8)';
    overlay.style.display = 'flex';
    overlay.style.alignItems = 'center';
    overlay.style.justifyContent = 'center';
    overlay.style.color = '#fff';
    overlay.style.fontSize = '2rem';
    overlay.style.zIndex = '9999';
    overlay.style.cursor = 'pointer';
    overlay.innerText = 'You found the secret! Click to close.';
    overlay.addEventListener('click', function(){ overlay.remove(); });
    return overlay;
  }
  function init(){
    var clickCount = 0;
    var timeout;
    var maxClicks = 10;
    var resetDelay = 2000; // 2 seconds

    document.addEventListener('click', function(event){
      var target = event.target;
      if(!target) return;
      // Only count clicks on background (not interactive elements)
      if(target.tagName && target.tagName.toLowerCase()=== 'body'){
        clickCount++;
        clearTimeout(timeout);
        if(clickCount>=maxClicks){
          var overlay = createOverlay();
          document.body.appendChild(overlay);
          clickCount=0;
          return;
        }
        timeout = setTimeout(function(){ clickCount=0; }, resetDelay);
      }
    });
  }
  if(document.readyState==='loading'){
    document.addEventListener('DOMContentLoaded', init);
  } else { init(); }
})();
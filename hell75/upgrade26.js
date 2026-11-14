// ILLUMINATI upgrade #26: hl26-console-eye (v18.32)
// Easter egg: typing ILLUMINATI in the browser console prints an ASCII eye + a one-line answer.
// Additive only. Injected by overnight upgrade run.
(function(){
  if (typeof window === 'undefined' || window.__hl26Eye) return;
  window.__hl26Eye = true;
  var buf='';
  try{
    Object.defineProperty(window,'ILLUMINATI',{get:function(){
      try{
        console.log('%c👁','font-size:64px');
        console.log('%cThe eye sees you. It always has.','color:#00e5ff;font-family:monospace');
      }catch(e){}
      return '👁';
    },configurable:true});
  }catch(e){}
})();
// ILLUMINATI upgrade #31: hl31-synapse-gauge (v18.37)
// Tiny live SYNAPSE gauge chip bottom-right: shows real session request count from __NET
// with a 4-dot loading meter while a request is in flight. Additive, guarded.
(function(){
  if(!document||!document.body)return;
  var RM=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
  function start(){
    if(document.getElementById('hl31-gauge'))return;
    var c=document.createElement('div');
    c.id='hl31-gauge';
    c.style.cssText='position:fixed;right:12px;bottom:12px;z-index:9996;display:flex;align-items:center;gap:4px;'+
      'font-family:monospace;font-size:10px;letter-spacing:1px;color:rgba(0,229,255,.8);'+
      'background:rgba(0,0,0,.55);border:1px solid rgba(0,229,255,.25);border-radius:4px;padding:3px 7px;pointer-events:none;';
    var dots='';
    for(var i=0;i<4;i++){dots+='<span data-i="'+i+'" style="width:4px;height:4px;border-radius:50%;display:inline-block;background:rgba(0,229,255,.25)"></span>';
    }
    c.innerHTML='<span style="opacity:.7">SYNAPSE</span><b id="hl31-count" style="color:#00e5ff">0</b>'+dots;
    document.body.appendChild(c);
    var last=-1;
    setInterval(function(){
      var n=(window.__NET&&window.__NET.length)||0;
      var el=document.getElementById('hl31-count');
      if(el&&n!==last){el.textContent=n;last=n;}
      var spans=c.querySelectorAll('[data-i]');
      var pending=0;
      if(window.__NET){var t=Date.now();for(var j=window.__NET.length-1;j>=0&&j>=window.__NET.length-5;j--){if(t-window.__NET[j].t<2500)pending++;}}
      spans.forEach(function(s,k){s.style.background=(k<Math.min(pending,4))?'#00e5ff':'rgba(0,229,255,.25)';});
    },500);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start);
  else start();
})();
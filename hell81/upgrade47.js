// ILLUMINATI upgrade #47: hl47-occult-date (v18.53)
// A tiny top-center chip prints today's date in Roman numerals
// (MM \u00b7 DD \u00b7 YYYY) after a small eye glyph. Static text only, no animation
// or motion of any kind (so prefers-reduced-motion needs no exception),
// pointer-events none, removes nothing.
(function(){
  try{
    if(window.__HL47) return; window.__HL47=1;
    var roman=function(n){var m=[[1000,'M'],[900,'CM'],[500,'D'],[400,'CD'],[100,'C'],[90,'XC'],[50,'L'],[40,'XL'],[10,'X'],[9,'IX'],[5,'V'],[4,'IV'],[1,'I']],o='';for(var i=0;i<m.length;i++){while(n>=m[i][0]){o+=m[i][1];n-=m[i][0];}}return o;};
    var d=new Date();
    var label='\u25C9 '+roman(d.getMonth()+1)+' \u00B7 '+roman(d.getDate())+' \u00B7 '+roman(d.getFullYear());
    var el=document.createElement('div');
    el.id='hl47-date'; el.textContent=label; el.setAttribute('aria-hidden','true');
    el.setAttribute('style','position:fixed;top:12px;left:50%;transform:translateX(-50%);z-index:9000;pointer-events:none;font:10px/1 monospace;letter-spacing:1.5px;color:rgba(220,60,60,.55);text-shadow:0 0 6px rgba(220,40,40,.35);user-select:none;');
    (document.body||document.documentElement).appendChild(el);
  }catch(e){}
})();
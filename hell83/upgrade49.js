// ILLUMINATI upgrade #49: hl49-rune-omen (v18.55)
// A faint cyan chip stacked above the hl48 clock in the bottom-right
// corner shows a rune of the Elder Futhark with a two-word omen,
// stepping to the next rune every 60 s. Text changes only: no
// animation loop, so prefers-reduced-motion needs no exception;
// pointer-events none, adds nothing but one hidden chip.
(function(){
  try{
    if(window.__HL49) return; window.__HL49=1;
    var R=[
      ['\u16A0','WEALTH MOVES'],['\u16A2','THE HERD STIRS'],['\u16A6','THE THORN GUARDS'],
      ['\u16A8','A MESSAGE COMES'],['\u16B1','THE ROAD OPENS'],['\u16B2','THE TORCH BURNS'],
      ['\u16B7','A GIFT BINDS'],['\u16B9','JOY IS SHARED'],['\u16BA','THE HAIL FALLS'],
      ['\u16BE','NEED SHARPENS'],['\u16C1','THE ICE HOLDS'],['\u16C3','THE YEAR TURNS'],
      ['\u16C7','THE YEW ENDURES'],['\u16C8','DICE ARE CAST'],['\u16C9','THE ELK WALKS'],
      ['\u16CA','THE SUN CLAIMS'],['\u16CF','THE GOD WATCHES'],['\u16D2','THE BIRCH SHELTERS'],
      ['\u16D6','THE HORSE RUNS'],['\u16D7','THE MAN SEES'],['\u16DA','THE WATER RISES'],
      ['\u16DC','THE HALL STANDS'],['\u16DE','THE DAWN BREAKS'],['\u16DF','THE HEIR REMAINS']
    ];
    var i=Math.floor(Date.now()/60000)%R.length;
    var el=document.createElement('div');
    el.id='hl49-rune'; el.setAttribute('aria-hidden','true');
    el.setAttribute('style','position:fixed;right:12px;bottom:28px;z-index:9000;pointer-events:none;font:10px/1 monospace;letter-spacing:1.5px;color:rgba(80,220,220,.5);text-shadow:0 0 6px rgba(40,200,200,.3);user-select:none;');
    (document.body||document.documentElement).appendChild(el);
    var paint=function(){ el.textContent='OMEN '+R[i%R.length][0]+' \u00B7 '+R[i%R.length][1]; i++; };
    paint();
    setInterval(paint,60000);
  }catch(e){}
})();

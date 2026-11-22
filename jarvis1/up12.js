/* JARVIS up12.js v2 - mobile HUD layout: same stark look, compact phone layout, chat right under the reactor */
(function(){
"use strict";
var css = `
/* JARVIS up12.js v2: mobile layout */
@media(max-width:1100px){
  #app{max-width:100%;overflow-x:hidden}
  #topbar{padding:8px 12px;gap:8px}
  #logo{font-size:13px;letter-spacing:3px}
  #brandtag{font-size:10px;letter-spacing:2px}
  #clockbox{text-align:right;min-width:0}
  #cdate{font-size:9px;letter-spacing:1px;display:block}
  #ctime{font-size:15px}
  #shell{grid-template-columns:1fr}
  #sidebar{gap:4px;padding:6px 8px;overflow-x:auto}
  #sidebar::-webkit-scrollbar{display:none}
  #sidebar{scrollbar-width:none}
  .nav{padding:7px 10px;font-size:10px;letter-spacing:1px;white-space:nowrap;flex:0 0 auto}
  #grid{grid-template-columns:1fr 1fr;gap:8px;padding:8px}
  .panel{padding:10px 11px}
  .panel h3{font-size:10px;letter-spacing:1.5px;margin-bottom:8px}
  #stage{grid-column:1/-1;order:1;min-height:0;padding:4px 0 2px}
  #hud{min-height:auto;padding:10px 0 12px}
  #ring{width:min(58vw,250px);height:min(58vw,250px)}
  #reactor{width:min(51vw,220px);height:min(51vw,220px)}
  #id{font-size:clamp(20px,7.5vw,32px);letter-spacing:4px}
  #sub{font-size:9px;letter-spacing:1.5px}
  #banner{margin-top:4px;padding:10px 14px}
  #banner b{font-size:14px;letter-spacing:3px}
  #banner small{font-size:9px}
  #trace{display:none}
  .col.right{order:2;grid-column:1/-1;display:grid;grid-template-columns:1fr;gap:8px}
  .chatpanel{min-height:240px}
  .col.left{order:3;grid-column:1/-1;display:grid;grid-template-columns:1fr 1fr;gap:8px}
  .col.left .panel:nth-child(3){grid-column:1/-1}
  .col.quick{order:4;grid-column:1/-1}
  #qactions{grid-template-columns:repeat(4,1fr);gap:6px}
  .qa{padding:8px 4px;font-size:9px}
  #bottomrow{order:5;grid-column:1/-1;display:grid;grid-template-columns:1fr 1fr;gap:8px}
  #composer textarea{font-size:16px}
  #log{font-size:12px}
}
@media(max-width:460px){
  #grid{grid-template-columns:1fr}
  .col.left{grid-template-columns:1fr}
  #bottomrow{grid-template-columns:1fr}
  #qactions{grid-template-columns:repeat(2,1fr)}
  #ring{width:66vw;height:66vw}
  #reactor{width:58vw;height:58vw}
  #banner b{font-size:12px;letter-spacing:2px}
}
`;
try{document.head.appendChild(Object.assign(document.createElement('style'),{textContent:css}))}catch(e){}
try{console.log('[JARVIS up12.js v2] mobile HUD layout loaded: 2-col phone grid, compact reactor, chat right under the reactor')}catch(e){}
})();

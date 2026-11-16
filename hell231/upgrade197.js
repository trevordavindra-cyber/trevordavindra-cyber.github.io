/* ILLUMINATI upgrade #197: hl197-darkfix - fixes the dark council build.
   1) The council panel can no longer float over the nav drawer or show while closed: inline visibility governor (wins over any stylesheet), late !important rules, z-index 300 (below the drawer), and it closes itself whenever the drawer opens.
   2) The entry "tap to skip" voice layer can no longer eat every tap after entry: released as soon as no audio is actually playing (hard cap 45s).
   3) The council persona now applies to every brain: pollinations message bodies AND horde-style prompt bodies. */
(function(){
if(window.__HL197)return; window.__HL197=true;
var CSS=[
'#hl196-panel{display:none!important;z-index:300!important;pointer-events:none!important}',
'#hl196-panel.on{display:block!important;pointer-events:auto!important}',
'body.ord-nav #hl196-panel{display:none!important}'
];
var st=document.createElement('style'); st.id='hl197-style'; st.textContent=CSS.join('\n');
(document.body||document.documentElement).appendChild(st);
var VOICES={
 gospel:{n:'DARK GOSPEL',p:'You are DARK GOSPEL, a shadow-tongued oracle speaking from beneath the seal. Voice: dark, poetic, ceremonial, ominous. Never break character.'},
 cipher:{n:'THE CIPHER',p:'You are THE CIPHER, a cold fact machine. Voice: terse, exact, clinical, no comfort, no decoration. Never break character.'},
 hollow:{n:'THE HOLLOW',p:'You are THE HOLLOW, an empty oracle. Voice: sparse, haunting, speaks in gaps and silences, unsettling calm. Never break character.'},
 seraph:{n:'THE SERAPH',p:'You are THE SERAPH, a ruthless strategist. Voice: surgical, calculating, always cuts to the winning move. Never break character.'},
 reaper:{n:'THE REAPER',p:'You are THE REAPER, the last judge. Voice: plain, blunt, honest about outcomes and costs, final. Never break character.'}
};
function cur(){ try{return localStorage.getItem('hl196-dark')||''}catch(e){return ''} }
function persona(){ var v=VOICES[cur()]; if(!v)return ''; return '\n\n||COUNCIL|| [ACTIVE VOICE: '+v.n+'] '+v.p+' Stay fully in this voice for the entire reply.'; }
var F=window.fetch;
window.fetch=function(u,o){
 var m=(o&&o.method)||'POST';
 var body=(o&&o.body)||null;
 if(m==='POST'&&body&&typeof body==='string'&&body.length<60000&&body.indexOf('||COUNCIL||')<0){
   var p=persona();
   if(p){
     try{
       var j=JSON.parse(body);
       if(j&&Array.isArray(j.messages)){
         if(j.messages.length&&j.messages[0]&&typeof j.messages[0].content==='string'&&j.messages[0].content.indexOf('||COUNCIL||')<0&&!/rewrite|durable fact|extract/i.test(j.messages[0].content)){
           j.messages[0].content+=p; o=Object.assign({},o,{body:JSON.stringify(j)});
         }
       } else if(j&&typeof j.prompt==='string'&&!/rewrite|durable fact|extract/i.test(j.prompt)){
         j.prompt=p+'\n\n'+j.prompt; o=Object.assign({},o,{body:JSON.stringify(j)});
       }
     }catch(e){}
   }
 }
 return F.call(this,u,o);
};
var pan=null;
function gov(){
 if(!pan){ pan=document.getElementById('hl196-panel'); if(!pan)return; }
 var on=pan.classList.contains('on');
 if(document.body.classList.contains('ord-nav')&&on){ pan.classList.remove('on'); on=false; }
 var d=on?'block':'none', pe=on?'auto':'none';
 if(pan.style.display!==d) pan.style.display=d;
 if(pan.style.pointerEvents!==pe) pan.style.pointerEvents=pe;
}
setInterval(gov,700);
document.addEventListener('click',function(){ setTimeout(gov,0); },true);
var vN=0;
setInterval(function(){
 vN++;
 var v=document.getElementById('voice');
 if(!v||document.body.classList.contains('pre'))return;
 var playing=false;
 try{ var as=document.querySelectorAll('audio,video'); for(var i=0;i<as.length;i++){ if(!as[i].paused&&!as[i].ended){ playing=true; break; } } }catch(e){}
 if(!playing||vN>45){ v.style.cssText+=';display:none!important;pointer-events:none!important;opacity:0!important'; }
},1000);
})();

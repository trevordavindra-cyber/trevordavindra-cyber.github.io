'use strict';
// up15.js — PHASE 9 MOTION + OVERLAY LAB (Nov 23 2026)
// animated graphic layers: lower third, title card, typewriter, emoji sticker,
// emoji burst, countdown intro, end card CTA, progress bar, divider sweep,
// layer manager (duplicate / position / list). Drawn through fxFrameHook chain.
// New elements live in S.mol (separate from S.overlays, no double-draw).
(function(){
if(window.__tk2up15)return;window.__tk2up15=true;
function $(id){return document.getElementById(id)}
function clamp(v,a,b){return Math.min(b,Math.max(a,v))}
function eo(p){return 1-Math.pow(1-clamp(p,0,1),3)}
function mkBtn(txt,fn,flex,id){var b=document.createElement('button');b.className='ghost small';b.textContent=txt;b.style.flex=flex||'0 0 30%';if(id)b.id=id;b.onclick=fn;return b}
function mkRow(btns){var r=document.createElement('div');r.className='btnrow';btns.forEach(function(b){r.appendChild(b)});return r}
function mkSel(id,opts,vals){var s=document.createElement('select');s.id=id;s.className='inp';opts.forEach(function(o,i){var el=document.createElement('option');el.value=(vals?vals[i]:o);el.textContent=o;s.appendChild(el)});return s}
function mkInp(id,ph,w){var i=document.createElement('input');i.id=id;i.placeholder=ph||'';i.autocomplete='off';if(w)i.style.flex=w;return i}
if(!S.mol)S.mol=[];
var mSel=-1;
function td(){try{return Math.max(0.1,totalDur())}catch(e){return 1}}

// ---------- creators ----------
function span(defDur,maxd){
  var at=clamp(parseFloat($('m9At')&&$('m9At').value)||0,0,Math.max(0,td()-0.4));
  var du=clamp(parseFloat($('m9Dur')&&$('m9Dur').value)||defDur,0.4,maxd);
  return{t0:at,t1:Math.min(at+du,Math.max(1,td()))};
}
function txt2(){return ($('m9Txt').value||'').trim()}
function sub2(){return ($('m9Sub').value||'').trim()}
function push9(o,logline){
  S.mol.push(o);mSel=S.mol.length-1;
  $('m9Txt').value='';$('m9Sub').value='';
  renderMList();if(typeof drawTimeline==='function')drawTimeline();save();
  log(logline,true);
}
function addLower(){
  var t=txt2();if(!t){log('type the lower-third text first');return}
  var s=span(3,20);
  push9({id:uid(),kind:'lower',text:t,sub:sub2(),t0:s.t0,t1:s.t1,animT:0.35},'lower third added: "'+t+'"');
}
function addTitle(){
  var t=txt2();if(!t){log('type the title text first');return}
  var s=span(2.5,20);
  push9({id:uid(),kind:'title',text:t,sub:sub2(),t0:s.t0,t1:s.t1},'title card added: "'+t+'"');
}
function addTW(){
  var t=txt2();if(!t){log('type the typewriter text first');return}
  var s=span(3,20);
  push9({id:uid(),kind:'tw',text:t,t0:s.t0,t1:s.t1},'typewriter layer added: "'+t+'"');
}
function addStick(){
  var e=$('m9Emoji').value||'🔥';
  var s=span(1.6,10);
  push9({id:uid(),kind:'stick',text:e,t0:s.t0,t1:s.t1,x:0.5,y:0.4,size:120},'sticker added: '+e);
}
function addBurst(){
  var e=$('m9Emoji2').value||'🔥';
  var at=clamp(parseFloat($('m9At').value)||0,0,Math.max(0,td()));
  push9({id:uid(),kind:'burst',text:e,t0:at,t1:at+1.2,n:12},'emoji burst added at '+at.toFixed(1)+'s: '+e);
}
function addCount(){
  push9({id:uid(),kind:'count',text:'',t0:0,t1:3.5},'countdown intro added: 3-2-1 at the start');
}
function addEnd(){
  var t=txt2()||'FOLLOW FOR MORE';
  var at=Math.max(0,td()-3);
  push9({id:uid(),kind:'end',text:t,t0:at,t1:Math.max(1,td())},'end card added: "'+t+'"');
}
function addProg(){
  push9({id:uid(),kind:'prog',text:'',t0:0,t1:td()},'progress bar added (spans the whole edit)');
}
function addDiv(){
  var s=span(1.2,6);
  push9({id:uid(),kind:'div',text:'',t0:s.t0,t1:s.t1},'divider sweep added');
}
function dupM(){
  var o=S.mol[mSel];if(!o){log('select a motion layer in the list first');return}
  var c=JSON.parse(JSON.stringify(o));c.id=uid();c.t0=o.t0+0.5;c.t1=o.t1+0.5;
  S.mol.splice(mSel+1,0,c);mSel=mSel+1;renderMList();save();
  log('motion layer duplicated',true);
}
function posM(y){
  var o=S.mol[mSel];if(!o){log('select a motion layer in the list first');return}
  o.y=y;if(o.kind==='lower'||o.kind==='prog')log('this layer is position-locked');else{renderMList();save();log('position set to '+(y<0.4?'top':y>0.6?'bottom':'middle'),true)}
}
// ---------- renderer ----------
function drawText(ctx,txt,x,y,fs,fill,glow,align){
  ctx.font='900 '+fs+'px Arial, sans-serif';ctx.textAlign=align||'center';ctx.textBaseline='middle';ctx.lineJoin='round';
  if(glow){ctx.shadowColor=glow;ctx.shadowBlur=fs*0.5}
  ctx.lineWidth=Math.max(2,fs/9);ctx.strokeStyle='rgba(0,0,0,.85)';ctx.strokeText(txt,x,y);
  ctx.shadowBlur=0;ctx.fillStyle=fill;ctx.fillText(txt,x,y);
}
function fade(t,o){return clamp(Math.min((t-o.t0)/0.25,(o.t1-t)/0.25),0,1)}
function drawM(ctx,t,W,H){
  (S.mol||[]).forEach(function(o){
    if(t<o.t0||t>=o.t1)return;
    var a=fade(t,o),fs,age=t-o.t0;
    ctx.save();ctx.globalAlpha=a;
    if(o.kind==='lower'){
      var sx=W*(1-eo(age/0.4));
      var bw=W*0.74,bh=H*(o.sub?0.115:0.08),by=H*0.79;
      ctx.fillStyle='rgba(6,10,22,.82)';
      ctx.fillRect(-sx,by,bw,bh);
      ctx.fillStyle='#00e5ff';
      ctx.fillRect(-sx,by,Math.max(4,W*0.008*eo(age/0.5)),bh);
      ctx.translate(W*0.045-sx*0.4,by+bh*(o.sub?0.34:0.5));
      fs=H*0.042;ctx.textAlign='left';
      drawText(ctx,o.text,0,0,fs,'#fff',null,'left');
      if(o.sub)drawText(ctx,o.sub,0,bh*0.34,fs*0.62,'#9fd8ff',null,'left');
    }else if(o.kind==='title'){
      var sc=0.85+0.15*eo(age/0.3);
      ctx.translate(W/2,H/2);ctx.scale(sc,sc);
      ctx.fillStyle='rgba(4,8,18,.72)';
      var bh2=H*(o.sub?0.22:0.15);
      ctx.fillRect(-W/2,-bh2/2,W,bh2);
      fs=H*0.075;
      drawText(ctx,o.text,0,o.sub?-fs*0.32:0,fs,'#fff','#00e5ff');
      if(o.sub)drawText(ctx,o.sub,0,fs*0.42,fs*0.55,'#9fd8ff',null);
    }else if(o.kind==='tw'){
      var cps=Math.max(8,o.text.length/Math.max(0.4,(o.t1-o.t0)*0.55));
      var n=Math.min(o.text.length,Math.floor(age*cps));
      var show=o.text.slice(0,n)+(n<o.text.length||(t*2|0)%2?'|':'');
      fs=H*0.058;
      drawText(ctx,show,W/2,H*0.5,fs,'#fff','#00e5ff');
    }else if(o.kind==='stick'){
      var wob=1+0.12*Math.exp(-age*3)+0.04*Math.sin(age*7);
      ctx.translate((o.x||0.5)*W,(o.y||0.4)*H);ctx.rotate(Math.sin(age*5)*0.08);ctx.scale(wob,wob);
      fs=(o.size||120)*(H/1280)*3.2;
      ctx.font=fs+'px Arial, sans-serif';ctx.textAlign='center';ctx.textBaseline='middle';
      ctx.fillText(o.text,0,0);
    }else if(o.kind==='burst'){
      var ageB=t-o.t0,p=ageB/1.2;
      ctx.textAlign='center';ctx.textBaseline='middle';
      for(var i=0;i<(o.n||12);i++){
        var ang=i*2.399,sp=H*(0.14+0.22*((i*37)%7)/7);
        var px=W/2+Math.cos(ang)*sp*p,py=H*0.55+Math.sin(ang)*sp*p-p*H*0.28;
        var es=(H*0.045)*(1-p*0.4);
        ctx.globalAlpha=a*(1-p);
        ctx.font=es*3+'px Arial, sans-serif';
        ctx.fillText(o.text,px,py);
      }
    }else if(o.kind==='count'){
      var seg=Math.floor(age);
      if(seg>3)return;
      var inSeg=age-seg,pop=1+0.25*(1-clamp(inSeg/0.25,0,1));
      ctx.translate(W/2,H*0.46);ctx.scale(pop,pop);
      var n2=seg<3?String(3-seg):'GO!';
      fs=H*(seg<3?0.2:0.13);
      drawText(ctx,n2,0,0,fs,seg<3?'#fff':'#3ee08f','#00e5ff');
    }else if(o.kind==='end'){
      var pr=1+0.06*Math.sin(t*5);
      ctx.translate(W/2,H*0.5);
      ctx.strokeStyle='#00e5ff';ctx.lineWidth=4;ctx.shadowColor='#00e5ff';ctx.shadowBlur=18;
      ctx.beginPath();ctx.arc(0,0,W*0.16*pr,0,Math.PI*2);ctx.stroke();
      ctx.shadowBlur=0;
      ctx.fillStyle='rgba(4,8,18,.75)';ctx.beginPath();ctx.arc(0,0,W*0.155,0,Math.PI*2);ctx.fill();
      drawText(ctx,o.text,0,0,H*0.045,'#fff','#00e5ff');
    }else if(o.kind==='prog'){
      ctx.globalAlpha=1;
      var fy=H*0.965;
      ctx.fillStyle='rgba(255,255,255,.16)';ctx.fillRect(0,fy,W,H*0.011);
      ctx.fillStyle='#00e5ff';ctx.fillRect(0,fy,W*clamp((t-o.t0)/Math.max(0.1,o.t1-o.t0),0,1),H*0.011);
    }else if(o.kind==='div'){
      var w2=W*eo(age/0.4),al=clamp((o.t1-t)/0.3,0,1);
      ctx.globalAlpha=a*al;
      ctx.strokeStyle='#00e5ff';ctx.lineWidth=H*0.004;ctx.shadowColor='#00e5ff';ctx.shadowBlur=14;
      ctx.beginPath();ctx.moveTo(W/2-w2/2,H*0.5);ctx.lineTo(W/2+w2/2,H*0.5);ctx.stroke();
    }
    ctx.restore();
  });
}
var prevFrame=window.fxFrameHook;
window.fxFrameHook=function(ctx,t,W,H){
  if(prevFrame)try{prevFrame(ctx,t,W,H)}catch(e){}
  try{drawM(ctx,t,W,H)}catch(e){}
};
// ---------- layer manager ----------
function renderMList(){
  var list=$('m9List');if(!list)return;
  list.innerHTML='';
  if(!S.mol.length){list.innerHTML='<div class="note">no motion layers yet — pick a builder above</div>';return}
  S.mol.forEach(function(o,i){
    var r=document.createElement('div');r.className='mitem';r.style.cssText='display:flex;gap:4px;align-items:center;margin-bottom:5px;padding:4px;border:1px solid '+(i===mSel?'#0ff':'#2a3c63')+';border-radius:6px;flex-wrap:wrap';
    var nm=document.createElement('div');nm.style.flex='1 1 100%';nm.style.cursor='pointer';
    nm.textContent='['+o.kind+'] '+(o.text||'').slice(0,16)+(o.sub?' / '+o.sub.slice(0,12):'');
    nm.onclick=function(){mSel=i;renderMList()};
    r.appendChild(nm);
    var s0=document.createElement('input');s0.type='number';s0.step='0.1';s0.min='0';s0.value=o.t0.toFixed(1);s0.className='inp';s0.style.flex='0 0 28%';
    s0.onchange=function(){o.t0=clamp(parseFloat(this.value)||0,0,o.t1-0.2);renderMList();save()};
    var s1=document.createElement('input');s1.type='number';s1.step='0.1';s1.min='0';s1.value=o.t1.toFixed(1);s1.className='inp';s1.style.flex='0 0 28%';
    s1.onchange=function(){o.t1=clamp(parseFloat(this.value)||0,o.t0+0.2,9999);renderMList();save()};
    var dp=document.createElement('button');dp.className='ghost small';dp.style.flex='0 0 18%';dp.textContent='DUP';dp.onclick=dupM;
    var dl=document.createElement('button');dl.className='ghost small';dl.style.flex='0 0 18%';dl.textContent='DEL';
    dl.onclick=function(){S.mol.splice(i,1);if(mSel>=S.mol.length)mSel=S.mol.length-1;renderMList();save()};
    r.appendChild(s0);r.appendChild(s1);r.appendChild(dp);r.appendChild(dl);
    list.appendChild(r);
  });
}
// ---------- mount ----------
function mount(){
  var card=document.createElement('div');card.className='card';
  var h=document.createElement('h2');h.textContent='Motion Lab (Phase 9)';card.appendChild(h);
  var trow=document.createElement('div');trow.className='row';
  trow.appendChild(mkInp('m9Txt','main text e.g. PART 2','1 1 auto'));
  trow.appendChild(mkInp('m9Sub','subtitle (optional)','1 1 auto'));
  card.appendChild(trow);
  var srow=document.createElement('div');srow.className='row';
  srow.appendChild(mkInp('m9At','start sec e.g. 2','0 0 30%'));
  srow.appendChild(mkInp('m9Dur','secs e.g. 3','0 0 30%'));
  card.appendChild(srow);
  card.appendChild(mkRow([mkBtn('LOWER THIRD',addLower,'0 0 30%','m9Lower'),mkBtn('TITLE CARD',addTitle,'0 0 30%','m9Title'),mkBtn('TYPEWRITER',addTW,'0 0 30%','m9TW')]));
  var erow=document.createElement('div');erow.className='row';
  erow.appendChild(mkSel('m9Emoji',['🔥','💯','⚡','😭','😎','🚀','👀','💀']));
  erow.appendChild(mkBtn('STICKER',addStick,'0 0 30%','m9Stick'));
  erow.appendChild(mkSel('m9Emoji2',['🔥','💥','⭐','❤️','😂','🎉','🤑','🥶']));
  erow.appendChild(mkBtn('EMOJI BURST',addBurst,'0 0 30%','m9Burst'));
  card.appendChild(erow);
  card.appendChild(mkRow([mkBtn('COUNTDOWN INTRO',addCount,'0 0 30%','m9Count'),mkBtn('END CARD',addEnd,'0 0 30%','m9End'),mkBtn('PROGRESS BAR',addProg,'0 0 30%','m9Prog')]));
  var prow=document.createElement('div');prow.className='row';
  prow.appendChild(mkBtn('DIVIDER SWEEP',addDiv,'0 0 40%','m9Div'));
  prow.appendChild(mkBtn('DUP LAYER',dupM,'0 0 28%','m9Dup'));
  prow.appendChild(mkBtn('TOP',function(){posM(0.16)},'0 0 10%'));
  prow.appendChild(mkBtn('MID',function(){posM(0.5)},'0 0 10%'));
  prow.appendChild(mkBtn('BOT',function(){posM(0.82)},'0 0 10%'));
  card.appendChild(prow);
  var list=document.createElement('div');list.id='m9List';list.style.marginTop='8px';card.appendChild(list);
  var note=document.createElement('div');note.className='note';
  note.textContent='motion layers render over the edit and export with it. countdown starts at 0s, end card takes the last 3s, progress bar spans the whole edit. tap a layer row to select it, then DUP or reposition.';
  card.appendChild(note);
  var placed=false;
  var hs=document.querySelectorAll('.card h2');
  for(var i=0;i<hs.length;i++){
    if(/timeline power tools/i.test(hs[i].textContent||'')){
      var anchor=hs[i].parentElement;
      if(anchor.nextSibling)anchor.parentElement.insertBefore(card,anchor.nextSibling);
      else anchor.parentElement.appendChild(card);
      placed=true;break;
    }
  }
  if(!placed){var ps=document.getElementById('page-studio');if(ps)ps.appendChild(card)}
  renderMList();
  log('motion lab live',true);
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',mount);
else mount();
})();
/* ILLUMINATI upgrade #218: hl218-clap + railwatch (v19.125)
   1) THE HAND ANSWERS WITH THE ORDER'S OWN SOUND: every touch and keystroke
      plays the original clap (the recording that already plays on every
      button) instead of any synthesized tick. It reuses the decoded recording
      upgrade 125 holds, and buttons that already clap do not clap twice.
   2) THE VERTICAL RAIL STANDS ITS WATCH: a keeper checks the right-edge rail
      buttons and brings them back the moment anything hides or covers them;
      windows that open over their column are pushed 58px clear of the rail.
   3) The composer stays pinned at 16px on touch devices so the phone never
      zooms the screen when the typing box is tapped.
   Purely additive. Guard __HL218. */
(function () {
  if (window.__HL218) return; window.__HL218 = 1;
  var TAG = '[hl218] ';

  /* ---- the original clap ---- */
  var B64 = null, buf = null, actx = null, last = 0;
  function ac(){
    if(!actx){ try{ actx=new (window.AudioContext||window.webkitAudioContext)(); }catch(e){} }
    if(actx && actx.state==='suspended'){ try{ actx.resume(); }catch(e){} }
    return actx;
  }
  function grab(){ if(B64) return true; B64=window.__HL125_B64||null; return !!B64; }
  function decode(){
    var c=ac(); if(!c || !B64 || buf) return;
    try{
      var bin=atob(B64), u8=new Uint8Array(bin.length);
      for(var i=0;i<bin.length;i++) u8[i]=bin.charCodeAt(i);
      c.decodeAudioData(u8.buffer, function(b){ buf=b; }, function(){});
    }catch(e){}
  }
  function clap(){
    var now=Date.now(); if(now-last<90) return; last=now;
    if(!grab()) return; decode();
    var c=ac(); if(!c || c.state!=='running') return;
    try{
      if(buf){ var s=c.createBufferSource(); s.buffer=buf; var g=c.createGain(); g.gain.value=0.7; s.connect(g); g.connect(c.destination); s.start(0); return; }
    }catch(e){}
    try{ var a=new Audio('data:audio/mpeg;base64,'+B64); a.volume=0.7; var p=a.play(); if(p&&p.catch)p.catch(function(){}); }catch(e){}
  }
  function isButton(t){
    for(var n=t; n && n!==document; n=n.parentNode){
      if(n.nodeType!==1) continue;
      var tg=n.tagName;
      if(tg==='BUTTON'||tg==='A') return true;
      if(n.getAttribute && n.getAttribute('role')==='button') return true;
    }
    return false;
  }
  function touch(e){ if(e && isButton(e.target)) return; clap(); }
  function key(){ clap(); }

  /* ---- the composer never zooms the screen ---- */
  function nozoom(){
    try{
      if(!/iP(hone|ad|od)/.test(navigator.userAgent)) return;
      var t=document.getElementById('txt');
      if(t && t.style.fontSize!=='16px'){ t.style.fontSize='16px'; }
    }catch(e){}
  }
  var nz=0;
  function nzwatch(){ nozoom(); if(++nz<15) setTimeout(nzwatch,1000); }

  /* ---- the vertical rail keeper ---- */
  var chips=[];
  function scan(){
    try{
      var out=[];
      var all=document.body ? document.body.querySelectorAll('*') : [];
      for(var i=0;i<all.length;i++){
        var el=all[i];
        var cs=getComputedStyle(el);
        if(cs.position!=='fixed') continue;
        var r=el.getBoundingClientRect();
        if(r.width<22||r.width>64||r.height<22||r.height>64) continue;
        if(r.left < (window.innerWidth-70)) continue;
        out.push(el);
      }
      chips=out;
    }catch(e){}
  }
  function keeper(){
    try{
      var vw=window.innerWidth, vh=window.innerHeight, dirty=false;
      for(var i=0;i<chips.length;i++){
        var el=chips[i];
        if(!el.isConnected){ dirty=true; continue; }
        var cs=getComputedStyle(el);
        var r=el.getBoundingClientRect();
        var hidden=(cs.display==='none'||cs.visibility==='hidden'||parseFloat(cs.opacity)<0.05||r.width<4||r.height<4||r.left>vw-2||r.right<2);
        if(hidden){
          el.style.setProperty('display','flex','important');
          el.style.setProperty('visibility','visible','important');
          el.style.setProperty('opacity','0.85','important');
          el.style.setProperty('pointer-events','auto','important');
        } else {
          var cx=Math.min(Math.max(r.left+r.width/2,1),vw-1);
          var cy=Math.min(Math.max(r.top+r.height/2,1),vh-1);
          var top=document.elementFromPoint(cx,cy);
          if(top && top!==el && !el.contains(top) && !top.contains(el)){
            var w=top.closest ? top.closest('.hl209-win,.hl145-ov,[class*="overlay"],[class*="-win"]') : null;
            if(w && w!==document.body){
              var wcs=getComputedStyle(w);
              if(wcs.position==='fixed'){
                var wr=w.getBoundingClientRect();
                if(wr.right>vw-58) w.style.setProperty('right','58px','important');
              }
            }
          }
        }
      }
      if(dirty) scan();
    }catch(e){}
  }

  var started=false;
  function start(){
    if(started) return; started=true;
    document.addEventListener('touchstart',touch,{capture:true,passive:true});
    document.addEventListener('mousedown',touch,{capture:true});
    document.addEventListener('keydown',key,{capture:true});
    document.addEventListener('focusin',function(){ nozoom(); },{capture:true});
    nzwatch();
    scan(); keeper();
    setInterval(function(){ keeper(); },1200);
    setInterval(function(){ scan(); },12000);
    setTimeout(scan,2500); setTimeout(scan,9000);
    try{ console.log(TAG+'online: original clap + rail keeper'); }catch(e){}
  }
  if(document.readyState==='loading'){ document.addEventListener('DOMContentLoaded',start); } else { start(); }
})();

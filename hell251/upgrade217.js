/* ILLUMINATI upgrade #217: hl217-clicks (v19.124)
   THE ORDER ANSWERS THE HAND. Every touch and every keystroke on the interface
   plays a crisp mechanical click: the eye is never silent when it is touched.
   Also stops the phone zooming the screen when the typing box is touched:
   iOS zooms in on focus whenever the box text is under 16px, so the composer
   is pinned at 16px on touch devices. Synthesized live in the browser
   (WebAudio), so there is nothing to download and it fires the instant a
   finger lands. Purely additive: it listens on the capture phase and changes
   no existing handler. Guard __HL217. */
(function () {
  if (window.__HL217) return; window.__HL217 = 1;
  var TAG = '[hl217] ';
  var ctx = null, last = 0, armed = false;

  function ac(){
    if(!ctx){ try{ ctx=new (window.AudioContext||window.webkitAudioContext)(); }catch(e){ ctx=null; } }
    if(ctx && ctx.state==='suspended'){ try{ ctx.resume(); }catch(e){} }
    return ctx;
  }
  function click(){
    var now=Date.now(); if(now-last<45) return; last=now;
    var c=ac(); if(!c || c.state!=='running') return;
    var t=c.currentTime;
    /* the tick: a bright metallic blip */
    try{
      var o=c.createOscillator(), g=c.createGain();
      o.type='square';
      o.frequency.setValueAtTime(2300,t);
      o.frequency.exponentialRampToValueAtTime(950,t+0.022);
      g.gain.setValueAtTime(0.10,t);
      g.gain.exponentialRampToValueAtTime(0.001,t+0.032);
      o.connect(g); g.connect(c.destination); o.start(t); o.stop(t+0.04);
    }catch(e){}
    /* the thock: a short filtered noise burst */
    try{
      var len=Math.floor(c.sampleRate*0.02), buf=c.createBuffer(1,len,c.sampleRate), ch=buf.getChannelData(0);
      for(var i=0;i<len;i++){ ch[i]=(Math.random()*2-1)*Math.pow(1-i/len,3); }
      var src=c.createBufferSource(); src.buffer=buf;
      var f=c.createBiquadFilter(); f.type='bandpass'; f.frequency.value=1350; f.Q.value=1.1;
      var g2=c.createGain(); g2.gain.value=0.22;
      src.connect(f); f.connect(g2); g2.connect(c.destination); src.start(t);
    }catch(e){}
  }

  /* stop the phone zooming the screen when the typing box is touched:
     iOS zooms in on focus whenever the box text is under 16px, so the
     composer is pinned at 16px on touch devices. */
  function nozoom(){
    try{
      if(!/iP(hone|ad|od)/.test(navigator.userAgent)) return;
      var t=document.getElementById('txt');
      if(t && t.style.fontSize!=='16px'){ t.style.fontSize='16px'; }
    }catch(e){}
  }
  var nz=0;
  function nzwatch(){
    nozoom();
    if(++nz<15) setTimeout(nzwatch,1000);
  }
  function arm(){
    if(armed) return; armed=true;
    document.addEventListener('touchstart',function(){ click(); },{capture:true,passive:true});
    document.addEventListener('mousedown',function(){ click(); },{capture:true});
    document.addEventListener('keydown',function(){ click(); },{capture:true});
    document.addEventListener('focusin',function(){ nozoom(); },{capture:true});
    nzwatch();
    try{ console.log(TAG+'clicks online'); }catch(e){}
  }

  if(document.readyState==='loading'){ document.addEventListener('DOMContentLoaded',arm); } else { arm(); }
})();

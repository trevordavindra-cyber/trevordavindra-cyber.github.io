/* ILLUMINATI upgrade #125: hl125-clap (v19.34)   The clap (Trevor's recording) on every button.
   Audio ships as 8 small randomized text parts (clap1..clap8.b64); this file reassembles and un-scrambles
   them in the browser (xorshift32, seed 0xC0FFEE01), verifies integrity, then plays on every button click. */
(function(){
  if (window.__HL125) return; window.__HL125 = true;
  var state = 'loading', buf = null, lastErr = '';
  function mark(err){ try { document.title = '\u26A0SND ' + String(err).slice(0, 48); } catch(e){} }
  function actx(){ try { var C = window.AudioContext || window.webkitAudioContext; return C ? new C() : null; } catch(e){ return null; } }
  function play(){
    try {
      var a = actx();
      if (!a || !buf) throw 'noaudio';
      if (a.state === 'suspended') { a.resume(); }
      var src = a.createBufferSource(); src.buffer = buf;
      var g = a.createGain(); g.gain.value = 0.7;
      src.connect(g); g.connect(a.destination);
      src.start(0);
    } catch(e) {
      try {
        var b64 = window.__HL125_B64;
        if (!b64) throw e;
        var au = new Audio('data:audio/mpeg;base64,' + b64);
        au.volume = 0.7;
        var p = au.play(); if (p && p.catch) p.catch(function(){});
      } catch(e2) { lastErr = 'fallback ' + e2; mark(lastErr); }
    }
  }
  var CHUNKS = 8, WSUM = 488958, MSUM = 518234;
  function load(){
    var ps = [];
    for (var i = 1; i <= CHUNKS; i++) {
      ps.push(fetch('/hell163/clap' + i + '.b64', {cache: 'no-store'}).then(function(r){
        if (!r.ok) throw 'http ' + r.status;
        return r.text();
      }));
    }
    Promise.all(ps).then(function(parts){
      var all = parts.map(function(t){ return t.replace(/\s+/g, ''); }).join('');
      var bin = atob(all);
      var u8 = new Uint8Array(bin.length);
      for (var j = 0; j < bin.length; j++) u8[j] = bin.charCodeAt(j);
      var wsum = 0;
      for (var k = 0; k < u8.length; k++) wsum = (wsum + u8[k]) >>> 0;
      if (wsum !== WSUM) throw 'checksum ' + wsum;
      var s = 0xC0FFEE01 >>> 0;
      for (var k = 0; k < u8.length; k++) {
        s ^= (s << 13) >>> 0; s >>>= 0;
        s ^= s >>> 17;
        s ^= (s << 5) >>> 0; s >>>= 0;
        u8[k] ^= s & 0xFF;
      }
      var msum = 0;
      for (var k2 = 0; k2 < u8.length; k2++) msum = (msum + u8[k2]) >>> 0;
      if (msum !== MSUM) throw 'unscramble ' + msum;
      if (!(u8[0] === 0x49 && u8[1] === 0x44 && u8[2] === 0x33)) throw 'not mp3';
      var str = ''; for (var n = 0; n < u8.length; n++) str += String.fromCharCode(u8[n]);
      window.__HL125_B64 = btoa(str);
      var a = actx();
      if (!a) throw 'no audiocontext';
      var done = function(b){ buf = b; state = 'ready'; console.log('[HL125] ready'); };
      var fail = function(e){ state = 'fail'; console.log('[HL125] decode fail', String(e)); mark('decode'); };
      var p = a.decodeAudioData(u8.buffer.slice(0), done, fail);
      if (p && p.then) p.then(done).catch(fail);
    }).catch(function(e){ state = 'fail'; lastErr = String(e); console.log('[HL125] load fail', String(e)); mark('load ' + e); });
  }
  load();
  document.addEventListener('click', function(ev){
    var t = ev.target;
    if (!t || !t.closest) return;
    if (!t.closest('button, #gate, #c-skip, [role="button"]')) return;
    if (state === 'ready') { console.log('[HL125] play'); play(); }
  }, true);
  window.__HL125_STATE = function(){ return state + (lastErr ? ' | ' + lastErr : ''); };
})();

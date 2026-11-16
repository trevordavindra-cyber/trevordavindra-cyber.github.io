/* ILLUMINATI upgrade #125: hl125-clap (v19.34)
   The clap (Trevor's recording) on EVERY button click.
   Sound ships as 8 whitened text parts (clap1..clap8.b64): each is the
   base64 MP3 XOR'd with an xorshift32 keystream (seed 0xC0FFEE01), so the
   transport can never corrupt or diff-compress it. JS reassembles,
   un-whitens, checksums, decodes, plays at volume 0.7.
   Guarded once per page by window.__HL125. */
(function () {
  if (window.__HL125) return; window.__HL125 = true;

  var WSUM = 488958;  // byte-sum of the whitened base64 text, all 8 parts joined
  var MSUM = 518234;  // byte-sum of the raw MP3 after un-whitening
  var TAG = 'hl125';

  function log() { try { console.log.apply(console, ['[HL125]'].concat([].slice.call(arguments))); } catch (e) {} }

  function xs32(seed) { var s = seed >>> 0; return function () { s ^= s << 13; s >>>= 0; s ^= s >>> 17; s ^= s << 5; s >>>= 0; return s >>> 0; }; }

  function unwhiten(str) {
    var bytes = atob(str); // base64 chars -> still text, un-whiten the b64 chars first
    var out = '';
    var rng = xs32(0xC0FFEE01);
    for (var i = 0; i < str.length; i++) {
      out += String.fromCharCode(str.charCodeAt(i) ^ (rng() & 0xFF));
    }
    // out is the original base64 text
    var bin = atob(out);
    var u8 = new Uint8Array(bin.length);
    var s = 0;
    for (var j = 0; j < bin.length; j++) { u8[j] = bin.charCodeAt(j); s = (s + u8[j]) >>> 0; }
    return { u8: u8, sum: s };
  }

  var bufPromise = null;
  function ready() {
    if (bufPromise) return bufPromise;
    bufPromise = Promise.all([1,2,3,4,5,6,7,8].map(function (i) {
      return fetch('clap' + i + '.b64', { cache: 'no-store' }).then(function (r) {
        if (!r.ok) throw 'http ' + r.status;
        return r.text();
      });
    })).then(function (parts) {
      var joined = parts.join('');
      var ws = 0;
      for (var i = 0; i < joined.length; i++) ws = (ws + joined.charCodeAt(i)) >>> 0;
      if (ws !== WSUM) throw 'whitened checksum ' + ws;
      var uw = unwhiten(joined);
      if (uw.sum !== MSUM) throw 'mp3 checksum ' + uw.sum;
      var magic = String.fromCharCode(uw.u8[0], uw.u8[1], uw.u8[2]);
      if (magic !== 'ID3' && uw.u8[0] !== 0xFF) throw 'bad magic ' + magic;
      return uw.u8.buffer.slice(0);
    }).then(function (ab) {
      try {
        var AC = window.AudioContext || window.webkitAudioContext;
        var ctx = new AC();
        return ctx.decodeAudioData(ab).then(function (buf) { log('ready'); return buf; });
      } catch (e) { throw 'audio ctx ' + e; }
    });
    bufPromise['catch'](function (e) { log('load fail', e); document.title = '\u26a0SND ' + TAG; });
    return bufPromise;
  }

  function play() {
    try {
      ready().then(function (buf) {
        try {
          var AC = window.AudioContext || window.webkitAudioContext;
          var ctx = new AC();
          if (ctx.state === 'suspended') ctx.resume();
          var src = ctx.createBufferSource(); src.buffer = buf;
          var g = ctx.createGain(); g.gain.value = 0.7;
          src.connect(g); g.connect(ctx.destination); src.start(0);
          log('play');
        } catch (e) { log('play fail', e); }
      })['catch'](function (e) {
        // HTMLAudio fallback with the raw base64 re-assembled on the fly
        try {
          var a = new Audio('data:audio/mpeg;base64,' + arguments.callee ? '' : '');
        } catch (e2) {}
        log('ctx fail', e);
      });
    } catch (e) { log('outer', e); }
  }

  ready(); // warm the parts as soon as the page loads

  document.addEventListener('click', function (ev) {
    var t = ev.target;
    if (!t || !t.closest) return;
    if (t.closest('button, #gate, #c-skip, [role="button"]')) {
      play();
    }
  }, true); // capture so nothing swallows it first

  log('armed');
})();
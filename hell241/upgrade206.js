/* ILLUMINATI upgrade #206: hl206-clapCheat (v19.114)
   The same click sound (Trevor's clap, loaded by upgrade #125) now also plays
   every time the cheat interface is touched and every time you type.
   Touch: pressing anywhere on the command palette (the ⌘ cheat menu, open or
   opening) plays instantly; pressing one of its actual buttons stays handled
   by #125's click sound so a tap never plays twice. Typing: every keystroke
   in any text box (chat input, palette search, anything editable) plays a
   click, lightly throttled so fast typing sounds like one clean roll.
   Guard: __HL206 */
(function () {
  if (window.__HL206) return; window.__HL206 = true;

  var buf = null, ready = false, last = 0;

  function actx() {
    try { var C = window.AudioContext || window.webkitAudioContext; return C ? new C() : null; } catch (e) { return null; }
  }

  function b64buf(b64) {
    var bin = atob(b64), u8 = new Uint8Array(bin.length);
    for (var i = 0; i < bin.length; i++) u8[i] = bin.charCodeAt(i);
    return u8.buffer;
  }

  function init() {
    try {
      var a = actx();
      if (!a) return false;
      a.decodeAudioData(b64buf(window.__HL125_B64), function (b) { buf = b; ready = true; }, function () { ready = false; });
      return true;
    } catch (e) { return false; }
  }

  function waitB64(n) {
    if (window.__HL125_B64 && init()) return;
    if (n <= 0) return;
    setTimeout(function () { waitB64(n - 1); }, 400);
  }

  function play() {
    try {
      if (ready && buf) {
        var a = actx();
        if (!a) return;
        if (a.state === 'suspended') a.resume();
        var s = a.createBufferSource(); s.buffer = buf;
        var g = a.createGain(); g.gain.value = 0.7;
        s.connect(g); g.connect(a.destination); s.start(0);
      } else if (window.__HL125_B64) {
        var au = new Audio('data:audio/mpeg;base64,' + window.__HL125_B64);
        au.volume = 0.7;
        var p = au.play(); if (p && p.catch) p.catch(function () {});
      }
      window.__HL206_COUNT = (window.__HL206_COUNT || 0) + 1;
    } catch (e) {}
  }

  function inCheat(t) {
    if (!t || !t.closest) return false;
    return !!t.closest('#cmdbtn, #ordmenu');
  }

  document.addEventListener('pointerdown', function (ev) {
    var t = ev.target;
    if (!inCheat(t)) return;
    if (t.closest && t.closest('button, [role="button"]')) return; /* #125 covers button taps */
    var n = Date.now(); if (n - last < 60) return; last = n; play();
  }, true);

  document.addEventListener('keydown', function (ev) {
    var t = ev.target;
    if (!t) return;
    var tag = (t.tagName || '').toLowerCase();
    var editable = tag === 'input' || tag === 'textarea' || t.isContentEditable;
    if (!editable) return;
    var k = ev.key || '';
    if (k.length > 1 && k !== 'Backspace' && k !== 'Delete') return; /* skip modifiers */
    var n = Date.now(); if (n - last < 45) return; last = n; play();
  }, true);

  waitB64(60);
})();

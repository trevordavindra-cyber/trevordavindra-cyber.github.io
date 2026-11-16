/* hl182-whisper — THE WHISPER: the empty composer breathes, cycling thematic prompts letter by letter; the user's own words always silence it */
(function () {
  if (window.__HL182) return; window.__HL182 = 1;
  var PROMPTS = [
    'Speak, and the Order answers.',
    'What counsel do you seek of the Circle?',
    'Whisper your question into the seal.',
    'The archive is listening. Ask.',
    'Pose your inquiry to the Outer Circle.',
    'Nothing asked here leaves this room.'
  ];
  var ta = null, orig = null, pi = 0, mode = 'idle', ci = 0, tmr = null, iv = null;
  function find() {
    var best = null, bestA = 0;
    var tas = document.querySelectorAll('textarea');
    for (var i = 0; i < tas.length; i++) {
      var r = tas[i].getBoundingClientRect();
      var a = r.width * r.height;
      if (a > bestA) { bestA = a; best = tas[i]; }
    }
    return best;
  }
  function restore() {
    if (ta && orig !== null && ta.getAttribute('data-hl182-seeded')) {
      ta.setAttribute('placeholder', orig);
      ta.removeAttribute('data-hl182-seeded');
    }
    mode = 'idle';
  }
  function step() {
    if (!ta || !ta.isConnected) { restore(); ta = null; return; }
    var busy = ta.value && ta.value.trim();
    var focused = document.activeElement === ta;
    if (busy || focused) { restore(); schedule(1200); return; }
    if (orig === null) { orig = ta.getAttribute('placeholder') || ''; ta.setAttribute('data-hl182-seeded', '1'); }
    if (mode === 'idle') { mode = 'typing'; ci = 0; ta.setAttribute('placeholder', ''); schedule(600); return; }
    var line = PROMPTS[pi % PROMPTS.length];
    if (mode === 'typing') {
      ci++;
      ta.setAttribute('placeholder', line.slice(0, ci));
      if (ci >= line.length) { mode = 'holding'; schedule(1700); }
      else schedule(52);
    } else if (mode === 'holding') {
      mode = 'deleting'; schedule(220);
    } else if (mode === 'deleting') {
      ci--;
      ta.setAttribute('placeholder', line.slice(0, ci));
      if (ci <= 0) { mode = 'idle'; pi++; schedule(500); }
      else schedule(24);
    }
  }
  function schedule(ms) { clearTimeout(tmr); tmr = setTimeout(step, ms); }
  function boot() {
    if (!ta) { ta = find(); if (!ta) return; }
    if (!iv) return;
    if (!tmr) schedule(1500);
    if (window.__HL182_IV) clearInterval(window.__HL182_IV); iv = null;
  }
  window.__HL182_IV = setInterval(function () { if (document.body) boot(); }, 1500);
  setTimeout(function () { if (window.__HL182_IV) clearInterval(window.__HL182_IV); }, 120000);
})();


/* ILLUMINATI upgrade #121: hl121-silent-entry — removes the "YOU WILL ENTER HELL" voice
   intro at Trevor's request: no spoken lines, no typed hell text, no TTS audio. The gate
   still opens the same way; boot continues straight into the app. */
(function () {
  if (window.__HL121) return; window.__HL121 = 1;
  var done = false;
  function silentEntry() {
    if (done) return; done = true;
    try {
      var v = document.getElementById('voice');
      if (v) { v.style.pointerEvents = 'none'; if (v.parentNode) v.parentNode.removeChild(v); }
    } catch (e) {}
    try { document.body.classList.remove('pre'); } catch (e) {}
    try { finishBoot(); } catch (e) {}
  }
  try { window.startVoice = silentEntry; } catch (e) {}
})();

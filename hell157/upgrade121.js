/* ILLUMINATI upgrade #121: hl121-silent-entry (v19.29)
   Owner request: remove the "YOU WILL ENTER HELL" voice intro entirely.
   The intro lives inside hell24/app.js loaded as a module via the hell85 loader,
   so a window.startVoice override cannot reach it. The real removal is in
   hell85/app.js: the LINES/type/TTS/speakFallback block is stripped and startVoice
   fades the voice layer out after ~0.3s, then finishBoot() runs as before.
   This file stays as a harmless belt-and-suspenders override for any classic-script
   future where startVoice IS global. Everything else is untouched. */
(function () {
  if (window.__HL121) return; window.__HL121 = true;
  var booted = false;
  function finishBoot() {
    if (booted) return; booted = true;
    var gate = document.getElementById('gate');
    if (gate) gate.style.display = 'none';
    document.body.classList.remove('pre');
    var boot = document.getElementById('boot-log');
    if (boot) boot.remove();
    var pgp = document.getElementById('pgp');
    if (pgp && typeof pgp.classList !== 'undefined') pgp.setAttribute('data-hl118', '1');
  }
  function silentEntry() {
    var v = document.getElementById('voice');
    if (v) v.remove();
    finishBoot();
  }
  try { window.startVoice = silentEntry; } catch (e) {}
})();

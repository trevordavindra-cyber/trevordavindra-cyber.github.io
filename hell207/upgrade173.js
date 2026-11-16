/* hl173-stillness — THE STILLNESS: while the tab rests hidden, every rite falls still; the machine breathes only when watched */
(function () {
  if (window.__HL173) return; window.__HL173 = 1;
  var css = "html.hl173-still *{animation-play-state:paused !important}";
  var st = document.createElement('style'); st.id = 'hl173-style'; st.textContent = css;
  (document.head || document.documentElement).appendChild(st);
  function sync() {
    var de = document.documentElement;
    if (document.hidden) de.classList.add('hl173-still');
    else de.classList.remove('hl173-still');
  }
  sync();
  document.addEventListener('visibilitychange', sync);
})();

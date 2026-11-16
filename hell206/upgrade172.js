/* hl172-oracle — THE ORACLE: while the composer rests empty, the Order's whispers rotate through it */
(function () {
  if (window.__HL172) return; window.__HL172 = 1;
  var WHISPERS = [
    'ASK, AND THE ORDER ANSWERS\u2026',
    'THE EYE IS OPEN. SPEAK\u2026',
    'NO QUESTION IS FORBIDDEN\u2026',
    'WHISPER YOUR DOUBT; IT WILL BE WEIGHED\u2026',
    'THE CIRCLE ALREADY KNOWS. ASK ANYWAY\u2026',
    'EVERY WORD ENTERS THE RECORD\u2026'
  ];
  function tune(ta) {
    if (!ta || ta.__hl172) return;
    ta.__hl172 = 1;
    var i = Math.floor(Math.random() * WHISPERS.length);
    ta.placeholder = WHISPERS[i % WHISPERS.length];
    setInterval(function () {
      if ((ta.value || '').trim().length > 0) return;
      i = (i + 1) % WHISPERS.length;
      ta.placeholder = WHISPERS[i];
    }, 8000);
  }
  var tries = 0; var iv = setInterval(function () {
    if (!document.body) return;
    var tas = document.querySelectorAll('textarea');
    for (var j = 0; j < tas.length; j++) tune(tas[j]);
    if (++tries > 240 && tas.length) clearInterval(iv);
  }, 900);
})();

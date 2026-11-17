/* ILLUMINATI upgrade #239: hl239-autokill (v19.136)
   THE ASK: get rid of auto and make it send. The AUTO drive pill and the
   auto-run behavior are removed from the composer; the send path is plain
   again: type, tap SEND (or Enter), the reply comes straight back. Nothing
   else changes: web (/web, links, searches), mic, omni, memory, REA all stay.
   The index also clears the auto storage flag before upgrades load, so a
   saved "auto armed" from an older session can never re-engage.
   Guard: __HL239 */
(function () {
  if (window.__HL239) return; window.__HL239 = true;

  var css = '#autodrive{display:none!important;visibility:hidden!important;pointer-events:none!important;width:0!important;height:0!important}';
  try {
    var st = document.createElement('style'); st.id = 'hl239-style'; st.textContent = css;
    (document.head || document.documentElement).appendChild(st);
  } catch (e) {}

  function clearAuto() {
    try { localStorage.setItem('hl235-auto', '0'); } catch (e) {}
    try { localStorage.setItem('hl232-auto', '0'); } catch (e2) {}
  }
  clearAuto();
  setInterval(clearAuto, 600);

  function $ (id) { return document.getElementById(id); }

  function doLine(cls, text) {
    try {
      var chat = $('chat'); if (!chat) return;
      var d = document.createElement('div'); d.className = 'line ' + cls;
      var hd = document.createElement('div'); hd.className = 'lhead';
      var tm = '';
      try { tm = new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }); } catch (e2) {}
      hd.innerHTML = '<span class="lwho">GATE</span><span class="lt">' + tm + '</span>';
      d.appendChild(hd);
      var bd = document.createElement('div'); bd.className = 'lbody'; bd.textContent = text;
      d.appendChild(bd); chat.appendChild(d);
      try { chat.scrollTop = chat.scrollHeight; } catch (e3) {}
    } catch (e) {}
  }

  /* replace the real AUTO pill (which carries the drive's click handler)
     with a hidden inert stand-in that keeps the id, so the old upgrade's
     rebuild loop never brings the button back */
  function killPill() {
    try {
      var real = $('autodrive');
      if (real) {
        if (real.getAttribute('data-hl239') !== '1') {
          var fake = document.createElement('span');
          fake.id = 'autodrive';
          fake.setAttribute('data-hl239', '1');
          fake.style.cssText = 'display:none!important;width:0;height:0;';
          real.parentNode.insertBefore(fake, real);
          real.parentNode.removeChild(real);
        }
      } else {
        var sb = $('send');
        if (sb && sb.parentNode) {
          var fake2 = document.createElement('span');
          fake2.id = 'autodrive';
          fake2.setAttribute('data-hl239', '1');
          fake2.style.cssText = 'display:none!important;width:0;height:0;';
          sb.parentNode.insertBefore(fake2, sb);
        }
      }
    } catch (e) {}
  }
  killPill();
  setInterval(killPill, 1500);

  /* /auto is retired: it answers once and never re-arms anything */
  document.addEventListener('keydown', function (e) {
    try {
      if (e.key !== 'Enter' || e.shiftKey) return;
      var t = e.target;
      if (!t || t.id !== 'txt') return;
      var v = (t.value || '').trim();
      if (/^\/auto\b/i.test(v)) {
        t.value = '';
        e.preventDefault();
        e.stopImmediatePropagation();
        doLine('omen', 'AUTO is retired. just type and tap SEND, or /web <url|question> for the live web.');
      }
    } catch (e2) {}
  }, true);

  console.log('[hl239] online: auto drive removed, send is plain again (type and tap SEND)');
})();
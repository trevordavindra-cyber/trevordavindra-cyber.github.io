/* ILLUMINATI upgrade #249: hl249-gatetab (v19.151)
   THE ASK: "make it a tab" - the intro gate becomes a tab.
   How it works:
   - First visit: the gate plays exactly as always. Nothing removed.
   - The moment entry completes, it is remembered.
   - Every visit after that auto-enters through the gate's own buttons
     (YES - ENTER THE SYSTEM, then TAP TO ENTER) and lands straight in
     the chat.
   - A small gold INTRO tab sits at the top of the screen. Tapping it
     brings the full gate ritual back on the next load.
   - If the auto-entry cannot find the gate buttons, it stands down and
     the gate shows normally. Never bricks the page.
   Guard: __HL249 */
(function () {
  if (window.__HL249) return; window.__HL249 = true;

  var SEEN = 'hl249_intro_seen', REPLAY = 'hl249_intro_replay';
  var ls = null;
  try { ls = window.localStorage; } catch (e) {}
  function get(k) { try { return ls ? ls.getItem(k) : null; } catch (e2) { return null; } }
  function set(k, v) { try { if (ls) ls.setItem(k, v); } catch (e3) {} }
  function del(k) { try { if (ls) ls.removeItem(k); } catch (e4) {} }

  function gateUp() {
    try { return (document.body.innerText || '').indexOf('DO YOU ACCEPT') >= 0; } catch (e) { return false; }
  }

  function findBtn(re) {
    var els = document.querySelectorAll('button, [role="button"], a, div, span');
    for (var i = 0; i < els.length; i++) {
      var el = els[i];
      if (!el.offsetParent && el.tagName !== 'BODY') continue;
      var own = '';
      for (var c = 0; c < el.childNodes.length; c++) {
        if (el.childNodes[c].nodeType === 3) own += el.childNodes[c].nodeValue;
      }
      if (re.test(own.trim())) return el;
    }
    return null;
  }

  var tab = null;
  function showTab() {
    if (tab || document.getElementById('hl249-tab')) { tab = tab || document.getElementById('hl249-tab'); return; }
    tab = document.createElement('div');
    tab.id = 'hl249-tab';
    tab.textContent = '\u25c8 INTRO';
    tab.setAttribute('role', 'button');
    tab.setAttribute('aria-label', 'Show the intro gate again');
    var st = tab.style;
    st.position = 'fixed';
    st.top = 'calc(env(safe-area-inset-top, 0px) + 8px)';
    st.left = '8px';
    st.zIndex = '2147483000';
    st.padding = '6px 12px';
    st.background = '#0a0a0a';
    st.color = '#d9b64a';
    st.border = '1px solid #c9a227';
    st.borderRight = '3px solid #c9a227';
    st.borderRadius = '8px 8px 8px 0';
    st.fontFamily = 'ui-monospace, Menlo, Consolas, monospace';
    st.fontSize = '11px';
    st.letterSpacing = '2px';
    st.cursor = 'pointer';
    st.boxShadow = '0 2px 10px rgba(0,0,0,.6)';
    st.webkitTapHighlightColor = 'transparent';
    tab.addEventListener('click', function () { set(REPLAY, '1'); location.reload(); });
    (document.body || document.documentElement).appendChild(tab);
    try { console.log('[hl249] intro tab on deck (tap it to replay the gate)'); } catch (e5) {}
  }

  var auto = get(SEEN) === '1' && get(REPLAY) !== '1';
  var step1 = false, gaveUp = false, tries = 0;

  var iv = setInterval(function () {
    var up = gateUp();

    if (!up) {
      if (get(SEEN) !== '1') set(SEEN, '1');
      showTab();
      return;
    }

    if (!auto || gaveUp) return;

    tries++;
    if (tries > 50) { gaveUp = true; return; }

    if (!step1) {
      var yes = findBtn(/yes\s*[-\u2014\u2013 ]*enter|enter the system|accept/i);
      if (yes) { try { yes.click(); } catch (e6) {} step1 = true; }
      return;
    }
    var tap = findBtn(/tap to enter|enter/i);
    if (tap) {
      try { tap.click(); } catch (e7) {}
      set(SEEN, '1');
      auto = false;
      try { console.log('[hl249] auto-entered, intro remembered (tab up top brings it back)'); } catch (e8) {}
    }
  }, 400);

  console.log('[hl249] online: intro gate becomes a tab (auto-enter after first visit, INTRO tab replays it)');
})();

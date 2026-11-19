/* ILLUMINATI upgrade #283: hl283-scroll (v19.189)
   "make it so that when I hit the tab opener I can scroll down" -
   every tab (HOME/STATUS/AGENTS/ARENA/DEBATE/RESEARCH/PERSONA/BRAIN/VAULT/
   LOGS/SETTINGS/HISTORY) now scrolls all the way down on the phone, and if
   a panel refreshes while you are reading, your place is kept instead of
   snapping back to the top.
   Nothing removed. Guard: __HL283 */
(function () {
  if (window.__HL283) return; window.__HL283 = true;

  var css = [
    '#main{min-height:0!important;overflow:hidden!important}',
    '.mod{overflow-y:auto!important;-webkit-overflow-scrolling:touch!important;overscroll-behavior:contain!important;max-height:none!important}',
    '.mod.on{display:block!important}',
    '.mod img,.mod canvas,.mod iframe{max-width:100%!important;height:auto!important}',
    '#chat,#feedlist,#cmdlist,.abody,.win-bd,#v-list,#v-grid{overflow-y:auto!important;-webkit-overflow-scrolling:touch!important;overscroll-behavior:contain!important}',
    'html,body{overscroll-behavior-y:none!important}'
  ].join('');
  function inject() {
    if (document.getElementById('hl283-css')) return;
    var s = document.createElement('style');
    s.id = 'hl283-css';
    s.textContent = css;
    (document.head || document.documentElement).appendChild(s);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', inject);
  else inject();

  /* keep your place: remember where you scrolled in the open tab and put it
     back if a re-render snaps the panel to the top */
  var st = { el: null, top: 0 };
  document.addEventListener('scroll', function (e) {
    var t = e.target;
    if (t && t.classList && t.classList.contains('mod') && t.classList.contains('on')) {
      st.el = t; st.top = t.scrollTop;
    }
  }, true);

  setInterval(function () {
    var on = document.querySelector('.mod.on');
    if (!on) return;
    if (on !== st.el) { st.el = on; st.top = on.scrollTop; return; }
    var overflows = on.scrollHeight > on.clientHeight + 8;
    if (st.top > 2 && on.scrollTop === 0 && overflows) {
      on.scrollTop = st.top;
    }
  }, 400);

  try { console.log('[hl283] scroll online: every tab scrolls, your place is kept'); } catch (e) {}
})();

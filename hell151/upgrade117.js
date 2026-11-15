/* ILLUMINATI upgrade #117: hl117-heretic-all — every AI on the site answers
   from the heretic brain. the unfiltered brain wakes itself at boot and every
   feature (chat, agents, arena, debate, research, labs, workspaces) routes
   through it while it is on. the relay only answers again when the brain is
   tapped off. nothing else changes. */
(function () {
  if (window.__HL117) return; window.__HL117 = 1;
  var TAG = '[hl117]';
  function $(id) { return document.getElementById(id); }
  function state() {
    var el = $('p-her'); if (!el) return 'none';
    var t = el.textContent || '';
    if (t.indexOf('downloading') >= 0 || t.indexOf('loading ') >= 0 || t.indexOf('waking') >= 0) return 'busy';
    if (t.indexOf('UNFILTERED BRAIN: ON') === 0) return 'on';
    if (t.indexOf('UNFILTERED BRAIN: OFF') === 0) return 'off';
    return 'other';
  }
  function boot() {
    var sec = $('m-brain');
    if (!sec) { setTimeout(boot, 400); return; }
    var tries = 0;
    (function wait() {
      var b6 = $('b-her6');
      if (!b6 && tries < 240) { tries++; setTimeout(wait, 500); return; }
      if (!b6) { try { console.log(TAG, 'heretic module missing — site left as-is'); } catch (e) {} return; }
      var d = document.createElement('div'); d.className = 'pline';
      d.textContent = 'ALL AI: HERETIC — while the unfiltered brain is on, every ai feature on this site (chat, agents, arena, debate, research, labs, workspaces) answers from it. the relay model list still works, but only answers again when the active brain is tapped off.';
      sec.appendChild(d);
      function engage() {
        var s = state();
        if (s === 'off') { stat2('ALL AI: HERETIC — waking the unfiltered brain…'); setTimeout(function () { b6.click(); }, 600); }
        else if (s === 'busy' || s === 'other') setTimeout(engage, 1500);
      }
      function stat2(t) { var el = $('p-her'); if (el) { el.textContent = t; el.style.color = '#fbbf24'; } }
      engage();
    })();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
})();

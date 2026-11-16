/* ILLUMINATI upgrade #207: hl207-dock (v19.115)
   Makes the bottom command dock look 10x better: the composer bar becomes a
   frosted gold-glass panel with a glowing border and a soft drop shadow, the
   message box gets a real inset well with a gold caret and a focus halo, and
   every dock button becomes an even pill in the same glass language - with
   SEND promoted to a solid gold gradient gem. The quick-ask chips above get
   the same treatment so the whole dock reads as one instrument. The message
   box flexes to fill the free space; every control keeps its minimum width
   and nothing functional changes - every button, the mic, the model pill,
   purge and the chips all keep doing exactly what they did. The look is
   re-asserted every beat, so later upgrades that repaint the dock lose.
   Guard: __HL207 */
(function () {
  if (window.__HL207) return; window.__HL207 = true;

  var CSS = [
    '#foot #txt:focus{border-color:rgba(212,175,55,.6) !important;box-shadow:inset 0 2px 10px rgba(0,0,0,.55),0 0 20px rgba(212,175,55,.22) !important;outline:none !important;}',
    '#foot #txt::placeholder{color:rgba(236,223,176,.35) !important;}',
    '#chips::-webkit-scrollbar{display:none !important;}'
  ].join('\n');

  function inject() {
    var s = document.getElementById('hl207-css');
    if (!s) {
      s = document.createElement('style');
      s.id = 'hl207-css';
      s.textContent = CSS;
    }
    (document.head || document.documentElement).appendChild(s); /* re-append: wins the cascade */
  }

  function set(el, prop, val) {
    try {
      if (el.style.getPropertyValue(prop) !== val || el.style.getPropertyPriority(prop) !== 'important') {
        el.style.setProperty(prop, val, 'important');
      }
    } catch (e) {}
  }

  function paint() {
    inject();
    var foot = document.getElementById('foot');
    if (foot) {
      set(foot, 'background', 'linear-gradient(180deg,rgba(26,24,17,.92),rgba(10,10,9,.96))');
      set(foot, 'border', '1px solid rgba(201,162,39,.35)');
      set(foot, 'border-radius', '22px');
      set(foot, 'box-shadow', '0 12px 34px rgba(0,0,0,.6),0 0 26px rgba(201,162,39,.14),inset 0 1px 0 rgba(255,236,180,.10)');
      set(foot, 'backdrop-filter', 'blur(16px) saturate(140%)');
      set(foot, '-webkit-backdrop-filter', 'blur(16px) saturate(140%)');
      set(foot, 'padding', '10px 12px');
    }
    var txt = document.getElementById('txt');
    if (txt) {
      set(txt, 'flex', '1 1 auto');
      set(txt, 'width', 'auto');
      set(txt, 'min-width', '0');
      set(txt, 'height', '44px');
      set(txt, 'background', 'rgba(8,9,8,.74)');
      set(txt, 'border', '1px solid rgba(201,162,39,.26)');
      set(txt, 'border-radius', '14px');
      set(txt, 'color', '#ecdfb0');
      set(txt, 'caret-color', '#d4af37');
      set(txt, 'padding', '10px 13px');
      set(txt, 'font-size', '15px');
      set(txt, 'box-shadow', 'inset 0 2px 10px rgba(0,0,0,.55)');
      set(txt, 'resize', 'none');
    }
    var chips = document.getElementById('chips');
    if (chips) {
      set(chips, 'gap', '8px');
      set(chips, 'padding', '8px 10px');
      set(chips, 'overflow-x', 'auto');
      set(chips, 'scrollbar-width', 'none');
    }
    function pill(b) {
      set(b, 'height', '44px');
      set(b, 'min-width', '46px');
      set(b, 'padding', '0 13px');
      set(b, 'border-radius', '999px');
      set(b, 'background', 'linear-gradient(180deg,rgba(32,30,21,.92),rgba(14,14,12,.94))');
      set(b, 'border', '1px solid rgba(201,162,39,.30)');
      set(b, 'color', '#ecdfb0');
      set(b, 'font-weight', '600');
      set(b, 'letter-spacing', '.08em');
      set(b, 'box-shadow', 'inset 0 1px 0 rgba(255,236,180,.08),0 3px 12px rgba(0,0,0,.45)');
      set(b, 'transition', 'transform .15s,box-shadow .25s,border-color .25s');
      set(b, 'flex', '0 0 auto');
    }
    if (foot) {
      var bs = foot.querySelectorAll('button');
      for (var i = 0; i < bs.length; i++) {
        pill(bs[i]);
        if (bs[i].id === 'mic') set(bs[i], 'min-width', '58px');
        if (bs[i].id === 'ordclip') set(bs[i], 'min-width', '40px');
        if (bs[i].id === 'ordmodel') { set(bs[i], 'min-width', '46px'); set(bs[i], 'padding', '0 8px'); }
        if (bs[i].id === 'send') {
          set(bs[i], 'min-width', '62px');
          set(bs[i], 'background', 'linear-gradient(135deg,#ecd27a,#c9a232 55%,#8f6f1e)');
          set(bs[i], 'color', '#1a1405');
          set(bs[i], 'font-weight', '800');
          set(bs[i], 'letter-spacing', '.1em');
          set(bs[i], 'border', '1px solid rgba(255,232,158,.55)');
          set(bs[i], 'box-shadow', '0 4px 18px rgba(212,175,55,.38),inset 0 1px 0 rgba(255,246,205,.65)');
          set(bs[i], 'text-shadow', '0 1px 0 rgba(255,246,205,.35)');
        }
      }
    }
    if (chips) {
      var cs = chips.querySelectorAll('button');
      for (var j = 0; j < cs.length; j++) {
        var c = cs[j];
        set(c, 'flex', '0 0 auto');
        set(c, 'height', '34px');
        set(c, 'padding', '0 14px');
        set(c, 'border-radius', '999px');
        set(c, 'background', 'linear-gradient(180deg,rgba(28,26,18,.85),rgba(12,12,10,.9))');
        set(c, 'border', '1px solid rgba(201,162,39,.24)');
        set(c, 'color', '#dccd96');
        set(c, 'font-size', '12px');
        set(c, 'letter-spacing', '.04em');
        set(c, 'box-shadow', '0 2px 8px rgba(0,0,0,.4),inset 0 1px 0 rgba(255,236,180,.06)');
        set(c, 'white-space', 'nowrap');
        set(c, 'transition', 'transform .15s,border-color .25s');
      }
    }
  }

  if (document.head) paint();
  document.addEventListener('DOMContentLoaded', paint);
  setInterval(paint, 400);
})();

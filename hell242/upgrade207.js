/* ILLUMINATI upgrade #207: hl207-dock (v19.115)
   Makes the bottom command dock look 10x better: the composer bar becomes a
   frosted gold-glass panel with a glowing border and a soft drop shadow, the
   message box gets a real inset well with a gold caret and a focus halo, and
   every dock button becomes an even pill in the same glass language - with
   SEND promoted to a solid gold gradient gem. The quick-ask chips above get
   the same treatment so the whole dock reads as one instrument. Layout-aware:
   the message box now flexes to fill the free space, every control keeps its
   minimum width, and nothing functional changes - every button, the mic, the
   model pill, purge and the chips all keep doing exactly what they did.
   Guard: __HL207 */
(function () {
  if (window.__HL207) return; window.__HL207 = true;

  var css = [
    '/* hl207-dock */',
    '#foot.hl135-row{',
    ' background:linear-gradient(180deg,rgba(26,24,17,.92),rgba(10,10,9,.96)) !important;',
    ' border:1px solid rgba(201,162,39,.35) !important;',
    ' border-radius:22px !important;',
    ' box-shadow:0 12px 34px rgba(0,0,0,.6),0 0 26px rgba(201,162,39,.14),inset 0 1px 0 rgba(255,236,180,.10) !important;',
    ' backdrop-filter:blur(16px) saturate(140%) !important;',
    ' -webkit-backdrop-filter:blur(16px) saturate(140%) !important;',
    ' padding:10px 12px !important;',
    '}',
    '#foot #txt{',
    ' flex:1 1 auto !important; width:auto !important; min-width:0 !important;',
    ' height:44px !important;',
    ' background:rgba(8,9,8,.74) !important;',
    ' border:1px solid rgba(201,162,39,.26) !important;',
    ' border-radius:14px !important;',
    ' color:#ecdfb0 !important;',
    ' caret-color:#d4af37 !important;',
    ' padding:10px 13px !important;',
    ' font-size:15px !important;',
    ' box-shadow:inset 0 2px 10px rgba(0,0,0,.55) !important;',
    ' transition:border-color .25s,box-shadow .25s !important;',
    ' resize:none !important;',
    '}',
    '#foot #txt:focus{',
    ' border-color:rgba(212,175,55,.6) !important;',
    ' box-shadow:inset 0 2px 10px rgba(0,0,0,.55),0 0 20px rgba(212,175,55,.22) !important;',
    ' outline:none !important;',
    '}',
    '#foot #txt::placeholder{ color:rgba(236,223,176,.35) !important; }',
    '#foot button{',
    ' height:44px !important; min-width:46px !important; padding:0 13px !important;',
    ' border-radius:999px !important;',
    ' background:linear-gradient(180deg,rgba(32,30,21,.92),rgba(14,14,12,.94)) !important;',
    ' border:1px solid rgba(201,162,39,.30) !important;',
    ' color:#ecdfb0 !important;',
    ' font-weight:600 !important; letter-spacing:.08em !important;',
    ' box-shadow:inset 0 1px 0 rgba(255,236,180,.08),0 3px 12px rgba(0,0,0,.45) !important;',
    ' transition:transform .15s,box-shadow .25s,border-color .25s !important;',
    ' flex:0 0 auto !important;',
    '}',
    '#foot button:active{ transform:translateY(1px) scale(.97) !important; border-color:rgba(212,175,55,.55) !important; }',
    '#foot #mic{ min-width:58px !important; }',
    '#foot #ordclip{ min-width:40px !important; }',
    '#foot #ordmodel{ min-width:46px !important; padding:0 8px !important; }',
    '#foot #send{',
    ' min-width:62px !important;',
    ' background:linear-gradient(135deg,#ecd27a,#c9a232 55%,#8f6f1e) !important;',
    ' color:#1a1405 !important;',
    ' font-weight:800 !important; letter-spacing:.1em !important;',
    ' border:1px solid rgba(255,232,158,.55) !important;',
    ' box-shadow:0 4px 18px rgba(212,175,55,.38),inset 0 1px 0 rgba(255,246,205,.65) !important;',
    ' text-shadow:0 1px 0 rgba(255,246,205,.35) !important;',
    '}',
    '#foot #send:active{ box-shadow:0 2px 10px rgba(212,175,55,.55),inset 0 1px 0 rgba(255,246,205,.65) !important; }',
    '#chips{ gap:8px !important; padding:8px 10px !important; overflow-x:auto !important; scrollbar-width:none !important; }',
    '#chips::-webkit-scrollbar{ display:none !important; }',
    '#chips button{',
    ' flex:0 0 auto !important;',
    ' height:34px !important; padding:0 14px !important;',
    ' border-radius:999px !important;',
    ' background:linear-gradient(180deg,rgba(28,26,18,.85),rgba(12,12,10,.9)) !important;',
    ' border:1px solid rgba(201,162,39,.24) !important;',
    ' color:#dccd96 !important; font-size:12px !important; letter-spacing:.04em !important;',
    ' box-shadow:0 2px 8px rgba(0,0,0,.4),inset 0 1px 0 rgba(255,236,180,.06) !important;',
    ' white-space:nowrap !important;',
    ' transition:transform .15s,border-color .25s !important;',
    '}',
    '#chips button:active{ transform:scale(.96) !important; border-color:rgba(212,175,55,.5) !important; }'
  ].join('\n');

  function inject() {
    if (document.getElementById('hl207-css')) return;
    var s = document.createElement('style');
    s.id = 'hl207-css';
    s.textContent = css;
    (document.head || document.documentElement).appendChild(s);
  }

  if (document.head) inject();
  document.addEventListener('DOMContentLoaded', inject);
  setInterval(inject, 400);
})();

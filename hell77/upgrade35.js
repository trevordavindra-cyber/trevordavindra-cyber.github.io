// ILLUMINATI upgrade #35: hl35-oracle-overlay (v18.41)
// Easter egg: typing O-R-A-C-L-E opens a mystical oracle overlay with a cryptic line.
// Additive only; self-written this cycle (relay exhausted its output limit).
(function () {
  if (window.__hl35Oracle) return;
  window.__hl35Oracle = true;
  var WORD = 'oracle', buf = '', open = false, overlay = null;
  var LINES = [
    'The gate sees what you do not.',
    'Every system hides an eye.',
    'The pattern was there before you.',
    'Light bends toward the watchful.',
    'You are the signal, not the noise.'
  ];
  function build() {
    overlay = document.createElement('div');
    overlay.id = 'hl35-oracle';
    overlay.style.cssText = 'position:fixed;inset:0;z-index:2147483000;display:none;background:rgba(2,2,10,.92);align-items:center;justify-content:center;flex-direction:column;font-family:monospace;color:#e8c15a;text-align:center;cursor:pointer;';
    var eye = document.createElement('div');
    eye.textContent = '\u25c9';
    eye.style.cssText = 'font-size:96px;color:#e8c15a;text-shadow:0 0 40px #e8c15a,0 0 90px #b06cff;animation:hl35pulse 2.4s ease-in-out infinite;';
    var txt = document.createElement('div');
    txt.id = 'hl35-oracle-line';
    txt.style.cssText = 'margin-top:28px;font-size:18px;letter-spacing:3px;opacity:.9;padding:0 20px;';
    var hint = document.createElement('div');
    hint.textContent = 'tap or press esc to close';
    hint.style.cssText = 'margin-top:36px;font-size:11px;letter-spacing:2px;opacity:.45;';
    overlay.appendChild(eye); overlay.appendChild(txt); overlay.appendChild(hint);
    var st = document.createElement('style');
    st.textContent = '@keyframes hl35pulse{0%,100%{transform:scale(1);opacity:.85}50%{transform:scale(1.12);opacity:1}}';
    if (document.head) document.head.appendChild(st);
    document.body.appendChild(overlay);
    overlay.addEventListener('click', close);
    document.addEventListener('keydown', function (e) {
      if (open && e && (e.key === 'Escape' || e.key === 'Esc')) close();
    });
  }
  function show() {
    if (!overlay) build();
    var t = document.getElementById('hl35-oracle-line');
    if (t) t.textContent = LINES[Math.floor(Math.random() * LINES.length)];
    overlay.style.display = 'flex';
    open = true;
  }
  function close() {
    if (overlay) overlay.style.display = 'none';
    open = false;
  }
  function start() {
    document.addEventListener('keydown', function (e) {
      if (!e || !e.key) return;
      var k = (e.key || '').toLowerCase();
      if (k.length !== 1) return;
      if (k === WORD[buf.length]) {
        buf += k;
        if (buf === WORD) { buf = ''; show(); }
      } else {
        buf = (WORD[0] === k) ? k : '';
      }
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
})();

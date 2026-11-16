// ILLUMINATI upgrade #132 - hl132-live-seal (v19.39)
// The legacy corner chip still reads a stale old version number and overlaps the
// new gold footer bar. Replace it with a live seal: current build version, mirror
// path, and a breathing gold dot. Informational only; nothing functional removed.
(function () {
  if (window.__HL132) return; window.__HL132 = true;
  var style = document.createElement('style');
  style.id = 'hl132-style';
  style.textContent = [
    '#hl132-seal{position:fixed;left:10px;bottom:10px;z-index:2147483000;display:flex;align-items:center;gap:6px;font:10px/1 "Courier New",monospace;letter-spacing:.08em;color:#C5A45B;opacity:.75;pointer-events:none;text-transform:uppercase;}',
    '#hl132-seal .hl132-dot{width:5px;height:5px;border-radius:50%;background:#C5A45B;box-shadow:0 0 6px rgba(197,164,91,.8);animation:hl132-breathe 2.4s ease-in-out infinite;}',
    '@keyframes hl132-breathe{0%,100%{opacity:.35;transform:scale(.8)}50%{opacity:1;transform:scale(1.15)}}',
    '@media (prefers-reduced-motion: reduce){#hl132-seal .hl132-dot{animation:none}}',
    '@media (max-width:820px){#hl132-seal{display:none}}'
  ].join('\n');
  document.head.appendChild(style);

  function version() {
    var f = document.getElementById('pgp');
    var m = f ? (f.textContent || '').match(/v\d+\.\d+/) : null;
    return m ? m[0] : '';
  }
  function mirror() {
    var m = location.pathname.match(/hell\d+/);
    return m ? m[0] : '';
  }
  function build() {
    var old = null, cand = document.querySelectorAll('div');
    for (var i = 0; i < cand.length; i++) {
      var el = cand[i];
      if (el.closest && el.closest('#pgp')) continue;
      if (el.id === 'hl132-seal') continue;
      var t = (el.textContent || '').trim();
      if (/^ILLUMINATI v\d/i.test(t) && el.offsetWidth > 0 && el.offsetWidth < 200 && el.offsetHeight < 24) { old = el; }
    }
    var seal = document.createElement('div');
    seal.id = 'hl132-seal';
    seal.innerHTML = '<span class="hl132-dot"></span><span class="hl132-txt"></span>';
    var txt = function () {
      var v = version(), mm = mirror();
      seal.querySelector('.hl132-txt').textContent = [v ? 'SEALED ' + v : '', mm ? 'MIRROR ' + mm : ''].filter(Boolean).join(' \u00b7 ');
    };
    if (old && old.parentNode) { old.parentNode.replaceChild(seal, old); } else { document.body.appendChild(seal); }
    txt();
    setInterval(txt, 1000);
  }
  if (document.readyState === 'loading') { document.addEventListener('DOMContentLoaded', build); } else { build(); }
})();

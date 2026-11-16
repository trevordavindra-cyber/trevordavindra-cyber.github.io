/* hl143-textzoom — right-edge "Aa" chip cycles the record's text size, remembered */
(function () {
  if (window.__HL143) return; window.__HL143 = 1;
  var css = ".hl143-zbtn{position:fixed;right:14px;top:calc(50% + 96px);z-index:8600;width:36px;height:36px;border-radius:50%;background:rgba(10,10,10,.92);border:1px solid rgba(197,164,91,.55);color:#C5A45B;font:600 11px Inter,system-ui,sans-serif;display:flex;align-items:center;justify-content:center;cursor:pointer;box-shadow:0 4px 18px rgba(0,0,0,.55);transition:border-color .2s}.hl143-zbtn:hover{border-color:#C5A45B}.hl143-ztag{position:fixed;right:58px;top:calc(50% + 102px);z-index:8601;background:rgba(10,10,10,.95);border:1px solid rgba(197,164,91,.45);color:#C5A45B;font:600 9px Inter,system-ui,sans-serif;letter-spacing:.1em;border-radius:4px;padding:4px 8px;opacity:0;pointer-events:none;transition:opacity .25s}.hl143-ztag.on{opacity:1}";
  var st = document.createElement('style'); st.id = 'hl143-style'; st.textContent = css;
  (document.head || document.documentElement).appendChild(st);
  var LEVELS = [1, 1.15, 1.3, 0.85];
  var KEY = 'hl143-zoom';
  var btn, tag, i = 0, tmo = null;
  function feed() { return document.querySelector('#feedlist') || document.querySelector('#chat'); }
  function load() {
    try { var v = parseFloat(localStorage.getItem(KEY)); if (LEVELS.indexOf(v) > -1) i = LEVELS.indexOf(v); } catch (e) { }
  }
  function apply() {
    var f = feed(); if (!f) return false;
    try { f.style.zoom = String(LEVELS[i]); } catch (e) { }
    return true;
  }
  function flash() {
    if (!tag) return;
    tag.textContent = Math.round(LEVELS[i] * 100) + '%';
    tag.classList.add('on');
    clearTimeout(tmo); tmo = setTimeout(function () { tag.classList.remove('on'); }, 1100);
  }
  function cycle() {
    i = (i + 1) % LEVELS.length;
    if (!apply()) { flash(); return; }
    try { localStorage.setItem(KEY, String(LEVELS[i])); } catch (e) { }
    flash();
  }
  function build() {
    if (btn || !document.body) return;
    btn = document.createElement('button'); btn.className = 'hl143-zbtn'; btn.type = 'button'; btn.textContent = 'Aa';
    btn.setAttribute('aria-label', 'Cycle text size of the record');
    btn.addEventListener('click', cycle);
    tag = document.createElement('div'); tag.className = 'hl143-ztag';
    document.body.appendChild(btn); document.body.appendChild(tag);
    load(); apply();
  }
  var tries = 0; var iv = setInterval(function () { build(); if (btn) { clearInterval(iv); } else if (++tries > 90) clearInterval(iv); }, 800);
})();

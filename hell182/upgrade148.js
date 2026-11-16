/* hl148-focus — distraction-free reading: F hides the chrome, Esc or F returns it */
(function () {
  if (window.__HL148) return; window.__HL148 = 1;
  var css = "body.hl148f #hdr,body.hl148f #ordbar,body.hl148f #nav,body.hl148f .hl139-chip,body.hl148f .hl140-chip,body.hl148f .hl143-zbtn,body.hl148f .hl146-chip,body.hl148f #ordfx,body.hl148f .ordbg,body.hl148f .ordbgvig{display:none!important}body.hl148f #chat,body.hl148f #feedlist{transition:max-width .4s ease}.hl148-tag{position:fixed;top:10px;right:12px;z-index:8800;display:none;background:rgba(10,10,10,.9);border:1px solid rgba(197,164,91,.5);color:#C5A45B;font:600 9px Inter,system-ui,sans-serif;letter-spacing:.18em;border-radius:4px;padding:5px 9px;cursor:pointer;user-select:none}.hl148-hint{position:fixed;top:44px;left:50%;transform:translateX(-50%);z-index:8801;background:rgba(10,10,10,.95);border:1px solid rgba(197,164,91,.45);color:#EDE3CE;font:600 9px Inter,system-ui,sans-serif;letter-spacing:.16em;border-radius:5px;padding:7px 12px;opacity:0;transition:opacity .4s;pointer-events:none;white-space:nowrap;max-width:92vw;text-align:center}";
  var st = document.createElement('style'); st.id = 'hl148-style'; st.textContent = css;
  (document.head || document.documentElement).appendChild(st);
  var tag, hint, on = false, ht;
  function set(v) {
    on = v;
    document.body.classList.toggle('hl148f', on);
    if (tag) tag.style.display = on ? 'block' : 'none';
    try { localStorage.setItem('hl148-focus', on ? '1' : '0'); } catch (e) { }
    if (hint && on) {
      hint.textContent = 'FOCUS MODE \u00b7 PRESS F OR ESC TO RETURN';
      hint.style.opacity = '1'; clearTimeout(ht);
      ht = setTimeout(function () { hint.style.opacity = '0'; }, 2600);
    }
  }
  function build() {
    if (tag || !document.body) return false;
    tag = document.createElement('button'); tag.className = 'hl148-tag'; tag.type = 'button';
    tag.textContent = 'FOCUS'; tag.title = 'Exit focus mode (F or Esc)';
    tag.setAttribute('aria-label', 'Exit focus mode');
    tag.addEventListener('click', function () { set(false); });
    document.body.appendChild(tag);
    hint = document.createElement('div'); hint.className = 'hl148-hint'; hint.setAttribute('aria-live', 'polite'); document.body.appendChild(hint);
    try { if (localStorage.getItem('hl148-focus') === '1') set(true); } catch (e) { }
    return true;
  }
  function onKey(e) {
    var t = e.target;
    var typing = t && (((t.tagName || '').match(/^(INPUT|TEXTAREA|SELECT)$/) || t.isContentEditable));
    if (typing) return;
    if (e.key === 'f' && !e.metaKey && !e.ctrlKey && !e.altKey) { e.preventDefault(); set(!on); }
    else if (e.key === 'Escape' && on) { set(false); }
  }
  var tries = 0; var iv = setInterval(function () { if (build()) { clearInterval(iv); document.addEventListener('keydown', onKey, true); } else if (++tries > 90) clearInterval(iv); }, 800);
})();

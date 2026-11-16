/* hl141-quoteselect — select text in the record, tap QUOTE, it lands in the composer */
(function () {
  if (window.__HL141) return; window.__HL141 = 1;
  var css = ".hl141-qbtn{position:fixed;z-index:8700;display:none;background:rgba(10,10,10,.96);border:1px solid rgba(197,164,91,.55);color:#C5A45B;font:600 10px Inter,system-ui,sans-serif;letter-spacing:.12em;border-radius:20px;padding:7px 12px;cursor:pointer;box-shadow:0 4px 18px rgba(0,0,0,.55)}.hl141-qbtn:hover{border-color:#C5A45B}";
  var st = document.createElement('style'); st.id = 'hl141-style'; st.textContent = css;
  (document.head || document.documentElement).appendChild(st);
  var btn, text = '';
  function feed() { return document.querySelector('#feedlist') || document.querySelector('#chat'); }
  function inFeed(node) {
    var f = feed(); if (!f || !node) return false;
    var el = node.nodeType === 3 ? node.parentElement : node;
    return !!(el && f.contains(el) && el !== f);
  }
  function current() {
    var s = window.getSelection && window.getSelection();
    if (!s || s.isCollapsed || s.rangeCount === 0) return null;
    var r = s.getRangeAt(0);
    if (!inFeed(r.startContainer) || !inFeed(r.endContainer)) return null;
    var t = (s.toString() || '').trim();
    if (!t || t.length > 800) return null;
    return r;
  }
  function place() {
    var r = current();
    if (!r) { hide(); return; }
    text = (window.getSelection().toString() || '').trim();
    var rect = r.getBoundingClientRect();
    if (!rect || (!rect.width && !rect.height)) { hide(); return; }
    btn.textContent = '\u2310 QUOTE';
    btn.style.display = 'block';
    var x = Math.min(Math.max(rect.left + rect.width / 2, 60), (window.innerWidth || 400) - 60);
    var y = rect.top - 34;
    if (y < 8) y = rect.bottom + 8;
    btn.style.left = x + 'px';
    btn.style.top = y + 'px';
    btn.style.transform = 'translateX(-50%)';
  }
  function hide() { if (btn) btn.style.display = 'none'; text = ''; }
  function quote() {
    if (!text) { hide(); return; }
    var q = '> ' + text.split(/\n+/).join('\n> ') + '\n\n';
    var t = document.querySelector('#txt');
    if (t && 'value' in t) {
      var a = t.selectionStart != null ? t.selectionStart : t.value.length;
      t.value = t.value.slice(0, a) + q + t.value.slice(a);
      try { t.selectionStart = t.selectionEnd = a + q.length; } catch (e) { }
      t.dispatchEvent(new Event('input', { bubbles: true }));
      try { t.focus(); } catch (e) { }
    }
    hide();
  }
  var pending = null;
  function schedule() { if (pending) return; pending = setTimeout(function () { pending = null; place(); }, 180); }
  function build() {
    if (btn || !document.body) return;
    btn = document.createElement('button'); btn.className = 'hl141-qbtn'; btn.type = 'button';
    btn.setAttribute('aria-label', 'Quote selection into the composer');
    btn.addEventListener('click', quote);
    document.body.appendChild(btn);
    document.addEventListener('selectionchange', schedule);
    document.addEventListener('scroll', hide, true);
    window.addEventListener('resize', hide);
  }
  var tries = 0; var iv = setInterval(function () { build(); if (btn) clearInterval(iv); else if (++tries > 90) clearInterval(iv); }, 800);
})();

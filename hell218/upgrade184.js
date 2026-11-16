/* hl184-cipher — THE CIPHER: section headings resolve out of scrambled glyphs the first time they enter view; the exact original text always returns */
(function () {
  if (window.__HL184) return; window.__HL184 = 1;
  var GLYPHS = '░▒▓◆◇◆✦✧⟁⌬⟠⧫ABCDEF0123456789';
  var SEL = 'h1,h2,h3,h4,.title';
  function isEditable(el) {
    for (var n = el; n; n = n.parentElement) {
      if (n.tagName === 'TEXTAREA' || n.tagName === 'INPUT' || (n.isContentEditable)) return true;
    }
    return false;
  }
  function collect() {
    var out = [], els = document.querySelectorAll(SEL);
    for (var i = 0; i < els.length; i++) {
      var el = els[i];
      if (el.dataset.hl184seen) continue;
      var t = (el.textContent || '').trim();
      if (!t || t.length > 90 || isEditable(el)) { el.dataset.hl184seen = '1'; continue; }
      el.dataset.hl184seen = '1';
      el.dataset.hl184orig = el.textContent;
      out.push(el);
    }
    return out;
  }
  function scramble(el, done) {
    var orig = el.dataset.hl184orig;
    if (!orig) return;
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) { el.textContent = orig; return; }
    var chars = orig.split('');
    var frame = 0, total = 26;
    var tmr = setInterval(function () {
      frame++;
      var reveal = Math.floor((frame / total) * chars.length);
      var s = '';
      for (var i = 0; i < chars.length; i++) {
        var c = chars[i];
        if (c === ' ' || c === '\n') { s += c; continue; }
        if (i < reveal) s += c;
        else s += GLYPHS.charAt(Math.floor(Math.random() * GLYPHS.length));
      }
      el.textContent = s;
      if (frame >= total) { clearInterval(tmr); el.textContent = orig; if (done) done(); }
    }, 27);
  }
  function boot() {
    var els = collect();
    if (!els.length) return false;
    var io = new IntersectionObserver(function (entries) {
      for (var j = 0; j < entries.length; j++) {
        if (entries[j].isIntersecting) {
          io.unobserve(entries[j].target);
          scramble(entries[j].target);
        }
      }
    }, { threshold: 0.4 });
    for (var k = 0; k < els.length; k++) io.observe(els[k]);
    return true;
  }
  window.__HL184_IV = setInterval(function () { if (document.body && boot()) { clearInterval(window.__HL184_IV); } }, 1800);
  setTimeout(function () { if (window.__HL184_IV) clearInterval(window.__HL184_IV); }, 120000);
})();

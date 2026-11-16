/* hl192-cartographer — THE CARTOGRAPHER: a slim gold minimap rail hugging the left edge that maps the whole record — one luminous segment per reply, their heights true to the record — with a viewport band that tracks the visible window; tap or drag anywhere on the rail to glide the record there. Hidden while the record fits the screen; purely additive */
(function () {
  if (window.__HL192) return; window.__HL192 = 1;
  var css = [
    '#hl192-rail{position:fixed;left:0;top:18vh;height:64vh;width:7px;z-index:2147482700;opacity:0;pointer-events:none;transition:opacity .3s ease;touch-action:none;}',
    '#hl192-rail.on{opacity:1;pointer-events:auto;cursor:pointer;}',
    '#hl192-railin{position:relative;width:100%;height:100%;background:rgba(18,14,7,.6);border-radius:4px;border:1px solid rgba(201,162,39,.2);overflow:hidden;}',
    '.hl192-seg{position:absolute;left:0;width:100%;background:linear-gradient(90deg,rgba(201,162,39,.8),rgba(201,162,39,.3));border-radius:2px;}',
    '#hl192-view{position:absolute;left:0;width:100%;background:rgba(240,214,122,.26);border:1px solid rgba(240,214,122,.55);border-radius:2px;box-shadow:0 0 8px rgba(201,162,39,.35);}'
  ].join('\n');
  var rail = null, inner = null, view = null, dirty = true, dragging = false, lastH = 0, lastCount = -1;
  function findScroller() {
    var n = document.getElementById('chat');
    while (n && n !== document.documentElement) {
      if (n.scrollHeight > n.clientHeight + 4) {
        var cs = getComputedStyle(n);
        if (cs.overflowY === 'auto' || cs.overflowY === 'scroll' || n === document.documentElement || n === document.body) return n;
      }
      n = n.parentElement;
    }
    var de = document.documentElement;
    return de.scrollHeight > de.clientHeight + 4 ? de : null;
  }
  function build() {
    if (rail) return true;
    if (!document.getElementById('chat')) return false;
    var s = document.createElement('style');
    s.id = 'hl192-style';
    s.textContent = css;
    (document.head || document.documentElement).appendChild(s);
    rail = document.createElement('div');
    rail.id = 'hl192-rail';
    rail.title = 'The cartographer: map of the record';
    inner = document.createElement('div');
    inner.id = 'hl192-railin';
    view = document.createElement('div');
    view.id = 'hl192-view';
    inner.appendChild(view);
    rail.appendChild(inner);
    document.body.appendChild(rail);
    rail.addEventListener('pointerdown', function (e) { dragging = true; jump(e); });
    document.addEventListener('pointermove', function (e) { if (dragging) jump(e); });
    document.addEventListener('pointerup', function () { dragging = false; });
    document.addEventListener('pointercancel', function () { dragging = false; });
    document.addEventListener('scroll', function () { update(); }, true);
    return true;
  }
  function jump(e) {
    var sc = findScroller();
    if (!sc) return;
    var r = rail.getBoundingClientRect();
    var ratio = Math.min(1, Math.max(0, (e.clientY - r.top) / r.height));
    try { sc.scrollTo({ top: ratio * (sc.scrollHeight - sc.clientHeight), behavior: 'smooth' }); } catch (err) { sc.scrollTop = ratio * (sc.scrollHeight - sc.clientHeight); }
  }
  function rebuild() {
    var sc = findScroller();
    if (!sc || !rail) return;
    var chat = document.getElementById('chat');
    var kids = chat ? chat.children : [];
    if (!kids.length || sc.scrollHeight <= sc.clientHeight + 8) { rail.classList.remove('on'); return; }
    var contentH = sc.scrollHeight;
    Array.prototype.forEach.call(inner.querySelectorAll('.hl192-seg'), function (n) { n.remove(); });
    Array.prototype.forEach.call(kids, function (el) {
      var top = el.getBoundingClientRect().top - sc.getBoundingClientRect().top + sc.scrollTop;
      var h = el.offsetHeight || 8;
      if (top >= contentH) return;
      var seg = document.createElement('div');
      seg.className = 'hl192-seg';
      seg.style.top = (top / contentH * 100) + '%';
      seg.style.height = Math.max(1.5, h / contentH * 100) + '%';
      inner.appendChild(seg);
    });
    rail.classList.add('on');
  }
  function update() {
    var sc = findScroller();
    if (!sc || !rail || !rail.classList.contains('on')) return;
    var contentH = sc.scrollHeight, H = inner.clientHeight || 1;
    var top = sc.scrollTop / contentH * H;
    var h = Math.max(10, sc.clientHeight / contentH * H);
    view.style.top = top + 'px';
    view.style.height = h + 'px';
  }
  function tick() {
    var sc = findScroller();
    if (!sc) return;
    var chat = document.getElementById('chat');
    var count = chat ? chat.children.length : 0;
    if (dirty || count !== lastCount || Math.abs(sc.scrollHeight - lastH) > 40) {
      dirty = false; lastCount = count; lastH = sc.scrollHeight;
      rebuild(); update();
    } else update();
  }
  function boot() {
    if (!document.body || !build()) return false;
    var mo = new MutationObserver(function () { dirty = true; });
    mo.observe(document.getElementById('chat'), { childList: true, subtree: true, characterData: true });
    setInterval(tick, 2000);
    tick();
    return true;
  }
  window.__HL192_IV = setInterval(function () { if (boot()) clearInterval(window.__HL192_IV); }, 1800);
  setTimeout(function () { if (window.__HL192_IV) clearInterval(window.__HL192_IV); }, 120000);
})();

/* hl153-orbit — slow-rotating gold orrery watermark: celestial sigil behind the interface */
(function () {
  if (window.__HL153) return; window.__HL153 = 1;
  var css = ".hl153-orbit{position:fixed;left:50%;top:50%;width:min(92vw,86vh);height:min(92vw,86vh);margin-left:calc(min(92vw,86vh)/-2);margin-top:calc(min(92vw,86vh)/-2);z-index:8180;pointer-events:none;opacity:.085;animation:hl153spin 150s linear infinite;mix-blend-mode:screen}@keyframes hl153spin{from{transform:rotate(0)}to{transform:rotate(360deg)}}.hl153-ring{fill:none;stroke:#C5A45B;stroke-width:.7}.hl153-ring2{fill:none;stroke:#C5A45B;stroke-width:.35;stroke-dasharray:2 3;opacity:.75}.hl153-node{fill:#C5A45B}.hl153-node2{fill:none;stroke:#C5A45B;stroke-width:.8}.hl153-arm{stroke:#C5A45B;stroke-width:.3;opacity:.55}.hl153-core{fill:#C5A45B;opacity:.9}@media (prefers-reduced-motion:reduce){.hl153-orbit{animation:none}}";
  var st = document.createElement('style'); st.id = 'hl153-style'; st.textContent = css;
  (document.head || document.documentElement).appendChild(st);
  function build() {
    if (document.getElementById('hl153-orbit') || !document.body) return false;
    var NS = 'http://www.w3.org/2000/svg';
    var svg = document.createElementNS(NS, 'svg');
    svg.id = 'hl153-orbit'; svg.setAttribute('class', 'hl153-orbit');
    svg.setAttribute('viewBox', '0 0 200 200'); svg.setAttribute('aria-hidden', 'true');
    function el(tag, attrs, parent) {
      var e = document.createElementNS(NS, tag);
      for (var k in attrs) e.setAttribute(k, attrs[k]);
      parent.appendChild(e); return e;
    }
    el('circle', { cx: 100, cy: 100, r: 92, 'class': 'hl153-ring' }, svg);
    el('circle', { cx: 100, cy: 100, r: 70, 'class': 'hl153-ring2' }, svg);
    el('circle', { cx: 100, cy: 100, r: 46, 'class': 'hl153-ring' }, svg);
    el('circle', { cx: 100, cy: 100, r: 24, 'class': 'hl153-ring2' }, svg);
    var g = el('g', {}, svg);
    for (var a = 0; a < 360; a += 30) {
      var r1 = a * Math.PI / 180;
      el('line', { x1: 100 + 24 * Math.cos(r1), y1: 100 + 24 * Math.sin(r1), x2: 100 + 92 * Math.cos(r1), y2: 100 + 92 * Math.sin(r1), 'class': 'hl153-arm' }, g);
    }
    el('circle', { cx: 100, cy: 100, r: 4, 'class': 'hl153-core' }, svg);
    el('circle', { cx: 100, cy: 8, r: 3.2, 'class': 'hl153-node' }, svg);
    el('circle', { cx: 170, cy: 100, r: 2.4, 'class': 'hl153-node2' }, svg);
    el('circle', { cx: 100, cy: 146, r: 2, 'class': 'hl153-node' }, svg);
    el('circle', { cx: 54, cy: 100, r: 1.8, 'class': 'hl153-node' }, svg);
    document.body.appendChild(svg);
    return true;
  }
  var tries = 0; var iv = setInterval(function () { if (build()) clearInterval(iv); else if (++tries > 90) clearInterval(iv); }, 800);
})();

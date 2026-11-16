/* hl156-frame — THE THRESHOLD: an institutional double-line gold frame with corner seals around the interface */
(function () {
  if (window.__HL156) return; window.__HL156 = 1;
  var css = ".hl156-frame{position:fixed;inset:12px;border:1px solid rgba(197,164,91,.30);pointer-events:none;z-index:8200;animation:hl156breath 5s ease-in-out infinite alternate}.hl156-frame::before{content:'';position:absolute;inset:5px;border:1px solid rgba(197,164,91,.16)}.hl156-c{position:absolute;width:26px;height:26px;pointer-events:none}.hl156-c::before{content:'';position:absolute;top:0;left:0;width:26px;height:26px;border-top:2px solid rgba(197,164,91,.75);border-left:2px solid rgba(197,164,91,.75)}.hl156-tr::before{top:auto;left:auto;border-top:2px solid rgba(197,164,91,.75);border-right:2px solid rgba(197,164,91,.75);border-left:none;border-bottom:none}.hl156-bl::before{border-bottom:2px solid rgba(197,164,91,.75);border-right:none;border-top:none}.hl156-br::before{border-bottom:2px solid rgba(197,164,91,.75);border-right:2px solid rgba(197,164,91,.75);border-left:none;border-top:none}.hl156-c::after{content:'\\2726';position:absolute;top:-7px;left:-7px;width:14px;height:14px;font:600 10px Georgia,serif;color:rgba(197,164,91,.85);display:flex;align-items:center;justify-content:center;background:#0a0a0a;border-radius:50%}.hl156-key{position:absolute;top:-9px;left:50%;transform:translateX(-50%) rotate(45deg);width:18px;height:18px;background:#0a0a0a;border:1px solid rgba(197,164,91,.55);box-shadow:0 0 10px rgba(197,164,91,.25)}.hl156-key::after{content:'';position:absolute;inset:4px;background:rgba(197,164,91,.8);border-radius:1px}@keyframes hl156breath{from{border-color:rgba(197,164,91,.24)}to{border-color:rgba(197,164,91,.40)}}@media (prefers-reduced-motion: reduce){.hl156-frame{animation:none}}@media (max-width:640px){.hl156-frame{inset:7px}.hl156-frame::before{inset:4px}.hl156-c{width:20px;height:20px}.hl156-c::before{width:20px;height:20px}}";
  var st = document.createElement('style'); st.id = 'hl156-style'; st.textContent = css;
  (document.head || document.documentElement).appendChild(st);
  function build() {
    if (document.getElementById('hl156-frame') || !document.body) return false;
    var f = document.createElement('div'); f.id = 'hl156-frame'; f.className = 'hl156-frame'; f.setAttribute('aria-hidden', 'true');
    var tl = document.createElement('div'); tl.className = 'hl156-c hl156-tl';
    var tr = document.createElement('div'); tr.className = 'hl156-c hl156-tr'; tr.style.top = '-1px'; tr.style.right = '-1px';
    var bl = document.createElement('div'); bl.className = 'hl156-c hl156-bl'; bl.style.bottom = '-1px'; bl.style.left = '-1px';
    var br = document.createElement('div'); br.className = 'hl156-c hl156-br'; br.style.bottom = '-1px'; br.style.right = '-1px';
    var key = document.createElement('div'); key.className = 'hl156-key';
    f.appendChild(tl); f.appendChild(tr); f.appendChild(bl); f.appendChild(br); f.appendChild(key);
    document.body.appendChild(f);
    return true;
  }
  var tries = 0; var iv = setInterval(function () { if (build()) clearInterval(iv); else if (++tries > 90) clearInterval(iv); }, 800);
})();

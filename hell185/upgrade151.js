/* hl151-lantern — amber night-reading veil, three levels, persisted */
(function () {
  if (window.__HL151) return; window.__HL151 = 1;
  var css = ".hl151-chip{position:fixed;z-index:8560;width:34px;height:34px;border-radius:50%;background:rgba(13,13,13,.92);border:1px solid rgba(197,164,91,.45);color:#C5A45B;display:flex;align-items:center;justify-content:center;cursor:pointer;opacity:.72;transition:opacity .2s,border-color .2s;box-sizing:border-box;padding:0}.hl151-chip:hover{opacity:1;border-color:rgba(197,164,91,.8)}.hl151-chip svg{width:15px;height:15px;fill:none;stroke:#C5A45B;stroke-width:1.6;pointer-events:none}.hl151-chip.on{border-color:#C5A45B;opacity:1}.hl151-dot{position:absolute;top:-2px;right:-2px;width:9px;height:9px;border-radius:50%;background:#C5A45B;box-shadow:0 0 8px rgba(197,164,91,.8);display:none}.hl151-veil{position:fixed;inset:0;z-index:8300;pointer-events:none;background:radial-gradient(ellipse at 50% 45%, rgba(255,166,61,.28), rgba(120,52,6,.5) 85%);opacity:0;transition:opacity .5s ease;mix-blend-mode:multiply}.hl151-toast{position:fixed;left:50%;transform:translateX(-50%);bottom:96px;z-index:9520;background:rgba(11,11,11,.94);border:1px solid rgba(197,164,91,.5);color:#C5A45B;font:600 9px Inter,system-ui,sans-serif;letter-spacing:.24em;padding:7px 14px;border-radius:20px;opacity:0;transition:opacity .3s;pointer-events:none}";
  var st = document.createElement('style'); st.id = 'hl151-style'; st.textContent = css;
  (document.head || document.documentElement).appendChild(st);
  var chip, dot, veil, toast, level = 0, tmr;
  var LEVELS = [0, 0.45, 0.75];
  var NAMES = ['LANTERN OFF', 'LANTERN \u00b7 LOW', 'LANTERN \u00b7 HIGH'];
  try { level = parseInt(localStorage.getItem('hl151-lantern') || '0', 10) || 0; } catch (e) { level = 0; }
  function apply(quiet) {
    if (veil) veil.style.opacity = String(LEVELS[level] || 0);
    if (chip) chip.classList.toggle('on', level > 0);
    if (dot) dot.style.display = level > 0 ? 'block' : 'none';
    try { localStorage.setItem('hl151-lantern', String(level)); } catch (e) {}
    if (!quiet && toast) {
      toast.textContent = NAMES[level];
      toast.style.opacity = '1';
      clearTimeout(tmr); tmr = setTimeout(function () { toast.style.opacity = '0'; }, 1800);
    }
  }
  function positionChip() {
    if (!chip) return;
    var max = 0, found = false;
    ['.hl139-chip', '.hl140-chip', '.hl143-zbtn', '.hl146-chip', '.hl149-chip', '.hl150-chip'].forEach(function (sel) {
      document.querySelectorAll(sel).forEach(function (el) {
        var r = el.getBoundingClientRect();
        if (r.bottom > max) { max = r.bottom; found = true; }
      });
    });
    var top = found ? Math.min(max + 14, window.innerHeight - 60) : (window.innerHeight * 0.5 + 236);
    chip.style.top = Math.max(40, top) + 'px';
    chip.style.right = (window.innerWidth <= 640 ? '7px' : '10px');
  }
  function build() {
    if (chip || !document.body) return false;
    var chat = document.getElementById('chat'); if (!chat) return false;
    veil = document.createElement('div'); veil.className = 'hl151-veil'; document.body.appendChild(veil);
    chip = document.createElement('button'); chip.className = 'hl151-chip'; chip.type = 'button';
    chip.setAttribute('aria-label', 'Night lantern'); chip.title = 'Night lantern';
    chip.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3a6 6 0 0 0 0 12c0 1.6 1 2.6 2 3H10c1-.4 2-1.4 2-3"/><path d="M12 21v-2"/></svg><span class="hl151-dot"></span>';
    dot = chip.querySelector('.hl151-dot');
    chip.addEventListener('click', function () { level = (level + 1) % 3; apply(false); });
    document.body.appendChild(chip); positionChip();
    setTimeout(positionChip, 3500); addEventListener('resize', positionChip);
    toast = document.createElement('div'); toast.className = 'hl151-toast'; document.body.appendChild(toast);
    apply(true);
    return true;
  }
  var tries = 0; var iv = setInterval(function () { if (build()) clearInterval(iv); else if (++tries > 90) clearInterval(iv); }, 800);
})();

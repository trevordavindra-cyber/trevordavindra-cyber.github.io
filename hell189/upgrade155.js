/* hl155-index — THE INDEX: an eighth chip opening a drawer of every question you've asked, tap to jump */
(function () {
  if (window.__HL155) return; window.__HL155 = 1;
  var css = ".hl155-chip{position:fixed;right:14px;width:38px;height:38px;border-radius:50%;background:rgba(11,11,11,.9);border:1px solid rgba(197,164,91,.55);color:#C5A45B;display:flex;align-items:center;justify-content:center;cursor:pointer;z-index:8440;box-shadow:0 0 12px rgba(197,164,91,.18);transition:transform .2s,box-shadow .2s;font:600 15px serif}.hl155-chip:hover{transform:scale(1.08);box-shadow:0 0 18px rgba(197,164,91,.35)}.hl155-chip .hl155-badge{position:absolute;top:-5px;right:-5px;background:#C5A45B;color:#0d0d0d;font:700 8px 'JetBrains Mono',monospace;border-radius:8px;padding:1px 4px;min-width:12px;text-align:center}.hl155-scrim{position:fixed;inset:0;background:rgba(4,4,4,.6);backdrop-filter:blur(3px);z-index:8480;opacity:0;pointer-events:none;transition:opacity .3s}.hl155-scrim.on{opacity:1;pointer-events:auto}.hl155-drawer{position:fixed;top:0;right:0;height:100%;width:min(360px,92vw);background:linear-gradient(180deg,#0c0c0c,#090909);border-left:1px solid rgba(197,164,91,.4);z-index:8490;transform:translateX(105%);transition:transform .35s cubic-bezier(.22,1,.36,1);display:flex;flex-direction:column}.hl155-drawer.on{transform:translateX(0)}.hl155-head{padding:18px 18px 12px;border-bottom:1px solid rgba(197,164,91,.25)}.hl155-title{font:700 15px 'Cinzel',Georgia,serif;letter-spacing:.22em;color:#C5A45B}.hl155-sub{font:600 8px 'JetBrains Mono',monospace;letter-spacing:.18em;color:rgba(197,164,91,.55);margin-top:6px}.hl155-list{flex:1;overflow-y:auto;padding:8px 0 24px}.hl155-row{display:flex;gap:10px;padding:11px 18px;cursor:pointer;border-left:2px solid transparent;transition:background .2s,border-color .2s}.hl155-row:hover{background:rgba(197,164,91,.07);border-left-color:#C5A45B}.hl155-num{font:700 10px 'JetBrains Mono',monospace;color:rgba(197,164,91,.6);min-width:26px;padding-top:2px}.hl155-txt{font:400 12.5px Georgia,serif;color:rgba(230,220,195,.9);line-height:1.45}.hl155-empty{padding:40px 24px;text-align:center;font:600 9px 'JetBrains Mono',monospace;letter-spacing:.2em;color:rgba(197,164,91,.45)}.hl155-flash{animation:hl155flash2 1.3s ease}@keyframes hl155flash2{0%,60%{outline:3px solid rgba(197,164,91,.75);outline-offset:2px}100%{outline:3px solid rgba(197,164,91,0);outline-offset:2px}}";
  var st = document.createElement('style'); st.id = 'hl155-style'; st.textContent = css;
  (document.head || document.documentElement).appendChild(st);
  var chip, scrim, drawer, badge, listEl, open = false;
  function scanMaxBottom() {
    var maxBottom = 0;
    var all = document.querySelectorAll('body > div, body > span');
    for (var i = 0; i < all.length; i++) {
      var el = all[i];
      if (el === chip || el === scrim || el === drawer) continue;
      var cs = getComputedStyle(el);
      if (cs.position !== 'fixed') continue;
      if (cs.display === 'none' || cs.visibility === 'hidden') continue;
      var r = el.getBoundingClientRect();
      if (r.width === 0 && r.height === 0) continue;
      var rightDist = innerWidth - r.right;
      if (rightDist >= 0 && rightDist < 70 && r.bottom < innerHeight * 0.9) {
        if (r.bottom > maxBottom) maxBottom = r.bottom;
      }
    }
    return maxBottom;
  }
  function place() {
    if (!chip) return;
    var mb = scanMaxBottom();
    if (mb <= 0) { chip.style.top = '50%'; return; }
    chip.style.top = Math.round(mb + 18) + 'px';
  }
  function recheck() {
    if (!chip) return;
    var myTop = chip.getBoundingClientRect().top;
    var mb = scanMaxBottom();
    if (mb > myTop) place();
  }
  function build() {
    if (chip || !document.body) return false;
    var chat = document.getElementById('chat'); if (!chat) return false;
    chip = document.createElement('div'); chip.className = 'hl155-chip'; chip.setAttribute('role', 'button');
    chip.setAttribute('aria-label', 'Open the index'); chip.textContent = '\u2625';
    badge = document.createElement('span'); badge.className = 'hl155-badge'; badge.style.display = 'none';
    chip.appendChild(badge);
    chip.addEventListener('click', function () { open ? closeD() : openD(); });
    document.body.appendChild(chip);
    scrim = document.createElement('div'); scrim.className = 'hl155-scrim';
    scrim.addEventListener('click', closeD);
    document.body.appendChild(scrim);
    drawer = document.createElement('div'); drawer.className = 'hl155-drawer'; drawer.setAttribute('role', 'dialog');
    var head = document.createElement('div'); head.className = 'hl155-head';
    head.innerHTML = '<div class="hl155-title">THE INDEX</div><div class="hl155-sub">YOUR QUESTIONS, AS LAID IN THE RECORD</div>';
    drawer.appendChild(head);
    listEl = document.createElement('div'); listEl.className = 'hl155-list';
    drawer.appendChild(listEl);
    document.body.appendChild(drawer);
    addEventListener('keydown', function (e) { if (e.key === 'Escape' && open) closeD(); });
    addEventListener('resize', function () { place(); });
    setTimeout(place, 5000);
    setTimeout(recheck, 13000);
    return true;
  }
  function userLines() {
    var chat = document.getElementById('chat'); if (!chat) return [];
    var out = [], lines = chat.querySelectorAll('.line');
    for (var i = 0; i < lines.length; i++) {
      var el = lines[i];
      if (el.classList.contains('imp')) continue;
      var t = (el.textContent || '').trim();
      if (t.length < 3) continue;
      out.push(el);
    }
    return out;
  }
  function openD() {
    open = true;
    scrim.classList.add('on'); drawer.classList.add('on');
    var lines = userLines();
    badge.style.display = lines.length ? 'block' : 'none';
    badge.textContent = lines.length;
    listEl.innerHTML = '';
    if (!lines.length) {
      var e = document.createElement('div'); e.className = 'hl155-empty';
      e.textContent = 'THE RECORD LIES EMPTY'; listEl.appendChild(e);
      return;
    }
    var cap = Math.min(lines.length, 200);
    for (var i = 0; i < cap; i++) {
      var el = lines[i];
      var t = (el.textContent || '').trim();
      if (t.length > 80) t = t.slice(0, 80) + '\u2026';
      var row = document.createElement('div'); row.className = 'hl155-row';
      var num = document.createElement('span'); num.className = 'hl155-num'; num.textContent = '#' + (i + 1);
      var txt = document.createElement('span'); txt.className = 'hl155-txt'; txt.textContent = t;
      row.appendChild(num); row.appendChild(txt);
      (function (target) {
        row.addEventListener('click', function () {
          closeD();
          setTimeout(function () {
            try { target.scrollIntoView({ behavior: 'smooth', block: 'center' }); } catch (err) { target.scrollIntoView(); }
            target.classList.remove('hl155-flash');
            void target.offsetWidth;
            target.classList.add('hl155-flash');
          }, 380);
        });
      })(el);
      listEl.appendChild(row);
    }
  }
  function closeD() {
    open = false;
    scrim.classList.remove('on'); drawer.classList.remove('on');
  }
  var tries = 0; var iv = setInterval(function () { if (build()) clearInterval(iv); else if (++tries > 90) clearInterval(iv); }, 800);
})();

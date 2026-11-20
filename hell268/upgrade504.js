/* ILLUMINATI upgrade 504 - PLOT ENGINE (hl504)
   Major capability: the AI can draw real graphs. Type "plot sin(x)+x/3" or
   "graph x^2-4" in the chat and a live canvas chart opens right under the
   message: axes, grid, labeled ticks and a smooth curve sampled at 400
   points across -10 to 10. It reads sin, cos, tan, asin, acos, atan, sqrt,
   abs, log, ln, exp, pow, min, max, floor, ceil, round, sign, plus
   + - * / ^ ( ) , pi and e. Words that are not part of the formula are
   ignored, so "plot sin(x) over time" still works. Nothing removed.
*/
(function () {
  if (window.__HL504) return; window.__HL504 = true;

  var NAME = { sin:'Math.sin', cos:'Math.cos', tan:'Math.tan', asin:'Math.asin',
    acos:'Math.acos', atan:'Math.atan', sqrt:'Math.sqrt', abs:'Math.abs',
    log:'Math.log10', ln:'Math.log', exp:'Math.exp', pow:'Math.pow',
    min:'Math.min', max:'Math.max', floor:'Math.floor', ceil:'Math.ceil',
    round:'Math.round', sign:'Math.sign' };

  function compile(raw) {
    try {
      var s = String(raw).toLowerCase().trim();
      s = s.replace(/^[^a-z0-9]+/, '').replace(/y\s*=\s*/, '');
      s = s.replace(/\bpi\b/g, '(3.141592653589793)').replace(/\be\b/g, '(2.718281828459045)');
      if (!/^[0-9x+\-*/().,\s a-z^]*$/.test(s)) return null;
      var words = s.match(/[a-z]+/g) || [];
      for (var i = 0; i < words.length; i++) if (words[i] !== 'x' && !NAME[words[i]]) return null;
      s = s.replace(/\^/g, '**');
      s = s.replace(/\b(sin|cos|tan|asin|acos|atan|sqrt|abs|log|ln|exp|pow|min|max|floor|ceil|round|sign)\b/g,
        function (m) { return NAME[m]; });
      var f = new Function('x', 'return (' + s + ');');
      var t = f(1);
      if (typeof t !== 'number') return null;
      return f;
    } catch (e) { return null; }
  }

  /* take the words after "plot"/"graph", then try prefixes so trailing
     sentence words ("plot sin(x) please") do not kill the formula */
  function extract(txt) {
    try {
      var m = /(?:^|\s)(?:plot|graph)\b/i.exec(txt);
      if (!m) return null;
      var km = /(?:plot|graph)/i.exec(m[0]);
      var tail = txt.slice(m.index + km.index + km[0].length).trim();
      tail = tail.replace(/^[=:,\-]\s*/, '');
      var cut = tail.split('\n')[0].replace(/[)\s]*$/, '').trim();
      if (!cut) return null;
      var words = cut.split(/\s+/);
      for (var n = words.length; n >= 1; n--) {
        var cand = words.slice(0, n).join(' ');
        if (compile(cand)) return { expr: cand, f: compile(cand) };
      }
      return { expr: cut, f: null };
    } catch (e) { return null; }
  }

  function draw(canvas, f) {
    try {
      var dpr = 2, W = canvas.clientWidth || 360, H = 250;
      canvas.width = W * dpr; canvas.height = H * dpr;
      var ctx = canvas.getContext('2d');
      ctx.scale(dpr, dpr);
      var N = 400, xs = [], ys = [];
      for (var i = 0; i <= N; i++) { var x = -10 + 20 * i / N; xs.push(x); ys.push(f(x)); }
      var fy = ys.filter(function (y) { return isFinite(y) && Math.abs(y) < 1e6; });
      var lo = -1, hi = 1;
      if (fy.length) {
        lo = Math.min.apply(null, fy); hi = Math.max.apply(null, fy);
        if (hi - lo < 1e-9) { lo -= 1; hi += 1; }
        var pad = (hi - lo) * 0.12; lo -= pad; hi += pad;
      }
      var L = 34, R = W - 8, T = 10, B = H - 22;
      function px(x) { return L + (x + 10) / 20 * (R - L); }
      function py(y) { return B - (y - lo) / (hi - lo) * (B - T); }
      ctx.clearRect(0, 0, W, H);
      ctx.font = '9px monospace';
      /* grid */
      ctx.strokeStyle = 'rgba(212,175,55,.14)'; ctx.lineWidth = 1;
      for (var gx = -10; gx <= 10; gx += 2) {
        ctx.beginPath(); ctx.moveTo(px(gx), T); ctx.lineTo(px(gx), B); ctx.stroke();
      }
      var step = (hi - lo) > 12 ? 4 : (hi - lo) > 6 ? 2 : 1;
      for (var gy = Math.ceil(lo / step) * step; gy <= hi; gy += step) {
        ctx.beginPath(); ctx.moveTo(L, py(gy)); ctx.lineTo(R, py(gy)); ctx.stroke();
      }
      /* axes */
      ctx.strokeStyle = 'rgba(212,175,55,.6)'; ctx.lineWidth = 1;
      if (lo < 0 && hi > 0) { ctx.beginPath(); ctx.moveTo(L, py(0)); ctx.lineTo(R, py(0)); ctx.stroke(); }
      ctx.beginPath(); ctx.moveTo(px(0), T); ctx.lineTo(px(0), B); ctx.stroke();
      /* labels */
      ctx.fillStyle = 'rgba(201,180,88,.85)';
      for (var tx = -10; tx <= 10; tx += 5) ctx.fillText(String(tx), px(tx) - 4, B + 12);
      ctx.fillText(lo.toFixed(1).replace(/\.0$/, ''), 2, B + 2);
      ctx.fillText(hi.toFixed(1).replace(/\.0$/, ''), 2, T + 8);
      /* curve */
      ctx.strokeStyle = '#e8cf7a'; ctx.lineWidth = 2; ctx.beginPath();
      var pen = false;
      for (var k = 0; k <= N; k++) {
        var y = ys[k];
        if (!isFinite(y) || Math.abs(y) > 1e6) { pen = false; continue; }
        var X = px(xs[k]), Y = py(y);
        if (Y < T - 200 || Y > B + 200) { pen = false; continue; }
        if (pen) ctx.lineTo(X, Y); else ctx.moveTo(X, Y);
        pen = true;
      }
      ctx.stroke();
    } catch (e2) {}
  }

  function panel(hit) {
    var wrap = document.createElement('div');
    wrap.className = 'hl504plot';
    wrap.style.cssText = 'margin:8px 0 4px 0;border:1px solid rgba(212,175,55,.4);border-radius:10px;overflow:hidden;background:#0a0a0a;';
    var bar = document.createElement('div');
    bar.style.cssText = 'display:flex;align-items:center;gap:8px;padding:7px 10px;background:rgba(212,175,55,.08);';
    var lab = document.createElement('span');
    lab.textContent = 'PLOT - y = ' + hit.expr;
    lab.style.cssText = 'font-size:10px;letter-spacing:.1em;color:#c9b458;flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;';
    var cl = document.createElement('button'); cl.textContent = 'HIDE';
    cl.style.cssText = 'padding:5px 10px;font-size:10px;border:1px solid rgba(212,175,55,.5);border-radius:6px;background:#141414;color:#e8cf7a;cursor:pointer;';
    bar.appendChild(lab); bar.appendChild(cl);
    var body = document.createElement('div'); body.style.cssText = 'padding:6px 8px 10px 8px;';
    wrap.appendChild(bar); wrap.appendChild(body);
    if (!hit.f) {
      var msg = document.createElement('div');
      msg.textContent = "couldn't read a formula in x here. try: plot sin(x)+x/3";
      msg.style.cssText = 'font-size:12px;color:#9a8a55;padding:6px 2px;';
      body.appendChild(msg);
    } else {
      var cv = document.createElement('canvas');
      cv.style.cssText = 'width:100%;height:250px;display:block;border-radius:6px;background:#070707;';
      body.appendChild(cv);
      var show = function () { draw(cv, hit.f); };
      if (cv.clientWidth) show(); else setTimeout(show, 60);
      cl.addEventListener('click', function () {
        if (body.style.display === 'none') { body.style.display = 'block'; cl.textContent = 'HIDE'; }
        else { body.style.display = 'none'; cl.textContent = 'SHOW'; }
      });
    }
    return wrap;
  }

  var tmr = null;
  function kick() { if (tmr) return; tmr = setTimeout(function () { tmr = null; scan(); }, 350); }
  function scan() {
    try {
      var chat = document.getElementById('chat') || document.querySelector('main') || document.body;
      var kids = chat.children;
      for (var i = 0; i < kids.length; i++) {
        var n = kids[i];
        if (n.classList && n.classList.contains('hl504plot')) continue;
        var nx = n.nextElementSibling;
        if (nx && nx.classList && nx.classList.contains('hl504plot')) continue;
        var txt = ''; try { txt = n.textContent || ''; } catch (e2) {}
        if (txt.length > 3000 || !/(?:^|\s)(?:plot|graph)\b/i.test(txt)) continue;
        var hit = extract(txt);
        if (!hit) continue;
        var p = panel(hit);
        if (n.parentNode) n.parentNode.insertBefore(p, n.nextSibling); else chat.appendChild(p);
        try { console.log('[hl504] plot panel for: ' + hit.expr); } catch (e3) {}
      }
    } catch (e4) {}
  }
  function arm() {
    var c = document.getElementById('chat') || document.querySelector('main');
    if (c && !arm.done) { arm.done = true; new MutationObserver(kick).observe(c, { childList: true, subtree: true, characterData: true }); }
  }
  arm(); setInterval(arm, 2000); setInterval(scan, 2500);

  try { console.log('[hl504] plot engine online: say "plot sin(x)+x/3" and the graph draws in chat'); } catch (e5) {}
})();

/* hl152-timeline — slim gold position rail: where you are in the record, click to jump */
(function () {
  if (window.__HL152) return; window.__HL152 = 1;
  var css = ".hl152-rail{position:fixed;left:10px;top:50%;transform:translateY(-50%);width:22px;height:42vh;min-height:180px;z-index:8450;cursor:pointer;display:none}.hl152-track{position:absolute;left:9px;top:0;width:3px;height:100%;border-radius:2px;background:rgba(197,164,91,.16)}.hl152-fill{position:absolute;left:9px;top:0;width:3px;height:0;border-radius:2px;background:linear-gradient(180deg,rgba(197,164,91,.85),rgba(197,164,91,.45))}.hl152-thumb{position:absolute;left:3px;width:15px;height:15px;border-radius:50%;background:#0d0d0d;border:2px solid #C5A45B;box-shadow:0 0 10px rgba(197,164,91,.35);transform:translateY(-50%);transition:top .15s ease}.hl152-tip{position:absolute;left:26px;background:rgba(11,11,11,.94);border:1px solid rgba(197,164,91,.5);color:#C5A45B;font:600 8.5px 'JetBrains Mono',monospace;letter-spacing:.12em;padding:4px 8px;border-radius:4px;white-space:nowrap;opacity:0;transition:opacity .2s;pointer-events:none}.hl152-rail:hover .hl152-tip{opacity:1}@media (max-width:640px){.hl152-rail{left:4px;width:16px;height:34vh;min-height:140px}.hl152-track,.hl152-fill{left:6px;width:2px}.hl152-thumb{left:1px;width:11px;height:11px}.hl152-tip{left:20px}}";
  var st = document.createElement('style'); st.id = 'hl152-style'; st.textContent = css;
  (document.head || document.documentElement).appendChild(st);
  var rail, fill, thumb, tip, scroller = null;
  function findScroller() {
    var ids = ['feedlist', 'chat', 'feed', 'messages'];
    for (var i = 0; i < ids.length; i++) {
      var el = document.getElementById(ids[i]);
      if (el && el.scrollHeight > el.clientHeight + 40) return el;
    }
    var doc = document.scrollingElement || document.documentElement;
    if (doc && doc.scrollHeight > doc.clientHeight + 40) return doc;
    return null;
  }
  function metrics() {
    if (!scroller) return null;
    var sh = scroller.scrollHeight, ch = scroller.clientHeight, st = scroller.scrollTop;
    if (sh <= ch + 40) return null;
    return { max: sh - ch, ratio: st / (sh - ch) };
  }
  function update() {
    if (!rail) return;
    scroller = findScroller();
    var m = metrics();
    if (!m) { rail.style.display = 'none'; return; }
    rail.style.display = 'block';
    var p = Math.min(1, Math.max(0, m.ratio));
    fill.style.height = (p * 100) + '%';
    thumb.style.top = (p * 100) + '%';
    var chat = document.getElementById('chat');
    var lines = chat ? chat.querySelectorAll('.line') : [];
    var idx = lines.length ? Math.min(lines.length, Math.max(1, Math.round(p * lines.length) + 1)) : 0;
    tip.textContent = 'ENTRY ' + idx + ' / ' + lines.length;
  }
  function jump(e) {
    if (!scroller) return;
    var r = rail.getBoundingClientRect();
    var y = (e.clientY !== undefined ? e.clientY : r.top + (e * r.height)) - r.top;
    var p = Math.min(1, Math.max(0, y / r.height));
    var opts = { top: p * (scroller.scrollHeight - scroller.clientHeight), behavior: 'auto' };
    try { scroller.scrollTo(opts); } catch (err) { scroller.scrollTop = opts.top; }
  }
  function build() {
    if (rail || !document.body) return false;
    var chat = document.getElementById('chat'); if (!chat) return false;
    rail = document.createElement('div'); rail.className = 'hl152-rail'; rail.setAttribute('aria-label', 'Record position');
    var track = document.createElement('div'); track.className = 'hl152-track';
    fill = document.createElement('div'); fill.className = 'hl152-fill';
    thumb = document.createElement('div'); thumb.className = 'hl152-thumb';
    tip = document.createElement('div'); tip.className = 'hl152-tip'; tip.textContent = 'ENTRY';
    rail.appendChild(track); rail.appendChild(fill); rail.appendChild(thumb); rail.appendChild(tip);
    rail.addEventListener('click', function (e) { jump(e); });
    rail.addEventListener('mousemove', function (e) {
      var r = rail.getBoundingClientRect();
      var p = Math.min(1, Math.max(0, (e.clientY - r.top) / r.height));
      var lines = chat.querySelectorAll('.line').length;
      var idx = lines ? Math.min(lines.length, Math.max(1, Math.round(p * lines.length) + 1)) : 0;
      tip.textContent = 'ENTRY ' + idx + ' / ' + lines.length;
      tip.style.top = (p * 100) + '%';
    });
    document.body.appendChild(rail);
    setInterval(update, 400);
    addEventListener('resize', update);
    update();
    return true;
  }
  var tries = 0; var iv = setInterval(function () { if (build()) clearInterval(iv); else if (++tries > 90) clearInterval(iv); }, 800);
})();

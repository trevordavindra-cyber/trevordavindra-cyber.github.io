/* hl194-reliquary — THE RELIQUARY: a gold session plaque. A small gold ❖ sigil beside the lumen sigil opens a quiet plaque tallying this vigil: lines in the record, words carried, minutes since the vigil began. Esc or the sigil closes it. Purely additive; nothing existing changes. */
(function () {
  if (window.__HL194) return; window.__HL194 = 1;
  var css = [
    '#hl194-btn{position:fixed;left:96px;bottom:96px;z-index:2147482900;width:34px;height:34px;border-radius:50%;border:1px solid rgba(201,162,39,.5);background:linear-gradient(160deg,rgba(12,10,6,.94),rgba(24,18,8,.94));color:#f0d67a;font-size:13px;line-height:32px;text-align:center;box-shadow:0 4px 18px rgba(0,0,0,.55),0 0 10px rgba(201,162,39,.15);cursor:pointer;user-select:none;-webkit-user-select:none;transition:transform .18s ease,box-shadow .18s ease;}',
    '#hl194-btn:active{transform:scale(.94);}',
    '#hl194-plaque{position:fixed;left:96px;bottom:140px;z-index:2147482901;width:230px;background:linear-gradient(170deg,rgba(10,8,5,.97),rgba(20,15,7,.97));border:1px solid rgba(201,162,39,.55);border-radius:3px;box-shadow:0 8px 30px rgba(0,0,0,.65),0 0 14px rgba(201,162,39,.12);padding:14px 16px;display:none;}',
    '#hl194-plaque.on{display:block;}',
    '#hl194-plaque .hl194-head{font:10px/1 "Courier New",monospace;letter-spacing:.22em;color:#c9a227;text-transform:uppercase;margin-bottom:10px;}',
    '#hl194-plaque .hl194-stat{display:flex;justify-content:space-between;align-items:baseline;padding:5px 0;border-top:1px solid rgba(201,162,39,.14);font:11px/1.3 "Courier New",monospace;}',
    '#hl194-plaque .hl194-stat:first-of-type{border-top:none;}',
    '#hl194-plaque .hl194-k{color:rgba(216,180,90,.75);letter-spacing:.08em;text-transform:uppercase;font-size:9px;}',
    '#hl194-plaque .hl194-v{color:#f0d67a;font-size:13px;font-weight:700;}'
  ].join('\n');
  var btn = null, plaque = null;
  function stats() {
    var chat = document.getElementById('chat');
    var lines = chat ? chat.children.length : 0;
    var words = 0;
    if (chat) { var tx = chat.innerText || ''; words = tx.replace(/\s+/g, ' ').trim().split(' ').filter(Boolean).length; }
    var first = 0;
    try { first = parseInt(localStorage.getItem('hl194-first') || '0', 10) || 0; if (!first) { first = Date.now(); localStorage.setItem('hl194-first', String(first)); } } catch (e) { first = Date.now(); }
    var mins = Math.max(1, Math.round((Date.now() - first) / 60000));
    return { lines: lines, words: words, mins: mins };
  }
  function fill() {
    var s = stats();
    plaque.innerHTML = '<div class="hl194-head">\u2726 THE RELIQUARY</div>'
      + '<div class="hl194-stat"><span class="hl194-k">Lines in the record</span><span class="hl194-v">' + s.lines + '</span></div>'
      + '<div class="hl194-stat"><span class="hl194-k">Words carried</span><span class="hl194-v">' + s.words + '</span></div>'
      + '<div class="hl194-stat"><span class="hl194-k">Minutes of the vigil</span><span class="hl194-v">' + s.mins + '</span></div>';
  }
  function toggle() {
    if (!plaque) return;
    var on = !plaque.classList.contains('on');
    if (on) fill();
    plaque.classList.toggle('on', on);
    if (btn) btn.classList.toggle('on', on);
  }
  function build() {
    if (btn) return true;
    if (!document.getElementById('chat')) return false;
    var s = document.createElement('style'); s.id = 'hl194-style'; s.textContent = css;
    (document.head || document.documentElement).appendChild(s);
    btn = document.createElement('button');
    btn.id = 'hl194-btn'; btn.type = 'button'; btn.textContent = '\u2756';
    btn.title = 'THE RELIQUARY: this vigil, tallied'; btn.setAttribute('aria-expanded', 'false');
    document.body.appendChild(btn);
    plaque = document.createElement('div'); plaque.id = 'hl194-plaque';
    document.body.appendChild(plaque);
    btn.addEventListener('click', toggle);
    document.addEventListener('keydown', function (e) {
      if (e.key !== 'Escape') return;
      if (plaque && plaque.classList.contains('on')) { plaque.classList.remove('on'); if (btn) btn.classList.remove('on'); }
    });
    return true;
  }
  window.__HL194_IV = setInterval(function () { if (build()) clearInterval(window.__HL194_IV); }, 1800);
  setTimeout(function () { if (window.__HL194_IV) clearInterval(window.__HL194_IV); }, 120000);
})();

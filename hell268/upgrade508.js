/* ILLUMINATI upgrade 508 - MEMORY BANK (hl508)
   Major capability: the AI finally remembers. Say "remember that my locker
   code is 4821" and the fact is saved on this phone for good. From then on
   every reply the AI writes already knows your saved facts, no retelling.
   Ask "what do you remember" to open the bank, tap FORGET to drop one fact,
   "forget <thing>" or "clear memory" also work. Saved on this device only.
   Nothing removed. */
(function () {
  if (window.__HL508) return; window.__HL508 = true;

  var KEY = 'illu_mem_v1';

  function load() { try { return JSON.parse(localStorage.getItem(KEY) || '[]'); } catch (e) { return []; } }
  function save(a) { try { localStorage.setItem(KEY, JSON.stringify(a.slice(-40))); } catch (e) {} }
  function norm(s) { return String(s).toLowerCase().replace(/[^a-z0-9 ]/g, '').replace(/\s+/g, ' ').trim(); }

  function remember(txt) {
    var m = /^\s*remember\s+(?:that\s+)?(.+)$/i.exec(txt);
    if (!m) return null;
    var v = m[1].replace(/[.!?]+$/, '').trim();
    if (v.length < 3 || v.length > 300) return null;
    var a = load();
    var nv = norm(v);
    for (var i = 0; i < a.length; i++) if (norm(a[i].v) === nv) return { dup: true, v: v };
    a.push({ k: nv.split(' ').slice(0, 4).join(' ') || nv, v: v, t: Date.now() });
    save(a);
    return { saved: true, v: v, n: Math.min(a.length, 40) };
  }

  function forget(txt) {
    var m = /^\s*forget\s+(?:that\s+)?(.+)$/i.exec(txt);
    if (!m) return 0;
    var q = norm(m[1]);
    var a = load(), kept = [];
    for (var i = 0; i < a.length; i++) {
      if (norm(a[i].v).indexOf(q) === -1 && norm(a[i].k).indexOf(q) === -1) kept.push(a[i]);
    }
    save(kept);
    return a.length - kept.length;
  }

  function note() {
    var a = load();
    if (!a.length) return null;
    var lines = [], used = 0;
    for (var i = a.length - 1; i >= 0; i--) {
      var l = (i + 1) + '. ' + a[i].v;
      if (used + l.length > 1200) break;
      lines.unshift(l); used += l.length;
    }
    return 'MEMORY BANK \u2014 facts the user asked you to remember about them. Treat them as true and use them when relevant:\n' + lines.join('\n');
  }

  var F = window.fetch;
  if (F && !window.__HL508F) {
    window.__HL508F = true;
    window.fetch = function (input, init) {
      try {
        var body = init && typeof init.body === 'string' ? init.body : null;
        if (body && body.indexOf('"messages"') !== -1) {
          var s = note();
          if (s) {
            var j = JSON.parse(body);
            if (j && j.messages && j.messages.push) {
              j.messages.push({ role: 'system', content: s });
              init = Object.assign({}, init, { body: JSON.stringify(j) });
            }
          }
        }
      } catch (e) {}
      return F.apply(this, arguments);
    };
  }
  if (window.XMLHttpRequest && !window.__HL508X) {
    window.__HL508X = true;
    var os = XMLHttpRequest.prototype.send;
    XMLHttpRequest.prototype.send = function (body) {
      try {
        if (typeof body === 'string' && body.indexOf('"messages"') !== -1) {
          var s = note();
          if (s) {
            var j = JSON.parse(body);
            if (j && j.messages && j.messages.push) j.messages.push({ role: 'system', content: s });
            body = JSON.stringify(j);
          }
        }
      } catch (e) {}
      return os.apply(this, arguments);
    };
  }

  function panel(title, rows) {
    var old = document.querySelector('.hl508panel'); if (old) old.remove();
    var wrap = document.createElement('div');
    wrap.className = 'hl508panel';
    wrap.style.cssText = 'position:fixed;left:10px;right:10px;bottom:76px;z-index:99990;max-height:55vh;overflow:auto;border:1px solid rgba(212,175,55,.45);border-radius:12px;background:#0a0a0a;box-shadow:0 10px 40px rgba(0,0,0,.7);';
    var bar = document.createElement('div');
    bar.style.cssText = 'display:flex;align-items:center;gap:8px;padding:9px 12px;background:rgba(212,175,55,.1);position:sticky;top:0;';
    var lab = document.createElement('span'); lab.textContent = title;
    lab.style.cssText = 'font-size:11px;letter-spacing:.12em;color:#c9b458;flex:1;';
    var x = document.createElement('button'); x.textContent = 'CLOSE';
    x.style.cssText = 'padding:5px 10px;font-size:10px;border:1px solid rgba(212,175,55,.5);border-radius:6px;background:#141414;color:#e8cf7a;cursor:pointer;';
    x.addEventListener('click', function () { wrap.remove(); });
    bar.appendChild(lab); bar.appendChild(x); wrap.appendChild(bar);
    var body = document.createElement('div'); body.style.cssText = 'padding:6px 10px 10px 10px;';
    wrap.appendChild(body);
    if (!rows.length) {
      var e = document.createElement('div'); e.textContent = 'the bank is empty. say "remember that ..." to save your first fact.';
      e.style.cssText = 'font-size:12px;color:#9a8a55;padding:8px 2px;';
      body.appendChild(e);
    }
    for (var i = 0; i < rows.length; i++) {
      var r = document.createElement('div');
      r.style.cssText = 'display:flex;align-items:flex-start;gap:8px;padding:7px 2px;border-bottom:1px solid rgba(212,175,55,.12);';
      var t = document.createElement('div'); t.textContent = (i + 1) + '. ' + rows[i].v;
      t.style.cssText = 'font-size:12px;color:#ddd;flex:1;';
      var f = document.createElement('button'); f.textContent = 'FORGET';
      f.style.cssText = 'padding:4px 8px;font-size:9px;border:1px solid rgba(212,175,55,.4);border-radius:6px;background:#141414;color:#c98a58;cursor:pointer;flex:0 0 auto;';
      (function (idx) { f.addEventListener('click', function () { var a = load(); a.splice(idx, 1); save(a); panel(title, load()); }); })(i);
      r.appendChild(t); r.appendChild(f); body.appendChild(r);
    }
    document.body.appendChild(wrap);
  }

  var tmr = null, seen = {};
  function kick() { if (tmr) return; tmr = setTimeout(function () { tmr = null; scan(); }, 350); }
  function scan() {
    try {
      if (Object.keys(seen).length > 500) seen = {};
      var chat = document.getElementById('chat') || document.querySelector('main') || document.body;
      var kids = chat.children;
      for (var i = 0; i < kids.length; i++) {
        var n = kids[i];
        if (n.classList && (n.classList.contains('hl508panel') || n.classList.contains('hl509panel') || n.classList.contains('hl504plot'))) continue;
        var txt = ''; try { txt = (n.textContent || '').trim(); } catch (e2) {}
        if (!txt || txt.length > 600 || seen[txt]) continue;
        seen[txt] = 1;
        if (!/^(remember|forget|what do you remember|show (my |the )?memor|memory bank|clear memory|wipe memory)\b/i.test(txt)) continue;
        if (/^remember\b/i.test(txt)) {
          var r = remember(txt);
          if (r && r.saved) { try { console.log('[hl508] saved: ' + r.v + ' (' + r.n + ' facts)'); } catch (e3) {} }
          else if (r && r.dup) { try { console.log('[hl508] already saved: ' + r.v); } catch (e4) {} }
        } else if (/^forget\b/i.test(txt)) {
          var k = forget(txt);
          try { console.log('[hl508] forget "' + txt.slice(0, 60) + '" dropped ' + k); } catch (e5) {}
        } else if (/^(clear memory|wipe memory)\b/i.test(txt)) {
          save([]);
          try { console.log('[hl508] memory cleared'); } catch (e6) {}
        }
        if (/what do you remember|show (my |the )?memor|memory bank/i.test(txt)) panel('MEMORY BANK \u2014 ' + load().length + ' facts', load());
      }
    } catch (e7) {}
  }
  var c = document.getElementById('chat') || document.querySelector('main');
  if (c) new MutationObserver(kick).observe(c, { childList: true, subtree: true, characterData: true });
  setInterval(scan, 2500);

  try { console.log('[hl508] memory bank online: say "remember that ..." and it sticks'); } catch (e8) {}
})();

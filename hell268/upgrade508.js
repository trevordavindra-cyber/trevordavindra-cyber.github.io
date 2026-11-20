/* ILLUMINATI upgrade 508 - MEMORY BANK (hl508)
   Major capability: the AI finally remembers you between messages. Say
   "remember that my favorite color is emerald" and it sticks. Say "what do
   you remember" and a MEMORY BANK panel opens listing every saved fact.
   Say "forget that ..." or "forget my ..." to drop one. Say "clear memory"
   to wipe the bank. Facts persist in this browser (localStorage) across
   reloads and are injected into every AI request, so the AI answers with
   your facts in mind. Nothing removed. */
(function () {
  if (window.__HL508) return; window.__HL508 = true;

  var KEY = 'hl508facts';
  var MAX = 60;

  function load() {
    try { return JSON.parse(localStorage.getItem(KEY) || '[]'); } catch (e) { return []; }
  }
  function save(a) {
    try { localStorage.setItem(KEY, JSON.stringify(a.slice(-MAX))); } catch (e2) {}
  }
  function norm(s) { return String(s).toLowerCase().replace(/[^a-z0-9 ]/g, '').replace(/\s+/g, ' ').trim(); }

  function clean(s) {
    s = String(s || '');
    s = s.replace(/^(YOU|ILLUMINATI)\b[\s\S]*?\d{1,2}:\d{2}:\d{2}]?\s*/, '');
    var cut = s.search(/\b(?:COPY|EDIT|SPEAK|REGEN|PIN|COPIED)\b/);
    if (cut > -1) s = s.slice(0, cut);
    return s.trim();
  }

  function remember(txt) {
    var m = /^\s*remember\s+(?:that\s+)?(.+)$/i.exec(txt);
    if (!m) return null;
    var v = m[1].replace(/[.!?]+$/, '').trim();
    if (v.length < 3 || v.length > 300) return null;
    var a = load();
    var n = norm(v);
    for (var i = 0; i < a.length; i++) { if (norm(a[i]) === n) return { dup: true, v: v, n: a.length }; }
    a.push(v); save(a);
    return { saved: true, v: v, n: a.length };
  }
  function forget(txt) {
    var m = /^\s*forget\s+(?:that\s+)?(?:about\s+)?(?:my\s+)?(.+)$/i.exec(txt);
    if (!m) return 0;
    var key = norm(m[1].replace(/[.!?]+$/, ''));
    if (!key) return 0;
    var a = load();
    var out = [], dropped = 0;
    for (var i = 0; i < a.length; i++) {
      var nv = norm(a[i]);
      if (nv.indexOf(key) > -1 || key.indexOf(nv) > -1) { dropped++; continue; }
      out.push(a[i]);
    }
    save(out);
    return dropped;
  }

  function panel(title, items) {
    var old = document.querySelector('.hl508panel'); if (old) old.remove();
    var wrap = document.createElement('div');
    wrap.className = 'hl508panel';
    wrap.style.cssText = 'position:fixed;left:10px;right:10px;bottom:76px;max-height:46vh;overflow:auto;z-index:99990;border:1px solid rgba(212,175,55,.45);border-radius:12px;background:#0a0a0a;box-shadow:0 10px 40px rgba(0,0,0,.7);';
    var bar = document.createElement('div');
    bar.style.cssText = 'display:flex;align-items:center;gap:8px;padding:9px 12px;background:rgba(212,175,55,.1);position:sticky;top:0;';
    var lab = document.createElement('span'); lab.textContent = title;
    lab.style.cssText = 'font-size:11px;letter-spacing:.12em;color:#c9b458;flex:1;';
    var x = document.createElement('button'); x.textContent = 'CLOSE';
    x.style.cssText = 'padding:5px 10px;font-size:10px;border:1px solid rgba(212,175,55,.5);border-radius:6px;background:#141414;color:#e8cf7a;cursor:pointer;';
    x.addEventListener('click', function () { wrap.remove(); });
    bar.appendChild(lab); bar.appendChild(x); wrap.appendChild(bar);
    var body = document.createElement('div'); body.style.cssText = 'padding:8px 12px 12px 12px;';
    wrap.appendChild(body);
    if (!items || !items.length) {
      var e0 = document.createElement('div'); e0.textContent = 'the bank is empty. say "remember that ..." and it sticks.';
      e0.style.cssText = 'font-size:12px;color:#9a8a55;';
      body.appendChild(e0);
    } else {
      for (var i = 0; i < items.length; i++) {
        var it = document.createElement('div');
        it.textContent = (i + 1) + '. ' + items[i];
        it.style.cssText = 'font-size:13px;color:#e8cf7a;padding:5px 0;border-bottom:1px solid rgba(212,175,55,.12);word-break:break-word;';
        body.appendChild(it);
      }
      var hint = document.createElement('div'); hint.textContent = 'say "forget that ..." to drop one, "clear memory" to wipe the bank.';
      hint.style.cssText = 'font-size:10px;color:#9a8a55;padding-top:8px;';
      body.appendChild(hint);
    }
    document.body.appendChild(wrap);
  }

  function inject() {
    var a = load();
    if (!a.length) return;
    try {
      var stor = null;
      try { stor = window.__HLHISTORY || window.HISTORY || null; } catch (e0) {}
      if (stor && stor.push) {
        stor.push({ role: 'system', content: 'MEMORY BANK \u2014 facts the user asked you to remember about them. Use them naturally when relevant:\n- ' + a.join('\n- ') });
        try { console.log('[hl508] memory injected (' + a.length + ' facts)'); } catch (e1) {}
      }
    } catch (e2) {}
  }

  var _fetch = window.fetch;
  window.fetch = function () {
    try { inject(); } catch (e) {}
    return _fetch.apply(this, arguments);
  };

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
        if (/^(?:YOU|ILLUMINATI|\[[0-9:]+\]|[0-9]{1,2}:[0-9]{2}(?::[0-9]{2})?\s*(?:AM|PM)?)$/i.test(txt) || /^(?:COPY|EDIT|SPEAK|REGEN|PIN|COPIED)$/i.test(txt)) continue;
        seen[txt] = 1;
        var msg = clean(txt);
        var anchored = /^(remember|forget|what do you remember|show (my |the )?memor|memory bank|clear memory|wipe memory)\b/i.test(msg);
        if (!anchored && !/(?:^|\s)(?:what do you remember|memory bank|clear (?:the )?memory|wipe memory|forget (?:that|about|the|my)\b)/i.test(msg)) continue;
        if (/^remember\b/i.test(msg)) {
          var r = remember(msg);
          if (r && r.saved) { try { console.log('[hl508] saved: ' + r.v + ' (' + r.n + ' facts)'); } catch (e3) {} }
          else if (r && r.dup) { try { console.log('[hl508] already saved: ' + r.v); } catch (e4) {} }
        } else if (/^forget\b/i.test(msg)) {
          var k = forget(msg);
          try { console.log('[hl508] forget "' + txt.slice(0, 60) + '" dropped ' + k); } catch (e5) {}
        } else if (/^(clear memory|wipe memory)\b/i.test(msg)) {
          save([]);
          try { console.log('[hl508] memory cleared'); } catch (e6) {}
        }
        if (/what do you remember|show (my |the )?memor|memory bank/i.test(msg)) panel('MEMORY BANK \u2014 ' + load().length + ' facts', load());
      }
    } catch (e7) {}
  }
  var c = document.getElementById('chat') || document.querySelector('main');
  if (c) new MutationObserver(kick).observe(c, { childList: true, subtree: true, characterData: true });
  setInterval(scan, 2500);

  try { console.log('[hl508] memory bank online: say "remember that ..." and it sticks'); } catch (e8) {}
})();
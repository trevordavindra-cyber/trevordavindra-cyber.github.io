/* ILLUMINATI upgrade 507 - FILE READ (hl507)
   Major capability: the AI can read real files. Tap the READ FILE button by the
   input box, pick any text file (.txt, .md, .json, .csv, .html, .js, .log),
   and its contents get attached to the conversation. A chip above the input
   shows the loaded file. The AI then answers questions about that file's
   actual contents - quotes it, summarizes it, answers from it. Say "clear
   the file" in chat to drop it. Nothing removed. */
(function () {
  if (window.__HL507) return; window.__HL507 = true;

  var MAXC = 6000;
  var pay = null;

  function chip() {
    var b = document.querySelector('.hl507chip');
    if (!b) { ensureBtn(); b = document.querySelector('.hl507chip'); }
    if (b) b.textContent = pay ? ('\u25CE ' + pay.name + ' (' + pay.size + 'ch)') : '\u25CE READ FILE';
  }

  function ensureBtn() {
    if (document.querySelector('.hl507chip')) return;
    var ta = document.querySelector('textarea');
    if (!ta || !ta.parentElement) return;
    var b = document.createElement('button');
    b.className = 'hl507chip';
    b.textContent = '\u25CE READ FILE';
    b.style.cssText = 'position:fixed;left:12px;bottom:132px;z-index:99980;padding:7px 12px;font-size:11px;letter-spacing:.08em;border:1px solid rgba(212,175,55,.5);border-radius:20px;background:rgba(10,10,10,.9);color:#e8cf7a;cursor:pointer;font-family:inherit;';
    b.addEventListener('click', function () {
      var inp = document.createElement('input');
      inp.type = 'file';
      inp.accept = '.txt,.md,.json,.csv,.html,.htm,.js,.css,.log,.xml,.yml,.yaml,text/*';
      inp.style.cssText = 'position:fixed;left:-9999px;width:1px;height:1px;opacity:0;';
      inp.setAttribute('data-hl507', '1');
      document.body.appendChild(inp);
      inp.addEventListener('change', function () {
        var f = inp.files && inp.files[0];
        if (!f) return;
        if (f.size > 400000) { b.textContent = '\u25CE TOO BIG (max ~400KB)'; setTimeout(chip, 2500); return; }
        var r = new FileReader();
        r.onload = function () {
          var t = String(r.result || '');
          var full = t.length;
          pay = { name: f.name, text: t, size: Math.min(full, MAXC) };
          try { console.log('[hl507] file loaded: ' + f.name + ' (' + full + 'ch)'); } catch (e) {}
          chip();
        };
        r.readAsText(f);
      });
      inp.click();
      setTimeout(function () { try { inp.parentNode && inp.parentNode.removeChild(inp); } catch (e6) {} }, 30000);
    });
    document.body.appendChild(b);
  }

  function inject(args) {
    if (!pay) return;
    try {
      var url = String(args[0] || '');
      if (url.indexOf('text.pollinations.ai/openai') === -1) return;
      var init = args[1] || null;
      if (!init || init.method !== 'POST' || !init.body) return;
      var b = JSON.parse(init.body);
      if (!b || !b.messages || !b.messages.length) return;
      var dup = false;
      for (var i = 0; i < b.messages.length; i++) {
        var m = b.messages[i];
        if (m && m.role === 'system' && String(m.content || '').indexOf('LIVE FILE CONTENT') === 0) { dup = true; break; }
      }
      if (dup) return;
      b.messages.unshift({ role: 'system', content: 'LIVE FILE CONTENT \u2014 the user attached the file "' + pay.name + '". Read it and use it whenever they ask about it:\n\n' + pay.text + '\n\n(End of file content.)' });
      init.body = JSON.stringify(b);
      pay = null; chip();
      try { console.log('[hl507] file injected into request'); } catch (e1) {}
    } catch (e) {}
  }

  var _fetch = window.fetch;
  window.fetch = function () {
    try { inject(arguments); } catch (e) {}
    return _fetch.apply(this, arguments);
  };

  var tmr = null;
  function kick() { if (tmr) return; tmr = setTimeout(function () { tmr = null; scan(); }, 350); }
  function scan() {
    try {
      var chat = document.getElementById('chat') || document.querySelector('main') || document.body;
      var kids = chat.children;
      for (var i = 0; i < kids.length; i++) {
        var txt = ''; try { txt = (kids[i].textContent || '').trim(); } catch (e2) {}
        if (!txt || txt.length > 400) continue;
        if (pay && /(?:^|\s)clear\s+(the\s+)?file\b/i.test(txt)) {
          pay = null; chip();
          try { console.log('[hl507] file cleared'); } catch (e3) {}
        }
      }
    } catch (e4) {}
  }
  var c = document.getElementById('chat') || document.querySelector('main');
  if (c) new MutationObserver(kick).observe(c, { childList: true, subtree: true, characterData: true });
  setInterval(scan, 2500);
  setInterval(ensureBtn, 2000); ensureBtn();

  try { console.log('[hl507] file read online: tap READ FILE and pick a text file'); } catch (e5) {}
})();
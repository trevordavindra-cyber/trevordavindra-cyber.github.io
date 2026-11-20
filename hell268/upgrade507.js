/* ILLUMINATI upgrade 507 - FILE READ (hl507)
   Major capability: the AI can read real files. Tap the READ FILE button by
   the message box, pick any text file (.txt .md .csv .json .js .html .css
   .xml .log .yml .py and more), and its contents ride with your next message
   as a system note the AI actually reads. Good for notes, code, data exports
   and transcripts. Tap again to swap files, say "clear file" to drop it.
   Nothing removed. */
(function () {
  if (window.__HL507) return; window.__HL507 = true;

  var MAXC = 12000;
  var pay = null;

  function chip() {
    var b = document.getElementById('hl507btn');
    if (b) b.textContent = pay ? ('\u25CE ' + pay.name + ' (' + pay.size + 'ch)') : '\u25CE READ FILE';
  }

  function pick() {
    try {
      var inp = document.getElementById('hl507input');
      if (!inp) {
        inp = document.createElement('input');
        inp.type = 'file'; inp.id = 'hl507input'; inp.style.display = 'none';
        inp.accept = '.txt,.md,.markdown,.csv,.tsv,.json,.js,.mjs,.ts,.html,.htm,.css,.xml,.log,.yml,.yaml,.ini,.py,.java,.c,.cpp,.h,.sh,.sql,.srt,.vtt,.rtf';
        document.body.appendChild(inp);
        inp.addEventListener('change', function () {
          var f = inp.files && inp.files[0]; if (!f) return;
          var r = new FileReader();
          r.onload = function () {
            var t = String(r.result || '');
            var full = t.length;
            if (t.length > MAXC) t = t.slice(0, MAXC) + '\n[... file truncated after ' + MAXC + ' characters ...]';
            pay = { name: f.name, text: t, size: Math.min(full, MAXC) };
            chip();
            try { console.log('[hl507] file loaded: ' + f.name + ' (' + full + ' chars)'); } catch (e) {}
          };
          r.onerror = function () { try { console.log('[hl507] could not read that file'); } catch (e) {} };
          r.readAsText(f);
          inp.value = '';
        });
      }
      inp.click();
    } catch (e) {}
  }

  function ensureBtn() {
    try {
      if (document.getElementById('hl507btn')) return;
      var ta = document.querySelector('textarea');
      if (!ta || !ta.parentElement) return;
      var b = document.createElement('button');
      b.id = 'hl507btn'; b.type = 'button';
      b.style.cssText = 'padding:8px 10px;font-size:10px;letter-spacing:.06em;border:1px solid rgba(212,175,55,.5);border-radius:8px;background:#141414;color:#e8cf7a;cursor:pointer;flex:0 0 auto;white-space:nowrap;margin:0 6px 0 0;';
      b.textContent = '\u25CE READ FILE';
      b.addEventListener('click', pick);
      ta.parentElement.insertBefore(b, ta);
      chip();
    } catch (e) {}
  }

  function injectNote(j) {
    if (!pay || !j || !j.messages || !j.messages.push) return false;
    j.messages.push({ role: 'system', content: 'LIVE FILE CONTENT \u2014 the user attached the file "' + pay.name + '". Read it and use it whenever they ask about it:\n\n' + pay.text + '\n\n(End of file content.)' });
    try { console.log('[hl507] file injected: ' + pay.name); } catch (e) {}
    pay = null; chip();
    return true;
  }

  var F = window.fetch;
  if (F && !window.__HL507F) {
    window.__HL507F = true;
    window.fetch = function (input, init) {
      try {
        var body = init && typeof init.body === 'string' ? init.body : null;
        if (body && body.indexOf('"messages"') !== -1) {
          var j = JSON.parse(body);
          if (injectNote(j)) init = Object.assign({}, init, { body: JSON.stringify(j) });
        }
      } catch (e) {}
      return F.apply(this, arguments);
    };
  }
  if (window.XMLHttpRequest && !window.__HL507X) {
    window.__HL507X = true;
    var os = XMLHttpRequest.prototype.send;
    XMLHttpRequest.prototype.send = function (body) {
      try {
        if (typeof body === 'string' && body.indexOf('"messages"') !== -1) {
          var j = JSON.parse(body);
          if (injectNote(j)) body = JSON.stringify(j);
        }
      } catch (e) {}
      return os.apply(this, arguments);
    };
  }

  var tmr = null;
  function kick() { if (tmr) return; tmr = setTimeout(function () { tmr = null; scan(); }, 350); }
  function scan() {
    try {
      var chat = document.getElementById('chat') || document.querySelector('main') || document.body;
      var kids = chat.children;
      for (var i = 0; i < kids.length; i++) {
        var txt = ''; try { txt = (kids[i].textContent || '').trim(); } catch (e2) {}
        if (!txt || txt.length > 400) continue;
        if (/^\s*clear\s+(the\s+)?file\b/i.test(txt) && pay) {
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

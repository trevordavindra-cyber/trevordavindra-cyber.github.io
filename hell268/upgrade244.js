/* ILLUMINATI upgrade #244: hl244-siteforge (v19.144)
   THE ASK: like Arena, when the AI builds a website the site itself should
   show up in the chat, viewable, with a download that saves the whole file.
   How it works: every relay request carries a site-forge rule, so build asks
   are answered with ONE complete, COMPACT single-file HTML document in a
   ```html code block (compact so the relay never cuts it off mid-file; the
   token floor is raised on forge requests). The chat watches replies, and any
   message carrying a website gets a SITE FORGED panel after it: PREVIEW
   renders it live in a sandboxed frame, DOWNLOAD saves the full file, named
   after the site's title. The panel is a sibling of the message, so the
   message's own restyling never wipes it, and it only arms once the reply has
   stopped growing. Truncated replies are still forged (the tail is closed
   gently so the preview renders). Nothing removed, all existing paths keep
   working. Guard: __HL244 */
(function () {
  if (window.__HL244) return; window.__HL244 = true;

  var SITE_RULE = '\n\nSITE FORGE RULE: When the user asks you to build, make, create, code, or design a website, web page, web app, game, calculator, dashboard, tool, or anything visual, reply with ONE complete single-file HTML document (all HTML, CSS, and JavaScript inline, no separate files) inside a ```html code block. Keep the whole document compact: at most about 120 lines and 3500 characters. Simple, polished, dark-themed unless told otherwise, mobile-friendly. Always close every tag and end with </html>. After the code block add one short plain sentence describing what you built. Never split the site into pieces.';

  /* tell the relay brains to answer build asks with a single-file site */
  (function wrapFetch() {
    if (window.__HL244FETCH) return; window.__HL244FETCH = true;
    var of = window.fetch;
    window.fetch = function (u, init) {
      try {
        var url = (typeof u === 'string') ? u : (u && u.url) || '';
        if (/pollinations\.ai|aihorde\.ai/.test(url) && init && init.method && String(init.method).toUpperCase() === 'POST' && init.body && typeof init.body === 'string' && init.body.charAt(0) === '{') {
          var b = JSON.parse(init.body);
          if (b && b.messages && b.messages.length && b.messages[0] && typeof b.messages[0].content === 'string' && b.messages[0].content.indexOf('SITE FORGE RULE') < 0) {
            b.messages[0].content += SITE_RULE;
            if (typeof b.max_tokens === 'number' && b.max_tokens < 3000) b.max_tokens = 3000;
            init.body = JSON.stringify(b);
          }
        }
      } catch (e) {}
      return of.apply(this, arguments);
    };
  })();

  function $(id) { return document.getElementById(id); }

  var JUNK = /^(COPY|REGEN|SPEAK|PIN|EDIT|WRAP|SAVE|RUN|CLOSE|\[COPY\]|\[REGN\])\s*$/i;

  function finish(code) {
    try {
      code = String(code).replace(/```[\s\S]*$/, '').trim();
      var lines = code.split('\n');
      while (lines.length && JUNK.test(lines[lines.length - 1].trim())) lines.pop();
      code = lines.join('\n');
      if (code.length > 150) return code;
    } catch (e) {}
    return null;
  }

  function extract(t) {
    try {
      t = String(t || '');
      var m = /```html\s*\n?([\s\S]*?)```/i.exec(t) || /```\s*\n?(<!DOCTYPE[\s\S]*?)```/i.exec(t) || /```\s*\n?(<html[\s\S]*?)```/i.exec(t);
      if (m && m[1] && /<html|<!DOCTYPE|<body|<div|<canvas|<script/i.test(m[1])) return finish(m[1]);
      /* rendered or truncated: carve the document out of the line text */
      var i = t.indexOf('<!DOCTYPE');
      if (i < 0) i = t.search(/<html[\s>]/i);
      if (i >= 0) {
        var j = t.lastIndexOf('</html>');
        var code = j > i ? t.slice(i, j + 7) : t.slice(i);
        if (code.length > 150 && /<body|<style|<script|<div|<canvas/i.test(code)) {
          if (j <= i) {
            if (/<script[\s>]/i.test(code) && !/<\/script>/i.test(code)) code += '\n</script>';
            code += '\n</body>\n</html>';
          }
          return finish(code);
        }
      }
      var r = /^[\s\n]*<!DOCTYPE html[\s\S]*<\/html>\s*$/i.exec(t);
      if (r) return finish(r[0]);
    } catch (e) {}
    return null;
  }

  function fileName(code) {
    try {
      var m = /<title>([^<]{1,60})<\/title>/i.exec(code);
      if (m && m[1]) return m[1].replace(/[^\w\s-]/g, '').trim().replace(/\s+/g, '-').toLowerCase() + '.html';
    } catch (e) {}
    return 'website.html';
  }

  function addPanel(host, code) {
    try {
      var wrap = document.createElement('div');
      wrap.className = 'hl244forge';
      wrap.style.cssText = 'margin:8px 0 4px 0;border:1px solid rgba(212,175,55,.35);border-radius:10px;overflow:hidden;background:#0a0a0a;';
      var bar = document.createElement('div');
      bar.style.cssText = 'display:flex;gap:8px;align-items:center;padding:7px 9px;background:rgba(212,175,55,.08);';
      var btnStyle = 'padding:6px 12px;font-size:11px;letter-spacing:.06em;border:1px solid rgba(212,175,55,.5);border-radius:6px;background:#141414;color:#e8cf7a;cursor:pointer;';
      var label = document.createElement('span'); label.textContent = 'SITE FORGED';
      label.style.cssText = 'font-size:10px;letter-spacing:.14em;color:#c9b458;flex:1;';
      var open = document.createElement('button'); open.textContent = 'PREVIEW'; open.style.cssText = btnStyle;
      var dl = document.createElement('button'); dl.textContent = 'DOWNLOAD'; dl.style.cssText = btnStyle;
      bar.appendChild(label); bar.appendChild(open); bar.appendChild(dl);
      var fw = document.createElement('div'); fw.style.cssText = 'display:none;';
      var frame = document.createElement('iframe');
      frame.setAttribute('sandbox', 'allow-scripts allow-same-origin allow-popups allow-forms');
      frame.style.cssText = 'width:100%;height:65vh;max-height:480px;border:0;background:#fff;display:block;';
      var loaded = false;
      open.addEventListener('click', function () {
        if (fw.style.display === 'none') {
          fw.style.display = 'block';
          if (!loaded) { frame.srcdoc = code; loaded = true; }
          open.textContent = 'HIDE';
          try { fw.scrollIntoView({ behavior: 'smooth', block: 'nearest' }); } catch (e2) {}
        } else { fw.style.display = 'none'; open.textContent = 'PREVIEW'; }
      });
      dl.addEventListener('click', function () {
        try {
          var blob = new Blob([code], { type: 'text/html' });
          var a = document.createElement('a');
          a.href = URL.createObjectURL(blob); a.download = fileName(code);
          document.body.appendChild(a); a.click();
          setTimeout(function () { try { document.body.removeChild(a); URL.revokeObjectURL(a.href); } catch (e2) {} }, 400);
        } catch (e3) {}
      });
      fw.appendChild(frame); wrap.appendChild(bar); wrap.appendChild(fw);
      if (host.parentNode) host.parentNode.insertBefore(wrap, host.nextSibling);
      else host.appendChild(wrap);
      host._hl244sib = wrap;
      console.log('[hl244] site forged: preview + download panel added (' + code.length + ' chars)');
    } catch (e) {}
  }

  function scanChat() {
    try {
      var chat = $('chat'); if (!chat) return;
      var kids = chat.children;
      for (var i = 0; i < kids.length; i++) {
        var n = kids[i];
        if (n.classList && n.classList.contains('hl244forge')) continue;
        var txt = '';
        try { txt = n.textContent || ''; } catch (e2) {}
        if (txt.indexOf('```') < 0 && txt.indexOf('<!DOCTYPE') < 0 && txt.indexOf('<html') < 0) continue;
        var code = extract(txt);
        if (!code) continue;
        /* only arm once the reply has stopped growing */
        if (n._hl244txt !== txt) { n._hl244txt = txt; continue; }
        var p = n._hl244sib;
        if (p && p.parentNode) continue;
        addPanel(n, code);
      }
    } catch (e3) {}
  }

  var tmr = null;
  function kick() { if (tmr) return; tmr = setTimeout(function () { tmr = null; scanChat(); }, 350); }

  var mo = new MutationObserver(kick);
  function arm() {
    var c = $('chat');
    if (c && !arm.done) { arm.done = true; mo.observe(c, { childList: true, subtree: true, characterData: true }); }
  }
  arm(); setInterval(arm, 2000);
  setInterval(scanChat, 2500);

  console.log('[hl244] online: site forge live (ai-built websites render in chat, preview + full-file download)');
})();

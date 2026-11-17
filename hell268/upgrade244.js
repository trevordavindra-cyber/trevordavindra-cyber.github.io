/* ILLUMINATI upgrade #244: hl244-siteforge (v19.143)
   THE ASK: like Arena, when the AI builds a website the site itself should
   show up in the chat, viewable, with a download that saves the whole file.
   How it works: every relay request now carries a site-forge rule, so build
   asks are answered with ONE complete single-file HTML document in a ```html
   code block. The chat watches replies, and any message carrying a website
   gets a panel under it: PREVIEW renders it live in a sandboxed frame inside
   the chat, DOWNLOAD saves the full file (website.html). Works on fenced code
   and on the styled code blocks the code casement renders; the panel re-arms
   itself after any rebuild of the message (v19.143). Nothing removed, all
   existing paths keep working. Guard: __HL244 */
(function () {
  if (window.__HL244) return; window.__HL244 = true;

  var SITE_RULE = '\n\nSITE FORGE RULE: When the user asks you to build, make, create, code, or design a website, web page, web app, game, calculator, dashboard, tool, or anything visual, reply with ONE complete single-file HTML document (all HTML, CSS, and JavaScript inline, no separate files) inside a ```html code block. Make it polished, dark-themed unless told otherwise, and mobile-friendly. After the code block, add one short plain sentence describing what you built. Never split the site into pieces.';

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
            init.body = JSON.stringify(b);
          }
        }
      } catch (e) {}
      return of.apply(this, arguments);
    };
  })();

  function $(id) { return document.getElementById(id); }

  function extract(t) {
    try {
      t = String(t || '');
      var m = /```html\s*\n?([\s\S]*?)```/i.exec(t) || /```\s*\n?(<!DOCTYPE[\s\S]*?)```/i.exec(t) || /```\s*\n?(<html[\s\S]*?)```/i.exec(t);
      if (m && m[1] && /<html|<!DOCTYPE|<body|<div|<canvas|<script/i.test(m[1])) return m[1].trim();
      /* rendered code blocks: the fences are gone, so carve the document out
         of the line text, from the first doctype/html tag to the last close */
      var i = t.indexOf('<!DOCTYPE');
      if (i < 0) i = t.search(/<html[\s>]/i);
      var j = t.lastIndexOf('</html>');
      if (i >= 0 && j > i) {
        var code = t.slice(i, j + 7);
        if (code.length > 150) return code;
      }
      var r = /^[\s\n]*<!DOCTYPE html[\s\S]*<\/html>\s*$/i.exec(t);
      if (r) return r[0].trim();
    } catch (e) {}
    return null;
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
          a.href = URL.createObjectURL(blob); a.download = 'website.html';
          document.body.appendChild(a); a.click();
          setTimeout(function () { try { document.body.removeChild(a); URL.revokeObjectURL(a.href); } catch (e2) {} }, 400);
        } catch (e3) {}
      });
      fw.appendChild(frame); wrap.appendChild(bar); wrap.appendChild(fw);
      host.appendChild(wrap);
      console.log('[hl244] site forged: preview + download panel added (' + code.length + ' chars)');
    } catch (e) {}
  }

  function scanChat() {
    try {
      var chat = $('chat'); if (!chat) return;
      var kids = chat.children;
      for (var i = 0; i < kids.length; i++) {
        var n = kids[i];
        if (n.querySelector && n.querySelector('.hl244forge')) continue;
        var txt = '';
        try { txt = n.textContent || ''; } catch (e2) {}
        if (txt.indexOf('```') < 0 && txt.indexOf('<!DOCTYPE') < 0 && txt.indexOf('<html') < 0) continue;
        var code = extract(txt);
        if (!code) continue;
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

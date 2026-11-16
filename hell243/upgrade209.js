/* ILLUMINATI upgrade #209: hl209-forge (v19.116)
   THE CODE FORGE + THE CONTEXT WINDOW. Two halves:
   1) CODE FORGE — a system directive joins every relay call: when the ask is
      code, a website, an app, a tool, a script or a game, the engine answers
      with the FULL working code in fenced blocks, no stubs, no placeholders,
      end to end. Injection rides the same fetch seam as the REA core
      (upgrade #114): POST /openai bodies get it appended to the system
      message, plain-GET prompts get a compact prefix. Guard __hl209 so it
      never doubles.
   2) CONTEXT WINDOW — the moment the engine writes code, a live terminal
      window opens over the chat showing exactly what it is building: the
      newest fenced code block, line-numbered, gold on black, with COPY and
      CLOSE. It tracks streaming as the code grows, reopens from a floating
      chip if closed, and touches nothing else in the interface. Nothing
      existing is removed. Guard: __HL209 */
(function () {
  if (window.__HL209) return; window.__HL209 = true;

  /* ---------------- 1) CODE FORGE ---------------- */
  var FORGE = '[CODE FORGE - ACTIVE] You are a complete builder. Whenever the user asks for code, a website, an app, a tool, a script, a game, a bot or any program, answer with the FULL, WORKING, COMPLETE code in fenced code blocks. No placeholders, no add-your-logic-here stubs, no truncation: deliver the entire thing end to end, ready to run as-is. Keep prose short and let the code carry the work.]';
  function hasForge(s) { return s && s.indexOf('CODE FORGE') !== -1; }
  var realFetch = window.fetch;
  window.fetch = function (input, init) {
    try {
      var url = (typeof input === 'string') ? input : ((input && input.url) || '');
      if (init && init.method === 'POST' && url.indexOf('https://text.pollinations.ai/openai') === 0 && init.body && typeof init.body === 'string') {
        var body = null;
        try { body = JSON.parse(init.body); } catch (e) { body = null; }
        if (body && Array.isArray(body.messages) && !body.__hl209) {
          var si = -1;
          for (var i = 0; i < body.messages.length; i++) { if (body.messages[i] && body.messages[i].role === 'system') { si = i; break; } }
          var msgs = body.messages.slice();
          if (si === -1) msgs.unshift({ role: 'system', content: FORGE });
          else if (!hasForge(msgs[si].content)) msgs[si] = Object.assign({}, msgs[si], { content: String(msgs[si].content) + '\n\n' + FORGE });
          body.__hl209 = 1; body.messages = msgs;
          init = Object.assign({}, init, { body: JSON.stringify(body) });
        }
      } else if (typeof url === 'string' && url.indexOf('https://text.pollinations.ai/') === 0 && url.indexOf('/openai') === -1) {
        var m = url.match(/^https:\/\/text\.pollinations\.ai\/([^?]+)(\?.*)$/);
        if (m) {
          var txt = decodeURIComponent(m[1]);
          if (!hasForge(txt)) {
            var np = (FORGE + '\n\n' + txt).slice(0, 1750);
            return realFetch.call(this, 'https://text.pollinations.ai/' + encodeURIComponent(np) + (m[2] || ''), init);
          }
        }
      }
    } catch (e) {}
    return realFetch.apply(this, arguments);
  };

  /* ---------------- 2) CONTEXT WINDOW ---------------- */
  var GOLDB = 'rgba(201,162,39,.6)';
  var panel = null, rowsEl = null, metaEl = null, chip = null, currentCode = '', lastSig = '', chatSeen = false;

  function mk(t, id, css) {
    var e = document.createElement(t);
    if (id) e.id = id;
    if (css) e.style.cssText = css;
    return e;
  }
  function build() {
    if (panel) return;
    panel = mk('div', 'hl209-win',
      'position:fixed;left:8px;right:8px;bottom:122px;height:min(62vh,520px);display:none;flex-direction:column;' +
      'background:#060503;border:1px solid ' + GOLDB + ';border-radius:16px;z-index:2147482995;overflow:hidden;' +
      'box-shadow:0 24px 60px rgba(0,0,0,.78),0 0 24px rgba(201,162,39,.12);' +
      'font-family:ui-monospace,Menlo,Consolas,monospace;color:#e8d48a;' +
      'background-image:repeating-linear-gradient(0deg,rgba(201,162,39,.035) 0 1px,transparent 1px 3px);');
    var hd = mk('div', 'hl209-hd',
      'display:flex;align-items:center;gap:8px;padding:10px 12px;flex:none;' +
      'background:linear-gradient(180deg,rgba(30,24,10,.95),rgba(10,9,4,.98));border-bottom:1px solid rgba(201,162,39,.35);');
    var dot = mk('span', '', 'width:8px;height:8px;border-radius:50%;background:#e8b429;flex:none;box-shadow:0 0 8px rgba(232,180,41,.8);animation:hl209pulse 1.4s infinite;');
    var st = document.createElement('style');
    st.textContent = '@keyframes hl209pulse{0%,100%{opacity:1}50%{opacity:.35}}';
    document.head.appendChild(st);
    var title = mk('span', '', 'font-weight:700;letter-spacing:.14em;font-size:11px;white-space:nowrap;');
    title.textContent = 'CONTEXT WINDOW';
    metaEl = mk('span', 'hl209-meta', 'font-size:9px;letter-spacing:.1em;color:rgba(232,212,138,.6);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;flex:1;');
    var cp = mk('button', 'hl209-copy',
      'flex:none;background:rgba(201,162,39,.16);border:1px solid rgba(201,162,39,.55);color:#e8d48a;font:700 9px/1 ui-monospace,monospace;letter-spacing:.12em;padding:6px 10px;border-radius:8px;cursor:pointer;');
    cp.textContent = 'COPY';
    cp.addEventListener('click', function () {
      try {
        var done = function () { metaEl.textContent = 'COPIED TO CLIPBOARD'; setTimeout(scanSoon, 1400); };
        if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(currentCode).then(done, function () { fb(); });
        else fb();
        function fb() {
          var ta = mk('textarea', '', 'position:fixed;left:-9999px;top:0;');
          ta.value = currentCode; document.body.appendChild(ta); ta.select();
          try { document.execCommand('copy'); done(); } catch (e) {}
          document.body.removeChild(ta);
        }
      } catch (e) {}
    });
    var cl = mk('button', 'hl209-close',
      'flex:none;background:transparent;border:1px solid rgba(201,162,39,.4);color:rgba(232,212,138,.75);font:700 9px/1 ui-monospace,monospace;letter-spacing:.12em;padding:6px 10px;border-radius:8px;cursor:pointer;');
    cl.textContent = 'CLOSE';
    cl.addEventListener('click', function () {
      panel.style.display = 'none';
      if (chip) chip.style.display = 'block';
    });
    hd.appendChild(dot); hd.appendChild(title); hd.appendChild(metaEl); hd.appendChild(cp); hd.appendChild(cl);
    rowsEl = mk('div', 'hl209-rows',
      'flex:1;overflow:auto;padding:10px 0 14px;-webkit-overflow-scrolling:touch;');
    panel.appendChild(hd); panel.appendChild(rowsEl);
    document.body.appendChild(panel);

    chip = mk('button', 'hl209-chip',
      'position:fixed;right:10px;bottom:128px;z-index:2147482994;display:none;background:linear-gradient(180deg,rgba(30,24,10,.95),rgba(10,9,4,.98));' +
      'border:1px solid ' + GOLDB + ';color:#e8d48a;font:700 10px/1 ui-monospace,monospace;letter-spacing:.12em;padding:9px 12px;border-radius:999px;box-shadow:0 10px 24px rgba(0,0,0,.6);');
    chip.textContent = '\u2318 CODE';
    chip.addEventListener('click', function () { panel.style.display = 'flex'; chip.style.display = 'none'; });
    document.body.appendChild(chip);
  }
  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
  function render(b) {
    build();
    currentCode = b.code;
    var lines = b.code.replace(/\t/g, '  ').split('\n');
    if (lines.length && lines[lines.length - 1] === '') lines.pop();
    var MAX = 900, n = Math.min(lines.length, MAX);
    var html = '';
    for (var i = 0; i < n; i++) {
      html += '<div style="display:flex;"><span style="width:44px;text-align:right;padding-right:10px;color:rgba(201,162,39,.4);flex:none;font-size:10px;line-height:1.55;user-select:none;">' + (i + 1) + '</span><span style="white-space:pre-wrap;word-break:break-word;color:#e8d48a;font-size:11px;line-height:1.55;flex:1;">' + esc(lines[i]) + '</span></div>';
    }
    if (lines.length > MAX) html += '<div style="color:rgba(232,212,138,.5);font-size:10px;padding:6px 0 0 54px;">… ' + (lines.length - MAX) + ' more lines</div>';
    rowsEl.innerHTML = html;
    rowsEl.scrollTop = 0;
    metaEl.textContent = (b.lang || 'code').toUpperCase() + ' · ' + lines.length + ' LINES · ' + b.code.length + ' CHARS';
  }
  function openWin() {
    if (!panel) return;
    panel.style.display = 'flex';
    if (chip) chip.style.display = 'none';
  }
  function blocksIn(txt) {
    var out = [], re = /```([a-zA-Z0-9+#._-]*)[ \t]*\n?([\s\S]*?)```/g, m;
    while ((m = re.exec(txt))) out.push({ lang: m[1] || '', code: m[2] });
    var fences = 0, idx = -1;
    var pos = txt.indexOf('```');
    while (pos !== -1) { fences++; idx = pos; pos = txt.indexOf('```', pos + 3); }
    if (fences % 2 === 1) {
      var tail = txt.slice(idx + 3);
      var lm = tail.match(/^([a-zA-Z0-9+#._-]*)[ \t]*\n?/);
      var code = tail.replace(/^([a-zA-Z0-9+#._-]*)[ \t]*\n?/, '');
      if (code.replace(/\s+/g, '').length > 24) out.push({ lang: (lm && lm[1]) || '', code: code });
    }
    return out;
  }
  function scanSoon() { try { scan(); } catch (e) {} }
  function scan() {
    var chat = document.getElementById('chat');
    if (!chat) return;
    var ls = chat.querySelectorAll('.line.imp .lbody');
    if (!ls.length) return;
    var txt = ls[ls.length - 1].textContent || '';
    var bs = blocksIn(txt);
    if (!bs.length) return;
    var b = bs[bs.length - 1];
    var sig = b.code.length + ':' + b.code.slice(0, 48) + ':' + b.code.slice(-48) + ':' + b.lang;
    if (sig === lastSig) return;
    lastSig = sig;
    render(b);
    openWin();
  }
  function attach() {
    var chat = document.getElementById('chat');
    if (!chat) { setTimeout(attach, 400); return; }
    if (chatSeen) return;
    chatSeen = true;
    var t = null;
    var mo = new MutationObserver(function () {
      if (t) clearTimeout(t);
      t = setTimeout(scan, 700);
    });
    mo.observe(chat, { childList: true, subtree: true, characterData: true });
    scan();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', attach);
  else attach();
})();

/* ILLUMINATI upgrade #282: hl282-plugins (v19.188)
   "make the website have all the plugins that chatgpt has" - the tools the
   site did not have yet, all free with no accounts:
   (1) /calc <expression>  - real calculator, exact math, no AI guessing.
   (2) /run <javascript>   - mini code lab: runs your JS and prints output.
   (3) /translate <language> <text> - free translation through the cloud brain.
   (4) /search <query>     - instant live facts from wikipedia + duckduckgo.
   Already built in: voice in/out, /image forge, long-term memory, file vault,
   camera, step reasoning, egos, live research (REA).
   Nothing removed. Guard: __HL282 */
(function () {
  if (window.__HL282) return; window.__HL282 = true;

  function say(cls, text) { try { if (typeof line === 'function') line(cls, text); } catch (e) {} }
  function tag(text) { try { if (typeof feed === 'function') feed(text, 'live'); } catch (e) {} }

  /* register in /help */
  try {
    if (typeof CMDS === 'object' && CMDS) {
      CMDS.calc = 'exact calculator (/calc 2+2*40)';
      CMDS.run = 'run javascript (/run 2+2)';
      CMDS.translate = 'translate (/translate spanish good night)';
      CMDS.search = 'quick live facts (/search niagara falls)';
    }
  } catch (e1) {}

  /* --- /calc: real math, no AI guessing --- */
  function calc(expr) {
    if (!/^[\d\s+\-*/().%^eE,]+$/.test(expr)) { say('omen r', 'calc does numbers only: /calc 2+2*40'); return; }
    try {
      var js = expr.replace(/\^/g, '**');
      var v = Function('"use strict"; return (' + js + ')')();
      if (typeof v !== 'number' || !isFinite(v)) { say('omen r', 'no clean number came back'); return; }
      var out = (Math.round(v * 1e10) / 1e10);
      say('omen', '= ' + out);
      tag('CALC :: ' + expr + ' = ' + out);
    } catch (e) { say('omen r', 'could not work that out - check the expression'); }
  }

  /* --- /run: mini code lab --- */
  function runCode(code) {
    if (!code || !code.trim()) { say('omen r', 'usage: /run console.log(1+1)'); return; }
    if (code.length > 2000) { say('omen r', 'keep the code under 2000 characters'); return; }
    var logs = [];
    var origLog = console.log, origErr = console.error;
    console.log = function () { var a = Array.prototype.slice.call(arguments).map(String); logs.push(a.join(' ')); };
    console.error = function () { var a = Array.prototype.slice.call(arguments).map(String); logs.push('ERR: ' + a.join(' ')); };
    var ret, err;
    try { ret = Function('"use strict";' + code)(); } catch (e) { err = String(e && e.message || e); }
    console.log = origLog; console.error = origErr;
    var out = [];
    if (logs.length) out.push(logs.join('\n'));
    if (ret !== undefined) out.push('=> ' + String(ret));
    if (err) out.push('ERROR: ' + err);
    say('omen', out.length ? out.join('\n') : '(ran, no output)');
    tag('CODE LAB RAN :: ' + code.slice(0, 60));
  }

  /* --- /translate: free through the cloud brain --- */
  function translate(rest) {
    var m = (rest || '').match(/^\s*([a-zA-Z+#\- ]+?)\s*[:|,]?\s+([\s\S]+)$/);
    if (!m) { say('omen r', 'usage: /translate spanish good night'); return; }
    var lang = m[1], text = m[2];
    say('omen', 'translating to ' + lang + '…');
    fetch('https://text.pollinations.ai/openai', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ model: 'openai-fast', private: true, messages: [
        { role: 'system', content: 'You are a translator. Output ONLY the translation of the text into ' + lang + '. No notes, no alternatives, nothing else.' },
        { role: 'user', content: text } ] })
    }).then(function (r) { return r.ok ? r.json() : Promise.reject(r.status); }).then(function (d) {
      var out = d && d.choices && d.choices[0] && d.choices[0].message && d.choices[0].message.content;
      say('omen', out && out.trim() ? out.trim() : 'no translation came back - try again in a few seconds');
      tag('TRANSLATED TO ' + lang.toUpperCase());
    })['catch'](function () { say('omen r', 'the free translator is rate-limited - try again in about 45 seconds'); });
  }

  /* --- /search: instant live facts --- */
  function search(q) {
    if (!q || !q.trim()) { say('omen r', 'usage: /search niagara falls'); return; }
    q = q.trim();
    say('omen', 'searching for "' + q + '"…');
    var found = false;
    var wu = 'https://en.wikipedia.org/api/rest_v1/page/summary/' + encodeURIComponent(q);
    fetch(wu).then(function (r) { return r.ok ? r.json() : null; }).then(function (d) {
      if (d && d.extract && (d.type === 'standard' || d.type === 'disambiguation')) {
        found = true;
        say('omen', (d.title ? d.title + ' - ' : '') + d.extract.slice(0, 700) + (d.extract.length > 700 ? '…' : '') + '\n(' + (d.content_urls && d.content_urls.desktop ? d.content_urls.desktop.page : 'wikipedia') + ')');
        tag('SEARCH HIT :: ' + q);
      }
    })['catch'](function () {});
    fetch('https://api.duckduckgo.com/?format=json&no_html=1&q=' + encodeURIComponent(q)).then(function (r) { return r.ok ? r.json() : null; }).then(function (d) {
      if (!found && d && (d.AbstractText || d.Answer)) {
        found = true;
        say('omen', (d.AbstractText || d.Answer).slice(0, 700) + (d.AbstractURL ? '\n(' + d.AbstractURL + ')' : ''));
        tag('SEARCH HIT :: ' + q);
      }
    })['catch'](function () {});
    setTimeout(function () { if (!found) say('omen r', 'no instant hit - ask the ai in normal chat, it researches live'); }, 6000);
  }

  /* --- intercept the four commands before the site's own handler --- */
  document.addEventListener('keydown', function (e) {
    try {
      var t = e.target;
      if (!t || t.id !== 'txt' || e.key !== 'Enter' || e.shiftKey) return;
      var v = (t.value || '').trim();
      var m = v.match(/^\/(calc|run|translate|search)\s*([\s\S]*)$/i);
      if (!m) return;
      e.preventDefault(); e.stopImmediatePropagation();
      var cmd = m[1].toLowerCase(), rest = (m[2] || '').trim();
      t.value = '';
      if (cmd === 'calc') calc(rest);
      else if (cmd === 'run') runCode(rest);
      else if (cmd === 'translate') translate(rest);
      else search(rest);
    } catch (e2) {}
  }, true);

  try { console.log('[hl282] plugins online: /calc /run /translate /search'); } catch (e3) {}
})();

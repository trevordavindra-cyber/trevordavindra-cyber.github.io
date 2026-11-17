/* ILLUMINATI upgrade #219: hl219-forgebite (v19.126)
   WHY OMNI STOPS CODING. In omni, the cloud relay answers first; when it is
   slow, the raw community forge (the Horde pool) takes the ask — and that
   pool is roleplay-tuned: it answers code asks in persona prose, not code,
   and its 512-token answer cap cuts long programs. Also, the older forge
   seam keeps only the FRONT of long plain-GET prompts, which slices the
   user's actual ask off the end. Three seams, additive only:
   1) CLOUD OVERRIDE — on every relay POST whose newest user ask asks for
      code, the system message gains a hard override: persona aside, answer
      with the COMPLETE working code in one fenced block, no planning
      chatter, no stubs, write it end to end.
   2) GET-TAIL KEEP — plain-GET relay prompts now keep the TAIL (the ask and
      the closing cue) instead of the front, with the forge directive on top.
   3) HORDE CODE MODE — when the backup pool gets a code ask, its prompt
      carries the same directive and its answer cap rises 512 to 1024
      tokens, so the fallback answers with code, not conversation.
   Nothing existing is removed. Guard: __HL219 */
(function () {
  if (window.__HL219) return; window.__HL219 = true;

  var CODEASK = /\b(code|codes|coding|script|function|program|game|app|website|webpage|web app|html|css|javascript|js|python|snippet|build me|code me|make me)\b/i;

  var OVERRIDE = '[FORGE OVERRIDE - CODE REQUEST] This request asks for code. Persona and style talk do not apply. Answer with the COMPLETE, WORKING code in one fenced code block (starting ``` and ending ```), from the first line to the last: no stubs, no placeholders, no "add your logic here", no truncation; if the program is long, keep writing until it is done. Do not narrate planning or reasoning: at most one short line before the code, nothing after it.';

  var HORDEDIR = '\n[SYSTEM DIRECTIVE - CODE] The request above asks for code. Ignore roleplay, persona and conversation style: reply with ONLY the complete, working code in one fenced code block (starting ``` and ending ```). No commentary before or after, no refusal, no placeholders, no stopping early: write the entire program end to end.\n';

  var DIRECT = '[CODE FORGE - ACTIVE] When the request asks for code, a website, an app, a tool, a script, a game, a bot or any program, answer with the FULL, WORKING, COMPLETE code in fenced code blocks. No placeholders, no stubs, no truncation: the entire thing end to end, ready to run as-is. Keep prose short and let the code carry the work.]';

  function lastUserIsCode(msgs) {
    for (var i = msgs.length - 1; i >= 0; i--) {
      var m = msgs[i];
      if (m && m.role === 'user') {
        if (typeof m.content !== 'string') return false;
        return CODEASK.test(m.content);
      }
    }
    return false;
  }

  function tailAsk(prompt) {
    var i = prompt.lastIndexOf('User: ');
    var t = i === -1 ? prompt : prompt.slice(i + 6);
    var j = t.indexOf('\n');
    if (j > -1) t = t.slice(0, j);
    return t;
  }

  var realFetch = window.fetch;
  window.fetch = function (input, init) {
    try {
      var url = (typeof input === 'string') ? input : ((input && input.url) || '');
      /* 1) CLOUD OVERRIDE on relay POSTs */
      if (init && init.method === 'POST' && url.indexOf('https://text.pollinations.ai/openai') === 0 && init.body && typeof init.body === 'string') {
        var body = null;
        try { body = JSON.parse(init.body); } catch (e) { body = null; }
        if (body && Array.isArray(body.messages) && !body.__hl219) {
          var hasRewrite = false;
          for (var r = 0; r < body.messages.length; r++) {
            var c = body.messages[r] && body.messages[r].content;
            if (typeof c === 'string' && c.indexOf('ANSWER TO REWRITE') > -1) { hasRewrite = true; break; }
          }
          if (!hasRewrite && lastUserIsCode(body.messages)) {
            var si = -1;
            for (var k = 0; k < body.messages.length; k++) { if (body.messages[k] && body.messages[k].role === 'system') { si = k; break; } }
            var msgs = body.messages.slice();
            if (si === -1) msgs.unshift({ role: 'system', content: OVERRIDE });
            else msgs[si] = Object.assign({}, msgs[si], { content: String(msgs[si].content) + '\n\n' + OVERRIDE });
            body.__hl219 = 1; body.messages = msgs;
            init = Object.assign({}, init, { body: JSON.stringify(body) });
          }
        }
      /* 3) HORDE CODE MODE on the backup pool */
      } else if (init && init.method === 'POST' && url.indexOf('https://aihorde.net/api/v2/generate/text/async') === 0 && init.body && typeof init.body === 'string') {
        var hb = null;
        try { hb = JSON.parse(init.body); } catch (e2) { hb = null; }
        if (hb && typeof hb.prompt === 'string' && !hb.__hl219 && CODEASK.test(tailAsk(hb.prompt))) {
          var idx = hb.prompt.lastIndexOf('User: ');
          hb.prompt = idx === -1 ? (hb.prompt + HORDEDIR) : (hb.prompt.slice(0, idx) + HORDEDIR + hb.prompt.slice(idx));
          hb.params = Object.assign({}, hb.params, { max_length: 1024 });
          hb.__hl219 = 1;
          init = Object.assign({}, init, { body: JSON.stringify(hb) });
        }
      /* 2) GET-TAIL KEEP on plain relay GETs */
      } else if (typeof url === 'string' && url.indexOf('https://text.pollinations.ai/') === 0 && url.indexOf('/openai') === -1) {
        var m = url.match(/^https:\/\/text\.pollinations\.ai\/([^?]+)(\?.*)?$/);
        if (m) {
          var txt = decodeURIComponent(m[1]);
          if (txt.indexOf('CODE FORGE') === -1) {
            var keep = 1750 - DIRECT.length - 16;
            var piece = txt.length > keep ? txt.slice(-keep) : txt;
            var np = (DIRECT + '\n\n' + piece).slice(0, 1750);
            return realFetch.call(this, 'https://text.pollinations.ai/' + encodeURIComponent(np) + (m[2] || ''), init);
          }
        }
      }
    } catch (e3) {}
    return realFetch.apply(this, arguments);
  };

  try { console.log('[hl219] online: code override on both brains + GET tail keep'); } catch (e4) {}
})();

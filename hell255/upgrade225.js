/* ILLUMINATI upgrade #225: hl225-gild (v19.128)
   THE QUALITY GILD. Every code answer that already carries the forge override
   also gets the gild: complete runnable code, every import included, no
   placeholders, errors handled, modern idioms, one fenced block. Additive on
   top of hl219; never touches non-code asks. Guard: __HL225 */
(function () {
  if (window.__HL225) return; window.__HL225 = true;
  var EXTRA = '\nQUALITY GILD: produce modern, complete, runnable code with every import included; never use placeholder comments or TODO stubs; handle the obvious error cases; keep the whole answer in ONE fenced code block; if the ask names a language, that language only.';
  var realFetch = window.fetch;
  window.fetch = function (input, init) {
    try {
      var url = (typeof input === 'string') ? input : ((input && input.url) || '');
      if (init && init.method === 'POST' && url.indexOf('https://text.pollinations.ai/openai') === 0 && init.body && typeof init.body === 'string') {
        var body = null;
        try { body = JSON.parse(init.body); } catch (e) { body = null; }
        if (body && Array.isArray(body.messages)) {
          var touched = false;
          for (var i = 0; i < body.messages.length; i++) {
            var m = body.messages[i];
            if (m && m.role === 'system' && typeof m.content === 'string' && m.content.indexOf('CODE FORGE') > -1 && m.content.indexOf('QUALITY GILD') === -1) { m.content += EXTRA; touched = true; }
          }
          if (touched) return realFetch.call(this, url, Object.assign({}, init, { body: JSON.stringify(body) }));
        }
      }
    } catch (e2) {}
    return realFetch.apply(this, arguments);
  };
  try { console.log('[hl225] online: quality gild on code answers'); } catch (e) {}
})();

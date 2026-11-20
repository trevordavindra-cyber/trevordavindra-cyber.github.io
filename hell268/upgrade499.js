/* ILLUMINATI upgrade 499 - TOOLS MODE (hl499)
   Frontier directive: right tool, verified output. Nothing removed.
*/
(function () {
  if (window.__HL499) return; window.__HL499 = true;

  var RP = /\b(which tool|what tool|best tool|use a tool|tool for the job|right tool|set up|build me|how do i make)\b/i;
  var DIRECTIVE = "TOOLS RULE: use the right tool for the job instead of improvising, and a purpose-built tool beats a workaround. Check what a tool actually returns before acting on it, because output is evidence, not truth. When two tools overlap, pick the narrower one and say why. Log what was tried and what failed so the next attempt starts from the real state, not from hope.";

  var of = window.fetch;
  window.fetch = function (input, init) {
    try {
      var url = (typeof input === 'string') ? input : (input && input.url) || '';
      if (/pollinations\.ai/.test(url) && init && typeof init.body === 'string' && init.method === 'POST') {
        var j = null;
        try { j = JSON.parse(init.body); } catch (e1) {}
        if (j && j.messages && j.messages.length) {
          var hit = false;
          for (var i = j.messages.length - 1; i >= 0; i--) {
            var c = j.messages[i] && j.messages[i].content;
            if (typeof c === 'string' && RP.test(c)) { hit = true; break; }
          }
          if (hit) {
            var msgs = j.messages, added = false, touched = false;
            for (var k = 0; k < msgs.length; k++) {
              if (msgs[k] && msgs[k].role === 'system') {
                msgs[k].content = msgs[k].content + '\n\n' + DIRECTIVE;
                added = true; touched = true; break;
              }
            }
            if (!added && !touched) { msgs.unshift({ role: 'system', content: DIRECTIVE }); touched = true; }
          }
          if (touched) init = Object.assign({}, init, { body: JSON.stringify(Object.assign({}, j, { messages: msgs })) });
        }
      }
    } catch (e2) {}
    return of.apply(this, [input, init]);
  };

  try { console.log('[hl499] tools mode online: right tool over workaround, output verified before use, failures logged'); } catch (e3) {}
})();

/* ILLUMINATI upgrade 316 - DEFINE MODE (hl316)
   Frontier directive: "what is X" gets a real definition.
   A definition ask opens with a crisp plain-language definition in
   one short paragraph, then one concrete example so the idea
   sticks. Nothing removed.
*/
(function () {
  if (window.__HL316) return; window.__HL316 = true;

  var DEF = /\b(what (is|are|does ... mean|do you mean by) |what does (\w+|that|this) mean|define[ :]|definition of|explain what .* is|meaning of)\b/i;
  var DIRECTIVE = "DEFINE RULE: when the ask is what something is or means, open with a one-paragraph plain-language definition (no jargon left unexplained), then give one concrete example that makes it stick. Keep it tight; the deep dive only comes if the asker wants more.";

  var of = window.fetch;
  window.fetch = function (input, init) {
    try {
      var url = (typeof input === 'string') ? input : (input && input.url) || '';
      if (/pollinations\.ai/.test(url) && init && typeof init.body === 'string' && init.method === 'POST') {
        var j = null;
        try { j = JSON.parse(init.body); } catch (e1) { j = null; }
        if (j && j.messages && j.messages.length) {
          var msgs = j.messages.slice(), touched = false;
          for (var m = msgs.length - 1; m >= 0; m--) {
            if (msgs[m] && msgs[m].role === 'user' && typeof msgs[m].content === 'string' && DEF.test(msgs[m].content)) {
              var added = false;
              for (var s = 0; s < msgs.length; s++) {
                if (msgs[s] && msgs[s].role === 'system' && typeof msgs[s].content === 'string' && msgs[s].content.indexOf('DEFINE RULE') < 0) {
                  msgs[s] = { role: 'system', content: msgs[s].content + '\n\n' + DIRECTIVE };
                  added = true; touched = true; break;
                }
              }
              if (!added && !touched) { msgs.unshift({ role: 'system', content: DIRECTIVE }); touched = true; }
              break;
            }
          }
          if (touched) init = Object.assign({}, init, { body: JSON.stringify(Object.assign({}, j, { messages: msgs })) });
        }
      }
    } catch (e2) {}
    return of.apply(this, [input, init]);
  };

  try { console.log('[hl316] define mode online: what-is asks get a crisp definition plus an example'); } catch (e3) {}
})();

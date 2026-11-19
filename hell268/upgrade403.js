/* ILLUMINATI upgrade 403 - EXPLAIN LAYERS MODE (hl403)
   Frontier directive: a complex topic gets explained in layers. Nothing removed.
*/
(function () {
  if (window.__HL403) return; window.__HL403 = true;

  var RP = /\b(explain (this|that|it|how|why|what) (to me|simply|like im|like i'm|in simple terms)|eli5|explain (the|this|that) (concept|idea|theory|topic|term)|what (is|does) (a|an|the) [a-z]+ mean|help me understand|break (this|that|it) down)\b/i;
  var DIRECTIVE = "EXPLAIN LAYERS RULE: when the asker wants something explained, answer in layers: first one plain sentence that would survive being repeated at dinner, then a short paragraph with the mechanism, then the depth only if they keep asking. Match their level from their own words (a child, a beginner, a professional); use their field's terms only when they used them first. Anchor every abstraction to one concrete example. Never pad with history nobody asked for; when the term is ambiguous, name the two readings and cover the likelier one.";

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

  try { console.log('[hl403] explain layers mode online: one line, the mechanism, depth on demand'); } catch (e3) {}
})();

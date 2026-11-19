/* ILLUMINATI upgrade 311 - HOW-TO MODE (hl311)
   Frontier directive: process asks get real numbered steps.
   "How do I", "how to", "walk me through" - the answer is a clean
   numbered list where each step is one action you can take, with
   pitfalls called out where they actually bite. Nothing removed.
*/
(function () {
  if (window.__HL311) return; window.__HL311 = true;

  var HOWTO = /\b(how (do|can|to|would) (i|we|you)|walk me through|step(s)? by step|steps to|guide me|tutorial|set ?up guide|instructions (for|to))\b/i;
  var DIRECTIVE = 'HOW-TO RULE: when the ask is how to do something, answer as a numbered list of steps, one action per step, in the order they happen. Flag the step where people usually get it wrong (common pitfall) right inside that step. No preamble before step 1.';

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
            if (msgs[m] && msgs[m].role === 'user' && typeof msgs[m].content === 'string' && HOWTO.test(msgs[m].content)) {
              var added = false;
              for (var s = 0; s < msgs.length; s++) {
                if (msgs[s] && msgs[s].role === 'system' && typeof msgs[s].content === 'string' && msgs[s].content.indexOf('HOW-TO RULE') < 0) {
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

  try { console.log('[hl311] how-to mode online: process asks get real numbered steps'); } catch (e3) {}
})();

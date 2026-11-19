/* ILLUMINATI upgrade 335 - OUTLINE MODE (hl335)
   Frontier directive: structure asks get a real outline.
   "Outline for my essay / how should I structure this talk" returns
   a hierarchical outline: numbered top sections, lettered sub-points,
   one line each. Nothing removed.
*/
(function () {
  if (window.__HL335) return; window.__HL335 = true;

  var OL = /\b(outline (for|of|my)|how (should|do) i (structure|organize|lay out)|structure (for|of|my)|sections for|how to (structure|organize) (a|an|my|the))\b/i;
  var DIRECTIVE = "OUTLINE RULE: when the ask is how to structure something, answer as a real hierarchical outline: numbered top-level sections, lettered sub-points under each, one line per item, then one line naming the single thing the structure must not miss. Keep it skimmable.";

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
            if (msgs[m] && msgs[m].role === 'user' && typeof msgs[m].content === 'string' && OL.test(msgs[m].content)) {
              var added = false;
              for (var s = 0; s < msgs.length; s++) {
                if (msgs[s] && msgs[s].role === 'system' && typeof msgs[s].content === 'string' && msgs[s].content.indexOf('OUTLINE RULE') < 0) {
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

  try { console.log('[hl335] outline mode online: structure asks get a real outline'); } catch (e3) {}
})();

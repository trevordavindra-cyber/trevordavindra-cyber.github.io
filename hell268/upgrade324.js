/* ILLUMINATI upgrade 324 - CHECKLIST MODE (hl324)
   Frontier directive: preparation asks get a real checklist.
   "What should I bring", "help me pack", "what do I need for X",
   a first-visit or prep ask gets a tight checkbox-ready list,
   grouped, with only what actually matters. Nothing removed.
*/
(function () {
  if (window.__HL324) return; window.__HL324 = true;

  var CL = /\b(what (should|do) i (bring|pack|need|get)|help me (pack|prepare|plan)|checklist (for|of)|packing list|shopping list|things to (bring|pack|buy)|first time (going|visiting|doing)|prep for|what to (bring|pack|expect))\b/i;
  var DIRECTIVE = "CHECKLIST RULE: when the ask is preparation (packing, shopping, a first visit, an event prep), answer with a tight checklist grouped by category, one item per line, only what actually matters. Flag the one or two items people most often forget.";

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
            if (msgs[m] && msgs[m].role === 'user' && typeof msgs[m].content === 'string' && CL.test(msgs[m].content)) {
              var added = false;
              for (var s = 0; s < msgs.length; s++) {
                if (msgs[s] && msgs[s].role === 'system' && typeof msgs[s].content === 'string' && msgs[s].content.indexOf('CHECKLIST RULE') < 0) {
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

  try { console.log('[hl324] checklist mode online: prep asks get a real checklist'); } catch (e3) {}
})();

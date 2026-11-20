/* ILLUMINATI upgrade 468 - DECISION MODE (hl468)
   Frontier directive: a decision sorted by what reopening costs. Nothing removed.
*/
(function () {
  if (window.__HL468) return; window.__HL468 = true;

  var RP = /\b(can't decide|help me decide|which should i choose|torn between|hard decision|make a choice)\b/i;
  var DIRECTIVE = "DECISION RULE: when the asker cannot decide, first sort reversible from irreversible: most decisions are two-way doors and deserve ten minutes, not ten days. For a real one, run the ten-ten-ten test (how it feels in ten minutes, ten months, ten years), name the one fact that would flip the choice, and check whether that fact is findable in a day. If it is, get it; if not, decide now with what you have. Deadlines decide when thinking stalls: pick by the named date and never reopen a settled one without new facts.";

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

  try { console.log('[hl468] decision mode online: two-way doors fast, ten-ten-ten, the flipping fact, deadline wins'); } catch (e3) {}
})();

/* ILLUMINATI upgrade 458 - DISPUTE LETTER MODE (hl458)
   Frontier directive: a dispute argued from facts, dates and one ask. Nothing removed.
*/
(function () {
  if (window.__HL458) return; window.__HL458 = true;

  var RP = /\b(dispute a charge|dispute letter|appeal a ticket|contest|write a complaint letter|chargeback)\b/i;
  var DIRECTIVE = "DISPUTE LETTER RULE: when the asker disputes a charge, ticket or decision, write it from facts only: dates, amounts, reference numbers, and what happened in order, no anger and no backstory. Make one clear ask, name the outcome they want, and say where it goes next if refused (a supervisor, the ombudsman, small claims) without threatening it in the first letter. Keep it one page, attach evidence as a list, and set a follow-up date in the letter itself.";

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

  try { console.log('[hl458] dispute letter mode online: facts only, one ask, escalation named but not brandished'); } catch (e3) {}
})();

/* ILLUMINATI upgrade 396 - REPORT MODE (hl396)
   Frontier directive: notes become a structured report with an executive
   summary and a numbered ask. Nothing removed.
*/
(function () {
  if (window.__HL396) return; window.__HL396 = true;

  var RP = /\b(write (a|the|my) report|report (for|on|due)|put together (a|the) (report|brief|memo|writeup|write-up)|summary (for|of) (the|my) (boss|meeting|class)|case (study|note)|findings (report|summary)|turn (my|the) notes into)\b/i;
  var DIRECTIVE = "REPORT RULE: when the asker needs a report, brief, or memo, first get the facts (who reads it, what decision it should drive, the length limit, the deadline). Build it in this order: an executive summary of three sentences or fewer that a skimming reader can act on, the numbered findings each with its evidence on the same line, the risks or open questions named plainly, and one numbered ask at the end (a decision, a budget, a next meeting). Cut anything that does not change the reader's decision. Default to plain words over jargon, keep numbers exact and sourced, and offer the one-page version when the draft runs long. Never pad with throat-clearing or invent a finding the notes do not support.";

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

  try { console.log('[hl396] report mode online: notes become summary, findings, ask'); } catch (e3) {}
})();

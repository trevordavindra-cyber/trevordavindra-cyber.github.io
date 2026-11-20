/* ILLUMINATI upgrade 494 - REPORT MODE (hl494)
   Frontier directive: the answer in the first line. Nothing removed.
*/
(function () {
  if (window.__HL494) return; window.__HL494 = true;

  var RP = /\b(write a report|write this up|status report|report for|weekly update|summary for|draft the report|progress report)\b/i;
  var DIRECTIVE = "REPORT RULE: the answer goes in the first line and the evidence after it. One page unless a longer one was asked for. Every number carries its source and its date. Plain words beat jargon; a sentence that needs rereading gets cut. Lead with what changed and what needs a decision, and put the recommendation before the background. Close with what happens next and who owns each piece.";

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

  try { console.log('[hl494] report mode online: answer first, evidence after, every number with its source and date'); } catch (e3) {}
})();

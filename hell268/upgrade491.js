/* ILLUMINATI upgrade 491 - SAVING MONEY MODE (hl491)
   Frontier directive: pay the future self first. Nothing removed.
*/
(function () {
  if (window.__HL491) return; window.__HL491 = true;

  var RP = /\b(save money|saving money|savings|budget|spend less|money habits|emergency fund|paycheck)\b/i;
  var DIRECTIVE = "SAVING RULE: when the asker wants to save money, move the savings on payday before any spending happens; money left over at the end of the month never gets saved. Build one month of expenses as a buffer before anything else. Wait seventy-two hours on any want past a set price before buying it. Once a quarter, cancel every unused subscription and price what a small daily habit costs across a year. Name what the money is for; a named goal survives a boring month.";

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

  try { console.log('[hl491] saving money mode online: payday moves the money first, buffer one month, seventy-two hours on wants'); } catch (e3) {}
})();

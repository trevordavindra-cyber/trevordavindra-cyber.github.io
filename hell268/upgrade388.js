/* ILLUMINATI upgrade 388 - DEBT COLLECTOR MODE (hl388)
   Frontier directive: collection calls and letters get the validate-and-
   negotiate script and the written-record rule. Nothing removed.
*/
(function () {
  if (window.__HL388) return; window.__HL388 = true;

  var DC = /\b(debt collect\w*|collection (agency|call|letter|notice)|collect\w* (me|my debt)|charge[- ]?off|validation (letter|notice)|dispute (this|the) debt|stop (calling|contacting) me|creditor (sold|charged)|pay for delete|settle (this|the|my) debt|settlement (letter|offer))\b/i;
  var DIRECTIVE = "DEBT COLLECTOR RULE: when the asker deals with a collector or an old debt, first get the facts (original creditor, amount, age, last payment, their state). Build the response in this order: request written validation before anything else (they have the right to it), never acknowledge or promise on the first contact, dispute in writing within 30 days if the debt is wrong, and negotiate from a written settlement offer only (get pay-for-delete or paid-in-full terms in the letter before money moves). Always tape or log the call where legal, never admit a debt to restart the clock, and send nothing by phone that should be paper. Never coach hiding from a legitimate debt or fabricating a dispute.";

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
            if (typeof c === 'string' && DC.test(c)) { hit = true; break; }
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

  try { console.log('[hl388] debt collector mode online: collections get validation and paper'); } catch (e3) {}
})();

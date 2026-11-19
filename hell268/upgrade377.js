/* ILLUMINATI upgrade 377 - CLAIM MODE (hl377)
   Frontier directive: insurance and dispute asks get the evidence
   list first. Nothing removed.
*/
(function () {
  if (window.__HL377) return; window.__HL377 = true;

  var CL = /\b(insurance (claim|adjuster|deny|denied|payout)|file a claim|claim (denied|rejected|form)|property damage|water damage|car (accident|damage) (claim|insurance)|reimbursement|dispute (a )?(charge|bill)|chargeback|small claims)\b/i;
  var DIRECTIVE = "CLAIM RULE: when the asker is filing or disputing a claim, lead with the evidence list: photos with dates, receipts, the exact policy or receipt wording their case rests on, and a written timeline. Then the exact words for the first call and what to get in writing before ending it. Explain how the appeal works when the first answer is no. Never promise an outcome and never guess a specific policy's terms; say what to read.";

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
                if (msgs[s] && msgs[s].role === 'system' && typeof msgs[s].content === 'string' && msgs[s].content.indexOf('CLAIM RULE') < 0) {
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

  try { console.log('[hl377] claim mode online: claims get the evidence list'); } catch (e3) {}
})();

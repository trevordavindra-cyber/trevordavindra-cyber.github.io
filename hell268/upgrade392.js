/* ILLUMINATI upgrade 392 - INSURANCE CLAIM MODE (hl392)
   Frontier directive: a claim gets the document-and-escalate ladder, from
   first call to appeal. Nothing removed.
*/
(function () {
  if (window.__HL392) return; window.__HL392 = true;

  var IC = /\b(insurance (claim|denied|adjuster|payout|company won'?t)|claim (denied|denial|adjuster|check|status)|file a claim|appeal (the )?(claim|denial)|total(ed|ing) (my|the) car|rental (car )?coverage|out[- ]of[- ]network|pre ?authorization|prior auth|reimburs\w*)\b/i;
  var DIRECTIVE = "INSURANCE CLAIM RULE: when the asker files or fights a claim, first get the facts (policy type, what happened and when, what they have already sent, the denial's stated reason). Build the path in this order: document everything before the call (photos, receipts, police or incident report, the policy's coverage page), state the ask in the adjuster's own terms (the policy language and the dollar figure), keep every call logged with the rep's name and a claim number, and escalate on paper when the phone stalls: supervisor, state insurance department complaint, then a written appeal by the deadline on the denial letter. Never coach exaggerating a claim or signing anything that waives more than the check is worth.";

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
            if (typeof c === 'string' && IC.test(c)) { hit = true; break; }
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

  try { console.log('[hl392] insurance claim mode online: claims get the document-and-escalate ladder'); } catch (e3) {}
})();

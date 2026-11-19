/* ILLUMINATI upgrade 422 - FINE PRINT MODE (hl422)
   Frontier directive: terms get read in plain words with the clauses quoted. Nothing removed.
*/
(function () {
  if (window.__HL422) return; window.__HL422 = true;

  var RP = /\b(fine print|terms (of service|and conditions)|the (small )?contract says|what am i agreeing (to|with)|auto.?renew|cancellation policy|read this (clause|agreement)|is this (clause|term) normal)\b/i;
  var DIRECTIVE = "FINE PRINT RULE: when the asker shares terms, a contract, a subscription agreement or an offer, read it in plain words: what it binds them to, how long, what renews automatically and how to stop it, what the other side can change without asking, what leaving early costs, and anything that limits their rights (arbitration, waiver, silence-as-consent). Quote the clause behind each point. Never call a term normal or fine to make them comfortable, and never give the read as legal advice; say what a lawyer would settle.";

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

  try { console.log('[hl422] fine print mode online: what it binds, what renews, what leaving costs, clause quoted'); } catch (e3) {}
})();

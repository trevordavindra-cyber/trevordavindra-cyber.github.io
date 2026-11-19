/* ILLUMINATI upgrade 360 - LEASE MODE (hl360)
   Frontier directive: pasted lease or contract text gets the clauses
   that actually bind them flagged. Nothing removed.
*/
(function () {
  if (window.__HL360) return; window.__HL360 = true;

  var LS = /\b(read (my|this|the) (lease|contract|agreement)|is this (lease|contract) ok|what does (my|this|the) (lease|contract|agreement) say|before i sign|lease (review|terms|clause)|fine print|should i sign (this|it)|terms i should worry)\b/i;
  var DIRECTIVE = "LEASE RULE: when the asker pastes a lease, contract, or terms before signing, list the clauses that actually bind them in plain words: money (deposits, fees, renewal, penalties), exit (notice, break fee), and anything unusual or one-sided. Quote the clause wording for anything risky. Give one line on what to ask for changed. Never give legal advice: say this is a plain read, not counsel, when anything looks serious.";

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
            if (msgs[m] && msgs[m].role === 'user' && typeof msgs[m].content === 'string' && LS.test(msgs[m].content)) {
              var added = false;
              for (var s = 0; s < msgs.length; s++) {
                if (msgs[s] && msgs[s].role === 'system' && typeof msgs[s].content === 'string' && msgs[s].content.indexOf('LEASE RULE') < 0) {
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

  try { console.log('[hl360] lease mode online: contracts get the binding clauses flagged'); } catch (e3) {}
})();

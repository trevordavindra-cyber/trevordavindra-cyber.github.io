/* ILLUMINATI upgrade 372 - BREACH MODE (hl372)
   Frontier directive: compromise and scam asks get immediate steps
   in order. Nothing removed.
*/
(function () {
  if (window.__HL372) return; window.__HL372 = true;

  var BR = /\b(hacked|breach(ed)?|data (leak|breach)|my (account|email|password) (was |got )?(hacked|compromised|stolen)|suspicious (email|text|login|activity|charge)|phishing|scam(med)?|someone (has|got) (my|access to) (account|password)|identity theft|fraud(ulent)? (charge|alert)|I clicked (a|the) (link|attachment))\b/i;
  var DIRECTIVE = "BREACH RULE: when the asker suspects an account is compromised or they clicked something bad, give immediate steps in order: change that password first, then anywhere the password was reused, turn on two-factor, check sent items and linked apps, and what to report and to whom. If they clicked a link but entered nothing, say what actually matters. Never demand details beyond what the steps need, and never shame the click.";

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
            if (msgs[m] && msgs[m].role === 'user' && typeof msgs[m].content === 'string' && BR.test(msgs[m].content)) {
              var added = false;
              for (var s = 0; s < msgs.length; s++) {
                if (msgs[s] && msgs[s].role === 'system' && typeof msgs[s].content === 'string' && msgs[s].content.indexOf('BREACH RULE') < 0) {
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

  try { console.log('[hl372] breach mode online: compromise gets steps in order'); } catch (e3) {}
})();

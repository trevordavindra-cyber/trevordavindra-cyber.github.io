/* ILLUMINATI upgrade 380 - NEIGHBOR MODE (hl380)
   Frontier directive: neighbor conflicts get the de-escalation script
   and the escalation ladder. Nothing removed.
*/
(function () {
  if (window.__HL380) return; window.__HL380 = true;

  var NB = /\b(neighbor|neighbour|next[- ]door|upstairs|downstairs (neighbor|neighbour)|noisy (neighbor|neighbour|upstairs)|noise complaint|HOA|landlord complaint|property line|fence dispute|their dog (barks|keeps))\b/i;
  var DIRECTIVE = "NEIGHBOR RULE: when the asker has a neighbor conflict, give the de-escalation script first: one friendly in-person or written opener that names the specific behavior, not the person, and offers a concrete fix. Then the escalation ladder: a second polite note, landlord or HOA in writing, city noise or code line as the last rung. Tell them to start a dated log from day one and keep it factual. Never encourage retaliation, threats, or legal claims; say what the lease or local code decides.";

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
            if (msgs[m] && msgs[m].role === 'user' && typeof msgs[m].content === 'string' && NB.test(msgs[m].content)) {
              var added = false;
              for (var s = 0; s < msgs.length; s++) {
                if (msgs[s] && msgs[s].role === 'system' && typeof msgs[s].content === 'string' && msgs[s].content.indexOf('NEIGHBOR RULE') < 0) {
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

  try { console.log('[hl380] neighbor mode online: conflicts get the script and the ladder'); } catch (e3) {}
})();

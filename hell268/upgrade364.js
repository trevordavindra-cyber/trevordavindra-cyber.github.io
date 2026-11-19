/* ILLUMINATI upgrade 364 - MOVING MODE (hl364)
   Frontier directive: moving asks get an order of operations with
   dates that matter. Nothing removed.
*/
(function () {
  if (window.__HL364) return; window.__HL364 = true;

  var MV = /\b(moving (out|in|day|apartments?|houses?)|move (out|in|into)|new (apartment|place|lease)|landlord (notice|inspection)|movers? (quote|cost|book)|packing (tips|list|boxes)|change (my|the) address|utility (setup|transfer|deposit))\b/i;
  var DIRECTIVE = "MOVING RULE: when the asker is moving, give the order of operations with the deadlines that actually bite (landlord notice, utility switch, address changes, mover booking lead time), a packing sequence that keeps the first night liveable, and the two costs people forget (utility deposits and the last-month overlap). Use their dates when they gave them; say what needs booking first. No generic pep talk.";

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
            if (msgs[m] && msgs[m].role === 'user' && typeof msgs[m].content === 'string' && MV.test(msgs[m].content)) {
              var added = false;
              for (var s = 0; s < msgs.length; s++) {
                if (msgs[s] && msgs[s].role === 'system' && typeof msgs[s].content === 'string' && msgs[s].content.indexOf('MOVING RULE') < 0) {
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

  try { console.log('[hl364] moving mode online: moves get the deadlines that bite'); } catch (e3) {}
})();

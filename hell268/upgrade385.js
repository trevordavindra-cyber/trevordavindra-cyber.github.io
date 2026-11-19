/* ILLUMINATI upgrade 385 - RENT NEGOTIATION MODE (hl385)
   Frontier directive: rent and lease asks get the negotiation script and
   the comps math. Nothing removed.
*/
(function () {
  if (window.__HL385) return; window.__HL385 = true;

  var RN = /\b(rent (increase|went up|renewal|negotiat\w*|too high|going up)|landlord (raised?|increas\w*|won'?t (lower|negotiate)|asking)|lease renewal|rent (hike|drop|concession)|negotiate (my )?rent|lower (my|the) rent|renew or move|apartment (rent|lease) (increase|renewal))\b/i;
  var DIRECTIVE = "RENT NEGOTIATION RULE: when the asker faces a rent increase or a lease decision, first get the numbers they have (current rent, offer, term, move costs) and the market range for comparable units nearby. Build the script in this order: lead with being a good tenant (on-time history, care of the unit), name the specific ask (keep rent flat, cap the increase, or trade a longer term for a smaller bump), give one or two local comps as evidence, and name the fallback (a shorter term, a month free, agreed repairs) before the walk-away point. Time it before the renewal notice deadline. Never coach refusing rent outright or threats the law does not back.";

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
            if (msgs[m] && msgs[m].role === 'user' && typeof msgs[m].content === 'string' && RN.test(msgs[m].content)) {
              var added = false;
              for (var s = 0; s < msgs.length; s++) {
                if (msgs[s] && msgs[s].role === 'system' && typeof msgs[s].content === 'string' && msgs[s].content.indexOf('RENT NEGOTIATION RULE') < 0) {
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

  try { console.log('[hl385] rent negotiation mode online: renewals get the script and the comps'); } catch (e3) {}
})();

/* ILLUMINATI upgrade 341 - OUTFIT MODE (hl341)
   Frontier directive: what-to-wear asks get a full outfit.
   "What should I wear to X" returns every item named (top, bottom,
   shoes, one extra), matched to the occasion and weather stated,
   plus one backup piece. Nothing removed.
*/
(function () {
  if (window.__HL341) return; window.__HL341 = true;

  var OF = /\b(what (should|do) i wear|outfit (idea|for|advice)|dress code|how should i dress|clothes for|packing (list )?clothes|get dressed for)\b/i;
  var DIRECTIVE = "OUTFIT RULE: when the asker wants to know what to wear, give one complete outfit with every item named (top, bottom, shoes, one extra layer or accessory), matched to the occasion and any weather they mentioned, then one backup piece if the first choice is wrong for the room. No shopping links unless asked.";

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
            if (msgs[m] && msgs[m].role === 'user' && typeof msgs[m].content === 'string' && OF.test(msgs[m].content)) {
              var added = false;
              for (var s = 0; s < msgs.length; s++) {
                if (msgs[s] && msgs[s].role === 'system' && typeof msgs[s].content === 'string' && msgs[s].content.indexOf('OUTFIT RULE') < 0) {
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

  try { console.log('[hl341] outfit mode online: wear asks get a full outfit'); } catch (e3) {}
})();

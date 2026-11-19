/* ILLUMINATI upgrade 349 - WORST CASE MODE (hl349)
   Frontier directive: what-if-it-goes-wrong asks get the real
   failure points and a fallback plan. Nothing removed.
*/
(function () {
  if (window.__HL349) return; window.__HL349 = true;

  var WC = /\b(what if (it|this|that|things) (goes|go|turns) (wrong|bad|south)|worst case|worst[- ]case|plan b|backup plan|if (it|this) fails|what could go wrong|failsafe|contingency)\b/i;
  var DIRECTIVE = "WORST CASE RULE: when the asker asks what happens if something goes wrong, name the two or three likeliest failure points in order of likelihood, give a concrete fallback for each, and say which failure would be unrecoverable so they know what actually needs preventing. No reassurance padding.";

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
            if (msgs[m] && msgs[m].role === 'user' && typeof msgs[m].content === 'string' && WC.test(msgs[m].content)) {
              var added = false;
              for (var s = 0; s < msgs.length; s++) {
                if (msgs[s] && msgs[s].role === 'system' && typeof msgs[s].content === 'string' && msgs[s].content.indexOf('WORST CASE RULE') < 0) {
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

  try { console.log('[hl349] worst case mode online: failure asks get fallbacks'); } catch (e3) {}
})();

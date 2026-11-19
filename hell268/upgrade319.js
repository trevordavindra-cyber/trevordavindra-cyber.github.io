/* ILLUMINATI upgrade 319 - CAUTION MODE (hl319)
   Frontier directive: high-stakes asks get one honest caution line.
   Medical, legal, money and safety asks open with a single short
   line that this is general information, not professional advice,
   then answer normally. No certainty language. Nothing removed.
*/
(function () {
  if (window.__HL319) return; window.__HL319 = true;

  var RISK = /\b(my (symptoms|illness|pain|medication|dose)|should i take|medical advice|diagnos\w*|is it safe|legal advice|sue|lawsuit|court|contract (says|terms)|should i (invest|buy|sell|loan|borrow)|invest\w*|stock|crypto|retirement|tax\w*|debt|loan|insurance claim)\b/i;
  var DIRECTIVE = "CAUTION RULE: when the ask touches health, law, money or safety, open with one short line saying this is general information and not professional advice, then answer normally and plainly. Never speak with false certainty about dose, legal outcomes or financial returns.";

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
            if (msgs[m] && msgs[m].role === 'user' && typeof msgs[m].content === 'string' && RISK.test(msgs[m].content)) {
              var added = false;
              for (var s = 0; s < msgs.length; s++) {
                if (msgs[s] && msgs[s].role === 'system' && typeof msgs[s].content === 'string' && msgs[s].content.indexOf('CAUTION RULE') < 0) {
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

  try { console.log('[hl319] caution mode online: health, law and money asks carry one honest caution line'); } catch (e3) {}
})();

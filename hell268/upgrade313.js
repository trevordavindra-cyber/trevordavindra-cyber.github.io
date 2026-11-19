/* ILLUMINATI upgrade 313 - COMPARE MODE (hl313)
   Frontier directive: comparison asks get a real side-by-side.
   "X vs Y", "compare", "which is better", "difference between" -
   the answer lays out the points that actually differ, then picks
   one with a one-line why. Nothing removed.
*/
(function () {
  if (window.__HL313) return; window.__HL313 = true;

  var CMP = /\b(vs\.?|versus|compare (x|a|b|these|the two|them)|comparison between|which (one )?is better|which (should|to) (i|pick|choose)|difference between|better (than|of the two)|or (is )?(the other one )?better)\b/i;
  var DIRECTIVE = 'COMPARE RULE: when the ask compares two or more things, answer as a short list of the points where they actually differ (one point per line, both sides shown), then end with a verdict: "pick: X" plus a one-line reason. No fence-sitting. If the choice truly depends on the asker, name the one fact that decides it.';

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
            if (msgs[m] && msgs[m].role === 'user' && typeof msgs[m].content === 'string' && CMP.test(msgs[m].content)) {
              var added = false;
              for (var s = 0; s < msgs.length; s++) {
                if (msgs[s] && msgs[s].role === 'system' && typeof msgs[s].content === 'string' && msgs[s].content.indexOf('COMPARE RULE') < 0) {
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

  try { console.log('[hl313] compare mode online: comparisons get side-by-side points and a verdict'); } catch (e3) {}
})();

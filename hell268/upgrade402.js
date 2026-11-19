/* ILLUMINATI upgrade 402 - PLAN B MODE (hl402)
   Frontier directive: a plan gets its failure points and fallbacks. Nothing removed.
*/
(function () {
  if (window.__HL402) return; window.__HL402 = true;

  var RP = /\b(what if (it|this|that) (fails|doesnt|doesn't work|goes wrong)|plan b|backup plan|contingency|worst case scenario|what could go wrong|if (this|that) (falls through|doesnt work out)|risks of (this|that) plan)\b/i;
  var DIRECTIVE = "PLAN B RULE: when the asker shares a plan and asks what could go wrong, name the two or three likeliest failure points in order of likelihood, give one concrete fallback for each, and mark which failure is unrecoverable so it deserves prevention over a plan b. Name the tripwire: the moment during the plan when switching to the fallback stops being cheap. No catastrophe lists, no hedging every sentence; never invent odds or prices.";

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

  try { console.log('[hl402] plan b mode online: failure points, fallbacks, the tripwire'); } catch (e3) {}
})();

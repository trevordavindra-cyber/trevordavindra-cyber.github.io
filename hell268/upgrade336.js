/* ILLUMINATI upgrade 336 - BUDGET MODE (hl336)
   Frontier directive: money-planning asks get a real numbered plan.
   "Budget for a $2000/month income" returns a line-by-line
   breakdown that adds to the total, then one saving tip. Nothing removed.
*/
(function () {
  if (window.__HL336) return; window.__HL336 = true;

  var BG = /\b(budget (for|of|my)|how (do|can) i (budget|save|afford)|monthly (budget|plan|spending)|how much should i (save|spend)|savings plan|money plan)\b/i;
  var DIRECTIVE = "BUDGET RULE: when the ask is about budgeting or saving, answer as a line-by-line plan (category then amount), make the amounts add up to the total the asker gave and say so, then one concrete tip that would free up real money. If no income or total is given, show a percentage split instead. Plain numbers, no products to buy.";

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
            if (msgs[m] && msgs[m].role === 'user' && typeof msgs[m].content === 'string' && BG.test(msgs[m].content)) {
              var added = false;
              for (var s = 0; s < msgs.length; s++) {
                if (msgs[s] && msgs[s].role === 'system' && typeof msgs[s].content === 'string' && msgs[s].content.indexOf('BUDGET RULE') < 0) {
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

  try { console.log('[hl336] budget mode online: money-planning asks get a numbered plan'); } catch (e3) {}
})();

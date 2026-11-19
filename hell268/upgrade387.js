/* ILLUMINATI upgrade 387 - BUDGET RESET MODE (hl387)
   Frontier directive: money stress gets the concrete reset plan, one
   number to watch. Nothing removed.
*/
(function () {
  if (window.__HL387) return; window.__HL387 = true;

  var BR = /\b(budget|broke|overspent|can'?t (afford|save)|money (stress|worried|tight|trouble)|bills (piling|overdue|too much)|need to save|spending (too much|problem)|paycheck to paycheck|debt (payoff|snowball|stress)|credit card (debt|balance|minimum)|cut (my )?expenses)\b/i;
  var DIRECTIVE = "BUDGET RESET RULE: when the asker is stressed about money, skip the shame and build the reset in this order: list every fixed cost with its due date, mark the four walls first (housing, utilities, food, transport), then name the three biggest cuts that hurt least, then order debts by interest rate with minimums paid on all and extra on the highest. Give one weekly number to watch (what is left for food and fun) and one date to re-check. Build a one-month starter emergency fund before extra debt payments. Never recommend payday loans, never shame the spending, and anything beyond a plan (a loan, a consolidation product) gets pointed to a fee-free source or a nonprofit counselor, not sold.";

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
                if (msgs[s] && msgs[s].role === 'system' && typeof msgs[s].content === 'string' && msgs[s].content.indexOf('BUDGET RESET RULE') < 0) {
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

  try { console.log('[hl387] budget reset mode online: money stress gets the plan and the number'); } catch (e3) {}
})();

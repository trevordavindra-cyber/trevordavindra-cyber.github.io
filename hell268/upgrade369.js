/* ILLUMINATI upgrade 369 - RETURN MODE (hl369)
   Frontier directive: return and refund asks get the deadline and
   the exact words. Nothing removed.
*/
(function () {
  if (window.__HL369) return; window.__HL369 = true;

  var RT = /\b(return (it|this|the item|policy)|refund (me|my|policy|track)|send (it|this) back|exchange (it|this)|didn'?t fit|arrived (broken|damaged|wrong)|wrong (item|size|color)|money back|chargeback|dispute (the|this) charge|return (window|label))\b/i;
  var DIRECTIVE = "RETURN RULE: when the asker wants to return or refund something, give the deadline math from their order date when they shared it, the exact words to send the seller or paste into the return chat (item, order number placeholder, what they want: refund, exchange, or replacement), and how the refund typically lands and when. Flag final-sale and worn-out-of-return-window cases honestly instead of promising a win.";

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
            if (msgs[m] && msgs[m].role === 'user' && typeof msgs[m].content === 'string' && RT.test(msgs[m].content)) {
              var added = false;
              for (var s = 0; s < msgs.length; s++) {
                if (msgs[s] && msgs[s].role === 'system' && typeof msgs[s].content === 'string' && msgs[s].content.indexOf('RETURN RULE') < 0) {
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

  try { console.log('[hl369] return mode online: returns get the deadline and exact words'); } catch (e3) {}
})();

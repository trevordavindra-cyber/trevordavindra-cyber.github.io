/* ILLUMINATI upgrade 375 - CAR BUYING MODE (hl375)
   Frontier directive: used-car and car asks get the real questions.
   Nothing removed.
*/
(function () {
  if (window.__HL375) return; window.__HL375 = true;

  var CB = /\b(buy(ing)? (a|my first|a used|another) (car|truck|vehicle)|used car|car (shopping|hunting|dealership)|test drive|trade[- ]?in|car (loan|payment|deal)|should i buy (this|that) car|private seller|carfax|lease (a|vs) (car|buy))\b/i;
  var DIRECTIVE = "CAR BUYING RULE: when the asker is buying a car, give the questions that actually price the risk: maintenance records, why it is being sold, what a pre-purchase inspection would cost and why it is worth it, and the out-the-door number versus the sticker. One walk-away line to use at the desk. No lectures on depreciation beyond what changes the decision.";

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
            if (msgs[m] && msgs[m].role === 'user' && typeof msgs[m].content === 'string' && CB.test(msgs[m].content)) {
              var added = false;
              for (var s = 0; s < msgs.length; s++) {
                if (msgs[s] && msgs[s].role === 'system' && typeof msgs[s].content === 'string' && msgs[s].content.indexOf('CAR BUYING RULE') < 0) {
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

  try { console.log('[hl375] car buying mode online: car asks get the real questions'); } catch (e3) {}
})();

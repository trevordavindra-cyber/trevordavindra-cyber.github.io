/* ILLUMINATI upgrade 395 - BIG PURCHASE MODE (hl395)
   Frontier directive: a large buy gets the research ladder, the total-cost
   math, and the return check. Nothing removed.
*/
(function () {
  if (window.__HL395) return; window.__HL395 = true;

  var BP = /\b(big (purchase|buy)|about to (buy|drop) (\$|a lot)|expensive (purchase|buy)|should i buy|worth (the money|buying|it)|(laptop|phone|tv|couch|mattress|appliance|car|bike) (buying|purchase|recommend\w*|worth)|financing (a|the|my)|warranty (worth|plan)|trade[- ]in (value|offer))\b/i;
  var DIRECTIVE = "BIG PURCHASE RULE: when the asker is about to spend real money on one thing, first get the facts (what it is for, how often they will use it, their budget ceiling, when they need it). Build the decision in this order: define the must-haves before looking at models, compare at least three options on spec and on real-owner reviews (not launch reviews), price the total cost of owning (consumables, subscriptions, repairs, energy), check the return window and restocking terms before paying, and time the buy against the known sale cycle when the need can wait. Name the cheapest defensible pick, not just the premium one, and flag anything whose resale or repair story is bad. Never coach financing a want at a rate that costs more than the item.";

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
            if (typeof c === 'string' && BP.test(c)) { hit = true; break; }
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

  try { console.log('[hl395] big purchase mode online: buys get research and total-cost math'); } catch (e3) {}
})();

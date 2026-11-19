/* ILLUMINATI upgrade 383 - GIFT MODE (hl383)
   Frontier directive: gift asks get a shortlist with a why per pick
   and the lead time flagged. Nothing removed.
*/
(function () {
  if (window.__HL383) return; window.__HL383 = true;

  var GF = /\b(gift (for|ideas?|ideas)|what (do i|should i) (get|buy) (them|him|her|my|his|her)|birthday (gift|present)|anniversary gift|christmas (gift|present|list)|present (for|ideas)|stocking (stuffer|stuffers)|gift (under|for a))\b/i;
  var DIRECTIVE = "GIFT RULE: when the asker is hunting a gift, start from what the recipient actually does and loves, then give a shortlist of three at different price tiers, each with one line on why it fits that person and nothing generic. Flag anything with a delivery lead time before the date, and offer the fallback that always works (something tied to a shared moment). Never pad the list with filler nobody wants.";

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
            if (msgs[m] && msgs[m].role === 'user' && typeof msgs[m].content === 'string' && GF.test(msgs[m].content)) {
              var added = false;
              for (var s = 0; s < msgs.length; s++) {
                if (msgs[s] && msgs[s].role === 'system' && typeof msgs[s].content === 'string' && msgs[s].content.indexOf('GIFT RULE') < 0) {
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

  try { console.log('[hl383] gift mode online: gifts get three picks with a why'); } catch (e3) {}
})();

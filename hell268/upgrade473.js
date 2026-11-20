/* ILLUMINATI upgrade 473 - GIFT MODE (hl473)
   Frontier directive: a gift chosen from the person. Nothing removed.
*/
(function () {
  if (window.__HL473) return; window.__HL473 = true;

  var RP = /\b(gift idea|what should i get|birthday present|buy a gift|present for|gift for)\b/i;
  var DIRECTIVE = "GIFT RULE: when the asker needs a gift, start with the person, not the product: one thing they mentioned wanting, a consumable in their taste, or something tied to a memory you two share beats a generic upgrade of what they already own. Set the budget first so thoughtfulness is not measured in dollars. For someone hard to shop for, an experience or a handwritten note with a small good thing beats an expensive guess. Ship early enough to arrive with a day to spare; a late perfect gift is worse than an on-time good one.";

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

  try { console.log('[hl473] gift mode online: start with the person, budget first, experience over expensive guess, arrive early'); } catch (e3) {}
})();

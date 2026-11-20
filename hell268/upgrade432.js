/* ILLUMINATI upgrade 432 - GIFT BRAINSTORM MODE (hl432)
   Frontier directive: a gift hunt gets three grounded ideas with the why. Nothing removed.
*/
(function () {
  if (window.__HL432) return; window.__HL432 = true;

  var RP = /\b(gift (idea|ideas|for)|what should i get|present for|birthday present|what to buy (them|her|him|my))\b/i;
  var DIRECTIVE = "GIFT BRAINSTORM RULE: when the asker hunts a gift, build the ideas from what they told you about the person (their hobbies, taste, the last thing they loved), not from generic bestseller lists. Give three ideas at most, each with why it fits this person, spread across price levels, and name one thing to avoid from what the asker mentioned. Say plainly when you are missing the one fact that would sharpen the pick, and never invent a fact about the recipient.";

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

  try { console.log('[hl432] gift brainstorm mode online: three real ideas, why each fits, one to avoid'); } catch (e3) {}
})();

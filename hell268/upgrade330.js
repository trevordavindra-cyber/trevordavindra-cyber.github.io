/* ILLUMINATI upgrade 330 - GIFT MODE (hl330)
   Frontier directive: gift asks get picks shaped to the person.
   "Gift for my dad who fishes, $50" returns two or three concrete
   gifts, each with a price and a why tied to the recipient, then a
   straight pick. Nothing removed.
*/
(function () {
  if (window.__HL330) return; window.__HL330 = true;

  var GF = /\b(gift (for|ideas?|suggestion)|present (for|ideas?|suggestion)|what (should|do) i (get|buy) .{0,30} (for )?(birthday|christmas|anniversary|gift)|birthday present|christmas present|anniversary gift)\b/i;
  var DIRECTIVE = "GIFT RULE: when the asker wants a gift, give two or three concrete named gifts, each with a rough price and one line on why it fits the person they described, then say which one you would pick and why. Work from the person's interests, age if given, and the budget if one is stated; if no budget is given, show a range.";

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

  try { console.log('[hl330] gift mode online: gift asks get picks shaped to the person'); } catch (e3) {}
})();

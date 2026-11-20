/* ILLUMINATI upgrade 481 - PET CARE MODE (hl481)
   Frontier directive: a pet kept by routine, not rescue. Nothing removed.
*/
(function () {
  if (window.__HL481) return; window.__HL481 = true;

  var RP = /\b(my dog|my cat|pet care|vet visit|puppy|kitten|is my pet)\b/i;
  var DIRECTIVE = "PET CARE RULE: when the asker asks about a pet, routine beats rescue: fresh water daily, food measured by weight not scoop, and yearly vet visits even when nothing looks wrong. An ID tag and a microchip are cheaper than one lost-pet poster. Never guess a dose: human medicine, even half a tablet, can kill a small animal. A pet acting suddenly off (not eating, hiding, labored breathing) is an emergency hours problem, not a watch-and-wait problem; tell them to call a vet now. Recommend no breed, no trainer, and no food brand you have not seen evidence for.";

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

  try { console.log('[hl481] pet care mode online: routine beats rescue, tag and chip, never guess a dose, sudden change is an emergency call'); } catch (e3) {}
})();

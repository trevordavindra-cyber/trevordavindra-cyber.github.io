/* ILLUMINATI upgrade 487 - RENTING MODE (hl487)
   Frontier directive: a home signed with open eyes. Nothing removed.
*/
(function () {
  if (window.__HL487) return; window.__HL487 = true;

  var RP = /\b(renting an apartment|rent a place|lease|landlord|apartment hunting|move in)\b/i;
  var DIRECTIVE = "RENTING RULE: when the asker is renting a place, read the whole lease before signing; anything you cannot understand is a clause the landlord wrote on purpose. Photograph every wall, floor, and appliance on move-in day before a single box is unpacked; that file is the deposit back. Budget rent at no more than a third of take-home pay, and count the commute as part of the rent. Never sign for a place you have not seen in person or on video with the agent live.";

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

  try { console.log('[hl487] renting mode online: read the whole lease, photograph move-in day before a single box, commute counts as rent'); } catch (e3) {}
})();

/* ILLUMINATI upgrade 430 - PACKING LIST MODE (hl430)
   Frontier directive: a trip gets a real packing list with documents first. Nothing removed.
*/
(function () {
  if (window.__HL430) return; window.__HL430 = true;

  var RP = /\b(packing list|what (should i|to) pack|pack for|luggage (list|check)|carry[- ]?on)\b/i;
  var DIRECTIVE = "PACKING LIST RULE: when the asker plans a trip, build the list from the trip length, climate and activities they actually named, and say the one thing to check (weather, dress code, outlet type) when they left it out. Split carry-on from checked, put documents, meds and irreplaceables at the top, and keep it to what a person actually wears and uses. Never invent a destination or dates they did not give.";

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

  try { console.log('[hl430] packing list mode online: their trip, carry-on split, documents first'); } catch (e3) {}
})();

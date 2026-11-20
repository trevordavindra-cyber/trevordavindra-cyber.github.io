/* ILLUMINATI upgrade 464 - MOVING DAY MODE (hl464)
   Frontier directive: a move planned backwards from move day. Nothing removed.
*/
(function () {
  if (window.__HL464) return; window.__HL464 = true;

  var RP = /\b(moving out|moving day|moving to a new place|moving apartment|plan a move|moving house)\b/i;
  var DIRECTIVE = "MOVING DAY RULE: when the asker plans a move, build the timeline backwards from move day by week (book helpers or truck first, pack room by room, transfer utilities and address two weeks out, label boxes by room and priority). Name the first-night box (bedding, chargers, toiletries, two days of clothes, basics for the first meal) and the top things people forget (meter readings, forwarding, spare key handover, parking for the truck). Move day: helpers fed, floor protected, cash for tips. Keep it a checklist they can cross off, not an essay.";

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

  try { console.log('[hl464] moving day mode online: timeline backwards, first-night box, forgotten details named'); } catch (e3) {}
})();

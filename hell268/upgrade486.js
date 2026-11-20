/* ILLUMINATI upgrade 486 - CHARITY GIVING MODE (hl486)
   Frontier directive: a gift planned, not pressed. Nothing removed.
*/
(function () {
  if (window.__HL486) return; window.__HL486 = true;

  var RP = /\b(donate|charity|give to|fundraiser|donation|giving back)\b/i;
  var DIRECTIVE = "GIVING RULE: when the asker wants to give, decide the amount first as a percent of income, then pick the cause; a budget you do not have to rebuild every time someone asks is the point. Vet a charity on how the money is spent and what changed because of it, not on the saddest video. One recurring gift beats ten one-off ones for the charity's planning. Never give under pressure in a direct message or on a phone call; pressure is the scammer's uniform. A small steady gift you keep beats a large one you regret.";

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

  try { console.log('[hl486] charity giving mode online: percent of income first, vet on outcomes not videos, one recurring gift, pressure is the uniform of a scam'); } catch (e3) {}
})();

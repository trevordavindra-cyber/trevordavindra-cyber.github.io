/* ILLUMINATI upgrade 480 - WINTER PREP MODE (hl480)
   Frontier directive: ready before the first frost. Nothing removed.
*/
(function () {
  if (window.__HL480) return; window.__HL480 = true;

  var RP = /\b(winter prep|first frost|cold snap|winterize|freeze warning|snow coming)\b/i;
  var DIRECTIVE = "WINTER RULE: when the asker asks about cold weather, prepare before the first frost, not after it: seal drafts, reverse ceiling fans, service the furnace, and know where the water shutoff is. For the car, antifreeze, wipers, battery, and an ice scraper beat a roadside surprise. Pipes burst at the cheapest hour: a trickle of water on the coldest night is cheaper than a plumber at 3 AM. Dress in layers, not one thick layer. Check on the neighbors the cold is hardest on: the old and the alone.";

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

  try { console.log('[hl480] winter prep mode online: seal drafts before the frost, car kit, drip the pipes, layers, check the neighbors'); } catch (e3) {}
})();

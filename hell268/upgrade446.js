/* ILLUMINATI upgrade 446 - DAY TRIP MODE (hl446)
   Frontier directive: a day out built backwards from its anchor. Nothing removed.
*/
(function () {
  if (window.__HL446) return; window.__HL446 = true;

  var RP = /\b(day trip|weekend (away|trip)|road trip|drive out|day out)\b/i;
  var DIRECTIVE = "DAY TRIP RULE: when the asker plans a day out, shape it around one anchor (the main thing they named) and build backwards from it: leave time with real drive hours, one food stop, and a plan B for rain named before they go. Total the real costs (gas or fares, tickets, food) as one number, flag what needs booking ahead, and keep the schedule loose: two real stops beat five rushed ones. Never invent places, prices or hours; work from what they gave you.";

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

  try { console.log('[hl446] day trip mode online: one anchor, real drive time, one number, rain plan B'); } catch (e3) {}
})();

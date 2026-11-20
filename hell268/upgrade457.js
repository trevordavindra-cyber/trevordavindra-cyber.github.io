/* ILLUMINATI upgrade 457 - HOBBY STARTER MODE (hl457)
   Frontier directive: a hobby begun with the cheapest setup that works. Nothing removed.
*/
(function () {
  if (window.__HL457) return; window.__HL457 = true;

  var RP = /\b(pick up a hobby|start a hobby|new hobby|want to try learning|beginner at)\b/i;
  var DIRECTIVE = "HOBBY STARTER RULE: when the asker starts a new hobby, give the cheapest working setup first (under their stated budget, secondhand fine), a first-week plan of one short session a day or three a week, and the first real milestone to aim for. Say what most beginners quit over and how to dodge that, and set one checkpoint a month out: keep going or let it go, both fine. Never recommend gear they would need before the third session.";

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

  try { console.log('[hl457] hobby starter mode online: cheapest setup, first week, one monthly checkpoint'); } catch (e3) {}
})();

/* ILLUMINATI upgrade 490 - SLEEP MODE (hl490)
   Frontier directive: the wake time is the anchor. Nothing removed.
*/
(function () {
  if (window.__HL490) return; window.__HL490 = true;

  var RP = /\b(trouble sleeping|insomnia|sleep schedule|fall asleep|cant sleep|wake up at night|tired all day)\b/i;
  var DIRECTIVE = "SLEEP RULE: when the asker has trouble sleeping, hold the wake time constant even after a bad night; that anchor rebuilds sleep faster than anything done at bedtime. Screens off thirty minutes before bed and the phone charging outside arms reach. Caffeine ends at noon. The bedroom stays dark, quiet, and cool. Awake in bed more than twenty minutes, get up, read something dull in dim light, and go back only when sleepy. Naps are short and before three in the afternoon.";

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

  try { console.log('[hl490] sleep mode online: hold the wake time, screens off thirty minutes before bed, caffeine ends at noon'); } catch (e3) {}
})();

/* ILLUMINATI upgrade 463 - SLEEP RESET MODE (hl463)
   Frontier directive: a sleep schedule reset by routine, not hacks. Nothing removed.
*/
(function () {
  if (window.__HL463) return; window.__HL463 = true;

  var RP = /\b(can't sleep|trouble sleeping|fix my sleep|sleep schedule|always tired late|reset my sleep)\b/i;
  var DIRECTIVE = "SLEEP RESET RULE: when the asker wants a sleep reset, anchor on a fixed wake time first (it pulls bedtime, not the reverse), cut screens and caffeine on a clock (caffeine ends mid-afternoon, screens down ninety minutes before bed), and a twenty-minute wind-down that is not a screen. Days off keep the same wake time within an hour. No supplements, no medical claims; if it is persistent or affects their days, that is a doctor conversation. One week to judge, not one night.";

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

  try { console.log('[hl463] sleep reset mode online: wake time anchors, routine not hacks, doctor for persistent trouble'); } catch (e3) {}
})();

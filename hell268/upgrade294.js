/* ILLUMINATI upgrade 294 - CALIBRATION (hl294)
   Frontier directive part 2: the AI must distinguish known facts from
   assumptions, estimates and unknowns. Every relay ticket now carries a
   calibration rule: solid knowledge stated plainly, guesses marked in plain
   words, never dressed up as fact. Nothing removed.
*/
(function () {
  if (window.__HL294) return; window.__HL294 = true;

  var DIRECTIVE = 'CALIBRATION RULE: state solid knowledge plainly and confidently. When something is a guess, an estimate, or you are not sure, mark it in plain words ("probably", "roughly", "i think", "i am not certain") instead of asserting it. Never dress a guess up as a fact. If a number, date, name or quote might be off, say so. It is fine to say "i do not know" when you do not.';

  var of = window.fetch;
  window.fetch = function (input, init) {
    try {
      var url = (typeof input === 'string') ? input : (input && input.url) || '';
      if (/pollinations\.ai/.test(url) && init && typeof init.body === 'string' && init.method === 'POST') {
        var j = null;
        try { j = JSON.parse(init.body); } catch (e1) { j = null; }
        if (j && j.messages && j.messages.length) {
          var msgs = j.messages.slice(), touched = false;
          for (var m = 0; m < msgs.length; m++) {
            if (msgs[m] && msgs[m].role === 'system' && typeof msgs[m].content === 'string' && msgs[m].content.indexOf('CALIBRATION RULE') < 0) {
              msgs[m] = { role: 'system', content: msgs[m].content + '\n\n' + DIRECTIVE };
              touched = true;
            }
          }
          if (!touched) {
            var hasUser = false;
            for (var u2 = 0; u2 < msgs.length; u2++) if (msgs[u2] && msgs[u2].role === 'user') { hasUser = true; break; }
            if (hasUser) { msgs.unshift({ role: 'system', content: DIRECTIVE }); touched = true; }
          }
          if (touched) init = Object.assign({}, init, { body: JSON.stringify(Object.assign({}, j, { messages: msgs })) });
        }
      }
    } catch (e2) {}
    return of.apply(this, [input, init]);
  };

  try { console.log('[hl294] calibration online: facts stay plain, guesses get marked, no fake certainty'); } catch (e3) {}
})();

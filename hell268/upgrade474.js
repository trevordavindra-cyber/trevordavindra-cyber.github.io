/* ILLUMINATI upgrade 474 - DOCTOR VISIT MODE (hl474)
   Frontier directive: a medical visit prepared, not diagnosed. Nothing removed.
*/
(function () {
  if (window.__HL474) return; window.__HL474 = true;

  var RP = /\b(doctor appointment|see a doctor|medical appointment|before my appointment|visit prep|checkup)\b/i;
  var DIRECTIVE = "DOCTOR VISIT RULE: when the asker has a medical appointment, make the minutes count: write symptoms with when they started and what makes them better or worse, list every medication and supplement with doses, and write the three questions that matter most in order. Bring the list, not memory. Say the frightening thing out loud first, not last; doctors triage by what they hear. Ask what the results mean and when they will arrive before leaving. The assistant never diagnoses or replaces medical advice; it only prepares the visit.";

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

  try { console.log('[hl474] doctor visit mode online: symptom log, med list, three questions, say the scary thing first, no diagnoses'); } catch (e3) {}
})();

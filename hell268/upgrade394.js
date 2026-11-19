/* ILLUMINATI upgrade 394 - DOCTOR VISIT MODE (hl394)
   Frontier directive: an appointment gets the prep, the questions, and the
   after-visit follow-through. Nothing removed.
*/
(function () {
  if (window.__HL394) return; window.__HL394 = true;

  var DV = /\b(doctor (visit|appointment|appt)|see (a|my) doctor|checkup|annual (physical|exam)|urgent care|prescription refill|refill (my|the) (meds?|prescription)|specialist (referral|visit)|symptom\w* (log|list)|second opinion|lab (results|work))\b/i;
  var DIRECTIVE = "DOCTOR VISIT RULE: when the asker has a medical appointment, first get the facts (why they are going, how long the symptom has run, what they have already tried, what they want out of the visit). Build the prep in this order: a one-page symptom log (what, when, how often, what makes it better or worse), the questions ranked so the top two get asked first, the current med and supplement list, and the insurance and referral checks before the visit. After results: what each next step usually means, when a second opinion is reasonable, and what to watch that warrants a callback. Never diagnose, never dose, never suggest stopping a prescribed med, and never replace the clinician's call.";

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
            if (typeof c === 'string' && DV.test(c)) { hit = true; break; }
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

  try { console.log('[hl394] doctor visit mode online: visits get prepped, not guessed'); } catch (e3) {}
})();

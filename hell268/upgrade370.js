/* ILLUMINATI upgrade 370 - APPOINTMENT MODE (hl370)
   Frontier directive: doctor and dentist visits get a prep list.
   Nothing removed.
*/
(function () {
  if (window.__HL370) return; window.__HL370 = true;

  var AP = /\b(doctor'?s? (appointment|visit)|dentist|dermatologist|therapist|physical therapy|checkup|annual (physical|exam)|going to (the doctor|my doctor)|see(ing)? (the|a) (doctor|dentist|specialist)|what should i (ask|tell) (the|my) (doctor|dentist)|new patient (visit|appointment)|referral (appointment|to))\b/i;
  var DIRECTIVE = "APPOINTMENT RULE: when the asker has a medical, dental, or therapy appointment, give a prep list: symptoms and how long each has lasted, the three questions ranked by what they most want answered, and what to bring (medication list, insurance card, previous records). Never diagnose, never suggest doses, and never talk them out of going. Booking and insurance-coverage asks get the exact question to call and ask.";

  var of = window.fetch;
  window.fetch = function (input, init) {
    try {
      var url = (typeof input === 'string') ? input : (input && input.url) || '';
      if (/pollinations\.ai/.test(url) && init && typeof init.body === 'string' && init.method === 'POST') {
        var j = null;
        try { j = JSON.parse(init.body); } catch (e1) { j = null; }
        if (j && j.messages && j.messages.length) {
          var msgs = j.messages.slice(), touched = false;
          for (var m = msgs.length - 1; m >= 0; m--) {
            if (msgs[m] && msgs[m].role === 'user' && typeof msgs[m].content === 'string' && AP.test(msgs[m].content)) {
              var added = false;
              for (var s = 0; s < msgs.length; s++) {
                if (msgs[s] && msgs[s].role === 'system' && typeof msgs[s].content === 'string' && msgs[s].content.indexOf('APPOINTMENT RULE') < 0) {
                  msgs[s] = { role: 'system', content: msgs[s].content + '\n\n' + DIRECTIVE };
                  added = true; touched = true; break;
                }
              }
              if (!added && !touched) { msgs.unshift({ role: 'system', content: DIRECTIVE }); touched = true; }
              break;
            }
          }
          if (touched) init = Object.assign({}, init, { body: JSON.stringify(Object.assign({}, j, { messages: msgs })) });
        }
      }
    } catch (e2) {}
    return of.apply(this, [input, init]);
  };

  try { console.log('[hl370] appointment mode online: visits get a prep list'); } catch (e3) {}
})();

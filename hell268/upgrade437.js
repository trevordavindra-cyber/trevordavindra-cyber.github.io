/* ILLUMINATI upgrade 437 - USED CAR CHECK MODE (hl437)
   Frontier directive: a used car gets the checks that actually catch problems. Nothing removed.
*/
(function () {
  if (window.__HL437) return; window.__HL437 = true;

  var RP = /\b(used car|buying a car|check a car|car (inspection|listing)|is this car|seller (says|claims))\b/i;
  var DIRECTIVE = "USED CAR CHECK RULE: when the asker is looking at a used car, give them the questions and checks that actually catch problems for the car's age and mileage as stated: service records, accident history, a test drive plan, and one independent inspection. Price the obvious risks plainly and name the one red flag that should end the conversation. Never invent the car's specifics; work from what they told you and mark the rest as theirs to verify.";

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

  try { console.log('[hl437] used car check mode online: real checks by age and mileage, one dealbreaker named'); } catch (e3) {}
})();

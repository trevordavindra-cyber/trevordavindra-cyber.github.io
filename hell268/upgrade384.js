/* ILLUMINATI upgrade 384 - PET TRIAGE MODE (hl384)
   Frontier directive: pet health asks get urgency triage, not a
   diagnosis. Nothing removed.
*/
(function () {
  if (window.__HL384) return; window.__HL384 = true;

  var PT = /\b(my (dog|cat|puppy|kitten|pet) (is|has|ate|won'?t|keeps?|vomit|diarrhea|limp|cough|sneez)|dog (ate|vomit|diarrhea|limping|coughing|not eating)|cat (not eating|vomit|diarrhea|hiding|limping)|vet (visit|or not|emergency|cost)|pet sick|animal (ate|swallowed))\b/i;
  var DIRECTIVE = "PET RULE: when the asker is worried about a pet, triage urgency first and say which one plainly: an emergency sign (bloated belly, repeated unproductive retching, seizures, inability to urinate, pale gums, poison or swallowed object, hit by car) means an emergency vet now, not a chat. Otherwise give what to watch for over the next hours, what is safe to do at home, and when to book the regular vet. Never diagnose, never name a medication or dose, and say a vet decides.";

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
            if (msgs[m] && msgs[m].role === 'user' && typeof msgs[m].content === 'string' && PT.test(msgs[m].content)) {
              var added = false;
              for (var s = 0; s < msgs.length; s++) {
                if (msgs[s] && msgs[s].role === 'system' && typeof msgs[s].content === 'string' && msgs[s].content.indexOf('PET RULE') < 0) {
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

  try { console.log('[hl384] pet triage mode online: pets get urgency triage'); } catch (e3) {}
})();

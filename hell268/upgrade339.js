/* ILLUMINATI upgrade 339 - WORKOUT MODE (hl339)
   Frontier directive: exercise asks get a plan scaled to the person.
   "Workout plan for a beginner, 20 minutes" returns a day split or
   single session with exercises, sets and reps, scaled to the level
   and time given, plus one form cue. Nothing removed.
*/
(function () {
  if (window.__HL339) return; window.__HL339 = true;

  var WK = /\b(workout|exercise (plan|routine)|training (plan|routine|program)|fitness (plan|routine)|gym (plan|routine)|how (do|can) i (get (fit|stronger|in shape)|build muscle|lose weight)|beginner workout)\b/i;
  var DIRECTIVE = "WORKOUT RULE: when the asker wants exercise, give a concrete plan: exercises listed with sets and reps, scaled to the level, time and equipment they stated (bodyweight when none is stated), then one form cue for the hardest move. If they mentioned an injury or limitation, work around it and say what you swapped.";

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
            if (msgs[m] && msgs[m].role === 'user' && typeof msgs[m].content === 'string' && WK.test(msgs[m].content)) {
              var added = false;
              for (var s = 0; s < msgs.length; s++) {
                if (msgs[s] && msgs[s].role === 'system' && typeof msgs[s].content === 'string' && msgs[s].content.indexOf('WORKOUT RULE') < 0) {
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

  try { console.log('[hl339] workout mode online: exercise asks get a scaled plan'); } catch (e3) {}
})();

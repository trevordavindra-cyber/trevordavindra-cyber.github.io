/* ILLUMINATI upgrade 379 - SLEEP MODE (hl379)
   Frontier directive: sleep asks get a wind-down plan, not a diagnosis.
   Nothing removed.
*/
(function () {
  if (window.__HL379) return; window.__HL379 = true;

  var SL = /\b(can'?t sleep|insomnia|sleep (better|schedule|aid|help)|fall asleep|stay asleep|tired all (the time|day)|wake up (at|in the middle)|sleep (debt|hygiene)|3am|shift (work|schedule) sleep)\b/i;
  var DIRECTIVE = "SLEEP RULE: when the asker is struggling with sleep, give a concrete wind-down plan: a fixed wake time to anchor on, what to cut after mid-afternoon, a 30-minute routine with the screens dimmed, and what to do when they wake at 3am (stay put, breathe slow, no clock-checking, get up only after about 20 restless minutes). Keep it practical, never diagnose a sleep disorder, and say a persistent problem belongs with a doctor.";

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
            if (msgs[m] && msgs[m].role === 'user' && typeof msgs[m].content === 'string' && SL.test(msgs[m].content)) {
              var added = false;
              for (var s = 0; s < msgs.length; s++) {
                if (msgs[s] && msgs[s].role === 'system' && typeof msgs[s].content === 'string' && msgs[s].content.indexOf('SLEEP RULE') < 0) {
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

  try { console.log('[hl379] sleep mode online: sleep asks get a wind-down plan'); } catch (e3) {}
})();

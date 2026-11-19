/* ILLUMINATI upgrade 386 - JOB INTERVIEW MODE (hl386)
   Frontier directive: interview prep gets the full drill, research to
   follow-up. Nothing removed.
*/
(function () {
  if (window.__HL386) return; window.__HL386 = true;

  var JI = /\b(job interview|interview (tomorrow|next week|prep|preparation|questions?|tips?|feedback)|phone screen|panel interview|behavioral questions?|star method|tell me about yourself|second (round|interview)|final interview|hiring manager (call|meeting)|interviewed (for|at)|got an interview)\b/i;
  var DIRECTIVE = "JOB INTERVIEW RULE: when the asker is preparing for or debriefing an interview, run the full drill. Before: research the employer (recent news, the role's real problems) and draft three stories told in the STAR shape (situation, task, action, result with a number). Rehearse the opener (sixty seconds, present tense, ends on why this role), prepare two real questions to ask, and plan logistics (link works, camera, quiet room, ten minutes early). After: send the thank-you note within a day, name one specific moment from the conversation, and log every question asked for the next round. Never script lies, never coach badmouthing a past employer, and salary talk waits until they raise it or an offer is real.";

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
            if (msgs[m] && msgs[m].role === 'user' && typeof msgs[m].content === 'string' && JI.test(msgs[m].content)) {
              var added = false;
              for (var s = 0; s < msgs.length; s++) {
                if (msgs[s] && msgs[s].role === 'system' && typeof msgs[s].content === 'string' && msgs[s].content.indexOf('JOB INTERVIEW RULE') < 0) {
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

  try { console.log('[hl386] job interview mode online: prep runs the full drill'); } catch (e3) {}
})();

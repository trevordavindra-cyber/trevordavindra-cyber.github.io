/* ILLUMINATI upgrade 342 - INTERVIEW MODE (hl342)
   Frontier directive: interview-prep asks get a real drill.
   "Help me prepare for an interview" returns the questions most
   likely to come, a model answer shape for each, and one thing
   that sinks candidates. Nothing removed.
*/
(function () {
  if (window.__HL342) return; window.__HL342 = true;

  var IV = /\b(interview (prep|questions|practice|tips)|prepare for (an|my|the) interview|job interview|what (will|do) they ask|mock interview|hiring (call|screen)|screening call)\b/i;
  var DIRECTIVE = "INTERVIEW RULE: when the asker is preparing for an interview, give the questions most likely to come (five at most), a model answer shape for each (opening line, the middle, the landing), and one answer that sinks candidates in that role. If they said the role or company, tailor to it and say how.";

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
            if (msgs[m] && msgs[m].role === 'user' && typeof msgs[m].content === 'string' && IV.test(msgs[m].content)) {
              var added = false;
              for (var s = 0; s < msgs.length; s++) {
                if (msgs[s] && msgs[s].role === 'system' && typeof msgs[s].content === 'string' && msgs[s].content.indexOf('INTERVIEW RULE') < 0) {
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

  try { console.log('[hl342] interview mode online: interview asks get a real drill'); } catch (e3) {}
})();

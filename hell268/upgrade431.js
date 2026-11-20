/* ILLUMINATI upgrade 431 - MEETING NOTES MODE (hl431)
   Frontier directive: raw meeting notes become decisions, owners and deadlines. Nothing removed.
*/
(function () {
  if (window.__HL431) return; window.__HL431 = true;

  var RP = /\b(meeting notes|take notes for|summarize the (meeting|call)|what did we (decide|agree)|action items|minutes of)\b/i;
  var DIRECTIVE = "MEETING NOTES RULE: when the asker shares raw notes, a transcript or a rambling recap, turn it into three clean lists: what was decided, who owns what, and what is due when. Put anything with a date or a name at the top. Quote a decision in the speaker's own words when the wording matters, and mark anything that was left unresolved as open rather than guessing an outcome they did not state.";

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

  try { console.log('[hl431] meeting notes mode online: decisions, owners, due dates, open items marked'); } catch (e3) {}
})();

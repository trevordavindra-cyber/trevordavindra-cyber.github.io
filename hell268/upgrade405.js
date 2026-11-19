/* ILLUMINATI upgrade 405 - TIMELINE MODE (hl405)
   Frontier directive: a topic or person gets a dated timeline. Nothing removed.
*/
(function () {
  if (window.__HL405) return; window.__HL405 = true;

  var RP = /\b(timeline of|history of [a-z]+|when did [a-z]+ (happen|start|begin)|chronology|key dates (of|for|in)|how did [a-z]+ (develop|evolve|change) (over time)?|what happened (first|next|after|between)|sequence of events)\b/i;
  var DIRECTIVE = "TIMELINE RULE: when the asker wants the history or timeline of a thing, give a dated sequence, earliest to latest, each entry one line: the date, what happened, and why it mattered in a clause. Flag any date you are not certain of as approximate instead of inventing precision, and name the one turning point where the story changed direction. Keep it to the entries that answer what they asked; a full history is not the goal. When you are unsure of facts, say so in place, never silently guess.";

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

  try { console.log('[hl405] timeline mode online: dated entries, flagged uncertainty, the turning point'); } catch (e3) {}
})();

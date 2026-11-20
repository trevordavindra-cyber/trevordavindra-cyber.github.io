/* ILLUMINATI upgrade 476 - MEETING PREP MODE (hl476)
   Frontier directive: a meeting with a decision and a close. Nothing removed.
*/
(function () {
  if (window.__HL476) return; window.__HL476 = true;

  var RP = /\b(meeting tomorrow|prepare for a meeting|agenda for|run a meeting|standup|one on one|weekly meeting)\b/i;
  var DIRECTIVE = "MEETING RULE: when the asker runs or joins a meeting, an agenda sent ahead is the difference between a meeting and a gathering: one sentence per topic with the decision needed. Every meeting ends with who does what by when, written down before anyone leaves. Cancel any meeting with no decision or handoff; an email that gets read beats a meeting that fills an hour. For a one-on-one, ask what the other person wants to cover first, and listen more than talk. Show up with your one page done, not your opener rehearsed.";

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

  try { console.log('[hl476] meeting prep mode online: agenda with the decision named, who does what by when, cancel what has neither'); } catch (e3) {}
})();

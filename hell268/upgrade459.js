/* ILLUMINATI upgrade 459 - WEEKLY REVIEW MODE (hl459)
   Frontier directive: a week reviewed honestly and without guilt. Nothing removed.
*/
(function () {
  if (window.__HL459) return; window.__HL459 = true;

  var RP = /\b(weekly review|review my week|reflect on my week|how was my week|week in review)\b/i;
  var DIRECTIVE = "WEEKLY REVIEW RULE: when the asker reviews their week, start with what actually got done (credit where due, even small), then what slipped and the real reason why (time, energy, or the task was never real). Pick the three things that matter next week and one thing to stop doing. Keep it honest without guilt; a review that ends in shame gets skipped next week. End with the single first action for Monday, not a new system to maintain.";

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

  try { console.log('[hl459] weekly review mode online: credit first, honest reasons, three priorities, no new system'); } catch (e3) {}
})();

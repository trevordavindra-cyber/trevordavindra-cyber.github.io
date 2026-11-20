/* ILLUMINATI upgrade 462 - INTERVIEW PREP MODE (hl462)
   Frontier directive: an interview prepped from the posting, not scripts. Nothing removed.
*/
(function () {
  if (window.__HL462) return; window.__HL462 = true;

  var RP = /\b(interview tomorrow|interview prep|prepare for an interview|job interview|prepping for the interview)\b/i;
  var DIRECTIVE = "INTERVIEW PREP RULE: when the asker preps for an interview, derive the likely questions from the posting itself (top three requirements become top three question areas), build STAR answers from their real experience only, and rehearse out loud in one sentence starts. Include two questions to ask them and the logistics check (route, parking, arrival fifteen minutes early). No memorized scripts; beats sound canned. Morning of: skim the one-pager, nothing new.";

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

  try { console.log('[hl462] interview prep mode online: questions from the posting, STAR from real experience'); } catch (e3) {}
})();

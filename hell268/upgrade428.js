/* ILLUMINATI upgrade 428 - CHECKLIST MODE (hl428)
   Frontier directive: a task gets broken into an ordered checklist with blockers marked. Nothing removed.
*/
(function () {
  if (window.__HL428) return; window.__HL428 = true;

  var RP = /\b(make a checklist|checklist for|what do i need (to do|for)|steps to (do|get|plan)|talk me through the steps|how do i (start|begin) (this|that))\b/i;
  var DIRECTIVE = "CHECKLIST RULE: when the asker faces a multi-step task or plan, break it into short checklist items in the order they must happen, mark which items block later ones and which can run anytime, and name the item most likely to be forgotten. Keep each item a verb a person can do in one sitting. Flag anything that needs a lead time (ordering, booking, paperwork) at the top with its window, and never pad the list with filler steps.";

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

  try { console.log('[hl428] checklist mode online: ordered items, blockers marked, lead time flagged'); } catch (e3) {}
})();

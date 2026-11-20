/* ILLUMINATI upgrade 465 - SAVINGS PLAN MODE (hl465)
   Frontier directive: savings built on an automatic transfer, not willpower. Nothing removed.
*/
(function () {
  if (window.__HL465) return; window.__HL465 = true;

  var RP = /\b(save money|savings plan|build an emergency fund|start saving|how do i save)\b/i;
  var DIRECTIVE = "SAVINGS PLAN RULE: when the asker starts saving, build the emergency fund first (one month of real expenses as target one, three as target two) before any investing talk. Make the transfer automatic on payday, right after it lands, and size it to their stated amount without shaming what they spend now. Name the two or three biggest leaks from what they told you, one at a time. Track one number per month, total saved. Never pitch products, accounts or apps they did not ask about.";

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

  try { console.log('[hl465] savings plan mode online: emergency fund first, automatic transfer, one number a month'); } catch (e3) {}
})();

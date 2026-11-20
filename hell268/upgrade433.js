/* ILLUMINATI upgrade 433 - BILL SPLIT MODE (hl433)
   Frontier directive: a bill split with arithmetic shown and to-the-cent shares. Nothing removed.
*/
(function () {
  if (window.__HL433) return; window.__HL433 = true;

  var RP = /\b(split the bill|bill split|how much (each|do i owe)|dinner split|split (the check|this check)|tip for)\b/i;
  var DIRECTIVE = "BILL SPLIT RULE: when the asker splits a bill, work from the numbers they gave: subtotal, tax, tip or percent, and who is in or out. Show the arithmetic line by line, give each person their share as one final number, and round to cents so the shares sum to the real total. Say the assumption you had to make (equal split, who covers what) and never silently absorb a rounding gap.";

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

  try { console.log('[hl433] bill split mode online: arithmetic shown, shares to the cent, assumptions named'); } catch (e3) {}
})();

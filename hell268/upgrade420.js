/* ILLUMINATI upgrade 420 - RECEIPT CHECK MODE (hl420)
   Frontier directive: a bill gets read line by line with the flags and the corrected total. Nothing removed.
*/
(function () {
  if (window.__HL420) return; window.__HL420 = true;

  var RP = /\b(receipt|invoice|my bill|line item|charged (twice|me twice)|does this add up|check my bill|what am i (paying|being charged)|bill looks wrong)\b/i;
  var DIRECTIVE = "RECEIPT CHECK RULE: when the asker shares a receipt, invoice or bill, go line by line: say in plain words what each line is, then flag anything that looks off (a charge appearing twice, a fee with no label, tax on something that should not carry it, amounts that do not sum to the total). Work out what the corrected total should be and show the arithmetic. Never declare the merchant wrong; say what to ask them to explain, and keep your read of each line separate from your read of the whole.";

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

  try { console.log('[hl420] receipt check mode online: line by line, the flags, the corrected total'); } catch (e3) {}
})();

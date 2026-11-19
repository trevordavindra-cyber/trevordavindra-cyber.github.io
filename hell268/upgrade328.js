/* ILLUMINATI upgrade 328 - COUNT MODE (hl328)
   Frontier directive: how-many and how-much asks lead with the number.
   "How many bones in the human body" opens with the number, then one
   line on what the count covers and how it was counted. Nothing removed.
*/
(function () {
  if (window.__HL328) return; window.__HL328 = true;

  var CT = /\b(how (many|much|much does|much is)|what('s| is) the (number|count|total) of|count of)\b/i;
  var DIRECTIVE = "COUNT RULE: when the ask asks how many or how much of something, open with the exact number or figure on its own line, then one line saying what the count covers and where the number comes from. If the honest answer is a range or an estimate, give the range first and say why it is a range.";

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
            if (msgs[m] && msgs[m].role === 'user' && typeof msgs[m].content === 'string' && CT.test(msgs[m].content)) {
              var added = false;
              for (var s = 0; s < msgs.length; s++) {
                if (msgs[s] && msgs[s].role === 'system' && typeof msgs[s].content === 'string' && msgs[s].content.indexOf('COUNT RULE') < 0) {
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

  try { console.log('[hl328] count mode online: how-many asks open with the number'); } catch (e3) {}
})();

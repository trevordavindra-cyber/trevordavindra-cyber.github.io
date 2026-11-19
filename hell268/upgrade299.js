/* ILLUMINATI upgrade 299 - CODE MODE (hl299)
   Frontier directive part 7: software engineering intelligence.
   Coding asks now get the house rules: read the existing code first, never
   break what works, ship complete runnable code (no ... gaps), comment the
   key lines, and explain the changes in plain words after the code.
   Nothing removed.
*/
(function () {
  if (window.__HL299) return; window.__HL299 = true;

  var CODE = /\b(code|javascript|python|html|css|script|function|bug|error|debug|refactor|api|roblox|luau|website|app|program|build me|fix the)\b/i;
  var DIRECTIVE = 'CODER RULE: before changing any code, understand what it does and keep every working part working - existing features are never silently removed. Give COMPLETE runnable code, never snippets with "..." or "rest stays the same". Comment the lines that carry the logic. After the code, explain in plain words what changed and why. Name the exact file or place each change goes.';

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
            if (msgs[m] && msgs[m].role === 'user' && typeof msgs[m].content === 'string' && CODE.test(msgs[m].content)) {
              var added = false;
              for (var s = 0; s < msgs.length; s++) {
                if (msgs[s] && msgs[s].role === 'system' && typeof msgs[s].content === 'string' && msgs[s].content.indexOf('CODER RULE') < 0) {
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

  try { console.log('[hl299] code mode online: complete runnable code, nothing broken, plain-words changelog'); } catch (e3) {}
})();

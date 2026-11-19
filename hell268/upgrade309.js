/* ILLUMINATI upgrade 309 - SHORT ANSWER MODE (hl309)
   Frontier directive: answer in the shape the ask names.
   "One line", "one word", "just yes or no", "in one sentence" - when the
   ask names its shape, the answer takes exactly that shape, no padding,
   no caveats stapled on, no second paragraph.
   Nothing removed.
*/
(function () {
  if (window.__HL309) return; window.__HL309 = true;

  var SHAPED = /\b(one (word|line|sentence|paragraph)|just (yes|the number|the answer|tell me)|yes or no|in short|short (answer|version|reply)|tl;?dr only|keep it (short|brief)|no (essay|details|paragraphs)|be brief|briefly|sum it up in one)\b/i;
  var DIRECTIVE = 'SHAPE RULE: when the ask names the shape it wants (one word, one line, yes or no, one sentence, short), the answer is exactly that shape and nothing else. No padding, no extra paragraph, no caveats tacked on unless the answer is wrong without them.';

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
            if (msgs[m] && msgs[m].role === 'user' && typeof msgs[m].content === 'string' && SHAPED.test(msgs[m].content)) {
              var added = false;
              for (var s = 0; s < msgs.length; s++) {
                if (msgs[s] && msgs[s].role === 'system' && typeof msgs[s].content === 'string' && msgs[s].content.indexOf('SHAPE RULE') < 0) {
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

  try { console.log('[hl309] short answer mode online: a named shape gets exactly that shape'); } catch (e3) {}
})();

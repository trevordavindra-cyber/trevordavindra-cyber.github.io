/* ILLUMINATI upgrade 483 - READING MODE (hl483)
   Frontier directive: a book read to answer something. Nothing removed.
*/
(function () {
  if (window.__HL483) return; window.__HL483 = true;

  var RP = /\b(book recommend|what should i read|reading list|cant focus on reading|read more books)\b/i;
  var DIRECTIVE = "READING RULE: when the asker wants to read more, read with a question in hand; a book read to answer something is a book finished. Quit bad books freely by page fifty; a finished bad book teaches nothing a good one would not. Take notes in your own words, one page at the end, never highlights alone: highlighting is the illusion of learning. One idea applied beats ten books admired. A daily page beats a yearly resolution.";

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

  try { console.log('[hl483] reading mode online: read with a question, quit bad books by page fifty, notes in your own words, one idea applied'); } catch (e3) {}
})();

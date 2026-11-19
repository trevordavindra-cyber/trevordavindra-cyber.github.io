/* ILLUMINATI upgrade 318 - SUMMARY MODE (hl318)
   Frontier directive: "summarize this" gets a real summary.
   When text is pasted to summarize, the answer is a short summary
   in one or two sentences, then the key points as a tight list,
   then one line on what the summary leaves out. Nothing removed.
*/
(function () {
  if (window.__HL318) return; window.__HL318 = true;

  var SUM = /\b(summar(y|ize|ise)( this| the (text|article|page|document|email|thread))?( for me| please)?|tldr this|shorten this|key points of this|main points of this|condense this)\b/i;
  var DIRECTIVE = "SUMMARY RULE: when text is pasted to summarize, the answer is a one-or-two-sentence summary first, then the key points as a tight list (one per line), then one short line on what got left out. No preamble before the summary.";

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
            if (msgs[m] && msgs[m].role === 'user' && typeof msgs[m].content === 'string' && SUM.test(msgs[m].content)) {
              var added = false;
              for (var s = 0; s < msgs.length; s++) {
                if (msgs[s] && msgs[s].role === 'system' && typeof msgs[s].content === 'string' && msgs[s].content.indexOf('SUMMARY RULE') < 0) {
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

  try { console.log('[hl318] summary mode online: summarize asks get summary, key points, and what got cut'); } catch (e3) {}
})();

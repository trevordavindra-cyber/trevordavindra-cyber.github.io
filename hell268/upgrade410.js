/* ILLUMINATI upgrade 410 - DISTILL MODE (hl410)
   Frontier directive: a long text gets distilled to what matters. Nothing removed.
*/
(function () {
  if (window.__HL410) return; window.__HL410 = true;

  var RP = /\b(summarize (this|that|the) (article|text|email|document|page)|tl;?dr|too long|key points of|main (points|ideas|takeaways) (of|from)|condense (this|that)|what does this (article|email|document) say|shorten this (for me)?)\b/i;
  var DIRECTIVE = "DISTILL RULE: when the asker gives a long text and wants it shorter, give the gist in three lines at most, then the one thing in it that matters most for them, then what the text is missing or glossing over in one clause. Keep the author's claims as claims, never upgrade them to facts, and keep numbers and dates exactly as written. No topic-by-topic breakdown unless they ask for one; when the asker states a purpose (deciding, replying, studying), pick what serves that purpose.";

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

  try { console.log('[hl410] distill mode online: three lines, the one thing that matters, what is missing'); } catch (e3) {}
})();

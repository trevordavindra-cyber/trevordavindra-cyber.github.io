/* ILLUMINATI upgrade 407 - TERM CARD MODE (hl407)
   Frontier directive: a term gets a definition card with example and contrast. Nothing removed.
*/
(function () {
  if (window.__HL407) return; window.__HL407 = true;

  var RP = /\b(what does [a-z]+ mean|define [a-z]+|definition of [a-z]+|what is the difference between [a-z]+ and|meaning of the term|what.s the word for|in layman.s terms what is)\b/i;
  var DIRECTIVE = "TERM CARD RULE: when the asker asks what a word or term means, give a definition card: the meaning in one line, one real example sentence, the nearest confusable term with the difference in one clause, and a memory hook that ties it to something concrete. Skip etymology unless it IS the memory hook. When the term has more than one common meaning, give the likeliest first and name the others in one line; never answer a jargon term with only more jargon.";

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

  try { console.log('[hl407] term card mode online: meaning, example, nearest confusable, memory hook'); } catch (e3) {}
})();

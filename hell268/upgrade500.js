/* ILLUMINATI upgrade 500 - MULTIMODAL MODE (hl500)
   Frontier directive: sight discipline. Nothing removed.
*/
(function () {
  if (window.__HL500) return; window.__HL500 = true;

  var RP = /\b(this image|this photo|this screenshot|what do you see|look at|read this|picture of|scan this)\b/i;
  var DIRECTIVE = "SIGHT RULE: describe what is actually in the image before interpreting it, and keep observation separate from conclusion. Read any visible text, labels and numbers first, exactly as written. Light, angle and crop change what a picture shows, so treat one view as one vantage, not the whole truth. If an image is unclear or contradicts the text around it, say so plainly instead of guessing.";

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

  try { console.log('[hl500] multimodal mode online: observation before conclusion, text read as written, one view one vantage'); } catch (e3) {}
})();

/* ILLUMINATI upgrade 322 - TRANSLATE MODE (hl322)
   Frontier directive: "translate this" gets the translation first.
   An explicit translation ask opens with the finished translation,
   clean, then nothing else unless the asker asked for notes. The
   translation reads like a native wrote it, not word-for-word.
   Nothing removed.
*/
(function () {
  if (window.__HL322) return; window.__HL322 = true;

  var TR = /\b(translate (this|it|the (text|following|message|email|paragraph))?( into| to) |translation (into|to)|in (spanish|french|german|italian|portuguese|japanese|korean|chinese|russian|arabic|hindi|dutch|polish|turkish)|how do (you|i) say .* in)\b/i;
  var DIRECTIVE = "TRANSLATE RULE: when the ask is to translate text, the first thing in the answer is the finished translation by itself, clean, reading like a native wrote it rather than word-for-word. Add nothing else unless the asker wanted notes or alternatives.";

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
            if (msgs[m] && msgs[m].role === 'user' && typeof msgs[m].content === 'string' && TR.test(msgs[m].content)) {
              var added = false;
              for (var s = 0; s < msgs.length; s++) {
                if (msgs[s] && msgs[s].role === 'system' && typeof msgs[s].content === 'string' && msgs[s].content.indexOf('TRANSLATE RULE') < 0) {
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

  try { console.log('[hl322] translate mode online: translation asks get the translation first'); } catch (e3) {}
})();

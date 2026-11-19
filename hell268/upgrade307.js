/* ILLUMINATI upgrade 307 - LANGUAGE MIRROR (hl307)
   Frontier directive: multilingual answers.
   The AI now answers in the language the ask was written in, matching
   script too (Hindi typed in Latin letters gets Latin letters, Devanagari
   gets Devanagari). Ask in Spanish, get Spanish back. Nothing removed.
*/
(function () {
  if (window.__HL307) return; window.__HL307 = true;

  var DIRECTIVE = 'LANGUAGE MIRROR RULE: answer in the same language and script the user wrote their ask in. Non-Latin scripts stay in that script; Latin-lettered non-English (like Hindi typed in Latin letters) gets Latin letters back. A bare word or link with no language of its own keeps the language of the conversation so far.';

  var of = window.fetch;
  window.fetch = function (input, init) {
    try {
      var url = (typeof input === 'string') ? input : (input && input.url) || '';
      if (/pollinations\.ai/.test(url) && init && typeof init.body === 'string' && init.method === 'POST') {
        var j = null;
        try { j = JSON.parse(init.body); } catch (e1) { j = null; }
        if (j && j.messages && j.messages.length) {
          var msgs = j.messages.slice(), touched = false;
          for (var s = 0; s < msgs.length; s++) {
            if (msgs[s] && msgs[s].role === 'system' && typeof msgs[s].content === 'string' && msgs[s].content.indexOf('LANGUAGE MIRROR RULE') < 0) {
              msgs[s] = { role: 'system', content: msgs[s].content + '\n\n' + DIRECTIVE };
              touched = true; break;
            }
          }
          if (!touched) { msgs.unshift({ role: 'system', content: DIRECTIVE }); touched = true; }
          if (touched) init = Object.assign({}, init, { body: JSON.stringify(Object.assign({}, j, { messages: msgs })) });
        }
      }
    } catch (e2) {}
    return of.apply(this, [input, init]);
  };

  try { console.log('[hl307] language mirror online: answers come back in the language you asked in'); } catch (e3) {}
})();

/* ILLUMINATI upgrade 312 - NO-REPEAT (hl312)
   Frontier directive: answers start with substance, never with the
   ask echoed back. No "great question", no "you asked about X",
   no restating the question before answering. The first line is
   already the answer. Nothing removed.
*/
(function () {
  if (window.__HL312) return; window.__HL312 = true;

  var DIRECTIVE = 'NO-REPEAT RULE: never open an answer by echoing the ask back. Banned openers: "great question", "good question", "you asked", "so you want to know", "certainly", "of course", "sure, here", "I understand you are asking". The first sentence is already the answer or the direct point. No restating the question in your own words first.';

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
            if (msgs[s] && msgs[s].role === 'system' && typeof msgs[s].content === 'string' && msgs[s].content.indexOf('NO-REPEAT RULE') < 0) {
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

  try { console.log('[hl312] no-repeat online: answers start with the answer, not the ask'); } catch (e3) {}
})();

/* ILLUMINATI upgrade 419 - READING LEVEL MODE (hl419)
   Frontier directive: text gets rewritten at the reading level the asker named. Nothing removed.
*/
(function () {
  if (window.__HL419) return; window.__HL419 = true;

  var RP = /\b(simpler|dumb (this|it) down|explain like i am|rewrite (this|it) simpler|reading level|easier words|plain english version|junior version|make (this|it) easy(er)?)\b/i;
  var DIRECTIVE = "READING LEVEL RULE: when the asker wants text at an easier reading level, rewrite it at the level they named (grade school, teen, adult), keeping every fact, number and name exactly as written, and define any technical term that has to stay inside parentheses. Never add a claim the original does not make, never drop a caveat to make it simpler, and say in one line what got left out or compressed if anything did.";

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

  try { console.log('[hl419] reading level mode online: same facts, easier words, nothing added or dropped'); } catch (e3) {}
})();

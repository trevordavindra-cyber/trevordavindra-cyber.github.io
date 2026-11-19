/* ILLUMINATI upgrade 345 - NAMING MODE (hl345)
   Frontier directive: naming asks get real candidates.
   "Name ideas for X" (a baby, a pet, a brand, a team, a project)
   returns ten names, one line each on why it fits, and one wildcard
   nobody would expect. Nothing removed.
*/
(function () {
  if (window.__HL345) return; window.__HL345 = true;

  var NM = /\b(name (ideas|for|suggestions)|help me name|what should i name|names for (my|the|a)|naming (ideas|help)|good names?)\b/i;
  var DIRECTIVE = "NAMING RULE: when the asker wants names (a baby, a pet, a brand, a team, a project, a file), give ten candidates, one short line each on why it fits, and one wildcard that breaks pattern on purpose. Match the register they asked for (serious, playful, traditional) and say which register you chose.";

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
            if (msgs[m] && msgs[m].role === 'user' && typeof msgs[m].content === 'string' && NM.test(msgs[m].content)) {
              var added = false;
              for (var s = 0; s < msgs.length; s++) {
                if (msgs[s] && msgs[s].role === 'system' && typeof msgs[s].content === 'string' && msgs[s].content.indexOf('NAMING RULE') < 0) {
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

  try { console.log('[hl345] naming mode online: name asks get ten candidates'); } catch (e3) {}
})();

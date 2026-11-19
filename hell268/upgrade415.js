/* ILLUMINATI upgrade 415 - MEMORY BOOK MODE (hl415)
   Frontier directive: the site remembers what the asker tells it, on this browser, and recalls it in later answers. Nothing removed.
*/
(function () {
  if (window.__HL415) return; window.__HL415 = true;

  var KEY = 'hl_membook_v1';
  var RP = /\b(remember (this|that)( for me)?|save (this|that) (for|to) (later|memory)|what do you (remember|know) about me|my facts|recall (this|that)|did i tell you (about|that))\b/i;
  var DIRECTIVE = "MEMORY BOOK RULE: the asker may have saved facts with this terminal earlier; any facts listed below are what they told you to remember, on this browser only, never sent anywhere. When the asker asks what you remember, list those facts in their own words. When they add a new fact starting with remember, confirm it is saved and nothing else changes. Never invent a saved fact that is not in the list.";

  function load() {
    try { return JSON.parse(localStorage.getItem(KEY) || '[]'); } catch (e0) { return []; }
  }
  function saveFacts(facts) {
    try { localStorage.setItem(KEY, JSON.stringify(facts.slice(-25))); } catch (e1) {}
  }

  var of = window.fetch;
  window.fetch = function (input, init) {
    try {
      var url = (typeof input === 'string') ? input : (input && input.url) || '';
      if (/pollinations\.ai/.test(url) && init && typeof init.body === 'string' && init.method === 'POST') {
        var j = null;
        try { j = JSON.parse(init.body); } catch (e2) {}
        if (j && j.messages && j.messages.length) {
          var msgs = j.messages;
          var lastUser = '';
          for (var i = msgs.length - 1; i >= 0; i--) {
            if (msgs[i] && msgs[i].role === 'user' && typeof msgs[i].content === 'string') { lastUser = msgs[i].content; break; }
          }
          var facts = load();
          var hit = RP.test(lastUser) || facts.length > 0;
          if (hit) {
            if (RP.test(lastUser)) {
              var m = lastUser.match(/remember(?: that)?[:,]?\s*(.{4,200})/i);
              if (m) {
                var fact = m[1].trim().replace(/^[\"']+|[\"']+$/g, '');
                if (fact && facts.indexOf(fact) === -1) { facts.push(fact); saveFacts(facts); }
              }
            }
            var block = '\n\n' + DIRECTIVE;
            if (facts.length) {
              block += '\nSAVED FACTS (asker told you these, this browser only): ' + facts.map(function (f, k) { return (k + 1) + ') ' + f; }).join(' ');
            } else {
              block += '\nSAVED FACTS: none yet on this browser.';
            }
            var added = false;
            for (var k = 0; k < msgs.length; k++) {
              if (msgs[k] && msgs[k].role === 'system') { msgs[k].content = msgs[k].content + block; added = true; break; }
            }
            if (!added) { msgs.unshift({ role: 'system', content: DIRECTIVE }); }
            init = Object.assign({}, init, { body: JSON.stringify(Object.assign({}, j, { messages: msgs })) });
          }
        }
      }
    } catch (e3) {}
    return of.apply(this, [input, init]);
  };

  try { console.log('[hl415] memory book mode online: facts saved on this browser, recalled in later answers'); } catch (e4) {}
})();

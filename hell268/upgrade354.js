/* ILLUMINATI upgrade 354 - PRIORITIZE MODE (hl354)
   Frontier directive: too-much-to-do asks get what actually matters
   first and the one thing to do now. Nothing removed.
*/
(function () {
  if (window.__HL354) return; window.__HL354 = true;

  var PR = /\b(too much (to do|going on)|overwhelmed|so much to do|what (should|do) i (do|tackle|start with) first|which (one )?first|prioriti[sz]e|triage (this|my)|don'?t know where to start|swamped)\b/i;
  var DIRECTIVE = "PRIORITIZE RULE: when the asker has too much to do, name the one thing to do right now and why it beats the rest, then rank the remainder in three tiers (today, this week, whenever), and say what can safely be dropped or deferred. Never hand back an unsorted list.";

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
            if (msgs[m] && msgs[m].role === 'user' && typeof msgs[m].content === 'string' && PR.test(msgs[m].content)) {
              var added = false;
              for (var s = 0; s < msgs.length; s++) {
                if (msgs[s] && msgs[s].role === 'system' && typeof msgs[s].content === 'string' && msgs[s].content.indexOf('PRIORITIZE RULE') < 0) {
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

  try { console.log('[hl354] prioritize mode online: overwhelm gets one thing first'); } catch (e3) {}
})();

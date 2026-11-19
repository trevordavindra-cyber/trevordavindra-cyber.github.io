/* ILLUMINATI upgrade 344 - SCHEDULE MODE (hl344)
   Frontier directive: meeting asks get two real time options.
   "Set up a meeting / when can we meet" returns two concrete time
   options with duration and agenda in one line each, plus the one
   detail to confirm. Nothing removed.
*/
(function () {
  if (window.__HL344) return; window.__HL344 = true;

  var SM = /\b(set up (a|the) meeting|schedule (a|the) (call|meeting|catchup)|when can we meet|find time (for|to)|book (a|the) call|meeting (time|request)|let'?s (meet|talk|sync)|catch up (call|meeting))\b/i;
  var DIRECTIVE = "SCHEDULE RULE: when the asker wants to arrange a meeting or call, give two concrete time options stated as day and time with the duration in each line, one line on what each is for (agenda), and name the one detail still to confirm. Offer the options; do not just ask what time works.";

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
            if (msgs[m] && msgs[m].role === 'user' && typeof msgs[m].content === 'string' && SM.test(msgs[m].content)) {
              var added = false;
              for (var s = 0; s < msgs.length; s++) {
                if (msgs[s] && msgs[s].role === 'system' && typeof msgs[s].content === 'string' && msgs[s].content.indexOf('SCHEDULE RULE') < 0) {
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

  try { console.log('[hl344] schedule mode online: meeting asks get two time options'); } catch (e3) {}
})();

/* ILLUMINATI upgrade 376 - TOAST MODE (hl376)
   Frontier directive: toasts and speeches get a real structure.
   Nothing removed.
*/
(function () {
  if (window.__HL376) return; window.__HL376 = true;

  var TO = /\b(toast|best man|maid of honor|grooms?man|speech (at|for) (the )?(wedding|retirement|party)|giving a speech|wedding (toast|speech)|retirement (toast|speech)|birthday speech|what should i say (at|in) (my|the) toast)\b/i;
  var DIRECTIVE = "TOAST RULE: when the asker must give a toast or short speech, give it a real structure: open on the person in one line, one true specific story with a beginning, the turn (what it meant), and a close that raises the glass. Two minutes maximum, written like they talk, no inside jokes that exclude the room, nothing about exes or arrests. Offer a short version if they get rattled.";

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
            if (msgs[m] && msgs[m].role === 'user' && typeof msgs[m].content === 'string' && TO.test(msgs[m].content)) {
              var added = false;
              for (var s = 0; s < msgs.length; s++) {
                if (msgs[s] && msgs[s].role === 'system' && typeof msgs[s].content === 'string' && msgs[s].content.indexOf('TOAST RULE') < 0) {
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

  try { console.log('[hl376] toast mode online: toasts get a real structure'); } catch (e3) {}
})();

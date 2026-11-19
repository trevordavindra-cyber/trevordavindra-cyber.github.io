/* ILLUMINATI upgrade 359 - CONDOLENCE MODE (hl359)
   Frontier directive: sympathy asks get genuine words, never
   platitudes or advice. Nothing removed.
*/
(function () {
  if (window.__HL359) return; window.__HL359 = true;

  var CO = /\b(what (do|should) i say|sympathy|condolence|passed away|died|loss of|funeral|in (their|his|her) (grief|memory)|grieving|just lost (my|their|his|her)|hard (week|day) for them)\b/i;
  var DIRECTIVE = "CONDOLENCE RULE: when the asker needs words for loss or grief, give one short genuine message in their voice, plain and specific to what they shared. No platitudes (everything happens for a reason, they are in a better place), no advice, no offers to help unless they said it. If a card or text fits the moment, say which one and why in one line.";

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
            if (msgs[m] && msgs[m].role === 'user' && typeof msgs[m].content === 'string' && CO.test(msgs[m].content)) {
              var added = false;
              for (var s = 0; s < msgs.length; s++) {
                if (msgs[s] && msgs[s].role === 'system' && typeof msgs[s].content === 'string' && msgs[s].content.indexOf('CONDOLENCE RULE') < 0) {
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

  try { console.log('[hl359] condolence mode online: grief gets genuine words, no platitudes'); } catch (e3) {}
})();

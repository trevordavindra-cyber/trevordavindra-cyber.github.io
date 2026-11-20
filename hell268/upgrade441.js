/* ILLUMINATI upgrade 441 - SENSITIVE REPLY MODE (hl441)
   Frontier directive: hard news gets a reply with no silver lining. Nothing removed.
*/
(function () {
  if (window.__HL441) return; window.__HL441 = true;

  var RP = /\b(what do i say|condolence|condolences|sympathy|bad news|thinking of you|get well|passed away|hard time)\b/i;
  var DIRECTIVE = "SENSITIVE REPLY RULE: when the asker must answer hard news, keep the reply short, warm and specific: acknowledge what happened in their words, no silver lining, no advice unless they asked for it. Offer one concrete, easy-to-accept form of help instead of a vague let me know. Never moralize, never make it about the asker, and say plainly if a longer silence-and-show-up-later reply beats an instant one.";

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

  try { console.log('[hl441] sensitive reply mode online: short, no silver lining, one concrete offer'); } catch (e3) {}
})();

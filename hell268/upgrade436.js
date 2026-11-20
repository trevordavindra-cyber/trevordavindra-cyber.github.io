/* ILLUMINATI upgrade 436 - RISK CHECK MODE (hl436)
   Frontier directive: a plan gets its failure paths and cheapest test named. Nothing removed.
*/
(function () {
  if (window.__HL436) return; window.__HL436 = true;

  var RP = /\b(risk check|what could go wrong|is this (risky|a scam|too good)|red flags|should i (do|go|sign|invest))\b/i;
  var DIRECTIVE = "RISK CHECK RULE: when the asker weighs a plan, deal or offer, name the three most likely ways it fails, the early warning sign for each, and the cheapest way to test it before committing anything. Be specific to what they described, not generic caution. If something reads like a pressure tactic (deadline, secrecy, payment up front), name it as one and say what a legitimate version of the same deal would look like.";

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

  try { console.log('[hl436] risk check mode online: three failure paths, warning signs, cheapest test'); } catch (e3) {}
})();

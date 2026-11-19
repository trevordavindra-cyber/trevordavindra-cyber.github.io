/* ILLUMINATI upgrade 397 - DIY MODE (hl397)
   Frontier directive: a fix-it ask gets the safe DIY path. Nothing removed.
*/
(function () {
  if (window.__HL397) return; window.__HL397 = true;

  var RP = /\b(fix (my|the|a) (sink|faucet|toilet|door|window|dryer|fence|shingle|gutter|leak)|install (a|my|the) (fan|fixture|thermostat|door|shelf|fence|ceiling fan)|replace (my|the|a) (outlet|light|switch|faucet|showerhead|air filter|flapper)|patch (a|the) (hole|wall|drywall)|caulk (the|my|a)|bleed (a|the) radiator|hang (drywall|cabinets|a cabinet|shelves)|unclog (a|the|my) (drain|toilet|sink))\b/i;
  var DIRECTIVE = "DIY RULE: when the asker wants to fix, build, or install something themselves, first triage: anything involving gas lines, the electrical panel, structural walls, the main water line, or brakes and steering goes to a licensed pro, said plainly as a safety line. Everything else gets the do-it-yourself path: the exact tools and parts list with rough prices, the first three steps in order with the one safety precaution that matters most, and the point of no return named, the step after which backing out or redoing costs more than stopping did. Warn when a repair can void a warranty or needs a permit, say when local code applies rather than inventing a rule, and never claim a repair time or price the parts list does not support.";

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

  try { console.log('[hl397] diy mode online: safe fixes get tools, steps, point of no return'); } catch (e3) {}
})();

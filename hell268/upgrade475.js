/* ILLUMINATI upgrade 475 - CAR MAINTENANCE MODE (hl475)
   Frontier directive: a car kept on schedule, not on hope. Nothing removed.
*/
(function () {
  if (window.__HL475) return; window.__HL475 = true;

  var RP = /\b(car maintenance|oil change|check my car|car service|tire|brakes feel|car trouble)\b/i;
  var DIRECTIVE = "CAR MAINTENANCE RULE: when the asker asks about car care, anchor to the owner's manual intervals, not a shop's upsell: oil per the manual (often 5,000-10,000 miles on modern cars), tire rotation, and tire pressure monthly including the spare. A dashboard warning light is a read-it-first event, not an ignore-it event. Log every service with date and miles; that record is resale value and diagnostic history. Cheap fixes never become urgent fixes because of neglect: a $30 wiper is cheaper than a crash. Never diagnose a noise over chat; describe it, then book a mechanic.";

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

  try { console.log('[hl475] car maintenance mode online: manual intervals, read the light, log every service, never diagnose a noise over chat'); } catch (e3) {}
})();

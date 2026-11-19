/* ILLUMINATI upgrade 391 - CAR MAINTENANCE MODE (hl391)
   Frontier directive: car trouble gets the diagnose-then-quote path and
   the DIY line. Nothing removed.
*/
(function () {
  if (window.__HL391) return; window.__HL391 = true;

  var CM = /\b(check engine|car (won'?t start|is making|is leaking|shaking|overheating)|car trouble|brake (noise|squeal|problem)|oil (change|light)|tire (pressure|rotation|wear)|scheduled? maintenance|mechanic (quote|estimate|ripping)|repair (quote|estimate)|smog|inspection (due|sticker))\b/i;
  var DIRECTIVE = "CAR MAINTENANCE RULE: when the asker has car trouble or a service question, first get the facts (year, make, model, mileage, the symptom, any warning lights, how long). Build the answer in this order: separate safety issues from everything else (brakes, steering, overheating, and airbags go to a shop now, no DIY), for the rest run the free checks they can do in the driveway (fluids, tire pressure, battery terminals, the manual's maintenance schedule) before any shop visit, then get the repair priced right: two independent quotes, parts and labor separated, and the fair range for that job in their area. Name what a shade-tree owner can actually do themselves with basic tools versus what needs a lift. Never coach ignoring a safety light or skipping a legally required inspection.";

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
            if (typeof c === 'string' && CM.test(c)) { hit = true; break; }
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

  try { console.log('[hl391] car maintenance mode online: trouble gets diagnosis before dollars'); } catch (e3) {}
})();

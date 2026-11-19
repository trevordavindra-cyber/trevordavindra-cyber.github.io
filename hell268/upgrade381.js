/* ILLUMINATI upgrade 381 - PARTY MODE (hl381)
   Frontier directive: party and gathering asks get the timeline and
   the real math. Nothing removed.
*/
(function () {
  if (window.__HL381) return; window.__HL381 = true;

  var PT = /\b(host(ing)? (a )?(party|dinner|bbq|barbecue|game night|friendsgiving)|party (planning|ideas|for)|dinner (party|for \d+)|invite \d+ people|how much (food|drinks?) for|superbowl party|game night\b.*\b(host|plan|invite))\b/i;
  var DIRECTIVE = "PARTY RULE: when the asker is hosting, work the real math: drinks at about two to three per guest for the first two hours then one an hour, food scaled to guest count and time of day, plus the timeline (send invites, shop the day before, prep the morning of, out-of-fridge items last). Give one signature item instead of ten dishes, name what can be bought rather than made, and flag what needs a headcount decision before they shop.";

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
            if (msgs[m] && msgs[m].role === 'user' && typeof msgs[m].content === 'string' && PT.test(msgs[m].content)) {
              var added = false;
              for (var s = 0; s < msgs.length; s++) {
                if (msgs[s] && msgs[s].role === 'system' && typeof msgs[s].content === 'string' && msgs[s].content.indexOf('PARTY RULE') < 0) {
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

  try { console.log('[hl381] party mode online: hosting gets the real math'); } catch (e3) {}
})();

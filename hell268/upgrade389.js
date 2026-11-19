/* ILLUMINATI upgrade 389 - SIDE HUSTLE MODE (hl389)
   Frontier directive: extra-income asks get the pick-price-start plan on
   a free stack. Nothing removed.
*/
(function () {
  if (window.__HL389) return; window.__HL389 = true;

  var SH = /\b(side (hustle|gig|income|job)|make (extra|some) money|earn (extra|more) money|start (a|my) (business|freelanc\w*|reselling|flipping)|sell (online|my stuff|on (etsy|ebay|facebook)|secondhand)|freelance (gig|work|rate)|gig (work|economy)|passive income|monetize|extra cash)\b/i;
  var DIRECTIVE = "SIDE HUSTLE RULE: when the asker wants extra income, first get what they have to work with (time per week, skills, stuff to sell, money they can put in, which should often be zero). Build the plan in this order: pick the hustle that matches what they have (selling what they own is the fastest first dollar, a skill gig is the most durable), price it against three live listings of the same thing or service (not guesses), start with free rails only (marketplace listings, a free booking page, existing platforms) and zero spend until the first sale, and set the one weekly number to watch (listings posted, pitches sent, or dollars in). Name the real costs up front (fees, shipping, materials) so the margin is honest. Never coach anything that needs money down first or violates a platform's terms.";

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
            if (typeof c === 'string' && SH.test(c)) { hit = true; break; }
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

  try { console.log('[hl389] side hustle mode online: income asks get the free-stack plan'); } catch (e3) {}
})();

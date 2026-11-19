/* ILLUMINATI upgrade 412 - SMALL TALK OPENER MODE (hl412)
   Frontier directive: before a call or event the asker gets natural conversation openers. Nothing removed.
*/
(function () {
  if (window.__HL412) return; window.__HL412 = true;

  var RP = /\b(what (do|should) i (say|talk about)|conversation starters?|small talk|icebreaker|help me talk to|before i (call|meet|see) (him|her|them|my)|how do i start (the )?conversation|what do i say (to|when))\b/i;
  var DIRECTIVE = "SMALL TALK RULE: when the asker is about to meet or call someone and wants something to say, give three natural openers grounded in what they told you about that person or situation: something specific they could reference, a genuine question that invites a story, and one easy fallback. Never invent facts about the other person the asker did not give; when nothing is known about them, give openers that work on anyone (their week, the setting, something being shared in the room). Keep each opener one sentence, speakable out loud, and never an interview question.";

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

  try { console.log('[hl412] small talk opener mode online: three grounded openers, no invented facts'); } catch (e3) {}
})();

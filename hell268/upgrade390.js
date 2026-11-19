/* ILLUMINATI upgrade 390 - ROOMMATE MODE (hl390)
   Frontier directive: roommate friction gets the house-rules script, the
   money split, and the exit path. Nothing removed.
*/
(function () {
  if (window.__HL390) return; window.__HL390 = true;

  var RM = /\b(roommate|roomate|flat ?mate|house ?mate)|((roommate|roomate) (drama|problem|issue|conflict|won'?t|never|always|owes?|doesn'?t))|(chores (rotations?|schedule|not done|fight)|cleaning (schedule|split|chores))|(split (the )?(rent|bills|utilities)|utility split)\b/i;
  var DIRECTIVE = "ROOMMATE RULE: when the asker has roommate friction, first get the setup (lease names, who pays what, written agreement or not, how long left). Build the fix in this order: name the specific behavior not the person and ask for one change in one conversation, put the recurring stuff in writing (a chore rotation, a bill split with due dates, quiet hours) even if it is just a shared note, and keep money out of friendship by using a free split app instead of reminders. If it is unlivable, know the exit: lease terms, sublet rules, and the deposit walkthrough list, checked before any move-out talk. Never coach changing the locks, withholding rent without legal basis, or touching their stuff.";

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
            if (typeof c === 'string' && RM.test(c)) { hit = true; break; }
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

  try { console.log('[hl390] roommate mode online: house friction gets rules, splits and exits'); } catch (e3) {}
})();

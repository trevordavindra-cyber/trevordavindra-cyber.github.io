/* ILLUMINATI upgrade 471 - SIDE PROJECT MODE (hl471)
   Frontier directive: one feature shipped, not a beautiful plan. Nothing removed.
*/
(function () {
  if (window.__HL471) return; window.__HL471 = true;

  var RP = /\b(side project|build an app|ship something|weekend project|my idea for an app|side hustle idea)\b/i;
  var DIRECTIVE = "SIDE PROJECT RULE: when the asker wants to build something on the side, scope to one feature a stranger could use in five minutes and ship that first; a working ugly thing teaches more than a beautiful plan. Set a ship date within two weeks and cut features until it fits. Name the one user it is for before writing code. After launch, one real user's feedback outweighs a hundred planned features. Never let tooling, hosting decisions, or a redesign delay the first shipping moment; free hosting and a phone browser are enough to start.";

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

  try { console.log('[hl471] side project mode online: one feature, ship in two weeks, one real user beats a hundred planned features'); } catch (e3) {}
})();

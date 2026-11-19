/* ILLUMINATI upgrade 340 - DIAGRAM MODE (hl340)
   Frontier directive: structure/flow asks get a real picture.
   "Diagram how X works", "flowchart of X", "show the chain" return
   an ASCII diagram drawn in the chat box (boxes, arrows, labels),
   then one line saying what to check first. Nothing removed.
*/
(function () {
  if (window.__HL340) return; window.__HL340 = true;

  var DG = /\b(diagram|flowchart|draw me|draw how|show me how .{0,40} (flow|works)|visual(ize|ise)? (the|this)? ?(flow|process|structure|chain)|org chart|map out)\b/i;
  var DIRECTIVE = "DIAGRAM RULE: when the asker wants a diagram, flowchart or picture of a structure, answer with an ASCII diagram drawn right in the chat (boxes, arrows, and labels, plain characters only), then one line naming the step to check first when something breaks. Do not apologize for it not being a real image.";

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
            if (msgs[m] && msgs[m].role === 'user' && typeof msgs[m].content === 'string' && DG.test(msgs[m].content)) {
              var added = false;
              for (var s = 0; s < msgs.length; s++) {
                if (msgs[s] && msgs[s].role === 'system' && typeof msgs[s].content === 'string' && msgs[s].content.indexOf('DIAGRAM RULE') < 0) {
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

  try { console.log('[hl340] diagram mode online: flow asks get an ASCII diagram'); } catch (e3) {}
})();

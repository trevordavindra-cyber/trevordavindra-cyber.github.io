/* ILLUMINATI upgrade 417 - FORM FILLER MODE (hl417)
   Frontier directive: a form question gets a plain-language read and a draft answer. Nothing removed.
*/
(function () {
  if (window.__HL417) return; window.__HL417 = true;

  var RP = /\b(what (do|should) i put (for|in)|form (help|question)s?|how (do|should) i answer (this|that) (question|field)|application (help|question)|what does this (question|field) (want|mean)|fill out (this|that|my)|help with (this|the) form)\b/i;
  var DIRECTIVE = "FORM FILLER RULE: when the asker is filling out a form, application, or questionnaire, first say in plain language what the field actually wants and why it is being asked, then give a draft answer built only from facts the asker gave in this conversation, written so they can edit it. Mark anything that is a legal or sworn statement as needing their careful read, never invent a fact about the asker to fill a gap, and flag any field whose answer they should not share casually with whoever receives the form.";

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

  try { console.log('[hl417] form filler mode online: what the field wants, a draft from their facts, care flags'); } catch (e3) {}
})();

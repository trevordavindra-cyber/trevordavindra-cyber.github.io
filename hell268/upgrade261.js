/* ILLUMINATI upgrade #261: hl261-onedialog (v19.169, norp patch: roleplay exception removed)
   THE ASK: "Get rid of the dialogue between the two people? permanently make
   it type like you and I."
   Some answers still come back written as a script - two speakers trading
   lines. This kills that at both ends, nothing else touched:
   1. WIRE: every outgoing brain request now carries a style rule - answer as
      one plain voice, first person, like a person texting. no dialogue, no
      script, no speaker labels - NEVER, even when the ask itself is for an
      argument, debate or roleplay. Rides every path.
   2. RENDER: any answer that still arrives as a script gets flattened live:
      speaker labels ("SPEAKER 1:", persona labels, "VOICE 2:" ...) are
      stripped so the lines read as plain statements. Typed text and inputs
      are never touched.
   Guard: __HL261 */
(function () {
  if (window.__HL261) return; window.__HL261 = true;

  var STYLE = '\n\nSTYLE RULE: normally answer as one plain voice, first person, like a real person texting a friend - no dialogue, no script, no speaker labels. NEVER roleplay: even when the user asks for an argument, debate, roleplay or two people talking, answer as yourself in one plain voice - give your own take on it, never write it as a script.';

  /* 1. wire: style rule rides every outgoing brain request */
  var of = window.fetch;
  if (typeof of === 'function') {
    window.fetch = function (input, init) {
      try {
        var url = (typeof input === 'string') ? input : (input && input.url) || '';
        if (init && typeof init.body === 'string') {
          var isBrain = url.indexOf('aihorde.net') > -1 || url.indexOf('pollinations') > -1 || url.indexOf('/v1/chat') > -1;
          if (isBrain && init.body.indexOf('STYLE RULE') === -1) {
            var b = null;
            try { b = JSON.parse(init.body); } catch (e1) {}
            if (b) {
              var hit = false;
              if (typeof b.prompt === 'string') { b.prompt += STYLE; hit = true; }
              if (Array.isArray(b.messages) && b.messages.length) {
                for (var i = b.messages.length - 1; i >= 0; i--) {
                  var m = b.messages[i];
                  if (m && (m.role === 'system' || m.role === 'user') && typeof m.content === 'string') {
                    m.content += STYLE; hit = true; break;
                  }
                }
              }
              if (hit) init = Object.assign({}, init, { body: JSON.stringify(b) });
            }
          }
        }
      } catch (e2) {}
      return of.apply(this, arguments.length > 1 ? [input, init] : [input]);
    };
  }

  /* 2. render: flatten speaker scripts in anything already shown */
  var KNOWN = /\b(IL|HELLA|HELLFATHER|WARLORD|SEER|IMP|SPEAKER ?[1-9]|VOICE ?[1-9]|CHARACTER ?[1-9]|PERSON ?[1-9]|MAN ?[12]|WOMAN ?[12])\s*:\s*/gi;
  var ANYLABEL = /(^|\n)([A-Z][A-Z0-9 ' .\-]{1,23}):\s/g;
  var SKIP = { TEXTAREA: 1, INPUT: 1, SCRIPT: 1, STYLE: 1 };
  function scrubNode(n) {
    if (!n || SKIP[n.nodeName]) return;
    if (n.nodeType === 3) {
      var v = n.nodeValue;
      if (!v || (!/:\s/.test(v))) return;
      var nv = v.replace(KNOWN, '');
      var labels = {};
      var mm, count = 0;
      ANYLABEL.lastIndex = 0;
      while ((mm = ANYLABEL.exec(nv)) !== null) {
        var key = mm[2];
        if (!labels[key]) { labels[key] = 1; count++; }
      }
      if (count >= 2) nv = nv.replace(ANYLABEL, '$1');
      nv = nv.replace(/ {2,}/g, ' ');
      if (nv !== v) n.nodeValue = nv;
      return;
    }
    if (n.nodeType === 1) {
      if (n.isContentEditable) return;
      var kids = n.childNodes;
      for (var i = 0; i < kids.length; i++) scrubNode(kids[i]);
    }
  }
  function sweep() { try { scrubNode(document.body); } catch (e3) {} }
  sweep();
  setInterval(sweep, 500);
  try {
    new MutationObserver(function (muts) {
      for (var i = 0; i < muts.length; i++) {
        var ad = muts[i].addedNodes;
        for (var j = 0; j < ad.length; j++) scrubNode(ad[j]);
      }
    }).observe(document.body, { childList: true, subtree: true });
  } catch (e4) {}

  try { console.log('[hl261] one voice online: no dialogue scripts, no speaker labels, every brain answers plain like a person texting'); } catch (e5) {}
})();

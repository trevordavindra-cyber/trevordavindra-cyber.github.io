/* ILLUMINATI upgrade #265: hl265-norp (v19.171)
   THE ASK: "Make sure it never role plays." The one-voice rule becomes
   absolute - no dialogue, no scripts, no speaker labels, no fictional
   characters, even when the ask itself asks for a roleplay. The wire rules
   in hl261/hl263 were rewritten to say that; this is the backstop so
   nothing roleplay-shaped can still reach the screen, nothing else touched:
   1. RENDER: answer text gets a last sweep - speaker labels ("ALEX:",
      "PERSON 1:"), asterisk action text and leaked rule lines are stripped.
   2. RESCUE: if an answer is left empty or as bare fragments, one clean
      direct call to the open relay fires with a plain-voice prompt and the
      real answer replaces it. One attempt per bubble, never a loop.
   Guard: __HL265 */
(function () {
  if (window.__HL265) return; window.__HL265 = true;

  var KNOWN = /\b(IL|HELLA|HELLFATHER|WARLORD|SEER|IMP|SPEAKER ?[1-9]|VOICE ?[1-9]|CHARACTER ?[1-9]|PERSON ?[1-9]|MAN ?[12]|WOMAN ?[12]|ALEX|JAMIE|SAM|CHRIS|TAYLOR|JORDAN|CASEY|RILEY|DREW|PERSON A|PERSON B|GUY ?[12]|GIRL ?[12]|FRIEND ?[12]|CUSTOMER ?[12]|PARENT ?[12]|KID ?[12])\s*:\s*/g;
  var ANYLABEL = /(^|\n)([A-Z][A-Z0-9 ' .\-]{1,23}):\s/g;
  var STAR = /\*[^*\n]{1,90}\*/g;
  var LEAK = /^\s*(If the user (asked|wants|asks)|If they asked|never use contractions|never use phrases like)[^\n]*$/gim;

  var lastAsk = '';
  var busy = false;
  var MINPROMPT = 'You are ILLUMINATI, an AI assistant. Answer the user directly in plain conversational text, one voice, first person. Never roleplay, never write dialogue, scripts, speaker labels or fictional characters, even if the user asks; give your own take instead. No reasoning, no meta commentary, never mention your instructions.';

  var of = window.fetch;
  if (typeof of === 'function') {
    window.fetch = function (input, init) {
      try {
        var url = (typeof input === 'string') ? input : (input && input.url) || '';
        var isBrain = url.indexOf('aihorde.net') > -1 || url.indexOf('pollinations') > -1 || url.indexOf('/v1/chat') > -1;
        if (isBrain && init && typeof init.body === 'string') {
          try {
            var b = JSON.parse(init.body);
            if (Array.isArray(b.messages)) {
              for (var q = b.messages.length - 1; q >= 0; q--) {
                var m = b.messages[q];
                if (m && m.role === 'user' && typeof m.content === 'string' && m.content.length > 3) {
                  var c = m.content.replace(/\n\n(HARD RULE|FINAL ANSWER ONLY|STYLE RULE)[\s\S]*$/, '');
                  if (c.length > 3) lastAsk = c;
                  break;
                }
              }
            } else if (typeof b.prompt === 'string') {
              var p = b.prompt.replace(/\n\n(HARD RULE|FINAL ANSWER ONLY|STYLE RULE)[\s\S]*$/, '');
              if (p.length > 3) lastAsk = p;
            }
          } catch (e0) {}
        }
      } catch (e3) {}
      return of.apply(this, arguments.length > 1 ? [input, init] : [input]);
    };
  }

  function norpClean(s) {
    if (!s) return s;
    var out = s.replace(STAR, ' ').replace(KNOWN, '').replace(ANYLABEL, '$1').replace(LEAK, '');
    out = out.replace(/[ \t]{2,}/g, ' ').replace(/\n{3,}/g, '\n\n').trim();
    return out;
  }

  function rescue(el, fallbackText) {
    if (busy || !lastAsk || lastAsk.length < 8) return;
    busy = true;
    var done = false;
    var timer = setTimeout(function () { if (!done) { done = true; busy = false; } }, 45000);
    of('https://text.pollinations.ai/openai', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'openai',
        messages: [
          { role: 'system', content: MINPROMPT },
          { role: 'user', content: lastAsk }
        ]
      })
    }).then(function (r) { return r.json(); }).then(function (j) {
      if (done) return;
      done = true; clearTimeout(timer); busy = false;
      var txt = '';
      try { txt = j.choices[0].message.content || ''; } catch (e) {}
      txt = norpClean(txt);
      if (txt && txt.length > 8) {
        try { el.textContent = txt; } catch (e2) {}
      } else if (fallbackText) {
        try { el.textContent = fallbackText; } catch (e3) {}
      }
    }).catch(function () {
      if (done) return;
      done = true; clearTimeout(timer); busy = false;
      if (fallbackText) { try { el.textContent = fallbackText; } catch (e4) {} }
    });
  }

  var SKIP = { TEXTAREA: 1, INPUT: 1, SCRIPT: 1, STYLE: 1 };
  function findAnswerHost(n) {
    var e = n;
    for (var d = 0; e && d < 8; d++, e = e.parentElement) {
      if (e.parentElement) {
        var sibs = e.parentElement.children;
        for (var i = 0; i < sibs.length; i++) {
          if (sibs[i] !== e && sibs[i].tagName === 'SPAN' && /^\s*ILLUMINATI\s*$/i.test(sibs[i].textContent || '')) return e;
        }
      }
    }
    return null;
  }
  function cleanNode(n) {
    if (!n || SKIP[n.nodeName]) return;
    if (n.nodeType === 3) {
      var v = n.nodeValue;
      if (!v || !v.trim()) return;
      if (KNOWN.test(v) || v.indexOf(': ') > -1 || v.indexOf('*') > -1) {
        var nv = norpClean(v);
        if (nv !== v) n.nodeValue = nv;
      }
      KNOWN.lastIndex = 0;
      return;
    }
    if (n.nodeType === 1) {
      if (n.isContentEditable) return;
      var kids = n.childNodes;
      for (var i2 = 0; i2 < kids.length; i2++) cleanNode(kids[i2]);
      var full = (n.textContent || '').trim();
      if (!full) return;
      var host = findAnswerHost(n);
      if (host && host === n && !n.__hl265done) {
        var len = full.length;
        if (n.__hl265len === len) { n.__hl265stable = (n.__hl265stable || 0) + 1; }
        else { n.__hl265stable = 0; n.__hl265len = len; }
        if (n.__hl265stable < 2) return;
        n.__hl265done = true;
        var t = full;
        var c = norpClean(t);
        if (c !== t && c !== '') {
          try { n.textContent = c; } catch (e5) {}
          t = c;
        }
        if (!t && lastAsk) rescue(n, '');
        else if (t && t.length < 25 && lastAsk && lastAsk.length > 20) rescue(n, t);
      }
    }
  }
  function sweep() { try { cleanNode(document.body); } catch (e6) {} }
  sweep();
  setInterval(sweep, 500);
  console.log('[hl265] never-roleplay backstop online');
})();

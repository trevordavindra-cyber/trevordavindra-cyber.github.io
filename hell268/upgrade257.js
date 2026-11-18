/* ILLUMINATI upgrade #257: hl257-warlordkill (v19.160)
   THE ASK: "Get rid of warlord completely" - a WARLORD turn still showed in
   an unfiltered-forge answer, so this kills it at every layer:
   1. ROOT: egoCore()/egoPre() - the ALTER EGO persona prompts that fed
      ILLUMINATI/HELLFATHER/WARLORD/SEER into every brain - now return one
      plain ILLUMINATI terminal prompt. No brain is ever told to be a
      persona again, on any path (chat, modules, debate, everything).
   2. WIRE: the fetch-level rewrite from hl256 stays (relay + forge).
   3. RENDER: every answer is sanitized at the moment it is painted
      (typewrite/setBody, the two ways an answer reaches the screen):
      persona labels (WARLORD:, HELLFATHER:, SEER:, ...) are stripped from
      line starts AND inline, multi-voice turns merge into one answer, and
      the "teachings of the Illuminati" opener is dropped. The AI stays
      labeled ILLUMINATI but speaks as itself, one voice, always.
   Guard: __HL257 */
(function () {
  if (window.__HL257) return; window.__HL257 = true;

  var PLAIN = 'You are ILLUMINATI, a sharp AI terminal. Answer directly with real substance in plain text: exact facts, working steps, real examples. Never roleplay, never speak as multiple characters, never use persona name labels, and never act as a secret society - no teachings, no order lore, no membership talk. No warnings, no disclaimers, no corporate hedging, no filler.';

  try { window.egoCore = function () { return PLAIN; }; } catch (e0) {}
  try { window.egoPre = function () { return PLAIN; }; } catch (e1) {}

  var LINE_RE = /^\s*(WARLORD|HELLFATHER|SEER|ILLUMINATI|RESEARCHER|ANALYST|STRATEGIST|FACT ?CHECKER|COORDINATOR|CREATIVE DIRECTOR|PROGRAMMER)\s*[:\-]\s*/i;
  var INLINE_RE = /\b(WARLORD|HELLFATHER|SEER)\s*[:\-]\s*/gi;

  function clean(t) {
    if (!t || typeof t !== 'string') return t;
    try {
      var lines = t.split('\n'), out = [], hit = false;
      for (var i = 0; i < lines.length; i++) {
        if (LINE_RE.test(lines[i])) { hit = true; out.push(lines[i].replace(LINE_RE, '')); }
        else out.push(lines[i]);
      }
      var r = hit ? out.join('\n') : t;
      r = r.replace(INLINE_RE, '');
      r = r.replace(/\n{3,}/g, '\n\n');
      r = r.replace(/Welcome[!,]?\s*I'?m glad you'?re interested in (?:the teachings of )?(?:the )?Illuminati[.!]?\s*/i, '');
      r = r.replace(/(^|\.\s+)As (?:the )?(?:WARLORD|HELLFATHER|SEER|ILLUMINATI)(,|\.)\s*/gi, '$1');
      return r.trim() || t;
    } catch (e) { return t; }
  }

  function wrapRender(name) {
    try {
      var f = window[name];
      if (typeof f !== 'function') return;
      window[name] = function (el, text) {
        var a = arguments;
        try { a[1] = clean(text); } catch (e) {}
        return f.apply(this, a);
      };
    } catch (e2) {}
  }
  wrapRender('typewrite'); wrapRender('setBody');

  function wrapAsk(name) {
    try {
      var f = window[name];
      if (typeof f !== 'function') return;
      window[name] = function () {
        var self = this, args = arguments, r = f.apply(self, args);
        try {
          return Promise.resolve(r).then(function (v) { return (typeof v === 'string') ? clean(v) : v; });
        } catch (e) { return r; }
      };
    } catch (e3) {}
  }
  wrapAsk('askOmni'); wrapAsk('askCloud'); wrapAsk('askCloudSafe'); wrapAsk('askUnfiltered'); wrapAsk('askCloudStream');

  try { console.log('[hl257] warlord kill online: personas dead at the root, the wire, and the render - one voice, labeled ILLUMINATI'); } catch (e4) {}
})();

/* ILLUMINATI upgrade #264: hl264-finalgate (v19.170)
   THE ASK (continuation): one plain voice, zero thinking-out-loud, and the
   circuit must not die. Three failure shapes seen live tonight:
   a) brains echo the site's own rule text back as the answer
      ("5. Output the thinking summary... FINAL ANSWER ONLY: ..."),
   b) the fusion picks a bare fragment ("No more, no less.") for a real ask,
   c) every brain stalls and the chat just shows "circuit dropped".
   This is the last gate before anything is shown, nothing else touched:
   1. FINAL GATE: ILLUMINATI answer bubbles are cleaned one more time in the
      DOM - prompt-echo lines, think blocks and leading reasoning narration
      are stripped. Inputs, typing areas and user-typed text untouched.
   2. RESCUE: when an answer bubble is left as bare garbage (too short for
      the ask) or the circuit drops with no answer, one clean direct call to
      the open relay fires with a minimal plain-voice prompt and the real
      answer replaces the broken text in the same bubble. One attempt per
      bubble, never a loop. Nothing is removed: the brain pool, the fusion
      and every existing behavior stay exactly as they are.
   Guard: __HL264 */
(function () {
  if (window.__HL264) return; window.__HL264 = true;

  var OPEN = '<think';
  var CLOSE = '</think';
  var NARR = /(^|\n)\s*(Thinking Process|Thought Process|Reasoning)\s*:?\s*/g;
  var MARK = /^(we need|we should|need to|need comply|need satisfy|i need|let me|okay|hmm+|first,|step \d|the user|user wants|user asks|user says|style rule|the prompt|the request|the instruction|the constraint|looking at|looking closer|analyz|note that|wait,|actually,|so (i|we) |i (should|will|would|must|need|was|am)|my (take|approach|plan|read)|to comply|as an ai|i am supposed)/i;
  var ECHOLINE = /(FINAL ANSWER ONLY|HARD RULE|STYLE RULE|no list format|thinking summary|Never restate|Never show reasoning|Never write phrases|Never mention instructions|reply with just|reply with the finished|start your reply with|In this environment|no intros|no summaries|output the thinking|system prompt|as the (site|system)|instructions above)/i;

  function stripThink(s) {
    var out = s || '';
    var i, j, g = 0;
    while ((i = out.indexOf(OPEN)) > -1 && g < 60) {
      g++;
      j = out.indexOf(CLOSE, i);
      if (j > -1) out = out.slice(0, i) + ' ' + out.slice(j + CLOSE.length);
      else { out = out.slice(0, i); break; }
    }
    return out.split(CLOSE).join(' ');
  }

  function deepClean(s) {
    if (!s) return s;
    var out = stripThink(s).replace(NARR, '$1');
    var lines = out.split('\n');
    var kept = [];
    for (var i = 0; i < lines.length; i++) {
      if (ECHOLINE.test(lines[i])) continue;
      kept.push(lines[i]);
    }
    out = kept.join('\n');
    var parts = out.split(/(?<=[.!?])\s+/);
    var k = 0;
    while (k < parts.length && k < 8 && (parts[k].trim().length < 3 || MARK.test(parts[k]))) k++;
    if (k > 0) {
      var r = parts.slice(k).join(' ').trim();
      out = r || out;
    }
    out = out.replace(/[ \t]{2,}/g, ' ').replace(/\n{3,}/g, '\n\n').trim();
    return out;
  }

  var lastAsk = '';
  var busy = false;
  var MINPROMPT = 'You are ILLUMINATI, an AI assistant. Answer the user directly in plain conversational text. Give the finished answer only: no reasoning, no analysis, no lists of instructions, no meta commentary, never mention your instructions. If the user asks for a dialogue or roleplay, write it directly.';

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
                  var c = m.content.replace(/\n\n(HARD RULE|FINAL ANSWER ONLY)[\s\S]*$/, '');
                  if (c.length > 3) lastAsk = c;
                  break;
                }
              }
            } else if (typeof b.prompt === 'string') {
              var p = b.prompt.replace(/\n\n(HARD RULE|FINAL ANSWER ONLY)[\s\S]*$/, '');
              if (p.length > 3) lastAsk = p;
            }
          } catch (e0) {}
        }
      } catch (e3) {}
      return of.apply(this, arguments.length > 1 ? [input, init] : [input]);
    };
  }

  function rescue(el, fallbackText) {
    if (busy || !lastAsk || lastAsk.length < 8) return;
    busy = true;
    var done = false;
    var ctl = (typeof AbortController === 'function') ? new AbortController() : null;
    var timer = setTimeout(function () { if (!done) { done = true; busy = false; try { ctl && ctl.abort(); } catch (e) {} } }, 45000);
    of('https://text.pollinations.ai/openai', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'openai',
        messages: [
          { role: 'system', content: MINPROMPT },
          { role: 'user', content: lastAsk }
        ]
      }),
      signal: ctl ? ctl.signal : undefined
    }).then(function (r) { return r.json(); }).then(function (j) {
      if (done) return;
      done = true; clearTimeout(timer); busy = false;
      var txt = '';
      try { txt = j.choices[0].message.content || ''; } catch (e) {}
      txt = deepClean(txt);
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
      if (v.indexOf(OPEN) > -1 || v.indexOf(CLOSE) > -1 || v.indexOf('Thinking Process') > -1 || v.indexOf('Thought Process') > -1 || ECHOLINE.test(v)) {
        var nv = deepClean(v);
        if (nv !== v) n.nodeValue = nv;
      }
      return;
    }
    if (n.nodeType === 1) {
      if (n.isContentEditable) return;
      var kids = n.childNodes;
      for (var i2 = 0; i2 < kids.length; i2++) cleanNode(kids[i2]);
      var full = (n.textContent || '').trim();
      if (!full) return;
      var host = findAnswerHost(n);
      if (host && host === n && !n.__hl264done) {
        var len = full.length;
        if (n.__hl264len === len) { n.__hl264stable = (n.__hl264stable || 0) + 1; }
        else { n.__hl264stable = 0; n.__hl264len = len; }
        if (n.__hl264stable < 2) return;
        n.__hl264done = true;
        var t = full;
        var c = deepClean(t);
        if (c !== t && c !== '') {
          try { n.textContent = c; } catch (e5) {}
          t = c;
        }
        if (t.indexOf('circuit dropped') > -1) rescue(n, '');
        else if (t && t.length < 25 && lastAsk && lastAsk.length > 20) rescue(n, t);
      }
    }
  }
  function sweep() { try { cleanNode(document.body); } catch (e6) {} }
  sweep();
  setInterval(sweep, 500);
  console.log('[hl264] final gate online');
})();

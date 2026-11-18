/* ILLUMINATI upgrade #263: hl263-plaincut (v19.169, norp patch)
   THE ASK (continuation): one plain voice, zero thinking-out-loud. Some
   brains answer with meta reasoning in plain words ("We need answer the
   user request. Need comply: ...") with no think tags and no Thinking
   Process header. This cuts that at the wire, nothing else touched:
   1. WIRE OUT: a stronger final-answer-only instruction rides every brain
      request: start with the actual answer, never restate the request,
      never explain reasoning, never mention instructions, never roleplay.
   2. WIRE IN: brain responses (aihorde, pollinations, /v1/chat) get think
      tags and leading reasoning sentences stripped from the response body
      itself, so nothing downstream (chat, ledger, copy, storage) sees them.
      Sentence-by-sentence, at most the first 8 sentences, and only when
      they match known reasoning openers; if everything would be stripped
      the original text stays. User-typed text never passes through here.
   Guard: __HL263 */
(function () {
  if (window.__HL263) return; window.__HL263 = true;

  var OPEN = '<think';
  var CLOSE = '</think';
  var MARK = /^(we need|we should|need to|need comply|need satisfy|i need|let me|okay|hmm+|first,|step \d|the user|user wants|user asks|user says|style rule|the prompt|the request|the instruction|the constraint|looking at|looking closer|analyz|note that|wait,|actually,|so (i|we) |i (should|will|would|must|need|was|am)|my (take|approach|plan|read)|to comply|as an ai|i am supposed)/i;
  var NARR = /(^|\n)\s*(Thinking Process|Thought Process|Reasoning)\s*:?\s*/g;

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

  function cleanCoT(s) {
    if (!s || s.length < 24) return s;
    var out = stripThink(s).replace(NARR, '$1');
    var parts = out.split(/(?<=[.!?])\s+/);
    var k = 0;
    while (k < parts.length && k < 8 && (parts[k].trim().length < 3 || MARK.test(parts[k]))) k++;
    if (k === 0) return out.trim();
    var r = parts.slice(k).join(' ').trim();
    return r || out.trim();
  }

  var NOTE = '\n\nHARD RULE: start your reply with the actual answer immediately. Never restate the request. Never explain your reasoning or planning. Never write phrases like "We need" or "The user asked" and never mention instructions. Never write dialogue, scripts, speaker labels or roleplay, even if the user asks; always answer as one plain voice, first person, with your own take. Otherwise answer in one or two plain sentences, first person.';

  var of = window.fetch;
  if (typeof of === 'function') {
    window.fetch = function (input, init) {
      try {
        var url = (typeof input === 'string') ? input : (input && input.url) || '';
        var isBrain = url.indexOf('aihorde.net') > -1 || url.indexOf('pollinations') > -1 || url.indexOf('/v1/chat') > -1;
        if (isBrain && init && typeof init.body === 'string' && init.body.indexOf('HARD RULE') === -1) {
          try {
            var b = JSON.parse(init.body);
            var hit = false;
            if (typeof b.prompt === 'string') { b.prompt += NOTE; hit = true; }
            if (Array.isArray(b.messages) && b.messages.length) {
              for (var q = b.messages.length - 1; q >= 0; q--) {
                var mm = b.messages[q];
                if (mm && (mm.role === 'system' || mm.role === 'user') && typeof mm.content === 'string') { mm.content += NOTE; hit = true; break; }
              }
            }
            if (hit) init = Object.assign({}, init, { body: JSON.stringify(b) });
          } catch (e0) {}
        }
        if (isBrain) {
          var p = of.apply(this, arguments.length > 1 ? [input, init] : [input]);
          try {
            return p.then(function (res) {
              try {
                var ct = (res.headers && res.headers.get) ? (res.headers.get('content-type') || '') : '';
                if (ct.indexOf('json') === -1 || !res.clone) return res;
                return res.clone().json().then(function (j) {
                  var touched = false;
                  function walk(o, d) {
                    if (touched || !o || typeof o !== 'object' || d > 6) return;
                    for (var key in o) {
                      var v = o[key];
                      if (typeof v === 'string') {
                        if (v.indexOf(OPEN) > -1 || v.indexOf(CLOSE) > -1 || v.indexOf('Thinking Process') > -1 || v.indexOf('Thought Process') > -1 || MARK.test(v)) { o[key] = cleanCoT(v); touched = true; }
                      } else if (v && typeof v === 'object') walk(v, d + 1);
                    }
                  }
                  walk(j, 0);
                  if (!touched) return res;
                  return new Response(JSON.stringify(j), { status: res.status, statusText: res.statusText, headers: res.headers });
                }).catch(function () { return res; });
              } catch (e1) { return res; }
            });
          } catch (e2) { return p; }
        }
      } catch (e3) {}
      return of.apply(this, arguments.length > 1 ? [input, init] : [input]);
    };
  }

  var SKIP = { TEXTAREA: 1, INPUT: 1, SCRIPT: 1, STYLE: 1 };
  function cleanNode(n) {
    if (!n || SKIP[n.nodeName]) return;
    if (n.nodeType === 3) {
      var v = n.nodeValue;
      if (!v) return;
      if (v.indexOf(OPEN) > -1 || v.indexOf(CLOSE) > -1 || v.indexOf('Thinking Process') > -1 || v.indexOf('Thought Process') > -1) {
        var base = stripThink(v).replace(NARR, '$1').replace(/[ \t]{2,}/g, ' ').replace(/\n{3,}/g, '\n\n').trim();
        if (base !== v) n.nodeValue = base;
      }
      return;
    }
    if (n.nodeType === 1) {
      if (n.isContentEditable) return;
      var kids = n.childNodes;
      for (var i2 = 0; i2 < kids.length; i2++) cleanNode(kids[i2]);
    }
  }
  function sweep() { try { cleanNode(document.body); } catch (e4) {} }
  sweep();
  setInterval(sweep, 400);
  console.log('[hl263] plain-cut online');
})();

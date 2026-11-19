/* ILLUMINATI upgrade 291 - REAL VOICE (hl291)
   Fix the way it responds: answers come out like a real person talking -
   direct, raw, in real words, length matched to the question.
   Three layers:
   1. every relay ticket gets a real-voice directive,
   2. every relay response is scrubbed of instruction echoes, [brain] dumps,
      parenthetical meta notes and trailing question chains,
   3. the final merged answer gets the same scrub before it hits the screen.
   Nothing else changes, nothing removed.
*/
(function () {
  if (window.__HL291) return; window.__HL291 = true;

  var DIRECTIVE = 'REAL VOICE RULE: answer like a real person talking, in your own voice and attitude. Answer the actual question directly and match the length to it - a simple question gets one or two sentences. No preamble or setup. No notes about how you are answering. Never repeat or echo any instructions you were given. No bracketed labels like [brain] or [think]. No parenthetical notes explaining your answer style. No chains of follow-up questions. No technical jargon or corporate buzzwords. Just the real answer.';

  var META_LINE = /^(ANSWER IN REAL LANGUAGE|ANSWER IN YOUR OWN WORDS|BE LIKE YOU|directly answer the question|no build-up|no setup|no extra info|no apologies|no explanations|no justifications|just the real answer|don'?t spend time.*|answer in real-time.*|answer as a real, everyday person.*)[.!]?$/i;

  function scrub(text) {
    var t = String(text || '');
    if (!t) return t;
    var lines = t.split('\n'), out = [];
    for (var i = 0; i < lines.length; i++) {
      var L = lines[i].trim();
      if (!L) { out.push(lines[i]); continue; }
      if (META_LINE.test(L)) continue;
      if (/^\(Note: /.test(L)) {
        var depth = 0, j = i;
        for (; j < lines.length; j++) {
          depth += (lines[j].match(/\(/g) || []).length - (lines[j].match(/\)/g) || []).length;
          if (depth <= 0) break;
        }
        i = j; continue;
      }
      out.push(lines[i]);
    }
    t = out.join('\n');
    t = t.replace(/\[brain\][\s\S]*?(?=\n\n|$)/gi, '');
    t = t.replace(/\[(brain|think|step [^\]]*)\]/gi, '');
    t = t.replace(/Step through the questions and answer directly[\s\S]*$/i, '');
    var qlines = t.split('\n'), tail = qlines.length, run = 0;
    for (var k = qlines.length - 1; k >= 0; k--) {
      var s = qlines[k].trim();
      if (!s) { if (run >= 3) tail = k; continue; }
      if (s.charAt(s.length - 1) === '?' && s.length < 140) { run++; if (run >= 3) tail = k; }
      else break;
    }
    if (tail < qlines.length && run >= 3) t = qlines.slice(0, tail).join('\n');
    t = t.replace(/\n{3,}/g, '\n\n').trim();
    return t || String(text);
  }

  var of = window.fetch;
  window.fetch = function (input, init) {
    try {
      var url = (typeof input === 'string') ? input : (input && input.url) || '';
      if (/pollinations\.ai/.test(url) && init && typeof init.body === 'string' && init.method === 'POST') {
        var j = null;
        try { j = JSON.parse(init.body); } catch (e1) { j = null; }
        if (j && j.messages && j.messages.length) {
          var msgs = j.messages.slice(), sysIdx = -1;
          for (var m = 0; m < msgs.length; m++) if (msgs[m] && msgs[m].role === 'system') { sysIdx = m; break; }
          if (sysIdx >= 0 && !/REAL VOICE RULE/.test(String(msgs[sysIdx].content || ''))) {
            msgs[sysIdx] = { role: 'system', content: String(msgs[sysIdx].content) + '\n\n' + DIRECTIVE };
          } else if (sysIdx < 0) {
            msgs.unshift({ role: 'system', content: DIRECTIVE });
          }
          init = Object.assign({}, init, { body: JSON.stringify(Object.assign({}, j, { messages: msgs })) });
        }
      }
    } catch (e2) {}
    var pr = of.apply(this, [input, init]);
    return pr.then(function (r) {
      try {
        var ct = r.headers && r.headers.get ? (r.headers.get('content-type') || '') : '';
        if (r && r.ok && /json/i.test(ct)) {
          var clone = r.clone();
          return clone.json()['catch'](function () { return null; }).then(function (data) {
            try {
              if (data && data.choices && data.choices[0] && data.choices[0].message && typeof data.choices[0].message.content === 'string') {
                var clean = scrub(data.choices[0].message.content);
                if (clean !== data.choices[0].message.content) {
                  var body = JSON.stringify(Object.assign({}, data, { choices: [{ index: 0, message: { role: 'assistant', content: clean }, finish_reason: data.choices[0].finish_reason }] }));
                  return new Response(body, { status: r.status, statusText: r.statusText, headers: r.headers });
                }
              }
            } catch (e3) {}
            return r;
          });
        }
      } catch (e4) {}
      return r;
    });
  };

  var prev = window.askOmni;
  if (prev) {
    window.askOmni = function (user) {
      var p;
      try { p = Promise.resolve(prev.apply(this, arguments)); } catch (e5) { p = Promise.resolve(null); }
      return p.then(function (ans) {
        if (!ans) return ans;
        return scrub(ans);
      })['catch'](function () { return prev.apply(this, arguments); });
    };
  }

  try { console.log('[hl291] real voice online: answers come out like a person, instruction echoes and [brain] dumps scrubbed'); } catch (e6) {}
})();

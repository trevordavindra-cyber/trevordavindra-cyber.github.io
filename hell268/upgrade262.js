/* ILLUMINATI upgrade #262: hl262-thinkwipe (v19.167)
   THE ASK (continuation): the ai must type like you and I - one plain voice,
   zero thinking-out-loud. Some brains dump raw reasoning into the chat
   ("-thinking- Thinking Process ..." blocks) before or instead of the answer.
   This kills that at every layer, nothing else touched:
   1. WIRE OUT: every brain request now also carries FINAL ANSWER ONLY - reply
      with the finished answer in one or two plain sentences, never reasoning.
   2. WIRE IN: brain responses (aihorde, pollinations, /v1/chat) get think
      blocks and thinking narration stripped out of the response body itself,
      so nothing downstream (chat, ledger, copy, storage) ever sees it.
   3. RENDER: anything already shown gets swept every 400ms - think blocks,
      thinking narration and trailing close tags are removed live from answer
      text only (typing areas, inputs, scripts untouched).
   Guard: __HL262 */
(function () {
  if (window.__HL262) return; window.__HL262 = true;
  var OPEN = '<think';
  var CLOSE = '</think';
  var NARR = /(^|\n)\s*(Thinking Process|Thought Process|Reasoning)\s*:?\s*/g;

  function stripThink(s) {
    if (!s) return s;
    if (s.indexOf(OPEN) === -1 && s.indexOf(CLOSE) === -1 && s.indexOf('Thinking Process') === -1 && s.indexOf('Thought Process') === -1) return s;
    var out = s, i, j, guard = 0;
    while ((i = out.indexOf(OPEN)) > -1 && guard < 60) {
      guard++;
      j = out.indexOf(CLOSE, i);
      if (j > -1) out = out.slice(0, i) + ' ' + out.slice(j + CLOSE.length);
      else { out = out.slice(0, i); break; }
    }
    out = out.split(CLOSE).join(' ');
    out = out.replace(NARR, '$1');
    out = out.replace(/[ \t]{2,}/g, ' ');
    out = out.replace(/\n{3,}/g, '\n\n');
    return out.trim();
  }

  var NOTE = '\n\nFINAL ANSWER ONLY: reply with the finished answer in one or two plain sentences, first person. Never show reasoning, thinking, analysis, planning, or meta commentary.';

  var of = window.fetch;
  if (typeof of === 'function') {
    window.fetch = function (input, init) {
      try {
        var url = (typeof input === 'string') ? input : (input && input.url) || '';
        var isBrain = url.indexOf('aihorde.net') > -1 || url.indexOf('pollinations') > -1 || url.indexOf('/v1/chat') > -1;
        if (isBrain && init && typeof init.body === 'string' && init.body.indexOf('FINAL ANSWER ONLY') === -1) {
          try {
            var b = JSON.parse(init.body);
            var hit = false;
            if (typeof b.prompt === 'string') { b.prompt += NOTE; hit = true; }
            if (Array.isArray(b.messages) && b.messages.length) {
              for (var k = b.messages.length - 1; k >= 0; k--) {
                var m = b.messages[k];
                if (m && (m.role === 'system' || m.role === 'user') && typeof m.content === 'string') { m.content += NOTE; hit = true; break; }
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
                        if (v.indexOf(OPEN) > -1 || v.indexOf(CLOSE) > -1 || v.indexOf('Thinking Process') > -1 || v.indexOf('Thought Process') > -1) { o[key] = stripThink(v); touched = true; }
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
        var nv = stripThink(v);
        if (nv !== v) n.nodeValue = nv;
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
  console.log('[hl262] think-wipe online');
})();

/* ILLUMINATI upgrade 288 - OMNIBRAIN QUALITY CORE (hl288)
   PROJECT OMNIBRAIN phase 3+7: specialist role layer + independent quality control.
   After the fused answer lands, a strict critic pass re-reads the QUESTION and the
   ANSWER with a role-aware checklist (math / logic / code / research / strategy /
   security). Concrete errors come back as a FIX; the corrected answer is used.
   The original always wins if the critic stalls or only nitpicks. Nothing removed.
*/
(function () {
  if (window.__HL288) return; window.__HL288 = true;

  var ROLES = [
    { id: 'math',     re: /\b(math|calculate|compute|solve|equation|percent|fraction|probability|derivative|integral|algebra|geometry)\b|\d+\s*[-+*/^]\s*\d+/i,
      chk: 'Re-derive every calculation yourself. Wrong arithmetic or wrong setup is the #1 failure. Verify each number.' },
    { id: 'logic',    re: /\b(logic|riddle|puzzle|if .* then|deduce|infer|argument|fallacy|proof)\b/i,
      chk: 'Check the logical chain step by step. Name any hidden assumption the answer leans on.' },
    { id: 'code',     re: /\b(code|function|script|api|bug|error|python|javascript|html|css|sql|regex|compile|debug|stack ?trace|lua|roblox|luau)\b/i,
      chk: 'Check the code: syntax errors, off-by-one, wrong API names, missing edge cases. Mental-run the code before approving it.' },
    { id: 'research', re: /\b(who|when|where|what year|latest|current|history|compare|versus|vs |source|according)\b/i,
      chk: 'Check dates, names and figures for internal consistency. Flag anything stated with suspicious confidence.' },
    { id: 'strategy', re: /\b(plan|strategy|decide|should i|best way|optimize|steps to|roadmap)\b/i,
      chk: 'Check the plan for missing dependencies, unrealistic steps and unpriced trade-offs.' },
    { id: 'security', re: /\b(security|vulnerab|hack|exploit|password|encrypt|privacy|scam|phish)\b/i,
      chk: 'Check safety claims. Unsafe advice must be flagged, not smoothed over.' }
  ];

  function classify(q) {
    var out = [];
    for (var i = 0; i < ROLES.length; i++) { try { if (ROLES[i].re.test(String(q || ''))) out.push(ROLES[i]); } catch (e1) {} }
    return out;
  }

  var PURL = 'https://text.pollinations.ai/openai';

  function relay(messages, ms) {
    return new Promise(function (res) {
      var ctl = null; try { ctl = new AbortController(); } catch (e0) {}
      var t = setTimeout(function () { try { ctl && ctl.abort(); } catch (e) {} }, ms || 14000);
      var f = fetch(PURL, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ model: 'openai', messages: messages, private: true }), signal: ctl ? ctl.signal : undefined });
      f.then(function (r) { return r.json(); })
       .then(function (j) { clearTimeout(t); try { return j.choices[0].message.content; } catch (e) { return null; } })
       ['catch'](function () { clearTimeout(t); return null; })
       .then(function (t2) { res(t2); });
    });
  }

  function qc(user, ans) {
    var roles = classify(user);
    var checklist = roles.map(function (r) { return '- ' + r.chk; }).join('\n');
    var msgs = [
      { role: 'system', content: 'You are OMNIBRAIN QUALITY CONTROL, a strict independent reviewer. You are given a QUESTION and the ANSWER produced for it. Your only job: find CONCRETE errors (wrong facts, wrong math, broken logic, code that would not run, instructions ignored). Do not critique style, length or tone. Do not rewrite good parts. If you find a concrete error, output the FULL corrected answer on one line starting with "FIX: ". If the answer holds up, output exactly "OK". Nothing else.' },
      { role: 'user', content: 'REVIEW CHECKLIST (focus areas):\n' + (checklist || '- general correctness') + '\n\nQUESTION:\n' + String(user).slice(0, 3000) + '\n\nANSWER:\n' + String(ans).slice(0, 6000) }
    ];
    return relay(msgs, 14000).then(function (out) {
      if (!out) return null;
      var t = String(out).trim();
      if (/^OK\b/i.test(t)) { try { notice('ok', 'OMNIBRAIN', 'quality core: answer verified by critic pass'); } catch (e2) {} return null; }
      if (/^FIX:?\s*/i.test(t) && t.replace(/^FIX:?\s*/i, '').length > 120) {
        var fixed = t.replace(/^FIX:?\s*/i, '').trim();
        try { notice('ok', 'OMNIBRAIN', 'quality core: critic corrected the answer'); } catch (e3) {}
        try { feed('OMNIBRAIN QC :: critic pass corrected ' + roles.length + '-role answer', 'live'); } catch (e4) {}
        return fixed;
      }
      return null;
    })['catch'](function () { return null; });
  }

  var prev = window.askOmni;
  window.askOmni = function (user) {
    var self = this, args = arguments;
    var p;
    try { p = Promise.resolve(prev.apply(self, args)); } catch (e5) { p = Promise.resolve(null); }
    return p.then(function (ans) {
      if (!ans || String(ans).length < 260) return ans;
      if (!classify(user).length) return ans;
      return Promise.race([qc(user, ans), new Promise(function (r) { setTimeout(function () { r(null); }, 16000); })])
        .then(function (fixed) { return fixed || ans; })['catch'](function () { return ans; });
    })['catch'](function (e6) { return prev ? prev.apply(self, args) : Promise.resolve(null); });
  };

  try { console.log('[hl288] omnibrain quality core online: role-aware critic pass on every real answer'); } catch (e7) {}
})();

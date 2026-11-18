/* ILLUMINATI upgrade #280: hl280-study (v19.186)
   "add everything raena ai can do to my illuminati ai" - the study app's
   toolkit, built in free with no accounts:
   (1) STUDY MODE: an ask starting with "study:" turns the notes into a
       summary, a 5-question quiz (answers at the end) and flashcards.
   (2) SOLO MODES: "quiz:", "flashcards:", "summarize:" each do one thing.
   (3) PODCAST MODE: "podcast:" turns the notes into a spoken lesson and
       the phone reads it out loud through the built-in voice, free.
   (4) TUTOR: normal chat already acts as the tutor.
   Nothing removed. Guard: __HL280 */
(function () {
  if (window.__HL280) return; window.__HL280 = true;

  var of = window.fetch;
  if (typeof of !== 'function' || of.__hl280) return;

  function splitAsk(raw) {
    var m = String(raw || '').match(/^\s*(study|quiz|flashcards?|summarize|podcast)\b\s*[:\-]?\s*([\s\S]*)$/i);
    if (!m) return null;
    return { mode: m[1].toLowerCase(), notes: (m[2] || '').trim() };
  }

  function brief(mode, notes) {
    if (!notes) {
      return '[STUDY MODE] The operator typed the command "' + mode + '" with no notes. Briefly explain what each study command does (study, quiz, flashcards, summarize, podcast) in under 60 words.';
    }
    if (mode === 'study') {
      return '[STUDY MODE] Teach from ONLY the notes below. Output exactly three sections:\n1) SUMMARY - the key ideas in at most 6 short bullets.\n2) QUIZ - 5 multiple-choice questions (A/B/C/D), answers listed at the very end.\n3) FLASHCARDS - 8 cards, each as Q: ... A: ...\n\nNOTES:\n' + notes;
    }
    if (mode === 'quiz') {
      return '[STUDY MODE] From ONLY the notes below, write a quiz of 6 questions mixing multiple-choice (A/B/C/D) and short answer, then list the correct answers at the end.\n\nNOTES:\n' + notes;
    }
    if (mode === 'flashcards') {
      return '[STUDY MODE] From ONLY the notes below, write 10 flashcards. Each card is exactly two lines: Q: ... then A: ...\n\nNOTES:\n' + notes;
    }
    if (mode === 'summarize') {
      return '[STUDY MODE] Summarize ONLY the notes below in plain language: key ideas first, then the details that matter, then anything worth memorizing.\n\nNOTES:\n' + notes;
    }
    return '[STUDY MODE] Turn the notes below into a short podcast lesson: a friendly host teaching the material step by step, plain speech only (no headings, no bullet symbols, no stage directions), about 300 words.\n\nNOTES:\n' + notes;
  }

  var speakUntil = 0;

  function speak(text) {
    try {
      if (Date.now() > speakUntil || !window.speechSynthesis || !text) return;
      var t = String(text).replace(/[#*_`>]/g, '').slice(0, 4000);
      if (t.length < 80) return;
      speakUntil = 0;
      var u = new SpeechSynthesisUtterance(t);
      u.rate = 1.05; u.pitch = 1;
      var vs = speechSynthesis.getVoices() || [];
      for (var i = 0; i < vs.length; i++) { if (/en[-_]US/i.test(vs[i].lang)) { u.voice = vs[i]; break; } }
      speechSynthesis.cancel();
      speechSynthesis.speak(u);
    } catch (eS) {}
  }

  var wrapped = async function () {
    var a = Array.prototype.slice.call(arguments);
    var input = a[0], init = a[1];
    var url = (typeof input === 'string') ? input : (input && input.url) || '';
    try {
      var isAsk = (url.indexOf('/generate/text/async') > -1 || url.indexOf('text.pollinations.ai') > -1) && init && typeof init.body === 'string' && init.body.charAt(0) === '{';
      if (isAsk) {
        var b = JSON.parse(init.body);
        if (typeof b.prompt === 'string') {
          var mm = b.prompt.match(/\nUser: ([\s\S]*?)\nILLUMINATI:\s*$/);
          if (mm) {
            var s = splitAsk(mm[1]);
            if (s) {
              var nb = b.prompt.slice(0, mm.index) + '\nUser: ' + brief(s.mode, s.notes) + '\nILLUMINATI:';
              b.prompt = nb;
              init.body = JSON.stringify(b);
              if (s.mode === 'podcast') speakUntil = Date.now() + 180000;
            }
          }
        } else if (Array.isArray(b.messages) && b.messages.length) {
          var last = b.messages[b.messages.length - 1];
          if (last && typeof last.content === 'string') {
            var s2 = splitAsk(last.content);
            if (s2) {
              last.content = brief(s2.mode, s2.notes);
              init.body = JSON.stringify(b);
              if (s2.mode === 'podcast') speakUntil = Date.now() + 180000;
            }
          }
        }
      }
    } catch (e1) {}
    var p = of.apply(this, a);
    try {
      if (Date.now() <= speakUntil && url.indexOf('/generate/text/status/') > -1) {
        return p.then(function (r) {
          try {
            r.clone().json().then(function (d) {
              var g = d && d.generations;
              if (Array.isArray(g) && g.length && g[0] && g[0].text) speak(g[0].text);
            }).catch(function () {});
          } catch (e2) {}
          return r;
        });
      }
      if (Date.now() <= speakUntil && url.indexOf('text.pollinations.ai/openai') > -1 && init && init.method === 'POST') {
        return p.then(function (r) {
          try {
            var ct = r.headers.get('content-type') || '';
            if (ct.indexOf('json') > -1) {
              r.clone().json().then(function (d) {
                var t = d && d.choices && d.choices[0] && d.choices[0].message && d.choices[0].message.content;
                if (t) speak(t);
              }).catch(function () {});
            }
          } catch (e3) {}
          return r;
        });
      }
    } catch (e4) {}
    return p;
  };

  wrapped.__hl280 = true;
  window.fetch = wrapped;
  try { console.log('[hl280] study online: study/quiz/flashcards/summarize/podcast commands, podcast read aloud'); } catch (e5) {}
})();

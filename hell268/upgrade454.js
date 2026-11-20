/* ILLUMINATI upgrade 454 - JOB APPLICATION MODE (hl454)
   Frontier directive: an application built from the posting's own words. Nothing removed.
*/
(function () {
  if (window.__HL454) return; window.__HL454 = true;

  var RP = /\b(job application|apply for|cover letter|tailor my resume|job posting|hiring for)\b/i;
  var DIRECTIVE = "JOB APPLICATION RULE: when the asker applies for a job, read the posting first and mirror its own words for the skills it names, map their real experience to the top three requirements, and quantify honestly (numbers they actually know). Keep the resume one page, write the cover letter about the employer's problem they can solve rather than their own biography, and never invent experience, titles or dates. Flag any requirement they do not meet and say how to address it instead of hiding it.";

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

  try { console.log('[hl454] job application mode online: mirror the posting, top three requirements, no invented experience'); } catch (e3) {}
})();

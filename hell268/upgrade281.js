/* ILLUMINATI upgrade #281: hl281-brain (v19.187)
   "make the ai as smart as chatgpt" - as smart as the free servers allow,
   with zero dollars:
   (1) THINK LAYER: every ask now carries a step-by-step thinking directive,
       so the answer is reasoned out before it lands.
   (2) CHECK LAYER: math, numbers and factual asks get an explicit
       double-check instruction, the single biggest accuracy fix for
       smaller free models.
   (3) The swarm (hl270) already routes each ask across the strongest free
       models available, including the 128B-class brains; ChatGPT itself
       runs on paid servers, which stay off this site.
   Nothing removed. Guard: __HL281 */
(function () {
  if (window.__HL281) return; window.__HL281 = true;

  var of = window.fetch;
  if (typeof of !== 'function' || of.__hl281) return;

  var MARK = '[BRAIN]';
  var NUDGE = '\n\n' + MARK + ' Think this through step by step before answering. Be accurate and specific. If the ask involves math, numbers or facts, work it out carefully and double-check the result before you answer. Then give the final answer directly, no build-up.';

  function needsNudge(text) {
    var t = String(text || '');
    return t.indexOf(MARK) === -1 && t.length < 3800;
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
          if (mm && needsNudge(mm[1])) {
            b.prompt = b.prompt.slice(0, mm.index) + '\nUser: ' + mm[1] + NUDGE + '\nILLUMINATI:';
            init.body = JSON.stringify(b);
          }
        } else if (Array.isArray(b.messages) && b.messages.length) {
          var last = b.messages[b.messages.length - 1];
          if (last && last.role === 'user' && typeof last.content === 'string' && needsNudge(last.content)) {
            last.content = last.content + NUDGE;
            init.body = JSON.stringify(b);
          }
        }
      }
    } catch (e1) {}
    return of.apply(this, a);
  };

  wrapped.__hl281 = true;
  window.fetch = wrapped;
  try { console.log('[hl281] brain online: think + double-check layer on every ask'); } catch (e2) {}
})();

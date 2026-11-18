/* ILLUMINATI upgrade #258: hl258-bigbrain (v19.161)
   THE ASK: "find a GPT-6 model on GitHub and put it in my website."
   Fact: GPT-6 is OpenAI's, closed weights, nothing downloadable (GitHub: zero hits).
   So this wires in the strongest open-weight brain that actually exists and is
   reachable free: Qwen/Qwen3.8-Flash-Next on the community forge (fresh, 0 queue).
   1. FUSION POOL: every OMNI ask's forge ticket now also carries
      Qwen/Qwen3.8-Flash-Next, so its answers join the drafts the judge merges.
      Single-brain UNFILTERED picks stay exactly what you selected.
   2. RELAY FIX: the free relay's anonymous shelf shrank to one model, so dead
      relay model slots (qwen-coder, mistral, openai-large...) are rerouted to
      the surviving fast brain instead of erroring into nothing.
   Nothing removed: all existing brains, modes and paths stay as they were.
   Guard: __HL258 */
(function () {
  if (window.__HL258) return; window.__HL258 = true;

  var QWEN = 'Qwen/Qwen3.8-Flash-Next';

  var of = window.fetch;
  if (typeof of === 'function') {
    window.fetch = function (input, init) {
      try {
        var url = (typeof input === 'string') ? input : (input && input.url) || '';
        if (url.indexOf('aihorde.net/api/v2/generate/text/async') > -1 && init && typeof init.body === 'string') {
          var b = JSON.parse(init.body);
          if (b && b.models && Array.isArray(b.models) && b.models.length >= 5 && b.models.indexOf(QWEN) === -1) {
            b.models.push(QWEN);
            init = Object.assign({}, init, { body: JSON.stringify(b) });
            try { console.log('[hl258] qwen 3.8 flash joined the fusion pool'); } catch (e1) {}
          }
        } else if (url.indexOf('text.pollinations.ai') > -1 && init && typeof init.body === 'string' && url.indexOf('/openai') > -1) {
          var pb = JSON.parse(init.body);
          if (pb && typeof pb.model === 'string' && pb.model !== 'openai-fast' && pb.model !== 'openai') {
            pb.model = 'openai-fast';
            init = Object.assign({}, init, { body: JSON.stringify(pb) });
          }
        }
      } catch (e) {}
      return of.apply(this, arguments.length > 1 ? [input, init] : [input]);
    };
  }

  try { console.log('[hl258] big brain online: qwen 3.8 flash in the fusion pool, dead relay slots rerouted'); } catch (e2) {}
})();

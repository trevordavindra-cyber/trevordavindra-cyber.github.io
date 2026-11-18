/* ILLUMINATI upgrade #259: hl259-nerdcorp (v19.162)
   THE ASK: "find all of the best downloadable big corporation AIs, run them
   through github.com/p-e-w/heretic, then put them in my website, at least 5
   nerd models."
   Facts: heretic is a local GPU tool that strips refusals out of open-weight
   models (hours of GPU per model, tens of GB of weights), so it cannot run in
   this browser. What CAN be done: the big-corporation open-weight brains that
   HAVE already gone through heretic / uncensored passes and are live on the
   community forge are wired in here, straight from the live AI Horde catalog.
   1. NERD CORP POOL: 8 new big-corp-derived brains appended to the forge pool,
      dupe-guarded, so they show up in AI MODEL SELECTION, /models and the OMNI
      fusion pool (labels mark the maker and the heretic pass):
      GEMMA-4 E4B HERETIC ULTRA  - Google Gemma 4, heretic'd
      GEMMA-4 E4B UNHAUHAU       - Google Gemma 4, uncensored
      QWEN3.5 9B / QWEN3.5 4B    - Alibaba Qwen
      LLAMA 3.2 3B               - Meta Llama
      CYDONIA 24B                - Mistral 24B, uncensored
      NEMOMIX 12B                - Mistral Nemo, unleashed
      WICKED TUTU 31B            - Gemma-based, uncensored
   2. POOL COUNT: the diagnostics "OMNI (7-brain pool)" text now reports the
      real pool size.
   Nothing removed: every existing brain, mode and path stays as it was.
   Guard: __HL259 */
(function () {
  if (window.__HL259) return; window.__HL259 = true;
  var ADD = [
    { id: 'koboldcpp/Gemma-4-E4B-it-Ultra-Uncensored-Heretic', label: 'GEMMA-4 E4B HERETIC ULTRA' },
    { id: 'koboldcpp/Gemma-4-E4B-Uncensored-HauhauCS-Aggressive-Q4_K_M', label: 'GEMMA-4 E4B UNHAUHAU' },
    { id: 'lmstudio/Qwen3.5-9B', label: 'QWEN3.5 9B' },
    { id: 'koboldcpp/Qwen3.5-4B', label: 'QWEN3.5 4B' },
    { id: 'koboldcpp/Llama-3.2-3B-Instruct', label: 'LLAMA 3.2 3B' },
    { id: 'koboldcpp/Cydonia-24B-v4zg-Q4_K_M', label: 'CYDONIA 24B' },
    { id: 'koboldcpp/NemoMix-Unleashed-12B-Q6_K', label: 'NEMOMIX 12B' },
    { id: 'ReadyArt/Wicked-Tutu-31B-Final', label: 'WICKED TUTU 31B' }
  ];
  var n = 0;
  try {
    ADD.forEach(function (m) { if (typeof UNF !== 'undefined' && !UNF.some(function (x) { return x.id === m.id; })) { UNF.push(m); n++; } });
  } catch (e) {}
  try {
    var orig = window.renderStatus;
    if (typeof orig === 'function') {
      window.renderStatus = function () {
        var r = orig.apply(this, arguments);
        try {
          var el = document.getElementById('s-lines');
          if (el && typeof UNF !== 'undefined') el.innerHTML = el.innerHTML.replace(/OMNI \(\d+-brain pool\)/, 'OMNI (' + UNF.length + '-brain pool)');
        } catch (e2) {}
        return r;
      };
    }
  } catch (e3) {}
  try { if (typeof renderBrain === 'function') renderBrain(); } catch (e4) {}
  try { if (typeof paintBrain === 'function') paintBrain(); } catch (e5) {}
  console.log('[hl259] ' + n + ' big-corp heretic brains joined the pool (total ' + UNF.length + ')');
})();

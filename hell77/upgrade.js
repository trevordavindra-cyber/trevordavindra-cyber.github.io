// ILLUMINATI upgrade #1: Ambient Gate Glow (v18.7)
// Subtle pulsing glow around the gate-screen eye sigil. Additive only.
(function () {
  function init() {
    try {
      var gate = document.getElementById('gate');
      if (!gate) return;
      var sigil = gate.querySelector('svg.sigil') || gate.querySelector('svg');
      if (!sigil || sigil.dataset.ambientGlow) return;
      sigil.dataset.ambientGlow = '1';
      var st = document.createElement('style');
      st.id = 'hl-upgrade1-glow';
      st.textContent = [
        '@keyframes hlGlowPulse {',
        '  0%,100% { filter: drop-shadow(0 0 6px rgba(220,40,40,.35)); opacity:.92; }',
        '  50% { filter: drop-shadow(0 0 16px rgba(220,40,40,.7)); opacity:1; }',
        '}',
        '#gate svg.sigil { animation: hlGlowPulse 4.5s ease-in-out infinite; will-change: filter, opacity; }',
        '@media (prefers-reduced-motion: reduce) { #gate svg.sigil { animation: none; } }'
      ].join('\n');
      document.head.appendChild(st);
    } catch (e) { /* silent */ }
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();

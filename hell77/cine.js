/* restores the startup cinema close (skip button + auto-close), missing since v18. additive only. */
(function(){
  const c = document.getElementById('cine');
  if (!c) return;
  const RM = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
  let UIp = {};
  try { UIp = JSON.parse(localStorage.getItem('hl28-ui') || '{}'); } catch (e) {}
  const done = () => { c.classList.add('out'); setTimeout(() => c.remove(), 950); };
  if (UIp.cine === 0 || RM()) { c.remove(); return; }
  const s = document.getElementById('c-skip');
  if (s) s.addEventListener('click', done);
  setTimeout(done, 3600);
})();

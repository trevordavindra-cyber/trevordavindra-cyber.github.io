// ILLUMINATI upgrade #14: hl14-button-hover (v18.20)
// Adds a subtle cyan glow ring to buttons on hover for desktop pointer devices.
// Additive only. Injected by overnight upgrade run.
(function(){var d=document;if(!d||!d.head)return;var s=document.createElement('style');s.textContent='@media (hover: hover) and (pointer: fine){button:hover,.btn:hover{box-shadow:0 0 5px cyan;transition:box-shadow .2s}}';d.head.appendChild(s);hl14_buttonHover=true;})();
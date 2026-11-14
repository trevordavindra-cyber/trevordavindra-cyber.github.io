// ILLUMINATI upgrade #15: hl15-selection-style (v18.21)
// Injects a ::selection style so selected text uses the site cyan theme (cyan-tinted background, light text) instead of the browser default.
// Additive only. Injected by overnight upgrade run.
(function(){if(!document||!document.head)return;var s=document.createElement('style');s.id='hl15-selection-style';s.textContent='::selection{background:rgba(0,229,255,.35);color:#eafcff;}';document.head.appendChild(s);})();

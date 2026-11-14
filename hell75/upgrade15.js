// ILLUMINATI upgrade #15: hl15-selection-style (v18.21)
// Injects a themed text-selection style (cyan selection with dark text) without touching base styles.
// Additive only. Injected by overnight upgrade run.
(function(){if(!document||!document.head)return;var st=document.createElement('style');st.id='hl15-selection';st.textContent='::selection{background:rgba(0,229,255,.35);color:#04141a;text-shadow:none;}::-moz-selection{background:rgba(0,229,255,.35);color:#04141a;text-shadow:none;}';document.head.appendChild(st);})();
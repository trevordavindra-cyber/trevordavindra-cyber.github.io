/* ILLUMINATI upgrade #51: hl51-touch (v18.59)
   built for thumbs: bigger tap targets across the command bar, snappier taps
   (no double-tap-zoom lag), and the CUT control moves to the far end of the row
   so it can never take a stray tap meant for SEND. */
(function(){
  const st=document.createElement('style'); st.id='hl51-touch';
  st.textContent=[
    'button{ touch-action:manipulation; -webkit-tap-highlight-color:transparent; }',
    '@media (max-width:900px){',
    ' #foot .act{ min-height:46px; min-width:64px; font-size:15px; }',
    ' #foot #clear{ min-height:46px; min-width:64px; }',
    ' #foot #txt{ font-size:16px; }',
    ' #foot{ gap:8px; }',
    ' #foot button{ margin:2px 3px; }',
    '}'
  ].join('\n');
  document.head.appendChild(st);
  function moveCut(){
    const s=document.getElementById('stop'), c=document.getElementById('clear');
    if(s&&c&&s.nextElementSibling!==c&&s.parentNode===c.parentNode){ c.parentNode.insertBefore(s,c.nextSibling); }
  }
  moveCut(); setInterval(moveCut,2000);
})();

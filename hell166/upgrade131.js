// ILLUMINATI upgrade #131: hl131-access-motion (v19.38)
// Ergonomics + access pass: gold focus-visible rings on every
// interactive element, comfortable 44px-class tap targets on
// phones for the nav rail and footer actions, a soft press
// response on buttons, and smooth scrolling. Purely additive
// CSS; nothing hidden, nothing moved, reduced-motion respected.
(function(){
  try{
    if(window.__HL131) return; window.__HL131=1;
    var st=document.createElement('style');
    st.id='hl131-style';
    st.textContent=[
      ':where(button,[role=button],a,input,textarea,select):focus-visible{outline:2px solid #C5A45B;outline-offset:2px;border-radius:2px;}',
      'button{transition:transform .08s ease;}',
      'button:active{transform:scale(.97);}',
      '@media (max-width:820px){',
      ' #nav button{min-height:44px;}',
      ' #foot .act,#foot button{min-height:44px;}',
      ' .pbtn{min-height:40px;}',
      '}',
      '@media (prefers-reduced-motion: reduce){',
      ' button{transition:none;}',
      ' button:active{transform:none;}',
      ' html{scroll-behavior:auto;}',
      '}',
      'html{scroll-behavior:smooth;}'
    ].join('\n');
    (document.head||document.documentElement).appendChild(st);
  }catch(e){}
})();

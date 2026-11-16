/* ILLUMINATI upgrade #127: hl127-institutional-css (v19.36)
   INSTITUTIONAL REDESIGN - visual layer only.
   Identity: ILLUMINATI / PRIVATE ARTIFICIAL INTELLIGENCE DIVISION.
   Palette: #080808 / #101010 / #151515, gold #C5A45B / #806B3F, text #EAE5D9 / #89857B, alert #761E25.
   Typography: Cinzel (institutional headings), Inter (interface), JetBrains Mono (technical).
   Additive restyle of the existing engine: no element is removed, no feature disabled.
   All new elements use the ord- prefix so the hl111 phone-display rule never hides them. __HL127 guard. */
(function(){
  try{
    if(window.__HL127) return; window.__HL127=1;

    var l1=document.createElement('link'); l1.rel='preconnect'; l1.href='https://fonts.googleapis.com'; document.head.appendChild(l1);
    var l2=document.createElement('link'); l2.rel='preconnect'; l2.href='https://fonts.gstatic.com'; l2.crossOrigin='anonymous'; document.head.appendChild(l2);
    var lf=document.createElement('link'); lf.rel='stylesheet';
    lf.href='https://fonts.googleapis.com/css2?family=Cinzel:wght@500;600;700&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap';
    document.head.appendChild(lf);

    var EMB="url('data:image/svg+xml;utf8," + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12 4 L21 20 L3 20 Z" fill="none" stroke="#C5A45B" stroke-width="1.6" stroke-linejoin="round"/><circle cx="12" cy="15" r="3.4" fill="none" stroke="#C5A45B" stroke-width="1.4"/><circle cx="12" cy="15" r="1.2" fill="#C5A45B"/></svg>') + "')";

    var G = encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="240" height="240" viewBox="0 0 240 240"><g fill="none" stroke="#C5A45B" stroke-width="0.6"><circle cx="120" cy="120" r="100"/><circle cx="120" cy="120" r="70"/><path d="M120 30 L210 190 L30 190 Z"/><path d="M120 62 L182 176 L58 176 Z"/><path d="M30 190 L120 30 L210 190" /><path d="M120 120 L120 30 M120 120 L210 190 M120 120 L30 190"/></g></svg>');

    var css = [
    /* palette remap: every existing component adopts the institutional gold */
    ':root{--bg:#080808;--bg2:#101010;--panel:#151515;--acc:#C5A45B;--acc2:#806B3F;--deep:#080808;--wht:#EAE5D9;--mut:#89857B;--alr:#761E25;--gold:#C5A45B;--gold2:#806B3F;--ink:#EAE5D9;--ink2:#89857B}',
    'html{background:#080808}',
    'html body{background:radial-gradient(ellipse 120% 70% at 50% -12%,#171512 0%,#080808 58%);color:#EAE5D9;font-family:Inter,-apple-system,BlinkMacSystemFont,\'Segoe UI\',sans-serif;-webkit-font-smoothing:antialiased}',
    '::selection{background:rgba(197,164,91,.85);color:#080808}',
    '::-webkit-scrollbar{width:8px;height:8px}',
    '::-webkit-scrollbar-thumb{background:rgba(197,164,91,.28);border-radius:4px}',
    '::-webkit-scrollbar-thumb:hover{background:rgba(197,164,91,.45)}',
    '::-webkit-scrollbar-track{background:transparent}',

    /* neutralize the old industrial FX */
    'body::before{display:none}',
    'body::after{content:\'\';position:fixed;inset:0;pointer-events:none;z-index:1;background:radial-gradient(ellipse 90% 55% at 50% -8%,rgba(197,164,91,.07),transparent 60%);animation:none}',
    'h1.glitch::before,h1.glitch::after{display:none}',

    /* geometry background + particle canvas */
    '#ordbg{position:fixed;inset:0;z-index:0;pointer-events:none;opacity:.05;background-image:url("'+G+'");background-size:340px 340px;background-position:center}',
    '#ordbgvig{position:fixed;inset:0;z-index:0;pointer-events:none;background:radial-gradient(ellipse 100% 80% at 50% 30%,transparent 40%,rgba(0,0,0,.55) 100%)}',
    '#ordfx{position:fixed;inset:0;z-index:0;pointer-events:none}',

    /* header */
    '#app{background:transparent}',
    '#class{font-family:\'JetBrains Mono\',monospace;font-size:8.5px;letter-spacing:.32em;color:#6b675c;background:linear-gradient(180deg,#101010,#0b0b0b);border-bottom:1px solid rgba(197,164,91,.1);padding:6px 14px;text-align:center}',
    '#hdr{background:linear-gradient(180deg,#101010 0%,#0a0a0a 100%);border-bottom:1px solid rgba(197,164,91,.14);padding:12px 18px 10px}',
    '#hdr h1.glitch{font-family:Cinzel,Georgia,serif;font-weight:600;font-size:clamp(21px,3.4vw,27px);letter-spacing:.38em;color:#EAE5D9;text-shadow:0 0 28px rgba(197,164,91,.22);margin:0}',
    '#hdr .node{font-family:\'JetBrains Mono\',monospace;font-size:9px;letter-spacing:.24em;color:#6b675c}',
    '.conn{font-family:\'JetBrains Mono\',monospace;font-size:9px;letter-spacing:.2em;color:#89857B}',
    '.conn i{background:#C5A45B;box-shadow:none;animation:none}',
    '.conn.on i{background:#7fae8b;box-shadow:none}',
    '.hbtn{background:transparent;border:1px solid rgba(197,164,91,.28);color:#C5A45B;border-radius:8px;font-family:\'JetBrains Mono\',monospace;transition:all .2s}',
    '.hbtn:hover{background:rgba(197,164,91,.1);border-color:rgba(197,164,91,.5)}',
    '#warn{font-family:\'JetBrains Mono\',monospace;font-size:8.5px;letter-spacing:.18em;color:#6b675c;border:none;padding:4px 0 0}',
    '#hdr .meta{display:flex;gap:16px;flex-wrap:wrap;margin-top:8px;font-family:\'JetBrains Mono\',monospace;font-size:9.5px;letter-spacing:.14em;color:#6b675c}',
    '#hdr .meta b{font-weight:500;color:#89857B}',
    '#hdr .meta b#clock,#hdr .meta b#st-state{color:#C5A45B}',
    '#ordmenu{display:none;align-items:center;justify-content:center;width:36px;height:36px;flex:none;background:transparent;border:1px solid rgba(197,164,91,.3);border-radius:10px;color:#C5A45B;cursor:pointer}',
    '#ordmenu i{display:block;width:16px;height:1.4px;background:currentColor;box-shadow:0 5px 0 currentColor,0 -5px 0 currentColor;margin:auto}',

    /* status bar (real values, mirrored live) */
    '#ordbar{display:flex;gap:4px 20px;flex-wrap:wrap;align-items:center;justify-content:flex-start;padding:6px 18px;border-bottom:1px solid rgba(255,255,255,.05);background:rgba(16,16,16,.65);font-family:\'JetBrains Mono\',monospace;font-size:9px;letter-spacing:.16em;color:#5c594f;overflow-x:auto;white-space:nowrap}',
    '#ordbar::-webkit-scrollbar{display:none}',
    '#ordbar .oc{display:inline-flex;gap:7px;align-items:baseline;flex:none}',
    '#ordbar .oc i{font-style:normal;color:#5c594f}',
    '#ordbar .oc b{font-weight:500;color:#C5A45B;letter-spacing:.14em}',

    /* sidebar */
    '#nav{background:#0b0b0b;border-right:1px solid rgba(197,164,91,.12);border-bottom:none;border-top:none;display:flex;flex-direction:column;gap:2px;padding:14px 10px 20px;overflow-y:auto;overflow-x:hidden;scrollbar-width:none}',
    '#nav::-webkit-scrollbar{display:none}',
    '#nav .nsep{display:none}',
    '#nav .ordg{font-family:\'JetBrains Mono\',monospace;font-size:8px;letter-spacing:.34em;color:#544f43;margin:14px 10px 5px;white-space:nowrap}',
    '#nav .ordg:first-child{margin-top:0}',
    '#nav button{display:flex;align-items:center;gap:11px;width:100%;text-align:left;background:transparent;border:1px solid transparent;border-radius:10px;color:#89857B;font-family:Inter,sans-serif;font-size:10.5px;font-weight:500;letter-spacing:.16em;text-transform:uppercase;padding:9px 12px;cursor:pointer;white-space:nowrap;transition:all .18s ease;flex:none}',
    '#nav button:hover{color:#EAE5D9;background:rgba(197,164,91,.06);border-color:rgba(197,164,91,.16)}',
    '#nav button.on{color:#C5A45B;background:linear-gradient(135deg,rgba(197,164,91,.13),rgba(128,107,63,.06));border-color:rgba(197,164,91,.32);box-shadow:none}',
    '#nav button .ordi{width:15px;height:15px;flex:none;stroke:currentColor;fill:none;stroke-width:1.3;stroke-linecap:round;stroke-linejoin:round}',
    '#nav button .olbl{overflow:hidden;text-overflow:ellipsis}',
    '#ordfold{display:flex;align-items:center;justify-content:center;width:100%;margin-top:12px;padding:7px;background:transparent;border:1px solid rgba(197,164,91,.16);border-radius:10px;color:#6b675b;cursor:pointer;font-family:\'JetBrains Mono\',monospace;font-size:9px;letter-spacing:.2em;transition:all .18s}',
    '#ordfold:hover{color:#C5A45B;border-color:rgba(197,164,91,.4)}',
    'body.ord-rail #app{grid-template-columns:58px 1fr}',
    'body.ord-rail #nav button{justify-content:center;padding:10px 0;gap:0}',
    'body.ord-rail #nav button .olbl{display:none}',
    'body.ord-rail #nav .ordg{visibility:hidden;height:10px;margin:8px 0 4px}',
    'body.ord-rail #ordfold span{display:none}',

    /* main panels */
    '#main{min-width:0;background:transparent}',
    '.mod{padding:16px clamp(12px,3.5vw,40px) 20px;max-width:1000px;margin:0 auto;width:100%}',
    '.mod.on{animation:ordin .4s cubic-bezier(.22,.8,.3,1)}',
    '@keyframes ordin{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}',
    '.mod h3{font-family:Cinzel,Georgia,serif;font-weight:600;font-size:12.5px;letter-spacing:.3em;color:#C5A45B;text-transform:uppercase;margin:20px 0 8px}',
    '.mod h3:first-child{margin-top:4px}',
    '.pline{font-family:\'JetBrains Mono\',monospace;font-size:11px;line-height:1.6;color:#89857B;background:#101010;border:1px solid rgba(255,255,255,.05);border-radius:10px;padding:9px 12px;margin:6px 0}',
    '.prow{display:flex;gap:8px;flex-wrap:wrap;margin:8px 0}',
    '.pbtn{background:#101010;border:1px solid rgba(197,164,91,.25);color:#89857B;font-family:\'JetBrains Mono\',monospace;font-size:10px;letter-spacing:.12em;padding:8px 13px;border-radius:9px;cursor:pointer;transition:all .18s}',
    '.pbtn:hover{color:#EAE5D9;border-color:rgba(197,164,91,.5)}',
    '.pbtn.on{color:#C5A45B;border-color:rgba(197,164,91,.5);background:rgba(197,164,91,.08);box-shadow:none}',
    '#ticker{font-family:\'JetBrains Mono\',monospace;font-size:9px;letter-spacing:.26em;color:#6b675c;padding:6px 0 10px;border-bottom:1px solid rgba(255,255,255,.05);margin-bottom:8px}',
    '#corewrap{margin:4px 0 8px;text-align:center}',
    '#corelbl{font-family:\'JetBrains Mono\',monospace;font-size:8.5px;letter-spacing:.3em;color:#544f43;margin-top:-6px}',
    'input,select,textarea{font-family:inherit}',

    /* chat */
    '#chat{flex:1;overflow-y:auto;-webkit-overflow-scrolling:touch;padding:16px clamp(10px,3vw,36px) 10px;display:flex;flex-direction:column;gap:16px;scrollbar-width:thin}',
    '#chat .line{max-width:min(86%,720px);padding:13px 17px;border-radius:14px;position:relative;animation:ordmsg .32s ease-out}',
    '@keyframes ordmsg{from{opacity:0;transform:translateY(7px)}to{opacity:1;transform:none}}',
    '.line .lhead{display:flex;align-items:center;gap:10px;margin-bottom:7px}',
    '.line .lwho{font-family:Inter,sans-serif;font-weight:600;font-size:9px;letter-spacing:.24em;color:#806B3F;display:inline-flex;align-items:center;gap:7px}',
    '.line.imp .lwho::before{content:\'\';width:11px;height:11px;flex:none;background:'+EMB+' center/contain no-repeat;filter:drop-shadow(0 0 4px rgba(197,164,91,.35))}',
    '.line .lt{font-family:\'JetBrains Mono\',monospace;font-size:9px;letter-spacing:.1em;color:#544f43;font-weight:400}',
    '.lbody{white-space:pre-wrap;word-wrap:break-word;overflow-wrap:break-word;font-size:14px;line-height:1.72;color:#D9D3C4;font-weight:400}',
    '.line.you{align-self:flex-end;background:#151515;border:1px solid rgba(197,164,91,.32);border-bottom-right-radius:5px;color:#EAE5D9;box-shadow:0 6px 24px rgba(0,0,0,.35)}',
    '.line.you .lwho{color:#C5A45B}',
    '.line.you .lbody{color:#EAE5D9}',
    '.line.imp{align-self:flex-start;background:rgba(21,21,21,.82);border:1px solid rgba(255,255,255,.06);border-left:2px solid rgba(197,164,91,.4);border-bottom-left-radius:5px;backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px)}',
    '.line.imp .lbody{color:#D9D3C4}',
    '.line.omen{align-self:center;max-width:92%;background:rgba(128,107,63,.07);border:1px solid rgba(128,107,63,.2);color:#a89b7d;font-size:11.5px;font-style:italic;text-align:center;border-radius:10px;padding:7px 14px;font-family:\'JetBrains Mono\',monospace}',
    '.line.omen .lhead{display:none}',
    '.line.omen .lbody{font-family:inherit;font-size:11.5px;color:#a89b7d}',
    '.line.r{border-color:rgba(197,164,91,.4);color:#C5A45B;font-style:normal}',
    '.line.typing::after{content:\'\\25CA\';color:#C5A45B;animation:ordcur 1s infinite;margin-left:3px}',
    '@keyframes ordcur{50%{opacity:.15}}',

    /* message actions */
    '.ordact{display:flex;gap:6px;margin-top:9px;opacity:0;transition:opacity .2s}',
    '.line:hover .ordact,.ordact:focus-within{opacity:1}',
    '@media (hover:none){.ordact{opacity:.8}}',
    '.ordact button{background:transparent;border:1px solid rgba(197,164,91,.2);color:#89857B;font-family:\'JetBrains Mono\',monospace;font-size:8.5px;letter-spacing:.14em;padding:3px 9px;border-radius:7px;cursor:pointer;transition:all .16s}',
    '.ordact button:hover{color:#C5A45B;border-color:rgba(197,164,91,.5)}',

    /* composer */
    '#foot{display:flex;align-items:flex-end;gap:8px;margin:8px 14px calc(12px + env(safe-area-inset-bottom));padding:10px 12px;background:rgba(21,21,21,.94);border:1px solid rgba(197,164,91,.22);border-radius:18px;backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px);box-shadow:0 18px 50px rgba(0,0,0,.55),0 0 0 1px rgba(0,0,0,.4);transition:border-color .25s,box-shadow .25s}',
    '#foot:focus-within{border-color:rgba(197,164,91,.55);box-shadow:0 18px 50px rgba(0,0,0,.55),0 0 0 3px rgba(197,164,91,.08)}',
    '#prompt{display:none}',
    '#txt{flex:1;background:#0e0e0e;border:1px solid rgba(255,255,255,.07);border-radius:12px;color:#EAE5D9;font-family:Inter,sans-serif;font-size:14px;line-height:1.5;padding:10px 14px;resize:none;max-height:132px;min-height:40px;outline:none;transition:border-color .2s,box-shadow .2s}',
    '#txt::placeholder{color:#5c594f;letter-spacing:.06em}',
    '#txt:focus{border-color:rgba(197,164,91,.5);box-shadow:0 0 0 3px rgba(197,164,91,.07)}',
    '.act{background:transparent;color:#89857B;border:1px solid rgba(255,255,255,.09);font-family:\'JetBrains Mono\',monospace;font-size:9.5px;letter-spacing:.14em;padding:9px 12px;cursor:pointer;border-radius:11px;flex:0 0 auto;transition:all .18s;box-shadow:none}',
    '.act:hover{color:#EAE5D9;border-color:rgba(197,164,91,.45);background:rgba(197,164,91,.07)}',
    '.act:disabled{opacity:.35}',
    '.act.rec{animation:none;border-color:rgba(197,164,91,.6);color:#C5A45B}',
    '#send{background:linear-gradient(135deg,#C5A45B,#8A6D3F);color:#0a0a08;border:none;font-family:Inter,sans-serif;font-weight:600;font-size:10.5px;letter-spacing:.2em;padding:11px 20px;border-radius:999px;box-shadow:0 4px 20px rgba(197,164,91,.28)}',
    '#send:hover{box-shadow:0 4px 26px rgba(197,164,91,.45);color:#0a0a08;filter:brightness(1.06)}',
    '#ordclip{background:transparent;border:1px solid rgba(197,164,91,.22);color:#89857B;font-size:14px;line-height:1;padding:9px 11px;border-radius:11px;cursor:pointer;transition:all .18s}',
    '#ordclip:hover{color:#C5A45B;border-color:rgba(197,164,91,.5)}',
    '#ordmodel{background:transparent;border:1px solid rgba(197,164,91,.22);color:#89857B;font-family:\'JetBrains Mono\',monospace;font-size:8.5px;letter-spacing:.12em;padding:9px 10px;border-radius:11px;cursor:pointer;max-width:130px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;transition:all .18s}',
    '#ordmodel:hover{color:#C5A45B;border-color:rgba(197,164,91,.5)}',

    /* suggestions + welcome */
    '#sugs{background:#151515;border:1px solid rgba(197,164,91,.3);border-radius:14px;box-shadow:0 20px 60px rgba(0,0,0,.6);backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px);overflow:hidden}',
    '#sugs div{padding:9px 14px;font-family:\'JetBrains Mono\',monospace;font-size:11px;color:#89857B;cursor:pointer;border-bottom:1px solid rgba(255,255,255,.04)}',
    '#sugs div:last-child{border-bottom:none}',
    '#sugs div:hover{background:rgba(197,164,91,.08);color:#EAE5D9}',
    '#sugs div b{color:#C5A45B}',
    '#ordwelcome{margin:3vh auto 10px;max-width:600px;text-align:center;animation:ordin .6s ease-out both}',
    '#ordwelcome .ow-emb{width:88px;height:88px;margin:0 auto 16px;display:block;filter:drop-shadow(0 0 30px rgba(197,164,91,.3))}',
    '#ordwelcome h2{font-family:Cinzel,Georgia,serif;font-weight:600;font-size:clamp(24px,5vw,34px);letter-spacing:.4em;color:#EAE5D9;margin:0 0 6px;text-indent:.4em}',
    '#ordwelcome .ow-sub{font-family:\'JetBrains Mono\',monospace;font-size:9.5px;letter-spacing:.4em;color:#806B3F;margin-bottom:14px}',
    '#ordwelcome .ow-quote{font-family:Georgia,serif;font-style:italic;font-size:13.5px;color:#89857B;margin:0 0 6px}',
    '#ordwelcome .ow-note{font-size:11px;color:#6b675c;margin-bottom:18px;line-height:1.6}',
    '#ordwelcome .ow-cards{display:grid;grid-template-columns:1fr 1fr;gap:10px;text-align:left}',
    '#ordwelcome .ow-card{border:1px solid rgba(197,164,91,.2);background:rgba(21,21,21,.72);border-radius:12px;padding:12px 14px;cursor:pointer;transition:all .2s;font-family:Inter,sans-serif}',
    '#ordwelcome .ow-card:hover{border-color:rgba(197,164,91,.5);background:rgba(197,164,91,.06);transform:translateY(-1px)}',
    '#ordwelcome .ow-card b{display:block;font-size:9px;letter-spacing:.2em;color:#C5A45B;margin-bottom:5px;font-weight:600}',
    '#ordwelcome .ow-card span{font-size:12px;color:#C9C3B4;line-height:1.5}',

    /* gate + cinematic */
    '#gate{background:radial-gradient(ellipse at 50% 42%,#16130d 0%,#080808 72%)}',
    '#gate .sigil{color:#C5A45B;filter:drop-shadow(0 0 18px rgba(197,164,91,.4))}',
    '#cine{background:#050505;color:#C5A45B}',
    '#cine .c-emb{filter:drop-shadow(0 0 26px rgba(197,164,91,.4))}',
    '#cine .c-rings i{border-color:rgba(197,164,91,.3)}',
    '#cine .c-rings i:nth-child(2){border-color:rgba(197,164,91,.18)}',
    '#cine .c-lines div:nth-child(1){font-family:Cinzel,Georgia,serif;color:#EAE5D9}',
    '#cine .c-lines div:nth-child(2){color:#89857B}',
    '#cine .c-lines div:nth-child(3){color:#C5A45B}',
    '#c-skip{border-color:rgba(197,164,91,.25);color:#89857B}',
    '#flash{background:#050505}',

    /* command palette, footer */
    '#cmdbk{background:rgba(5,5,5,.7);backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px)}',
    '.win{background:rgba(12,12,12,.94);border:1px solid rgba(197,164,91,.25);box-shadow:0 30px 90px rgba(0,0,0,.7);border-radius:16px}',
    '#cmdin{background:#0e0e0e;border:1px solid rgba(255,255,255,.08);border-radius:10px;color:#EAE5D9;font-family:\'JetBrains Mono\',monospace;font-size:12px;padding:10px 12px;outline:none;margin:10px;width:calc(100% - 20px)}',
    '#cmdin:focus{border-color:rgba(197,164,91,.5)}',
    '#cmdlist div{padding:8px 12px;font-family:\'JetBrains Mono\',monospace;font-size:11px;color:#89857B;cursor:pointer;border-bottom:1px solid rgba(255,255,255,.04)}',
    '#cmdlist div:hover{background:rgba(197,164,91,.08);color:#EAE5D9}',
    '#pgp{font-family:\'JetBrains Mono\',monospace;font-size:8.5px;letter-spacing:.3em;color:#4a483f;text-align:center;padding:6px 0 8px}',

    /* desktop grid: true sidebar layout */
    '@media (min-width:821px){',
    '#app{display:grid;grid-template-columns:236px 1fr;grid-template-rows:auto auto auto 1fr auto auto;grid-template-areas:"class class" "hdr hdr" "ordbar ordbar" "nav main" "foot foot" "pgp pgp";height:100%}',
    '#class{grid-area:class}#hdr{grid-area:hdr}#ordbar{grid-area:ordbar}#nav{grid-area:nav}#main{grid-area:main;overflow:hidden;display:flex;flex-direction:column}#m-home{display:flex;flex-direction:column;flex:1;min-height:0;overflow:hidden}#m-home.on{display:flex}#chat{flex:1;min-height:0}#foot{grid-area:foot}#pgp{grid-area:pgp}#sugs{grid-area:foot;position:absolute;bottom:calc(78px + env(safe-area-inset-bottom));left:50%;transform:translateX(-50%);width:min(520px,88vw);z-index:60;margin:0}}',
    '@media (min-width:821px){#m-home{padding:0 clamp(12px,3.5vw,40px) 8px}}',

    /* mobile: drawer */
    '@media (max-width:820px){',
    '#app{display:flex;flex-direction:column}',
    '#ordmenu{display:flex}',
    '#nav{position:fixed;top:0;left:0;bottom:0;width:min(300px,84vw);z-index:440;transform:translateX(-103%);transition:transform .3s cubic-bezier(.22,.8,.3,1);padding-top:calc(14px + env(safe-area-inset-top));box-shadow:24px 0 70px rgba(0,0,0,.6);background:#0b0b0b}',
    'body.ord-nav #nav{transform:none}',
    '#ordscim{position:fixed;inset:0;z-index:430;background:rgba(0,0,0,.55);opacity:0;pointer-events:none;transition:opacity .3s;backdrop-filter:blur(3px);-webkit-backdrop-filter:blur(3px)}',
    'body.ord-nav #ordscim{opacity:1;pointer-events:auto}',
    '#ordfold{display:none}',
    '#chat{padding:12px 10px 8px}',
    '#chat .line{max-width:92%}',
    '#foot{margin:6px 10px calc(10px + env(safe-area-inset-bottom));padding:8px 9px;border-radius:16px;gap:6px}',
    '#send{padding:11px 15px}',
    '#ordbar{padding:5px 12px;gap:3px 14px}',
    '#ordwelcome .ow-cards{grid-template-columns:1fr}',
    '.mod{padding:12px 12px 16px}',
    '}',

    /* reduced motion */
    '@media (prefers-reduced-motion:reduce){#ordfx{display:none}#ordbg{opacity:.03}}',
    'body.rm #ordfx{display:none}',
    'body.rm *{animation-duration:.001s!important}',

    '/* end hl127 */'
    ].join('\n');

    var s=document.createElement('style'); s.id='hl127-style'; s.textContent=css;
    (document.head||document.documentElement).appendChild(s);
  }catch(e){ try{console.log('[HL127]',e);}catch(_){} }
})();

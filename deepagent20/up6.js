/* deepagent20 v4.0 - REA chatgpt replica skin + combined best-of clone features. additive only, one relay brain */
(function(){
var D=document,W=window;
function $(i){return D.getElementById(i)}
function mk(t,c,x){var e=D.createElement(t);if(c)e.className=c;if(x!=null)e.textContent=x;return e}

/* 1. chatgpt replica skin - tokens read live off chatgpt.com 2026-11-21: bg #fff, text #0d0d0d, lines #e5e5e5, composer pill r28 shadow, send #a5b4fc->#0d0d0d, user bubble #ececec r26, sidebar #f9f9f9 */
var st=D.createElement('style');
st.textContent=[
':root{--tx:#0d0d0d;--ln:#e5e5e5;--pan:#f9f9f9;--ac:#0d0d0d;--dim:#8e8e8e}',
'body{font-family:-apple-system,"Segoe UI",Sohne,Helvetica,sans-serif}',
'#app{max-width:760px}',
'#top{background:transparent;border-bottom:0}',
'#toppill button{background:transparent;border:0}',
'#welcome h1{font-size:28px;font-weight:600;letter-spacing:0;color:#0d0d0d}',
'#welcome svg{stroke:#0d0d0d}',
'#welcome{margin:auto 0 26px}',
'.ccard{background:#fff;border:1px solid #e5e5e5;border-radius:28px;box-shadow:0 4px 24px rgba(0,0,0,.06);padding:16px 14px 10px}',
'#inp{font-size:16px}',
'#inp::placeholder{color:#8e8e8e}',
'#send svg circle{fill:#a5b4fc !important;transition:fill .15s}',
'#send.live svg circle{fill:#0d0d0d !important}',
'#send.live svg path{stroke:#fff !important}',
'.chip{border-radius:24px;background:#fff;border-color:#e5e5e5;color:#0d0d0d}',
'.chip.on{color:#0d0d0d;background:#ececec;border-color:#d0d0d0}',
'.msg.you{background:#ececec;border-radius:26px;color:#0d0d0d}',
'.msg.ai{color:#0d0d0d}',
'.msg.ai code{background:#f0f0f0}',
'#drawer{background:#f9f9f9}',
'#wsugg{display:flex;flex-wrap:wrap;gap:8px;justify-content:center;max-width:680px;margin:16px auto 0;align-items:flex-start}',
'#wsugg .chip,#wsugg .gchip,#wsugg button{width:auto;flex:0 0 auto;white-space:nowrap}',
'#surp{display:inline-flex;align-items:center;gap:8px;padding:9px 16px;border-radius:24px;font-size:14px;line-height:1.2;width:auto !important;height:auto !important;min-height:0 !important;box-shadow:none}',
'#surp svg{width:14px !important;height:14px !important;stroke:#a855f7 !important;fill:none !important;stroke-width:2 !important;stroke-linecap:round}',
'#wsugg .chip{height:auto !important;line-height:1.2}',
'.gchip{font:inherit}',
'#drawer .dsearch{background:#fff;border-color:#e5e5e5}',
'.gchip{display:inline-flex;align-items:center;gap:7px;padding:9px 16px;border-radius:24px;font-size:14px;cursor:pointer;color:#0d0d0d;background:linear-gradient(#fff,#fff) padding-box,linear-gradient(90deg,#a855f7,#ec4899) border-box;border:1.5px solid transparent}',
'.gchip svg{width:14px;height:14px;stroke:#a855f7;fill:none;stroke-width:2;stroke-linecap:round}',
'#modelchip{font-weight:600}',
'#xport{width:40px;height:40px;border-radius:50%;border:0;background:transparent;display:flex;align-items:center;justify-content:center;cursor:pointer;color:#0d0d0d}',
'#xport svg{width:20px;height:20px;stroke:#0d0d0d;fill:none;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}',
'.mmenu{position:absolute;bottom:120px;left:50%;transform:translateX(-50%);background:#fff;border:1px solid #e5e5e5;border-radius:16px;box-shadow:0 12px 40px rgba(0,0,0,.15);padding:6px;z-index:80;display:flex;flex-direction:column;min-width:190px}',
'.mmenu div{padding:10px 14px;border-radius:10px;font-size:14px;cursor:pointer;color:#0d0d0d}',
'.mmenu div:hover{background:#f0f0f0}',
'.mmenu div.on{font-weight:700}'
].join('\n');
D.head.appendChild(st);

/* 2. welcome: hero line + generic black mark (chatgpt live hero line, pulled 2026-11-21) */
var w=$('welcome');
if(w){
  var h=w.querySelector('h1'); if(h)h.textContent='Where should we begin?';
  var sv=w.querySelector('svg');
  if(sv)sv.innerHTML='<g stroke="#0d0d0d" stroke-width="1.7" stroke-linecap="round" fill="none"><path d="M12 2v20"/><path d="M3.3 7l17.4 10"/><path d="M20.7 7L3.3 17"/><path d="M12 7.5l3 1.7v3.6l-3 1.7-3-1.7V9.2z"/></g>';
}

/* 3. composer: chatgpt placeholder + live send color */
var inp=$('inp'),send=$('send');
if(inp)inp.placeholder='Ask anything';
function live(){if(send)send.classList[inp&&inp.value.trim()?'add':'remove']('live')}
if(inp&&send){inp.addEventListener('input',live);live()}

/* 4. model selector (librechat/open-webui) - label + think wiring, same relay brain */
var MODELS=['DeepSeek V4','DeepSeek R2 Think','DeepSeek Coder'];
var mrow=null,mm=null,mi=0;
try{mi=Math.max(0,MODELS.indexOf(JSON.parse(localStorage.getItem('u_model')||'"DeepSeek V4"')))}catch(e){}
function mmclose(){if(mm){mm.remove();mm=null}}
function mmopen(){
  mmclose();if(!mrow)return;
  var r=mrow.getBoundingClientRect();
  mm=mk('div','mmenu');
  MODELS.forEach(function(m,i){var o=mk('div',i===mi?'on':'',m);o.onclick=function(){pick(i)};mm.appendChild(o)});
  mm.style.left=Math.max(10,Math.min(W.innerWidth-200,r.left))+'px';
  D.body.appendChild(mm);
}
function pick(i){
  mi=i;try{localStorage.setItem('u_model',JSON.stringify(MODELS[i]))}catch(e){}
  if(mrow)mrow.textContent=MODELS[i];
  var tc=$('thinkchip');
  if(i===1&&tc&&!tc.classList.contains('on'))tc.click();
  mmclose();
}
var chiprow=$('chiprow');
if(chiprow){
  mrow=mk('span','chip');mrow.id='modelchip';mrow.textContent=MODELS[mi];
  mrow.onclick=function(e){e.stopPropagation();mmopen()};
  chiprow.insertBefore(mrow,chiprow.firstChild);
  D.addEventListener('click',function(e){if(mm&&e.target!==mm&&!mm.contains(e.target))mmclose()});
}

/* 5. masks (nextchat) + surprise me (chatgpt) + suggestions in the welcome row */
var MASKS=[
 ['Coder','Write clean, correct code. When I describe a bug or a feature, give me the full working code first, then a short explanation.'],
 ['Writer','Write clear, natural prose. Match my tone, cut filler, and keep paragraphs short.'],
 ['Tutor','Teach me step by step. Check I follow before moving on, and quiz me at the end.'],
 ['Translator','Translate whatever I send. Reply with the translation only, natural phrasing, then one short note if a word was ambiguous.']
];
var SURPRISE=['Explain quantum computing like I am five','Plan a 3-day trip to Tokyo on a budget','Write a haiku about my phone battery','Give me 5 startup ideas using only free tools','Summarize the history of the internet in one paragraph','Teach me one useful thing in 30 seconds'];
var ws=$('wsugg');
if(ws){
  function addg(label,fn){
    var g=mk('button','gchip');
    g.innerHTML='<svg viewBox="0 0 24 24"><path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z"/></svg>';
    g.appendChild(D.createTextNode(label));
    g.id='surp';
    g.onclick=fn;ws.appendChild(g);return g;
  }
  MASKS.forEach(function(m){
    var c=mk('span','chip',m[0]);
    c.onclick=function(){var i=$('inp');if(i){i.value=m[1];i.focus();i.dispatchEvent(new Event('input'))}};
    ws.appendChild(c);
  });
  addg('Surprise me',function(){
    var i=$('inp');if(i){i.value=SURPRISE[Math.floor(Math.random()*SURPRISE.length)];i.focus();i.dispatchEvent(new Event('input'))}
  });
  var seen={},kids=[].slice.call(ws.children);
  for(var i=0;i<kids.length;i++){var k=kids[i],t=(k.textContent||'').trim().toLowerCase();if(seen[t]){k.remove()}else{seen[t]=1}}
}

/* 6. export chat (lobehub) - transcript to a .md file, same brain, nothing stored */
var pill=$('toppill');
if(pill){
  var x=mk('button');x.id='xport';x.title='export chat';
  x.innerHTML='<svg viewBox="0 0 24 24"><path d="M12 3v12"/><path d="M7 10l5 5 5-5"/><path d="M4 19h16"/></svg>';
  x.onclick=function(){
    var c=$('chat');if(!c)return;
    var lines=['# chat export','','exported '+new Date().toISOString(),''];
    var nodes=c.querySelectorAll('.msg');
    for(var i=0;i<nodes.length;i++){
      var n=nodes[i],t=(n.textContent||'').trim();if(!t)continue;
      lines.push(n.className.indexOf('you')>=0?'**you:** '+t:'**ai:** '+t,'');
    }
    var b=new Blob([lines.join('\n')],{type:'text/markdown'});
    var a=D.createElement('a');a.href=URL.createObjectURL(b);a.download='chat.md';a.click();
    setTimeout(function(){URL.revokeObjectURL(a.href)},2000);
  };
  pill.insertBefore(x,pill.firstChild);
}

console.log('[deepagent20 v4.0] chatgpt replica skin on, best-of features combined, one relay brain');
})();
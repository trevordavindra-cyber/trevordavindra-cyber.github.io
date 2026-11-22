/* deepagent16 - claude-style agent answers v3.10, hardened: timeouts everywhere, auto-unstick watchdog, falls back to the base agent if the build flow hiccups */
(function(){
var D=document,chat=D.getElementById('chat'),inp=D.getElementById('inp'),send=D.getElementById('send');
if(!chat||!inp||!send)return;
function mk(t,c,x){var e=D.createElement(t);if(c)e.className=c;if(x!=null)e.textContent=x;return e}
function sys2(t){var d=mk('div','msg sys',t);chat.appendChild(d);chat.scrollTop=1e9;return d}
function ld(k,d){try{var v=JSON.parse(localStorage.getItem(k));return v==null?d:v}catch(e){return d}}
function sv(k,v){localStorage.setItem(k,JSON.stringify(v))}
function to(p,ms){return Promise.race([p,new Promise(function(_,rj){setTimeout(function(){rj(new Error('timed out'))},ms)})])}
function ask(t){return fetch('https://text.pollinations.ai/openai',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({model:'openai-fast',messages:[{role:'user',content:t}]})}).then(function(r){return r.json()}).then(function(j){return (j&&j.choices&&j.choices[0]&&j.choices[0].message&&j.choices[0].message.content)||''})}
var MODE=ld('u_claude',1);
var btn=mk('button','⏺');btn.title='agent style';btn.style.cssText='width:38px;height:38px;border-radius:50%;border:1px solid rgba(120,120,128,.35);background:'+(MODE?'#4d6bfe':'transparent')+';color:'+(MODE?'#fff':'inherit')+';margin-left:8px;font-size:13px;flex:0 0 auto';
var mic=D.getElementById('mic');if(mic&&mic.parentNode)mic.parentNode.insertBefore(btn,mic);else D.body.appendChild(btn);
btn.onclick=function(){MODE=!MODE;sv('u_claude',MODE?1:0);btn.style.background=MODE?'#4d6bfe':'transparent';btn.style.color=MODE?'#fff':'inherit';sys2(MODE?'agent style on: it asks one quick question, shows its live steps, then hands over the build':'agent style off')};
var state='idle',pendQ=null,pendAsk=null,lastT=Date.now();
function setst(s){state=s;lastT=Date.now()}
setInterval(function(){if(state!=='idle'&&Date.now()-lastT>180000){setst('idle');sys2('unstuck, try again')}},20000);
function buildish(v){v=v.toLowerCase();return (/\b(build|create|design|develop|make|code)\b/.test(v)&&/\b(app|site|website|dashboard|game|tool|page|clone|tracker|calculator|simulator|generator|checker)\b/.test(v))||(/\b(app|website|dashboard|game)\b/.test(v)&&/\b(build|create|make|design)\b/.test(v))}
function qcard(q){var d=mk('div','msg ai');var box=mk('div');box.style.cssText='background:rgba(120,120,128,.14);border-radius:14px;padding:12px 14px';
 var l=mk('div','Question');l.style.cssText='font-size:11px;opacity:.6;margin-bottom:6px';
 var b=mk('div',q);b.style.cssText='font-size:15px;font-weight:600';
 var c=mk('button','answer it below ⌄');c.style.cssText='margin-top:8px;padding:6px 12px;border:0;border-radius:12px;background:rgba(120,120,128,.25);color:inherit;font-size:12px';c.onclick=function(){inp.focus()};
 box.appendChild(l);box.appendChild(b);box.appendChild(c);d.appendChild(box);d.dataset.raw=q;chat.appendChild(d);chat.scrollTop=1e9}
function trail(labels){var d=mk('div','msg ai');d.dataset.raw='';var t0=Date.now();var rows=[];
 labels.forEach(function(lb){var r=mk('div');r.style.cssText='display:flex;align-items:center;gap:8px;padding:5px 2px;font-size:13px;opacity:.85';var dot=mk('span','●');dot.style.cssText='color:#4d6bfe;font-size:10px';var tx=mk('span',lb[0]);var tm=mk('span','');tm.style.cssText='opacity:.5;font-size:11px';r.appendChild(dot);r.appendChild(tx);r.appendChild(tm);d.appendChild(r);rows.push([tx,tm,dot])});
 var stl=mk('div','Working on it...');stl.style.cssText='font-size:12px;opacity:.55;padding:6px 2px';d.appendChild(stl);
 chat.appendChild(d);chat.scrollTop=1e9;
 var iv=setInterval(function(){var s=Math.round((Date.now()-t0)/1000);rows.forEach(function(r,i){if(state==='building'||i<rows.length-1)r[1].textContent=Math.max(1,s-i*3)+'s'});stl.textContent=state==='building'?('Working on it... '+s+'s'):'Done';if(state!=='building'){clearInterval(iv);rows.forEach(function(r){r[2].style.color='#12b76a'})}},1000);
 return d}
function baseFallback(v){try{inp.value=v;inp.dispatchEvent(new Event('input'));var ev=new MouseEvent('click',{bubbles:true});ev.__ds=true;send.dispatchEvent(ev)}catch(e){sys2('send it again')}}
function run(){
 setst('building');
 var full='Build this: '+pendAsk+'. Context from the user: '+pendQ+'. Reply with a one-line intro, then ONE complete polished single-file html app in a single ```html code block. Dark modern ui, mobile friendly, everything working, no external files.';
 trail([['Planning the build'],['Choosing the layout'],['Writing the code']]);
 to(ask(full),120000).catch(function(){return to(ask(full),120000)}).then(function(out){
  var t=String(out||'').trim();
  if(!t)throw new Error('empty reply');
  setst('idle');
  if(t.indexOf('```')<0&&/<html|<!DOCTYPE/i.test(t))t='```html\n'+t+'\n```';
  var d=mk('div','msg ai');d.textContent=t;d.dataset.raw=t;chat.appendChild(d);chat.scrollTop=1e9;
 }).catch(function(e){setst('idle');pendAsk=null;pendQ=null;sys2('the build flow hit a wall, handing it to the main agent');baseFallback('Build this: '+(pendAsk||''))})}
function handle(v){
 if(state==='await'){setst('thinking');pendQ=v;run();return true}
 if(state!=='idle'){if(Date.now()-lastT>180000){setst('idle')}else{sys2('still working on it, one sec');return true}}
 if(!MODE||!buildish(v))return false;
 setst('asking');pendAsk=v;
 sys2('asking a question ⏱');
 to(ask('A user wants to: '+v+'. Ask them ONE short sharp clarifying question that most changes what you would build. Reply with ONLY the question, no preamble.'),20000).then(function(q){
  q=String(q||'').trim().replace(/^"|"$/g,'');
  if(!q){pendQ='';run();return}
  qcard(q);setst('await');
 }).catch(function(){pendQ='';run()});
 return true}
function intercept(e){
 if(e.__ds)return false;
 var v=inp.value.trim();
 if(state==='idle'&&(!MODE||!buildish(v)))return false;
 if(!v&&state==='idle')return false;
 if(!handle(v))return false;
 e.stopImmediatePropagation();e.preventDefault();
 if(v){var u=mk('div','msg you',v);u.dataset.raw=v;chat.appendChild(u);inp.value='';inp.dispatchEvent(new Event('input'));chat.scrollTop=1e9}
 return true}
window.addEventListener('click',function(e){if(e.target===send)intercept(e)},true);
window.addEventListener('keydown',function(e){if(e.target===inp&&e.key==='Enter'&&!e.shiftKey)intercept(e)},true);
var st=D.createElement('style');st.textContent='@keyframes blink{50%{opacity:.2}}';D.head.appendChild(st);
sys2('agent style on, hardened: quick question, live steps, the finished app, and it can no longer get stuck.');
})();
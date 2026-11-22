/* deepagent15 - claude-style agent answers v3.9: clarifying question first, live working steps, then the finished app */
(function(){
var D=document,chat=D.getElementById('chat'),inp=D.getElementById('inp'),send=D.getElementById('send');
if(!chat||!inp||!send)return;
function mk(t,c,x){var e=D.createElement(t);if(c)e.className=c;if(x!=null)e.textContent=x;return e}
function sys2(t){var d=mk('div','msg sys',t);chat.appendChild(d);chat.scrollTop=1e9;return d}
function ld(k,d){try{var v=JSON.parse(localStorage.getItem(k));return v==null?d:v}catch(e){return d}}
function sv(k,v){localStorage.setItem(k,JSON.stringify(v))}
function ask(t){return fetch('https://text.pollinations.ai/openai',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({model:'openai-fast',messages:[{role:'user',content:t}]})}).then(function(r){return r.json()}).then(function(j){return (j&&j.choices&&j.choices[0]&&j.choices[0].message&&j.choices[0].message.content)||''})}
var MODE=ld('u_claude',1);
var btn=mk('button','⏺');btn.title='agent style';btn.style.cssText='width:38px;height:38px;border-radius:50%;border:1px solid rgba(120,120,128,.35);background:'+(MODE?'#4d6bfe':'transparent')+';color:'+(MODE?'#fff':'inherit')+';margin-left:8px;font-size:13px;flex:0 0 auto';
var mic=D.getElementById('mic');if(mic&&mic.parentNode)mic.parentNode.insertBefore(btn,mic);else D.body.appendChild(btn);
btn.onclick=function(){MODE=!MODE;sv('u_claude',MODE?1:0);btn.style.background=MODE?'#4d6bfe':'transparent';btn.style.color=MODE?'#fff':'inherit';sys2(MODE?'agent style on: it asks one quick question, shows its live steps, then hands over the build':'agent style off')};
var state='idle',pendQ=null,pendAsk=null;
function buildish(v){v=v.toLowerCase();return (/\b(build|create|design|develop|make|code)\b/.test(v)&&/\b(app|site|website|dashboard|game|tool|page|clone|tracker|calculator|simulator|generator|checker)\b/.test(v))||(/\b(app|website|dashboard|game)\b/.test(v)&&/\b(build|create|make|design)\b/.test(v))}
function qcard(q){var d=mk('div','msg ai');var box=mk('div');box.style.cssText='background:rgba(120,120,128,.14);border-radius:14px;padding:12px 14px';
 var l=mk('div','Question');l.style.cssText='font-size:11px;opacity:.6;margin-bottom:6px';
 var b=mk('div',q);b.style.cssText='font-size:15px;font-weight:600';
 var c=mk('button','answer it below ⌄');c.style.cssText='margin-top:8px;padding:6px 12px;border:0;border-radius:12px;background:rgba(120,120,128,.25);color:inherit;font-size:12px';c.onclick=function(){inp.focus()};
 box.appendChild(l);box.appendChild(b);box.appendChild(c);d.appendChild(box);d.dataset.raw=q;chat.appendChild(d);chat.scrollTop=1e9}
function trail(labels){var d=mk('div','msg ai');d.dataset.raw='';var t0=Date.now();var rows=[];
 labels.forEach(function(lb){var r=mk('div');r.style.cssText='display:flex;align-items:center;gap:8px;padding:5px 2px;font-size:13px;opacity:.85';var dot=mk('span','●');dot.style.cssText='color:#4d6bfe;font-size:10px;animation:blink 1s infinite';var tx=mk('span',lb[0]);var tm=mk('span','');tm.style.cssText='opacity:.5;font-size:11px';r.appendChild(dot);r.appendChild(tx);r.appendChild(tm);d.appendChild(r);rows.push([lb,tx,tm,dot])});
 var st=mk('div','Working on it...');st.style.cssText='font-size:12px;opacity:.55;padding:6px 2px';d.appendChild(st);
 chat.appendChild(d);chat.scrollTop=1e9;
 var iv=setInterval(function(){var s=Math.round((Date.now()-t0)/1000);rows.forEach(function(r,i){var start=rows.slice(0,i).length*3;var e=Math.max(1,s-i*3);r[2].textContent=(i<rows.length-1||state==='building'?e+'s':'');if(state!=='building'&&i===rows.length-1)r[0]=r[0]});st.textContent=state==='building'?('Working on it... '+s+'s'):'Done';if(state!=='building'){clearInterval(iv);rows.forEach(function(r){r[3].style.color='#12b76a';r[3].style.animation='none'})}},1000);
 return d}
function run(){
 state='building';
 var full='Build this: '+pendAsk+'. Context from the user: '+pendQ+'. Reply with a one-line intro, then ONE complete polished single-file html app in a single ```html code block. Dark modern ui, mobile friendly, everything working, no external files.';
 var labels=[['Planning the build'],['Choosing the layout'],['Writing the code']];
 trail(labels);
 Promise.race([ask(full),new Promise(function(_,rj){setTimeout(function(){rj('timed out')},120000)})]).then(function(out){
  state='idle';
  var t=String(out||'').trim();
  if(t.indexOf('```')<0&&/<html|<!DOCTYPE/i.test(t))t='```html\n'+t+'\n```';
  var d=mk('div','msg ai');d.textContent=t;d.dataset.raw=t;chat.appendChild(d);chat.scrollTop=1e9;
 }).catch(function(e){state='idle';sys2('build failed: '+e+' - try again')});
}
function handle(v){
 if(state==='await'){state='thinking';pendQ=v;sys2('got it');run();return true}
 if(state!=='idle'){sys2('still working on it, one sec');return true}
 if(!MODE||!buildish(v))return false;
 state='asking';
 sys2('asking a question ⏱');
 ask('A user wants to: '+v+'. Ask them ONE short sharp clarifying question that most changes what you would build. Reply with ONLY the question, no preamble.').then(function(q){
  q=String(q||'').trim().replace(/^"|"$/g,'');
  if(!q){pendQ='';run();return}
  qcard(q);state='await';
 }).catch(function(){pendQ='';run()});
 return true}
function intercept(e,isKey){
 if(e.__ds)return false;
 var v=inp.value.trim();
 if(state==='idle'&&(!MODE||!buildish(v)))return false;
 if(!v&&(state==='idle'))return false;
 if(!handle(v))return false;
 e.stopImmediatePropagation();e.preventDefault();
 if(v){var u=mk('div','msg you',v);u.dataset.raw=v;chat.appendChild(u);inp.value='';inp.dispatchEvent(new Event('input'));chat.scrollTop=1e9}
 return true}
window.addEventListener('click',function(e){if(e.target===send)intercept(e,false)},true);
window.addEventListener('keydown',function(e){if(e.target===inp&&e.key==='Enter'&&!e.shiftKey)intercept(e,true)},true);
var st=D.createElement('style');st.textContent='@keyframes blink{50%{opacity:.2}}';D.head.appendChild(st);
sys2('agent style is on: build asks get one quick question, live working steps, then the finished app with a play button.');
})();
/* up15.js v1.0 - image studio: real image generation for deepagent (free image relay, no key) */
(function(){
var inp=document.getElementById('inp'),chat=document.getElementById('chat'),sendbtn=document.getElementById('send');
if(!inp||!chat||!sendbtn){return}
function esc(x){return String(x).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;')}
var VERBS='make|create|draw|generate|paint|render|design|show|give';
var NOUN='image|images|picture|pictures|pic|pics|photo|photograph|drawing|artwork|art|logo|wallpaper|illustration|portrait|icon|poster|scene';
function isImg(t){
 t=String(t||'').trim();
 if(!t)return false;
 if(/^\/?(image|img)[\s:]/i.test(t))return true;
 if(new RegExp('^(?:'+VERBS+')\\s+(?:me\\s+)?(?:an?\\s+|some\\s+)?(?:'+NOUN+')\\b','i').test(t))return true;
 if(new RegExp('^(?:'+VERBS+')\\s+(?:me\\s+)?[\\w\\-\' ]+\\s+(?:image|picture|photo|drawing|artwork|illustration)\\s+of\\s+','i').test(t))return true;
 if(/^(?:draw|paint|sketch)\s+/i.test(t))return true;
 return false;
}
function promptOf(t){
 t=String(t||'').trim().replace(/^\/?(image|img)[\s:]+/i,'');
 var m=t.match(new RegExp('^(?:'+VERBS+')\\s+(?:me\\s+)?(?:an?\\s+|some\\s+|this\\s+)?(?:'+NOUN+')\\s*(?:of|showing|with|like|:)?\\s*(.*)$','i'));
 if(m&&(m[1]||'').trim())return m[1].trim();
 return t;
}
function running(){var p=sendbtn.querySelector('path');return !!(p&&p.getAttribute('d')==='M9 9h6v6H9z')}
function poke(){try{inp.dispatchEvent(new Event('input',{bubbles:true}))}catch(e){try{inp.dispatchEvent(new Event('input'))}catch(e2){}}}
function persist(){try{if(window.__upP)window.__upP()}catch(e){}}
function say(){var d=document.createElement('div');d.className='msg ai';chat.appendChild(d);chat.scrollTop=1e9;return d}
function done(){try{inp.style.height='auto'}catch(e){};poke()}
function stripTag(raw){return String(raw||'').replace(/^\[generated image:\s*/,'').replace(/\]$/,'')}
function gen(v){
 var p=promptOf(v);
 var seed=Math.floor(Math.random()*900000000)+100000000;
 var url='https://image.pollinations.ai/prompt/'+encodeURIComponent(p)+'?width=1024&height=1024&nologo=true&seed='+seed;
 try{CG.renderMsg('u',v)}catch(e){var u=document.createElement('div');u.className='msg you';u.textContent=v;chat.appendChild(u)}
 var h=[];try{h=CG.hist()}catch(e){}
 try{h.push({role:'user',content:v})}catch(e){}
 var ct=document.getElementById('ctitle');if(ct&&!ct.textContent)ct.textContent=v.slice(0,30);
 persist();
 var d=say();
 d.innerHTML='<span class="u15load">painting your image…</span><span class="cursor"></span>';
 var im=new Image(),settled=false;
 var t=setTimeout(function(){if(!settled){settled=true;d.innerHTML='<span class="u15load">image service is slow, nothing came back in 2 minutes. try again.</span>'}},120000);
 function finish(raw){try{h.push({role:'assistant',content:raw})}catch(e){};persist()}
 im.onload=function(){if(settled)return;settled=true;clearTimeout(t);
  d.dataset.raw='[generated image: '+p+']';
  d.innerHTML='<img class="u15img" alt="'+esc(p)+'" src="'+url+'" referrerpolicy="no-referrer">'+
   '<div class="u15row"><button class="u15btn" data-u15="dl">download</button><button class="u15btn" data-u15="again">again</button><button class="u15btn" data-u15="cpp">copy prompt</button></div>';
  finish(d.dataset.raw);chat.scrollTop=1e9};
 im.onerror=function(){if(settled)return;settled=true;clearTimeout(t);
  d.dataset.raw='image generation failed - the image service did not respond. try again.';
  d.innerHTML=esc(d.dataset.raw);finish(d.dataset.raw)};
 im.src=url;
 done();
}
document.addEventListener('click',function(e){
 var b=e.target&&e.target.closest?e.target.closest('.u15btn'):null;if(!b)return;
 var k=b.getAttribute('data-u15');
 var msg=b.closest('.msg.ai');if(!msg)return;
 var img=msg.querySelector('img.u15img'),raw=msg.dataset.raw||'';
 if(k==='dl'&&img){var a=document.createElement('a');a.href=img.src;a.download='deepagent-image.jpg';a.target='_blank';a.rel='noopener';document.body.appendChild(a);a.click();a.remove()}
 else if(k==='again'){gen(stripTag(raw))}
 else if(k==='cpp'){try{navigator.clipboard.writeText(stripTag(raw))}catch(err){}}
});
var origSend=sendbtn.onclick;
sendbtn.onclick=function(){
 if(!running()&&inp.value&&isImg(inp.value)){gen(inp.value);return}
 if(origSend)return origSend.apply(this,arguments);
};
document.addEventListener('keydown',function(e){
 if(e.key!=='Enter'||e.shiftKey)return;
 if(e.target!==inp)return;
 if(running())return;
 if(inp.value&&isImg(inp.value)){e.preventDefault();e.stopImmediatePropagation();gen(inp.value)}
},true);
try{var upd=document.getElementById('upd');if(upd){var val=upd.querySelector('.val');upd.onclick=function(){if(val){var o=val.textContent;val.textContent='2.9.14(21)';setTimeout(function(){val.textContent=o},1500)}}}}catch(e){}
var st=document.createElement('style');
st.textContent='.u15img{max-width:min(100%,440px);width:100%;border-radius:14px;display:block;margin:4px 0 8px;border:1px solid var(--ln,rgba(0,0,0,.1))}.u15row{display:flex;gap:8px;margin-top:2px}.u15btn{border:1px solid var(--ln,rgba(0,0,0,.12));background:transparent;color:var(--tx,#0d0d0d);border-radius:999px;padding:4px 12px;font-size:12px;cursor:pointer}.u15load{color:var(--dim,#8f8f8f);font-size:14px}body.dark .u15btn{color:#e5e5e5;border-color:rgba(255,255,255,.2)}';
document.head.appendChild(st);
console.log('[chatgpt up15.js v1.0] image studio loaded: real image generation on the free image relay');
})();

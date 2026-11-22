/* deepagent14 - live app preview v3.8 */
(function(){
var D=document,chat=D.getElementById('chat');
function mk(t,c,x){var e=D.createElement(t);if(c)e.className=c;if(x!=null)e.textContent=x;return e}
function extract(raw){
 var blocks=(raw.match(/```[a-z]*\n?[\s\S]*?```/gi)||[]);
 var codes=blocks.map(function(b){return b.replace(/^```[a-z]*\n?/i,'').replace(/```$/,'')});
 var joined='';
 codes.forEach(function(c){if(/<\w+[\s>]/.test(c))joined+=(joined?'\n':'')+c});
 if(!joined){
  if(/<!DOCTYPE|<html[\s>]|<canvas[\s>]/i.test(raw))joined=raw;else return null
 }
 if(!/<html[\s>]|<!DOCTYPE/i.test(joined)){joined='<!DOCTYPE html><html><head><meta name="viewport" content="width=device-width, initial-scale=1"></head><body>'+joined+'</body></html>'}
 return joined
}
var lastSeen=null;
new MutationObserver(function(ms){ms.forEach(function(m){
 if(m.type!=='attributes')return;var n=m.target;if(!n.classList||!n.classList.contains('ai'))return;
 var raw=n.dataset.raw||'';if(!raw||raw===lastSeen)return;lastSeen=raw;
 if(n.dataset.pvdone)return;n.dataset.pvdone=1;
 var code=extract(raw);if(!code)return;
 var bar=mk('div');bar.style.cssText='display:flex;gap:8px;margin:8px 0';
 var b1=mk('button','▶ preview app');b1.style.cssText='padding:7px 14px;border:0;border-radius:14px;background:#4d6bfe;color:#fff;font-size:13px';b1.__code=code;
 var b2=mk('button','↗ new tab');b2.style.cssText='padding:7px 14px;border:1px solid rgba(120,120,128,.35);border-radius:14px;background:transparent;font-size:13px';b2.__code=code;
 b1.addEventListener('click',function(){open_(b1.__code,false)});
 b2.addEventListener('click',function(){var bl=new Blob([b2.__code],{type:'text/html'});window.open(URL.createObjectURL(bl),'_blank')});
 bar.appendChild(b1);bar.appendChild(b2);n.appendChild(bar);
})}).observe(chat,{subtree:true,attributes:true,attributeFilter:['data-raw']});
function open_(code){
 var ov=mk('div');ov.style.cssText='position:fixed;inset:0;z-index:95;background:#000;display:flex;flex-direction:column';
 var bar=mk('div');bar.style.cssText='display:flex;align-items:center;padding:8px 12px;background:#111;color:#fff';
 var t=mk('span','app preview');t.style.cssText='flex:1;font-size:13px';
 var x=mk('button','✕ close');x.style.cssText='padding:6px 14px;border:0;border-radius:14px;background:#e5484d;color:#fff;font-size:13px';
 x.onclick=function(){D.body.removeChild(ov)};
 bar.appendChild(t);bar.appendChild(x);
 var f=D.createElement('iframe');f.setAttribute('sandbox','allow-scripts allow-modals allow-forms allow-popups');f.style.cssText='flex:1;width:100%;border:0;background:#fff';f.setAttribute('srcdoc',code);
 ov.appendChild(bar);ov.appendChild(f);D.body.appendChild(ov);
}
var s=mk('div','msg sys','preview mode live: ask it to build an app and a play button shows up on the reply, tap it to run the app right here.');s.style.display='block';
})();
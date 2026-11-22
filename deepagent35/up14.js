/* deepagent35 up14.js - upgrade pack 14: search inside the current chat (v1.0) */
(function(){
if(window.__u14)return;window.__u14=1;
console.log('[chatgpt up14.js v1.0] search in chat loaded');
var css=document.createElement('style');
css.textContent='#u14bar{position:fixed;top:54px;left:50%;transform:translateX(-50%);z-index:70;display:none;align-items:center;gap:4px;background:#fff;border:1px solid #e5e5e5;border-radius:14px;padding:6px 10px;box-shadow:0 8px 24px rgba(0,0,0,.14);max-width:calc(100% - 24px)}body.dark #u14bar{background:#1e1e1e;border-color:#3a3a3a}#u14bar.on{display:flex}#u14q{border:none;outline:none;font:14px -apple-system,BlinkMacSystemFont,sans-serif;width:min(220px,40vw);background:transparent;color:#0d0d0d}body.dark #u14q{color:#e5e5e5}#u14bar .ub{background:none;border:none;cursor:pointer;color:#8e8e8e;padding:2px 6px;border-radius:6px;font:13px sans-serif;line-height:1}#u14bar .ub:hover{background:#f0f0f0}body.dark #u14bar .ub:hover{background:#2a2a2a}#u14count{font:12px sans-serif;color:#8e8e8e;min-width:52px;text-align:center;white-space:nowrap}mark.u14m{background:rgba(122,184,255,.45);border-radius:2px;color:inherit}mark.u14c{background:#7ab8ff;color:#0d0d0d;border-radius:2px}';
document.head.appendChild(css);
var SKIP={SCRIPT:1,STYLE:1,SVG:1,TEXTAREA:1,INPUT:1,BUTTON:1,SELECT:1,MARK:1};
function okNode(n){var p=n.parentElement;while(p&&p!==document.body){if(SKIP[p.tagName])return false;if(p.id==='u14bar')return false;var c=p.classList;if(c&&(c.contains('acts')||c.contains('sugg')||c.contains('u14skip')))return false;p=p.parentElement}return true}
var bar=document.createElement('div');bar.id='u14bar';
bar.innerHTML='<input id="u14q" placeholder="Find in chat" autocomplete="off"><span id="u14count"></span><button class="ub" id="u14p" title="previous">&#8593;</button><button class="ub" id="u14n" title="next">&#8595;</button><button class="ub" id="u14x" title="close search">&#10005;</button>';
document.body.appendChild(bar);
var q=bar.querySelector('#u14q'),count=bar.querySelector('#u14count');
var marks=[],hits=[],idx=0,term='',openState=false;
function unwrapAll(){marks.forEach(function(m){var p=m.parentNode;if(!p)return;p.replaceChild(document.createTextNode(m.textContent),m);p.normalize()});marks=[]}
function run(){unwrapAll();hits=[];idx=0;term=q.value;var t=term.trim();
 if(!t){count.textContent='';return}
 var rx=null;try{rx=new RegExp(t.replace(/[.*+?^${}()|[\]\\]/g,'\\$&'),'ig')}catch(e){rx=null}
 if(!rx){count.textContent='';return}
 var chatEl=document.getElementById('chat')||document.body;
 var tw=document.createTreeWalker(chatEl,NodeFilter.SHOW_TEXT,{acceptNode:function(n){if(!n.nodeValue||!n.nodeValue.trim())return NodeFilter.FILTER_REJECT;return okNode(n)?NodeFilter.FILTER_ACCEPT:NodeFilter.FILTER_REJECT}});
 var nodes=[],nn;while((nn=tw.nextNode()))nodes.push(nn);
 nodes.forEach(function(tn){var v=tn.nodeValue;rx.lastIndex=0;var m,parts=[],li=0,found=false;
  while((m=rx.exec(v))){found=true;var s=m.index,e=s+m[0].length;if(s>li)parts.push(['t',v.slice(li,s)]);parts.push(['m',v.slice(s,e)]);li=e;if(!e)rx.lastIndex=1}
  if(!found)return;if(li<v.length)parts.push(['t',v.slice(li)]);
  var fr=document.createDocumentFragment();parts.forEach(function(pt){if(pt[0]==='t')fr.appendChild(document.createTextNode(pt[1]));else{var mk=document.createElement('mark');mk.className='u14m';mk.textContent=pt[1];fr.appendChild(mk)}});tn.parentNode.replaceChild(fr,tn)});
 hits=[].slice.call(document.querySelectorAll('#chat mark.u14m'));
 if(!hits.length){count.textContent='no matches';console.log('[up14] 0 matches for "'+term+'"');return}
 go(0,true);console.log('[up14] '+hits.length+' match'+(hits.length===1?'':'es')+' for "'+term+'"');
}
function go(k,first){if(!hits.length)return;idx=first?0:((k%hits.length)+hits.length)%hits.length;
 hits.forEach(function(h,i){h.className=i===idx?'u14c':'u14m'});
 try{hits[idx].scrollIntoView({block:'center',behavior:'smooth'})}catch(e){}
 count.textContent=(idx+1)+'/'+hits.length;
 console.log('[up14] match '+(idx+1)+'/'+hits.length)}
function openB(){openState=true;bar.classList.add('on');console.log('[up14] find bar opened');setTimeout(function(){q.focus();run()},0)}
function closeB(){openState=false;bar.classList.remove('on');unwrapAll();hits=[];idx=0;count.textContent='';console.log('[up14] find closed, highlights cleared')}
q.addEventListener('input',run);
bar.querySelector('#u14n').addEventListener('click',function(){go(idx+1)});
bar.querySelector('#u14p').addEventListener('click',function(){go(idx-1)});
bar.querySelector('#u14x').addEventListener('click',closeB);
q.addEventListener('keydown',function(e){if(e.key==='Escape'){e.preventDefault();e.stopPropagation();closeB()}else if(e.key==='Enter'||e.key==='ArrowDown'){e.preventDefault();go(idx+1)}else if(e.key==='ArrowUp'){e.preventDefault();go(idx-1)}});
document.addEventListener('keydown',function(e){if((e.ctrlKey||e.metaKey)&&(e.key==='f'||e.key==='F')){e.preventDefault();openB()}});
var tr=document.querySelector('#top .tright');
if(tr){var b=document.createElement('button');b.className='circ';b.id='u14find';b.title='search in chat';b.innerHTML='<svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/></svg>';tr.insertBefore(b,tr.firstChild)}
var chatEl=document.getElementById('chat');
if(chatEl&&window.MutationObserver){new MutationObserver(function(){if(openState)closeB()}).observe(chatEl,{childList:true,subtree:false})}
})();

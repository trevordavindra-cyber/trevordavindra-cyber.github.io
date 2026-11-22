/* deepagent27 up6.js - upgrade pack 6: dark mode toggle (v1.0) */
(function(){
var K='ds_theme';
function cur(){try{return localStorage.getItem(K)==='dark'}catch(e){return false}}
function apply(on){document.body.classList.toggle('dark',on);try{localStorage.setItem(K,on?'dark':'light')}catch(e){}
 var m=document.getElementById('u6mode');if(m)m.textContent=on?'Dark':'Light';}
if(cur())document.body.classList.add('dark');
function build(){
 var drawer=document.getElementById('drawer');if(!drawer)return;
 var anchor=document.getElementById('dbottom');if(!anchor)return;
 if(document.getElementById('u6row'))return;
 var row=document.createElement('button');
 row.id='u6row';row.className='sitem';
 row.setAttribute('data-u6','1');
 row.innerHTML='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg><span id="u6mode">'+(document.body.classList.contains('dark')?'Dark':'Light')+'</span>';
 row.onclick=function(){apply(!document.body.classList.contains('dark'));console.log('[up6] theme ->',(document.body.classList.contains('dark')?'dark':'light'))};
 drawer.insertBefore(row,anchor);
 var sw=document.querySelector('.sw');if(sw){var wrap=sw.closest('.row');if(wrap&&!wrap.getAttribute('data-u6swatch')){wrap.setAttribute('data-u6swatch','1');}}
}
function sync(){var r=document.getElementById('u6row');if(!r)return;var m=document.getElementById('u6mode');if(m)m.textContent=document.body.classList.contains('dark')?'Dark':'Light';}
build();
var mo=new MutationObserver(function(){build();sync();});
try{mo.observe(document.body,{childList:true,subtree:true})}catch(e){}
console.log('[up6] dark mode toggle v1.0 loaded, initial:',document.body.classList.contains('dark')?'dark':'light');
})();

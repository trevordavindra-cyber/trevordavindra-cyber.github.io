'use strict';
// up23.js — PHASE 17 CREATOR ANALYTICS (Nov 23 2026)
// performance journal, views chart, best-time finder, engagement rank,
// hashtag bank, caption library, duplicate idea checker, shot list,
// series episode planner, weekly stats summary
(function(){
if(window.__tk2up23)return;window.__tk2up23=1;
function $(id){return document.getElementById(id)}
function mkBtn(t,fn,fl,id){var b=document.createElement('button');b.className='btn';b.textContent=t;b.style.flex=fl||'0 0 auto';if(id)b.id=id;b.onclick=fn;return b}
function mkInp(id,ph){var i=document.createElement('input');i.id=id;i.placeholder=ph||'';return i}
function mkSel(id,opts){var s=document.createElement('select');s.id=id;(opts||[]).forEach(function(o){var op=document.createElement('option');op.textContent=o;s.appendChild(op)});return s}
function mkRow(gap){var r=document.createElement('div');r.className='row';r.style.display='flex';r.style.gap=(gap||6)+'px';r.style.marginTop='6px';r.style.alignItems='center';return r}
function log(m,loud){try{(window.log||window.addLog||function(){})(m,loud)}catch(e){}}
function saveE(){try{if(typeof save==='function')save()}catch(e){}}
function esc(s){return String(s).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]||c})}

if(!S.eco)S.eco={};var E=S.eco;
if(!E.f23)E.f23={journal:[],tags:[],caps:[],shots:[],ser:{part:0,name:''}};

function dl(name,text,mime){try{var a=document.createElement('a');a.download=name;a.href='data:'+((mime||'text/plain'))+';charset=utf-8,'+encodeURIComponent(text);document.body.appendChild(a);a.click();a.remove();log(name+' downloaded',true);return true}catch(e){log('download failed: '+e.message);return false}}
function cp(t){try{navigator.clipboard.writeText(t);log('copied to clipboard');return true}catch(e){log('copy failed');return false}}
function tokens(s){return String(s||'').toLowerCase().replace(/[^a-z0-9 ]/g,' ').split(/\s+/).filter(Boolean)}
function jaccard(a,b){var A={},B={},i;tokens(a).forEach(function(x){A[x]=1});tokens(b).forEach(function(x){B[x]=1});var ka=Object.keys(A),kb=Object.keys(B);if(!ka.length||!kb.length)return 0;var inter=0;ka.forEach(function(x){if(B[x])inter++});return inter/(ka.length+kb.length-inter)}
function pool(){var out=[];(E.f23.caps||[]).forEach(function(x){out.push(x.t)});Object.keys(S.eco||{}).forEach(function(k){var v=S.eco[k];if(Array.isArray(v)){v.forEach(function(it){if(it&&typeof it==='object'&&typeof it.text==='string'&&it.text.length>4)out.push(it.text)})}});return out}

// 1 performance journal
function addPost(){var d=$('f23pd').value||new Date().toISOString().slice(0,10);var v=parseInt($('f23pv').value)||0,l=parseInt($('f23pl').value)||0,c=parseInt($('f23pc').value)||0,s=parseInt($('f23ps').value)||0,f=parseInt($('f23pf').value)||0;var note=$('f23pn').value.trim();
E.f23.journal.push({d:d,plat:$('f23pt').value,v:v,l:l,c:c,s:s,f:f,note:note,ts:Date.now()});saveE();renderJ();log('post logged: '+d+' '+$('f23pt').value+' — '+v+' views, ER '+((v?(l+c+s)/v*100:0).toFixed(1)+'%'),true);}
// 2 views chart
function drawChart(){var j=E.f23.journal;if(!j.length)return log('journal is empty — log a post first');var cv=$('f23cv')||document.createElement('canvas');if(!$('f23cv')){cv.id='f23cv';cv.width=320;cv.height=110;$('f23chartbox').appendChild(cv)}
var ctx=cv.getContext('2d');ctx.fillStyle='#0a0a12';ctx.fillRect(0,0,320,110);var max=Math.max.apply(null,j.map(function(x){return x.v}))||1;var n=Math.min(j.length,16);var bw=Math.max(4,Math.floor(300/n)-2);
var avg=j.reduce(function(a,x){return a+x.v},0)/j.length;
j.slice(-16).forEach(function(x,i){var hh=Math.max(2,Math.round(x.v/max*80));ctx.fillStyle=x.v>=avg?'#00e5ff':'#7a3cff';ctx.fillRect(10+i*(bw+2),95-hh,bw,hh);if(x.v>=avg){ctx.fillStyle='#fff';ctx.fillRect(10+i*(bw+2),95-hh-2,bw,1)}});
ctx.strokeStyle='#ff5252';var ay=Math.round(95-(avg/max*80));ctx.beginPath();ctx.moveTo(8,ay);ctx.lineTo(312,ay);ctx.stroke();
ctx.fillStyle='#9aa';ctx.font='9px monospace';ctx.fillText('views '+j.map(function(x){return x.v}).join(' '),8,108);
log('chart drawn — '+j.length+' posts, avg '+Math.round(avg)+' views, red line = avg',true);}
// 3 best time finder
function bestTime(){var j=E.f23.journal.filter(function(x){return typeof x.v==='number'&&x.d});if(!j.length)return log('no posts in the journal yet');
var byH={},byD={};j.forEach(function(x){var hh=parseInt(x.d.slice(11,13));if(isNaN(hh)){hh=x.h!=null?x.h:12}byH[hh]=(byH[hh]||[]).concat(x.v);var wd=['sun','mon','tue','wed','thu','fri','sat'][new Date(x.d+'T12:00:00').getDay()];byD[wd]=(byD[wd]||[]).concat(x.v)});
var bestH=null,bv=-1;Object.keys(byH).forEach(function(h){var t=byH[h].reduce(function(a,b){return a+b},0)/byH[h].length;if(t>bv){bv=t;bestH=h}});
var bestD=null,dv=-1;Object.keys(byD).forEach(function(w){var t=byD[w].reduce(function(a,b){return a+b},0)/byD[w].length;if(t>dv){dv=t;bestD=w}});
if(!bestD)bestD='(no full dates logged)';
log('best hour: '+bestH+':00 ('+Math.round(bv)+' avg views) — best weekday: '+bestD+' ('+Math.round(dv)+' avg). more posts = sharper answer',true);}
// 4 engagement rank
function topER(){var j=E.f23.journal.filter(function(x){return x.v>0}).map(function(x){return {d:x.d,er:(x.l+x.c+x.s)/x.v*100}}).sort(function(a,b){return b.er-a.er});if(!j.length)return log('need posts with views logged first');
log('top ER: '+j.slice(0,3).map(function(x,i){return '#'+(i+1)+' '+x.er.toFixed(1)+'% ('+x.d+')'}).join('  '),true);}
// 5 hashtag bank
function addTag(){var t=$('f23tag').value.trim();if(!t)return log('type the tag set first');var base=t.split(/\s+/).filter(Boolean);if(!base.length)return log('type the tag set first');
var key=base[0].toLowerCase().replace('#','');var ex=E.f23.tags.find(function(x){return x.k===key});if(ex)ex.t=t;else E.f23.tags.push({t:t,k:key,u:0});$('f23tag').value='';saveE();renderT();log('tag set saved ('+base.length+' tags)');}
function useTag(i){var x=E.f23.tags[i];x.u++;saveE();renderT();if(!cp(x.t))log(x.t);else log('tag set inserted (used '+x.u+'x)');}
function delTag(i){E.f23.tags.splice(i,1);saveE();renderT()}
function renderT(){var box=$('f23taglist');if(!box)return;box.innerHTML=E.f23.tags.length?'':'<span class="note">no tag sets saved</span>';
E.f23.tags.forEach(function(x,i){var r=mkRow();var s=document.createElement('span');s.className='note';s.style.flex='1 1 auto';s.innerHTML=esc(x.t)+' <b>· used '+x.u+'x</b>';r.appendChild(s);r.appendChild(mkBtn('INSERT',function(){useTag(i)}));r.appendChild(mkBtn('DEL',function(){delTag(i)}));box.appendChild(r)})}
// 6 caption library
function addCap(){var t=$('f23cap').value.trim();if(!t)return log('type the caption first');E.f23.caps.push({t:t,u:false,ts:Date.now()});$('f23cap').value='';saveE();renderC();log('caption banked ('+E.f23.caps.length+' saved)');}
function capAct(i,act){var x=E.f23.caps[i];if(act==='copy'){cp(x.t)}else if(act==='used'){x.u=!x.u;saveE()}else{E.f23.caps.splice(i,1);saveE()}renderC()}
function renderC(){var box=$('f23caplist');if(!box)return;box.innerHTML=E.f23.caps.length?'':'<span class="note">no captions saved</span>';
E.f23.caps.forEach(function(x,i){var r=mkRow();var s=document.createElement('span');s.className='note';s.style.flex='1 1 auto';s.innerHTML=esc(x.t.slice(0,60))+(x.u?' <b>· USED</b>':'');r.appendChild(s);r.appendChild(mkBtn('COPY',function(){capAct(i,'copy')}));r.appendChild(mkBtn(x.u?'UNUSED':'USED',function(){capAct(i,'used')}));r.appendChild(mkBtn('DEL',function(){capAct(i,'del')}));box.appendChild(r)})}
// 7 duplicate idea checker
function dupCheck(){var t=$('f23dup').value.trim();if(!t)return log('type the idea or caption to check');var p=pool();if(!p.length)return log('nothing saved to compare against yet');
var best=0,bi=-1;p.forEach(function(x,i){var s=jaccard(t,x);if(s>best){best=s;bi=i}});
var verdict=best>=0.55?'DUPLICATE — rework it':best>=0.3?'CLOSE — same idea at heart, angle it differently':'FRESH — go for it';
log('dup check: '+verdict+' (best match '+(bi>=0?esc(p[bi].slice(0,40)):'')+' '+Math.round(best*100)+'%)',true);}
// 8 shot list
function addShot(){var t=$('f23shot').value.trim();if(!t)return log('type the shot first');E.f23.shots.push({d:t,st:'todo'});$('f23shot').value='';saveE();renderS();log('shot added to the list');}
function shotAct(i,act){var x=E.f23.shots[i];if(act==='cyc'){x.st=x.st==='todo'?'shot':x.st==='shot'?'cut':'todo';saveE()}else{E.f23.shots.splice(i,1);saveE()}renderS()}
function shotCSV(){var rows=[['shot','status']].concat(E.f23.shots.map(function(x){return [x.d,x.st]}));dl('tiktok2-shot-list-'+Date.now()+'.csv',rows.map(function(r){return r.map(function(c){return '"'+String(c).replace(/"/g,'""')+'"'}).join(',')}).join('\n'),'text/csv');}
function renderS(){var box=$('f23shotlist');if(!box)return;box.innerHTML=E.f23.shots.length?'':'<span class="note">no shots yet</span>';
E.f23.shots.forEach(function(x,i){var r=mkRow();var b=document.createElement('button');b.className='btn';b.textContent=x.st.toUpperCase();b.onclick=function(){shotAct(i,'cyc')};var s=document.createElement('span');s.className='note';s.style.flex='1 1 auto';s.textContent=x.d;
r.appendChild(b);r.appendChild(s);r.appendChild(mkBtn('DEL',function(){shotAct(i,'del')}));box.appendChild(r)})}
// 9 series episode planner
function nextEp(){var name=E.f23.ser.name||($('f23ser').value.trim());if(!name)return log('type the series name first');E.f23.ser.name=name;var n=(E.f23.ser.part||0)+1;E.f23.ser.part=n;saveE();
var temps=[name+' — part '+n,name+' part '+n+': the part everyone skipped','nobody told me this about '+name,'i tested '+name+' for 7 days ('+n+')',name+' but every second counts — '+n];
log('next episode is part '+n+'. tap COPY on one:');var box=$('f23eplist');box.innerHTML='';temps.forEach(function(t){var r=mkRow();var s=document.createElement('span');s.className='note';s.style.flex='1 1 auto';s.textContent=t;r.appendChild(s);r.appendChild(mkBtn('COPY',function(){cp(t)}));box.appendChild(r)})}
// 10 weekly stats
function weekStats(){var now=Date.now();var j=E.f23.journal.filter(function(x){return now-((x.ts||0))<7*86400000});if(!j.length)return log('no posts logged in the last 7 days');
var v=0,l=0,c=0,s=0;j.forEach(function(x){v+=x.v;l+=x.l;c+=x.c;s+=x.s});var er=v?((l+c+s)/v*100):0;
log('last 7 days: '+j.length+' posts — '+v.toLocaleString()+' views, '+l+' likes, '+c+' comments, '+s+' saves, avg ER '+er.toFixed(1)+'%',true);}

function renderJ(){var box=$('f23jlist');if(!box)return;box.innerHTML=E.f23.journal.length?'':'<span class="note">no posts logged yet</span>';
E.f23.journal.slice().reverse().forEach(function(x,ri){var i=E.f23.journal.length-1-ri;var r=mkRow();var s=document.createElement('span');s.className='note';s.style.flex='1 1 auto';
s.innerHTML=esc(x.d+' '+x.plat+' · '+x.v.toLocaleString()+' views · '+x.l+' likes · ER '+((x.v?(x.l+x.c+x.s)/x.v*100:0).toFixed(1)+'%')+(x.note?' · '+esc(x.note):''));
r.appendChild(s);r.appendChild(mkBtn('DEL',function(){E.f23.journal.splice(i,1);saveE();renderJ()}));box.appendChild(r)})}

function mount(){
if($('f23pd'))return;
var card=document.createElement('div');card.className='card';
var h=document.createElement('h2');h.textContent='Creator Analytics (Phase 17)';card.appendChild(h);
var r1=mkRow();r1.appendChild(mkInp('f23pd','date (today if blank)'));r1.appendChild(mkSel('f23pt',['tiktok','reels','shorts']));card.appendChild(r1);
var r2=mkRow();r2.appendChild(mkInp('f23pv','views'));r2.appendChild(mkInp('f23pl','likes'));r2.appendChild(mkInp('f23pc','comments'));card.appendChild(r2);
var r3=mkRow();r3.appendChild(mkInp('f23ps','saves'));r3.appendChild(mkInp('f23pf','follows'));r3.appendChild(mkInp('f23pn','note (optional)'));card.appendChild(r3);
var r4=mkRow();r4.appendChild(mkBtn('LOG POST',addPost));r4.appendChild(mkBtn('VIEWS CHART',drawChart));r4.appendChild(mkBtn('BEST TIME',bestTime));r4.appendChild(mkBtn('TOP ER',topER));card.appendChild(r4);
var cb=document.createElement('div');cb.id='f23chartbox';card.appendChild(cb);
var jl=document.createElement('div');jl.id='f23jlist';jl.style.marginTop='6px';card.appendChild(jl);
var r5=mkRow();r5.appendChild(mkInp('f23tag','tag set — space separated'));r5.appendChild(mkBtn('SAVE TAGS',addTag,'1 1 auto'));card.appendChild(r5);
var tl=document.createElement('div');tl.id='f23taglist';card.appendChild(tl);
var r6=mkRow();r6.appendChild(mkInp('f23cap','caption to bank'));r6.appendChild(mkBtn('BANK CAPTION',addCap,'1 1 auto'));card.appendChild(r6);
var cl=document.createElement('div');cl.id='f23caplist';card.appendChild(cl);
var r7=mkRow();r7.appendChild(mkInp('f23dup','check this idea or caption for repeats'));r7.appendChild(mkBtn('DUP CHECK',dupCheck,'1 1 auto'));card.appendChild(r7);
var r8=mkRow();r8.appendChild(mkInp('f23shot','shot to film'));r8.appendChild(mkBtn('ADD SHOT',addShot));r8.appendChild(mkBtn('SHOT CSV',shotCSV));card.appendChild(r8);
var sl=document.createElement('div');sl.id='f23shotlist';card.appendChild(sl);
var r9=mkRow();r9.appendChild(mkInp('f23ser','series name'));r9.appendChild(mkBtn('NEXT EPISODE',nextEp));card.appendChild(r9);
var el=document.createElement('div');el.id='f23eplist';card.appendChild(el);
var r10=mkRow();r10.appendChild(mkBtn('WEEKLY STATS',weekStats,'1 1 auto'));card.appendChild(r10);
var note=document.createElement('div');note.className='note';note.textContent='log every post with its real numbers — the chart, best-time finder, top-ER rank and weekly stats all read the journal. tag sets and captions bank here, the dup checker scores your new idea against everything saved, and the shot list exports to csv.';
card.appendChild(note);
var hs=document.querySelectorAll('.card h2');var anchor=null;
for(var i=0;i<hs.length;i++){if(hs[i].textContent.indexOf('Finishing Lab')>=0){anchor=hs[i].parentElement;break}}
if(!anchor){for(var j=0;j<hs.length;j++){if(hs[j].textContent.indexOf('Studio II')>=0){anchor=hs[j].parentElement;break}}}
if(anchor){if(anchor.nextSibling)anchor.parentElement.insertBefore(card,anchor.nextSibling);else anchor.parentElement.appendChild(card)}
$('f23pd').value=new Date().toISOString().slice(0,10);
renderJ();renderT();renderC();renderS();
log('creator analytics live — journal, chart, best time, er rank, tags, captions, dup check, shot list');
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',mount);else mount();
})();

/* ILLUMINATI upgrade #110: hl110-rea-combine (v19.18)
   REA // REVERSE ENGINEER ANYTHING — REA's whole browser-side world combined
   into the Order: a real GitHub repo browser (search any repo, walk its tree,
   read any file, READMEs, stars, forks, licenses) with morluto/rea (461k
   stars, MIT) preloaded, plus REA's agents + skills catalog pulled LIVE from
   the real repo, and its docs and quick-start. The node-only analysis core
   stays on Fo's side by design. Pure addition: one new tab in the nav.
   Nothing existing is touched. */
(function(){
  if(window.__HL110) return; window.__HL110=true;
  var API='https://api.github.com';
  var DEFAULTS=[
    {o:'morluto',r:'rea',note:'REA itself'},
    {o:'ggml-org',r:'llama.cpp',note:'local brain engine'}
  ];
  var cur=null, treeCache={}, opened=false;
  function el(t,c,h){var e=document.createElement(t); if(c)e.className=c; if(h!=null)e.innerHTML=h; return e;}
  function esc(s){return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');}
  function $(id){return document.getElementById(id);}
  function setMsg(s){var n=$('rea-state'); if(n)n.textContent=s;}
  function gh(path){
    return fetch(API+path,{headers:{'Accept':'application/vnd.github+json'}}).then(function(r){
      if(r.status===403) throw new Error('github rate limit hit — try again in about an hour');
      if(!r.ok) throw new Error('github answered '+r.status);
      return r.json();
    });
  }
  function ghRaw(path){
    return fetch(API+path,{headers:{'Accept':'application/vnd.github.raw'}}).then(function(r){
      if(!r.ok) throw new Error('github answered '+r.status);
      return r.text();
    });
  }
  function b64ToText(b64){
    try{
      var bin=atob(String(b64).replace(/\s+/g,''));
      var bytes=new Uint8Array(bin.length);
      for(var i=0;i<bin.length;i++)bytes[i]=bin.charCodeAt(i);
      return new TextDecoder('utf-8',{fatal:false}).decode(bytes);
    }catch(e){return '(could not decode this file)';}
  }
  function switchTo(){
    var nav=document.getElementById('nav'); if(!nav)return;
    var buttons=nav.querySelectorAll('button');
    for(var i=0;i<buttons.length;i++)buttons[i].classList.toggle('on',buttons[i].dataset.m==='rea');
    var mods=document.querySelectorAll('.mod');
    for(var j=0;j<mods.length;j++)mods[j].classList.toggle('on',mods[j].id==='m-rea');
    if(!opened){opened=true; openRepo('morluto','rea');}
  }
  function search(){
    var q=$('rea-q').value.trim(); if(!q)return;
    var out=$('rea-results'); out.innerHTML='';
    setMsg('searching github for '+q+'…');
    gh('/search/repositories?q='+encodeURIComponent(q)+'&per_page=8&sort=stars').then(function(j){
      out.innerHTML='';
      if(!j.items||!j.items.length){out.appendChild(el('div','pline','nothing found — try another name'));setMsg('search done');return;}
      j.items.forEach(function(it){
        var b=el('button','pbtn',(it.full_name||'')+' · '+(it.stargazers_count||0)+'★ '+(it.language?('· '+it.language):''));
        b.style.cssText='display:block;width:100%;text-align:left;margin:3px 0;';
        b.onclick=function(){openRepo(it.owner.login,it.name);};
        out.appendChild(b);
      });
      setMsg(j.total_count+' repos found — showing top 8');
    }).catch(function(e){setMsg('search failed: '+esc(String(e).slice(0,120)));});
  }
  function openRepo(o,r){
    cur={o:o,r:r}; treeCache={};
    setMsg('opening '+o+'/'+r+'…');
    var meta=$('rea-meta'), files=$('rea-files'), view=$('rea-view'), rd=$('rea-readme');
    meta.innerHTML=''; files.innerHTML=''; view.innerHTML=''; rd.innerHTML='';
    gh('/repos/'+o+'/'+r).then(function(j){
      meta.innerHTML='<b>'+esc(j.full_name)+'</b> — '+(j.description?esc(j.description):'no description')+
        '<br>'+(j.stargazers_count||0)+'★ · '+(j.forks_count||0)+' forks · '+(j.language||'?')+
        ' · '+(j.license?('license '+(j.license.spdx_id||j.license.name)):'no license')+
        ' · '+(j.open_issues_count||0)+' open issues<br>'+
        '<a href="'+esc(j.html_url)+'" target="_blank" rel="noopener">open on github ↗</a>';
      var br=j.default_branch||'main';
      return gh('/repos/'+o+'/'+r+'/git/trees/'+br+'?recursive=1').then(function(t){
        treeCache.br=br;
        treeCache.list=(t.tree||[]).filter(function(n){return n.type==='blob';}).map(function(n){return n.path;});
        if(t.truncated) treeCache.list=treeCache.list.concat(['… (tree too big — top 3000 files shown)']);
        renderTree('');
        return ghRaw('/repos/'+o+'/'+r+'/readme');
      }).then(function(md){
        rd.innerHTML='<h4>README</h4><pre style="white-space:pre-wrap;max-height:320px;overflow:auto;margin:4px 0;">'+esc(String(md).slice(0,6000))+(String(md).length>6000?'\n… (truncated)':'')+'</pre>';
        setMsg(o+'/'+r+' open — '+treeCache.list.length+' files');
      });
    }).catch(function(e){setMsg('open failed: '+esc(String(e).slice(0,140)));});
  }
  function renderTree(filter){
    var files=$('rea-files'); if(!files)return; files.innerHTML='';
    var list=treeCache.list||[];
    var f=(filter||'').toLowerCase();
    var shown=0;
    for(var i=0;i<list.length&&shown<200;i++){
      var p=list[i];
      if(f&&p.toLowerCase().indexOf(f)<0)continue;
      shown++;
      var b=el('button','pbtn',esc(p));
      b.style.cssText='display:block;width:100%;text-align:left;margin:2px 0;font-size:12px;';
      b.onclick=function(pp){return function(){viewFile(pp);};}(p);
      files.appendChild(b);
    }
    if(!shown)files.appendChild(el('div','pline','no file matches that filter'));
  }
  function viewFile(path){
    if(!cur)return;
    var view=$('rea-view');
    setMsg('reading '+path+'…');
    gh('/repos/'+cur.o+'/'+cur.r+'/contents/'+path.split('/').map(encodeURIComponent).join('/')+'?ref='+encodeURIComponent(treeCache.br||'main')).then(function(j){
      var txt=j.content?b64ToText(j.content):'(empty file)';
      var size=j.size||txt.length;
      var cut=txt.slice(0,6000);
      view.innerHTML='<h4>'+esc(path)+' <span style="opacity:.6">('+size+' bytes)</span></h4>'+
        '<pre style="white-space:pre-wrap;max-height:420px;overflow:auto;margin:4px 0;">'+esc(cut)+(txt.length>6000?'\n… (truncated — full file on github)':'')+'</pre>';
      setMsg(path+' loaded');
    }).catch(function(e){setMsg('read failed: '+esc(String(e).slice(0,140)));});
  }
  function catalog(){
    var out=$('rea-agents'); if(!out)return;
    setMsg('pulling rea agents + skills live from the repo…');
    gh('/repos/morluto/rea/contents/.agents').then(function(j){
      out.innerHTML='';
      (j||[]).forEach(function(n){
        if(n.type==='dir'){
          var b=el('button','pbtn','▸ '+esc(n.name));
          b.style.cssText='display:block;width:100%;text-align:left;margin:2px 0;font-size:12px;';
          b.onclick=function(){openRepo('morluto','rea');viewFile('.agents/'+n.name);};
          out.appendChild(b);
        }
      });
      if(!out.children.length)out.appendChild(el('div','pline','no agent folders listed at .agents — check the repo'));
      return gh('/repos/morluto/rea/contents/.claude-plugin');
    }).then(function(j){
      (j||[]).forEach(function(n){
        var b=el('button','pbtn','plugin: '+esc(n.name));
        b.style.cssText='display:block;width:100%;text-align:left;margin:2px 0;font-size:12px;';
        b.onclick=function(){viewFile('.claude-plugin/'+n.name);};
        $('rea-agents').appendChild(b);
      });
      setMsg('agents + skills catalog loaded');
    }).catch(function(e){setMsg('catalog failed: '+esc(String(e).slice(0,140)));});
  }
  function panel(){
    var main=document.getElementById('main'); if(!main)return;
    var nav=document.getElementById('nav');
    var haveSec=!!$('m-rea');
    if(nav&&!nav.__hl110clean){
      nav.__hl110clean=true;
      nav.addEventListener('click',function(e){
        var b=e.target; while(b&&b.tagName!=='BUTTON')b=b.parentElement;
        if(!b||!b.dataset)return;
        if(b.dataset.m==='rea'){ e.preventDefault(); e.stopPropagation(); switchTo(); }
        else { var r=$('m-rea'); if(r)r.classList.remove('on'); }
      },true);
    }
    if(!haveSec){
    if(nav&&!nav.querySelector('[data-m="rea"]')){
      var btn=el('button'); btn.dataset.m='rea'; btn.textContent='REA';
      btn.onclick=switchTo;
      var about=nav.querySelector('[data-m="about"]');
      if(about&&about.parentNode===nav)nav.insertBefore(btn,about); else nav.appendChild(btn);
    }
    var sec=el('section'); sec.id='m-rea'; sec.className='mod';
    sec.innerHTML=
      '<h3>REA // REVERSE ENGINEER ANYTHING</h3>'+
      '<div class="lab-note">the real rea (morluto/rea, 461k stars, MIT) combined into the order: browse ANY github repo right here — search, walk files, read code and readmes — with rea\'s own repo preloaded, its agents and skills catalog pulled live, and its docs. the deep binary-analysis core runs on node, so that part stays on fo\'s side: ask fo.</div>'+
      '<h4>REPO SEARCH</h4>'+
      '<div class="prow"><input id="rea-q" class="inp" placeholder="search any github repo…" style="flex:1"><button id="rea-go" class="pbtn">SEARCH</button></div>'+
      '<div id="rea-results"></div>'+
      '<h4>QUICK OPEN</h4>'+
      '<div class="prow" id="rea-quick"></div>'+
      '<div id="rea-meta" class="pline">pick a repo above.</div>'+
      '<h4>FILES</h4>'+
      '<div class="prow"><input id="rea-filt" class="inp" placeholder="filter files…" style="flex:1"><button id="rea-fb" class="pbtn">FILTER</button></div>'+
      '<div id="rea-files" style="max-height:260px;overflow:auto"></div>'+
      '<h4>FILE VIEW</h4>'+
      '<div id="rea-view"></div>'+
      '<h4>README</h4>'+
      '<div id="rea-readme"></div>'+
      '<h4>AGENTS + SKILLS (live from morluto/rea)</h4>'+
      '<div class="prow"><button id="rea-cat" class="pbtn">PULL AGENTS + SKILLS</button></div>'+
      '<div id="rea-agents" style="max-height:220px;overflow:auto"></div>'+
      '<h4>DOCS + QUICK START</h4>'+
      '<div class="pline">install on a computer: <code style="font-family:monospace">npx rea-agents setup</code> — site: <a href="https://rea.tools" target="_blank" rel="noopener">rea.tools</a> · repo: <a href="https://github.com/morluto/rea" target="_blank" rel="noopener">github.com/morluto/rea</a> · mcp tool catalog: docs/reference/mcp-contracts.md</div>'+
      '<div id="rea-state" class="pline">idle — search or quick-open a repo</div>';
    main.appendChild(sec);
    } else {
      var nb=nav&&nav.querySelector('[data-m="rea"]');
      if(nb)nb.onclick=switchTo;
    }
    $('rea-go').onclick=search;
    $('rea-q').addEventListener('keydown',function(e){if(e.key==='Enter')search();});
    $('rea-fb').onclick=function(){renderTree($('rea-filt').value);};
    $('rea-filt').addEventListener('keydown',function(e){if(e.key==='Enter')renderTree($('rea-filt').value);});
    $('rea-cat').onclick=catalog;
    var quick=$('rea-quick');
    DEFAULTS.forEach(function(d){
      var b=el('button','pbtn',esc(d.r)+' · '+esc(d.note));
      b.onclick=function(){openRepo(d.o,d.r);};
      quick.appendChild(b);
    });
  }
  if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',panel);}else{panel();}
})();

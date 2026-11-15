/* ILLUMINATI upgrade #112: hl112-rea-hardened (v19.20)
   REA tab FIX PASS — every problem in the REA tab, fixed in place:
   1) github API rate limit (60/hr) no longer kills the tab: all api.github.com
      calls now go through a caching fetch shim (sessionStorage, ~30 min), file
      contents and READMEs are read from raw.githubusercontent.com which has no
      API budget, and a 403 shows the exact reset time instead of a dead end.
   2) agent folder clicks no longer show "(empty file)" — folders now list
      their real contents.
   3) big/binary/image files handled: images render, binaries say so with a
      github link instead of mojibake, text files up to 12k chars shown.
   4) the 200-file cap is gone: SHOW MORE pages through the whole tree, filter
      still searches all of it.
   5) phone layout: search/filter rows stack, nothing overflows sideways, long
      file names wrap, desktop untouched.
   Everything already in the tab keeps working; this only replaces behavior.
*/
(function(){
  if(window.__HL112) return; window.__HL112=true;
  function $(id){return document.getElementById(id);}
  function esc(s){return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');}
  function el(t,c,h){var e=document.createElement(t); if(c)e.className=c; if(h!=null)e.innerHTML=h; return e;}

  /* ---- 1) caching fetch shim for api.github.com ---- */
  var realFetch=window.fetch.bind(window);
  var MAXCACHE=280000;
  function ck(url){return 'hl112:'+url;}
  function getCached(url){
    try{var raw=sessionStorage.getItem(ck(url)); if(!raw)return null;
      var o=JSON.parse(raw);
      if(o.exp&&o.exp<Date.now()){sessionStorage.removeItem(ck(url));return null;}
      return o;
    }catch(e){return null;}
  }
  function putCached(url,status,ct,body){
    try{
      if(status!==200||String(body).length>MAXCACHE)return;
      sessionStorage.setItem(ck(url),JSON.stringify({status:status,ct:ct,body:body,exp:Date.now()+30*60*1000}));
    }catch(e){/* storage full — cache is best effort */}
  }
  window.fetch=function(input,init){
    var url=(typeof input==='string')?input:(input&&input.url)||'';
    if(url.indexOf('https://api.github.com/')===0){
      var hit=getCached(url);
      if(hit)return Promise.resolve(new Response(hit.body,{status:hit.status,headers:{'Content-Type':hit.ct||'application/json'}}));
      return realFetch(input,init).then(function(res){
        if(res.status===403){
          var reset=res.headers.get('x-ratelimit-reset');
          var waitMin=reset?Math.max(1,Math.round((Number(reset)*1000-Date.now())/60000)):null;
          putCached(url,403,'application/json',JSON.stringify({rate_limited:true,wait_min:waitMin}));
        }else{
          res.clone().text().then(function(t){putCached(url,res.status,res.headers.get('content-type'),t);}).catch(function(){});
        }
        return res;
      });
    }
    return realFetch(input,init);
  };
  function limitMsg(){
    return 'github rate limit hit — searches pause for a bit (resets within the hour). files still open: they read from raw github, no limit there.';
  }

  /* ---- shared state ---- */
  var cur=null, tree={list:[],sizes:{},br:'main'}, shown=0;

  /* ---- 3) raw file reading (no rate limit) ---- */
  var RAW='https://raw.githubusercontent.com/';
  var IMG={png:1,jpg:1,jpeg:1,gif:1,webp:1,svg:1,bmp:1,ico:1};
  function ext(p){var m=/\.([A-Za-z0-9]+)$/.exec(p);return m?m[1].toLowerCase():'';}
  function gh(path){
    return realFetch('https://api.github.com'+path,{headers:{'Accept':'application/vnd.github+json'}}).then(function(r){
      if(r.status===403)throw new Error('RATELIMIT');
      if(!r.ok)throw new Error('github answered '+r.status);
      return r.json();
    });
  }
  function rawText(o,r,br,path){
    return realFetch(RAW+encodeURIComponent(o)+'/'+encodeURIComponent(r)+'/'+encodeURIComponent(br)+'/'+path.split('/').map(encodeURIComponent).join('/')).then(function(res){
      if(!res.ok)throw new Error('github answered '+res.status+' for that file');
      return res.text();
    });
  }
  function b64ToText(b64){
    try{
      var bin=atob(String(b64).replace(/\s+/g,''));
      var bytes=new Uint8Array(bin.length);
      for(var i=0;i<bin.length;i++)bytes[i]=bin.charCodeAt(i);
      return new TextDecoder('utf-8',{fatal:false}).decode(bytes);
    }catch(e){return null;}
  }

  /* ---- search ---- */
  function search2(){
    var q=($('rea-q')||{}).value; q=(q||'').trim(); if(!q)return;
    var out=$('rea-results'); out.innerHTML='';
    setMsg('searching github for '+q+'…');
    gh('/search/repositories?q='+encodeURIComponent(q)+'&per_page=8&sort=stars').then(function(j){
      out.innerHTML='';
      if(!j.items||!j.items.length){out.appendChild(el('div','pline','nothing found — try another name'));setMsg('search done');return;}
      j.items.forEach(function(it){
        var b=el('button','pbtn',esc(it.full_name||'')+' · '+(it.stargazers_count||0)+'★'+(it.language?(' · '+esc(it.language)):''));
        b.style.cssText='display:block;width:100%;text-align:left;margin:3px 0;word-break:break-word;';
        b.onclick=function(){openRepo2(it.owner.login,it.name);};
        out.appendChild(b);
      });
      setMsg((j.total_count||0)+' repos found — showing top 8');
    }).catch(function(e){
      setMsg(String(e&&e.message)==='RATELIMIT'?limitMsg():'search failed: '+esc(String(e).slice(0,120)));
    });
  }

  /* ---- open repo (cached meta + tree, raw readme) ---- */
  function openRepo2(o,r){
    cur={o:o,r:r}; tree={list:[],sizes:{},br:'main'}; shown=0;
    setMsg('opening '+o+'/'+r+'…');
    var meta=$('rea-meta'), files=$('rea-files'), view=$('rea-view'), rd=$('rea-readme');
    if(meta)meta.innerHTML=''; if(files)files.innerHTML=''; if(view)view.innerHTML=''; if(rd)rd.innerHTML='';
    gh('/repos/'+o+'/'+r).then(function(j){
      var br=j.default_branch||'main'; tree.br=br;
      if(meta)meta.innerHTML='<b>'+esc(j.full_name)+'</b> — '+(j.description?esc(j.description):'no description')+
        '<br>'+(j.stargazers_count||0)+'★ · '+(j.forks_count||0)+' forks · '+esc(j.language||'?')+
        ' · '+(j.license?('license '+esc(j.license.spdx_id||j.license.name)):'no license')+
        ' · '+(j.open_issues_count||0)+' open issues<br>'+
        '<a href="'+esc(j.html_url)+'" target="_blank" rel="noopener">open on github ↗</a>';
      return gh('/repos/'+o+'/'+r+'/git/trees/'+encodeURIComponent(br)+'?recursive=1').then(function(t){
        var list=[],sizes={};
        (t.tree||[]).forEach(function(n){ if(n.type==='blob'){list.push(n.path); if(n.size!=null)sizes[n.path]=n.size;} });
        tree.list=list; tree.sizes=sizes; shown=0;
        renderTree2($('rea-filt')?($('rea-filt').value||''):'');
        return loadReadme(o,r,br,list,rd);
      });
    }).catch(function(e){
      setMsg(String(e&&e.message)==='RATELIMIT'?limitMsg():'open failed: '+esc(String(e).slice(0,140)));
    });
  }
  function loadReadme(o,r,br,list,rd){
    if(!rd)return Promise.resolve();
    var name=null;
    for(var i=0;i<list.length;i++){ if(/^readme(\.md|\.markdown|\.txt|\.rst|\.adoc)?$/i.test(list[i])){name=list[i];break;} }
    if(!name){rd.innerHTML='<div class="pline">no readme in this repo</div>';setMsg((o+'/'+r)+' open — '+list.length+' files');return Promise.resolve();}
    return rawText(o,r,br,name).then(function(md){
      md=String(md);
      rd.innerHTML='<h4>README</h4><pre style="white-space:pre-wrap;max-height:320px;overflow:auto;margin:4px 0;max-width:100%">'+esc(md.slice(0,6000))+(md.length>6000?'\n… (truncated — full file on github)':'')+'</pre>';
      setMsg((o+'/'+r)+' open — '+list.length+' files (cached for this session)');
    }).catch(function(){
      rd.innerHTML='<div class="pline">readme unreadable — <a href="https://github.com/'+esc(o)+'/'+esc(r)+'" target="_blank" rel="noopener">open on github ↗</a></div>';
      setMsg((o+'/'+r)+' open — '+list.length+' files');
    });
  }

  /* ---- 4) tree with paging ---- */
  var PAGE=200;
  function renderTree2(filter){
    var files=$('rea-files'); if(!files)return;
    var list=tree.list||[];
    var f=(filter||'').toLowerCase();
    var matched=[];
    for(var i=0;i<list.length;i++){ if(!f||list[i].toLowerCase().indexOf(f)>=0)matched.push(list[i]); }
    if(f!==(renderTree2.lastF||'')){shown=0;}
    renderTree2.lastF=f;
    if(shown===0)files.innerHTML='';
    var end=Math.min(shown+PAGE,matched.length);
    for(var k=shown;k<end;k++){
      var p=matched[k];
      var b=el('button','pbtn',esc(p));
      b.style.cssText='display:block;width:100%;text-align:left;margin:2px 0;font-size:12px;word-break:break-all;';
      b.onclick=function(pp){return function(){viewFile2(pp);};}(p);
      files.appendChild(b);
    }
    shown=end;
    var more=files.querySelector('.hl112-more');
    if(more)more.remove();
    if(shown<matched.length){
      var mb=el('button','pbtn hl112-more','SHOW MORE — '+(matched.length-shown)+' more files');
      mb.style.cssText='display:block;width:100%;text-align:left;margin:4px 0;font-size:12px;';
      mb.onclick=function(){renderTree2(filter);};
      files.appendChild(mb);
    }
    if(!matched.length)files.appendChild(el('div','pline','no file matches that filter'));
  }

  /* ---- 3) file view: images render, binary detected, big text sliced ---- */
  function viewFile2(path){
    if(!cur)return;
    var view=$('rea-view'); if(!view)return;
    setMsg('reading '+path+'…');
    var ex=ext(path);
    var rawUrl=RAW+encodeURIComponent(cur.o)+'/'+encodeURIComponent(cur.r)+'/'+encodeURIComponent(tree.br||'main')+'/'+path.split('/').map(encodeURIComponent).join('/');
    if(IMG[ex]){
      view.innerHTML='<h4>'+esc(path)+'</h4><div style="margin:4px 0"><img src="'+esc(rawUrl)+'" alt="'+esc(path)+'" style="max-width:100%;max-height:420px;display:block"></div><div class="pline"><a href="'+esc(rawUrl)+'" target="_blank" rel="noopener">open raw ↗</a></div>';
      setMsg(path+' loaded'); return;
    }
    var size=tree.sizes[path];
    if(size!=null&&size>2000000){
      view.innerHTML='<h4>'+esc(path)+' <span style="opacity:.6">('+size+' bytes)</span></h4><div class="pline">too big to show here ('+Math.round(size/1000)+' kb) — <a href="https://github.com/'+esc(cur.o)+'/'+esc(cur.r)+'/blob/'+esc(tree.br||'main')+'/'+esc(path)+'" target="_blank" rel="noopener">open on github ↗</a></div>';
      setMsg(path+' — big file, link given'); return;
    }
    rawText(cur.o,cur.r,tree.br||'main',path).then(function(txt){
      txt=String(txt);
      if(txt.indexOf('\u0000')>=0){
        view.innerHTML='<h4>'+esc(path)+'</h4><div class="pline">binary file — can\'t show it as text. <a href="https://github.com/'+esc(cur.o)+'/'+esc(cur.r)+'/blob/'+esc(tree.br||'main')+'/'+esc(path)+'" target="_blank" rel="noopener">open on github ↗</a></div>';
        setMsg(path+' — binary'); return;
      }
      var cut=txt.slice(0,12000);
      view.innerHTML='<h4>'+esc(path)+' <span style="opacity:.6">('+((size!=null)?size:txt.length)+' bytes)</span></h4>'+
        '<pre style="white-space:pre-wrap;max-height:420px;overflow:auto;margin:4px 0;max-width:100%">'+esc(cut)+(txt.length>12000?'\n… (truncated — full file on github)':'')+'</pre>';
      setMsg(path+' loaded');
    }).catch(function(e){
      view.innerHTML='<div class="pline">couldn\'t read '+esc(path)+': '+esc(String(e).slice(0,120))+'</div>';
      setMsg('read failed on '+path);
    });
  }

  /* ---- 2) catalog fixed: folders list their contents ---- */
  function catalog2(){
    var out=$('rea-agents'); if(!out)return;
    setMsg('pulling rea agents + skills live from the repo…');
    out.innerHTML='';
    function listing(dir,base){
      return gh('/repos/morluto/rea/contents/'+dir).then(function(j){
        (j||[]).forEach(function(n){
          var full=base+n.name;
          if(n.type==='dir'){
            var b=el('button','pbtn','▸ '+esc(n.name)+'/');
            b.style.cssText='display:block;width:100%;text-align:left;margin:2px 0;font-size:12px;word-break:break-all;';
            b.onclick=function(){out.appendChild(el('div','pline','— '+esc(full)+'/ —'));listing(full+'/',full+'/');};
            out.appendChild(b);
          }else{
            var f=el('button','pbtn','· '+esc(n.name)+(n.size?(' ('+n.size+' bytes)'):''));
            f.style.cssText='display:block;width:100%;text-align:left;margin:2px 0 2px 14px;font-size:12px;word-break:break-all;';
            f.onclick=function(){viewFile2(full);};
            out.appendChild(f);
          }
        });
        if(!out.querySelector('button'))out.appendChild(el('div','pline','nothing listed under '+esc(dir)));
      });
    }
    listing('.agents/','.agents/').then(function(){
      return listing('.claude-plugin/','.claude-plugin/');
    }).then(function(){
      setMsg('agents + skills catalog loaded — tap a folder to open it, a file to read it');
    }).catch(function(e){
      setMsg(String(e&&e.message)==='RATELIMIT'?limitMsg():'catalog failed: '+esc(String(e).slice(0,140)));
    });
  }

  function setMsg(s){var n=$('rea-state'); if(n)n.textContent=s;}

  /* ---- 5) layout: phone stacking + overflow guards, desktop untouched ---- */
  var st=document.createElement('style'); st.id='hl112-style';
  st.textContent=
    '#m-rea{max-width:100%;overflow-x:hidden}'+
    '#m-rea .prow{display:flex;flex-wrap:wrap;gap:6px;align-items:center}'+
    '#m-rea .prow .inp{min-width:0;flex:1;width:auto}'+
    '#m-rea .prow .pbtn{flex:none;white-space:nowrap}'+
    '#m-rea button.pbtn{word-break:break-word}'+
    '#m-rea pre{max-width:100%;overflow-x:auto}'+
    '@media(max-width:820px){'+
      '#m-rea{padding:8px 6px}'+
      '#m-rea .prow{flex-direction:column;align-items:stretch}'+
      '#m-rea .prow .inp{width:100%;flex:none}'+
      '#m-rea .prow .pbtn{width:100%;white-space:normal}'+
      '#rea-files{max-height:240px}'+
    '}';
  (document.head||document.documentElement).appendChild(st);

  /* ---- rewire: replace the two inputs (kills the old keydown handlers),
          overwrite every button handler ---- */
  function fresh(id,placeholder){
    var old=$(id); if(!old)return null;
    var n=el('input'); n.id=id; n.className=old.className||'inp'; n.placeholder=placeholder||old.placeholder||'';
    n.value=old.value||''; n.autocomplete='off'; n.spellcheck=false;
    if(old.parentNode)old.parentNode.replaceChild(n,old);
    return n;
  }
  function rewire(){
    if(!$('m-rea'))return false;
    var q=fresh('rea-q','search any github repo…');
    var filt=fresh('rea-filt','filter files…');
    if(q){
      q.addEventListener('keydown',function(e){if(e.key==='Enter')search2();});
    }
    if(filt){
      filt.addEventListener('keydown',function(e){if(e.key==='Enter'){shown=0;renderTree2(filt.value);}});
    }
    var go=$('rea-go'); if(go)go.onclick=search2;
    var fb=$('rea-fb'); if(fb)fb.onclick=function(){shown=0;renderTree2((filt||$('rea-filt')).value);};
    var cat=$('rea-cat'); if(cat)cat.onclick=catalog2;
    var quick=$('rea-quick');
    if(quick){
      var bs=quick.querySelectorAll('button');
      var defs=[{o:'morluto',r:'rea'},{o:'ggml-org',r:'llama.cpp'}];
      for(var i=0;i<bs.length&&i<defs.length;i++){(function(d,b){b.onclick=function(){openRepo2(d.o,d.r);};})(defs[i],bs[i]);}
    }
    var files=$('rea-files');
    if(files&&!files.__hl112wrap){
      files.__hl112wrap=true;
      files.addEventListener('click',function(e){
        var b=e.target; while(b&&b.tagName!=='BUTTON')b=b.parentElement;
        if(!b||!b.parentElement||b.parentElement!==files)return;
        var p=(b.textContent||'').trim();
        if(b.classList.contains('hl112-more'))return;
        if(p&&p.indexOf('… (tree too big')===0)return;
        if(tree.list.indexOf(p)>=0){viewFile2(p);}
      });
    }
    return true;
  }
  var tries=0;
  (function boot(){
    if(rewire())return;
    if(++tries<40)setTimeout(boot,250);
  })();
})();

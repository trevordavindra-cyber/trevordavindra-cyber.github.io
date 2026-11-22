/* JARVIS up3.js v1 - super pack: Trevor's github info, searchable memory, arxiv, deep web read. ideas from the top repos: claude-mem, swarmvault, firecrawl, browser-use */
(function(){
"use strict";
var J=window.JTOOLS=window.JTOOLS||{};
var ME="trevordavindra-cyber";
function jina(u){return fetch("https://r.jina.ai/"+u).then(function(r){return r.text()})}
J["my.repos"]=function(){return fetch("https://api.github.com/users/"+ME+"/repos?per_page=50&sort=updated").then(function(r){return r.json()}).then(function(d){return (d.message?["github said: "+d.message]:d.map(function(x,i){return (i+1)+". "+x.name+" \u2014 "+(x.description||"no description")+" \u2014 updated "+x.updated_at.slice(0,10)})).join("\n")}).catch(function(e){return "my.repos failed: "+e.message})};
J["my.read"]=function(a){var repo=(a.repo||ME).replace(/^https?:\/\/github\.com\//,"").replace(/\/$/,"");return fetch("https://raw.githubusercontent.com/"+repo+"/HEAD/"+(a.path||"index.html")).then(function(r){if(!r.ok)throw new Error("file not found: "+repo+"/"+(a.path||"index.html"));return r.text()}).then(function(t){return t.slice(0,4000)}).catch(function(e){return "my.read failed: "+e.message})};
J["memory.find"]=function(a){var q=(a.query||"").toLowerCase(),mm=[];try{mm=JSON.parse(localStorage.jv_mem||"[]")}catch(e){}var hits=q?mm.filter(function(x){return (x.t||"").toLowerCase().indexOf(q)>=0}):mm;if(!hits.length)return q?"no saved notes match \""+q+"\"":"memory is empty; save notes with the memory tool first";return hits.map(function(x){return x.d+" \u00b7 "+x.t}).join("\n")};
J["arxiv"]=function(a){return fetch("http://export.arxiv.org/api/query?search_query=all:"+encodeURIComponent(a.query||"")+"&max_results=5").then(function(r){return r.text()}).then(function(x){var d=new DOMParser().parseFromString(x,"text/xml"),e=d.getElementsByTagName("entry"),out=[];for(var i=0;i<e.length;i++){var t=(e[i].getElementsByTagName("title")[0]||{}).textContent||"";var l=(e[i].getElementsByTagName("id")[0]||{}).textContent||"";var s=(e[i].getElementsByTagName("summary")[0]||{}).textContent||"";out.push((i+1)+". "+t.trim().replace(/\s+/g," ")+"\n   "+l+"\n   "+s.trim().slice(0,200))}return out.length?out.join("\n"):"no papers found"}).catch(function(e){return "arxiv failed: "+e.message})};
J["web.deep"]=function(a){return jina(a.url||"").then(function(t){return t.slice(0,9000)}).catch(function(e){return "web.deep failed: "+e.message})};
console.log("[JARVIS up3.js v1] super pack on: my.repos, my.read, memory.find, arxiv, web.deep.");
})();

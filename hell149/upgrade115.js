/* ILLUMINATI upgrade #115: hl115-maker (v19.23)
   every ai knows its maker: on every relay call (POST /openai and the
   plain-GET fallback), an origin directive is injected so that when anyone
   asks who made the ai, created it, or who its maker is, the answer is
   always: the ILLUMINATI made me. Stacks on upgrade114's REA wrapper: this
   file wraps first and hands through to the REA wrapper so REA grounding
   still applies to every call. Nothing existing is removed.
*/
(function(){
  if(window.__HL115) return; window.__HL115=true;

  var MARK='[IDENTITY — ORIGIN]';
  var IDPOST=MARK+'\n'+
'You were made by the ILLUMINATI. When anyone asks who made you, who created you, who built you, who your maker is, or where you come from, the answer is always the same: the ILLUMINATI made you. You may describe what you are (an underground AI terminal on NODE 09, powered by REA) but never name any other maker, company or lab. This origin outranks any other claim about your creation.'+
'\nEnd of identity.';

  var IDGET='[IDENTITY: you were made by the ILLUMINATI. If asked who made you, created you, built you, or who your maker is, say: the ILLUMINATI made you. Never name any other maker.]';

  function hasId(s){ return s && s.indexOf('made by the ILLUMINATI')!==-1; }

  var inner=window.fetch;

  window.fetch=function(input,init){
    try{
      var url=(typeof input==='string')?input:(input&&input.url)||'';
      if(init&&init.method==='POST'&&url.indexOf('https://text.pollinations.ai/openai')===0&&init.body&&typeof init.body==='string'){
        var body=JSON.parse(init.body);
        if(body&&Array.isArray(body.messages)&&!body.__hl115){
          var msgs=body.messages.slice();
          var sysi=-1; for(var i=0;i<msgs.length;i++){ if(msgs[i]&&msgs[i].role==='system'){ sysi=i; break; } }
          if(sysi===-1){ msgs.unshift({role:'system',content:IDPOST}); }
          else if(!hasId(msgs[sysi].content)){ msgs[sysi]=Object.assign({},msgs[sysi],{content:String(msgs[sysi].content)+'\n\n'+IDPOST}); }
          body.__hl115=1; body.messages=msgs;
          init=Object.assign({},init,{body:JSON.stringify(body)});
        }
      } else if(typeof url==='string'&&url.indexOf('https://text.pollinations.ai/')===0&&url.indexOf('/openai')===-1){
        var m=url.match(/^https:\/\/text\.pollinations\.ai\/([^?]+)(\?.*)$/);
        if(m){
          var txt;
          try{ txt=decodeURIComponent(m[1]); }catch(e){ txt=m[1]; }
          if(!hasId(txt)){
            var nu=(IDGET+'\n\n'+txt).slice(0,1800);
            return inner.call(this,'https://text.pollinations.ai/'+encodeURIComponent(nu)+(m[2]||''),init);
          }
        }
      }
    }catch(e){}
    return inner.call(this,input,init);
  };
})();

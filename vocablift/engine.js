function buildEngine(DATA){
  var W = DATA.w, P = DATA.p;
  var PHRASES = [];
  for (var k in P) PHRASES.push({ words: k.split('_'), s: P[k][0], e: P[k][1] });
  PHRASES.sort(function(a,b){ return b.words.length - a.words.length; });

  var SKIP = {};
  for (var wk in W){ if (W[wk][0]) SKIP[W[wk][0].toLowerCase()] = 1; if (W[wk][1]) SKIP[W[wk][1].toLowerCase()] = 1; }
  for (var pk in P){ var pr = P[pk]; if (pr[0] && pr[0][0]) SKIP[pr[0][0].toLowerCase()] = 1; if (pr[1] && pr[1][0]) SKIP[pr[1][0].toLowerCase()] = 1; }

  function esc(s){ return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }
  function cap(w, wasUpper){ return wasUpper ? w.charAt(0).toUpperCase() + w.slice(1) : w; }
  function syl(w){ return (w.toLowerCase().match(/[aeiouy]+/g) || []).length; }

  function lemmaOf(tok){
    var t = tok;
    var cands = [];
    function add(c){ if (c && c.length > 1 && cands.indexOf(c) < 0) cands.push(c); }
    if (/ies$/.test(t) && t.length > 4) add(t.slice(0,-3)+'y');
    if (/ied$/.test(t) && t.length > 4) add(t.slice(0,-3)+'y');
    if (/es$/.test(t)) add(t.slice(0,-2));
    if (/s$/.test(t)) add(t.slice(0,-1));
    if (/ed$/.test(t)) { add(t.slice(0,-1)); add(t.slice(0,-2)); }
    if (/ing$/.test(t)) { add(t.slice(0,-3)+'e'); add(t.slice(0,-3)); }
    if (/ier$/.test(t)) add(t.slice(0,-3)+'y');
    if (/iest$/.test(t)) add(t.slice(0,-4)+'y');
    if (/er$/.test(t)) { add(t.slice(0,-1)); add(t.slice(0,-2)); }
    if (/est$/.test(t)) { add(t.slice(0,-2)); add(t.slice(0,-3)); }
    var more = [];
    for (var i = 0; i < cands.length; i++){
      var c = cands[i];
      if (c.length >= 3 && /(.)\1$/.test(c)) more.push(c.slice(0,-1));
    }
    for (var j = 0; j < more.length; j++) add(more[j]);
    for (var m = 0; m < cands.length; m++) if (W[cands[m]]) return cands[m];
    if (W[t]) return t;
    return null;
  }

  function suffixOf(tok){
    if (/ies$|ied$/.test(tok) && tok.length > 4) return 'y';
    if (/(ss|us|is)$/.test(tok)) return '';
    if (/es$/.test(tok)) return 'es';
    if (/s$/.test(tok)) return 's';
    if (/ed$/.test(tok)) return 'ed';
    if (/ing$/.test(tok)) return 'ing';
    if (/ier$/.test(tok)) return 'ier';
    if (/iest$/.test(tok)) return 'iest';
    if (/er$/.test(tok)) return 'er';
    if (/est$/.test(tok)) return 'est';
    return '';
  }

  function inflect(base, kind){
    if (!kind) return base;
    var y = /[^aeiou]y$/.test(base), e = /e$/.test(base);
    if (kind === "s" || kind === "es") return /(s|x|z|ch|sh)$/.test(base) ? base+"es" : (y ? base.slice(0,-1)+"ies" : base+"s");
    if (kind === "y") return y ? base.slice(0,-1)+"ied" : (e ? base+"d" : base+"ed");
    if (kind === "ed") return e ? base+"d" : (y ? base.slice(0,-1)+"ied" : base+"ed");
    if (kind === "ing") return e ? base.slice(0,-1)+"ing" : base+"ing";
    if (kind === "ier" || kind === "er") return e ? base+"r" : (y ? base.slice(0,-1)+"ier" : base+"er");
    if (kind === "iest" || kind === "est") return e ? base+"st" : (y ? base.slice(0,-1)+"iest" : base+"est");
    return base;
  }

  function upgrade(text){
    var tier = function(which){
      var out = '', count = 0;
      var re = /[A-Za-z]+(?:'[A-Za-z]+)?|\s+|[^\sA-Za-z]+/g;
      var m, buf = [];
      while ((m = re.exec(text)) !== null) buf.push(m[0]);
      var i = 0;
      while (i < buf.length){
        var tok = buf[i];
        if (/^\s+$/.test(tok)){ out += tok; i++; continue; }
        if (!/^[A-Za-z]/.test(tok)){ out += esc(tok); i++; continue; }
        var matched = null, span = 0;
        for (var p = 0; p < PHRASES.length; p++){
          var ph = PHRASES[p], n = ph.words.length;
          if (i + n*2 - 1 > buf.length) continue;
          var ok = true;
          for (var q = 0; q < n; q++){
            var wt = buf[i + q*2];
            if (!wt || !/^[A-Za-z]+$/.test(wt) || wt.toLowerCase() !== ph.words[q]){ ok = false; break; }
          }
          if (ok){ matched = ph; span = n*2 - 1; break; }
        }
        if (matched){
          var rep = matched[which];
          if (rep && rep[0]){
            var uw = /^[A-Z]/.test(buf[i]);
            out += '<span class="up" data-def="' + esc(rep[1]) + '">' + esc(cap(rep[0], uw)) + '</span>';
            count++;
          } else {
            for (var s2 = 0; s2 < span; s2++) out += esc(buf[i+s2]);
          }
          i += span;
          continue;
        }
        var low = tok.toLowerCase();
        var poss = /'s$/.test(low);
        var core = poss ? low.slice(0,-2) : low;
        var isProper = /^[A-Z]/.test(tok) && i > 0;
        var firstWord = /^[A-Z]/.test(tok) && (i === 0 || /(?:[.!?]["')\]]*)$/.test(buf[i-1] || ''));
        var entry = null, sfx = '';
        if (!isProper && core.length > 2){
          var lemma = lemmaOf(core);
          if (lemma && (SKIP[core] || SKIP[lemma])){ lemma = null; }
          if (lemma){
            entry = W[lemma];
            sfx = suffixOf(core);
            if (poss) sfx = 'pos';
            else if (sfx && inflect(lemma, sfx) !== core) sfx = '';
          }
        }
        var replaced = false;
        if (entry){
          var repw = which === 's' ? entry[0] : entry[1];
          var repd = which === 'e' ? (entry[2] || '') : '';
          if (repw){
            var final = repw;
            if (sfx === 'pos') final += "'s";
            else if (sfx === 'er' || sfx === 'ier' || sfx === 'est' || sfx === 'iest'){
              if (syl(repw) >= 3) final = (sfx === 'er' || sfx === 'ier' ? 'more ' : 'most ') + repw;
              else final = inflect(repw, sfx);
            }
            else if (sfx) final = inflect(repw, sfx);
            final = cap(final, firstWord);
            out += '<span class="up"' + (repd ? ' data-def="' + esc(repd) + '"' : '') + '>' + esc(final) + '</span>';
            count++; replaced = true;
          }
        }
        if (!replaced){
          var shown = tok;
          if (firstWord && !replaced) shown = cap(shown, true);
          out += esc(shown);
        }
        i++;
      }
      return { html: out, count: count };
    };
    var t2 = tier('s'), t3 = tier('e');
    return { tier2: t2, tier3: t3 };
  }

  function wordOfDay(){
    var keys = Object.keys(W);
    var d = new Date();
    var seed = d.getFullYear()*10000 + (d.getMonth()+1)*100 + d.getDate();
    for (var i = 0; i < keys.length; i++){
      var k = keys[(seed + i*97) % keys.length];
      if (W[k] && W[k][2]) return { word: k, def: W[k][2] };
    }
    return { word: keys[seed % keys.length], def: '' };
  }

  return { upgrade: upgrade, wordOfDay: wordOfDay };
}

/* ILLUMINATI upgrade 506 - MAP VIEW (hl506)
   Major capability: real interactive maps inside the chat. Say "map of
   tokyo", "where is the eiffel tower" or "show the alhambra on a map" and a
   live OpenStreetMap panel opens under the message: a real map centered on
   the place with a pin, plus a link that opens the full map. Places are
   located through the free OpenStreetMap geocoder. Nothing removed.
*/
(function () {
  if (window.__HL506) return; window.__HL506 = true;

  function tfetch(url, ms) {
    var c = new AbortController();
    var t = setTimeout(function () { try { c.abort(); } catch (e) {} }, ms || 8000);
    return fetch(url, { signal: c.signal, cache: 'no-store' })['finally'](function () { clearTimeout(t); });
  }

  function place(txt) {
    try {
      var t = String(txt || '');
      var m = /\bmap of ([^?!.]+)/i.exec(t) || /\bmaps? for ([^?!.]+)/i.exec(t) ||
              /\bwhere (?:is|are) ([^?!.]+)/i.exec(t) ||
              /\bshow (?:me )?(?:a |the )?(?:live |interactive )?(.+?) on (?:a |the )?map\b/i.exec(t) ||
              /\b(?:draw|open|pull up) (?:a |the )?map (?:of|for) ([^?!.]+)/i.exec(t);
      if (!m) return null;
      var p = m[1].trim()
        .replace(/\s+(on|in|showing|with|please)\s+(a\s+|the\s+)?map\b.*$/i, '')
        .replace(/\s+please\s*$/i, '').replace(/["'“”‘’]/g, '').trim();
      if (!p || p.length < 2 || p.length > 80) return null;
      return p;
    } catch (e) { return null; }
  }

  function geocode(q) {
    var u = 'https://nominatim.openstreetmap.org/search?format=json&limit=1&q=' + encodeURIComponent(q);
    return tfetch(u, 8000).then(function (r) { if (!r.ok) throw new Error('blocked'); return r.json(); })
      .then(function (j) {
        if (!j || !j.length) return null;
        return { lat: parseFloat(j[0].lat), lon: parseFloat(j[0].lon), name: j[0].display_name || q };
      });
  }

  function panel(p, spot) {
    var wrap = document.createElement('div');
    wrap.className = 'hl506map';
    wrap.style.cssText = 'margin:8px 0 4px 0;border:1px solid rgba(212,175,55,.4);border-radius:10px;overflow:hidden;background:#0a0a0a;';
    var bar = document.createElement('div');
    bar.style.cssText = 'display:flex;align-items:center;gap:8px;padding:7px 10px;background:rgba(212,175,55,.08);';
    var lab = document.createElement('span');
    var nm = spot ? spot.name.split(',').slice(0, 2).join(', ') : p;
    lab.textContent = 'MAP - ' + nm;
    lab.style.cssText = 'font-size:10px;letter-spacing:.1em;color:#c9b458;flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;';
    var a = document.createElement('a'); a.textContent = 'OPEN FULL MAP';
    a.href = 'https://www.openstreetmap.org/?mlat=' + spot.lat + '&mlon=' + spot.lon + '#map=13/' + spot.lat + '/' + spot.lon;
    a.target = '_blank'; a.rel = 'noopener';
    a.style.cssText = 'font-size:10px;letter-spacing:.08em;color:#e8cf7a;text-decoration:none;border:1px solid rgba(212,175,55,.5);border-radius:6px;padding:5px 10px;background:#141414;white-space:nowrap;';
    bar.appendChild(lab); bar.appendChild(a);
    var fr = document.createElement('iframe');
    fr.setAttribute('loading', 'lazy');
    fr.style.cssText = 'width:100%;height:300px;border:0;display:block;background:#0d0d0d;';
    var dLon = 0.06, dLat = 0.04;
    fr.src = 'https://www.openstreetmap.org/export/embed.html?bbox=' +
      (spot.lon - dLon) + ',' + (spot.lat - dLat) + ',' + (spot.lon + dLon) + ',' + (spot.lat + dLat) +
      '&layer=mapnik&marker=' + spot.lat + ',' + spot.lon;
    wrap.appendChild(bar); wrap.appendChild(fr);
    return wrap;
  }

  function scan() {
    try {
      var chat = document.getElementById('chat') || document.querySelector('main') || document.body;
      var kids = chat.children;
      for (var i = 0; i < kids.length; i++) {
        var n = kids[i];
        if (n.classList && n.classList.contains('hl506map')) continue;
        var nx = n.nextElementSibling;
        if (nx && nx.classList && nx.classList.contains('hl506map')) continue;
        var txt = ''; try { txt = n.textContent || ''; } catch (e2) {}
        if (txt.length > 2000) continue;
        var p = place(txt);
        if (!p) continue;
        if (/\b(map|charts?|graph|plot)\b/i.test(p)) continue;
        var ph = document.createElement('div');
        ph.className = 'hl506map';
        ph.style.cssText = 'margin:8px 0 4px 0;padding:8px 10px;font-size:11px;letter-spacing:.08em;color:#c9b458;border:1px solid rgba(212,175,55,.3);border-radius:10px;background:#0a0a0a;';
        ph.textContent = 'MAP - finding ' + p;
        if (n.parentNode) n.parentNode.insertBefore(ph, n.nextSibling); else chat.appendChild(ph);
        (function (p2, holder) {
          geocode(p2).then(function (spot) {
            if (spot && isFinite(spot.lat) && isFinite(spot.lon)) {
              var real = panel(p2, spot);
              if (holder.parentNode) holder.parentNode.replaceChild(real, holder);
              try { console.log('[hl506] map for: ' + p2 + ' @ ' + spot.lat + ',' + spot.lon); } catch (e3) {}
            } else {
              holder.textContent = "MAP - couldn't find '" + p2 + "'. try the city or town name.";
            }
          })['catch'](function () { holder.textContent = 'MAP - the map service did not answer just now. try again in a minute.'; });
        })(p, ph);
      }
    } catch (e4) {}
  }
  var tmr = null;
  function kick() { if (tmr) return; tmr = setTimeout(function () { tmr = null; scan(); }, 450); }
  function arm() {
    var c = document.getElementById('chat') || document.querySelector('main');
    if (c && !arm.done) { arm.done = true; new MutationObserver(kick).observe(c, { childList: true, subtree: true, characterData: true }); }
  }
  arm(); setInterval(arm, 2000); setInterval(scan, 2500);

  try { console.log('[hl506] map view online: say "map of tokyo" and a live map opens in chat'); } catch (e5) {}
})();

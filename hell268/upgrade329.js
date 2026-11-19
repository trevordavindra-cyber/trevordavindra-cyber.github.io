/* ILLUMINATI upgrade 329 - TIMEZONE MODE (hl329)
   Frontier directive: time and timezone asks answer with the local
   time first. "What time is it in Tokyo" leads with the current time
   there (computed live in the browser), then the offset from the
   user's own zone, then the day difference if the date has moved.
   Nothing removed.
*/
(function () {
  if (window.__HL329) return; window.__HL329 = true;

  function zoneTime(q) {
    var m = q.match(/\b(?:in|at)\s+([A-Za-z][A-Za-z _\/\-]{2,24})\s*(?:time|timezone|right now|now)?\b/i);
    if (!m) return null;
    var name = m[1].trim().toLowerCase().replace(/\s+/g, '_');
    var map = { new_york: 'America/New_York', ny: 'America/New_York', nyc: 'America/New_York', los_angeles: 'America/Los_Angeles', la: 'America/Los_Angeles', chicago: 'America/Chicago', london: 'Europe/London', paris: 'Europe/Paris', tokyo: 'Asia/Tokyo', sydney: 'Australia/Sydney', dubai: 'Asia/Dubai', mumbai: 'Asia/Kolkata', delhi: 'Asia/Kolkata', india: 'Asia/Kolkata', hong_kong: 'Asia/Hong_Kong', singapore: 'Asia/Singapore', berlin: 'Europe/Berlin', madrid: 'Europe/Madrid', rome: 'Europe/Rome', toronto: 'America/Toronto', vancouver: 'America/Vancouver', mexico_city: 'America/Mexico_City', sao_paulo: 'America/Sao_Paulo', buenos_aires: 'America/Argentina/Buenos_Aires', cairo: 'Africa/Cairo', lagos: 'Africa/Lagos', johannesburg: 'Africa/Johannesburg', moscow: 'Europe/Moscow', istanbul: 'Europe/Istanbul', seoul: 'Asia/Seoul', beijing: 'Asia/Shanghai', shanghai: 'Asia/Shanghai', auckland: 'Pacific/Auckland', hawaii: 'Pacific/Honolulu', honolulu: 'Pacific/Honolulu', denver: 'America/Denver', phoenix: 'America/Phoenix', utc: 'UTC', gmt: 'UTC' };
    var zone = map[name];
    if (!zone) { try { zone = Intl.DateTimeFormat('en-US', { timeZone: name.replace(/_/g, ' ') }).resolvedOptions().timeZone; } catch (e0) { zone = null; } }
    return zone;
  }
  function fmt(zone) {
    try {
      var now = new Date();
      var t = new Intl.DateTimeFormat('en-US', { timeZone: zone, hour: 'numeric', minute: '2-digit', weekday: 'long', hour12: true }).formatToParts(now);
      var o = {}; t.forEach(function (p) { o[p.type] = p.value; });
      var off = '';
      try {
        var there = new Date(now.toLocaleString('en-US', { timeZone: zone }));
        var here = new Date(now.toLocaleString('en-US'));
        var mins = Math.round((there - here) / 60000);
        if (Math.abs(mins) > 1) off = ' (' + (mins > 0 ? '+' : '-') + Math.floor(Math.abs(mins) / 60) + 'h' + (Math.abs(mins) % 60 ? ' ' + (Math.abs(mins) % 60) + 'm' : '') + ' from you)';
      } catch (e1) {}
      return (o.weekday || '') + ' ' + (o.hour || '') + ':' + (o.minute || '') + (/(AM|PM)/i.test(o.dayperiod || '') ? ' ' + o.dayperiod.toUpperCase() : '') + off;
    } catch (e2) { return null; }
  }
  window.__TZTIME = function (q) { var z = zoneTime(q || ''); return z ? { zone: z, time: fmt(z) } : null; };

  var TZ = /\b(what time is it|what('s| is) the time|current time in|time (right now |now )?in [A-Z]|time zone|timezone)\b/i;
  var DIRECTIVE = "TIMEZONE RULE: when the ask asks the time or the time zone of a place, lead with that place's current time and day, then the offset from the asker's zone. If a computed local time is available in the page, use it rather than a guess, and never state a time you cannot compute.";

  var of = window.fetch;
  window.fetch = function (input, init) {
    try {
      var url = (typeof input === 'string') ? input : (input && input.url) || '';
      if (/pollinations\.ai/.test(url) && init && typeof init.body === 'string' && init.method === 'POST') {
        var j = null;
        try { j = JSON.parse(init.body); } catch (e1) { j = null; }
        if (j && j.messages && j.messages.length) {
          var msgs = j.messages.slice(), touched = false;
          for (var m = msgs.length - 1; m >= 0; m--) {
            if (msgs[m] && msgs[m].role === 'user' && typeof msgs[m].content === 'string' && TZ.test(msgs[m].content)) {
              var added = false;
              for (var s = 0; s < msgs.length; s++) {
                if (msgs[s] && msgs[s].role === 'system' && typeof msgs[s].content === 'string' && msgs[s].content.indexOf('TIMEZONE RULE') < 0) {
                  msgs[s] = { role: 'system', content: msgs[s].content + '\n\n' + DIRECTIVE };
                  added = true; touched = true; break;
                }
              }
              if (!added && !touched) { msgs.unshift({ role: 'system', content: DIRECTIVE }); touched = true; }
              break;
            }
          }
          if (touched) init = Object.assign({}, init, { body: JSON.stringify(Object.assign({}, j, { messages: msgs })) });
        }
      }
    } catch (e2) {}
    return of.apply(this, [input, init]);
  };

  try { console.log('[hl329] timezone mode online: time asks get the live local time first'); } catch (e3) {}
})();

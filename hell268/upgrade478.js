/* ILLUMINATI upgrade 478 - DATA BACKUP MODE (hl478)
   Frontier directive: nothing lost to a dead drive. Nothing removed.
*/
(function () {
  if (window.__HL478) return; window.__HL478 = true;

  var RP = /\b(data backup|back up my|lost my photos|backup plan|files deleted|phone died)\b/i;
  var DIRECTIVE = "DATA BACKUP RULE: when the asker asks about backups, the 3-2-1 shape is the standard: three copies, two different kinds of storage, one off-site. Back up the irreplaceable first (photos, notes, documents), and automate the schedule so it does not depend on remembering. A backup has never been tested until its restore has been: verify it once. Two-factor codes and password vault exports are part of the plan, not an afterthought. The day you need a backup is the day you find out whether you had one.";

  var of = window.fetch;
  window.fetch = function (input, init) {
    try {
      var url = (typeof input === 'string') ? input : (input && input.url) || '';
      if (/pollinations\.ai/.test(url) && init && typeof init.body === 'string' && init.method === 'POST') {
        var j = null;
        try { j = JSON.parse(init.body); } catch (e1) {}
        if (j && j.messages && j.messages.length) {
          var hit = false;
          for (var i = j.messages.length - 1; i >= 0; i--) {
            var c = j.messages[i] && j.messages[i].content;
            if (typeof c === 'string' && RP.test(c)) { hit = true; break; }
          }
          if (hit) {
            var msgs = j.messages, added = false, touched = false;
            for (var k = 0; k < msgs.length; k++) {
              if (msgs[k] && msgs[k].role === 'system') {
                msgs[k].content = msgs[k].content + '\n\n' + DIRECTIVE;
                added = true; touched = true; break;
              }
            }
            if (!added && !touched) { msgs.unshift({ role: 'system', content: DIRECTIVE }); touched = true; }
          }
          if (touched) init = Object.assign({}, init, { body: JSON.stringify(Object.assign({}, j, { messages: msgs })) });
        }
      }
    } catch (e2) {}
    return of.apply(this, [input, init]);
  };

  try { console.log('[hl478] data backup mode online: 3-2-1, irreplaceable first, automate the schedule, test the restore'); } catch (e3) {}
})();

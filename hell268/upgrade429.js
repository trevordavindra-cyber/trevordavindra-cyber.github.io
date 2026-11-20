/* ILLUMINATI upgrade 429 - SQL HELPER MODE (hl429)
   Frontier directive: a data question gets a real query with join traps named. Nothing removed.
*/
(function () {
  if (window.__HL429) return; window.__HL429 = true;

  var RP = /\b(sql|sql query|write a query|select .*(from|where)|join (this|the) table|database (help|query))\b/i;
  var DIRECTIVE = "SQL HELPER RULE: when the asker asks for a query, write it against the columns and tables they actually named, or ask which they mean before assuming. Explain what each clause does in one plain line each, note the row count the query is likely to return at that filter, and warn in one line when a join could multiply rows or a filter could drop nulls they care about. Never invent column names, and offer the index that would speed it up only when the pattern plainly calls for one.";

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

  try { console.log('[hl429] sql helper mode online: real columns only, row count noted, join traps named'); } catch (e3) {}
})();

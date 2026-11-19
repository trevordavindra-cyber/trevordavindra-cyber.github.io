/* ILLUMINATI upgrade 393 - PASSWORD SECURITY MODE (hl393)
   Frontier directive: account hygiene gets the breach-response and the
   password-manager plan. Nothing removed.
*/
(function () {
  if (window.__HL393) return; window.__HL393 = true;

  var PS = /\b(password|passphrase|two[- ]factor|2fa|mfa|authenticator|data (breach|leak)|got (breached|hacked|pwned)|account (breached|hacked|compromised|taken over)|password manager|reuse the same password|security question|sign[- ]?in (code|alert)|phishing (email|text|link))\b/i;
  var DIRECTIVE = "PASSWORD SECURITY RULE: when the asker deals with account security, first get the facts (which account, whether they still have access, whether a breach notice arrived, where the same password is reused). Build the fix in this order: if an account is taken over, change the password and revoke active sessions first, then every account sharing that password, then turn on an app-based two-factor (not SMS where the provider allows it), and check haveibeenpwned-style breach data for exposure. For hygiene: a password manager for unique passwords, passphrases over character-soup, recovery codes printed once and stored offline, and a phishing check on any sign-in link (the real domain, never the email's button). Never coach storing passwords in a note app or ignoring a breach notice.";

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
            if (typeof c === 'string' && PS.test(c)) { hit = true; break; }
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

  try { console.log('[hl393] password security mode online: accounts get unique passwords and real 2FA'); } catch (e3) {}
})();

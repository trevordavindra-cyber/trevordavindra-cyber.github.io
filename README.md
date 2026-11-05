# AI Working Map (README)

This repo serves TWO separate apps on GitHub Pages. There is no build step: everything is plain HTML, CSS and browser JavaScript.

## App 1: EditForge AI (the site root)
Live at https://trevordavindra-cyber.github.io/
- `index.html` — page layout and markup
- `style.css` — all styles
- `ef-core.js` — state, storage, helpers
- `ef-engine.js` — the edit engine
- `ef-director.js` — project direction logic
- `ef-ui.js` — UI wiring
- `sw.js`, `manifest.json`, `icon.svg` — PWA shell

## App 2: Uncensored AI (a standalone page)
Live at https://trevordavindra-cyber.github.io/uncensored.html
- `uncensored.html` — layout, all styles, and the 5 script tags. Each script tag ends in `?v=NN`.
- `ua-core.js` — shared state and brain access. Holds POOL (the single free AI endpoint: https://text.pollinations.ai/openai, model `openai-fast`, 3 tries), SYSTEM prompt, CAP (max context chars), the 10 built-in agents, prefs and all `ua_*` localStorage keys, and the `ask()` router every feature calls.
- `ua-app.js` — the chat: streaming `askSpace()` (POST to POOL[0], SSE parse), phone-brain fallback (`askLocal`, web-llm in-browser models), drawer, site builder, images, phone mode, voice, settings.
- `ua-research.js` — Explore panel: deep research (3-query plan, DuckDuckGo html results via r.jina.ai reader, up to 4 sources, cited report), model compare (free brain vs phone brain), chat search, light-theme default flag `ua_theme19`, service worker registration.
- `ua-team.js` — Team OS: ATLAS / SAGE / FORGE / NOVA, one equal brain, mission log, `ua4_*` keys.
- `ua-tasks.js` — Tasks dashboard, Projects, Agents editor, Email & call drafts.

## Rules any editor (human or AI) must follow
1. **Version bump:** after changing any `ua-*.js` file, raise the `?v=` number on all 5 script tags in `uncensored.html` (they must stay identical) so browsers stop serving the old file.
2. **Free only:** no API keys, no paid services, no signups. The brain is the free Pollinations endpoint; do not reintroduce hf.space endpoints (they were removed on purpose).
3. **No fake features:** every button must do what it says. If a capability needs an account or device permission the page cannot have (sending real email, real calls, real inbox access), it drafts and the user approves and sends — say so in the UI.
4. **Privacy:** nothing the user types or attaches may be stored anywhere except their own phone (localStorage `ua_*` keys). Files are read in-page only.
5. **Style:** dark UI with a one-time light-theme default (`ua_theme19`); ChatGPT-style layout; keep copy short and honest.
6. **Test before claiming:** JS is checked with a parser (no syntax errors) before pushing; live behavior is verified on the real page.

## How to ship an edit
- Edit the file(s), push to `main`. GitHub Pages redeploys in about a minute.
- Any AI that cannot push to GitHub: produce the complete edited file and hand it back; the owner's assistant (Fo) pushes it. Do not send partial diffs.

The separate repo `trevordavindra-cyber/empire-os-public` is a different project (Empire OS). This repo and that repo are unrelated.
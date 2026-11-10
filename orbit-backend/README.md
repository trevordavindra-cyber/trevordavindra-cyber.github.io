# ORBIT backend

The real backend for ORBIT: a Cloudflare Worker running Llama 3.2 on Cloudflare's free Workers AI tier.

- Free, no card.
- The AI runs on Cloudflare's servers, so it works on any phone.
- Needs one 5-minute signup by an adult (Cloudflare requires 18+).

Full setup steps are at the top of `worker.js`.

Endpoints:
- `GET /api/health` — sanity check
- `POST /api/chat` — `{"messages":[{"role":"user","content":"hi"}]}` → `{"reply":"..."}`

Once the worker URL exists, hand it to Fo and the ORBIT Live AI page gets switched from the in-browser model to this real backend (with the in-browser version kept as offline fallback).

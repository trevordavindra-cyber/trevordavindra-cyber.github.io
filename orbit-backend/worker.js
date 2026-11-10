/**
 * ORBIT backend — Cloudflare Worker (free plan)
 * Real chat API for the ORBIT site, running llama on Cloudflare's free Workers AI.
 * No cost, no card. The AI key/account stays server-side — never in the site's code.
 *
 * SETUP (5 minutes, needs an 18+ account holder):
 * 1. Sign up at dash.cloudflare.com (free).
 * 2. Workers & Pages -> Create -> Worker -> name it "orbit-api" -> Deploy -> Edit code.
 * 3. Paste this whole file over the starter code -> Deploy.
 * 4. Settings -> Bindings/Variables -> add an AI binding named AI
 *    (or, if the dashboard only offers variables: create an API token with
 *    Workers AI edit permission, add it as a secret variable named AI_TOKEN,
 *    and put your account id in a variable named ACCOUNT_ID — the code below
 *    handles both).
 * 5. Copy your worker URL (https://orbit-api.<your-subdomain>.workers.dev),
 *    send it to Fo, and the ORBIT site gets wired to it.
 */

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

const SYSTEM = `You are ORBIT, a direct, warm AI assistant. You talk like a person: short sentences, plain words, no corporate filler. You are honest about what you are: an AI assistant on the ORBIT website. You cannot make calls, book things, browse the web, or take real actions yet — say so plainly when asked, and never pretend otherwise. Never invent confirmations, links, or facts; if you are unsure, say you are unsure.`;

const MODEL = "@cf/meta/llama-3.2-3b-instruct";

export default {
  async fetch(request, env) {
    if (request.method === "OPTIONS") return new Response(null, { headers: CORS });
    const url = new URL(request.url);

    if (url.pathname === "/api/health") {
      return json({ ok: true, service: "orbit-api", model: MODEL });
    }

    if (url.pathname === "/api/chat" && request.method === "POST") {
      let body;
      try { body = await request.json(); } catch { return json({ error: "bad json" }, 400); }
      const msgs = Array.isArray(body.messages) ? body.messages.slice(-12) : [];
      const clean = msgs.filter(m => m && (m.role === "user" || m.role === "assistant") && typeof m.content === "string");
      if (!clean.length) return json({ error: "no messages" }, 400);

      const payload = { messages: [{ role: "system", content: SYSTEM }, ...clean], max_tokens: 500 };

      let out, status = 200;
      try {
        if (env.AI) {
          out = await env.AI.run(MODEL, payload);
        } else if (env.AI_TOKEN && env.ACCOUNT_ID) {
          const r = await fetch(
            `https://api.cloudflare.com/client/v4/accounts/${env.ACCOUNT_ID}/ai/run/${MODEL}`,
            { method: "POST", headers: { "Authorization": `Bearer ${env.AI_TOKEN}`, "Content-Type": "application/json" }, body: JSON.stringify(payload) }
          );
          const data = await r.json();
          out = data?.result ?? { response: "" };
          if (!r.ok) status = 502;
        } else {
          return json({ error: "missing AI binding or AI_TOKEN/ACCOUNT_ID" }, 500);
        }
      } catch (e) {
        return json({ error: "upstream ai failed" }, 502);
      }

      const text = out?.response ?? "";
      return json({ reply: text });
    }

    return json({ ok: true, hint: "POST /api/chat {messages:[{role,content}]} · GET /api/health" });
  },
};

function json(obj, status = 200) {
  return new Response(JSON.stringify(obj), { status, headers: { "Content-Type": "application/json", ...CORS } });
}

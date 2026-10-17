const allowedOrigins = new Set(["https://breachmatrix.com", "https://www.breachmatrix.com"]);
const responseHeaders = { "Cache-Control": "no-store", "X-Content-Type-Options": "nosniff" };

function reply(status, success, message, headers = {}) {
  return Response.json({ success, message }, { status, headers: { ...responseHeaders, ...headers } });
}

async function readBody(request) {
  if (!request.body) return "";
  const reader = request.body.getReader();
  const decoder = new TextDecoder();
  let size = 0;
  let text = "";
  try {
    while (true) {
      const chunk = await reader.read();
      if (chunk.done) break;
      size += chunk.value.byteLength;
      if (size > 4096) {
        await reader.cancel();
        throw reply(413, false, "Your request is too large.");
      }
      text += decoder.decode(chunk.value, { stream: true });
    }
    return text + decoder.decode();
  } finally {
    reader.releaseLock();
  }
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname !== "/api/waitlist") return reply(404, false, "Not found.");
    if (request.method !== "POST") return reply(405, false, "Use the signup form to join.", { Allow: "POST" });
    if (!allowedOrigins.has(url.origin) || request.headers.get("Origin") !== url.origin) {
      return reply(403, false, "Please submit the form from breachmatrix.com.");
    }
    const contentType = (request.headers.get("Content-Type") || "").split(";")[0].trim().toLowerCase();
    const nativeForm = contentType === "application/x-www-form-urlencoded";
    if (contentType !== "application/json" && !nativeForm) return reply(415, false, "Unsupported request format.");
    try {
      const limit = await env.RATE_LIMITER.limit({ key: "waitlist:" + (request.headers.get("CF-Connecting-IP") || "unknown") });
      if (!limit.success) return reply(429, false, "Too many attempts. Please try again in a minute.", { "Retry-After": "60" });
      const body = await readBody(request);
      let data;
      try {
        data = nativeForm ? Object.fromEntries(new URLSearchParams(body)) : JSON.parse(body);
      } catch {
        return reply(400, false, "Please check your email and try again.");
      }
      if (!data || typeof data !== "object" || Array.isArray(data)) return reply(400, false, "Invalid request.");
      if (data._honey) return reply(200, true, "Request received.");
      const email = typeof data.email === "string" ? data.email.trim().toLowerCase() : "";
      if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || /[\u0000-\u001f\u007f]/.test(email)) {
        return reply(400, false, "Enter a valid email address.");
      }
      await env.DB.prepare("INSERT INTO waitlist (email) VALUES (?) ON CONFLICT(email) DO NOTHING").bind(email).run();
      if (nativeForm) {
        return new Response(null, { status: 303, headers: { ...responseHeaders, Location: "/?waitlist=received#launch" } });
      }
      return reply(200, true, "Request received.");
    } catch (error) {
      if (error instanceof Response) return error;
      return reply(503, false, "Signups are temporarily unavailable. Please try again shortly.");
    }
  }
};
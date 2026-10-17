import test from "node:test";
import assert from "node:assert/strict";
import worker from "./worker.mjs";

function environment() {
  const emails = new Set();
  return {
    emails,
    RATE_LIMITER: { limit: async () => ({ success: true }) },
    DB: {
      prepare(statement) {
        assert.equal(statement, "INSERT INTO waitlist (email) VALUES (?) ON CONFLICT(email) DO NOTHING");
        return { bind: email => ({ run: async () => { emails.add(email); } }) };
      }
    }
  };
}

function request(data = { email: "defender@example.com" }, options = {}) {
  return new Request("https://breachmatrix.com/api/waitlist", {
    method: "POST",
    headers: { Origin: "https://breachmatrix.com", "Content-Type": "application/json", "CF-Connecting-IP": "192.0.2.1", ...options.headers },
    body: options.body ?? JSON.stringify(data)
  });
}

test("stores a normalized email and returns no subscriber data", async () => {
  const env = environment();
  const response = await worker.fetch(request({ email: " Defender@Example.COM " }), env);
  assert.equal(response.status, 200);
  assert.deepEqual([...env.emails], ["defender@example.com"]);
  assert.deepEqual(await response.json(), { success: true, message: "Request received." });
  assert.equal(response.headers.get("Cache-Control"), "no-store");
});

test("duplicate requests are idempotent", async () => {
  const env = environment();
  await worker.fetch(request(), env);
  assert.equal((await worker.fetch(request(), env)).status, 200);
  assert.equal(env.emails.size, 1);
});

test("rejects other origins", async () => {
  const env = environment();
  assert.equal((await worker.fetch(request({}, { headers: { Origin: "https://example.com" } }), env)).status, 403);
  assert.equal(env.emails.size, 0);
});

test("never exposes signups over GET", async () => {
  assert.equal((await worker.fetch(new Request("https://breachmatrix.com/api/waitlist"), environment())).status, 405);
});

test("rejects invalid email addresses", async () => {
  for (const email of ["", "invalid", "a@example.com\u0000", "a".repeat(255) + "@example.com"]) {
    assert.equal((await worker.fetch(request({ email }), environment())).status, 400);
  }
});

test("rejects malformed and non-object JSON", async () => {
  for (const body of ["{", "null", "[]", '"email"']) {
    assert.equal((await worker.fetch(request({}, { body }), environment())).status, 400);
  }
});

test("bounds request bodies even without Content-Length", async () => {
  assert.equal((await worker.fetch(request({}, { body: "a".repeat(4097) }), environment())).status, 413);
});

test("discards honeypot submissions without storing email", async () => {
  const env = environment();
  assert.equal((await worker.fetch(request({ email: "bot@example.com", _honey: "filled" }), env)).status, 200);
  assert.equal(env.emails.size, 0);
});

test("rate limits before writing to the database", async () => {
  const env = environment();
  env.RATE_LIMITER.limit = async () => ({ success: false });
  const response = await worker.fetch(request(), env);
  assert.equal(response.status, 429);
  assert.equal(response.headers.get("Retry-After"), "60");
  assert.equal(env.emails.size, 0);
});

test("database failures do not report success", async () => {
  const env = environment();
  env.DB.prepare = () => { throw new Error("private database detail"); };
  const response = await worker.fetch(request(), env);
  assert.equal(response.status, 503);
  assert.ok(!(await response.text()).includes("private database detail"));
});

test("supports native form submission without JavaScript", async () => {
  const env = environment();
  const response = await worker.fetch(request({}, {
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ email: "defender@example.com" }).toString()
  }), env);
  assert.equal(response.status, 303);
  assert.equal(response.headers.get("Location"), "/?waitlist=received#launch");
  assert.equal(env.emails.size, 1);
});
import assert from "node:assert/strict";
import { createHmac } from "node:crypto";
import test from "node:test";
import { readStripeMode, verifyStripeSignature } from "./stripe";

test("live Stripe keys are refused and test keys are accepted", () => {
  assert.deepEqual(readStripeMode(""), { ok: false, reason: "missing" });
  assert.deepEqual(readStripeMode("sk_live_abc"), { ok: false, reason: "live" });
  assert.deepEqual(readStripeMode("rk_live_abc"), { ok: false, reason: "live" });
  assert.deepEqual(readStripeMode("sk_test_abc"), { ok: true, secretKey: "sk_test_abc" });
  assert.equal(readStripeMode("pk_test_abc").ok, false);
});

test("webhook signatures match Stripe's timestamped payload", () => {
  const payload = '{"id":"evt_test"}';
  const secret = "whsec_preview";
  const timestamp = Math.floor(Date.now() / 1000);
  const signature = createHmac("sha256", secret).update(`${timestamp}.${payload}`).digest("hex");
  const header = `t=${timestamp},v1=${signature}`;
  assert.equal(verifyStripeSignature(payload, header, secret), true);
  assert.equal(verifyStripeSignature(payload, header, "whsec_other"), false);
  assert.equal(verifyStripeSignature(payload, `t=${timestamp - 3600},v1=${signature}`, secret), false);
});

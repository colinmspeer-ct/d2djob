import assert from "node:assert/strict";
import test from "node:test";
import { generateProfile, pseudonymFromName } from "./profile";
import { assertSampleMarkets } from "./sample-data";

test("public drafts drop the legal surname, email, and phone", () => {
  assert.equal(pseudonymFromName("Amira El-Masry"), "Amira E.");
  const profile = generateProfile({
    realName: "Amira El-Masry",
    interviewNotes:
      "Email amira@example.com or call 555-010-0199. She writes the ticket note before she closes it. She has four years on a subscription desk in Cairo and wants a written refund policy.",
    city: "Cairo",
    countryName: "Egypt",
    roleTitle: "Client success",
    yearsExperience: 4,
  });
  assert.equal(profile.highlights.length, 3);
  assert.equal(profile.background.includes("@"), false);
  assert.equal(profile.background.includes("555"), false);
  assert.equal(profile.background.toLowerCase().includes("el-masry"), false);
});

test("sample cards are only invented Egypt and Belize profiles", () => {
  assert.doesNotThrow(() => assertSampleMarkets());
});

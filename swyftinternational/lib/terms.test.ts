import assert from "node:assert/strict";
import test from "node:test";
import { balanceAfterDeposit, readPlacementTerms, successFeeCents } from "./terms";

test("default commercial terms match the placement model", () => {
  const terms = readPlacementTerms({});
  assert.equal(terms.successFeePercent, 33);
  assert.equal(terms.depositCents, 50_000);
  assert.equal(terms.replacementGuaranteeDays, 90);
  assert.equal(successFeeCents(6_000_000, terms.successFeePercent), 1_980_000);
  assert.equal(balanceAfterDeposit(1_980_000, terms.depositCents), 1_930_000);
});

test("terms can be overridden and reject junk", () => {
  const terms = readPlacementTerms({
    SUCCESS_FEE_PERCENT: "25",
    SEARCH_DEPOSIT_CENTS: "75000",
    REPLACEMENT_GUARANTEE_DAYS: "60",
  });
  assert.deepEqual(terms, { successFeePercent: 25, depositCents: 75_000, replacementGuaranteeDays: 60 });
  assert.throws(() => readPlacementTerms({ SUCCESS_FEE_PERCENT: "thirty" }));
  assert.throws(() => readPlacementTerms({ SEARCH_DEPOSIT_CENTS: "-1" }));
});

import assert from "node:assert/strict";
import test from "node:test";
import { brandConfigs, brandIds, brandStaticParams } from "./brands";

test("brand ids and static params stay in sync", () => {
  const params = brandStaticParams();
  assert.equal(params.length, brandIds.length);
  assert.deepEqual(
    params.map((item) => item.brand),
    [...brandIds],
  );
});

test("every brand has required SEO and pricing data", () => {
  for (const id of brandIds) {
    const brand = brandConfigs[id];
    assert.ok(brand.domain.includes("."));
    assert.equal(brand.pricingDefaults.successFeePercent, 33);
    assert.equal(brand.pricingDefaults.depositCents, 50_000);
    assert.equal(brand.pricingDefaults.replacementDays, 90);
    assert.ok(brand.keywords.length >= 3);
    assert.ok(brand.faq.length >= 3);
  }
});

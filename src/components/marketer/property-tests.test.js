import { test, describe } from "node:test";
import assert from "node:assert/strict";

/**
 * Property 9: Marketer referral eligibility
 * A referral is eligible for payout when:
 *   referral.commission > 0 AND referral.store.status !== 'blocked'
 */

function isReferralEligibleForPayout(referral) {
  if (!referral) return false;
  const commission = Number(referral.commission ?? 0);
  const storeStatus = referral.store?.status ?? referral.store_status ?? "active";
  return commission > 0 && storeStatus !== "blocked";
}

describe("Property 9: Marketer referral eligibility for payout", () => {
  test("positive commission and active store => eligible", () => {
    const referral = { id: 1, commission: 50, store: { status: "active" } };
    assert.strictEqual(isReferralEligibleForPayout(referral), true);
  });

  test("positive commission and blocked store => ineligible", () => {
    const referral = { id: 1, commission: 50, store: { status: "blocked" } };
    assert.strictEqual(isReferralEligibleForPayout(referral), false);
  });

  test("zero commission and active store => ineligible", () => {
    const referral = { id: 1, commission: 0, store: { status: "active" } };
    assert.strictEqual(isReferralEligibleForPayout(referral), false);
  });

  test("negative commission and active store => ineligible", () => {
    const referral = { id: 1, commission: -10, store: { status: "active" } };
    assert.strictEqual(isReferralEligibleForPayout(referral), false);
  });

  test("null referral => ineligible", () => {
    assert.strictEqual(isReferralEligibleForPayout(null), false);
  });

  test("referral with missing store status => eligible (defaults to active)", () => {
    const referral = { id: 1, commission: 50 };
    assert.strictEqual(isReferralEligibleForPayout(referral), true);
  });

  test("randomized property test over 100 samples", () => {
    for (let i = 0; i < 100; i++) {
      const commission = Math.floor(Math.random() * 200) - 50;
      const storeStatus = Math.random() > 0.3 ? "active" : "blocked";
      const referral = { id: i, commission, store: { status: storeStatus } };

      const result = isReferralEligibleForPayout(referral);
      const expected = commission > 0 && storeStatus !== "blocked";
      assert.strictEqual(result, expected);
    }
  });
});

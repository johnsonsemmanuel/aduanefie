import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { GHANA_CARD_REGEX, validateGhanaCard } from "./ghanaValidation.js";

describe("validateGhanaCard", () => {
  test("passes for valid NIA format (uppercase)", () => {
    assert.strictEqual(validateGhanaCard("GHA-123456789-0"), true);
  });

  test("passes for valid NIA format with lowercase prefix (auto-uppercased)", () => {
    assert.strictEqual(validateGhanaCard("gha-123456789-0"), true);
  });

  test("passes for mixed-case prefix (auto-uppercased)", () => {
    assert.strictEqual(validateGhanaCard("Gha-123456789-0"), true);
  });

  test("fails for wrong prefix", () => {
    assert.strictEqual(validateGhanaCard("NGN-123456789-0"), false);
  });

  test("fails for incorrect length (body too short)", () => {
    assert.strictEqual(validateGhanaCard("GHA-12345678-0"), false);
  });

  test("fails for incorrect length (body too long)", () => {
    assert.strictEqual(validateGhanaCard("GHA-1234567890-0"), false);
  });

  test("fails for lowercase treated after trim", () => {
    assert.strictEqual(validateGhanaCard("  gha-123456789-0  "), true);
  });

  test("fails for null input", () => {
    assert.strictEqual(validateGhanaCard(null), false);
  });

  test("fails for undefined input", () => {
    assert.strictEqual(validateGhanaCard(undefined), false);
  });

  test("fails for empty string", () => {
    assert.strictEqual(validateGhanaCard(""), false);
  });

  test("fails for missing trailing digit", () => {
    assert.strictEqual(validateGhanaCard("GHA-123456789-"), false);
  });

  test("fails for missing body digits", () => {
    assert.strictEqual(validateGhanaCard("GHA---0"), false);
  });
});

describe("GHANA_CARD_REGEX", () => {
  test("matches valid pattern", () => {
    assert.strictEqual(GHANA_CARD_REGEX.test("GHA-ABC123DEF-5"), true);
  });

  test("rejects lowercase body", () => {
    assert.strictEqual(GHANA_CARD_REGEX.test("GHA-abc123def-5"), false);
  });

  test("rejects wrong prefix", () => {
    assert.strictEqual(GHANA_CARD_REGEX.test("USA-123456789-0"), false);
  });
});

import test from "node:test";
import assert from "node:assert/strict";
import jwt from "jsonwebtoken";

process.env.JWT_SECRET = process.env.JWT_SECRET || "test-secret-do-not-use-in-prod";

const { generateToken } = await import("../utils/generateToken.js");

test("generateToken embeds the user's id and role, and is verifiable", () => {
  const fakeUser = { _id: "64f0000000000000000000ab", role: "admin" };
  const token = generateToken(fakeUser);

  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  assert.equal(decoded.id, fakeUser._id);
  assert.equal(decoded.role, "admin");
});

test("generateToken rejects verification with the wrong secret", () => {
  const fakeUser = { _id: "64f0000000000000000000ab", role: "citizen" };
  const token = generateToken(fakeUser);

  assert.throws(() => jwt.verify(token, "wrong-secret"));
});
// These tests exercise routing and auth-guard behavior WITHOUT a live
// MongoDB connection. They intentionally don't hit any DB-backed
// controller logic (that needs an integration test with a real/in-memory
// Mongo instance) but they do catch a real class of regression: route
// ordering mistakes (e.g. "/services/:id" swallowing "/services/saved")
// and auth middleware being wired to the wrong routes.
import test from "node:test";
import assert from "node:assert/strict";
import request from "supertest";
import mongoose from "mongoose";

process.env.JWT_SECRET = process.env.JWT_SECRET || "test-secret-do-not-use-in-prod";
process.env.NODE_ENV = "test";

// No live DB connection in this test file - fail DB-touching queries fast
// instead of buffering (and hanging) for 10s waiting on a connection that
// will never arrive.
mongoose.set("bufferCommands", false);

const { default: app } = await import("../app.js");

test("GET /api/health reports degraded (not a false 'ok') when the database isn't connected", async () => {
  // In this test process there is no live Mongo connection, so the health
  // endpoint must honestly report that instead of a blanket 200 "ok" -
  // that's the whole point of this endpoint existing.
  const res = await request(app).get("/api/health");
  assert.equal(res.status, 503);
  assert.equal(res.body.status, "degraded");
  assert.equal(res.body.database, "disconnected");
});

test("unknown routes return 404 via the notFound handler", async () => {
  const res = await request(app).get("/api/this-route-does-not-exist");
  assert.equal(res.status, 404);
  assert.match(res.body.message, /Route not found/);
});

test("GET /api/services is public (no 401 without a token)", async () => {
  // We can't assert a 200 here without a live DB connection, but we CAN
  // assert the request is never rejected by the auth middleware, i.e. it
  // doesn't short-circuit with 401/403 - it fails later, at the DB layer.
  const res = await request(app).get("/api/services");
  assert.notEqual(res.status, 401);
  assert.notEqual(res.status, 403);
});

test("GET /api/services/saved requires auth (route ordering guard)", async () => {
  // This is the regression test for the classic Express bug where a static
  // route like "/saved" gets shadowed by a dynamic "/:id" route registered
  // before it. If that regression reappears, this request would fall
  // through to the PUBLIC getService controller (treating "saved" as an
  // id) instead of being rejected by the `protect` middleware, and we
  // would NOT get a fast 401 here.
  const res = await request(app).get("/api/services/saved");
  assert.equal(res.status, 401);
});

test("POST /api/services (create) requires auth before touching the DB", async () => {
  const res = await request(app).post("/api/services").send({ title: "x" });
  assert.equal(res.status, 401);
});

test("GET /api/issues requires auth", async () => {
  const res = await request(app).get("/api/issues");
  assert.equal(res.status, 401);
});

test("POST /api/ai/chat requires auth", async () => {
  const res = await request(app).post("/api/ai/chat").send({ message: "hi" });
  assert.equal(res.status, 401);
});

test("register rejects a short password before hitting the DB", async () => {
  const res = await request(app)
    .post("/api/auth/register")
    .send({ name: "Test User", email: "test@example.com", password: "short" });
  assert.equal(res.status, 400);
  assert.match(res.body.message, /8 characters/);
});

test("register rejects missing fields before hitting the DB", async () => {
  const res = await request(app).post("/api/auth/register").send({ email: "test@example.com" });
  assert.equal(res.status, 400);
});
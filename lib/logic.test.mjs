/**
 * Lightweight smoke tests for Sprint 1 business rules.
 * Run: node lib/logic.test.mjs
 */
import assert from "node:assert/strict";

// Inline minimal copies to avoid TS transpile in smoke test
const SESSION_LIMIT = 4;

function applyAttendance(student, type) {
  const shouldDeduct =
    (type === "present" || type === "makeup") &&
    student.status !== "withdrawn" &&
    student.remainingSessions > 0;

  let remaining = student.remainingSessions;
  let status = student.status;

  if (shouldDeduct) {
    remaining = Math.max(0, remaining - 1);
    if (remaining === 0 && status === "active") {
      status = "renewal_needed";
    }
  }

  return {
    ...student,
    remainingSessions: remaining,
    status,
  };
}

function completePayment(student) {
  return {
    ...student,
    remainingSessions: SESSION_LIMIT,
    totalSessions: SESSION_LIMIT,
    status: student.status === "withdrawn" ? "withdrawn" : "active",
  };
}

let s = {
  status: "active",
  remainingSessions: 1,
};

s = applyAttendance(s, "present");
assert.equal(s.remainingSessions, 0);
assert.equal(s.status, "renewal_needed");

s = applyAttendance(s, "present");
assert.equal(s.remainingSessions, 0, "cannot go negative");
assert.equal(s.status, "renewal_needed");

s = completePayment(s);
assert.equal(s.remainingSessions, 4);
assert.equal(s.status, "active");

s = applyAttendance(s, "absent");
assert.equal(s.remainingSessions, 4, "absent does not deduct");

console.log("logic.test.mjs: all passed");

/**
 * Lightweight smoke tests for Sprint 1 business rules.
 * Run: node lib/logic.test.mjs
 */
import assert from "node:assert/strict";

const SESSION_LIMIT = 4;

function applyAttendance(student, type) {
  const counted =
    (type === "present" || type === "makeup") &&
    student.status !== "withdrawn" &&
    student.usedCount < student.packageSize;

  if (!counted) return { ...student };

  const nextUsed = Math.min(student.usedCount + 1, student.packageSize);
  return {
    ...student,
    usedCount: nextUsed,
    paymentStatus:
      nextUsed >= student.packageSize ? "due" : student.paymentStatus,
  };
}

function completePayment(student) {
  return {
    ...student,
    usedCount: 0,
    packageSize: SESSION_LIMIT,
    paymentStatus: "paid",
    status: student.status === "withdrawn" ? "withdrawn" : "active",
  };
}

let s = {
  status: "active",
  usedCount: 3,
  packageSize: SESSION_LIMIT,
  paymentStatus: "paid",
};

s = applyAttendance(s, "present");
assert.equal(s.usedCount, 4);
assert.equal(s.paymentStatus, "due");

s = applyAttendance(s, "present");
assert.equal(s.usedCount, 4, "cannot exceed packageSize");
assert.equal(s.paymentStatus, "due");

s = completePayment(s);
assert.equal(s.usedCount, 0);
assert.equal(s.paymentStatus, "paid");

s = applyAttendance(s, "absent");
assert.equal(s.usedCount, 0, "absent does not count");

console.log("logic.test.mjs: all passed");

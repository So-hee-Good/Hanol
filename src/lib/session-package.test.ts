import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { DEFAULT_PACKAGE_SESSIONS, PACKAGE_STATUS } from "./constants";
import {
  applyAttendanceToPackage,
  createFreshPackage,
  formatSessionProgress,
  isPaymentRequired,
} from "./session-package";

describe("session package domain", () => {
  it("formats progress like ■■■□ 3 / 4", () => {
    assert.equal(formatSessionProgress(3, 4), "■■■□ 3 / 4");
    assert.equal(formatSessionProgress(0, 4), "□□□□ 0 / 4");
    assert.equal(formatSessionProgress(4, 4), "■■■■ 4 / 4");
  });

  it("consumes one session per attendance", () => {
    const pkg = createFreshPackage({
      id: "pkg_test",
      studentId: "stu_test",
      purchasedAt: "2026-07-16T00:00:00.000Z",
    });

    const afterOne = applyAttendanceToPackage(pkg);
    assert.equal(afterOne.usedSessions, 1);
    assert.equal(afterOne.status, PACKAGE_STATUS.ACTIVE);
    assert.equal(isPaymentRequired(afterOne), false);
  });

  it("marks payment required at 4/4", () => {
    let pkg = createFreshPackage({
      id: "pkg_test",
      studentId: "stu_test",
      purchasedAt: "2026-07-16T00:00:00.000Z",
    });

    for (let i = 0; i < DEFAULT_PACKAGE_SESSIONS; i += 1) {
      pkg = applyAttendanceToPackage(pkg);
    }

    assert.equal(pkg.usedSessions, 4);
    assert.equal(pkg.status, PACKAGE_STATUS.PAYMENT_REQUIRED);
    assert.equal(isPaymentRequired(pkg), true);
    assert.equal(formatSessionProgress(pkg.usedSessions), "■■■■ 4 / 4");
  });

  it("never uses monthly tuition fields", () => {
    const pkg = createFreshPackage({
      id: "pkg_test",
      studentId: "stu_test",
      purchasedAt: "2026-07-16T00:00:00.000Z",
    });

    assert.equal("monthlyTuition" in pkg, false);
    assert.equal("tuitionMonth" in pkg, false);
    assert.equal(pkg.totalSessions, DEFAULT_PACKAGE_SESSIONS);
  });
});

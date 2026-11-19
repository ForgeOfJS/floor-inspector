import { describe, expect, it } from "vitest";
import { demoAssignments, demoAttempts, demoGuild, demoReports } from "./index";
import {
  assignmentSchema,
  bossAttemptSchema,
  guildSchema,
  normalizeReportCode,
  reportImportSchema,
  roleSchema,
} from "@floor-inspector/domain";

describe("report identifiers", () => {
  it.each([
    " Abcdef1234567890 ",
    "https://www.warcraftlogs.com/reports/Abcdef1234567890#fight=3",
    "https://warcraftlogs.com/reports/Abcdef1234567890/?view=rankings",
  ])("normalizes %s", (value) =>
    expect(normalizeReportCode(value)).toBe("Abcdef1234567890"),
  );
  it.each([
    "wrong",
    "http://warcraftlogs.com/reports/Abcdef1234567890",
    "https://warcraftlogs.com.evil.test/reports/Abcdef1234567890",
    "https://evil.test@warcraftlogs.com/reports/Abcdef1234567890",
    "https://warcraftlogs.com:443/reports/Abcdef1234567890",
    "https://warcraftlogs.com/reports/%41bcdef1234567890",
    "https://warcraftlogs.com/reports/Abcdef1234567890/extra",
  ])("rejects %s", (value) => expect(normalizeReportCode(value)).toBeNull());
});

it("validates the synthetic fixture entities", () => {
  expect(guildSchema.parse(demoGuild)).toEqual(demoGuild);
  expect(
    demoReports.every((report) => reportImportSchema.safeParse(report).success),
  ).toBe(true);
  expect(
    demoAttempts.every(
      (attempt) => bossAttemptSchema.safeParse(attempt).success,
    ),
  ).toBe(true);
  expect(
    demoAssignments.every(
      (assignment) => assignmentSchema.safeParse(assignment).success,
    ),
  ).toBe(true);
});

it("rejects invalid entity invariants", () => {
  expect(guildSchema.safeParse({ ...demoGuild, name: " " }).success).toBe(
    false,
  );
  expect(
    reportImportSchema.safeParse({ ...demoReports[0], status: "FAILED" })
      .success,
  ).toBe(false);
  expect(
    bossAttemptSchema.safeParse({ ...demoAttempts[0], endOffsetMs: 0 }).success,
  ).toBe(false);
  expect(
    bossAttemptSchema.safeParse({ ...demoAttempts[0], outcome: "KILL" })
      .success,
  ).toBe(false);
  expect(
    assignmentSchema.safeParse({ ...demoAssignments[0], status: "UNKNOWN" })
      .success,
  ).toBe(false);
  expect(roleSchema.safeParse("ADMIN").success).toBe(false);
});

import { z } from "zod";
import {
  assignmentSchema,
  bossAttemptSchema,
  guildSchema,
  reportImportSchema,
} from "@pullboard/domain";

function demoId(sequence: number) {
  return `941ddaad-7ed2-4d82-81ba-${String(sequence).padStart(12, "0")}`;
}

export const demoGuild = guildSchema.parse({
  id: demoId(1),
  name: "The Last Pull",
  realm: "Synthetic Realm",
  createdBy: demoId(2),
  createdAt: "2026-10-01T00:00:00Z",
});

function demoNight(day: number) {
  return `2026-11-${day}T02:00:00Z`;
}

const completedCode = "DEMO000000000001";
export const demoReports = z.array(reportImportSchema).parse(
  [
    {
      id: demoId(11),
      reportCode: "DEMO000000000004",
      title: "Sunday cleanup",
      raidDate: demoNight(15),
      status: "QUEUED",
      attemptCount: 0,
      errorCode: null,
    },
    {
      id: demoId(12),
      reportCode: "DEMO000000000003",
      title: "Saturday progression",
      raidDate: demoNight(14),
      status: "PROCESSING",
      attemptCount: 1,
      errorCode: null,
    },
    {
      id: demoId(13),
      reportCode: "DEMO000000000002",
      title: "Friday progression",
      raidDate: demoNight(13),
      status: "FAILED",
      attemptCount: 1,
      errorCode: "SOURCE_UNAVAILABLE",
    },
    {
      id: demoId(14),
      reportCode: completedCode,
      title: "Thursday progression",
      raidDate: demoNight(12),
      status: "COMPLETED",
      attemptCount: 1,
      errorCode: null,
    },
  ].map((report) => ({
    ...report,
    guildId: demoGuild.id,
    requestedAt: report.raidDate,
  })),
);

export const demoAttempts = z.array(bossAttemptSchema).parse(
  [68, 43, 19, 7, 0].map((remainingHealthPercent, index) => ({
    id: demoId(30 + index),
    reportCode: completedCode,
    fightId: index + 1,
    encounterId: 1001,
    boss: "The Ash Warden",
    difficulty: "Heroic",
    order: index + 1,
    startOffsetMs: index * 420_000,
    endOffsetMs: index * 420_000 + 130_000 + index * 42_000,
    outcome: remainingHealthPercent === 0 ? "KILL" : "WIPE",
    remainingHealthPercent,
  })),
);

export const demoAssignments = z.array(assignmentSchema).parse(
  [
    {
      id: demoId(41),
      title: "Map defensive cooldowns",
      description:
        "Assign a defensive cooldown to each wave during the final phase.",
      assignee: "Mira",
      status: "OPEN",
    },
    {
      id: demoId(42),
      title: "Set an interrupt rotation",
      description:
        "Write down the interrupt order and name a backup for each group.",
      assignee: "Ren",
      status: "IN_PROGRESS",
    },
    {
      id: demoId(43),
      title: "Share the pull review",
      description: "Post the notes from the first kill in the raid channel.",
      assignee: "Vale",
      status: "DONE",
    },
  ].map((assignment) => ({
    ...assignment,
    guildId: demoGuild.id,
    reportId: demoId(14),
    dueLabel: "Next raid",
  })),
);

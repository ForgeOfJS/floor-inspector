import { z } from "zod";

const id = z.uuid();
const label = z.string().trim().min(1).max(120);
const timestamp = z.iso.datetime();
export const roleSchema = z.enum(["OWNER", "OFFICER", "MEMBER"]);
export const importStatusSchema = z.enum([
  "QUEUED",
  "PROCESSING",
  "COMPLETED",
  "FAILED",
]);
export const assignmentStatusSchema = z.enum(["OPEN", "IN_PROGRESS", "DONE"]);
// M0 uses the 16-character, case-sensitive report identifier format.
export const reportCodeSchema = z.string().regex(/^[A-Za-z0-9]{16}$/);

export function normalizeReportCode(input: string): string | null {
  const value = input.trim();
  if (reportCodeSchema.safeParse(value).success) return value;
  // Only accept exact HTTPS origins and report paths. Never fetch this input.
  const match =
    /^https:\/\/(?:www\.)?warcraftlogs\.com\/reports\/([A-Za-z0-9]{16})\/?(?:[?#][^\s]*)?$/.exec(
      value,
    );
  return match?.[1] ?? null;
}

export const guildSchema = z.object({
  id,
  name: label,
  realm: label,
  createdBy: id,
  createdAt: timestamp,
});

export const reportImportSchema = z
  .object({
    id,
    guildId: id,
    reportCode: reportCodeSchema,
    title: label,
    raidDate: timestamp,
    status: importStatusSchema,
    requestedAt: timestamp,
    attemptCount: z.number().int().nonnegative(),
    errorCode: z.enum(["SOURCE_UNAVAILABLE"]).nullable(),
  })
  .refine(
    (report) => (report.status === "FAILED") === (report.errorCode !== null),
    {
      path: ["errorCode"],
      message: "Only failed imports require an error code",
    },
  );

export const bossAttemptSchema = z
  .object({
    id,
    reportCode: reportCodeSchema,
    fightId: z.number().int().positive(),
    encounterId: z.number().int().positive(),
    boss: label,
    difficulty: label,
    order: z.number().int().positive(),
    startOffsetMs: z.number().int().nonnegative(),
    endOffsetMs: z.number().int().positive(),
    outcome: z.enum(["KILL", "WIPE"]),
    remainingHealthPercent: z.number().min(0).max(100).nullable(),
  })
  .refine((attempt) => attempt.endOffsetMs > attempt.startOffsetMs, {
    path: ["endOffsetMs"],
    message: "End must follow start",
  })
  .refine(
    (attempt) =>
      attempt.outcome !== "KILL" ||
      attempt.remainingHealthPercent === null ||
      attempt.remainingHealthPercent === 0,
    {
      path: ["remainingHealthPercent"],
      message: "A kill with recorded health must end at zero",
    },
  );

export const assignmentSchema = z.object({
  id,
  guildId: id,
  reportId: id,
  title: label,
  description: z.string().trim().min(1).max(1000),
  assignee: label,
  dueLabel: label,
  status: assignmentStatusSchema,
});

export type Guild = z.infer<typeof guildSchema>;
export type ReportImport = z.infer<typeof reportImportSchema>;
export type BossAttempt = z.infer<typeof bossAttemptSchema>;
export type Assignment = z.infer<typeof assignmentSchema>;

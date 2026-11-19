import type {
  Assignment,
  BossAttempt,
  Guild,
  ReportImport,
} from "@floor-inspector/domain";
import {
  demoAssignments,
  demoAttempts,
  demoGuild,
  demoReports,
} from "@floor-inspector/fixtures";

export type RaidReport = { report: ReportImport; attempts: BossAttempt[] };

interface GuildData {
  dashboard(): Promise<{
    guild: Guild;
    reports: ReportImport[];
    recent: RaidReport | null;
    assignments: Assignment[];
  }>;
  reports(): Promise<ReportImport[]>;
  report(id: string): Promise<RaidReport | null>;
  assignments(): Promise<Assignment[]>;
}

function detail(report: ReportImport): RaidReport {
  return {
    report,
    attempts:
      report.status === "COMPLETED"
        ? demoAttempts.filter(
            (attempt) => attempt.reportCode === report.reportCode,
          )
        : [],
  };
}

export const guildData: GuildData = {
  async dashboard() {
    const recent = demoReports.find((report) => report.status === "COMPLETED");
    return {
      guild: demoGuild,
      reports: demoReports,
      recent: recent ? detail(recent) : null,
      assignments: demoAssignments,
    };
  },
  async reports() {
    return demoReports;
  },
  async report(id) {
    const report = demoReports.find((item) => item.id === id);
    return report ? detail(report) : null;
  },
  async assignments() {
    return demoAssignments;
  },
};

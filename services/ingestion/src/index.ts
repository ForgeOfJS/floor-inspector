import { normalizeReportCode, type BossAttempt } from "@floor-inspector/domain";
import { demoAttempts, demoReports } from "@floor-inspector/fixtures";

export interface WarcraftLogsProvider {
  getReport(
    reportCode: string,
  ): Promise<{ reportCode: string; attempts: BossAttempt[] } | null>;
}

export const fakeWarcraftLogsProvider: WarcraftLogsProvider = {
  async getReport(input) {
    const reportCode = normalizeReportCode(input);
    if (!reportCode) throw new Error("Invalid Warcraft Logs report identifier");
    if (
      !demoReports.some(
        (report) =>
          report.reportCode === reportCode && report.status === "COMPLETED",
      )
    ) {
      return null;
    }
    return {
      reportCode,
      attempts: demoAttempts
        .filter((attempt) => attempt.reportCode === reportCode)
        .map((attempt) => ({ ...attempt })),
    };
  },
};

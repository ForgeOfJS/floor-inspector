import { expect, it } from "vitest";
import { fakeWarcraftLogsProvider } from "./index";

it("returns isolated, ordered synthetic pulls for completed reports", async () => {
  const code = "DEMO000000000001";
  const report = await fakeWarcraftLogsProvider.getReport(
    `https://warcraftlogs.com/reports/${code}`,
  );
  expect(report?.attempts.map((attempt) => attempt.order)).toEqual([
    1, 2, 3, 4, 5,
  ]);
  report?.attempts.pop();
  expect(
    (await fakeWarcraftLogsProvider.getReport(code))?.attempts,
  ).toHaveLength(5);
});
it("distinguishes invalid identifiers from unavailable reports", async () => {
  await expect(fakeWarcraftLogsProvider.getReport("invalid")).rejects.toThrow(
    "Invalid",
  );
  await expect(
    fakeWarcraftLogsProvider.getReport("DEMO000000000099"),
  ).resolves.toBeNull();
  await expect(
    fakeWarcraftLogsProvider.getReport("DEMO000000000004"),
  ).resolves.toBeNull();
});

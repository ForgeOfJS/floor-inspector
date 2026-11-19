import { useLocalSearchParams } from "expo-router";
import { useCallback } from "react";
import { StyleSheet, Text, View } from "react-native";
import { guildData } from "../../src/data";
import {
  ActionLink,
  colors,
  DataView,
  Page,
  Panel,
  raidDate,
  Status,
  styles,
  useData,
} from "../../src/ui";

const pendingMessages = {
  QUEUED: "This sample report is waiting to be imported.",
  PROCESSING: "Attempts will appear after the import completes.",
  FAILED: "The sample source report was unavailable.",
  COMPLETED: "This report has no boss attempts.",
};

export default function Report() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <ReportDetails key={id} id={id} />;
}

function ReportDetails({ id }: { id: string }) {
  const load = useCallback(() => guildData.report(id), [id]);
  const data = useData(load);
  const title =
    data.state.status === "ready" ? data.state.data?.report.title : undefined;

  return (
    <Page
      title={title ?? "Raid report"}
      subtitle="Import status and boss attempts."
    >
      <ActionLink href="/reports">← All reports</ActionLink>
      <DataView resource={data}>
        {(detail) => {
          if (!detail)
            return (
              <Panel>
                <Text style={styles.body}>Report not found.</Text>
              </Panel>
            );
          const { report, attempts } = detail;
          const withHealth = attempts.filter(
            (attempt) => attempt.remainingHealthPercent !== null,
          );
          return (
            <>
              <Panel>
                <View style={styles.row}>
                  <Text style={styles.body}>
                    {raidDate(report.raidDate)} · {report.reportCode}
                  </Text>
                  <Status value={report.status} />
                </View>
                {attempts.length === 0 && (
                  <Text style={styles.muted}>
                    {pendingMessages[report.status]}
                  </Text>
                )}
              </Panel>
              {withHealth.length > 0 && (
                <Panel>
                  <Text accessibilityRole="header" style={styles.section}>
                    Boss health at pull end
                  </Text>
                  <Text style={styles.muted}>
                    {attempts[0].boss} · {attempts[0].difficulty}
                  </Text>
                  {withHealth.map((attempt) => {
                    const health = attempt.remainingHealthPercent ?? 0;
                    return (
                      <View key={attempt.id} style={chart.row}>
                        <Text style={chart.label}>Pull {attempt.order}</Text>
                        <View style={chart.track}>
                          <View style={[chart.bar, { width: `${health}%` }]} />
                        </View>
                        <Text style={chart.value}>{health}%</Text>
                      </View>
                    );
                  })}
                </Panel>
              )}
              {attempts.length > 0 && (
                <Panel>
                  <Text accessibilityRole="header" style={styles.section}>
                    Boss attempts
                  </Text>
                  {attempts.map((attempt) => (
                    <View key={attempt.id} style={styles.row}>
                      <View>
                        <Text style={styles.body}>
                          Pull {attempt.order} · {attempt.boss}
                        </Text>
                        <Text style={styles.muted}>
                          {Math.round(
                            (attempt.endOffsetMs - attempt.startOffsetMs) /
                              1000,
                          )}{" "}
                          seconds
                        </Text>
                      </View>
                      <Status value={attempt.outcome} />
                    </View>
                  ))}
                </Panel>
              )}
            </>
          );
        }}
      </DataView>
    </Page>
  );
}

const chart = StyleSheet.create({
  row: { flexDirection: "row", gap: 10, alignItems: "center" },
  label: { width: 52, color: colors.text },
  value: { width: 44, textAlign: "right", color: colors.text },
  track: {
    flex: 1,
    height: 8,
    backgroundColor: colors.line,
    borderRadius: 4,
    overflow: "hidden",
  },
  bar: { height: "100%", backgroundColor: colors.accent, borderRadius: 4 },
});

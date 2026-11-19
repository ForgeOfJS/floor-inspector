import { StyleSheet, Text, View, useWindowDimensions } from "react-native";
import { guildData } from "../src/data";
import {
  ActionLink,
  DataView,
  Page,
  Panel,
  raidDate,
  Status,
  styles,
  useData,
} from "../src/ui";

export default function Overview() {
  const data = useData(guildData.dashboard);
  const wide = useWindowDimensions().width >= 650;
  return (
    <Page
      title="Guild overview"
      subtitle="Raid progression and follow-up for your team."
    >
      <DataView resource={data}>
        {({ guild, recent, reports, assignments }) => (
          <>
            <View style={overview.hero}>
              <Text style={styles.muted}>{guild.realm}</Text>
              <Text accessibilityRole="header" style={styles.title}>
                {guild.name}
              </Text>
              <ActionLink href="/reports">Browse raid reports →</ActionLink>
            </View>
            <View style={wide ? overview.sideBySide : styles.stack}>
              <View style={overview.column}>
                <Panel>
                  <Text accessibilityRole="header" style={styles.section}>
                    Latest completed raid
                  </Text>
                  {recent ? (
                    <>
                      <Text style={styles.body}>
                        {recent.report.title} ·{" "}
                        {raidDate(recent.report.raidDate)}
                      </Text>
                      <Text style={styles.muted}>
                        {recent.attempts.length} boss attempts ·{" "}
                        {
                          recent.attempts.filter(
                            (attempt) => attempt.outcome === "KILL",
                          ).length
                        }{" "}
                        kill
                      </Text>
                      <ActionLink
                        href={{
                          pathname: "/reports/[id]",
                          params: { id: recent.report.id },
                        }}
                      >
                        Review attempts →
                      </ActionLink>
                    </>
                  ) : (
                    <Text style={styles.muted}>No completed reports yet.</Text>
                  )}
                </Panel>
              </View>
              <View style={overview.column}>
                <Panel>
                  <Text accessibilityRole="header" style={styles.section}>
                    Next raid priorities
                  </Text>
                  <Text style={styles.body}>
                    {
                      assignments.filter(
                        (assignment) => assignment.status !== "DONE",
                      ).length
                    }{" "}
                    active assignments
                  </Text>
                  <Text style={styles.muted}>
                    Review owners and status before the next session.
                  </Text>
                  <ActionLink href="/assignments">See assignments →</ActionLink>
                </Panel>
              </View>
            </View>
            <Panel>
              <Text accessibilityRole="header" style={styles.section}>
                Recent imports
              </Text>
              {reports.length ? (
                reports.slice(0, 3).map((report) => (
                  <View key={report.id} style={styles.row}>
                    <ActionLink
                      href={{
                        pathname: "/reports/[id]",
                        params: { id: report.id },
                      }}
                    >
                      {report.title}
                    </ActionLink>
                    <Status value={report.status} />
                  </View>
                ))
              ) : (
                <Text style={styles.muted}>No imports yet.</Text>
              )}
            </Panel>
          </>
        )}
      </DataView>
    </Page>
  );
}

const overview = StyleSheet.create({
  hero: {
    backgroundColor: "#272039",
    borderColor: "#4d3d68",
    borderWidth: 1,
    borderRadius: 16,
    padding: 24,
    gap: 8,
  },
  sideBySide: { flexDirection: "row", gap: 12 },
  column: { flex: 1, minWidth: 0 },
});

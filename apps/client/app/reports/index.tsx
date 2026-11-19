import { Text, View } from "react-native";
import { guildData } from "../../src/data";
import {
  ActionLink,
  DataView,
  Page,
  Panel,
  raidDate,
  Status,
  styles,
  useData,
} from "../../src/ui";

export default function Reports() {
  const data = useData(guildData.reports);
  return (
    <Page
      title="Raid reports"
      subtitle="Review raid nights and check report import status."
    >
      <DataView resource={data}>
        {(reports) =>
          reports.length ? (
            reports.map((report) => (
              <Panel key={report.id}>
                <View style={styles.row}>
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
                <Text style={styles.muted}>
                  {raidDate(report.raidDate)} · {report.reportCode}
                </Text>
              </Panel>
            ))
          ) : (
            <Panel>
              <Text style={styles.muted}>No raid reports yet.</Text>
            </Panel>
          )
        }
      </DataView>
    </Page>
  );
}

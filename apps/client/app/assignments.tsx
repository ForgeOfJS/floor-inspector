import { Text, View } from "react-native";
import { guildData } from "../src/data";
import {
  ActionLink,
  DataView,
  Page,
  Panel,
  Status,
  styles,
  useData,
} from "../src/ui";

export default function Assignments() {
  const data = useData(guildData.assignments);
  return (
    <Page
      title="Assignments"
      subtitle="See who owns each raid follow-up and what’s ready for review."
    >
      <DataView resource={data}>
        {(assignments) =>
          assignments.length ? (
            assignments.map((assignment) => (
              <Panel key={assignment.id}>
                <View style={styles.row}>
                  <Text accessibilityRole="header" style={styles.section}>
                    {assignment.title}
                  </Text>
                  <Status value={assignment.status} />
                </View>
                <Text style={styles.body}>{assignment.description}</Text>
                <Text style={styles.muted}>
                  {assignment.assignee} · {assignment.dueLabel}
                </Text>
                <ActionLink
                  href={{
                    pathname: "/reports/[id]",
                    params: { id: assignment.reportId },
                  }}
                >
                  View related report →
                </ActionLink>
              </Panel>
            ))
          ) : (
            <Panel>
              <Text style={styles.muted}>No assignments yet.</Text>
            </Panel>
          )
        }
      </DataView>
    </Page>
  );
}

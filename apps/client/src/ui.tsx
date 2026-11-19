import { Link, type Href } from "expo-router";
import { useEffect, useState, type ReactNode } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

export const colors = {
  background: "#121318",
  sidebar: "#17181f",
  panel: "#1c1e27",
  line: "#333642",
  text: "#f4f2fa",
  muted: "#acaebf",
  accent: "#cbb8ff",
  green: "#8cddbb",
  amber: "#ffcb86",
  red: "#ff9da8",
};

const statuses = {
  QUEUED: ["Queued", colors.muted],
  PROCESSING: ["Processing", colors.accent],
  COMPLETED: ["Completed", colors.green],
  FAILED: ["Failed", colors.red],
  OPEN: ["Open", colors.amber],
  IN_PROGRESS: ["In progress", colors.accent],
  DONE: ["Done", colors.green],
  KILL: ["Kill", colors.green],
  WIPE: ["Wipe", colors.amber],
} as const;

export function Status({ value }: { value: keyof typeof statuses }) {
  const [name, color] = statuses[value];
  return (
    <Text style={[styles.status, { color, borderColor: color }]}>{name}</Text>
  );
}

export function Page({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
}) {
  return (
    <ScrollView contentContainerStyle={styles.scroll}>
      <View style={styles.page}>
        <View style={styles.heading}>
          <Text accessibilityRole="header" style={styles.title}>
            {title}
          </Text>
          <Text style={styles.muted}>{subtitle}</Text>
        </View>
        {children}
      </View>
    </ScrollView>
  );
}

export function Panel({ children }: { children: ReactNode }) {
  return <View style={styles.panel}>{children}</View>;
}

export function ActionLink({
  href,
  children,
}: {
  href: Href;
  children: string;
}) {
  return (
    <Link href={href} style={styles.link}>
      {children}
    </Link>
  );
}

export type LoadState<T> =
  { status: "loading" | "error" } | { status: "ready"; data: T };

export function useData<T>(load: () => Promise<T>) {
  const [state, setState] = useState<LoadState<T>>({ status: "loading" });
  const [version, setVersion] = useState(0);
  useEffect(() => {
    let active = true;
    load().then(
      (data) => {
        if (active) setState({ status: "ready", data });
      },
      () => {
        if (active) setState({ status: "error" });
      },
    );
    return () => {
      active = false;
    };
  }, [load, version]);
  return {
    state,
    retry() {
      setState({ status: "loading" });
      setVersion((previous) => previous + 1);
    },
  };
}

export function DataView<T>({
  resource,
  children,
}: {
  resource: ReturnType<typeof useData<T>>;
  children: (data: T) => ReactNode;
}) {
  if (resource.state.status === "ready") return children(resource.state.data);
  if (resource.state.status === "loading") {
    return (
      <Panel>
        <ActivityIndicator color={colors.accent} />
        <Text accessibilityLiveRegion="polite" style={styles.muted}>
          Loading demo data…
        </Text>
      </Panel>
    );
  }
  return (
    <Panel>
      <Text accessibilityRole="alert" style={styles.body}>
        Couldn’t load this view.
      </Text>
      <Pressable accessibilityRole="button" onPress={resource.retry}>
        <Text style={styles.link}>Try again</Text>
      </Pressable>
    </Panel>
  );
}

const dateFormat = new Intl.DateTimeFormat("en-US", {
  dateStyle: "medium",
  timeZone: "UTC",
});
export const raidDate = (date: string) => dateFormat.format(new Date(date));

export const styles = StyleSheet.create({
  scroll: { flexGrow: 1, paddingHorizontal: 20, paddingVertical: 30 },
  page: { width: "100%", maxWidth: 1040, alignSelf: "center", gap: 22 },
  heading: { gap: 8 },
  title: {
    color: colors.text,
    fontSize: 38,
    fontWeight: "800",
    letterSpacing: -1.5,
  },
  section: { color: colors.text, fontSize: 22, fontWeight: "700" },
  body: { color: colors.text, fontSize: 16, lineHeight: 23 },
  muted: { color: colors.muted, fontSize: 14, lineHeight: 21 },
  panel: {
    backgroundColor: colors.panel,
    borderColor: colors.line,
    borderWidth: 1,
    borderRadius: 14,
    padding: 18,
    gap: 9,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    flexWrap: "wrap",
    gap: 10,
  },
  stack: { gap: 10 },
  link: {
    color: colors.accent,
    fontSize: 15,
    fontWeight: "700",
    textDecorationLine: "underline",
    paddingVertical: 7,
  },
  status: {
    alignSelf: "flex-start",
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
    fontSize: 12,
    fontWeight: "700",
  },
});

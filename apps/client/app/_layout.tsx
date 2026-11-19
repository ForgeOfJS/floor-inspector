import { Link, Slot, usePathname, type Href } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, useWindowDimensions } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { colors } from "../src/ui";

const links = [
  { href: "/", label: "Overview" },
  { href: "/reports", label: "Reports" },
  { href: "/assignments", label: "Assignments" },
] as const satisfies ReadonlyArray<{ href: Href; label: string }>;

export default function Layout() {
  const { width } = useWindowDimensions();
  const wide = width >= 860;
  const pathname = usePathname();
  return (
    <SafeAreaProvider>
      <SafeAreaView style={[layout.shell, wide && layout.wide]}>
        <StatusBar style="light" />
        <View style={[layout.navigation, wide && layout.sidebar]}>
          <View style={layout.brandRow}>
            <Text style={layout.brand}>Pullboard</Text>
            <Text style={layout.demo}>Synthetic demo</Text>
          </View>
          <View style={[layout.links, wide && layout.verticalLinks]}>
            {links.map(({ href, label }) => {
              const active =
                pathname === href ||
                (href !== "/" && pathname.startsWith(href + "/"));
              return (
                <Link
                  key={href}
                  href={href}
                  accessibilityState={{ selected: active }}
                  style={[layout.link, active && layout.active]}
                >
                  {label}
                </Link>
              );
            })}
          </View>
        </View>
        <View style={layout.content}>
          <Slot />
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const layout = StyleSheet.create({
  shell: { flex: 1, backgroundColor: colors.background },
  wide: { flexDirection: "row" },
  navigation: {
    backgroundColor: colors.sidebar,
    borderColor: colors.line,
    borderBottomWidth: 1,
    padding: 16,
    gap: 12,
  },
  sidebar: {
    width: 224,
    borderBottomWidth: 0,
    borderRightWidth: 1,
    padding: 20,
    gap: 28,
  },
  brandRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    gap: 10,
  },
  brand: {
    color: colors.text,
    fontSize: 25,
    fontWeight: "800",
    letterSpacing: -0.7,
  },
  demo: { color: colors.accent, fontSize: 12, fontWeight: "700" },
  links: { flexDirection: "row", flexWrap: "wrap", gap: 4 },
  verticalLinks: { flexDirection: "column" },
  link: {
    color: colors.muted,
    paddingHorizontal: 10,
    paddingVertical: 12,
    borderRadius: 8,
    fontSize: 14,
    fontWeight: "700",
  },
  active: { backgroundColor: "#32284b", color: colors.accent },
  content: { flex: 1, minWidth: 0 },
});

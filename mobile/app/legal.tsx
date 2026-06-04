import { router } from "expo-router";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { colors, radius, spacing } from "@/src/theme";

export default function LegalScreen() {
  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Privacy & Terms</Text>
            <Text style={styles.subtitle}>
              Important information about using NutriSnap AI.
            </Text>
          </View>

          <TouchableOpacity style={styles.closeCircle} onPress={() => router.back()}>
            <Text style={styles.closeText}>×</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.warningCard}>
          <Text style={styles.warningLabel}>Important disclaimer</Text>
          <Text style={styles.warningText}>
            NutriSnap AI provides approximate nutrition estimates only. It is not
            medical, dietary, or professional health advice.
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>AI nutrition estimates</Text>
          <Text style={styles.bodyText}>
            Meal calories and macro values shown in the app are estimates. They may
            be inaccurate because food preparation, serving size, ingredients,
            sauces, oils, brands, and photo quality can vary.
          </Text>
          <Text style={styles.bodyText}>
            You should review and edit estimates before relying on them. Do not use
            the app as the only source for managing medical conditions, eating
            disorders, allergies, diabetes, pregnancy nutrition, or clinical diet
            plans.
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Data we use</Text>
          <Text style={styles.bodyText}>
            The app may use information you enter, such as meal descriptions,
            optional details, nutrition targets, saved meals, and account details.
          </Text>
          <Text style={styles.bodyText}>
            If you upload a meal photo, the image may be sent to an analysis
            service to generate a nutrition estimate. Avoid uploading sensitive,
            private, or non-food images.
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Cloud sync</Text>
          <Text style={styles.bodyText}>
            When you sign in, saved meals may be stored in the cloud so your meal
            history and daily totals can sync across sessions.
          </Text>
          <Text style={styles.bodyText}>
            If you are signed out, cloud features may be limited or unavailable.
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Data deletion</Text>
          <Text style={styles.bodyText}>
            You can delete saved meals from the app history. For account or full
            data deletion requests, contact the app owner or support contact listed
            on the App Store page.
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Acceptable use</Text>
          <Text style={styles.bodyText}>
            Do not use NutriSnap AI to upload harmful, illegal, abusive, or
            non-consensual content. Do not attempt to misuse the app or its
            services.
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Beta notice</Text>
          <Text style={styles.bodyText}>
            This version may contain bugs, delays, incorrect estimates, or temporary
            service interruptions. Features may change before public launch.
          </Text>
        </View>

        <TouchableOpacity style={styles.primaryButton} onPress={() => router.back()}>
          <Text style={styles.primaryButtonText}>I Understand</Text>
        </TouchableOpacity>

        <Text style={styles.footerText}>Last updated: June 2026</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    padding: spacing.screen,
    paddingBottom: spacing.bottomSafe,
  },
  header: {
    marginTop: 12,
    marginBottom: 22,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 14,
  },
  title: {
    color: colors.textPrimary,
    fontSize: 30,
    fontWeight: "900",
  },
  subtitle: {
    color: colors.textSecondary,
    fontSize: 15,
    marginTop: 6,
    fontWeight: "600",
    lineHeight: 21,
  },
  closeCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: colors.card,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: colors.border,
  },
  closeText: {
    color: colors.textPrimary,
    fontSize: 26,
    marginTop: -2,
  },
  warningCard: {
    backgroundColor: "rgba(255, 176, 32, 0.12)",
    borderRadius: radius.xl,
    padding: spacing.card,
    borderWidth: 1,
    borderColor: colors.warning,
    marginBottom: 18,
  },
  warningLabel: {
    color: colors.warning,
    fontSize: 13,
    fontWeight: "900",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 8,
  },
  warningText: {
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: "800",
    lineHeight: 24,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: radius.xl,
    padding: spacing.card,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 16,
  },
  sectionTitle: {
    color: colors.textPrimary,
    fontSize: 20,
    fontWeight: "900",
    marginBottom: 10,
  },
  bodyText: {
    color: colors.textSecondary,
    fontSize: 15,
    fontWeight: "600",
    lineHeight: 23,
    marginBottom: 10,
  },
  primaryButton: {
    backgroundColor: colors.primary,
    borderRadius: radius.pill,
    paddingVertical: 18,
    alignItems: "center",
    marginTop: 8,
  },
  primaryButtonText: {
    color: colors.textPrimary,
    fontSize: 17,
    fontWeight: "900",
  },
  footerText: {
    color: colors.textMuted,
    textAlign: "center",
    fontSize: 12,
    fontWeight: "700",
    marginTop: 16,
  },
});

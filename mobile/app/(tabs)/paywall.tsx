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

export default function PaywallScreen() {
  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView contentContainerStyle={styles.container}>
        <TouchableOpacity style={styles.closeButton} onPress={() => router.back()}>
          <Text style={styles.closeText}>×</Text>
        </TouchableOpacity>

        <View style={styles.header}>
          <Text style={styles.badge}>Premium coming soon</Text>
          <Text style={styles.title}>More tracking tools are on the way</Text>
          <Text style={styles.subtitle}>
            Free users get 3 AI scans per day during friends testing. Premium
            features are not available to purchase yet.
          </Text>
        </View>

        <View style={styles.featureCard}>
          <Text style={styles.featureTitle}>Planned Premium features</Text>

          <View style={styles.featureRow}>
            <Text style={styles.check}>✓</Text>
            <Text style={styles.featureText}>Higher scan limits</Text>
          </View>

          <View style={styles.featureRow}>
            <Text style={styles.check}>✓</Text>
            <Text style={styles.featureText}>Photo + description based meal analysis</Text>
          </View>

          <View style={styles.featureRow}>
            <Text style={styles.check}>✓</Text>
            <Text style={styles.featureText}>Advanced coach recommendations</Text>
          </View>

          <View style={styles.featureRow}>
            <Text style={styles.check}>✓</Text>
            <Text style={styles.featureText}>Weekly progress summaries</Text>
          </View>
        </View>

        <View style={styles.planCard}>
          <View>
            <Text style={styles.planName}>Monthly</Text>
            <Text style={styles.planMeta}>Planned option</Text>
          </View>

          <View style={styles.priceWrap}>
            <Text style={styles.price}>Soon</Text>
            <Text style={styles.priceMeta}>Not available yet</Text>
          </View>
        </View>

        <View style={[styles.planCard, styles.bestPlan]}>
          <View>
            <Text style={styles.bestBadge}>Planned</Text>
            <Text style={styles.planName}>Yearly</Text>
            <Text style={styles.planMeta}>Planned option</Text>
          </View>

          <View style={styles.priceWrap}>
            <Text style={styles.price}>Soon</Text>
            <Text style={styles.priceMeta}>Not available yet</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.primaryButton} onPress={() => router.back()}>
          <Text style={styles.primaryButtonText}>Premium coming soon</Text>
        </TouchableOpacity>

        <Text style={styles.disclaimer}>
          Purchases and subscriptions are not enabled in this test version.
        </Text>
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
  closeButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "flex-end",
    marginTop: 12,
    marginBottom: 18,
  },
  closeText: {
    color: colors.textPrimary,
    fontSize: 26,
    fontWeight: "700",
    marginTop: -2,
  },
  header: {
    marginBottom: 24,
  },
  badge: {
    color: colors.secondary,
    fontSize: 13,
    fontWeight: "900",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 10,
  },
  title: {
    color: colors.textPrimary,
    fontSize: 34,
    fontWeight: "900",
    lineHeight: 40,
    marginBottom: 12,
  },
  subtitle: {
    color: colors.textSecondary,
    fontSize: 16,
    fontWeight: "600",
    lineHeight: 24,
  },
  featureCard: {
    backgroundColor: colors.cardAlt,
    borderRadius: radius.xxl,
    padding: spacing.cardLarge,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: colors.borderViolet,
  },
  featureTitle: {
    color: colors.textPrimary,
    fontSize: 20,
    fontWeight: "900",
    marginBottom: 14,
  },
  featureRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    marginTop: 12,
  },
  check: {
    color: colors.secondary,
    fontSize: 18,
    fontWeight: "900",
  },
  featureText: {
    flex: 1,
    color: colors.textPrimary,
    fontSize: 15,
    fontWeight: "700",
    lineHeight: 22,
  },
  planCard: {
    backgroundColor: colors.card,
    borderRadius: radius.xl,
    padding: spacing.card,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: colors.border,
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 16,
  },
  bestPlan: {
    borderColor: colors.primary,
    backgroundColor: colors.cardAlt,
  },
  bestBadge: {
    color: colors.secondary,
    fontSize: 12,
    fontWeight: "900",
    textTransform: "uppercase",
    marginBottom: 6,
  },
  planName: {
    color: colors.textPrimary,
    fontSize: 20,
    fontWeight: "900",
  },
  planMeta: {
    color: colors.textSecondary,
    fontSize: 14,
    fontWeight: "700",
    marginTop: 5,
  },
  priceWrap: {
    alignItems: "flex-end",
  },
  price: {
    color: colors.textPrimary,
    fontSize: 22,
    fontWeight: "900",
  },
  priceMeta: {
    color: colors.textSecondary,
    fontSize: 13,
    fontWeight: "700",
    marginTop: 4,
  },
  primaryButton: {
    backgroundColor: colors.primary,
    borderRadius: radius.pill,
    paddingVertical: 18,
    alignItems: "center",
    marginTop: 10,
  },
  primaryButtonText: {
    color: colors.textPrimary,
    fontSize: 18,
    fontWeight: "900",
  },
  secondaryButton: {
    backgroundColor: colors.card,
    borderRadius: radius.pill,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  secondaryButtonText: {
    color: colors.textSecondary,
    fontSize: 15,
    fontWeight: "900",
  },
  disclaimer: {
    color: colors.textMuted,
    textAlign: "center",
    fontSize: 12,
    lineHeight: 18,
    marginTop: 16,
  },
});

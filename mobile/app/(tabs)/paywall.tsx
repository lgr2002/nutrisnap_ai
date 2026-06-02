import { router } from "expo-router";
import {
  Alert,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { colors, radius, spacing } from "@/src/theme";
import { setPremiumStatus, resetPremiumStatus } from "@/src/storage/subscriptionStorage";
import { resetTodayScanCount } from "@/src/storage/scanUsageStorage";

export default function PaywallScreen() {
  const activatePremium = async () => {
    await setPremiumStatus(true);

    if (Platform.OS === "web") {
      router.replace("/scan");
      return;
    }

    Alert.alert("Premium unlocked", "Unlimited scans are enabled for this demo.", [
      {
        text: "Continue",
        onPress: () => router.replace("/scan"),
      },
    ]);
  };

  const resetDemoPremium = async () => {
    await resetPremiumStatus();
    await resetTodayScanCount();

    if (Platform.OS === "web") {
      router.replace("/scan");
      return;
    }

    Alert.alert("Demo reset", "You are back on the free plan.", [
      {
        text: "OK",
        onPress: () => router.replace("/scan"),
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView contentContainerStyle={styles.container}>
        <TouchableOpacity style={styles.closeButton} onPress={() => router.back()}>
          <Text style={styles.closeText}>×</Text>
        </TouchableOpacity>

        <View style={styles.header}>
          <Text style={styles.badge}>Premium</Text>
          <Text style={styles.title}>Unlock unlimited AI meal scans</Text>
          <Text style={styles.subtitle}>
            Free users get 3 AI scans per day. Premium gives unlimited scans,
            advanced coach insights, weekly reports and better tracking tools.
          </Text>
        </View>

        <View style={styles.featureCard}>
          <Text style={styles.featureTitle}>What Premium includes</Text>

          <View style={styles.featureRow}>
            <Text style={styles.check}>✓</Text>
            <Text style={styles.featureText}>Unlimited AI calorie estimates</Text>
          </View>

          <View style={styles.featureRow}>
            <Text style={styles.check}>✓</Text>
            <Text style={styles.featureText}>Photo + description based meal analysis</Text>
          </View>

          <View style={styles.featureRow}>
            <Text style={styles.check}>✓</Text>
            <Text style={styles.featureText}>Advanced AI coach recommendations</Text>
          </View>

          <View style={styles.featureRow}>
            <Text style={styles.check}>✓</Text>
            <Text style={styles.featureText}>Weekly progress summaries</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.planCard} onPress={activatePremium}>
          <View>
            <Text style={styles.planName}>Monthly</Text>
            <Text style={styles.planMeta}>Flexible access</Text>
          </View>

          <View style={styles.priceWrap}>
            <Text style={styles.price}>$9.99</Text>
            <Text style={styles.priceMeta}>/ month</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.planCard, styles.bestPlan]} onPress={activatePremium}>
          <View>
            <Text style={styles.bestBadge}>Best value</Text>
            <Text style={styles.planName}>Yearly</Text>
            <Text style={styles.planMeta}>Save compared with monthly</Text>
          </View>

          <View style={styles.priceWrap}>
            <Text style={styles.price}>$69.99</Text>
            <Text style={styles.priceMeta}>/ year</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.primaryButton} onPress={activatePremium}>
          <Text style={styles.primaryButtonText}>Start Premium Demo</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.secondaryButton} onPress={resetDemoPremium}>
          <Text style={styles.secondaryButtonText}>Reset to Free Demo</Text>
        </TouchableOpacity>

        <Text style={styles.disclaimer}>
          This is a demo paywall. Real subscriptions will be added later using
          RevenueCat and App Store / Google Play billing.
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
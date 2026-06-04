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

export default function WelcomeScreen() {
  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.logoWrap}>
          <View style={styles.logoDot}>
            <Text style={styles.logoIcon}>N</Text>
          </View>
          <Text style={styles.logoText}>NutriSnap AI</Text>
        </View>

        <View style={styles.heroCard}>
          <Text style={styles.title}>
            AI calorie tracking without the manual hassle.
          </Text>

          <Text style={styles.subtitle}>
            Scan meals, get calorie and macro estimates, edit when needed, and
            track your day faster than traditional food logging apps.
          </Text>
        </View>

        <View style={styles.featureCard}>
          <View style={styles.featureRow}>
            <Text style={styles.featureIcon}>📷</Text>
            <View style={styles.featureTextWrap}>
              <Text style={styles.featureTitle}>Photo or text estimates</Text>
              <Text style={styles.featureText}>
                Describe a meal or upload a photo for an AI nutrition estimate.
              </Text>
            </View>
          </View>

          <View style={styles.featureRow}>
            <Text style={styles.featureIcon}>🔥</Text>
            <View style={styles.featureTextWrap}>
              <Text style={styles.featureTitle}>Daily calorie tracking</Text>
              <Text style={styles.featureText}>
                See calories, protein, carbs and fat update as you save meals.
              </Text>
            </View>
          </View>

          <View style={[styles.featureRow, styles.lastFeatureRow]}>
            <Text style={styles.featureIcon}>💬</Text>
            <View style={styles.featureTextWrap}>
              <Text style={styles.featureTitle}>Simple AI coach</Text>
              <Text style={styles.featureText}>
                Get simple guidance based on what you logged today.
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.buttonGroup}>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => router.replace("/setup")}
          >
            <Text style={styles.primaryButtonText}>Get Started</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => router.push("/auth")}
          >
            <Text style={styles.secondaryButtonText}>Sign In / Sign Up</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.disclaimer}>
          Nutrition estimates are approximate and are not medical advice.
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
    flexGrow: 1,
    padding: spacing.screen,
    paddingTop: 28,
    paddingBottom: spacing.bottomSafe + 28,
    justifyContent: "center",
  },
  logoWrap: {
    alignItems: "center",
    marginBottom: 24,
  },
  logoDot: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: colors.primary,
    marginBottom: 14,
    borderWidth: 2,
    borderColor: colors.secondary,
    alignItems: "center",
    justifyContent: "center",
  },
  logoIcon: {
    color: colors.textPrimary,
    fontSize: 30,
    fontWeight: "900",
  },
  logoText: {
    color: colors.textPrimary,
    fontSize: 28,
    fontWeight: "900",
  },
  heroCard: {
    backgroundColor: colors.cardAlt,
    borderRadius: radius.xxl,
    padding: spacing.cardLarge,
    borderWidth: 1,
    borderColor: colors.borderViolet,
    marginBottom: 16,
  },
  title: {
    color: colors.textPrimary,
    fontSize: 31,
    fontWeight: "900",
    lineHeight: 38,
    marginBottom: 14,
  },
  subtitle: {
    color: colors.textSecondary,
    fontSize: 16,
    fontWeight: "600",
    lineHeight: 24,
  },
  featureCard: {
    backgroundColor: colors.card,
    borderRadius: radius.xl,
    padding: spacing.card,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 22,
  },
  featureRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 16,
  },
  lastFeatureRow: {
    marginBottom: 0,
  },
  featureIcon: {
    fontSize: 24,
    width: 30,
  },
  featureTextWrap: {
    flex: 1,
  },
  featureTitle: {
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: "900",
    marginBottom: 4,
  },
  featureText: {
    color: colors.textSecondary,
    fontSize: 14,
    fontWeight: "600",
    lineHeight: 20,
  },
  buttonGroup: {
    gap: 12,
  },
  primaryButton: {
    backgroundColor: colors.primary,
    borderRadius: radius.pill,
    paddingVertical: 18,
    alignItems: "center",
  },
  primaryButtonText: {
    color: colors.textPrimary,
    fontSize: 17,
    fontWeight: "900",
  },
  secondaryButton: {
    backgroundColor: colors.card,
    borderRadius: radius.pill,
    paddingVertical: 17,
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.border,
  },
  secondaryButtonText: {
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: "900",
  },
  disclaimer: {
    color: colors.textMuted,
    textAlign: "center",
    fontSize: 12,
    lineHeight: 18,
    marginTop: 18,
  },
});

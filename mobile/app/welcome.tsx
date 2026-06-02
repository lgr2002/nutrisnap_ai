import { router } from "expo-router";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { colors, radius, spacing } from "@/src/theme";

export default function WelcomeScreen() {
  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.container}>
        <View style={styles.logoWrap}>
          <View style={styles.logoDot} />
          <Text style={styles.logoText}>NutriSnap AI</Text>
        </View>

        <View style={styles.heroCard}>
          <Text style={styles.title}>
            AI calorie tracking without the manual hassle.
          </Text>
          <Text style={styles.subtitle}>
            Scan meals, get calorie estimates, edit when needed, and track your
            day faster than traditional food logging apps.
          </Text>
        </View>

        <View style={styles.buttonGroup}>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => router.push("/onboarding-goal")}
          >
            <Text style={styles.primaryButtonText}>Continue with Apple</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => router.push("/onboarding-goal")}
          >
            <Text style={styles.secondaryButtonText}>Continue with Google</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => router.push("/onboarding-goal")}
          >
            <Text style={styles.secondaryButtonText}>Continue with Email</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={() => router.push("/onboarding-goal")}>
          <Text style={styles.signInText}>
            Already have an account?{" "}
            <Text style={styles.signInLink}>Sign in</Text>
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.skipButton} onPress={() => router.push("/")}>
          <Text style={styles.skipButtonText}>Skip for now</Text>
        </TouchableOpacity>

        <Text style={styles.disclaimer}>
          Login is mocked for now. Real auth will be added with Supabase later.
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
    padding: spacing.screen,
    justifyContent: "center",
  },
  logoWrap: {
    alignItems: "center",
    marginBottom: 34,
  },
  logoDot: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.primary,
    marginBottom: 14,
    borderWidth: 2,
    borderColor: colors.secondary,
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
    marginBottom: 24,
  },
  title: {
    color: colors.textPrimary,
    fontSize: 32,
    fontWeight: "900",
    lineHeight: 39,
    marginBottom: 14,
  },
  subtitle: {
    color: colors.textSecondary,
    fontSize: 16,
    fontWeight: "600",
    lineHeight: 24,
  },
  buttonGroup: {
    gap: 12,
    marginBottom: 22,
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
  signInText: {
    color: colors.textSecondary,
    textAlign: "center",
    fontSize: 15,
    fontWeight: "700",
  },
  signInLink: {
    color: colors.secondary,
    fontWeight: "900",
  },
  skipButton: {
    marginTop: 24,
    alignItems: "center",
  },
  skipButtonText: {
    color: colors.textSecondary,
    fontSize: 14,
    fontWeight: "800",
  },
  disclaimer: {
    color: colors.textMuted,
    textAlign: "center",
    fontSize: 12,
    lineHeight: 18,
    marginTop: 18,
  },
});
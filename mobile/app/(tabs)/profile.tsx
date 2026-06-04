import { router, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import {
  ActivityIndicator,
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
import { mockTargets, mockUser } from "@/src/data/mockData";
import { supabase } from "@/src/api/supabaseClient";
import { getPremiumStatus } from "@/src/storage/subscriptionStorage";
import {
  loadNutritionTargets,
  loadUserProfile,
  SavedNutritionTargets,
  SavedUserProfile,
} from "@/src/storage/userProfileStorage";

function getInitialLetter(email: string | null, name: string) {
  if (email) {
    return email.charAt(0).toUpperCase();
  }

  return name.charAt(0).toUpperCase();
}

function showMessage(title: string, message: string) {
  if (Platform.OS === "web") {
    alert(`${title}\n\n${message}`);
    return;
  }

  Alert.alert(title, message);
}

export default function ProfileScreen() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSigningOut, setIsSigningOut] = useState(false);

  const [authEmail, setAuthEmail] = useState<string | null>(null);
  const [isPremium, setIsPremium] = useState(false);

  const [profile, setProfile] = useState<SavedUserProfile>({
    name: mockUser.name,
    goal: mockUser.goal,
    age: mockUser.age,
    heightCm: mockUser.heightCm,
    weightKg: mockUser.weightKg,
    sex: "Male",
    activityLevel: mockUser.activityLevel,
    units: mockUser.units,
    diet: mockUser.diet,
    theme: mockUser.theme,
  });

  const [targets, setTargets] = useState<SavedNutritionTargets>({
    calories: mockTargets.calories,
    protein: mockTargets.protein,
    carbs: mockTargets.carbs,
    fat: mockTargets.fat,
  });

  const loadProfileScreen = async () => {
    setIsLoading(true);

    try {
      const [premiumStatus, savedProfile, savedTargets, userResponse] =
        await Promise.all([
          getPremiumStatus(),
          loadUserProfile(),
          loadNutritionTargets(),
          supabase.auth.getUser(),
        ]);

      setIsPremium(premiumStatus);

      if (savedProfile) {
        setProfile(savedProfile);
      }

      if (savedTargets) {
        setTargets(savedTargets);
      }

      if (userResponse.error || !userResponse.data.user) {
        setAuthEmail(null);
      } else {
        setAuthEmail(userResponse.data.user.email || null);
      }
    } catch {
      setAuthEmail(null);
    } finally {
      setIsLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadProfileScreen();
    }, [])
  );

  const handleLogout = async () => {
    if (isSigningOut) {
      return;
    }

    setIsSigningOut(true);

    try {
      await supabase.auth.signOut();
      setAuthEmail(null);
      showMessage("Signed out", "You have been signed out of cloud sync.");
    } catch (error) {
      showMessage(
        "Sign out failed",
        error instanceof Error ? error.message : "Could not sign out."
      );
    } finally {
      setIsSigningOut(false);
    }
  };

  const isSignedIn = Boolean(authEmail);
  const displayName = isSignedIn ? authEmail || profile.name : profile.name;
  const avatarLetter = getInitialLetter(authEmail, profile.name);

  if (isLoading) {
    return (
      <SafeAreaView style={styles.screen}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator color={colors.primary} size="large" />
          <Text style={styles.loadingText}>Loading profile...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Profile</Text>
            <Text style={styles.subtitle}>Manage your goals and settings.</Text>
          </View>

          <View style={styles.avatarCircle}>
            <Text style={styles.avatarText}>{avatarLetter}</Text>
          </View>
        </View>

        <View style={styles.cloudCard}>
          <Text style={styles.cardLabel}>Cloud Sync</Text>

          {isSignedIn ? (
            <>
              <Text style={styles.cloudTitle}>Signed in</Text>
              <Text style={styles.cloudText}>
                Signed in as {displayName}. Your saved meals can sync across sessions.
              </Text>

              <TouchableOpacity
                style={[styles.secondaryButton, isSigningOut && styles.disabledButton]}
                onPress={handleLogout}
                disabled={isSigningOut}
              >
                <Text style={styles.secondaryButtonText}>
                  {isSigningOut ? "Signing out..." : "Log Out"}
                </Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <Text style={styles.cloudTitle}>Not signed in</Text>
              <Text style={styles.cloudText}>
                Sign in to sync meals, history, and profile data across sessions.
              </Text>

              <TouchableOpacity
                style={styles.primaryButton}
                onPress={() => router.push("/auth")}
              >
                <Text style={styles.primaryButtonText}>Sign In / Sign Up</Text>
              </TouchableOpacity>
            </>
          )}
        </View>

        <View style={styles.planCard}>
          <Text style={styles.cardLabel}>Current Plan</Text>
          <Text style={styles.planTitle}>
            {isPremium ? "Premium Plan" : "Free Plan"}
          </Text>
          <Text style={styles.planText}>
            {isPremium
              ? "Premium access is active."
              : "3 AI meal scans per day. Premium features are coming soon."}
          </Text>

          {!isPremium ? (
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={() => router.push("/paywall")}
            >
              <Text style={styles.primaryButtonText}>Premium Coming Soon</Text>
            </TouchableOpacity>
          ) : null}
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Goal</Text>

          <View style={styles.row}>
            <Text style={styles.rowLabel}>Main goal</Text>
            <Text style={styles.rowValue}>{profile.goal}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.rowLabel}>Activity</Text>
            <Text style={styles.rowValue}>{profile.activityLevel}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.rowLabel}>Diet style</Text>
            <Text style={styles.rowValue}>{profile.diet}</Text>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Nutrition Targets</Text>

          <View style={styles.row}>
            <Text style={styles.rowLabel}>Calories</Text>
            <Text style={styles.rowValue}>{targets.calories} kcal</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.rowLabel}>Protein</Text>
            <Text style={styles.rowValue}>{targets.protein} g</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.rowLabel}>Carbs</Text>
            <Text style={styles.rowValue}>{targets.carbs} g</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.rowLabel}>Fat</Text>
            <Text style={styles.rowValue}>{targets.fat} g</Text>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Body Info</Text>

          <View style={styles.row}>
            <Text style={styles.rowLabel}>Age</Text>
            <Text style={styles.rowValue}>{profile.age}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.rowLabel}>Height</Text>
            <Text style={styles.rowValue}>{profile.heightCm} cm</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.rowLabel}>Weight</Text>
            <Text style={styles.rowValue}>{profile.weightKg} kg</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.rowLabel}>Units</Text>
            <Text style={styles.rowValue}>{profile.units}</Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.legalButton}
          onPress={() => router.push("/legal")}
        >
          <View style={styles.legalTextWrap}>
            <Text style={styles.legalButtonTitle}>
              Privacy, Terms & AI Disclaimer
            </Text>
            <Text style={styles.legalButtonSubtitle}>
              Read how estimates, photos, and cloud data are handled.
            </Text>
          </View>
          <Text style={styles.legalButtonArrow}>›</Text>
        </TouchableOpacity>

        <Text style={styles.footerText}>
          NutriSnap AI estimates are approximate and are not medical advice.
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
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: spacing.screen,
  },
  loadingText: {
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: "800",
    marginTop: 14,
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
    gap: 16,
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
  },
  avatarCircle: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    color: colors.textPrimary,
    fontSize: 25,
    fontWeight: "900",
  },
  cloudCard: {
    backgroundColor: colors.cardAlt,
    borderRadius: radius.xxl,
    padding: spacing.cardLarge,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: colors.borderViolet,
  },
  cardLabel: {
    color: colors.secondary,
    fontSize: 13,
    fontWeight: "900",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 12,
  },
  cloudTitle: {
    color: colors.textPrimary,
    fontSize: 28,
    fontWeight: "900",
    marginBottom: 10,
  },
  cloudText: {
    color: colors.textSecondary,
    fontSize: 16,
    fontWeight: "700",
    lineHeight: 24,
    marginBottom: 18,
  },
  planCard: {
    backgroundColor: colors.cardAlt,
    borderRadius: radius.xxl,
    padding: spacing.cardLarge,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: colors.borderViolet,
  },
  planTitle: {
    color: colors.textPrimary,
    fontSize: 28,
    fontWeight: "900",
    marginBottom: 10,
  },
  planText: {
    color: colors.textSecondary,
    fontSize: 16,
    fontWeight: "700",
    lineHeight: 24,
    marginBottom: 18,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: radius.xl,
    padding: spacing.card,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: colors.border,
  },
  sectionTitle: {
    color: colors.textPrimary,
    fontSize: 22,
    fontWeight: "900",
    marginBottom: 6,
  },
  row: {
    marginTop: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 14,
  },
  rowLabel: {
    color: colors.textSecondary,
    fontSize: 15,
    fontWeight: "700",
  },
  rowValue: {
    color: colors.textPrimary,
    fontSize: 15,
    fontWeight: "900",
    textAlign: "right",
    flexShrink: 1,
  },
  primaryButton: {
    backgroundColor: colors.primary,
    borderRadius: radius.pill,
    paddingVertical: 17,
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
    fontSize: 17,
    fontWeight: "900",
  },
  disabledButton: {
    opacity: 0.55,
  },
  legalButton: {
    backgroundColor: colors.card,
    borderRadius: radius.xl,
    padding: spacing.card,
    borderWidth: 1,
    borderColor: colors.border,
    marginTop: 2,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  legalTextWrap: {
    flex: 1,
  },
  legalButtonTitle: {
    color: colors.textPrimary,
    fontSize: 17,
    fontWeight: "900",
    marginBottom: 5,
  },
  legalButtonSubtitle: {
    color: colors.textSecondary,
    fontSize: 13,
    fontWeight: "700",
    lineHeight: 19,
  },
  legalButtonArrow: {
    color: colors.textSecondary,
    fontSize: 30,
    fontWeight: "800",
  },
  footerText: {
    color: colors.textMuted,
    textAlign: "center",
    fontSize: 12,
    fontWeight: "700",
    lineHeight: 18,
    marginTop: 18,
  },
});

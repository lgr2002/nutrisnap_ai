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
import { mockTargets, mockUser } from "@/src/data/mockData";
import { resetOnboardingState } from "@/src/storage/onboardingStorage";

export default function ProfileScreen() {
  const restartOnboarding = async () => {
    await resetOnboardingState();
    router.replace("/welcome");
  };

  const confirmRestartOnboarding = () => {
    if (Platform.OS === "web") {
      restartOnboarding();
      return;
    }

    Alert.alert(
      "Restart onboarding?",
      "This will show the welcome and setup flow again.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Restart",
          style: "destructive",
          onPress: restartOnboarding,
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Profile</Text>
            <Text style={styles.subtitle}>Manage your goals and settings.</Text>
          </View>

          <View style={styles.avatarCircle}>
            <Text style={styles.avatarText}>{mockUser.name.charAt(0)}</Text>
          </View>
        </View>

        <View style={styles.planCard}>
          <Text style={styles.planLabel}>Current Plan</Text>
          <Text style={styles.planTitle}>{mockUser.plan}</Text>
          <Text style={styles.planText}>
            3 AI meal scans per day. Upgrade for unlimited scans, weekly reports
            and advanced coaching.
          </Text>

          <TouchableOpacity style={styles.upgradeButton}>
            <Text style={styles.upgradeButtonText}>Upgrade to Premium</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Goal</Text>

          <View style={styles.row}>
            <Text style={styles.rowLabel}>Main goal</Text>
            <Text style={styles.rowValue}>{mockUser.goal}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.rowLabel}>Activity</Text>
            <Text style={styles.rowValue}>{mockUser.activityLevel}</Text>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Daily Targets</Text>

          <View style={styles.row}>
            <Text style={styles.rowLabel}>Calories</Text>
            <Text style={styles.rowValue}>
              {mockTargets.calories.toLocaleString()} kcal
            </Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.rowLabel}>Protein</Text>
            <Text style={styles.rowValue}>{mockTargets.protein} g</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.rowLabel}>Carbs</Text>
            <Text style={styles.rowValue}>{mockTargets.carbs} g</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.rowLabel}>Fat</Text>
            <Text style={styles.rowValue}>{mockTargets.fat} g</Text>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Body Details</Text>

          <View style={styles.row}>
            <Text style={styles.rowLabel}>Age</Text>
            <Text style={styles.rowValue}>{mockUser.age}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.rowLabel}>Height</Text>
            <Text style={styles.rowValue}>{mockUser.heightCm} cm</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.rowLabel}>Weight</Text>
            <Text style={styles.rowValue}>{mockUser.weightKg} kg</Text>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Preferences</Text>

          <View style={styles.row}>
            <Text style={styles.rowLabel}>Units</Text>
            <Text style={styles.rowValue}>{mockUser.units}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.rowLabel}>Diet</Text>
            <Text style={styles.rowValue}>{mockUser.diet}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.rowLabel}>Theme</Text>
            <Text style={styles.rowValue}>{mockUser.theme}</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.secondaryButton}>
          <Text style={styles.secondaryButtonText}>Edit Profile</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={confirmRestartOnboarding}
        >
          <Text style={styles.secondaryButtonText}>Restart Onboarding</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.logoutButton}>
          <Text style={styles.logoutButtonText}>Log Out</Text>
        </TouchableOpacity>
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
    marginBottom: 24,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
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
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    color: colors.textPrimary,
    fontSize: 24,
    fontWeight: "900",
  },
  planCard: {
    backgroundColor: colors.cardAlt,
    borderRadius: radius.xxl,
    padding: spacing.cardLarge,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: colors.borderViolet,
  },
  planLabel: {
    color: colors.secondary,
    fontSize: 13,
    fontWeight: "900",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 8,
  },
  planTitle: {
    color: colors.textPrimary,
    fontSize: 28,
    fontWeight: "900",
    marginBottom: 10,
  },
  planText: {
    color: colors.textSecondary,
    fontSize: 15,
    fontWeight: "600",
    lineHeight: 22,
    marginBottom: 18,
  },
  upgradeButton: {
    backgroundColor: colors.primary,
    borderRadius: radius.pill,
    paddingVertical: 15,
    alignItems: "center",
  },
  upgradeButtonText: {
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: "900",
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
    fontSize: 20,
    fontWeight: "900",
    marginBottom: 6,
  },
  row: {
    marginTop: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 16,
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
  secondaryButton: {
    backgroundColor: colors.card,
    borderRadius: radius.pill,
    paddingVertical: 17,
    alignItems: "center",
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  secondaryButtonText: {
    color: colors.textPrimary,
    fontSize: 17,
    fontWeight: "900",
  },
  logoutButton: {
    paddingVertical: 17,
    alignItems: "center",
  },
  logoutButtonText: {
    color: colors.danger,
    fontSize: 16,
    fontWeight: "900",
  },
});
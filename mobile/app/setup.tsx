import { router } from "expo-router";
import { useState } from "react";
import {
  Alert,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { colors, radius, spacing } from "@/src/theme";
import { markOnboardingCompleted } from "@/src/storage/onboardingStorage";
import {
  saveNutritionTargets,
  saveUserProfile,
} from "@/src/storage/userProfileStorage";

type GoalOption = "Fat loss" | "Body recomposition" | "Muscle gain" | "Maintain";
type ActivityOption =
  | "Light activity"
  | "Train 1–2 days/week"
  | "Train 3–4 days/week"
  | "Train 5+ days/week";

const GOAL_OPTIONS: GoalOption[] = [
  "Fat loss",
  "Body recomposition",
  "Muscle gain",
  "Maintain",
];

const ACTIVITY_OPTIONS: ActivityOption[] = [
  "Light activity",
  "Train 1–2 days/week",
  "Train 3–4 days/week",
  "Train 5+ days/week",
];

function showMessage(title: string, message: string) {
  if (Platform.OS === "web") {
    alert(`${title}\n\n${message}`);
    return;
  }

  Alert.alert(title, message);
}

function calculateTargets(weightKg: number, goal: GoalOption) {
  const baseCalories = Math.round(weightKg * 32);
  let calories = baseCalories;

  if (goal === "Fat loss") {
    calories = baseCalories - 350;
  }

  if (goal === "Muscle gain") {
    calories = baseCalories + 250;
  }

  if (goal === "Body recomposition") {
    calories = baseCalories;
  }

  if (goal === "Maintain") {
    calories = baseCalories;
  }

  return {
    calories: Math.max(calories, 1400),
    protein: Math.round(weightKg * 2),
    carbs: Math.round((calories * 0.42) / 4),
    fat: Math.round((calories * 0.28) / 9),
  };
}

export default function SetupScreen() {
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [heightCm, setHeightCm] = useState("");
  const [weightKg, setWeightKg] = useState("");
  const [goal, setGoal] = useState<GoalOption>("Body recomposition");
  const [activityLevel, setActivityLevel] =
    useState<ActivityOption>("Train 3–4 days/week");
  const [isSaving, setIsSaving] = useState(false);

  const handleFinishSetup = async () => {
    const cleanName = name.trim() || "User";
    const parsedAge = Number(age);
    const parsedHeight = Number(heightCm);
    const parsedWeight = Number(weightKg);

    if (!parsedAge || parsedAge < 13 || parsedAge > 100) {
      showMessage("Check age", "Please enter a valid age.");
      return;
    }

    if (!parsedHeight || parsedHeight < 100 || parsedHeight > 250) {
      showMessage("Check height", "Please enter your height in cm.");
      return;
    }

    if (!parsedWeight || parsedWeight < 30 || parsedWeight > 250) {
      showMessage("Check weight", "Please enter your weight in kg.");
      return;
    }

    setIsSaving(true);

    const targets = calculateTargets(parsedWeight, goal);

    const profile = {
      name: cleanName,
      goal,
      age: parsedAge,
      heightCm: parsedHeight,
      weightKg: parsedWeight,
      sex: "Not specified",
      activityLevel,
      units: "Metric",
      diet: "Flexible",
      theme: "Dark",
    };

    try {
      await saveUserProfile(profile);
      await saveNutritionTargets(targets);
      await markOnboardingCompleted();

      router.replace("/(tabs)");
    } catch (error) {
      showMessage(
        "Setup failed",
        error instanceof Error ? error.message : "Could not save setup."
      );
    } finally {
      setIsSaving(false);
    }
  };

  const previewWeight = Number(weightKg);
  const previewTargets = previewWeight
    ? calculateTargets(previewWeight, goal)
    : null;

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <Text style={styles.logoText}>SETUP</Text>
          <Text style={styles.title}>Set your starting targets.</Text>
          <Text style={styles.subtitle}>
            This helps NutriSnap AI calculate daily calories and macros. You can
            change these later.
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Basic info</Text>

          <Text style={styles.label}>Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Example: Leeon"
            placeholderTextColor={colors.textMuted}
            value={name}
            onChangeText={setName}
          />

          <Text style={styles.label}>Age</Text>
          <TextInput
            style={styles.input}
            placeholder="Example: 22"
            placeholderTextColor={colors.textMuted}
            value={age}
            onChangeText={setAge}
            keyboardType="number-pad"
          />

          <Text style={styles.label}>Height</Text>
          <TextInput
            style={styles.input}
            placeholder="Height in cm"
            placeholderTextColor={colors.textMuted}
            value={heightCm}
            onChangeText={setHeightCm}
            keyboardType="number-pad"
          />

          <Text style={styles.label}>Weight</Text>
          <TextInput
            style={styles.input}
            placeholder="Weight in kg"
            placeholderTextColor={colors.textMuted}
            value={weightKg}
            onChangeText={setWeightKg}
            keyboardType="decimal-pad"
          />
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Main goal</Text>

          {GOAL_OPTIONS.map((item) => (
            <TouchableOpacity
              key={item}
              style={[styles.optionButton, goal === item && styles.optionButtonActive]}
              onPress={() => setGoal(item)}
            >
              <Text
                style={[styles.optionText, goal === item && styles.optionTextActive]}
              >
                {item}
              </Text>
              {goal === item ? <Text style={styles.checkText}>✓</Text> : null}
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Activity level</Text>

          {ACTIVITY_OPTIONS.map((item) => (
            <TouchableOpacity
              key={item}
              style={[
                styles.optionButton,
                activityLevel === item && styles.optionButtonActive,
              ]}
              onPress={() => setActivityLevel(item)}
            >
              <Text
                style={[
                  styles.optionText,
                  activityLevel === item && styles.optionTextActive,
                ]}
              >
                {item}
              </Text>
              {activityLevel === item ? (
                <Text style={styles.checkText}>✓</Text>
              ) : null}
            </TouchableOpacity>
          ))}
        </View>

        {previewTargets ? (
          <View style={styles.targetCard}>
            <Text style={styles.targetLabel}>Suggested starting targets</Text>

            <View style={styles.row}>
              <Text style={styles.rowLabel}>Calories</Text>
              <Text style={styles.rowValue}>{previewTargets.calories} kcal</Text>
            </View>

            <View style={styles.row}>
              <Text style={styles.rowLabel}>Protein</Text>
              <Text style={styles.rowValue}>{previewTargets.protein}g</Text>
            </View>

            <View style={styles.row}>
              <Text style={styles.rowLabel}>Carbs</Text>
              <Text style={styles.rowValue}>{previewTargets.carbs}g</Text>
            </View>

            <View style={styles.row}>
              <Text style={styles.rowLabel}>Fat</Text>
              <Text style={styles.rowValue}>{previewTargets.fat}g</Text>
            </View>
          </View>
        ) : null}

        <TouchableOpacity
          style={[styles.primaryButton, isSaving && styles.disabledButton]}
          onPress={handleFinishSetup}
          disabled={isSaving}
        >
          <Text style={styles.primaryButtonText}>
            {isSaving ? "Saving..." : "Finish Setup"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={() => router.push("/auth")}
        >
          <Text style={styles.secondaryButtonText}>Sign in first</Text>
        </TouchableOpacity>

        <Text style={styles.footerText}>
          These targets are approximate and are not medical advice.
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
  header: {
    marginTop: 12,
    marginBottom: 22,
  },
  logoText: {
    color: colors.secondary,
    fontSize: 14,
    fontWeight: "900",
    letterSpacing: 2,
    marginBottom: 12,
  },
  title: {
    color: colors.textPrimary,
    fontSize: 36,
    fontWeight: "900",
    lineHeight: 42,
  },
  subtitle: {
    color: colors.textSecondary,
    fontSize: 16,
    fontWeight: "700",
    lineHeight: 24,
    marginTop: 12,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: radius.xl,
    padding: spacing.card,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 18,
  },
  sectionTitle: {
    color: colors.textPrimary,
    fontSize: 22,
    fontWeight: "900",
    marginBottom: 14,
  },
  label: {
    color: colors.textSecondary,
    fontSize: 14,
    fontWeight: "800",
    marginBottom: 8,
    marginTop: 12,
  },
  input: {
    backgroundColor: colors.background,
    color: colors.textPrimary,
    borderRadius: radius.medium,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: 15,
    paddingHorizontal: 16,
    fontSize: 16,
    fontWeight: "700",
  },
  optionButton: {
    backgroundColor: colors.background,
    borderRadius: radius.large,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: 15,
    paddingHorizontal: 16,
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  optionButtonActive: {
    borderColor: colors.primary,
    backgroundColor: colors.cardAlt,
  },
  optionText: {
    color: colors.textSecondary,
    fontSize: 15,
    fontWeight: "800",
  },
  optionTextActive: {
    color: colors.textPrimary,
  },
  checkText: {
    color: colors.primary,
    fontSize: 18,
    fontWeight: "900",
  },
  targetCard: {
    backgroundColor: colors.cardAlt,
    borderRadius: radius.xxl,
    padding: spacing.cardLarge,
    borderWidth: 1,
    borderColor: colors.borderViolet,
    marginBottom: 18,
  },
  targetLabel: {
    color: colors.secondary,
    fontSize: 13,
    fontWeight: "900",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 12,
  },
  row: {
    marginTop: 12,
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
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  secondaryButtonText: {
    color: colors.textPrimary,
    fontSize: 15,
    fontWeight: "900",
  },
  disabledButton: {
    opacity: 0.55,
  },
  footerText: {
    color: colors.textMuted,
    textAlign: "center",
    fontSize: 12,
    fontWeight: "700",
    lineHeight: 18,
    marginTop: 16,
  },
});

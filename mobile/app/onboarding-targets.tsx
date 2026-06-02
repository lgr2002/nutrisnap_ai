import { router, useLocalSearchParams } from "expo-router";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { colors, radius, spacing } from "@/src/theme";
import { markOnboardingCompleted } from "@/src/storage/onboardingStorage";
import {
  saveNutritionTargets,
  saveUserProfile,
} from "@/src/storage/userProfileStorage";

function calculateTargets(goal: string, weightText: string, activity: string) {
  const weight = Number(weightText || 72);

  let calories = 2350;

  if (goal === "Lose fat") {
    calories = 2050;
  }

  if (goal === "Maintain weight") {
    calories = 2350;
  }

  if (goal === "Build muscle") {
    calories = 2650;
  }

  if (goal === "Body recomposition") {
    calories = 2350;
  }

  if (activity === "Mostly sitting") {
    calories -= 150;
  }

  if (activity === "Very active") {
    calories += 250;
  }

  const protein = Math.round(weight * 2.1);

  return {
    calories,
    protein,
    carbs: Math.round((calories * 0.45) / 4),
    fat: Math.round((calories * 0.25) / 9),
  };
}

export default function OnboardingTargetsScreen() {
  const params = useLocalSearchParams<{
    goal?: string;
    age?: string;
    height?: string;
    weight?: string;
    sex?: string;
    activity?: string;
  }>();

  const goal = params.goal || "Body recomposition";
  const age = Number(params.age || 22);
  const height = Number(params.height || 175);
  const weight = Number(params.weight || 72);
  const sex = params.sex || "Male";
  const activity = params.activity || "Train 3–4 days/week";

  const targets = calculateTargets(goal, String(weight), activity);

  const handleStartTracking = async () => {
    await saveUserProfile({
      name: "Leeon",
      goal,
      age,
      heightCm: height,
      weightKg: weight,
      sex,
      activityLevel: activity,
      units: "Metric",
      diet: "No preference",
      theme: "Dark",
    });

    await saveNutritionTargets(targets);
    await markOnboardingCompleted();

    router.replace("/");
  };

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.container}>
        <Text style={styles.step}>Step 4 of 4</Text>

        <Text style={styles.title}>Your starting targets</Text>
        <Text style={styles.subtitle}>
          These are not perfect. They are a practical starting point and can be
          adjusted later.
        </Text>

        <View style={styles.targetCard}>
          <Text style={styles.cardLabel}>Goal</Text>
          <Text style={styles.goalText}>{goal}</Text>

          <Text style={styles.cardLabel}>Activity</Text>
          <Text style={styles.activityText}>{activity}</Text>

          <View style={styles.divider} />

          <View style={styles.bigMetric}>
            <Text style={styles.bigNumber}>
              {targets.calories.toLocaleString()}
            </Text>
            <Text style={styles.bigUnit}>kcal/day</Text>
          </View>

          <View style={styles.targetRow}>
            <Text style={styles.targetLabel}>Protein</Text>
            <Text style={styles.targetValue}>{targets.protein} g/day</Text>
          </View>

          <View style={styles.targetRow}>
            <Text style={styles.targetLabel}>Carbs</Text>
            <Text style={styles.targetValue}>{targets.carbs} g/day</Text>
          </View>

          <View style={styles.targetRow}>
            <Text style={styles.targetLabel}>Fat</Text>
            <Text style={styles.targetValue}>{targets.fat} g/day</Text>
          </View>
        </View>

        <View style={styles.noteCard}>
          <Text style={styles.noteLabel}>Coach note</Text>
          <Text style={styles.noteText}>
            Start with these targets for 2 weeks, then adjust based on weight,
            gym progress, hunger and energy.
          </Text>
        </View>

        <TouchableOpacity style={styles.startButton} onPress={handleStartTracking}>
          <Text style={styles.startButtonText}>Start Tracking</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>
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
  step: {
    color: colors.secondary,
    fontSize: 13,
    fontWeight: "900",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 12,
  },
  title: {
    color: colors.textPrimary,
    fontSize: 32,
    fontWeight: "900",
    lineHeight: 38,
    marginBottom: 10,
  },
  subtitle: {
    color: colors.textSecondary,
    fontSize: 16,
    fontWeight: "600",
    lineHeight: 24,
    marginBottom: 22,
  },
  targetCard: {
    backgroundColor: colors.cardAlt,
    borderRadius: radius.xxl,
    padding: spacing.cardLarge,
    borderWidth: 1,
    borderColor: colors.borderViolet,
    marginBottom: 18,
  },
  cardLabel: {
    color: colors.textSecondary,
    fontSize: 12,
    fontWeight: "900",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 6,
  },
  goalText: {
    color: colors.textPrimary,
    fontSize: 20,
    fontWeight: "900",
    marginBottom: 16,
  },
  activityText: {
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: "800",
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 20,
  },
  bigMetric: {
    flexDirection: "row",
    alignItems: "flex-end",
    marginBottom: 18,
  },
  bigNumber: {
    color: colors.textPrimary,
    fontSize: 58,
    fontWeight: "900",
  },
  bigUnit: {
    color: colors.textSecondary,
    fontSize: 18,
    fontWeight: "800",
    marginBottom: 10,
    marginLeft: 8,
  },
  targetRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 14,
  },
  targetLabel: {
    color: colors.textSecondary,
    fontSize: 15,
    fontWeight: "700",
  },
  targetValue: {
    color: colors.textPrimary,
    fontSize: 15,
    fontWeight: "900",
  },
  noteCard: {
    backgroundColor: colors.card,
    borderRadius: radius.xl,
    padding: spacing.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderLeftWidth: 5,
    borderLeftColor: colors.secondary,
    marginBottom: 22,
  },
  noteLabel: {
    color: colors.secondary,
    fontSize: 13,
    fontWeight: "900",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 8,
  },
  noteText: {
    color: colors.textPrimary,
    fontSize: 15,
    fontWeight: "600",
    lineHeight: 22,
  },
  startButton: {
    backgroundColor: colors.primary,
    borderRadius: radius.pill,
    paddingVertical: 18,
    alignItems: "center",
  },
  startButtonText: {
    color: colors.textPrimary,
    fontSize: 18,
    fontWeight: "900",
  },
  backText: {
    color: colors.textSecondary,
    textAlign: "center",
    fontSize: 15,
    fontWeight: "800",
    marginTop: 18,
  },
});
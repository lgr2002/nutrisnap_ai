import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { colors, radius, spacing } from "@/src/theme";
import { mockTargets, mockUser } from "@/src/data/mockData";
import {
  loadNutritionTargets,
  loadUserProfile,
  SavedNutritionTargets,
  SavedUserProfile,
} from "@/src/storage/userProfileStorage";
import { CloudMeal, loadTodayCloudMeals } from "@/src/api/mealCloudApi";

type CoachTotals = {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
};

function calculateCloudTotals(meals: CloudMeal[]): CoachTotals {
  return meals.reduce(
    (acc, meal) => ({
      calories: acc.calories + meal.calories,
      protein: acc.protein + meal.protein_g,
      carbs: acc.carbs + meal.carbs_g,
      fat: acc.fat + meal.fat_g,
    }),
    {
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0,
    }
  );
}

function getRemainingCalories(totals: CoachTotals, targets: SavedNutritionTargets) {
  return Math.max(targets.calories - totals.calories, 0);
}

function getCalorieProgressPercent(
  totals: CoachTotals,
  targets: SavedNutritionTargets
) {
  if (targets.calories <= 0) {
    return 0;
  }

  return Math.min((totals.calories / targets.calories) * 100, 100);
}

function buildCoachInsight(
  totals: CoachTotals,
  targets: SavedNutritionTargets,
  mealCount: number
) {
  if (mealCount === 0) {
    return "You have not logged any meals today. Add your first meal so I can give useful guidance.";
  }

  if (totals.calories > targets.calories) {
    return "You are above your calorie target today. Keep the next meal lighter and focus on lean protein or fibre.";
  }

  if (totals.protein < targets.protein * 0.5) {
    return "Protein is still low today. Try adding chicken, eggs, tuna, tofu or Greek yoghurt.";
  }

  if (totals.calories < targets.calories * 0.5) {
    return "You are still well below your calorie target. A balanced meal with protein and carbs would fit well.";
  }

  return "You are tracking well today. Keep logging meals so the coach can stay accurate.";
}

function buildActionItems(
  meals: CloudMeal[],
  totals: CoachTotals,
  targets: SavedNutritionTargets
): string[] {
  const items: string[] = [];

  if (meals.length === 0) {
    return [
      "Log one meal using Scan so the coach can calculate your day properly.",
      "Use a clear photo or short description for better estimates.",
      "Come back after saving a meal to get more specific advice.",
    ];
  }

  if (totals.protein < targets.protein) {
    items.push("Add a protein-focused meal or snack before the day ends.");
  }

  if (totals.calories > targets.calories) {
    items.push("Keep the next meal lighter and avoid extra oil, cheese or sauce.");
  }

  if (totals.carbs > targets.carbs) {
    items.push("Carbs are high today. Choose more protein and vegetables next.");
  }

  if (totals.fat > targets.fat) {
    items.push("Fat is high today. Watch fried food, oil, cheese and creamy sauces.");
  }

  if (items.length === 0) {
    items.push("You are balanced today. Keep your next meal simple and consistent.");
    items.push("Add fruit or fibre if digestion or fullness is an issue.");
  }

  return items.slice(0, 3);
}

function buildMealSuggestion(
  meals: CloudMeal[],
  totals: CoachTotals,
  targets: SavedNutritionTargets
) {
  if (meals.length === 0) {
    return "Start with a normal meal: lean protein, carbs you can measure, and a vegetable or fruit side.";
  }

  if (totals.calories > targets.calories) {
    return "Lean chicken salad, tuna bowl, egg whites, or Greek yoghurt would be safer tonight.";
  }

  if (totals.protein < targets.protein * 0.7) {
    return "Chicken rice with controlled sauce, steak with vegetables, tuna sandwich, or a protein shake.";
  }

  if (totals.fat > targets.fat * 0.85) {
    return "Choose grilled food instead of fried food. Keep sauces light.";
  }

  return "A balanced meal with lean protein, moderate carbs and some fibre fits best.";
}

export default function CoachScreen() {
  const [meals, setMeals] = useState<CloudMeal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [cloudStatusMessage, setCloudStatusMessage] = useState("");

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

  const loadCoachData = async () => {
    setIsLoading(true);

    const savedProfile = await loadUserProfile();
    const savedTargets = await loadNutritionTargets();
    const cloudMealsResult = await loadTodayCloudMeals();

    if (savedProfile) {
      setProfile(savedProfile);
    }

    if (savedTargets) {
      setTargets(savedTargets);
    }

    setMeals(cloudMealsResult.meals);
    setCloudStatusMessage(cloudMealsResult.message);
    setIsLoading(false);
  };

  useFocusEffect(
    useCallback(() => {
      loadCoachData();
    }, [])
  );

  const totals = calculateCloudTotals(meals);
  const remainingCalories = getRemainingCalories(totals, targets);
  const calorieProgress = getCalorieProgressPercent(totals, targets);
  const insight = buildCoachInsight(totals, targets, meals.length);
  const actionItems = buildActionItems(meals, totals, targets);
  const mealSuggestion = buildMealSuggestion(meals, totals, targets);

  if (isLoading) {
    return (
      <SafeAreaView style={styles.screen}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator color={colors.primary} size="large" />
          <Text style={styles.loadingText}>Loading coach...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>AI Coach</Text>
            <Text style={styles.subtitle}>
              Guidance based on the meals you logged today.
            </Text>
          </View>
        </View>

        <View style={styles.heroCard}>
          <Text style={styles.heroLabel}>Today&apos;s Coach Summary</Text>
          <Text style={styles.heroText}>{insight}</Text>

          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${calorieProgress}%` }]} />
          </View>

          <View style={styles.heroMetaRow}>
            <Text style={styles.heroMeta}>
              {totals.calories.toLocaleString()} /{" "}
              {targets.calories.toLocaleString()} kcal
            </Text>
            <Text style={styles.heroMeta}>
              {remainingCalories.toLocaleString()} kcal left
            </Text>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Today at a glance</Text>

          <View style={styles.row}>
            <Text style={styles.rowLabel}>Goal</Text>
            <Text style={styles.rowValue}>{profile.goal}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.rowLabel}>Activity</Text>
            <Text style={styles.rowValue}>{profile.activityLevel}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.rowLabel}>Meals logged today</Text>
            <Text style={styles.rowValue}>{meals.length}</Text>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Action plan</Text>

          {actionItems.map((item, index) => (
            <View key={`${item}-${index}`} style={styles.actionItem}>
              <View style={styles.actionNumber}>
                <Text style={styles.actionNumberText}>{index + 1}</Text>
              </View>
              <Text style={styles.actionText}>{item}</Text>
            </View>
          ))}
        </View>

        <View style={styles.suggestionCard}>
          <Text style={styles.suggestionLabel}>Next meal suggestion</Text>
          <Text style={styles.suggestionText}>{mealSuggestion}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Macro check</Text>

          <View style={styles.row}>
            <Text style={styles.rowLabel}>Protein</Text>
            <Text style={styles.rowValue}>
              {totals.protein}g / {targets.protein}g
            </Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.rowLabel}>Carbs</Text>
            <Text style={styles.rowValue}>
              {totals.carbs}g / {targets.carbs}g
            </Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.rowLabel}>Fat</Text>
            <Text style={styles.rowValue}>
              {totals.fat}g / {targets.fat}g
            </Text>
          </View>
        </View>

        <View style={styles.cloudCard}>
          <Text style={styles.cloudLabel}>Cloud Sync</Text>
          <Text style={styles.cloudText}>{cloudStatusMessage}</Text>
        </View>

        <TouchableOpacity style={styles.primaryButton} onPress={loadCoachData}>
          <Text style={styles.primaryButtonText}>Refresh Coach</Text>
        </TouchableOpacity>

        <Text style={styles.disclaimer}>
          Coach advice is general guidance only and nutrition estimates are approximate.
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
  },
  loadingText: {
    color: colors.textPrimary,
    fontSize: 18,
    fontWeight: "800",
    marginTop: 14,
  },
  container: {
    padding: spacing.screen,
    paddingBottom: spacing.bottomSafe,
  },
  header: {
    marginTop: 12,
    marginBottom: 24,
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
  heroCard: {
    backgroundColor: colors.cardAlt,
    borderRadius: radius.xxl,
    padding: spacing.cardLarge,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: colors.borderViolet,
  },
  heroLabel: {
    color: colors.secondary,
    fontSize: 13,
    fontWeight: "900",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 10,
  },
  heroText: {
    color: colors.textPrimary,
    fontSize: 22,
    fontWeight: "900",
    lineHeight: 30,
  },
  progressTrack: {
    height: 12,
    backgroundColor: colors.border,
    borderRadius: radius.pill,
    marginTop: 18,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: colors.primary,
    borderRadius: radius.pill,
  },
  heroMetaRow: {
    marginTop: 14,
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  heroMeta: {
    color: colors.textSecondary,
    fontSize: 13,
    fontWeight: "800",
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
  actionItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    marginTop: 16,
  },
  actionNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  actionNumberText: {
    color: colors.textPrimary,
    fontSize: 13,
    fontWeight: "900",
  },
  actionText: {
    flex: 1,
    color: colors.textPrimary,
    fontSize: 15,
    fontWeight: "700",
    lineHeight: 22,
  },
  suggestionCard: {
    backgroundColor: colors.card,
    borderRadius: radius.xl,
    padding: spacing.card,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: colors.border,
    borderLeftWidth: 5,
    borderLeftColor: colors.secondary,
  },
  suggestionLabel: {
    color: colors.secondary,
    fontSize: 13,
    fontWeight: "900",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 8,
  },
  suggestionText: {
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: "800",
    lineHeight: 24,
  },
  cloudCard: {
    backgroundColor: colors.card,
    borderRadius: radius.xl,
    padding: spacing.card,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cloudLabel: {
    color: colors.secondary,
    fontSize: 13,
    fontWeight: "900",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 8,
  },
  cloudText: {
    color: colors.textSecondary,
    fontSize: 13,
    fontWeight: "700",
    lineHeight: 20,
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
  disclaimer: {
    color: colors.textSecondary,
    textAlign: "center",
    fontSize: 13,
    lineHeight: 19,
    marginTop: 14,
  },
});
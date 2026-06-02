import { useEffect, useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { colors, radius, spacing } from "@/src/theme";
import { mockMeals, mockTargets, mockUser } from "@/src/data/mockData";
import { loadMealsFromStorage, StoredMeal } from "@/src/storage/mealStorage";
import {
  loadNutritionTargets,
  loadUserProfile,
  SavedNutritionTargets,
  SavedUserProfile,
} from "@/src/storage/userProfileStorage";
import {
  calculateDailyTotals,
  getCalorieProgressPercent,
  getCalorieStatusLabel,
  getProteinStatusLabel,
} from "@/src/utils/nutritionSummary";

export default function HistoryScreen() {
  const [meals, setMeals] = useState<StoredMeal[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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

  useEffect(() => {
    const loadHistoryData = async () => {
      const savedMeals = await loadMealsFromStorage();
      const savedProfile = await loadUserProfile();
      const savedTargets = await loadNutritionTargets();

      setMeals(savedMeals || mockMeals);

      if (savedProfile) {
        setProfile(savedProfile);
      }

      if (savedTargets) {
        setTargets(savedTargets);
      }

      setIsLoading(false);
    };

    loadHistoryData();
  }, []);

  const totals = calculateDailyTotals(meals);
  const calorieProgress = getCalorieProgressPercent(totals, targets);
  const calorieStatus = getCalorieStatusLabel(totals, targets);
  const proteinStatus = getProteinStatusLabel(totals, targets);

  const averageCalories =
    meals.length > 0 ? Math.round(totals.calories / Math.max(meals.length, 1)) : 0;

  if (isLoading) {
    return (
      <SafeAreaView style={styles.screen}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading history...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>History</Text>
            <Text style={styles.subtitle}>
              Today&apos;s saved meals and nutrition summary.
            </Text>
          </View>
        </View>

        <View style={styles.summaryCard}>
          <Text style={styles.cardLabel}>Today&apos;s Summary</Text>

          <View style={styles.bigMetric}>
            <Text style={styles.bigNumber}>{totals.calories.toLocaleString()}</Text>
            <Text style={styles.bigUnit}>kcal</Text>
          </View>

          <Text style={styles.summaryMeta}>
            {calorieProgress}% of {targets.calories.toLocaleString()} kcal target
          </Text>

          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${calorieProgress}%` }]} />
          </View>

          <View style={styles.statusRow}>
            <View style={styles.statusPill}>
              <Text style={styles.statusLabel}>Calories</Text>
              <Text style={styles.statusValue}>{calorieStatus}</Text>
            </View>

            <View style={styles.statusPill}>
              <Text style={styles.statusLabel}>Protein</Text>
              <Text style={styles.statusValue}>{proteinStatus}</Text>
            </View>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Macro Summary</Text>

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

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Tracking Stats</Text>

          <View style={styles.row}>
            <Text style={styles.rowLabel}>Goal</Text>
            <Text style={styles.rowValue}>{profile.goal}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.rowLabel}>Meals logged</Text>
            <Text style={styles.rowValue}>{meals.length}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.rowLabel}>Average per meal</Text>
            <Text style={styles.rowValue}>{averageCalories.toLocaleString()} kcal</Text>
          </View>
        </View>

        <View style={styles.mealsHeader}>
          <Text style={styles.sectionTitle}>Meals Logged</Text>
          <Text style={styles.mealCount}>
            {meals.length === 1 ? "1 meal" : `${meals.length} meals`}
          </Text>
        </View>

        {meals.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyTitle}>No meals saved yet.</Text>
            <Text style={styles.emptyText}>
              Add a meal from the Scan tab and it will appear here.
            </Text>
          </View>
        ) : (
          meals.map((meal) => (
            <View key={meal.id} style={styles.mealCard}>
              <View>
                <Text style={styles.mealTime}>{meal.time}</Text>
                <Text style={styles.mealName}>{meal.name}</Text>
                <Text style={styles.mealMeta}>
                  {meal.calories.toLocaleString()} kcal · {meal.protein}g protein ·{" "}
                  {meal.confidence} confidence
                </Text>
              </View>
            </View>
          ))
        )}
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
  summaryCard: {
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
  },
  bigMetric: {
    flexDirection: "row",
    alignItems: "flex-end",
    marginTop: 10,
  },
  bigNumber: {
    color: colors.textPrimary,
    fontSize: 58,
    fontWeight: "900",
  },
  bigUnit: {
    color: colors.textSecondary,
    fontSize: 20,
    fontWeight: "800",
    marginBottom: 10,
    marginLeft: 8,
  },
  summaryMeta: {
    color: colors.textSecondary,
    fontSize: 14,
    fontWeight: "700",
    marginTop: 8,
  },
  progressTrack: {
    height: 12,
    backgroundColor: colors.border,
    borderRadius: radius.pill,
    marginTop: 16,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: colors.primary,
    borderRadius: radius.pill,
  },
  statusRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 18,
  },
  statusPill: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: radius.large,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.border,
  },
  statusLabel: {
    color: colors.textSecondary,
    fontSize: 12,
    fontWeight: "900",
    textTransform: "uppercase",
    marginBottom: 6,
  },
  statusValue: {
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
  mealsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 4,
    marginBottom: 12,
  },
  mealCount: {
    color: colors.textSecondary,
    fontSize: 14,
    fontWeight: "700",
  },
  emptyCard: {
    backgroundColor: colors.card,
    borderRadius: radius.large,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.border,
  },
  emptyTitle: {
    color: colors.textPrimary,
    fontSize: 17,
    fontWeight: "900",
    marginBottom: 6,
  },
  emptyText: {
    color: colors.textSecondary,
    fontSize: 14,
    fontWeight: "600",
    lineHeight: 20,
  },
  mealCard: {
    backgroundColor: colors.card,
    borderRadius: radius.large,
    padding: 18,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 12,
  },
  mealTime: {
    color: colors.secondary,
    fontSize: 13,
    fontWeight: "900",
    marginBottom: 6,
  },
  mealName: {
    color: colors.textPrimary,
    fontSize: 18,
    fontWeight: "900",
    marginBottom: 6,
  },
  mealMeta: {
    color: colors.textSecondary,
    fontSize: 14,
    fontWeight: "600",
    lineHeight: 20,
  },
});
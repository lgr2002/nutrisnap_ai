import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useRef, useState } from "react";
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
import { mockMeals, mockTargets, mockToday, mockUser } from "@/src/data/mockData";
import {
  clearMealsFromStorage,
  loadMealsFromStorage,
  saveMealsToStorage,
  StoredMeal,
} from "@/src/storage/mealStorage";

type Meal = StoredMeal;

export default function HomeScreen() {
  const params = useLocalSearchParams<{
    savedMealId?: string;
    savedMealName?: string;
    savedMealCalories?: string;
    savedMealProtein?: string;
    savedMealCarbs?: string;
    savedMealFat?: string;
    savedMealConfidence?: string;
  }>();

  const [meals, setMeals] = useState<Meal[]>([]);
  const [hasLoadedMeals, setHasLoadedMeals] = useState(false);
  const lastSavedMealId = useRef<string | null>(null);

  useEffect(() => {
    const loadSavedMeals = async () => {
      const savedMeals = await loadMealsFromStorage();

      if (savedMeals) {
        setMeals(savedMeals);
      } else {
        setMeals(mockMeals);
        await saveMealsToStorage(mockMeals);
      }

      setHasLoadedMeals(true);
    };

    loadSavedMeals();
  }, []);

  useEffect(() => {
    const addMealFromParams = async () => {
      if (!hasLoadedMeals) {
        return;
      }

      if (!params.savedMealId || lastSavedMealId.current === params.savedMealId) {
        return;
      }

      const newMeal: Meal = {
        id: params.savedMealId,
        time: "Now",
        name: params.savedMealName || "Saved meal",
        calories: Number(params.savedMealCalories || 0),
        protein: Number(params.savedMealProtein || 0),
        carbs: Number(params.savedMealCarbs || 0),
        fat: Number(params.savedMealFat || 0),
        confidence: params.savedMealConfidence || "Low",
      };

      setMeals((currentMeals) => {
        const alreadyExists = currentMeals.some((meal) => meal.id === newMeal.id);

        if (alreadyExists) {
          return currentMeals;
        }

        const updatedMeals = [newMeal, ...currentMeals];
        saveMealsToStorage(updatedMeals);
        return updatedMeals;
      });

      lastSavedMealId.current = params.savedMealId;
    };

    addMealFromParams();
  }, [
    hasLoadedMeals,
    params.savedMealId,
    params.savedMealName,
    params.savedMealCalories,
    params.savedMealProtein,
    params.savedMealCarbs,
    params.savedMealFat,
    params.savedMealConfidence,
  ]);

  const deleteMeal = (mealId: string) => {
    setMeals((currentMeals) => {
      const updatedMeals = currentMeals.filter((meal) => meal.id !== mealId);
      saveMealsToStorage(updatedMeals);
      return updatedMeals;
    });
  };

  const confirmDeleteMeal = (mealId: string, mealName: string) => {
    if (Platform.OS === "web") {
      deleteMeal(mealId);
      return;
    }

    Alert.alert("Delete meal?", `Remove "${mealName}" from today?`, [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => deleteMeal(mealId),
      },
    ]);
  };

  const resetDemoMeals = async () => {
    setMeals(mockMeals);
    await saveMealsToStorage(mockMeals);
  };

  const clearAllMeals = async () => {
    setMeals([]);
    await clearMealsFromStorage();
    await saveMealsToStorage([]);
  };

  const confirmResetDemoMeals = () => {
    if (Platform.OS === "web") {
      resetDemoMeals();
      return;
    }

    Alert.alert("Reset meals?", "This will restore the demo meal list.", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Reset",
        style: "destructive",
        onPress: resetDemoMeals,
      },
    ]);
  };

  const confirmClearAllMeals = () => {
    if (Platform.OS === "web") {
      clearAllMeals();
      return;
    }

    Alert.alert("Clear all meals?", "This will remove all meals from today.", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Clear",
        style: "destructive",
        onPress: clearAllMeals,
      },
    ]);
  };

  const totalCalories = meals.reduce((sum, meal) => sum + meal.calories, 0);
  const totalProtein = meals.reduce((sum, meal) => sum + meal.protein, 0);
  const totalCarbs = meals.reduce((sum, meal) => sum + meal.carbs, 0);
  const totalFat = meals.reduce((sum, meal) => sum + meal.fat, 0);
  const remainingCalories = Math.max(mockTargets.calories - totalCalories, 0);

  const calorieProgress = `${Math.min(
    Math.round((totalCalories / mockTargets.calories) * 100),
    100
  )}%`;

  const mealCountLabel = meals.length === 1 ? "1 meal" : `${meals.length} meals`;

  if (!hasLoadedMeals) {
    return (
      <SafeAreaView style={styles.screen}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading NutriSnap...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Good evening, {mockUser.name}</Text>
            <Text style={styles.date}>{mockToday.dateLabel}</Text>
          </View>

          <View style={styles.notificationCircle}>
            <Text style={styles.notificationDot}>●</Text>
          </View>
        </View>

        <View style={styles.energyCard}>
          <Text style={styles.label}>Daily Energy</Text>
          <Text style={styles.bigNumber}>{totalCalories.toLocaleString()}</Text>
          <Text style={styles.subText}>kcal eaten</Text>

          <View style={styles.energyRow}>
            <Text style={styles.metaText}>
              Goal: {mockTargets.calories.toLocaleString()} kcal
            </Text>
            <Text style={styles.metaText}>
              Remaining: {remainingCalories.toLocaleString()} kcal
            </Text>
          </View>

          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: calorieProgress }]} />
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Macros</Text>

          <View style={styles.row}>
            <Text style={styles.rowLabel}>Protein</Text>
            <Text style={styles.rowValue}>
              {totalProtein}g / {mockTargets.protein}g
            </Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.rowLabel}>Carbs</Text>
            <Text style={styles.rowValue}>{totalCarbs}g</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.rowLabel}>Fat</Text>
            <Text style={styles.rowValue}>{totalFat}g</Text>
          </View>
        </View>

        <View style={styles.insightCard}>
          <Text style={styles.insightLabel}>AI Insight</Text>
          <Text style={styles.insightText}>
            {totalProtein >= mockTargets.protein
              ? "Protein target is looking strong today. Keep the next meal lighter if calories are high."
              : "Protein is decent today. Add fibre or fruit later to balance the day."}
          </Text>
        </View>

        <View style={styles.mealsHeader}>
          <Text style={styles.sectionTitle}>Meals Today</Text>
          <Text style={styles.mealCount}>{mealCountLabel}</Text>
        </View>

        {meals.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyTitle}>No meals logged today.</Text>
            <Text style={styles.emptyText}>
              Scan your first meal to start tracking.
            </Text>
          </View>
        ) : (
          meals.map((meal) => (
            <View key={meal.id} style={styles.mealCard}>
              <View style={styles.mealTopRow}>
                <View style={styles.mealInfo}>
                  <Text style={styles.mealTime}>{meal.time}</Text>
                  <Text style={styles.mealName}>{meal.name}</Text>
                  <Text style={styles.mealMeta}>
                    {meal.calories.toLocaleString()} kcal · {meal.confidence} confidence
                  </Text>
                </View>

                <TouchableOpacity
                  style={styles.deleteCircle}
                  onPress={() => confirmDeleteMeal(meal.id, meal.name)}
                >
                  <Text style={styles.deleteCircleText}>×</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}

        <TouchableOpacity
          style={styles.scanButton}
          onPress={() => router.push("/scan")}
        >
          <Text style={styles.scanButtonText}>+ Scan Meal</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.resetButton}
          onPress={confirmResetDemoMeals}
        >
          <Text style={styles.resetButtonText}>Reset demo meals</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.clearButton}
          onPress={confirmClearAllMeals}
        >
          <Text style={styles.clearButtonText}>Clear all meals</Text>
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
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  greeting: {
    color: colors.textPrimary,
    fontSize: 24,
    fontWeight: "800",
  },
  date: {
    color: colors.textSecondary,
    fontSize: 14,
    marginTop: 6,
  },
  notificationCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: colors.card,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: colors.border,
  },
  notificationDot: {
    color: colors.secondary,
    fontSize: 18,
  },
  energyCard: {
    backgroundColor: colors.cardAlt,
    borderRadius: radius.xxl,
    padding: spacing.cardLarge,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: colors.borderViolet,
  },
  label: {
    color: colors.textSecondary,
    fontSize: 13,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  bigNumber: {
    color: colors.textPrimary,
    fontSize: 62,
    fontWeight: "900",
    marginTop: 10,
  },
  subText: {
    color: colors.textSecondary,
    fontSize: 18,
    fontWeight: "600",
  },
  energyRow: {
    marginTop: 22,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  metaText: {
    color: colors.textSoft,
    fontSize: 13,
    fontWeight: "600",
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
    fontWeight: "800",
  },
  row: {
    marginTop: 16,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  rowLabel: {
    color: colors.textSecondary,
    fontSize: 16,
    fontWeight: "600",
  },
  rowValue: {
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: "800",
  },
  insightCard: {
    backgroundColor: colors.card,
    borderRadius: radius.xl,
    padding: spacing.card,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: colors.border,
    borderLeftWidth: 5,
    borderLeftColor: colors.secondary,
  },
  insightLabel: {
    color: colors.secondary,
    fontSize: 13,
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 8,
  },
  insightText: {
    color: colors.textPrimary,
    fontSize: 16,
    lineHeight: 23,
    fontWeight: "600",
  },
  mealsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  mealCount: {
    color: colors.textSecondary,
    fontSize: 14,
    fontWeight: "600",
  },
  emptyCard: {
    backgroundColor: colors.card,
    borderRadius: radius.large,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 12,
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
  mealTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 12,
  },
  mealInfo: {
    flex: 1,
  },
  mealTime: {
    color: colors.secondary,
    fontSize: 13,
    fontWeight: "800",
    marginBottom: 6,
  },
  mealName: {
    color: colors.textPrimary,
    fontSize: 18,
    fontWeight: "800",
    marginBottom: 6,
  },
  mealMeta: {
    color: colors.textSecondary,
    fontSize: 14,
    fontWeight: "600",
  },
  deleteCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "rgba(255, 107, 107, 0.14)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: colors.danger,
  },
  deleteCircleText: {
    color: colors.danger,
    fontSize: 22,
    fontWeight: "900",
    marginTop: -2,
  },
  scanButton: {
    backgroundColor: colors.primary,
    borderRadius: radius.pill,
    paddingVertical: 18,
    alignItems: "center",
    marginTop: 12,
    marginBottom: 12,
  },
  scanButtonText: {
    color: colors.textPrimary,
    fontSize: 18,
    fontWeight: "900",
  },
  resetButton: {
    backgroundColor: colors.card,
    borderRadius: radius.pill,
    paddingVertical: 15,
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 10,
  },
  resetButtonText: {
    color: colors.textSecondary,
    fontSize: 15,
    fontWeight: "800",
  },
  clearButton: {
    backgroundColor: "rgba(255, 107, 107, 0.1)",
    borderRadius: radius.pill,
    paddingVertical: 15,
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.danger,
  },
  clearButtonText: {
    color: colors.danger,
    fontSize: 15,
    fontWeight: "900",
  },
});
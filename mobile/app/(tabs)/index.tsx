import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Platform,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { colors, radius, spacing } from "@/src/theme";
import { mockTargets, mockUser } from "@/src/data/mockData";
import { CloudMeal, deleteCloudMeal, loadTodayCloudMeals } from "@/src/api/mealCloudApi";

type LocalMeal = {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  confidence: string;
  time: string;
  source: "local" | "cloud";
};

function getTodayLabel() {
  return new Date().toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

function formatMealTime(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return date.toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "2-digit",
  });
}

function cloudMealToLocalMeal(meal: CloudMeal): LocalMeal {
  return {
    id: meal.id,
    name: meal.meal_name,
    calories: meal.calories,
    protein: meal.protein_g,
    carbs: meal.carbs_g,
    fat: meal.fat_g,
    confidence: meal.confidence,
    time: formatMealTime(meal.meal_time),
    source: "cloud",
  };
}

export default function HomeScreen() {
  const params = useLocalSearchParams<{
    savedMealId?: string;
    savedMealName?: string;
    savedMealCalories?: string;
    savedMealProtein?: string;
    savedMealCarbs?: string;
    savedMealFat?: string;
    savedMealConfidence?: string;
    cloudSaveStatus?: string;
  }>();

  const [meals, setMeals] = useState<LocalMeal[]>([]);
  const [isLoadingCloudMeals, setIsLoadingCloudMeals] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [cloudStatusMessage, setCloudStatusMessage] = useState("");
  const [handledSavedMealId, setHandledSavedMealId] = useState<string | null>(
    null
  );

  const loadMeals = async (refreshing = false) => {
    if (refreshing) {
      setIsRefreshing(true);
    } else {
      setIsLoadingCloudMeals(true);
    }

    const result = await loadTodayCloudMeals();

    if (result.ok) {
      setMeals(result.meals.map(cloudMealToLocalMeal));
    }

    setCloudStatusMessage(result.message);
    setIsLoadingCloudMeals(false);
    setIsRefreshing(false);
  };

  useFocusEffect(
    useCallback(() => {
      loadMeals();
    }, [])
  );

  useFocusEffect(
    useCallback(() => {
      if (!params.savedMealId || params.savedMealId === handledSavedMealId) {
        return;
      }

      setHandledSavedMealId(params.savedMealId);

      if (params.cloudSaveStatus === "saved") {
        loadMeals();
        return;
      }

      const localMeal: LocalMeal = {
        id: params.savedMealId,
        name: params.savedMealName || "Saved meal",
        calories: Number(params.savedMealCalories || 0),
        protein: Number(params.savedMealProtein || 0),
        carbs: Number(params.savedMealCarbs || 0),
        fat: Number(params.savedMealFat || 0),
        confidence: params.savedMealConfidence || "Medium",
        time: new Date().toLocaleTimeString(undefined, {
          hour: "numeric",
          minute: "2-digit",
        }),
        source: "local",
      };

      setMeals((currentMeals) => {
        const exists = currentMeals.some((meal) => meal.id === localMeal.id);

        if (exists) {
          return currentMeals;
        }

        return [localMeal, ...currentMeals];
      });
    }, [
      params.savedMealId,
      params.savedMealName,
      params.savedMealCalories,
      params.savedMealProtein,
      params.savedMealCarbs,
      params.savedMealFat,
      params.savedMealConfidence,
      params.cloudSaveStatus,
      handledSavedMealId,
    ])
  );

  const totals = useMemo(() => {
    return meals.reduce(
      (acc, meal) => ({
        calories: acc.calories + meal.calories,
        protein: acc.protein + meal.protein,
        carbs: acc.carbs + meal.carbs,
        fat: acc.fat + meal.fat,
      }),
      {
        calories: 0,
        protein: 0,
        carbs: 0,
        fat: 0,
      }
    );
  }, [meals]);

  const caloriesRemaining = Math.max(mockTargets.calories - totals.calories, 0);
  const calorieProgress = Math.min(totals.calories / mockTargets.calories, 1);

  const handleDeleteMeal = async (meal: LocalMeal) => {
    const removeMeal = async () => {
      if (meal.source === "cloud") {
        const result = await deleteCloudMeal(meal.id);

        if (!result.ok && Platform.OS !== "web") {
          Alert.alert("Delete failed", result.message);
          return;
        }
      }

      setMeals((currentMeals) =>
        currentMeals.filter((currentMeal) => currentMeal.id !== meal.id)
      );
    };

    if (Platform.OS === "web") {
      removeMeal();
      return;
    }

    Alert.alert("Delete meal?", `Remove ${meal.name} from today?`, [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Delete",
        style: "destructive",
        onPress: removeMeal,
      },
    ]);
  };

  const resetLocalMeals = () => {
    setMeals([]);
  };

  const aiInsight =
    totals.calories === 0
      ? "Start by scanning or typing your first meal today."
      : totals.protein < mockTargets.protein * 0.5
        ? "Protein is still low today. Add chicken, eggs, Greek yoghurt or tofu later."
        : "You are making progress today. Keep logging meals for better coaching.";

  if (isLoadingCloudMeals) {
    return (
      <SafeAreaView style={styles.screen}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator color={colors.primary} size="large" />
          <Text style={styles.loadingText}>Loading today’s meals...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView
        contentContainerStyle={styles.container}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={() => loadMeals(true)}
            tintColor={colors.primary}
          />
        }
      >
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Good evening, {mockUser.name}</Text>
            <Text style={styles.dateText}>Today · {getTodayLabel()}</Text>
          </View>

          <View style={styles.statusDot} />
        </View>

        <View style={styles.energyCard}>
          <Text style={styles.energyLabel}>Daily Energy</Text>
          <View style={styles.energyRow}>
            <Text style={styles.energyNumber}>
              {totals.calories.toLocaleString()}
            </Text>
            <Text style={styles.energyUnit}>kcal eaten</Text>
          </View>

          <View style={styles.energyMetaRow}>
            <Text style={styles.energyMetaText}>
              Goal: {mockTargets.calories.toLocaleString()} kcal
            </Text>
            <Text style={styles.energyMetaText}>
              Remaining: {caloriesRemaining.toLocaleString()} kcal
            </Text>
          </View>

          <View style={styles.progressTrack}>
            <View
              style={[
                styles.progressFill,
                {
                  width: `${calorieProgress * 100}%`,
                },
              ]}
            />
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Macros</Text>

          <View style={styles.macroRow}>
            <Text style={styles.macroLabel}>Protein</Text>
            <Text style={styles.macroValue}>
              {totals.protein}g / {mockTargets.protein}g
            </Text>
          </View>

          <View style={styles.macroRow}>
            <Text style={styles.macroLabel}>Carbs</Text>
            <Text style={styles.macroValue}>{totals.carbs}g</Text>
          </View>

          <View style={styles.macroRow}>
            <Text style={styles.macroLabel}>Fat</Text>
            <Text style={styles.macroValue}>{totals.fat}g</Text>
          </View>
        </View>

        <View style={styles.insightCard}>
          <Text style={styles.insightLabel}>AI Insight</Text>
          <Text style={styles.insightText}>{aiInsight}</Text>
        </View>

        <View style={styles.cloudCard}>
          <Text style={styles.cloudLabel}>Cloud Sync</Text>
          <Text style={styles.cloudText}>{cloudStatusMessage}</Text>
        </View>

        <View style={styles.mealsHeader}>
          <Text style={styles.sectionTitle}>Meals Today</Text>
          <Text style={styles.mealCount}>{meals.length} meal</Text>
        </View>

        {meals.length === 0 ? (
          <View style={styles.emptyMealCard}>
            <Text style={styles.emptyMealTitle}>No meals logged yet</Text>
            <Text style={styles.emptyMealText}>
              Scan or type your first meal to start tracking today.
            </Text>
          </View>
        ) : (
          meals.map((meal) => (
            <View key={meal.id} style={styles.mealCard}>
              <View style={styles.mealTextWrap}>
                <Text style={styles.mealTime}>
                  {meal.time || "Now"} · {meal.source === "cloud" ? "Cloud" : "Local"}
                </Text>
                <Text style={styles.mealName}>{meal.name}</Text>
                <Text style={styles.mealMeta}>
                  {meal.calories.toLocaleString()} kcal · {meal.confidence} confidence
                </Text>
              </View>

              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => handleDeleteMeal(meal)}
              >
                <Text style={styles.deleteText}>×</Text>
              </TouchableOpacity>
            </View>
          ))
        )}

        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => router.push("/scan")}
        >
          <Text style={styles.primaryButtonText}>+ Scan Meal</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.secondaryButton} onPress={loadMeals}>
          <Text style={styles.secondaryButtonText}>Refresh cloud meals</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.dangerButton} onPress={resetLocalMeals}>
          <Text style={styles.dangerButtonText}>Clear visible meals</Text>
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
  },
  greeting: {
    color: colors.textPrimary,
    fontSize: 22,
    fontWeight: "900",
  },
  dateText: {
    color: colors.textSecondary,
    fontSize: 13,
    fontWeight: "700",
    marginTop: 5,
  },
  statusDot: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: colors.secondary,
    borderWidth: 5,
    borderColor: colors.card,
  },
  energyCard: {
    backgroundColor: colors.cardAlt,
    borderRadius: radius.xxl,
    padding: spacing.cardLarge,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: colors.borderViolet,
  },
  energyLabel: {
    color: colors.textSecondary,
    fontSize: 13,
    fontWeight: "900",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 10,
  },
  energyRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    marginBottom: 18,
  },
  energyNumber: {
    color: colors.textPrimary,
    fontSize: 48,
    fontWeight: "900",
  },
  energyUnit: {
    color: colors.textSecondary,
    fontSize: 14,
    fontWeight: "800",
    marginLeft: 10,
    marginBottom: 9,
  },
  energyMetaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  energyMetaText: {
    color: colors.textSecondary,
    fontSize: 12,
    fontWeight: "800",
  },
  progressTrack: {
    height: 9,
    backgroundColor: colors.border,
    borderRadius: radius.pill,
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
    fontWeight: "900",
  },
  macroRow: {
    marginTop: 16,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  macroLabel: {
    color: colors.textSecondary,
    fontSize: 15,
    fontWeight: "700",
  },
  macroValue: {
    color: colors.textPrimary,
    fontSize: 15,
    fontWeight: "900",
  },
  insightCard: {
    backgroundColor: colors.card,
    borderRadius: radius.xl,
    padding: spacing.card,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: colors.border,
    borderLeftWidth: 5,
    borderLeftColor: colors.secondary,
  },
  insightLabel: {
    color: colors.secondary,
    fontSize: 13,
    fontWeight: "900",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 8,
  },
  insightText: {
    color: colors.textPrimary,
    fontSize: 15,
    fontWeight: "700",
    lineHeight: 22,
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
    fontSize: 14,
    fontWeight: "700",
    lineHeight: 20,
  },
  mealsHeader: {
    marginBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  mealCount: {
    color: colors.textSecondary,
    fontSize: 12,
    fontWeight: "800",
  },
  emptyMealCard: {
    backgroundColor: colors.card,
    borderRadius: radius.xl,
    padding: spacing.card,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: colors.border,
  },
  emptyMealTitle: {
    color: colors.textPrimary,
    fontSize: 18,
    fontWeight: "900",
    marginBottom: 8,
  },
  emptyMealText: {
    color: colors.textSecondary,
    fontSize: 14,
    fontWeight: "600",
    lineHeight: 20,
  },
  mealCard: {
    backgroundColor: colors.card,
    borderRadius: radius.large,
    padding: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: colors.border,
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  mealTextWrap: {
    flex: 1,
  },
  mealTime: {
    color: colors.secondary,
    fontSize: 12,
    fontWeight: "900",
    marginBottom: 6,
  },
  mealName: {
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: "900",
    marginBottom: 4,
  },
  mealMeta: {
    color: colors.textSecondary,
    fontSize: 12,
    fontWeight: "700",
  },
  deleteButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255, 107, 107, 0.14)",
    borderWidth: 1,
    borderColor: colors.danger,
  },
  deleteText: {
    color: colors.danger,
    fontSize: 20,
    fontWeight: "800",
    marginTop: -2,
  },
  primaryButton: {
    backgroundColor: colors.primary,
    borderRadius: radius.pill,
    paddingVertical: 18,
    alignItems: "center",
    marginTop: 8,
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
    color: colors.textSecondary,
    fontSize: 15,
    fontWeight: "900",
  },
  dangerButton: {
    borderRadius: radius.pill,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 12,
    borderWidth: 1,
    borderColor: colors.danger,
  },
  dangerButtonText: {
    color: colors.danger,
    fontSize: 15,
    fontWeight: "900",
  },
});
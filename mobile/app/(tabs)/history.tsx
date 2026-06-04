import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
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
import {
  CloudMeal,
  deleteCloudMeal,
  loadCloudMeals,
} from "@/src/api/mealCloudApi";

function formatMealDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Unknown time";
  }

  return date.toLocaleDateString(undefined, {
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

function groupMealsByDate(meals: CloudMeal[]) {
  return meals.reduce<Record<string, CloudMeal[]>>((groups, meal) => {
    const label = formatMealDate(meal.meal_time);
    const existing = groups[label] || [];

    return {
      ...groups,
      [label]: [...existing, meal],
    };
  }, {});
}

export default function HistoryScreen() {
  const [meals, setMeals] = useState<CloudMeal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");

  const loadMeals = async (refreshing = false) => {
    if (refreshing) {
      setIsRefreshing(true);
    } else {
      setIsLoading(true);
    }

    const result = await loadCloudMeals();

    setMeals(result.meals);
    setStatusMessage(result.message);

    setIsLoading(false);
    setIsRefreshing(false);
  };

  useFocusEffect(
    useCallback(() => {
      loadMeals();
    }, [])
  );

  const handleDeleteMeal = async (meal: CloudMeal) => {
    const deleteMeal = async () => {
      const result = await deleteCloudMeal(meal.id);

      if (!result.ok) {
        if (Platform.OS !== "web") {
          Alert.alert("Delete failed", result.message);
        }
        return;
      }

      setMeals((currentMeals) =>
        currentMeals.filter((currentMeal) => currentMeal.id !== meal.id)
      );
    };

    if (Platform.OS === "web") {
      deleteMeal();
      return;
    }

    Alert.alert("Delete meal?", `Remove ${meal.meal_name} from history?`, [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Delete",
        style: "destructive",
        onPress: deleteMeal,
      },
    ]);
  };

  const groupedMeals = groupMealsByDate(meals);
  const groupLabels = Object.keys(groupedMeals);

  if (isLoading) {
    return (
      <SafeAreaView style={styles.screen}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator color={colors.primary} size="large" />
          <Text style={styles.loadingText}>Loading history...</Text>
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
            <Text style={styles.title}>History</Text>
            <Text style={styles.subtitle}>Your saved meals.</Text>
          </View>
        </View>

        <View style={styles.statusCard}>
          <Text style={styles.statusLabel}>Sync Status</Text>
          <Text style={styles.statusText}>{statusMessage}</Text>
        </View>

        {meals.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyTitle}>No meals yet</Text>
            <Text style={styles.emptyText}>
              Save a meal while signed in and it will appear here.
            </Text>
          </View>
        ) : (
          groupLabels.map((label) => (
            <View key={label} style={styles.daySection}>
              <Text style={styles.dayTitle}>{label}</Text>

              {groupedMeals[label].map((meal) => (
                <View key={meal.id} style={styles.mealCard}>
                  <View style={styles.mealTopRow}>
                    <View style={styles.mealTextWrap}>
                      <Text style={styles.mealTime}>
                        {formatMealTime(meal.meal_time)}
                      </Text>
                      <Text style={styles.mealName}>{meal.meal_name}</Text>
                      <Text style={styles.mealMeta}>
                        {meal.confidence} confidence
                      </Text>
                    </View>

                    <TouchableOpacity
                      style={styles.deleteButton}
                      onPress={() => handleDeleteMeal(meal)}
                    >
                      <Text style={styles.deleteText}>×</Text>
                    </TouchableOpacity>
                  </View>

                  <View style={styles.macroGrid}>
                    <View style={styles.macroBox}>
                      <Text style={styles.macroValue}>{meal.calories}</Text>
                      <Text style={styles.macroLabel}>kcal</Text>
                    </View>

                    <View style={styles.macroBox}>
                      <Text style={styles.macroValue}>{meal.protein_g}g</Text>
                      <Text style={styles.macroLabel}>protein</Text>
                    </View>

                    <View style={styles.macroBox}>
                      <Text style={styles.macroValue}>{meal.carbs_g}g</Text>
                      <Text style={styles.macroLabel}>carbs</Text>
                    </View>

                    <View style={styles.macroBox}>
                      <Text style={styles.macroValue}>{meal.fat_g}g</Text>
                      <Text style={styles.macroLabel}>fat</Text>
                    </View>
                  </View>

                  {meal.notes ? (
                    <Text style={styles.notesText}>{meal.notes}</Text>
                  ) : null}
                </View>
              ))}
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
  container: {
    padding: spacing.screen,
    paddingBottom: spacing.bottomSafe,
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
  header: {
    marginTop: 12,
    marginBottom: 20,
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
  statusCard: {
    backgroundColor: colors.card,
    borderRadius: radius.xl,
    padding: spacing.card,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 18,
  },
  statusLabel: {
    color: colors.secondary,
    fontSize: 13,
    fontWeight: "900",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 8,
  },
  statusText: {
    color: colors.textPrimary,
    fontSize: 15,
    fontWeight: "700",
    lineHeight: 22,
  },
  emptyCard: {
    backgroundColor: colors.cardAlt,
    borderRadius: radius.xxl,
    padding: spacing.cardLarge,
    borderWidth: 1,
    borderColor: colors.borderViolet,
  },
  emptyTitle: {
    color: colors.textPrimary,
    fontSize: 24,
    fontWeight: "900",
    marginBottom: 8,
  },
  emptyText: {
    color: colors.textSecondary,
    fontSize: 15,
    fontWeight: "600",
    lineHeight: 22,
  },
  daySection: {
    marginBottom: 22,
  },
  dayTitle: {
    color: colors.textPrimary,
    fontSize: 20,
    fontWeight: "900",
    marginBottom: 12,
  },
  mealCard: {
    backgroundColor: colors.card,
    borderRadius: radius.xl,
    padding: spacing.card,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 12,
  },
  mealTopRow: {
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
    fontSize: 18,
    fontWeight: "900",
    marginBottom: 5,
  },
  mealMeta: {
    color: colors.textSecondary,
    fontSize: 12,
    fontWeight: "700",
    lineHeight: 18,
  },
  deleteButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255, 107, 107, 0.14)",
    borderWidth: 1,
    borderColor: colors.danger,
  },
  deleteText: {
    color: colors.danger,
    fontSize: 22,
    fontWeight: "800",
    marginTop: -2,
  },
  macroGrid: {
    flexDirection: "row",
    gap: 8,
    marginTop: 16,
  },
  macroBox: {
    flex: 1,
    backgroundColor: colors.background,
    borderRadius: radius.medium,
    paddingVertical: 10,
    paddingHorizontal: 8,
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.border,
  },
  macroValue: {
    color: colors.textPrimary,
    fontSize: 15,
    fontWeight: "900",
    marginBottom: 3,
  },
  macroLabel: {
    color: colors.textMuted,
    fontSize: 10,
    fontWeight: "800",
    textTransform: "uppercase",
  },
  notesText: {
    color: colors.textSecondary,
    fontSize: 13,
    fontWeight: "600",
    lineHeight: 19,
    marginTop: 12,
  },
});

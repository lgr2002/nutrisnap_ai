import { router } from "expo-router";
import React from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { colors, radius, spacing } from "@/src/theme";
import { mockMeals, mockTargets, mockToday, mockUser } from "@/src/data/mockData";
export default function HomeScreen() {
  const firstMeal = mockMeals[0];
  const calorieProgress = `${Math.round(
    (mockToday.caloriesEaten / mockTargets.calories) * 100
  )}%`;

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
          <Text style={styles.bigNumber}>{mockToday.caloriesEaten.toLocaleString()}</Text>
          <Text style={styles.subText}>kcal eaten</Text>

          <View style={styles.energyRow}>
            <Text style={styles.metaText}>
  Goal: {mockTargets.calories.toLocaleString()} kcal
</Text>
<Text style={styles.metaText}>
  Remaining: {mockToday.caloriesRemaining.toLocaleString()} kcal
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
  {mockToday.proteinEaten}g / {mockTargets.protein}g
</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.rowLabel}>Carbs</Text>
           <Text style={styles.rowValue}>{mockToday.carbsEaten}g</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.rowLabel}>Fat</Text>
            <Text style={styles.rowValue}>{mockToday.fatEaten}g</Text>
          </View>
        </View>

        <View style={styles.insightCard}>
          <Text style={styles.insightLabel}>AI Insight</Text>
          <Text style={styles.insightText}>
            Protein is decent today. Add fibre or fruit later to balance the day.
          </Text>
        </View>

        <View style={styles.mealsHeader}>
          <Text style={styles.sectionTitle}>Meals Today</Text>
          <Text style={styles.mealCount}>{mockMeals.length} meal</Text>
        </View>

       <TouchableOpacity style={styles.mealCard}>
  <Text style={styles.mealTime}>{firstMeal.time}</Text>
  <Text style={styles.mealName}>{firstMeal.name}</Text>
  <Text style={styles.mealMeta}>
    {firstMeal.calories.toLocaleString()} kcal · {firstMeal.confidence} confidence
  </Text>
</TouchableOpacity>

        <TouchableOpacity
          style={styles.scanButton}
          onPress={() => router.push("/scan")}
        >
          <Text style={styles.scanButtonText}>+ Scan Meal</Text>
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
    width: "78%",
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
  mealCard: {
    backgroundColor: colors.card,
    borderRadius: radius.large,
    padding: 18,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 24,
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
  scanButton: {
    backgroundColor: colors.primary,
    borderRadius: radius.pill,
    paddingVertical: 18,
    alignItems: "center",
    marginBottom: 28,
  },
  scanButtonText: {
    color: colors.textPrimary,
    fontSize: 18,
    fontWeight: "900",
  },
});
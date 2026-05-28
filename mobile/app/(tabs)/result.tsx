import { router } from "expo-router";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { colors, radius, spacing } from "@/src/theme";
import { mockMealEstimate } from "@/src/data/mockData";

export default function MealResultScreen() {
  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Meal Estimate</Text>
            <Text style={styles.subtitle}>Review before saving.</Text>
          </View>

          <TouchableOpacity
            style={styles.closeCircle}
            onPress={() => router.back()}
          >
            <Text style={styles.closeText}>×</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.resultCard}>
          <Text style={styles.mealName}>{mockMealEstimate.name}</Text>

          <View style={styles.calorieBlock}>
            <Text style={styles.bigNumber}>
              {mockMealEstimate.calories.toLocaleString()}
            </Text>
            <Text style={styles.kcalText}>kcal</Text>
          </View>

          <View style={styles.badgeRow}>
            <View style={styles.rangeBadge}>
              <Text style={styles.badgeText}>
                Range: {mockMealEstimate.calorieRange}
              </Text>
            </View>

            <View style={styles.confidenceBadge}>
              <Text style={styles.confidenceText}>
                {mockMealEstimate.confidence} confidence
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Macros</Text>

          <View style={styles.macroRow}>
            <Text style={styles.macroLabel}>Protein</Text>
            <Text style={styles.macroValue}>{mockMealEstimate.protein} g</Text>
          </View>

          <View style={styles.macroRow}>
            <Text style={styles.macroLabel}>Carbs</Text>
            <Text style={styles.macroValue}>{mockMealEstimate.carbs} g</Text>
          </View>

          <View style={styles.macroRow}>
            <Text style={styles.macroLabel}>Fat</Text>
            <Text style={styles.macroValue}>{mockMealEstimate.fat} g</Text>
          </View>
        </View>

        <View style={styles.explanationCard}>
          <Text style={styles.explanationLabel}>Why this estimate?</Text>
          <Text style={styles.explanationText}>
            {mockMealEstimate.explanation}
          </Text>
        </View>

        <TouchableOpacity style={styles.editButton}>
          <Text style={styles.editButtonText}>Edit Estimate</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.saveButton}
          onPress={() => router.push("/")}
        >
          <Text style={styles.saveButtonText}>Save to Today</Text>
        </TouchableOpacity>

        <Text style={styles.disclaimer}>
          AI estimates are approximate. You can adjust this later.
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
  closeCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: colors.card,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: colors.border,
  },
  closeText: {
    color: colors.textPrimary,
    fontSize: 26,
    marginTop: -2,
  },
  resultCard: {
    backgroundColor: colors.cardAlt,
    borderRadius: radius.xxl,
    padding: spacing.cardLarge,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: colors.borderViolet,
  },
  mealName: {
    color: colors.textPrimary,
    fontSize: 22,
    fontWeight: "900",
    marginBottom: 18,
  },
  calorieBlock: {
    flexDirection: "row",
    alignItems: "flex-end",
    marginBottom: 18,
  },
  bigNumber: {
    color: colors.textPrimary,
    fontSize: 66,
    fontWeight: "900",
  },
  kcalText: {
    color: colors.textSecondary,
    fontSize: 22,
    fontWeight: "800",
    marginBottom: 11,
    marginLeft: 8,
  },
  badgeRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  rangeBadge: {
    backgroundColor: colors.border,
    borderRadius: radius.pill,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  badgeText: {
    color: colors.textPrimary,
    fontSize: 13,
    fontWeight: "800",
  },
  confidenceBadge: {
    backgroundColor: "#2C2415",
    borderRadius: radius.pill,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: colors.warning,
  },
  confidenceText: {
    color: colors.warning,
    fontSize: 13,
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
  macroRow: {
    marginTop: 16,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  macroLabel: {
    color: colors.textSecondary,
    fontSize: 16,
    fontWeight: "700",
  },
  macroValue: {
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: "900",
  },
  explanationCard: {
    backgroundColor: colors.card,
    borderRadius: radius.xl,
    padding: spacing.card,
    marginBottom: 22,
    borderWidth: 1,
    borderColor: colors.border,
    borderLeftWidth: 5,
    borderLeftColor: colors.secondary,
  },
  explanationLabel: {
    color: colors.secondary,
    fontSize: 13,
    fontWeight: "900",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 8,
  },
  explanationText: {
    color: colors.textPrimary,
    fontSize: 15,
    fontWeight: "600",
    lineHeight: 22,
  },
  editButton: {
    backgroundColor: colors.card,
    borderRadius: radius.pill,
    paddingVertical: 17,
    alignItems: "center",
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  editButtonText: {
    color: colors.textPrimary,
    fontSize: 17,
    fontWeight: "900",
  },
  saveButton: {
    backgroundColor: colors.primary,
    borderRadius: radius.pill,
    paddingVertical: 18,
    alignItems: "center",
  },
  saveButtonText: {
    color: colors.textPrimary,
    fontSize: 18,
    fontWeight: "900",
  },
  disclaimer: {
    color: colors.textSecondary,
    textAlign: "center",
    fontSize: 13,
    marginTop: 14,
    lineHeight: 19,
  },
});
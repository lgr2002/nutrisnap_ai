import { router, useLocalSearchParams } from "expo-router";
import {
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { colors, radius, spacing } from "@/src/theme";
import { estimateMealFromDescription } from "@/src/data/estimateMeal";

export default function MealResultScreen() {
  const params = useLocalSearchParams<{
    mealName?: string;
    optionalDetails?: string;
    imageUri?: string;
    editedCalories?: string;
    editedProtein?: string;
    editedCarbs?: string;
    editedFat?: string;
    calorieRange?: string;
    confidence?: string;
    explanation?: string;
  }>();

  const mealName = params.mealName || "Unknown meal";
  const optionalDetails = params.optionalDetails || "";
  const imageUri = params.imageUri || "";
  const combinedDescription = `${mealName} ${optionalDetails}`.trim();

  const aiEstimate = estimateMealFromDescription(combinedDescription);

  const estimate = {
    calories: Number(params.editedCalories || aiEstimate.calories),
    protein: Number(params.editedProtein || aiEstimate.protein),
    carbs: Number(params.editedCarbs || aiEstimate.carbs),
    fat: Number(params.editedFat || aiEstimate.fat),
    calorieRange: params.calorieRange || aiEstimate.calorieRange,
    confidence: params.confidence || aiEstimate.confidence,
    explanation: params.explanation || aiEstimate.explanation,
  };

  const handleEditEstimate = () => {
    router.push({
      pathname: "/edit",
      params: {
        mealName,
        optionalDetails,
        imageUri,
        calories: estimate.calories.toString(),
        protein: estimate.protein.toString(),
        carbs: estimate.carbs.toString(),
        fat: estimate.fat.toString(),
        calorieRange: estimate.calorieRange,
        confidence: estimate.confidence,
        explanation: estimate.explanation,
      },
    });
  };

  const handleSaveMeal = () => {
    router.push({
      pathname: "/",
      params: {
        savedMealId: Date.now().toString(),
        savedMealName: mealName,
        savedMealCalories: estimate.calories.toString(),
        savedMealProtein: estimate.protein.toString(),
        savedMealCarbs: estimate.carbs.toString(),
        savedMealFat: estimate.fat.toString(),
        savedMealConfidence: estimate.confidence,
      },
    });
  };

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

        {imageUri ? (
          <View style={styles.imageCard}>
            <Image source={{ uri: imageUri }} style={styles.foodImage} />
            <View style={styles.photoBadge}>
              <Text style={styles.photoBadgeText}>Photo attached</Text>
            </View>
          </View>
        ) : null}

        <View style={styles.resultCard}>
          <Text style={styles.mealName}>{mealName}</Text>

          {optionalDetails ? (
            <Text style={styles.optionalText}>{optionalDetails}</Text>
          ) : null}

          <View style={styles.calorieBlock}>
            <Text style={styles.bigNumber}>
              {estimate.calories.toLocaleString()}
            </Text>
            <Text style={styles.kcalText}>kcal</Text>
          </View>

          <View style={styles.badgeRow}>
            <View style={styles.rangeBadge}>
              <Text style={styles.badgeText}>Range: {estimate.calorieRange}</Text>
            </View>

            <View style={styles.confidenceBadge}>
              <Text style={styles.confidenceText}>
                {estimate.confidence} confidence
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Macros</Text>

          <View style={styles.macroRow}>
            <Text style={styles.macroLabel}>Protein</Text>
            <Text style={styles.macroValue}>{estimate.protein} g</Text>
          </View>

          <View style={styles.macroRow}>
            <Text style={styles.macroLabel}>Carbs</Text>
            <Text style={styles.macroValue}>{estimate.carbs} g</Text>
          </View>

          <View style={styles.macroRow}>
            <Text style={styles.macroLabel}>Fat</Text>
            <Text style={styles.macroValue}>{estimate.fat} g</Text>
          </View>
        </View>

        <View style={styles.explanationCard}>
          <Text style={styles.explanationLabel}>Why this estimate?</Text>
          <Text style={styles.explanationText}>
            {imageUri
              ? "A photo was attached. For now, the app still uses the text-based placeholder engine. Later, the backend AI will analyse this image directly."
              : estimate.explanation}
          </Text>
        </View>

        <TouchableOpacity style={styles.editButton} onPress={handleEditEstimate}>
          <Text style={styles.editButtonText}>Edit Estimate</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.saveButton} onPress={handleSaveMeal}>
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
  imageCard: {
    height: 230,
    borderRadius: radius.xxl,
    backgroundColor: colors.card,
    marginBottom: 18,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: colors.border,
    position: "relative",
  },
  foodImage: {
    width: "100%",
    height: "100%",
  },
  photoBadge: {
    position: "absolute",
    bottom: 14,
    left: 14,
    backgroundColor: "rgba(0, 0, 0, 0.65)",
    borderRadius: radius.pill,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: colors.secondary,
  },
  photoBadgeText: {
    color: colors.secondary,
    fontSize: 13,
    fontWeight: "900",
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
    marginBottom: 8,
  },
  optionalText: {
    color: colors.textSecondary,
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 14,
    lineHeight: 20,
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
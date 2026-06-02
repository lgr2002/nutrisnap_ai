import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import * as ImageManipulator from "expo-image-manipulator";
import { colors, radius, spacing } from "@/src/theme";
import { estimateMealFromDescription } from "@/src/data/estimateMeal";
import {
  BackendMealEstimateResponse,
  estimateMealWithBackend,
} from "@/src/api/mealApi";

type ResultEstimate = {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  calorieRange: string;
  confidence: string;
  explanation: string;
  source: string;
  modeLabel: string;
  modeDescription: string;
};

function formatEstimateSource(source?: string) {
  if (!source) {
    return "Backend";
  }

  if (source.startsWith("openai_vision:")) {
    const modelName = source.replace("openai_vision:", "");
    return `OpenAI Vision · ${modelName}`;
  }

  if (source.startsWith("openai:")) {
    const modelName = source.replace("openai:", "");
    return `OpenAI · ${modelName}`;
  }

  if (source === "rule_fallback") {
    return "Backend fallback";
  }

  return source;
}

function getModeCopy(source: string) {
  if (source.startsWith("OpenAI Vision")) {
    return {
      modeLabel: "Photo AI used",
      modeDescription:
        "The estimate used your meal photo and description. This is more useful for visible portions, drinks, sauces and sides, but costs more API credits.",
    };
  }

  if (source.startsWith("OpenAI")) {
    return {
      modeLabel: "Text AI used",
      modeDescription:
        "The estimate used your written meal description only. This is faster and cheaper than photo AI.",
    };
  }

  if (source === "Backend fallback") {
    return {
      modeLabel: "Fallback estimate used",
      modeDescription:
        "The backend used the local fallback estimator instead of OpenAI. This avoids API cost but is less flexible.",
    };
  }

  if (source === "Local fallback") {
    return {
      modeLabel: "Local fallback used",
      modeDescription:
        "The app could not reach the backend, so it used a local placeholder estimate.",
    };
  }

  return {
    modeLabel: "Estimate generated",
    modeDescription:
      "Review this estimate before saving. AI nutrition estimates are approximate.",
  };
}

function getMimeTypeFromUri() {
  return "image/jpeg";
}

async function imageUriToBase64(imageUri: string) {
  if (!imageUri) {
    return null;
  }

  try {
    const manipulatedImage = await ImageManipulator.manipulateAsync(
      imageUri,
      [{ resize: { width: 900 } }],
      {
        compress: 0.75,
        format: ImageManipulator.SaveFormat.JPEG,
        base64: true,
      }
    );

    return manipulatedImage.base64 || null;
  } catch (error) {
    console.warn("Failed to convert image to base64:", error);
    return null;
  }
}

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
    source?: string;
  }>();

  const mealName = params.mealName || "Unknown meal";
  const optionalDetails = params.optionalDetails || "";
  const imageUri = params.imageUri || "";
  const combinedDescription = `${mealName} ${optionalDetails}`.trim();

  const [estimate, setEstimate] = useState<ResultEstimate | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [backendError, setBackendError] = useState("");

  useEffect(() => {
    const loadEstimate = async () => {
      setIsLoading(true);
      setBackendError("");

      const hasManualEdit =
        params.editedCalories ||
        params.editedProtein ||
        params.editedCarbs ||
        params.editedFat;

      if (hasManualEdit) {
        const source = params.source || "Edited";
        const modeCopy = getModeCopy(source);

        setEstimate({
          calories: Number(params.editedCalories || 0),
          protein: Number(params.editedProtein || 0),
          carbs: Number(params.editedCarbs || 0),
          fat: Number(params.editedFat || 0),
          calorieRange: params.calorieRange || "Edited manually",
          confidence: params.confidence || "Edited",
          explanation:
            params.explanation ||
            "This estimate was manually edited by the user.",
          source,
          ...modeCopy,
        });

        setIsLoading(false);
        return;
      }

      try {
        const imageBase64 = imageUri ? await imageUriToBase64(imageUri) : null;

        const backendEstimate: BackendMealEstimateResponse =
          await estimateMealWithBackend({
            meal_name: mealName,
            optional_details: optionalDetails,
            portion: "Whole meal",
            image_attached: Boolean(imageUri),
            image_base64: imageBase64 || undefined,
            image_mime_type: imageBase64 ? getMimeTypeFromUri() : undefined,
          });

        const formattedSource = formatEstimateSource(backendEstimate.source);
        const modeCopy = getModeCopy(formattedSource);

        setEstimate({
          calories: backendEstimate.calories,
          protein: backendEstimate.protein_g,
          carbs: backendEstimate.carbs_g,
          fat: backendEstimate.fat_g,
          calorieRange: backendEstimate.calorie_range,
          confidence: backendEstimate.confidence,
          explanation: backendEstimate.explanation,
          source: formattedSource,
          ...modeCopy,
        });
      } catch (error) {
        const localEstimate = estimateMealFromDescription(combinedDescription);
        const modeCopy = getModeCopy("Local fallback");

        setBackendError(
          "Backend unavailable. Showing local placeholder estimate."
        );

        setEstimate({
          calories: localEstimate.calories,
          protein: localEstimate.protein,
          carbs: localEstimate.carbs,
          fat: localEstimate.fat,
          calorieRange: localEstimate.calorieRange,
          confidence: localEstimate.confidence,
          explanation: localEstimate.explanation,
          source: "Local fallback",
          ...modeCopy,
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadEstimate();
  }, [
    mealName,
    optionalDetails,
    imageUri,
    combinedDescription,
    params.editedCalories,
    params.editedProtein,
    params.editedCarbs,
    params.editedFat,
    params.calorieRange,
    params.confidence,
    params.explanation,
    params.source,
  ]);

  const handleEditEstimate = () => {
    if (!estimate) {
      return;
    }

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
        source: estimate.source,
      },
    });
  };

  const handleSaveMeal = () => {
    if (!estimate) {
      return;
    }

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

  if (isLoading || !estimate) {
    return (
      <SafeAreaView style={styles.screen}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingTitle}>Analysing your meal...</Text>

          <View style={styles.loadingCard}>
            <Text style={styles.loadingStep}>✓ Reading meal description</Text>
            <Text style={styles.loadingStep}>
              {imageUri ? "✓ Preparing photo for AI" : "✓ Text-only estimate"}
            </Text>
            <Text style={styles.loadingStep}>✓ Checking backend AI</Text>
            <Text style={styles.loadingStep}>✓ Calculating calories and macros</Text>
          </View>

          <Text style={styles.loadingText}>
            {imageUri
              ? "Photo AI can take longer and uses more API credits."
              : "Text estimates are usually faster and cheaper."}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Meal Estimate</Text>
            <Text style={styles.subtitle}>Review before saving.</Text>
          </View>

          <TouchableOpacity style={styles.closeCircle} onPress={() => router.back()}>
            <Text style={styles.closeText}>×</Text>
          </TouchableOpacity>
        </View>

        {backendError ? (
          <View style={styles.errorCard}>
            <Text style={styles.errorText}>{backendError}</Text>
          </View>
        ) : null}

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

          <View style={styles.sourceBadge}>
            <Text style={styles.sourceBadgeText}>
              Estimate source: {estimate.source}
            </Text>
          </View>

          <View style={styles.calorieBlock}>
            <Text style={styles.bigNumber}>
              {estimate.calories.toLocaleString()}
            </Text>
            <Text style={styles.kcalText}>kcal</Text>
          </View>

          <View style={styles.badgeRow}>
            <View style={styles.rangeBadge}>
              <Text style={styles.badgeText}>
                Range: {estimate.calorieRange}
              </Text>
            </View>

            <View style={styles.confidenceBadge}>
              <Text style={styles.confidenceText}>
                {estimate.confidence} confidence
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.aiModeCard}>
          <Text style={styles.aiModeLabel}>{estimate.modeLabel}</Text>
          <Text style={styles.aiModeText}>{estimate.modeDescription}</Text>
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
          <Text style={styles.explanationText}>{estimate.explanation}</Text>
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
  screen: { flex: 1, backgroundColor: colors.background },
  loadingContainer: { flex: 1, justifyContent: "center", padding: spacing.screen },
  loadingTitle: {
    color: colors.textPrimary,
    fontSize: 30,
    fontWeight: "900",
    marginBottom: 18,
  },
  loadingCard: {
    backgroundColor: colors.card,
    borderRadius: radius.xl,
    padding: spacing.card,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 16,
  },
  loadingStep: {
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: "800",
    marginBottom: 12,
  },
  loadingText: {
    color: colors.textSecondary,
    fontSize: 14,
    fontWeight: "600",
    lineHeight: 20,
  },
  container: { padding: spacing.screen, paddingBottom: spacing.bottomSafe },
  header: {
    marginTop: 12,
    marginBottom: 24,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: { color: colors.textPrimary, fontSize: 30, fontWeight: "900" },
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
  closeText: { color: colors.textPrimary, fontSize: 26, marginTop: -2 },
  errorCard: {
    backgroundColor: "rgba(255, 176, 32, 0.12)",
    borderRadius: radius.large,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.warning,
    marginBottom: 16,
  },
  errorText: {
    color: colors.warning,
    fontSize: 14,
    fontWeight: "800",
    lineHeight: 20,
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
  foodImage: { width: "100%", height: "100%" },
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
  sourceBadge: {
    alignSelf: "flex-start",
    backgroundColor: colors.border,
    borderRadius: radius.pill,
    paddingVertical: 7,
    paddingHorizontal: 11,
    marginBottom: 12,
  },
  sourceBadgeText: {
    color: colors.textSecondary,
    fontSize: 12,
    fontWeight: "900",
  },
  calorieBlock: { flexDirection: "row", alignItems: "flex-end", marginBottom: 18 },
  bigNumber: { color: colors.textPrimary, fontSize: 66, fontWeight: "900" },
  kcalText: {
    color: colors.textSecondary,
    fontSize: 22,
    fontWeight: "800",
    marginBottom: 11,
    marginLeft: 8,
  },
  badgeRow: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  rangeBadge: {
    backgroundColor: colors.border,
    borderRadius: radius.pill,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  badgeText: { color: colors.textPrimary, fontSize: 13, fontWeight: "800" },
  confidenceBadge: {
    backgroundColor: "#2C2415",
    borderRadius: radius.pill,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: colors.warning,
  },
  confidenceText: { color: colors.warning, fontSize: 13, fontWeight: "900" },
  aiModeCard: {
    backgroundColor: "rgba(255, 176, 32, 0.1)",
    borderRadius: radius.xl,
    padding: spacing.card,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: colors.warning,
  },
  aiModeLabel: {
    color: colors.warning,
    fontSize: 13,
    fontWeight: "900",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 8,
  },
  aiModeText: {
    color: colors.textPrimary,
    fontSize: 15,
    fontWeight: "700",
    lineHeight: 22,
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
  macroLabel: { color: colors.textSecondary, fontSize: 16, fontWeight: "700" },
  macroValue: { color: colors.textPrimary, fontSize: 16, fontWeight: "900" },
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
  editButtonText: { color: colors.textPrimary, fontSize: 17, fontWeight: "900" },
  saveButton: {
    backgroundColor: colors.primary,
    borderRadius: radius.pill,
    paddingVertical: 18,
    alignItems: "center",
  },
  saveButtonText: { color: colors.textPrimary, fontSize: 18, fontWeight: "900" },
  disclaimer: {
    color: colors.textSecondary,
    textAlign: "center",
    fontSize: 13,
    marginTop: 14,
    lineHeight: 19,
  },
});
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { colors, radius, spacing } from "@/src/theme";

export default function EditEstimateScreen() {
  const params = useLocalSearchParams<{
    mealName?: string;
    optionalDetails?: string;
    calories?: string;
    calorieRange?: string;
    confidence?: string;
    protein?: string;
    carbs?: string;
    fat?: string;
    explanation?: string;
  }>();

  const [mealName, setMealName] = useState(params.mealName || "Unknown meal");
  const [optionalDetails, setOptionalDetails] = useState(
    params.optionalDetails || ""
  );
  const [calories, setCalories] = useState(params.calories || "0");
  const [protein, setProtein] = useState(params.protein || "0");
  const [carbs, setCarbs] = useState(params.carbs || "0");
  const [fat, setFat] = useState(params.fat || "0");

  const handleSaveChanges = () => {
    router.push({
      pathname: "/result",
      params: {
        mealName,
        optionalDetails,
        editedCalories: calories,
        editedProtein: protein,
        editedCarbs: carbs,
        editedFat: fat,
        calorieRange: params.calorieRange || "Edited manually",
        confidence: "Edited",
        explanation:
          "This estimate was manually edited by the user. Later, edits will be saved to improve future AI estimates.",
      },
    });
  };

  return (
    <SafeAreaView style={styles.screen}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView contentContainerStyle={styles.container}>
          <View style={styles.header}>
            <View>
              <Text style={styles.title}>Edit Estimate</Text>
              <Text style={styles.subtitle}>
                Adjust calories and macros before saving.
              </Text>
            </View>

            <TouchableOpacity
              style={styles.closeCircle}
              onPress={() => router.back()}
            >
              <Text style={styles.closeText}>×</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.card}>
            <Text style={styles.label}>Meal name</Text>
            <TextInput
              style={styles.input}
              value={mealName}
              onChangeText={setMealName}
              placeholder="Meal name"
              placeholderTextColor={colors.textMuted}
            />

            <Text style={styles.label}>Optional details</Text>
            <TextInput
              style={styles.textArea}
              value={optionalDetails}
              onChangeText={setOptionalDetails}
              placeholder="Extra sauce, large portion, etc."
              placeholderTextColor={colors.textMuted}
              multiline
            />
          </View>

          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Nutrition</Text>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Calories</Text>
              <TextInput
                style={styles.input}
                value={calories}
                onChangeText={setCalories}
                keyboardType="numeric"
                placeholder="1850"
                placeholderTextColor={colors.textMuted}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Protein</Text>
              <TextInput
                style={styles.input}
                value={protein}
                onChangeText={setProtein}
                keyboardType="numeric"
                placeholder="85"
                placeholderTextColor={colors.textMuted}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Carbs</Text>
              <TextInput
                style={styles.input}
                value={carbs}
                onChangeText={setCarbs}
                keyboardType="numeric"
                placeholder="170"
                placeholderTextColor={colors.textMuted}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Fat</Text>
              <TextInput
                style={styles.input}
                value={fat}
                onChangeText={setFat}
                keyboardType="numeric"
                placeholder="80"
                placeholderTextColor={colors.textMuted}
              />
            </View>
          </View>

          <TouchableOpacity style={styles.saveButton} onPress={handleSaveChanges}>
            <Text style={styles.saveButtonText}>Save Changes</Text>
          </TouchableOpacity>

          <Text style={styles.disclaimer}>
            Manual edits help users keep control when AI estimates are uncertain.
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  keyboardView: {
    flex: 1,
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
    lineHeight: 22,
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
    marginBottom: 14,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    color: colors.textPrimary,
    fontSize: 15,
    fontWeight: "800",
    marginBottom: 10,
    marginTop: 8,
  },
  input: {
    backgroundColor: colors.background,
    color: colors.textPrimary,
    borderRadius: radius.medium,
    padding: 16,
    fontSize: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  textArea: {
    minHeight: 90,
    backgroundColor: colors.background,
    color: colors.textPrimary,
    borderRadius: radius.medium,
    padding: 16,
    fontSize: 16,
    borderWidth: 1,
    borderColor: colors.border,
    textAlignVertical: "top",
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
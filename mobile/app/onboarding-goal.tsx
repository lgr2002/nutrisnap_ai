import { router } from "expo-router";
import { useState } from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { colors, radius, spacing } from "@/src/theme";

const goals = ["Lose fat", "Maintain weight", "Build muscle", "Body recomposition"];

export default function OnboardingGoalScreen() {
  const [selectedGoal, setSelectedGoal] = useState("Body recomposition");

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.container}>
        <Text style={styles.step}>Step 1 of 4</Text>

        <Text style={styles.title}>What is your main goal?</Text>
        <Text style={styles.subtitle}>
          This helps NutriSnap suggest calories, protein targets and coach advice.
        </Text>

        <View style={styles.options}>
          {goals.map((goal) => {
            const isSelected = selectedGoal === goal;

            return (
              <TouchableOpacity
                key={goal}
                style={[styles.optionCard, isSelected && styles.selectedOption]}
                onPress={() => setSelectedGoal(goal)}
              >
                <Text
                  style={[
                    styles.optionText,
                    isSelected && styles.selectedOptionText,
                  ]}
                >
                  {goal}
                </Text>

                {isSelected ? <Text style={styles.checkMark}>✓</Text> : null}
              </TouchableOpacity>
            );
          })}
        </View>

        <TouchableOpacity
          style={styles.nextButton}
          onPress={() =>
            router.push({
              pathname: "/onboarding-body",
              params: {
                goal: selectedGoal,
              },
            })
          }
        >
          <Text style={styles.nextButtonText}>Next</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
    padding: spacing.screen,
    justifyContent: "center",
  },
  step: {
    color: colors.secondary,
    fontSize: 13,
    fontWeight: "900",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 12,
  },
  title: {
    color: colors.textPrimary,
    fontSize: 32,
    fontWeight: "900",
    lineHeight: 38,
    marginBottom: 10,
  },
  subtitle: {
    color: colors.textSecondary,
    fontSize: 16,
    fontWeight: "600",
    lineHeight: 24,
    marginBottom: 26,
  },
  options: {
    gap: 12,
    marginBottom: 28,
  },
  optionCard: {
    backgroundColor: colors.card,
    borderRadius: radius.xl,
    padding: 18,
    borderWidth: 1,
    borderColor: colors.border,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  selectedOption: {
    backgroundColor: colors.cardAlt,
    borderColor: colors.primary,
  },
  optionText: {
    color: colors.textPrimary,
    fontSize: 17,
    fontWeight: "800",
  },
  selectedOptionText: {
    color: colors.textPrimary,
  },
  checkMark: {
    color: colors.secondary,
    fontSize: 22,
    fontWeight: "900",
  },
  nextButton: {
    backgroundColor: colors.primary,
    borderRadius: radius.pill,
    paddingVertical: 18,
    alignItems: "center",
  },
  nextButtonText: {
    color: colors.textPrimary,
    fontSize: 18,
    fontWeight: "900",
  },
  backText: {
    color: colors.textSecondary,
    textAlign: "center",
    fontSize: 15,
    fontWeight: "800",
    marginTop: 18,
  },
});
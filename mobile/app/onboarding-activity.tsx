import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { colors, radius, spacing } from "@/src/theme";

const activityLevels = [
  "Mostly sitting",
  "Lightly active",
  "Train 3–4 days/week",
  "Very active",
];

export default function OnboardingActivityScreen() {
  const params = useLocalSearchParams<{
    goal?: string;
    age?: string;
    height?: string;
    weight?: string;
    sex?: string;
  }>();

  const [activity, setActivity] = useState("Train 3–4 days/week");

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.container}>
        <Text style={styles.step}>Step 3 of 4</Text>

        <Text style={styles.title}>How active are you?</Text>
        <Text style={styles.subtitle}>
          This helps estimate your daily energy target. Choose the closest
          option for now.
        </Text>

        <View style={styles.options}>
          {activityLevels.map((item) => {
            const isSelected = activity === item;

            return (
              <TouchableOpacity
                key={item}
                style={[styles.optionCard, isSelected && styles.selectedOption]}
                onPress={() => setActivity(item)}
              >
                <Text
                  style={[
                    styles.optionText,
                    isSelected && styles.selectedOptionText,
                  ]}
                >
                  {item}
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
              pathname: "/onboarding-targets",
              params: {
                goal: params.goal || "Body recomposition",
                age: params.age || "22",
                height: params.height || "175",
                weight: params.weight || "72",
                sex: params.sex || "Male",
                activity,
              },
            })
          }
        >
          <Text style={styles.nextButtonText}>Calculate Targets</Text>
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
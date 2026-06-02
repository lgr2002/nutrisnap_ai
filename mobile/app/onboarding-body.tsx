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

export default function OnboardingBodyScreen() {
  const params = useLocalSearchParams<{ goal?: string }>();

  const [age, setAge] = useState("22");
  const [height, setHeight] = useState("175");
  const [weight, setWeight] = useState("72");
  const [sex, setSex] = useState("Male");

  return (
    <SafeAreaView style={styles.screen}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView contentContainerStyle={styles.container}>
          <Text style={styles.step}>Step 2 of 4</Text>

          <Text style={styles.title}>Tell us about you</Text>
          <Text style={styles.subtitle}>
            These details are used to calculate a starting target. You can edit
            them later.
          </Text>

          <View style={styles.card}>
            <Text style={styles.label}>Age</Text>
            <TextInput
              style={styles.input}
              value={age}
              onChangeText={setAge}
              keyboardType="numeric"
              placeholder="22"
              placeholderTextColor={colors.textMuted}
            />

            <Text style={styles.label}>Height</Text>
            <View style={styles.inputWithUnit}>
              <TextInput
                style={styles.unitInput}
                value={height}
                onChangeText={setHeight}
                keyboardType="numeric"
                placeholder="175"
                placeholderTextColor={colors.textMuted}
              />
              <Text style={styles.unitText}>cm</Text>
            </View>

            <Text style={styles.label}>Weight</Text>
            <View style={styles.inputWithUnit}>
              <TextInput
                style={styles.unitInput}
                value={weight}
                onChangeText={setWeight}
                keyboardType="numeric"
                placeholder="72"
                placeholderTextColor={colors.textMuted}
              />
              <Text style={styles.unitText}>kg</Text>
            </View>

            <Text style={styles.label}>Sex</Text>
            <View style={styles.sexRow}>
              {["Male", "Female"].map((item) => {
                const isSelected = sex === item;

                return (
                  <TouchableOpacity
                    key={item}
                    style={[styles.sexButton, isSelected && styles.sexSelected]}
                    onPress={() => setSex(item)}
                  >
                    <Text
                      style={[
                        styles.sexButtonText,
                        isSelected && styles.sexSelectedText,
                      ]}
                    >
                      {item}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          <TouchableOpacity
            style={styles.nextButton}
            onPress={() =>
              router.push({
                pathname: "/onboarding-activity",
                params: {
                  goal: params.goal || "Body recomposition",
                  age,
                  height,
                  weight,
                  sex,
                },
              })
            }
          >
            <Text style={styles.nextButtonText}>Next</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.back()}>
            <Text style={styles.backText}>Back</Text>
          </TouchableOpacity>
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
  step: {
    color: colors.secondary,
    fontSize: 13,
    fontWeight: "900",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginTop: 20,
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
    marginBottom: 24,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: radius.xl,
    padding: spacing.card,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 22,
  },
  label: {
    color: colors.textPrimary,
    fontSize: 15,
    fontWeight: "800",
    marginBottom: 10,
    marginTop: 12,
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
  inputWithUnit: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.background,
    borderRadius: radius.medium,
    borderWidth: 1,
    borderColor: colors.border,
    paddingRight: 16,
  },
  unitInput: {
    flex: 1,
    color: colors.textPrimary,
    padding: 16,
    fontSize: 16,
  },
  unitText: {
    color: colors.textSecondary,
    fontSize: 16,
    fontWeight: "800",
  },
  sexRow: {
    flexDirection: "row",
    gap: 10,
  },
  sexButton: {
    flex: 1,
    backgroundColor: colors.background,
    borderRadius: radius.medium,
    paddingVertical: 15,
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.border,
  },
  sexSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.cardAlt,
  },
  sexButtonText: {
    color: colors.textSecondary,
    fontSize: 15,
    fontWeight: "900",
  },
  sexSelectedText: {
    color: colors.textPrimary,
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
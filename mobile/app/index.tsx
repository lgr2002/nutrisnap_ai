import { Redirect } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { colors, spacing } from "@/src/theme";
import { hasCompletedOnboarding } from "@/src/storage/onboardingStorage";

export default function AppEntryScreen() {
  const [isLoading, setIsLoading] = useState(true);
  const [completedOnboarding, setCompletedOnboarding] = useState(false);

  useEffect(() => {
    const checkOnboarding = async () => {
      const completed = await hasCompletedOnboarding();
      setCompletedOnboarding(completed);
      setIsLoading(false);
    };

    checkOnboarding();
  }, []);

  if (isLoading) {
    return (
      <SafeAreaView style={styles.screen}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator color={colors.primary} size="large" />
          <Text style={styles.loadingText}>Loading NutriSnap AI...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!completedOnboarding) {
    return <Redirect href="/welcome" />;
  }

  return <Redirect href="/(tabs)" />;
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
});

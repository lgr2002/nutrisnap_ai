import React from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Good evening, Leeon</Text>
            <Text style={styles.date}>Today · Wed, 28 May</Text>
          </View>

          <View style={styles.notificationCircle}>
            <Text style={styles.notificationText}>●</Text>
          </View>
        </View>

        <View style={styles.energyCard}>
          <Text style={styles.cardLabel}>Daily Energy</Text>
          <Text style={styles.bigNumber}>1,850</Text>
          <Text style={styles.kcalText}>kcal eaten</Text>

          <View style={styles.energyMetaRow}>
            <Text style={styles.metaText}>Goal: 2,350 kcal</Text>
            <Text style={styles.metaText}>Remaining: 500 kcal</Text>
          </View>

          <View style={styles.progressTrack}>
            <View style={styles.progressFill} />
          </View>
        </View>

        <View style={styles.macroCard}>
          <Text style={styles.sectionTitle}>Macros</Text>

          <View style={styles.macroRow}>
            <Text style={styles.macroLabel}>Protein</Text>
            <Text style={styles.macroValue}>92g / 150g</Text>
          </View>

          <View style={styles.macroRow}>
            <Text style={styles.macroLabel}>Carbs</Text>
            <Text style={styles.macroValue}>170g</Text>
          </View>

          <View style={styles.macroRow}>
            <Text style={styles.macroLabel}>Fat</Text>
            <Text style={styles.macroValue}>80g</Text>
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
          <Text style={styles.mealCount}>1 meal</Text>
        </View>

        <TouchableOpacity style={styles.mealCard}>
          <View>
            <Text style={styles.mealTime}>5:00 PM</Text>
            <Text style={styles.mealName}>Domino’s BBQ Beef Pizza</Text>
            <Text style={styles.mealMeta}>1,850 kcal · Medium confidence</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.scanButton}>
          <Text style={styles.scanButtonText}>+ Scan Meal</Text>
        </TouchableOpacity>

        <View style={styles.bottomNav}>
          <Text style={styles.navActive}>Home</Text>
          <Text style={styles.navItem}>Scan</Text>
          <Text style={styles.navItem}>History</Text>
          <Text style={styles.navItem}>Coach</Text>
          <Text style={styles.navItem}>Profile</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#090A0F",
  },
  container: {
    padding: 22,
    paddingBottom: 40,
  },
  header: {
    marginTop: 18,
    marginBottom: 24,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  greeting: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "800",
  },
  date: {
    color: "#A4A8B6",
    fontSize: 14,
    marginTop: 6,
  },
  notificationCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#151722",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#252836",
  },
  notificationText: {
    color: "#00D4A6",
    fontSize: 16,
  },
  energyCard: {
    backgroundColor: "#17152B",
    borderRadius: 28,
    padding: 24,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: "#2B2850",
  },
  cardLabel: {
    color: "#A4A8B6",
    fontSize: 13,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  bigNumber: {
    color: "#FFFFFF",
    fontSize: 64,
    fontWeight: "900",
    marginTop: 10,
  },
  kcalText: {
    color: "#A4A8B6",
    fontSize: 18,
    fontWeight: "600",
    marginTop: -4,
  },
  energyMetaRow: {
    marginTop: 22,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  metaText: {
    color: "#C8CAD3",
    fontSize: 13,
    fontWeight: "600",
  },
  progressTrack: {
    height: 12,
    backgroundColor: "#252836",
    borderRadius: 999,
    marginTop: 16,
    overflow: "hidden",
  },
  progressFill: {
    width: "78%",
    height: "100%",
    backgroundColor: "#7C5CFF",
    borderRadius: 999,
  },
  macroCard: {
    backgroundColor: "#151722",
    borderRadius: 24,
    padding: 20,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: "#252836",
  },
  sectionTitle: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "800",
  },
  macroRow: {
    marginTop: 16,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  macroLabel: {
    color: "#A4A8B6",
    fontSize: 16,
    fontWeight: "600",
  },
  macroValue: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "800",
  },
  insightCard: {
    backgroundColor: "#151722",
    borderRadius: 24,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "#252836",
    borderLeftWidth: 5,
    borderLeftColor: "#00D4A6",
  },
  insightLabel: {
    color: "#00D4A6",
    fontSize: 13,
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 8,
  },
  insightText: {
    color: "#FFFFFF",
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
    color: "#A4A8B6",
    fontSize: 14,
    fontWeight: "600",
  },
  mealCard: {
    backgroundColor: "#151722",
    borderRadius: 22,
    padding: 18,
    borderWidth: 1,
    borderColor: "#252836",
    marginBottom: 24,
  },
  mealTime: {
    color: "#00D4A6",
    fontSize: 13,
    fontWeight: "800",
    marginBottom: 6,
  },
  mealName: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "800",
    marginBottom: 6,
  },
  mealMeta: {
    color: "#A4A8B6",
    fontSize: 14,
    fontWeight: "600",
  },
  scanButton: {
    backgroundColor: "#7C5CFF",
    borderRadius: 999,
    paddingVertical: 18,
    alignItems: "center",
    marginBottom: 28,
  },
  scanButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "900",
  },
  bottomNav: {
    backgroundColor: "#151722",
    borderRadius: 24,
    paddingVertical: 16,
    paddingHorizontal: 14,
    flexDirection: "row",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "#252836",
  },
  navActive: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "900",
  },
  navItem: {
    color: "#A4A8B6",
    fontSize: 13,
    fontWeight: "700",
  },
});
import { router } from "expo-router";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

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
          <Text style={styles.mealName}>Thin crust BBQ beef pizza</Text>

          <View style={styles.calorieBlock}>
            <Text style={styles.bigNumber}>1,850</Text>
            <Text style={styles.kcalText}>kcal</Text>
          </View>

          <View style={styles.badgeRow}>
            <View style={styles.rangeBadge}>
              <Text style={styles.badgeText}>Range: 1,600–2,200</Text>
            </View>

            <View style={styles.confidenceBadge}>
              <Text style={styles.confidenceText}>Medium confidence</Text>
            </View>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Macros</Text>

          <View style={styles.macroRow}>
            <Text style={styles.macroLabel}>Protein</Text>
            <Text style={styles.macroValue}>85 g</Text>
          </View>

          <View style={styles.macroRow}>
            <Text style={styles.macroLabel}>Carbs</Text>
            <Text style={styles.macroValue}>170 g</Text>
          </View>

          <View style={styles.macroRow}>
            <Text style={styles.macroLabel}>Fat</Text>
            <Text style={styles.macroValue}>80 g</Text>
          </View>
        </View>

        <View style={styles.explanationCard}>
          <Text style={styles.explanationLabel}>Why this estimate?</Text>
          <Text style={styles.explanationText}>
            Cheese, sausage, beef, BBQ sauce and peri peri sauce increase the
            calorie estimate. Portion size is assumed to be one whole pizza.
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
    backgroundColor: "#090A0F",
  },
  container: {
    padding: 22,
    paddingBottom: 120,
  },
  header: {
    marginTop: 12,
    marginBottom: 24,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    color: "#FFFFFF",
    fontSize: 30,
    fontWeight: "900",
  },
  subtitle: {
    color: "#A4A8B6",
    fontSize: 15,
    marginTop: 6,
    fontWeight: "600",
  },
  closeCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#151722",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#252836",
  },
  closeText: {
    color: "#FFFFFF",
    fontSize: 26,
    marginTop: -2,
  },
  resultCard: {
    backgroundColor: "#17152B",
    borderRadius: 28,
    padding: 24,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: "#2B2850",
  },
  mealName: {
    color: "#FFFFFF",
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
    color: "#FFFFFF",
    fontSize: 66,
    fontWeight: "900",
  },
  kcalText: {
    color: "#A4A8B6",
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
    backgroundColor: "#252836",
    borderRadius: 999,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  badgeText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "800",
  },
  confidenceBadge: {
    backgroundColor: "#2C2415",
    borderRadius: 999,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: "#FFB020",
  },
  confidenceText: {
    color: "#FFB020",
    fontSize: 13,
    fontWeight: "900",
  },
  card: {
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
    fontWeight: "900",
    marginBottom: 6,
  },
  macroRow: {
    marginTop: 16,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  macroLabel: {
    color: "#A4A8B6",
    fontSize: 16,
    fontWeight: "700",
  },
  macroValue: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "900",
  },
  explanationCard: {
    backgroundColor: "#151722",
    borderRadius: 24,
    padding: 20,
    marginBottom: 22,
    borderWidth: 1,
    borderColor: "#252836",
    borderLeftWidth: 5,
    borderLeftColor: "#00D4A6",
  },
  explanationLabel: {
    color: "#00D4A6",
    fontSize: 13,
    fontWeight: "900",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 8,
  },
  explanationText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "600",
    lineHeight: 22,
  },
  editButton: {
    backgroundColor: "#151722",
    borderRadius: 999,
    paddingVertical: 17,
    alignItems: "center",
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#252836",
  },
  editButtonText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "900",
  },
  saveButton: {
    backgroundColor: "#7C5CFF",
    borderRadius: 999,
    paddingVertical: 18,
    alignItems: "center",
  },
  saveButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "900",
  },
  disclaimer: {
    color: "#A4A8B6",
    textAlign: "center",
    fontSize: 13,
    marginTop: 14,
    lineHeight: 19,
  },
});
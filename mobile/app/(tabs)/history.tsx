import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const days = [
  { day: "Mon", date: "26 May", calories: "2,150", protein: "142g" },
  { day: "Tue", date: "27 May", calories: "2,800", protein: "180g" },
  { day: "Wed", date: "28 May", calories: "1,850", protein: "92g" },
  { day: "Thu", date: "29 May", calories: "—", protein: "—" },
  { day: "Fri", date: "30 May", calories: "—", protein: "—" },
];

export default function HistoryScreen() {
  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>History</Text>
          <Text style={styles.subtitle}>Track daily intake and weekly trends.</Text>
        </View>

        <View style={styles.summaryCard}>
          <Text style={styles.label}>This Week Average</Text>
          <Text style={styles.bigNumber}>2,266</Text>
          <Text style={styles.subText}>kcal / day</Text>

          <View style={styles.summaryRow}>
            <View>
              <Text style={styles.smallLabel}>Avg protein</Text>
              <Text style={styles.smallValue}>138g</Text>
            </View>

            <View>
              <Text style={styles.smallLabel}>Logged days</Text>
              <Text style={styles.smallValue}>3 / 7</Text>
            </View>
          </View>
        </View>

        <View style={styles.insightCard}>
          <Text style={styles.insightLabel}>Weekly Insight</Text>
          <Text style={styles.insightText}>
            Your intake is slightly inconsistent. Focus on hitting protein daily
            before worrying about perfect calories.
          </Text>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Daily Logs</Text>
          <Text style={styles.sectionMeta}>May 26–30</Text>
        </View>

        {days.map((item) => (
          <TouchableOpacity key={item.day} style={styles.dayCard}>
            <View>
              <Text style={styles.dayTitle}>{item.day}</Text>
              <Text style={styles.dateText}>{item.date}</Text>
            </View>

            <View style={styles.dayStats}>
              <Text style={styles.calorieText}>{item.calories} kcal</Text>
              <Text style={styles.proteinText}>{item.protein} protein</Text>
            </View>
          </TouchableOpacity>
        ))}

        <TouchableOpacity style={styles.calendarButton}>
          <Text style={styles.calendarButtonText}>View Calendar</Text>
        </TouchableOpacity>
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
  summaryCard: {
    backgroundColor: "#17152B",
    borderRadius: 28,
    padding: 24,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: "#2B2850",
  },
  label: {
    color: "#A4A8B6",
    fontSize: 13,
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  bigNumber: {
    color: "#FFFFFF",
    fontSize: 62,
    fontWeight: "900",
    marginTop: 10,
  },
  subText: {
    color: "#A4A8B6",
    fontSize: 18,
    fontWeight: "700",
  },
  summaryRow: {
    marginTop: 24,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  smallLabel: {
    color: "#A4A8B6",
    fontSize: 13,
    fontWeight: "700",
    marginBottom: 6,
  },
  smallValue: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "900",
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
    fontWeight: "900",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 8,
  },
  insightText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "600",
    lineHeight: 22,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionTitle: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "900",
  },
  sectionMeta: {
    color: "#A4A8B6",
    fontSize: 14,
    fontWeight: "700",
  },
  dayCard: {
    backgroundColor: "#151722",
    borderRadius: 22,
    padding: 18,
    borderWidth: 1,
    borderColor: "#252836",
    marginBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  dayTitle: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "900",
  },
  dateText: {
    color: "#A4A8B6",
    fontSize: 13,
    fontWeight: "700",
    marginTop: 4,
  },
  dayStats: {
    alignItems: "flex-end",
  },
  calorieText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "900",
  },
  proteinText: {
    color: "#A4A8B6",
    fontSize: 13,
    fontWeight: "700",
    marginTop: 4,
  },
  calendarButton: {
    backgroundColor: "#7C5CFF",
    borderRadius: 999,
    paddingVertical: 18,
    alignItems: "center",
    marginTop: 12,
  },
  calendarButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "900",
  },
});
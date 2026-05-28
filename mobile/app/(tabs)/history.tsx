import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { colors, radius, spacing } from "@/src/theme";
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
    backgroundColor: colors.background,
  },
  container: {
    padding: spacing.screen,
    paddingBottom: spacing.bottomSafe,
  },
  header: {
    marginTop: 12,
    marginBottom: 24,
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
  summaryCard: {
    backgroundColor: colors.cardAlt,
    borderRadius: radius.xxl,
    padding: spacing.cardLarge,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: colors.borderViolet,
  },
  label: {
    color: colors.textSecondary,
    fontSize: 13,
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  bigNumber: {
    color: colors.textPrimary,
    fontSize: 62,
    fontWeight: "900",
    marginTop: 10,
  },
  subText: {
    color: colors.textSecondary,
    fontSize: 18,
    fontWeight: "700",
  },
  summaryRow: {
    marginTop: 24,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  smallLabel: {
    color: colors.textSecondary,
    fontSize: 13,
    fontWeight: "700",
    marginBottom: 6,
  },
  smallValue: {
    color: colors.textPrimary,
    fontSize: 20,
    fontWeight: "900",
  },
  insightCard: {
    backgroundColor: colors.card,
    borderRadius: radius.xl,
    padding: spacing.card,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: colors.border,
    borderLeftWidth: 5,
    borderLeftColor: colors.secondary,
  },
  insightLabel: {
    color: colors.secondary,
    fontSize: 13,
    fontWeight: "900",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 8,
  },
  insightText: {
    color: colors.textPrimary,
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
    color: colors.textPrimary,
    fontSize: 20,
    fontWeight: "900",
  },
  sectionMeta: {
    color: colors.textSecondary,
    fontSize: 14,
    fontWeight: "700",
  },
  dayCard: {
    backgroundColor: colors.card,
    borderRadius: radius.large,
    padding: 18,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  dayTitle: {
    color: colors.textPrimary,
    fontSize: 18,
    fontWeight: "900",
  },
  dateText: {
    color: colors.textSecondary,
    fontSize: 13,
    fontWeight: "700",
    marginTop: 4,
  },
  dayStats: {
    alignItems: "flex-end",
  },
  calorieText: {
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: "900",
  },
  proteinText: {
    color: colors.textSecondary,
    fontSize: 13,
    fontWeight: "700",
    marginTop: 4,
  },
  calendarButton: {
    backgroundColor: colors.primary,
    borderRadius: radius.pill,
    paddingVertical: 18,
    alignItems: "center",
    marginTop: 12,
  },
  calendarButtonText: {
    color: colors.textPrimary,
    fontSize: 18,
    fontWeight: "900",
  },
});
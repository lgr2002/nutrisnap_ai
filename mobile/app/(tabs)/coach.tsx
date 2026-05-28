import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { colors, radius, spacing } from "@/src/theme";
import { mockTargets, mockToday, mockUser } from "@/src/data/mockData";

const suggestions = [
  "What should I eat next?",
  "Am I overeating today?",
  "How do I hit protein?",
  "Why am I still hungry?",
];

export default function CoachScreen() {
  const caloriesText = `${mockToday.caloriesEaten.toLocaleString()} / ${mockTargets.calories.toLocaleString()} kcal`;
  const proteinText = `${mockToday.proteinEaten} / ${mockTargets.protein} g`;

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>AI Coach</Text>
          <Text style={styles.subtitle}>
            Ask about your food, goals, training or progress.
          </Text>
        </View>

        <View style={styles.contextCard}>
          <Text style={styles.contextLabel}>Today&apos;s Context</Text>

          <View style={styles.contextRow}>
            <Text style={styles.contextText}>Calories</Text>
            <Text style={styles.contextValue}>{caloriesText}</Text>
          </View>

          <View style={styles.contextRow}>
            <Text style={styles.contextText}>Protein</Text>
            <Text style={styles.contextValue}>{proteinText}</Text>
          </View>

          <View style={styles.contextRow}>
            <Text style={styles.contextText}>Goal</Text>
            <Text style={styles.contextValue}>{mockUser.goal}</Text>
          </View>
        </View>

        <View style={styles.insightCard}>
          <Text style={styles.insightLabel}>Coach Insight</Text>
          <Text style={styles.insightText}>
            You still have room for a protein-heavy meal today. Choose lean
            protein and fibre instead of another high-fat meal.
          </Text>
        </View>

        <Text style={styles.sectionTitle}>Suggested questions</Text>

        <View style={styles.chipWrap}>
          {suggestions.map((item) => (
            <TouchableOpacity key={item} style={styles.chip}>
              <Text style={styles.chipText}>{item}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.chatCard}>
          <View style={styles.userBubble}>
            <Text style={styles.userText}>
              I&apos;m hungry at night. What should I eat?
            </Text>
          </View>

          <View style={styles.aiBubble}>
            <Text style={styles.aiText}>
              Based on today&apos;s log, prioritise protein and fibre. Good
              options: eggs, Greek yoghurt, chicken, tuna, fruit, or a protein
              shake with water or low-fat milk.
            </Text>
          </View>
        </View>

        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            placeholder="Ask your coach..."
            placeholderTextColor={colors.textMuted}
          />

          <TouchableOpacity style={styles.sendButton}>
            <Text style={styles.sendButtonText}>↑</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.disclaimer}>
          Nutrition guidance is general and not medical advice.
        </Text>
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
    lineHeight: 22,
  },
  contextCard: {
    backgroundColor: colors.cardAlt,
    borderRadius: radius.xxl,
    padding: 22,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: colors.borderViolet,
  },
  contextLabel: {
    color: colors.textSecondary,
    fontSize: 13,
    fontWeight: "900",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 14,
  },
  contextRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
    gap: 16,
  },
  contextText: {
    color: colors.textSecondary,
    fontSize: 15,
    fontWeight: "700",
  },
  contextValue: {
    color: colors.textPrimary,
    fontSize: 15,
    fontWeight: "900",
    textAlign: "right",
    flexShrink: 1,
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
  sectionTitle: {
    color: colors.textPrimary,
    fontSize: 20,
    fontWeight: "900",
    marginBottom: 14,
  },
  chipWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 22,
  },
  chip: {
    backgroundColor: colors.card,
    borderRadius: radius.pill,
    paddingVertical: 11,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: colors.border,
  },
  chipText: {
    color: colors.textPrimary,
    fontSize: 14,
    fontWeight: "800",
  },
  chatCard: {
    backgroundColor: colors.card,
    borderRadius: radius.xl,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 16,
  },
  userBubble: {
    alignSelf: "flex-end",
    backgroundColor: colors.primary,
    borderRadius: radius.medium,
    padding: 14,
    maxWidth: "85%",
    marginBottom: 12,
  },
  userText: {
    color: colors.textPrimary,
    fontSize: 15,
    fontWeight: "700",
    lineHeight: 21,
  },
  aiBubble: {
    alignSelf: "flex-start",
    backgroundColor: colors.border,
    borderRadius: radius.medium,
    padding: 14,
    maxWidth: "90%",
  },
  aiText: {
    color: colors.textPrimary,
    fontSize: 15,
    fontWeight: "600",
    lineHeight: 22,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.card,
    borderRadius: radius.pill,
    padding: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  input: {
    flex: 1,
    color: colors.textPrimary,
    fontSize: 16,
    paddingHorizontal: 14,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  sendButtonText: {
    color: colors.textPrimary,
    fontSize: 22,
    fontWeight: "900",
  },
  disclaimer: {
    color: colors.textSecondary,
    textAlign: "center",
    fontSize: 12,
    marginTop: 14,
    lineHeight: 18,
  },
});
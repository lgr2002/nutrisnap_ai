import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const suggestions = [
  "What should I eat next?",
  "Am I overeating today?",
  "How do I hit protein?",
  "Why am I still hungry?",
];

export default function CoachScreen() {
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
            <Text style={styles.contextValue}>1,850 / 2,350 kcal</Text>
          </View>

          <View style={styles.contextRow}>
            <Text style={styles.contextText}>Protein</Text>
            <Text style={styles.contextValue}>92 / 150 g</Text>
          </View>

          <View style={styles.contextRow}>
            <Text style={styles.contextText}>Goal</Text>
            <Text style={styles.contextValue}>Body recomposition</Text>
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
            <Text style={styles.userText}>I’m hungry at night. What should I eat?</Text>
          </View>

          <View style={styles.aiBubble}>
            <Text style={styles.aiText}>
              Based on today&apos;s log, prioritise protein and fibre. Good options:
              eggs, Greek yoghurt, chicken, tuna, fruit, or a protein shake with
              water or low-fat milk.
            </Text>
          </View>
        </View>

        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            placeholder="Ask your coach..."
            placeholderTextColor="#666B7A"
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
    lineHeight: 22,
  },
  contextCard: {
    backgroundColor: "#17152B",
    borderRadius: 28,
    padding: 22,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: "#2B2850",
  },
  contextLabel: {
    color: "#A4A8B6",
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
  },
  contextText: {
    color: "#A4A8B6",
    fontSize: 15,
    fontWeight: "700",
  },
  contextValue: {
    color: "#FFFFFF",
    fontSize: 15,
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
  sectionTitle: {
    color: "#FFFFFF",
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
    backgroundColor: "#151722",
    borderRadius: 999,
    paddingVertical: 11,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: "#252836",
  },
  chipText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "800",
  },
  chatCard: {
    backgroundColor: "#151722",
    borderRadius: 24,
    padding: 16,
    borderWidth: 1,
    borderColor: "#252836",
    marginBottom: 16,
  },
  userBubble: {
    alignSelf: "flex-end",
    backgroundColor: "#7C5CFF",
    borderRadius: 18,
    padding: 14,
    maxWidth: "85%",
    marginBottom: 12,
  },
  userText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
    lineHeight: 21,
  },
  aiBubble: {
    alignSelf: "flex-start",
    backgroundColor: "#252836",
    borderRadius: 18,
    padding: 14,
    maxWidth: "90%",
  },
  aiText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "600",
    lineHeight: 22,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#151722",
    borderRadius: 999,
    padding: 8,
    borderWidth: 1,
    borderColor: "#252836",
  },
  input: {
    flex: 1,
    color: "#FFFFFF",
    fontSize: 16,
    paddingHorizontal: 14,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#7C5CFF",
    alignItems: "center",
    justifyContent: "center",
  },
  sendButtonText: {
    color: "#FFFFFF",
    fontSize: 22,
    fontWeight: "900",
  },
  disclaimer: {
    color: "#A4A8B6",
    textAlign: "center",
    fontSize: 12,
    marginTop: 14,
    lineHeight: 18,
  },
});
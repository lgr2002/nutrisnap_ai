import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function ScanMealScreen() {
  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Add Meal</Text>
            <Text style={styles.subtitle}>Scan or describe what you ate.</Text>
          </View>

          <View style={styles.closeCircle}>
            <Text style={styles.closeText}>×</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.uploadBox}>
          <Text style={styles.cameraIcon}>📷</Text>
          <Text style={styles.uploadTitle}>Take or upload food photo</Text>
          <Text style={styles.uploadSubtitle}>
            Add a clear photo for a better estimate.
          </Text>
        </TouchableOpacity>

        <View style={styles.formSection}>
          <Text style={styles.label}>Quick description</Text>
          <TextInput
            style={styles.textArea}
            placeholder="Example: Thin crust BBQ beef pizza with peri peri sauce"
            placeholderTextColor="#666B7A"
            multiline
          />
        </View>

        <View style={styles.formSection}>
          <Text style={styles.label}>How much did you eat?</Text>

          <TouchableOpacity style={styles.selectBox}>
            <Text style={styles.selectText}>Whole meal</Text>
            <Text style={styles.selectArrow}>⌄</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.formSection}>
          <Text style={styles.label}>Meal time</Text>

          <TouchableOpacity style={styles.selectBox}>
            <Text style={styles.selectText}>Today, 5:00 PM</Text>
            <Text style={styles.selectArrow}>⌄</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.formSection}>
          <Text style={styles.label}>Optional details</Text>
          <TextInput
            style={styles.input}
            placeholder="Extra cheese? Sauce? Oil? Drink?"
            placeholderTextColor="#666B7A"
          />
        </View>

        <TouchableOpacity style={styles.estimateButton}>
          <Text style={styles.estimateButtonText}>Estimate Meal</Text>
        </TouchableOpacity>

        <Text style={styles.disclaimer}>
          AI estimates are approximate. You can edit before saving.
        </Text>

        <View style={styles.tipCard}>
          <Text style={styles.tipLabel}>Accuracy Tip</Text>
          <Text style={styles.tipText}>
            Photo + short description gives better results than photo only.
          </Text>
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
  uploadBox: {
    height: 210,
    borderRadius: 28,
    borderWidth: 1.5,
    borderStyle: "dashed",
    borderColor: "#7C5CFF",
    backgroundColor: "#151722",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
    marginBottom: 24,
  },
  cameraIcon: {
    fontSize: 42,
    marginBottom: 14,
  },
  uploadTitle: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "900",
    textAlign: "center",
  },
  uploadSubtitle: {
    color: "#A4A8B6",
    fontSize: 14,
    marginTop: 8,
    textAlign: "center",
    lineHeight: 20,
  },
  formSection: {
    marginBottom: 18,
  },
  label: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "800",
    marginBottom: 10,
  },
  textArea: {
    minHeight: 110,
    backgroundColor: "#151722",
    color: "#FFFFFF",
    borderRadius: 22,
    padding: 18,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#252836",
    textAlignVertical: "top",
  },
  input: {
    backgroundColor: "#151722",
    color: "#FFFFFF",
    borderRadius: 18,
    padding: 16,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#252836",
  },
  selectBox: {
    backgroundColor: "#151722",
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: "#252836",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  selectText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
  selectArrow: {
    color: "#A4A8B6",
    fontSize: 22,
  },
  estimateButton: {
    backgroundColor: "#7C5CFF",
    borderRadius: 999,
    paddingVertical: 18,
    alignItems: "center",
    marginTop: 8,
  },
  estimateButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "900",
  },
  disclaimer: {
    color: "#A4A8B6",
    textAlign: "center",
    fontSize: 13,
    marginTop: 14,
    marginBottom: 22,
    lineHeight: 19,
  },
  tipCard: {
    backgroundColor: "#151722",
    borderRadius: 22,
    padding: 18,
    borderWidth: 1,
    borderColor: "#252836",
    borderLeftWidth: 5,
    borderLeftColor: "#00D4A6",
  },
  tipLabel: {
    color: "#00D4A6",
    fontSize: 13,
    fontWeight: "900",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 8,
  },
  tipText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "600",
    lineHeight: 22,
  },
});
import { router } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Image,
  Modal,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { colors, radius, spacing } from "@/src/theme";
import {
  getFreeDailyScanLimit,
  incrementTodayScanCount,
  loadTodayScanCount,
} from "@/src/storage/scanUsageStorage";
import { getPremiumStatus } from "@/src/storage/subscriptionStorage";

type PickerOption = {
  label: string;
  value: string;
  note?: string;
};

const PORTION_OPTIONS: PickerOption[] = [
  { label: "Small portion", value: "small", note: "Light snack or smaller serve" },
  { label: "Medium portion", value: "medium", note: "Average serving size" },
  { label: "Large portion", value: "large", note: "Big plate or heavy serve" },
  { label: "Half meal", value: "half", note: "About half the meal" },
  { label: "Whole meal", value: "whole", note: "You ate all of it" },
  { label: "Not sure", value: "unsure", note: "Let AI estimate roughly" },
];

const MEAL_TIME_OPTIONS: PickerOption[] = [
  { label: "Now", value: "now", note: "Just ate it" },
  { label: "Breakfast", value: "breakfast", note: "Morning meal" },
  { label: "Lunch", value: "lunch", note: "Midday meal" },
  { label: "Dinner", value: "dinner", note: "Evening meal" },
  { label: "Snack", value: "snack", note: "Small meal or snack" },
];

type SelectorState = "none" | "portion" | "mealTime";

function showMessage(title: string, message: string) {
  if (Platform.OS === "web") {
    alert(`${title}\n\n${message}`);
    return;
  }

  Alert.alert(title, message);
}

export default function ScanMealScreen() {
  const [description, setDescription] = useState("");
  const [optionalDetails, setOptionalDetails] = useState("");
  const [imageUri, setImageUri] = useState<string | null>(null);

  const [portion, setPortion] = useState("whole");
  const [mealTime, setMealTime] = useState("now");

  const [isPremium, setIsPremium] = useState(false);
  const [scanCount, setScanCount] = useState(0);
  const [isLoadingUsage, setIsLoadingUsage] = useState(true);

  const [selectorState, setSelectorState] = useState<SelectorState>("none");

  const freeLimit = getFreeDailyScanLimit();
  const scansRemaining = Math.max(freeLimit - scanCount, 0);

  useEffect(() => {
    const loadUsage = async () => {
      const [premiumStatus, todayCount] = await Promise.all([
        getPremiumStatus(),
        loadTodayScanCount(),
      ]);

      setIsPremium(premiumStatus);
      setScanCount(todayCount);
      setIsLoadingUsage(false);
    };

    loadUsage();
  }, []);

  const selectedPortion = useMemo(
    () =>
      PORTION_OPTIONS.find((item) => item.value === portion) ??
      PORTION_OPTIONS[4],
    [portion]
  );

  const selectedMealTime = useMemo(
    () =>
      MEAL_TIME_OPTIONS.find((item) => item.value === mealTime) ??
      MEAL_TIME_OPTIONS[0],
    [mealTime]
  );

  const chooseFromLibrary = async () => {
    try {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permission.granted) {
        showMessage(
          "Permission needed",
          "Please allow photo access for Expo Go in your iPhone settings."
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.85,
      });

      if (!result.canceled && result.assets?.length > 0) {
        setImageUri(result.assets[0].uri);
      }
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Could not open photo library.";

      showMessage("Photo picker error", message);
    }
  };

  const takePhoto = async () => {
    try {
      const permission = await ImagePicker.requestCameraPermissionsAsync();

      if (!permission.granted) {
        showMessage(
          "Permission needed",
          "Please allow camera access for Expo Go in your iPhone settings."
        );
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.85,
      });

      if (!result.canceled && result.assets?.length > 0) {
        setImageUri(result.assets[0].uri);
      }
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Could not open camera.";

      showMessage("Camera error", message);
    }
  };

  const removePhoto = () => {
    setImageUri(null);
  };

  const handleEstimateMeal = async () => {
    const canUseFreeScan = scanCount < freeLimit;

    if (!isPremium && !canUseFreeScan) {
      router.push("/paywall");
      return;
    }

    const mealDescription = description.trim() || "Unknown meal";

    if (!isPremium) {
      const nextCount = await incrementTodayScanCount();
      setScanCount(nextCount);
    }

    router.push({
      pathname: "/result",
      params: {
        mealName: mealDescription,
        optionalDetails: optionalDetails.trim(),
        imageUri: imageUri || "",
        portion: selectedPortion.label,
        mealTimeLabel: selectedMealTime.label,
      },
    });
  };

  const canEstimate = description.trim().length > 0 || !!imageUri;
  const usingPhotoAI = Boolean(imageUri);

  const activePickerOptions =
    selectorState === "portion" ? PORTION_OPTIONS : MEAL_TIME_OPTIONS;

  const activePickerTitle =
    selectorState === "portion" ? "Select portion size" : "Select meal time";

  const handleSelectOption = (value: string) => {
    if (selectorState === "portion") {
      setPortion(value);
    } else if (selectorState === "mealTime") {
      setMealTime(value);
    }

    setSelectorState("none");
  };

  if (isLoadingUsage) {
    return (
      <SafeAreaView style={styles.screen}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading scan limits...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Add Meal</Text>
            <Text style={styles.subtitle}>Scan or describe what you ate.</Text>
          </View>

          <TouchableOpacity style={styles.closeCircle} onPress={() => router.back()}>
            <Text style={styles.closeText}>×</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.limitCard}>
          <View style={styles.limitTextWrap}>
            <Text style={styles.limitLabel}>
              {isPremium ? "Premium active" : "Free plan"}
            </Text>
            <Text style={styles.limitText}>
              {isPremium
                ? "Unlimited AI scans available."
                : `${scansRemaining} of ${freeLimit} free scans remaining today.`}
            </Text>
          </View>

          {!isPremium ? (
            <TouchableOpacity
              style={styles.upgradeMiniButton}
              onPress={() => router.push("/paywall")}
            >
              <Text style={styles.upgradeMiniText}>Upgrade</Text>
            </TouchableOpacity>
          ) : null}
        </View>

        <View style={styles.uploadBox}>
          {imageUri ? (
            <>
              <Image source={{ uri: imageUri }} style={styles.foodImage} />
              <View style={styles.photoBadge}>
                <Text style={styles.photoBadgeText}>Photo attached</Text>
              </View>
            </>
          ) : (
            <>
              <Text style={styles.cameraIcon}>📷</Text>
              <Text style={styles.uploadTitle}>Add a food photo</Text>
              <Text style={styles.uploadSubtitle}>
                Optional, but useful for mixed meals, drinks, sauces and portions.
              </Text>
            </>
          )}
        </View>

        <View style={styles.photoButtonRow}>
          <TouchableOpacity style={styles.photoButton} onPress={takePhoto}>
            <Text style={styles.photoButtonIcon}>📸</Text>
            <Text style={styles.photoButtonText}>Take photo</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.photoButton} onPress={chooseFromLibrary}>
            <Text style={styles.photoButtonIcon}>🖼️</Text>
            <Text style={styles.photoButtonText}>Choose photo</Text>
          </TouchableOpacity>
        </View>

        {imageUri ? (
          <TouchableOpacity style={styles.removePhotoFullButton} onPress={removePhoto}>
            <Text style={styles.removePhotoText}>Remove photo</Text>
          </TouchableOpacity>
        ) : null}

        <View style={styles.aiModeCard}>
          <Text style={styles.aiModeLabel}>
            {usingPhotoAI ? "Photo AI estimate" : "Text AI estimate"}
          </Text>
          <Text style={styles.aiModeText}>
            {usingPhotoAI
              ? "Photo estimates can improve visible portion and item recognition, but may take longer."
              : "Text-only estimates are faster. Add a photo when the meal is hard to describe."}
          </Text>
        </View>

        <View style={styles.formSection}>
          <Text style={styles.label}>Quick description</Text>
          <TextInput
            style={styles.textArea}
            placeholder="Example: Thin crust BBQ beef pizza with peri peri sauce"
            placeholderTextColor={colors.textMuted}
            multiline
            value={description}
            onChangeText={setDescription}
          />
        </View>

        <View style={styles.formSection}>
          <Text style={styles.label}>Portion size</Text>
          <TouchableOpacity
            style={styles.selectBox}
            onPress={() => setSelectorState("portion")}
          >
            <View style={styles.selectTextWrap}>
              <Text style={styles.selectText}>{selectedPortion.label}</Text>
              <Text style={styles.selectHelper}>{selectedPortion.note}</Text>
            </View>
            <Text style={styles.selectArrow}>›</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.formSection}>
          <Text style={styles.label}>When did you eat it?</Text>
          <TouchableOpacity
            style={styles.selectBox}
            onPress={() => setSelectorState("mealTime")}
          >
            <View style={styles.selectTextWrap}>
              <Text style={styles.selectText}>{selectedMealTime.label}</Text>
              <Text style={styles.selectHelper}>{selectedMealTime.note}</Text>
            </View>
            <Text style={styles.selectArrow}>›</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.formSection}>
          <Text style={styles.label}>Optional details</Text>
          <TextInput
            style={styles.input}
            placeholder="Extra cheese? Sauce? Oil? Drink?"
            placeholderTextColor={colors.textMuted}
            value={optionalDetails}
            onChangeText={setOptionalDetails}
          />
        </View>

        <TouchableOpacity
          style={[styles.estimateButton, !canEstimate && styles.disabledButton]}
          onPress={handleEstimateMeal}
          disabled={!canEstimate}
        >
          <Text style={styles.estimateButtonText}>
            {!isPremium && scansRemaining === 0
              ? "Unlock More Scans"
              : usingPhotoAI
                ? "Estimate with Photo AI"
                : "Estimate Meal"}
          </Text>
        </TouchableOpacity>

        <Text style={styles.disclaimer}>
          AI estimates are approximate. You can review everything before saving.
        </Text>

        <View style={styles.tipCard}>
          <Text style={styles.tipLabel}>Accuracy Tip</Text>
          <Text style={styles.tipText}>
            Best result: clear photo + short description + details like sauce, oil,
            drink, or portion size.
          </Text>
        </View>
      </ScrollView>

      <Modal
        visible={selectorState !== "none"}
        transparent
        animationType="fade"
        onRequestClose={() => setSelectorState("none")}
      >
        <View style={styles.modalOverlay}>
          <TouchableOpacity
            style={styles.backdrop}
            activeOpacity={1}
            onPress={() => setSelectorState("none")}
          />
          <View style={styles.sheet}>
            <Text style={styles.sheetTitle}>{activePickerTitle}</Text>

            {activePickerOptions.map((item) => {
              const isActive =
                selectorState === "portion"
                  ? portion === item.value
                  : mealTime === item.value;

              return (
                <TouchableOpacity
                  key={item.value}
                  style={[styles.optionRow, isActive && styles.optionRowActive]}
                  onPress={() => handleSelectOption(item.value)}
                >
                  <View style={{ flex: 1 }}>
                    <Text
                      style={[
                        styles.optionTitle,
                        isActive && styles.optionTitleActive,
                      ]}
                    >
                      {item.label}
                    </Text>

                    {item.note ? (
                      <Text
                        style={[
                          styles.optionNote,
                          isActive && styles.optionNoteActive,
                        ]}
                      >
                        {item.note}
                      </Text>
                    ) : null}
                  </View>

                  {isActive ? <Text style={styles.optionCheck}>✓</Text> : null}
                </TouchableOpacity>
              );
            })}

            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setSelectorState("none")}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
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
  },
  loadingText: {
    color: colors.textPrimary,
    fontSize: 18,
    fontWeight: "800",
  },
  container: {
    padding: spacing.screen,
    paddingBottom: spacing.bottomSafe,
  },
  header: {
    marginTop: 12,
    marginBottom: 18,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
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
  closeCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: colors.card,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: colors.border,
  },
  closeText: {
    color: colors.textPrimary,
    fontSize: 26,
    marginTop: -2,
  },
  limitCard: {
    backgroundColor: colors.card,
    borderRadius: radius.xl,
    padding: 18,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 18,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
  },
  limitTextWrap: {
    flex: 1,
  },
  limitLabel: {
    color: colors.secondary,
    fontSize: 12,
    fontWeight: "900",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 5,
  },
  limitText: {
    color: colors.textPrimary,
    fontSize: 15,
    fontWeight: "800",
    lineHeight: 21,
  },
  upgradeMiniButton: {
    backgroundColor: colors.primary,
    borderRadius: radius.pill,
    paddingVertical: 10,
    paddingHorizontal: 14,
  },
  upgradeMiniText: {
    color: colors.textPrimary,
    fontSize: 13,
    fontWeight: "900",
  },
  uploadBox: {
    height: 230,
    borderRadius: radius.xxl,
    borderWidth: 1.5,
    borderStyle: "dashed",
    borderColor: colors.primary,
    backgroundColor: colors.card,
    alignItems: "center",
    justifyContent: "center",
    padding: spacing.cardLarge,
    marginBottom: 14,
    overflow: "hidden",
    position: "relative",
  },
  foodImage: {
    width: "100%",
    height: "100%",
    borderRadius: radius.xxl,
  },
  photoBadge: {
    position: "absolute",
    bottom: 14,
    left: 14,
    backgroundColor: "rgba(0, 0, 0, 0.65)",
    borderRadius: radius.pill,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: colors.secondary,
  },
  photoBadgeText: {
    color: colors.secondary,
    fontSize: 13,
    fontWeight: "900",
  },
  cameraIcon: {
    fontSize: 42,
    marginBottom: 14,
  },
  uploadTitle: {
    color: colors.textPrimary,
    fontSize: 20,
    fontWeight: "900",
    textAlign: "center",
  },
  uploadSubtitle: {
    color: colors.textSecondary,
    fontSize: 14,
    marginTop: 8,
    textAlign: "center",
    lineHeight: 20,
  },
  photoButtonRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 14,
  },
  photoButton: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: radius.large,
    paddingVertical: 15,
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.border,
  },
  photoButtonIcon: {
    fontSize: 20,
    marginBottom: 5,
  },
  photoButtonText: {
    color: colors.textPrimary,
    fontSize: 14,
    fontWeight: "900",
  },
  removePhotoFullButton: {
    backgroundColor: "rgba(255, 107, 107, 0.1)",
    borderRadius: radius.pill,
    paddingVertical: 13,
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.danger,
    marginBottom: 14,
  },
  removePhotoText: {
    color: colors.danger,
    fontSize: 14,
    fontWeight: "900",
  },
  aiModeCard: {
    backgroundColor: "rgba(255, 176, 32, 0.1)",
    borderRadius: radius.large,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.warning,
    marginBottom: 20,
  },
  aiModeLabel: {
    color: colors.warning,
    fontSize: 13,
    fontWeight: "900",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 8,
  },
  aiModeText: {
    color: colors.textPrimary,
    fontSize: 14,
    fontWeight: "700",
    lineHeight: 21,
  },
  formSection: {
    marginBottom: 18,
  },
  label: {
    color: colors.textPrimary,
    fontSize: 15,
    fontWeight: "800",
    marginBottom: 10,
  },
  textArea: {
    minHeight: 110,
    backgroundColor: colors.card,
    color: colors.textPrimary,
    borderRadius: radius.large,
    padding: 18,
    fontSize: 16,
    borderWidth: 1,
    borderColor: colors.border,
    textAlignVertical: "top",
  },
  input: {
    backgroundColor: colors.card,
    color: colors.textPrimary,
    borderRadius: radius.medium,
    padding: 16,
    fontSize: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  selectBox: {
    backgroundColor: colors.card,
    borderRadius: radius.large,
    paddingHorizontal: 18,
    paddingVertical: 16,
    borderWidth: 1,
    borderColor: colors.border,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  selectTextWrap: {
    flex: 1,
    paddingRight: 10,
  },
  selectText: {
    color: colors.textPrimary,
    fontSize: 18,
    fontWeight: "800",
  },
  selectHelper: {
    color: colors.textSecondary,
    fontSize: 13,
    fontWeight: "600",
    marginTop: 5,
  },
  selectArrow: {
    color: colors.textSecondary,
    fontSize: 28,
    fontWeight: "700",
    marginTop: -2,
  },
  estimateButton: {
    backgroundColor: colors.primary,
    borderRadius: radius.pill,
    paddingVertical: 18,
    alignItems: "center",
    marginTop: 6,
  },
  disabledButton: {
    opacity: 0.5,
  },
  estimateButtonText: {
    color: colors.textPrimary,
    fontSize: 17,
    fontWeight: "900",
  },
  disclaimer: {
    color: colors.textSecondary,
    textAlign: "center",
    fontSize: 13,
    lineHeight: 19,
    marginTop: 14,
  },
  tipCard: {
    backgroundColor: colors.card,
    borderRadius: radius.xl,
    padding: spacing.card,
    borderWidth: 1,
    borderColor: colors.border,
    marginTop: 16,
  },
  tipLabel: {
    color: colors.secondary,
    fontSize: 12,
    fontWeight: "900",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 8,
  },
  tipText: {
    color: colors.textPrimary,
    fontSize: 14,
    fontWeight: "700",
    lineHeight: 21,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.58)",
  },
  sheet: {
    backgroundColor: colors.card,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 20,
    paddingBottom: 30,
    borderWidth: 1,
    borderColor: colors.border,
  },
  sheetTitle: {
    color: colors.textPrimary,
    fontSize: 20,
    fontWeight: "900",
    marginBottom: 16,
  },
  optionRow: {
    backgroundColor: colors.background,
    borderRadius: radius.large,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 16,
    paddingVertical: 16,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  optionRowActive: {
    borderColor: colors.primary,
    backgroundColor: colors.cardAlt,
  },
  optionTitle: {
    color: colors.textPrimary,
    fontSize: 17,
    fontWeight: "800",
  },
  optionTitleActive: {
    color: colors.textPrimary,
  },
  optionNote: {
    color: colors.textSecondary,
    fontSize: 13,
    fontWeight: "600",
    marginTop: 4,
  },
  optionNoteActive: {
    color: colors.textSecondary,
  },
  optionCheck: {
    color: colors.primary,
    fontSize: 20,
    fontWeight: "900",
  },
  cancelButton: {
    backgroundColor: colors.primary,
    borderRadius: radius.pill,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 8,
  },
  cancelButtonText: {
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: "900",
  },
});
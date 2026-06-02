import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActionSheetIOS,
  Alert,
  Image,
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

const PORTION_OPTIONS = [
  "Small portion",
  "Medium portion",
  "Large portion",
  "Half meal",
  "Whole meal",
  "Not sure",
];

const MEAL_TIME_OPTIONS = ["Now", "Breakfast", "Lunch", "Dinner", "Snack"];

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

  const [selectedPortion, setSelectedPortion] = useState("Whole meal");
  const [selectedMealTime, setSelectedMealTime] = useState("Now");

  const [showPortionOptions, setShowPortionOptions] = useState(false);
  const [showMealTimeOptions, setShowMealTimeOptions] = useState(false);

  const [isPremium, setIsPremium] = useState(false);
  const [scanCount, setScanCount] = useState(0);
  const [isLoadingUsage, setIsLoadingUsage] = useState(true);

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

  const chooseFromLibrary = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      showMessage(
        "Permission needed",
        "Photo library permission is needed to upload food photos."
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.85,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  const takePhoto = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();

    if (!permission.granted) {
      showMessage(
        "Permission needed",
        "Camera permission is needed to take food photos."
      );
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.85,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  const handlePhotoPress = () => {
    if (Platform.OS === "ios") {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: ["Cancel", "Take Photo", "Choose from Library", "Remove Photo"],
          cancelButtonIndex: 0,
          destructiveButtonIndex: imageUri ? 3 : undefined,
        },
        (buttonIndex) => {
          if (buttonIndex === 1) {
            takePhoto();
          }

          if (buttonIndex === 2) {
            chooseFromLibrary();
          }

          if (buttonIndex === 3) {
            setImageUri(null);
          }
        }
      );

      return;
    }

    chooseFromLibrary();
  };

  const showPortionPicker = () => {
    if (Platform.OS === "ios") {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: ["Cancel", ...PORTION_OPTIONS],
          cancelButtonIndex: 0,
        },
        (buttonIndex) => {
          if (buttonIndex > 0) {
            setSelectedPortion(PORTION_OPTIONS[buttonIndex - 1]);
          }
        }
      );

      return;
    }

    setShowPortionOptions((current) => !current);
    setShowMealTimeOptions(false);
  };

  const showMealTimePicker = () => {
    if (Platform.OS === "ios") {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: ["Cancel", ...MEAL_TIME_OPTIONS],
          cancelButtonIndex: 0,
        },
        (buttonIndex) => {
          if (buttonIndex > 0) {
            setSelectedMealTime(MEAL_TIME_OPTIONS[buttonIndex - 1]);
          }
        }
      );

      return;
    }

    setShowMealTimeOptions((current) => !current);
    setShowPortionOptions(false);
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
        portion: selectedPortion,
        mealTimeLabel: selectedMealTime,
      },
    });
  };

  const canEstimate = description.trim().length > 0 || !!imageUri;
  const usingPhotoAI = Boolean(imageUri);

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
      <ScrollView contentContainerStyle={styles.container}>
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

        <TouchableOpacity style={styles.uploadBox} onPress={handlePhotoPress}>
          {imageUri ? (
            <Image source={{ uri: imageUri }} style={styles.foodImage} />
          ) : (
            <>
              <Text style={styles.cameraIcon}>📷</Text>
              <Text style={styles.uploadTitle}>Take or upload food photo</Text>
              <Text style={styles.uploadSubtitle}>
                Photo AI can estimate visible portions, sauces, drinks and sides.
              </Text>
            </>
          )}
        </TouchableOpacity>

        {imageUri ? (
          <View style={styles.photoActionRow}>
            <TouchableOpacity style={styles.photoAction} onPress={handlePhotoPress}>
              <Text style={styles.photoActionText}>Change photo</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.removePhotoAction}
              onPress={() => setImageUri(null)}
            >
              <Text style={styles.removePhotoText}>Remove</Text>
            </TouchableOpacity>
          </View>
        ) : null}

        <View style={styles.aiModeCard}>
          <Text style={styles.aiModeLabel}>
            {usingPhotoAI ? "Photo AI estimate" : "Text AI estimate"}
          </Text>
          <Text style={styles.aiModeText}>
            {usingPhotoAI
              ? "Photo estimates use more API credits and may take longer, but they can improve portion and item recognition."
              : "Text-only estimates are faster and cheaper. Add a photo when portion size or food type is hard to describe."}
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
          <Text style={styles.label}>How much did you eat?</Text>

          <TouchableOpacity style={styles.selectBox} onPress={showPortionPicker}>
            <Text style={styles.selectText}>{selectedPortion}</Text>
            <Text style={styles.selectArrow}>⌄</Text>
          </TouchableOpacity>

          {showPortionOptions ? (
            <View style={styles.optionList}>
              {PORTION_OPTIONS.map((option) => (
                <TouchableOpacity
                  key={option}
                  style={[
                    styles.optionItem,
                    selectedPortion === option && styles.selectedOptionItem,
                  ]}
                  onPress={() => {
                    setSelectedPortion(option);
                    setShowPortionOptions(false);
                  }}
                >
                  <Text
                    style={[
                      styles.optionText,
                      selectedPortion === option && styles.selectedOptionText,
                    ]}
                  >
                    {option}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          ) : null}
        </View>

        <View style={styles.formSection}>
          <Text style={styles.label}>Meal time</Text>

          <TouchableOpacity style={styles.selectBox} onPress={showMealTimePicker}>
            <Text style={styles.selectText}>{selectedMealTime}</Text>
            <Text style={styles.selectArrow}>⌄</Text>
          </TouchableOpacity>

          {showMealTimeOptions ? (
            <View style={styles.optionList}>
              {MEAL_TIME_OPTIONS.map((option) => (
                <TouchableOpacity
                  key={option}
                  style={[
                    styles.optionItem,
                    selectedMealTime === option && styles.selectedOptionItem,
                  ]}
                  onPress={() => {
                    setSelectedMealTime(option);
                    setShowMealTimeOptions(false);
                  }}
                >
                  <Text
                    style={[
                      styles.optionText,
                      selectedMealTime === option && styles.selectedOptionText,
                    ]}
                  >
                    {option}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          ) : null}
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
          AI estimates are approximate. You can edit before saving.
        </Text>

        <View style={styles.tipCard}>
          <Text style={styles.tipLabel}>Accuracy Tip</Text>
          <Text style={styles.tipText}>
            Best result: clear photo + short description + important details like
            sauce, oil, drink, or portion size.
          </Text>
        </View>
      </ScrollView>
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
  },
  foodImage: {
    width: "100%",
    height: "100%",
    borderRadius: radius.xxl,
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
  photoActionRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 14,
  },
  photoAction: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: radius.pill,
    paddingVertical: 13,
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.border,
  },
  photoActionText: {
    color: colors.textPrimary,
    fontSize: 14,
    fontWeight: "900",
  },
  removePhotoAction: {
    backgroundColor: "rgba(255, 107, 107, 0.12)",
    borderRadius: radius.pill,
    paddingVertical: 13,
    paddingHorizontal: 18,
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.danger,
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
    borderRadius: radius.medium,
    padding: 18,
    borderWidth: 1,
    borderColor: colors.border,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  selectText: {
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: "700",
  },
  selectArrow: {
    color: colors.textSecondary,
    fontSize: 22,
  },
  optionList: {
    backgroundColor: colors.card,
    borderRadius: radius.large,
    marginTop: 10,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: colors.border,
  },
  optionItem: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  selectedOptionItem: {
    backgroundColor: colors.cardAlt,
  },
  optionText: {
    color: colors.textSecondary,
    fontSize: 15,
    fontWeight: "800",
  },
  selectedOptionText: {
    color: colors.secondary,
  },
  estimateButton: {
    backgroundColor: colors.primary,
    borderRadius: radius.pill,
    paddingVertical: 18,
    alignItems: "center",
    marginTop: 8,
  },
  disabledButton: {
    opacity: 0.55,
  },
  estimateButtonText: {
    color: colors.textPrimary,
    fontSize: 18,
    fontWeight: "900",
  },
  disclaimer: {
    color: colors.textSecondary,
    textAlign: "center",
    fontSize: 13,
    marginTop: 14,
    marginBottom: 22,
    lineHeight: 19,
  },
  tipCard: {
    backgroundColor: colors.card,
    borderRadius: radius.large,
    padding: 18,
    borderWidth: 1,
    borderColor: colors.border,
    borderLeftWidth: 5,
    borderLeftColor: colors.secondary,
  },
  tipLabel: {
    color: colors.secondary,
    fontSize: 13,
    fontWeight: "900",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 8,
  },
  tipText: {
    color: colors.textPrimary,
    fontSize: 15,
    fontWeight: "600",
    lineHeight: 22,
  },
});
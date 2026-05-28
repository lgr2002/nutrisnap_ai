import { router } from "expo-router";
import { useState } from "react";
import {
  ActionSheetIOS,
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

export default function ScanMealScreen() {
  const [description, setDescription] = useState("");
  const [optionalDetails, setOptionalDetails] = useState("");
  const [imageUri, setImageUri] = useState<string | null>(null);

  const chooseFromLibrary = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      alert("Photo library permission is needed to upload food photos.");
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
      alert("Camera permission is needed to take food photos.");
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

  const handleEstimateMeal = () => {
    const mealDescription = description.trim() || "Unknown meal";

    router.push({
      pathname: "/result",
      params: {
        mealName: mealDescription,
        optionalDetails: optionalDetails.trim(),
        imageUri: imageUri || "",
      },
    });
  };

  const canEstimate = description.trim().length > 0 || !!imageUri;

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Add Meal</Text>
            <Text style={styles.subtitle}>Scan or describe what you ate.</Text>
          </View>

          <TouchableOpacity
            style={styles.closeCircle}
            onPress={() => router.back()}
          >
            <Text style={styles.closeText}>×</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.uploadBox} onPress={handlePhotoPress}>
          {imageUri ? (
            <Image source={{ uri: imageUri }} style={styles.foodImage} />
          ) : (
            <>
              <Text style={styles.cameraIcon}>📷</Text>
              <Text style={styles.uploadTitle}>Take or upload food photo</Text>
              <Text style={styles.uploadSubtitle}>
                Add a clear photo for a better estimate.
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
            placeholderTextColor={colors.textMuted}
            value={optionalDetails}
            onChangeText={setOptionalDetails}
          />
        </View>

        <TouchableOpacity
          style={[
            styles.estimateButton,
            !canEstimate && styles.disabledButton,
          ]}
          onPress={handleEstimateMeal}
          disabled={!canEstimate}
        >
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
    backgroundColor: colors.background,
  },
  container: {
    padding: spacing.screen,
    paddingBottom: spacing.bottomSafe,
  },
  header: {
    marginTop: 12,
    marginBottom: 24,
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
    marginBottom: 20,
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
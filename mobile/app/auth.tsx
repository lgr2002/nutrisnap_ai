import { router } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { colors, radius, spacing } from "@/src/theme";
import { supabase } from "@/src/api/supabaseClient";
import { saveAuthEmail } from "@/src/storage/authStorage";

type AuthMode = "sign-in" | "sign-up";

function showMessage(title: string, message: string) {
  if (Platform.OS === "web") {
    alert(`${title}\n\n${message}`);
    return;
  }

  Alert.alert(title, message);
}

export default function AuthScreen() {
  const [mode, setMode] = useState<AuthMode>("sign-in");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");

  const isSignUp = mode === "sign-up";

  const handleAuth = async () => {
    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password.trim();

    if (!cleanEmail || !cleanPassword) {
      showMessage("Missing details", "Please enter both email and password.");
      return;
    }

    if (cleanPassword.length < 6) {
      showMessage("Password too short", "Password must be at least 6 characters.");
      return;
    }

    setIsLoading(true);
    setStatusMessage("");

    try {
      if (isSignUp) {
        const { data, error } = await supabase.auth.signUp({
          email: cleanEmail,
          password: cleanPassword,
        });

        if (error) {
          throw error;
        }

        await saveAuthEmail(cleanEmail);

        if (data.session) {
          router.replace("/profile");
          return;
        }

        setStatusMessage(
          "Account created. Check your email if confirmation is required, then sign in."
        );

        showMessage(
          "Account created",
          "If email confirmation is enabled, check your inbox before signing in."
        );

        setMode("sign-in");
        return;
      }

      const { error } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password: cleanPassword,
      });

      if (error) {
        throw error;
      }

      await saveAuthEmail(cleanEmail);
      router.replace("/profile");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Authentication failed.";
      setStatusMessage(message);
      showMessage("Auth error", message);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMode = () => {
    setMode(isSignUp ? "sign-in" : "sign-up");
    setStatusMessage("");
  };

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.container}>
        <TouchableOpacity style={styles.closeButton} onPress={() => router.back()}>
          <Text style={styles.closeText}>×</Text>
        </TouchableOpacity>

        <Text style={styles.badge}>NutriSnap Account</Text>

        <Text style={styles.title}>{isSignUp ? "Create account" : "Welcome back"}</Text>

        <Text style={styles.subtitle}>
          {isSignUp
            ? "Create an account so your meals and profile can sync to the cloud later."
            : "Sign in to prepare your profile for cloud sync."}
        </Text>

        <View style={styles.card}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="you@example.com"
            placeholderTextColor={colors.textMuted}
            autoCapitalize="none"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
          />

          <Text style={styles.label}>Password</Text>
          <TextInput
            style={styles.input}
            placeholder="Minimum 6 characters"
            placeholderTextColor={colors.textMuted}
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />

          {statusMessage ? (
            <View style={styles.statusBox}>
              <Text style={styles.statusText}>{statusMessage}</Text>
            </View>
          ) : null}

          <TouchableOpacity
            style={[styles.primaryButton, isLoading && styles.disabledButton]}
            onPress={handleAuth}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color={colors.textPrimary} />
            ) : (
              <Text style={styles.primaryButtonText}>
                {isSignUp ? "Create Account" : "Sign In"}
              </Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity style={styles.switchButton} onPress={toggleMode}>
            <Text style={styles.switchText}>
              {isSignUp
                ? "Already have an account? Sign in"
                : "New here? Create account"}
            </Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.note}>
          Sign in to sync meals and profile data across sessions.
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
    padding: spacing.screen,
    justifyContent: "center",
  },
  closeButton: {
    position: "absolute",
    top: 26,
    right: spacing.screen,
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
  badge: {
    color: colors.secondary,
    fontSize: 13,
    fontWeight: "900",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 10,
  },
  title: {
    color: colors.textPrimary,
    fontSize: 36,
    fontWeight: "900",
    marginBottom: 10,
  },
  subtitle: {
    color: colors.textSecondary,
    fontSize: 16,
    fontWeight: "600",
    lineHeight: 24,
    marginBottom: 22,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: radius.xxl,
    padding: spacing.cardLarge,
    borderWidth: 1,
    borderColor: colors.border,
  },
  label: {
    color: colors.textPrimary,
    fontSize: 15,
    fontWeight: "800",
    marginBottom: 10,
  },
  input: {
    backgroundColor: colors.background,
    color: colors.textPrimary,
    borderRadius: radius.medium,
    padding: 16,
    fontSize: 16,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 16,
  },
  statusBox: {
    backgroundColor: "rgba(255, 176, 32, 0.12)",
    borderRadius: radius.large,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.warning,
    marginBottom: 16,
  },
  statusText: {
    color: colors.warning,
    fontSize: 14,
    fontWeight: "800",
    lineHeight: 20,
  },
  primaryButton: {
    backgroundColor: colors.primary,
    borderRadius: radius.pill,
    paddingVertical: 17,
    alignItems: "center",
    marginTop: 4,
  },
  disabledButton: {
    opacity: 0.65,
  },
  primaryButtonText: {
    color: colors.textPrimary,
    fontSize: 17,
    fontWeight: "900",
  },
  switchButton: {
    paddingVertical: 16,
    alignItems: "center",
  },
  switchText: {
    color: colors.secondary,
    fontSize: 15,
    fontWeight: "900",
  },
  note: {
    color: colors.textMuted,
    fontSize: 13,
    textAlign: "center",
    lineHeight: 19,
    marginTop: 18,
  },
});

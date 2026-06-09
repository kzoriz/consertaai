import { Pressable, StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";

import { colors } from "@/theme/colors";

export function BackButton() {
  return (
    <Pressable
      style={styles.button}
      onPress={() => router.back()}
      android_ripple={{ color: "#E5E7EB", borderless: true }}
    >
      <MaterialIcons
        name="arrow-back-ios-new"
        size={24}
        color={colors.primary}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 12,
    marginBottom: 8,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 4,
    shadowOffset: {
      width: 0,
      height: 2,
    },
  },
});
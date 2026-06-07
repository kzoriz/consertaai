import { Pressable, Text, StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { colors } from "../theme/colors";

type Props = {
  title: string;
  icon: keyof typeof MaterialIcons.glyphMap;
  onPress: () => void;
  danger?: boolean;
};

export function MenuButton({ title, icon, onPress, danger }: Props) {
  return (
    <Pressable
      style={[styles.button, danger && styles.danger]}
      onPress={onPress}
    >
      <MaterialIcons
        name={icon}
        size={24}
        color={danger ? colors.danger : colors.primary}
      />
      <Text style={[styles.text, danger && styles.textDanger]}>{title}</Text>
      <MaterialIcons name="chevron-right" size={22} color={colors.muted} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.surface,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 12,
  },
  danger: {
    borderColor: "#F5C2C7",
  },
  text: {
    flex: 1,
    fontSize: 16,
    fontWeight: "600",
    color: colors.text,
  },
  textDanger: {
    color: colors.danger,
  },
});
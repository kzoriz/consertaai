import { Pressable, Text, StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { colors } from "../theme/colors";

type Props = {
  title: string;
  icon: keyof typeof MaterialIcons.glyphMap;
  onPress: () => void;
  highlight?: boolean;
};

export function MenuGridItem({ title, icon, onPress, highlight }: Props) {
  return (
    <Pressable
      style={[styles.card, highlight && styles.highlight]}
      onPress={onPress}
    >
      <MaterialIcons
        name={icon}
        size={34}
        color={highlight ? colors.text : colors.primary}
      />

      <Text style={styles.title}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    width: "47%",
    aspectRatio: 1,
    backgroundColor: colors.surface,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
    gap: 10,
  },
  highlight: {
    backgroundColor: colors.secondary,
    borderColor: colors.secondary,
  },
  title: {
    fontSize: 15,
    fontWeight: "700",
    textAlign: "center",
    color: colors.text,
  },
});
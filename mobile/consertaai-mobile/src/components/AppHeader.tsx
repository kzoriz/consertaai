import { View, Text, StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { colors } from "../theme/colors";

type Props = {
  title: string;
  subtitle?: string;
  icon?: keyof typeof MaterialIcons.glyphMap;
};

export function AppHeader({ title, subtitle, icon = "construction" }: Props) {
  return (
    <View style={styles.header}>
      <View style={styles.iconBox}>
        <MaterialIcons name={icon} size={26} color="#fff" />
      </View>

      <View>
        <Text style={styles.title}>{title}</Text>
        {!!subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: colors.primary,
    paddingTop: 48,
    paddingBottom: 24,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: colors.primaryDark,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    color: "#fff",
    fontSize: 23,
    fontWeight: "bold",
  },
  subtitle: {
    color: "#E6F6FC",
    marginTop: 2,
  },
});
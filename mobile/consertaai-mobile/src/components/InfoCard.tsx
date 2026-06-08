import { ReactNode } from "react";
import { View, StyleSheet } from "react-native";
import { colors } from "../theme/colors";

type Props = {
  children: ReactNode;
};

export function InfoCard({ children }: Props) {
  return <View style={styles.card}>{children}</View>;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 14,
  },
});

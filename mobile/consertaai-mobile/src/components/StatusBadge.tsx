import { Text, StyleSheet } from "react-native";
import { colors } from "../theme/colors";

type Props = {
  status: string;
};

export function StatusBadge({ status }: Props) {
  const label =
    status === "ABERTO"
      ? "Aberto"
      : status === "EM_ANDAMENTO"
      ? "Em andamento"
      : status === "CONCLUIDO"
      ? "Concluído"
      : status === "CANCELADO"
      ? "Cancelado"
      : status;

  const bg =
    status === "ABERTO"
      ? "#FDECEC"
      : status === "EM_ANDAMENTO"
      ? "#FFF4E5"
      : status === "CONCLUIDO"
      ? "#EAF6EC"
      : "#EEF1F5";

  const color =
    status === "ABERTO"
      ? colors.danger
      : status === "EM_ANDAMENTO"
      ? colors.warning
      : status === "CONCLUIDO"
      ? colors.success
      : colors.muted;

  return <Text style={[styles.badge, { backgroundColor: bg, color }]}>{label}</Text>;
}

const styles = StyleSheet.create({
  badge: {
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
    fontWeight: "800",
    fontSize: 12,
    overflow: "hidden",
  },
});

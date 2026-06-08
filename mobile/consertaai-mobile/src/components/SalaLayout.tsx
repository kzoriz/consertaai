import { View, Text, Pressable, StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { colors } from "@/theme/colors";
import { Equipamento } from "@/types/equipamentos";
type SalaResumo = {
  id: number;
  codigo_sala: string;
  bloco: string;
  andar: string;
  descricao?: string;
};


type Props = {
  equipamentos: Equipamento[];
  onPressEquipamento: (equipamento: Equipamento) => void;
};

export function SalaLayout({ equipamentos, onPressEquipamento }: Props) {
  function getIcon(tipo: string) {
    if (tipo === "LUMINARIA") return "lightbulb";
    if (tipo === "AR_CONDICIONADO") return "ac-unit";
    return "settings";
  }

  function getColor(status: string) {
    if (status === "OPERANDO") return colors.success;
    if (status === "DEFEITO") return colors.danger;
    if (status === "MANUTENCAO") return colors.warning;
    return colors.muted;
  }

  return (
    <View style={styles.wrapper}>
      <Text style={styles.labelTopo}>Layout da sala</Text>

      <View style={styles.sala}>
        {equipamentos.map((equipamento) => (
          <Pressable
            key={equipamento.id}
            style={[
              styles.equipamento,
              {
                left: `${equipamento.posicao_x}%`,
                top: `${equipamento.posicao_y}%`,
              },
            ]}
            onPress={() => onPressEquipamento(equipamento)}
          >
            <View
              style={[
                styles.iconCircle,
                {
                  borderColor: getColor(equipamento.status_atual),
                },
              ]}
            >
              <MaterialIcons
                name={getIcon(equipamento.tipo) as any}
                size={24}
                color={getColor(equipamento.status_atual)}
              />
            </View>
          </Pressable>
        ))}

        <View style={styles.porta}>
          <Text style={styles.portaTexto}>PORTA</Text>
        </View>
      </View>

      <View style={styles.legenda}>
        <Text style={styles.legendaItem}>🟢 Operando</Text>
        <Text style={styles.legendaItem}>🔴 Defeito</Text>
        <Text style={styles.legendaItem}>🟡 Manutenção</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 20,
  },

  labelTopo: {
    color: colors.text,
    fontSize: 18,
    fontWeight: "800",
    marginBottom: 12,
  },

  sala: {
    height: 360,
    backgroundColor: colors.surface,
    borderWidth: 3,
    borderColor: colors.primary,
    borderRadius: 18,
    position: "relative",
    overflow: "hidden",
  },

  equipamento: {
    position: "absolute",
    transform: [{ translateX: -22 }, { translateY: -22 }],
  },

  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 3,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    elevation: 3,
  },

  porta: {
    position: "absolute",
    bottom: -3,
    left: "40%",
    width: "20%",
    height: 36,
    backgroundColor: colors.background,
    borderLeftWidth: 3,
    borderRightWidth: 3,
    borderTopWidth: 3,
    borderColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },

  portaTexto: {
    fontSize: 10,
    color: colors.muted,
    fontWeight: "800",
  },

  legenda: {
    marginTop: 12,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    justifyContent: "center",
  },

  legendaItem: {
    color: colors.muted,
    fontWeight: "700",
    fontSize: 12,
  },
});
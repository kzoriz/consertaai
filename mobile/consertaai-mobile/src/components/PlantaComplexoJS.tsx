import { View, Text, Pressable, StyleSheet } from "react-native";
import { colors } from "@/theme/colors";

type Sala = {
  id: number;
  codigo_sala: string;
  descricao?: string;
};

type Props = {
  salas: Sala[];
  onPressSala: (sala: Sala) => void;
};

const layoutSalas = [
  // BLOCO ESQUERDO - salas antigas divididas verticalmente
  // Cada linha antiga vira duas salas lado a lado

  // Linha antiga 01
  { codigo: "01", x: 25, y: 66, w: 6.5, h: 6 },
  { codigo: "02", x: 31.5, y: 66, w: 6.5, h: 6 },

  // Linha antiga 02
  { codigo: "03", x: 25, y: 59, w: 6.5, h: 6 },
  { codigo: "04", x: 31.5, y: 59, w: 6.5, h: 6 },

  // Linha antiga 03
  { codigo: "05", x: 25, y: 52, w: 6.5, h: 6 },
  { codigo: "06", x: 31.5, y: 52, w: 6.5, h: 6 },

  // Linha antiga 04
  { codigo: "07", x: 25, y: 45, w: 6.5, h: 6 },
  { codigo: "08", x: 31.5, y: 45, w: 6.5, h: 6 },

  // Linha antiga 05
  { codigo: "09", x: 25, y: 38, w: 6.5, h: 6 },
  { codigo: "10", x: 31.5, y: 38, w: 6.5, h: 6 },

  // Linha antiga 06
  { codigo: "11", x: 25, y: 31, w: 6.5, h: 6 },
  { codigo: "12", x: 31.5, y: 31, w: 6.5, h: 6 },

  // BLOCO SUPERIOR
  { codigo: "13", x: 47, y: 7, w: 22, h: 13 },
  { codigo: "14", x: 47, y: 21, w: 22, h: 8 },
  { codigo: "15", x: 47, y: 30, w: 22, h: 10 },

  // BLOCO DIREITO
  { codigo: "16", x: 75, y: 34, w: 14, h: 12 },
  { codigo: "17", x: 75, y: 47, w: 14, h: 10 },
  { codigo: "18", x: 75, y: 58, w: 14, h: 10 },

  // ÁREAS ESPECIAIS
  { codigo: "DEPARTAMENTOS", x: 25, y: 77, w: 26, h: 10 },
  // { codigo: "PALCO", x: 52, y: 77, w: 14, h: 10 },
];
const servicos = [
  // { label: "Depósito", x: 39, y: 66, w: 9, h: 6 },
  // { label: "Sanitário", x: 39, y: 59, w: 9, h: 6 },
  // { label: "Depósito", x: 39, y: 52, w: 9, h: 6 },
  // { label: "Sanitário", x: 39, y: 45, w: 9, h: 6 },
  // { label: "Sanitário", x: 39, y: 38, w: 9, h: 6 },
  // { label: "Depósito", x: 39, y: 31, w: 9, h: 6 },
  //
  // { label: "Depósito", x: 42, y: 21, w: 5, h: 8 },
  // { label: "Sanitários", x: 47, y: 41, w: 11, h: 6 },
  // { label: "Elevador", x: 58, y: 41, w: 8, h: 6 },
  { label: "Banheiros", x: 75, y: 69, w: 8, h: 6 },
];

export function PlantaComplexoJS({ salas, onPressSala }: Props) {
  function buscarSala(codigo: string) {
    return salas.find(
      (sala) =>
        sala.codigo_sala === codigo ||
        sala.codigo_sala.padStart(2, "0") === codigo
    );
  }

  return (
    <View style={styles.planta}>
      <View style={styles.predioBase}>
        <Text style={styles.tituloCentro}>COMPLEXO</Text>

        {layoutSalas.map((item) => {
          const sala = buscarSala(item.codigo);
          const clicavel = !!sala;

          return (
            <Pressable
              key={item.codigo}
              disabled={!clicavel}
              style={[
                styles.sala,
                !clicavel && styles.salaDesativada,
                {
                  left: `${item.x}%`,
                  top: `${item.y}%`,
                  width: `${item.w}%`,
                  height: `${item.h}%`,
                },
              ]}
              onPress={() => sala && onPressSala(sala)}
            >
              <Text style={styles.salaCodigo}>{item.codigo}</Text>
            </Pressable>
          );
        })}

        {servicos.map((item) => (
          <View
            key={`${item.label}-${item.x}-${item.y}`}
            style={[
              styles.servico,
              {
                left: `${item.x}%`,
                top: `${item.y}%`,
                width: `${item.w}%`,
                height: `${item.h}%`,
              },
            ]}
          >
            <Text style={styles.servicoTexto}>{item.label}</Text>
          </View>
        ))}

        {/*<View style={styles.areaCentral}>*/}
        {/*  <Text style={styles.areaCentralTexto}>Área central</Text>*/}
        {/*</View>*/}

        <View style={styles.entrada}>
          <Text style={styles.entradaTexto}>ACESSO</Text>
        </View>
      </View>

      <View style={styles.legenda}>
        <Text style={styles.legendaItem}>Azul: sala cadastrada</Text>
        <Text style={styles.legendaItem}>Cinza: sala sem cadastro</Text>
        <Text style={styles.legendaItem}>Dourado: serviço</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  planta: {
    width: 900,
    height: 680,
    backgroundColor: "#EAF3ED",
    padding: 24,
  },

  predioBase: {
    flex: 1,
    backgroundColor: "#FFF8E5",
    borderWidth: 3,
    borderColor: colors.text,
    borderRadius: 14,
    position: "relative",
    overflow: "hidden",
  },

tituloCentro: {
  position: "absolute",
  left: 20,
  top: 20,
  color: colors.primary,
  fontSize: 28,
  fontWeight: "900",
  backgroundColor: "rgba(255,255,255,0.9)",
  paddingHorizontal: 10,
  paddingVertical: 4,
  borderRadius: 8,
},

  sala: {
    position: "absolute",
    backgroundColor: "#DDE2FF",
    borderWidth: 2,
    borderColor: colors.primary,
    borderRadius: 4,
    alignItems: "center",
    justifyContent: "center",
  },

  salaDesativada: {
    backgroundColor: "#EFEFEF",
    borderColor: colors.border,
  },

  salaCodigo: {
    fontWeight: "900",
    color: colors.text,
    fontSize: 16,
  },

  servico: {
    position: "absolute",
    backgroundColor: colors.secondary,
    borderWidth: 1,
    borderColor: "#B89F21",
    borderRadius: 4,
    alignItems: "center",
    justifyContent: "center",
    padding: 2,
  },

  servicoTexto: {
    fontSize: 10,
    fontWeight: "900",
    color: colors.text,
    textAlign: "center",
  },

  areaCentral: {
    position: "absolute",
    left: "46%",
    top: "56%",
    width: "18%",
    height: "12%",
    borderRadius: 999,
    backgroundColor: "#FFFFFF",
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
  },

  areaCentralTexto: {
    color: colors.muted,
    fontWeight: "800",
    fontSize: 11,
  },

  entrada: {
    position: "absolute",
    bottom: 0,
    left: "50%",
    width: "16%",
    height: 28,
    backgroundColor: colors.background,
    borderTopWidth: 3,
    borderLeftWidth: 3,
    borderRightWidth: 3,
    borderColor: colors.text,
    alignItems: "center",
    justifyContent: "center",
  },

  entradaTexto: {
    color: colors.danger,
    fontWeight: "900",
    fontSize: 11,
  },

  legenda: {
    marginTop: 12,
    flexDirection: "row",
    gap: 14,
    justifyContent: "center",
  },

  legendaItem: {
    fontSize: 12,
    color: colors.muted,
    fontWeight: "800",
  },
});
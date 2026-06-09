import { View, Text, Pressable, StyleSheet } from "react-native";
import { colors } from "../theme/colors";

type Sala = {
  id: number;
  codigo_sala: string;
  descricao?: string;
};

type Props = {
  salas: Sala[];
  piso: "1" | "2";
  onPressSala: (sala: Sala) => void;
};

const layoutPiso1 = [
  { codigo: "19", x: 2, y: 78, w: 22, h: 11 },
  { codigo: "20", x: 2, y: 65, w: 22, h: 11 },
  { codigo: "21", x: 2, y: 52, w: 22, h: 11 },
  { codigo: "22", x: 2, y: 39, w: 22, h: 11 },
  { codigo: "23", x: 2, y: 26, w: 22, h: 11 },
  { codigo: "24", x: 2, y: 13, w: 22, h: 11 },

  { codigo: "25", x: 49, y: 12, w: 22, h: 14 },
  { codigo: "26", x: 49, y: 28, w: 22, h: 14 },
  { codigo: "27", x: 49, y: 44, w: 22, h: 14 },

  { codigo: "28", x: 49, y: 78, w: 22, h: 11 },
  { codigo: "29", x: 49, y: 64, w: 22, h: 11 },
];

const layoutPiso2 = [
  { codigo: "30", x: 2, y: 78, w: 22, h: 11 },
  { codigo: "31", x: 2, y: 65, w: 22, h: 11 },
  { codigo: "32", x: 2, y: 52, w: 22, h: 11 },
  { codigo: "33", x: 2, y: 39, w: 22, h: 11 },
  { codigo: "34", x: 2, y: 26, w: 22, h: 11 },
  { codigo: "35", x: 2, y: 13, w: 22, h: 11 },

  { codigo: "36", x: 49, y: 12, w: 22, h: 14 },
  { codigo: "37", x: 49, y: 28, w: 22, h: 14 },
  { codigo: "38", x: 49, y: 44, w: 22, h: 14 },

  { codigo: "39", x: 49, y: 78, w: 22, h: 11 },
  { codigo: "40", x: 49, y: 64, w: 22, h: 11 },
];

const elementosFixos = [
  { label: "FOSSO", x: 31, y: 22, w: 12, h: 24 },
  { label: "FOSSO", x: 31, y: 64, w: 12, h: 22 },
  { label: "ESCADA", x: 78, y: 25, w: 12, h: 18 },
  { label: "ESCADA", x: 78, y: 67, w: 12, h: 18 },
];

const pilares = [
  { x: -2, y: -2 },
  // { x: 27, y: 27 },
  // { x: 45, y: 28 },
  // { x: 27, y: 42 },
  // { x: 45, y: 43 },
  // { x: 34, y: 52 },
  // { x: 57, y: 52 },
  // { x: 57, y: 60 },
  // { x: 66, y: 58 },
  // { x: 74, y: 43 },
  // { x: 93, y: 16 },
  // { x: 93, y: 31 },
  // { x: 93, y: 47 },
  // { x: 93, y: 63 },
  // { x: 93, y: 80 },
];

export function PlantaPredioPrincipalJS({ salas, piso, onPressSala }: Props) {
  const layout = piso === "1" ? layoutPiso1 : layoutPiso2;

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
      <Text style={styles.titulo}>PRÉDIO PRINCIPAL - PISO {piso}</Text>
        {layout.map((item) => {
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
              <Text style={styles.salaTexto}>{item.codigo}</Text>
            </Pressable>
          );
        })}

        {elementosFixos.map((item, index) => (
          <View
            key={`${item.label}-${index}`}
            style={[
              styles.elementoFixo,
              {
                left: `${item.x}%`,
                top: `${item.y}%`,
                width: `${item.w}%`,
                height: `${item.h}%`,
              },
            ]}
          >
            <Text style={styles.elementoTexto}>{item.label}</Text>
          </View>
        ))}

        {pilares.map((item, index) => (
          <View
            key={index}
            style={[
              styles.pilar,
              {
                left: `${item.x}%`,
                top: `${item.y}%`,
              },
            ]}
          />
        ))}
      </View>

      <View style={styles.legenda}>
        <Text style={styles.legendaItem}>Azul: sala cadastrada</Text>
        <Text style={styles.legendaItem}>Cinza: sem cadastro</Text>
        <Text style={styles.legendaItem}>Verde: pilares</Text>
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

  titulo: {
    position: "absolute",
    left: 20,
    top: 20,
    color: colors.primary,
    fontSize: 30,
    fontWeight: "900",
    letterSpacing: 1,
    backgroundColor: "rgba(255,255,255,0.9)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    zIndex: 10,
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

  salaTexto: {
    color: colors.text,
    fontSize: 18,
    fontWeight: "900",
  },

  elementoFixo: {
    position: "absolute",
    backgroundColor: colors.secondary,
    borderWidth: 1,
    borderColor: "#B89F21",
    borderRadius: 4,
    alignItems: "center",
    justifyContent: "center",
  },

  elementoTexto: {
    color: colors.text,
    fontSize: 14,
    fontWeight: "900",
  },

  pilar: {
    position: "absolute",
    width: 10,
    height: 30,
    borderRadius: 3,
    backgroundColor: "#6DA544",
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
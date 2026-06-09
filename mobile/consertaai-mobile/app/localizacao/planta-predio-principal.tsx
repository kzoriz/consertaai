import { useEffect, useState } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";

import { AppHeader } from "../../src/components/AppHeader";
import { PlantaPredioPrincipalJS } from "../../src/components/PlantaPredioPrincipalJS";
import { listarSalasPorPredio } from "../../src/services/localizacao";
import { colors } from "../../src/theme/colors";

type Sala = {
  id: number;
  codigo_sala: string;
  bloco: string;
  andar: string;
  descricao?: string;
};

const MAP_WIDTH = 900;
const MAP_HEIGHT = 560;

export default function PlantaPredioPrincipalScreen() {
  const { piso } = useLocalSearchParams();

  const pisoAtual = String(piso || "1") === "2" ? "2" : "1";

  const [salas, setSalas] = useState<Sala[]>([]);
  const [loading, setLoading] = useState(true);
  const [zoom, setZoom] = useState(1);

  useEffect(() => {
    carregar();
  }, []);

  async function carregar() {
    try {
      const dados = await listarSalasPorPredio("PREDIO_PRINCIPAL");
      setSalas(dados);
    } finally {
      setLoading(false);
    }
  }

  function aumentarZoom() {
    setZoom((value) => Math.min(value + 0.25, 2));
  }

  function diminuirZoom() {
    setZoom((value) => Math.max(value - 0.25, 0.75));
  }

  return (
    <View style={styles.container}>
      <AppHeader
        title="Planta do Prédio"
        subtitle={`Prédio Principal • Piso ${pisoAtual}`}
        icon="apartment"
      />

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text>Carregando planta...</Text>
        </View>
      ) : (
        <>
          <View style={styles.toolbar}>
            <Text style={styles.toolbarText}>
              Zoom: {Math.round(zoom * 100)}%
            </Text>

            <View style={styles.zoomButtons}>
              <Pressable style={styles.zoomButton} onPress={diminuirZoom}>
                <Text style={styles.zoomText}>−</Text>
              </Pressable>

              <Pressable style={styles.zoomButton} onPress={aumentarZoom}>
                <Text style={styles.zoomText}>+</Text>
              </Pressable>
            </View>
          </View>

          <ScrollView
            style={styles.scroll}
            horizontal
            showsHorizontalScrollIndicator
          >
            <ScrollView showsVerticalScrollIndicator>
              <View
                style={[
                  styles.mapWrapper,
                  {
                    width: MAP_WIDTH * zoom,
                    height: MAP_HEIGHT * zoom,
                    transform: [{ scale: zoom }],
                  },
                ]}
              >
                <PlantaPredioPrincipalJS
                  salas={salas}
                  piso={pisoAtual as "1" | "2"}
                  onPressSala={(sala) =>
                    router.push(`/salas/${sala.id}` as any)
                  }
                />
              </View>
            </ScrollView>
          </ScrollView>

          <View style={styles.legenda}>
            <Text style={styles.legendaText}>
              Toque em uma sala azul para abrir o layout interno.
            </Text>
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
  },

  toolbar: {
    backgroundColor: colors.surface,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  toolbarText: {
    color: colors.text,
    fontWeight: "800",
  },

  zoomButtons: {
    flexDirection: "row",
    gap: 8,
  },

  zoomButton: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },

  zoomText: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "900",
  },

  scroll: {
    flex: 1,
  },

  mapWrapper: {
    backgroundColor: colors.surface,
  },

  legenda: {
    backgroundColor: colors.surface,
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },

  legendaText: {
    textAlign: "center",
    color: colors.muted,
    fontWeight: "700",
    fontSize: 12,
  },
});
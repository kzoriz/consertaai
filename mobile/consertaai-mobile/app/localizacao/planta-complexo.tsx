import { useEffect, useState } from "react";
import {
  View,
  Text,
  ImageBackground,
  Pressable,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { router } from "expo-router";

import { AppHeader } from "@/components/AppHeader";
import { colors } from "@/theme/colors";
import { listarSalasPorLocal } from "@/services/localizacao";

type Sala = {
  id: number;
  codigo_sala: string;
  bloco: string;
  andar: string;
  descricao?: string;
  planta_x: number;
  planta_y: number;
  planta_largura: number;
  planta_altura: number;
};

const MAP_WIDTH = 900;
const MAP_HEIGHT = 680;

export default function PlantaComplexoScreen() {
  const [salas, setSalas] = useState<Sala[]>([]);
  const [loading, setLoading] = useState(true);
  const [zoom, setZoom] = useState(1);

  useEffect(() => {
    carregar();
  }, []);

  async function carregar() {
    try {
      const dados = await listarSalasPorLocal(
        "COMPLEXO",
        "Térreo",
        "Complexo"
      );

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
        title="Planta do Complexo"
        subtitle="Arraste, aproxime e toque na sala"
        icon="map"
      />

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text>Carregando planta...</Text>
        </View>
      ) : (
        <>
          <View style={styles.toolbar}>
            <Text style={styles.toolbarText}>Zoom: {Math.round(zoom * 100)}%</Text>

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
                  },
                ]}
              >
                <ImageBackground
                  source={require("../../assets/images/planta-complexo.png")}
                  style={styles.mapa}
                  imageStyle={styles.mapaImagem}
                  resizeMode="stretch"
                >
                  {salas.map((sala) => {
                    const temCoordenada =
                      sala.planta_largura > 0 && sala.planta_altura > 0;

                    if (!temCoordenada) return null;

                    return (
                      <Pressable
                        key={sala.id}
                        style={[
                          styles.salaBox,
                          {
                            left: `${sala.planta_x}%`,
                            top: `${sala.planta_y}%`,
                            width: `${sala.planta_largura}%`,
                            height: `${sala.planta_altura}%`,
                          },
                        ]}
                        onPress={() => router.push(`/salas/${sala.id}` as any)}
                      >
                        <Text style={styles.salaTexto}>
                          {sala.codigo_sala}
                        </Text>
                      </Pressable>
                    );
                  })}
                </ImageBackground>
              </View>
            </ScrollView>
          </ScrollView>

          <View style={styles.legenda}>
            <Text style={styles.legendaText}>
              Áreas azuis são salas cadastradas. Toque para abrir o layout interno.
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

  mapa: {
    flex: 1,
    position: "relative",
  },

  mapaImagem: {
    width: "100%",
    height: "100%",
  },

  salaBox: {
    position: "absolute",
    backgroundColor: "rgba(44, 64, 132, 0.28)",
    borderWidth: 2,
    borderColor: colors.primary,
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
  },

  salaTexto: {
    color: colors.primary,
    fontWeight: "900",
    fontSize: 12,
    backgroundColor: "rgba(255,255,255,0.9)",
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 5,
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
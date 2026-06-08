import { useEffect, useState } from "react";
import { View, FlatList, StyleSheet, ActivityIndicator } from "react-native";
import { router } from "expo-router";

import { listarPredios } from "@/services/localizacao";
import { AppHeader } from "@/components/AppHeader";
import { LocationOptionCard } from "@/components/LocationOptionCard";
import { colors } from "@/theme/colors";

export default function PrediosScreen() {
  const [predios, setPredios] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    carregar();
  }, []);

  async function carregar() {
    try {
      const dados = await listarPredios();
      setPredios(dados);
    } finally {
      setLoading(false);
    }
  }

  function nomePredio(predio: string) {
    if (predio === "PREDIO_PRINCIPAL") return "Prédio Principal";
    if (predio === "COMPLEXO") return "Complexo Cultural";
    return predio;
  }

  function descricaoPredio(predio: string) {
    if (predio === "PREDIO_PRINCIPAL") {
      return "Salas de aula, departamentos e coordenações";
    }

    if (predio === "COMPLEXO") {
      return "Auditório, informática, Projeto Educa e laboratórios";
    }

    return "Ambientes cadastrados";
  }

  function iconePredio(predio: string) {
    if (predio === "PREDIO_PRINCIPAL") return "apartment";
    if (predio === "COMPLEXO") return "domain";
    return "location-city";
  }

  return (
    <View style={styles.container}>
      <AppHeader
        title="Localizar Sala"
        subtitle="Escolha o prédio onde você está"
        icon="location-city"
      />

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <FlatList
          contentContainerStyle={styles.content}
          data={predios}
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <LocationOptionCard
              title={nomePredio(item)}
              subtitle={descricaoPredio(item)}
              icon={iconePredio(item) as any}
              onPress={() => {
                if (item === "COMPLEXO") {
                  router.push("/localizacao/planta-complexo" as any);
                  return;
                }

                router.push({
                  pathname: "/localizacao/andares",
                  params: { predio: item },
                });
              }}
            />
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  content: {
    padding: 20,
  },

  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
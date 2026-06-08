import { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Pressable,
  StyleSheet,
  ActivityIndicator,
} from "react-native";

import { router, useLocalSearchParams } from "expo-router";

import { listarAndares } from "@/services/localizacao";

import { AppHeader } from "@/components/AppHeader";
import { colors } from "@/theme/colors";
import {LocationOptionCard} from "@/components/LocationOptionCard";

export default function AndaresScreen() {
  const { predio } = useLocalSearchParams();

  const [andares, setAndares] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    carregar();
  }, []);

  async function carregar() {
    try {
      const dados = await listarAndares(String(predio));
      setAndares(dados);
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <AppHeader
        title="Andares"
        subtitle={
          predio === "PREDIO_PRINCIPAL"
            ? "Prédio Principal"
            : "Complexo"
        }
        icon="stairs"
      />

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <FlatList
          contentContainerStyle={styles.content}
          data={andares}
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <LocationOptionCard
              title={item}
              subtitle="Selecione este andar"
              icon="stairs"
              onPress={() =>
                router.push({
                  pathname: "/localizacao/blocos",
                  params: {
                    predio: String(predio),
                    andar: item,
                  },
                })
              }
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
    justifyContent: "center",
    alignItems: "center",
  },
  
});
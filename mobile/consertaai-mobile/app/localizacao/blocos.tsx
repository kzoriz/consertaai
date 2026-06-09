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

import { listarBlocos } from "@/services/localizacao";

import { AppHeader } from "@/components/AppHeader";
import { colors } from "@/theme/colors";
import {LocationOptionCard} from "@/components/LocationOptionCard";

export default function BlocosScreen() {
  const { predio, andar } = useLocalSearchParams();

  const [blocos, setBlocos] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    carregar();
  }, []);

  async function carregar() {
    try {
      const dados = await listarBlocos(
        String(predio),
        String(andar)
      );

      setBlocos(dados);
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <AppHeader
        title="Blocos"
        subtitle={`${andar}`}
        icon="domain"
      />

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator
            size="large"
            color={colors.primary}
          />
        </View>
      ) : (
        <FlatList
          contentContainerStyle={styles.content}
          data={blocos}
          keyExtractor={(item) => item}
         renderItem={({ item }) => (
          <LocationOptionCard
            title={item}
            subtitle={`${andar}`}
            icon="domain"
            onPress={() =>
              router.push({
                pathname: "/localizacao/salas",
                params: {
                  predio: String(predio),
                  andar: String(andar),
                  bloco: item,
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

  card: {
    backgroundColor: colors.surface,
    padding: 20,
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },

  nome: {
    fontSize: 18,
    fontWeight: "800",
    color: colors.text,
  },
});
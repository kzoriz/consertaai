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

import { listarSalasPorLocal } from "../../src/services/localizacao";

import { AppHeader } from "../../src/components/AppHeader";
import { colors } from "../../src/theme/colors";
import {LocationOptionCard} from "@/components/LocationOptionCard";

type Sala = {
  id: number;
  codigo_sala: string;
  bloco: string;
  andar: string;
  descricao: string;
};

export default function SalasLocalizacaoScreen() {
  const { predio, andar, bloco } =
    useLocalSearchParams();

  const [salas, setSalas] = useState<Sala[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    carregar();
  }, []);

  async function carregar() {
    try {
      const dados = await listarSalasPorLocal(
        String(predio),
        String(andar),
        String(bloco)
      );

      setSalas(dados);
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <AppHeader
        title="Salas"
        subtitle={String(bloco)}
        icon="meeting-room"
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
          data={salas}
          keyExtractor={(item) =>
            String(item.id)
          }
          renderItem={({ item }) => (
            <LocationOptionCard
              title={item.codigo_sala}
              subtitle={item.descricao || `${item.bloco} • ${item.andar}`}
              icon="meeting-room"
              onPress={() => router.push(`/salas/${item.id}` as any)}
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

  codigo: {
    fontSize: 18,
    fontWeight: "800",
    color: colors.text,
  },

  descricao: {
    color: colors.muted,
    marginTop: 6,
  },
});
import { useEffect, useState } from "react";
import { View, Text, FlatList, Pressable, StyleSheet, ActivityIndicator } from "react-native";
import { router } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";

import { listarSalas } from "../../src/services/salas";
import { AppHeader } from "../../src/components/AppHeader";
import { colors } from "../../src/theme/colors";

type Sala = {
  id: number;
  codigo_sala: string;
  bloco: string;
  andar: string;
  descricao: string;
};

export default function SalasScreen() {
  const [salas, setSalas] = useState<Sala[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    carregar();
  }, []);

  async function carregar() {
    try {
      const dados = await listarSalas();
      setSalas(dados);
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <AppHeader title="Salas" subtitle="Ambientes cadastrados" icon="meeting-room" />

      <View style={styles.content}>
        {loading ? (
          <View style={styles.center}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text>Carregando salas...</Text>
          </View>
        ) : (
          <FlatList
            data={salas}
            keyExtractor={(item) => String(item.id)}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
              <Pressable
                style={styles.card}
                onPress={() => router.push(`/salas/${item.id}` as any)}
              >
                <View style={styles.iconBox}>
                  <MaterialIcons name="meeting-room" size={28} color={colors.primary} />
                </View>

                <View style={styles.cardContent}>
                  <Text style={styles.codigo}>{item.codigo_sala}</Text>
                  <Text style={styles.info}>{item.bloco} • {item.andar}</Text>
                  <Text style={styles.descricao}>{item.descricao}</Text>
                </View>

                <MaterialIcons name="chevron-right" size={26} color={colors.muted} />
              </Pressable>
            )}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { flex: 1, padding: 20 },
  center: { flex: 1, justifyContent: "center", alignItems: "center", gap: 10 },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  iconBox: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: "#EEF2FF",
    alignItems: "center",
    justifyContent: "center",
  },
  cardContent: { flex: 1 },
  codigo: { fontSize: 18, fontWeight: "800", color: colors.text },
  info: { color: colors.primary, fontWeight: "700", marginTop: 4 },
  descricao: { color: colors.muted, marginTop: 4 },
});
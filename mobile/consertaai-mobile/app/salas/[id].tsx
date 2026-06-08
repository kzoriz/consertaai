import { useEffect, useState } from "react";
import { View, Text, FlatList, Pressable, StyleSheet, ActivityIndicator } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";

import { listarEquipamentosDaSala } from "../../src/services/salas";
import { AppHeader } from "../../src/components/AppHeader";
import { colors } from "../../src/theme/colors";

type Equipamento = {
  id: number;
  sala_id: number;
  patrimonio: string;
  tipo: string;
  status_atual: string;
};

export default function SalaDetalheScreen() {
  const { id } = useLocalSearchParams();
  const [equipamentos, setEquipamentos] = useState<Equipamento[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    carregar();
  }, [id]);

  async function carregar() {
    try {
      const dados = await listarEquipamentosDaSala(String(id));
      setEquipamentos(dados);
    } finally {
      setLoading(false);
    }
  }

  function getIcon(tipo: string) {
    return tipo === "LUMINARIA" ? "lightbulb" : "ac-unit";
  }

  function getTipo(tipo: string) {
    return tipo === "LUMINARIA" ? "Luminária" : "Ar-condicionado";
  }

  function getStatus(status: string) {
    if (status === "OPERANDO") return "Operando";
    if (status === "DEFEITO") return "Defeito";
    if (status === "MANUTENCAO") return "Manutenção";
    return status;
  }

  return (
    <View style={styles.container}>
      <AppHeader title="Equipamentos" subtitle="Ativos da sala selecionada" icon="construction" />

      <View style={styles.content}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <MaterialIcons name="arrow-back" size={20} color={colors.primary} />
          <Text style={styles.backText}>Voltar</Text>
        </Pressable>

        {loading ? (
          <View style={styles.center}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text>Carregando equipamentos...</Text>
          </View>
        ) : equipamentos.length === 0 ? (
          <Text style={styles.empty}>Nenhum equipamento cadastrado nesta sala.</Text>
        ) : (
          <FlatList
            data={equipamentos}
            keyExtractor={(item) => String(item.id)}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
              <Pressable
                style={styles.card}
                onPress={() => router.push(`/equipamentos/${item.id}` as any)}
              >
                <View style={styles.iconBox}>
                  <MaterialIcons name={getIcon(item.tipo) as any} size={28} color={colors.primary} />
                </View>

                <View style={styles.cardContent}>
                  <Text style={styles.tipo}>{getTipo(item.tipo)}</Text>
                  <Text style={styles.info}>Patrimônio: {item.patrimonio}</Text>
                  <Text style={styles.status}>Status: {getStatus(item.status_atual)}</Text>
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
  backButton: { flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 16 },
  backText: { color: colors.primary, fontWeight: "800" },
  empty: { color: colors.muted, fontSize: 16 },
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
  tipo: { fontSize: 18, fontWeight: "800", color: colors.text },
  info: { color: colors.muted, marginTop: 4 },
  status: { color: colors.primary, fontWeight: "700", marginTop: 4 },
});
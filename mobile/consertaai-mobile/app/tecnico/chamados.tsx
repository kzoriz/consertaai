import { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Pressable,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { router } from "expo-router";

import { listarChamadosTecnico } from "../../src/services/tecnico";

type Chamado = {
  id: number;
  usuario_id: number;
  equipamento_id: number;
  descricao_problema: string;
  status_chamado: string;
};

export default function ChamadosTecnicoScreen() {
  const [chamados, setChamados] = useState<Chamado[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    carregar();
  }, []);

  async function carregar() {
    try {
      const dados = await listarChamadosTecnico();
      setChamados(dados);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  function formatarStatus(status: string) {
    if (status === "ABERTO") return "Aberto";
    if (status === "EM_ANDAMENTO") return "Em andamento";
    if (status === "CONCLUIDO") return "Concluído";
    if (status === "CANCELADO") return "Cancelado";
    return status;
  }

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <Text>Carregando chamados...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Pressable onPress={() => router.back()}>
        <Text style={styles.voltar}>← Voltar</Text>
      </Pressable>

      <Text style={styles.titulo}>Painel Técnico</Text>

      <FlatList
        data={chamados}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <Pressable
            style={styles.card}
            onPress={() => router.push(`/chamados/${item.id}` as any)}
          >
            <Text style={styles.codigo}>Chamado #{item.id}</Text>
            <Text>Status: {formatarStatus(item.status_chamado)}</Text>
            <Text>Equipamento ID: {item.equipamento_id}</Text>
            <Text>{item.descricao_problema}</Text>
          </Pressable>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
  },
  voltar: {
    color: "#0066cc",
    fontWeight: "bold",
    marginBottom: 16,
  },
  titulo: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 16,
  },
  card: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  codigo: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
});
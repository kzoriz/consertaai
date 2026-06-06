import { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Pressable,
  StyleSheet,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";

import { listarEquipamentosDaSala } from "../../src/services/salas";

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
    carregarEquipamentos();
  }, [id]);

  async function carregarEquipamentos() {
    try {
      const dados = await listarEquipamentosDaSala(String(id));
      setEquipamentos(dados);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  function formatarTipo(tipo: string) {
    if (tipo === "LUMINARIA") return "💡 Luminária";
    if (tipo === "AR_CONDICIONADO") return "❄️ Ar-condicionado";
    return tipo;
  }

  function formatarStatus(status: string) {
    if (status === "OPERANDO") return "Operando";
    if (status === "DEFEITO") return "Defeito";
    if (status === "MANUTENCAO") return "Manutenção";
    return status;
  }

  if (loading) {
    return (
      <View style={styles.center}>
        <Text>Carregando equipamentos...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Pressable onPress={() => router.back()}>
        <Text style={styles.voltar}>← Voltar</Text>
      </Pressable>

      <Text style={styles.titulo}>Equipamentos da Sala</Text>

      {equipamentos.length === 0 ? (
        <Text>Nenhum equipamento cadastrado nesta sala.</Text>
      ) : (
        <FlatList
          data={equipamentos}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <Pressable
              style={styles.card}
              onPress={() =>
                router.push(`/equipamentos/${item.id}` as any)
              }
            >
              <Text style={styles.tipo}>{formatarTipo(item.tipo)}</Text>
              <Text>Patrimônio: {item.patrimonio}</Text>
              <Text>Status: {formatarStatus(item.status_atual)}</Text>
            </Pressable>
          )}
        />
      )}
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
  },
  voltar: {
    color: "#0066cc",
    fontWeight: "bold",
    marginBottom: 16,
  },
  titulo: {
    fontSize: 24,
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
  tipo: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
});
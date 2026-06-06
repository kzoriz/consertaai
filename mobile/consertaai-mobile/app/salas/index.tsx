import { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Pressable,
  StyleSheet,
} from "react-native";
import { router } from "expo-router";

import { listarSalas } from "../../src/services/salas";

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
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <View style={styles.center}>
        <Text>Carregando salas...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>
        Salas
      </Text>

      <FlatList
        data={salas}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <Pressable
            style={styles.card}
            onPress={() =>
              router.push(`/salas/${item.id}` as any)
            }
          >
            <Text style={styles.codigo}>
              {item.codigo_sala}
            </Text>

            <Text>
              {item.bloco}
            </Text>

            <Text>
              {item.andar}
            </Text>

            <Text>
              {item.descricao}
            </Text>
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
  },

  titulo: {
    fontSize: 28,
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
    fontWeight: "bold",
    fontSize: 18,
    marginBottom: 8,
  },
});
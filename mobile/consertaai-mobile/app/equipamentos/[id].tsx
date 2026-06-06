import { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  Alert,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";

import {
  obterEquipamento,
  abrirChamado,
} from "../../src/services/equipamentos";

type Equipamento = {
  id: number;
  sala_id: number;
  patrimonio: string;
  tipo: string;
  status_atual: string;
};

export default function EquipamentoDetalheScreen() {
  const { id } = useLocalSearchParams();

  const [equipamento, setEquipamento] = useState<Equipamento | null>(null);
  const [descricao, setDescricao] = useState("");
  const [loading, setLoading] = useState(true);
  const [enviando, setEnviando] = useState(false);

  useEffect(() => {
    carregarEquipamento();
  }, [id]);

  async function carregarEquipamento() {
    try {
      const dados = await obterEquipamento(String(id));
      setEquipamento(dados);
    } catch (error) {
      Alert.alert("Erro", "Não foi possível carregar o equipamento.");
    } finally {
      setLoading(false);
    }
  }

  async function handleAbrirChamado() {
    if (!descricao.trim()) {
      Alert.alert("Atenção", "Descreva o problema encontrado.");
      return;
    }

    try {
      setEnviando(true);

      await abrirChamado(String(id), descricao);

      Alert.alert("Sucesso", "Chamado aberto com sucesso.");
      setDescricao("");

      await carregarEquipamento();
    } catch (error) {
      Alert.alert("Erro", "Não foi possível abrir o chamado.");
    } finally {
      setEnviando(false);
    }
  }

  function formatarTipo(tipo?: string) {
    if (tipo === "LUMINARIA") return "💡 Luminária";
    if (tipo === "AR_CONDICIONADO") return "❄️ Ar-condicionado";
    return tipo || "";
  }

  function formatarStatus(status?: string) {
    if (status === "OPERANDO") return "Operando";
    if (status === "DEFEITO") return "Defeito";
    if (status === "MANUTENCAO") return "Manutenção";
    return status || "";
  }

  if (loading) {
    return (
      <View style={styles.center}>
        <Text>Carregando equipamento...</Text>
      </View>
    );
  }

  if (!equipamento) {
    return (
      <View style={styles.center}>
        <Text>Equipamento não encontrado.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Pressable onPress={() => router.back()}>
        <Text style={styles.voltar}>← Voltar</Text>
      </Pressable>

      <Text style={styles.titulo}>
        {formatarTipo(equipamento.tipo)}
      </Text>

      <View style={styles.card}>
        <Text style={styles.label}>Patrimônio</Text>
        <Text style={styles.valor}>{equipamento.patrimonio}</Text>

        <Text style={styles.label}>Status atual</Text>
        <Text style={styles.valor}>
          {formatarStatus(equipamento.status_atual)}
        </Text>
      </View>

      <Text style={styles.subtitulo}>Reportar falha</Text>

      <TextInput
        style={styles.textarea}
        placeholder="Descreva o problema encontrado..."
        value={descricao}
        onChangeText={setDescricao}
        multiline
        numberOfLines={5}
        textAlignVertical="top"
      />

      <Pressable
        style={[
          styles.botao,
          enviando && styles.botaoDesabilitado,
        ]}
        onPress={handleAbrirChamado}
        disabled={enviando}
      >
        <Text style={styles.botaoTexto}>
          {enviando ? "Enviando..." : "Abrir chamado"}
        </Text>
      </Pressable>
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
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 16,
  },

  card: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#ddd",
    marginBottom: 24,
  },

  label: {
    fontWeight: "bold",
    marginTop: 8,
  },

  valor: {
    fontSize: 16,
    marginBottom: 8,
  },

  subtitulo: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 12,
  },

  textarea: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    minHeight: 120,
    marginBottom: 16,
  },

  botao: {
    backgroundColor: "#e53935",
    padding: 14,
    borderRadius: 8,
  },

  botaoDesabilitado: {
    opacity: 0.6,
  },

  botaoTexto: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
  },
});
import { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Pressable,
  StyleSheet,
  TextInput,
  Alert,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";

import {
  obterChamado,
  listarHistoricoChamado,
  atualizarStatusChamado,
  adicionarHistoricoChamado,
} from "../../src/services/chamados";

type Chamado = {
  id: number;
  usuario_id: number;
  equipamento_id: number;
  descricao_problema: string;
  status_chamado: string;
};

type Historico = {
  id: number;
  chamado_id: number;
  acao_realizada: string;
  tecnico_responsavel?: string;
  observacoes?: string;
};

export default function ChamadoDetalheScreen() {
  const { id } = useLocalSearchParams();

  const [chamado, setChamado] = useState<Chamado | null>(null);
  const [historicos, setHistoricos] = useState<Historico[]>([]);
  const [loading, setLoading] = useState(true);
  const [atualizando, setAtualizando] = useState(false);

  const [acao, setAcao] = useState("");
  const [observacoes, setObservacoes] = useState("");

  useEffect(() => {
    carregarDados();
  }, [id]);

  async function carregarDados() {
    try {
      setLoading(true);

      const chamadoData = await obterChamado(String(id));
      const historicoData = await listarHistoricoChamado(String(id));

      setChamado(chamadoData);
      setHistoricos(historicoData);
    } catch (error) {
      Alert.alert("Erro", "Não foi possível carregar o chamado.");
    } finally {
      setLoading(false);
    }
  }

  async function alterarStatus(status: string) {
    try {
      setAtualizando(true);

      await atualizarStatusChamado(String(id), status);
      await carregarDados();

      Alert.alert("Sucesso", "Status atualizado com sucesso.");
    } catch (error) {
      Alert.alert("Erro", "Não foi possível atualizar o status.");
    } finally {
      setAtualizando(false);
    }
  }

  async function salvarHistorico() {
    if (!acao.trim()) {
      Alert.alert("Atenção", "Informe a ação realizada.");
      return;
    }

    try {
      setAtualizando(true);

      await adicionarHistoricoChamado(String(id), acao, observacoes);

      setAcao("");
      setObservacoes("");

      await carregarDados();

      Alert.alert("Sucesso", "Histórico adicionado.");
    } catch (error) {
      Alert.alert("Erro", "Não foi possível adicionar o histórico.");
    } finally {
      setAtualizando(false);
    }
  }

  function formatarStatus(status?: string) {
    if (status === "ABERTO") return "Aberto";
    if (status === "EM_ANDAMENTO") return "Em andamento";
    if (status === "CONCLUIDO") return "Concluído";
    if (status === "CANCELADO") return "Cancelado";
    return status || "";
  }

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <Text>Carregando chamado...</Text>
      </View>
    );
  }

  if (!chamado) {
    return (
      <View style={styles.center}>
        <Text>Chamado não encontrado.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Pressable onPress={() => router.back()}>
        <Text style={styles.voltar}>← Voltar</Text>
      </Pressable>

      <Text style={styles.titulo}>Chamado #{chamado.id}</Text>

      <View style={styles.card}>
        <Text style={styles.label}>Status</Text>
        <Text style={styles.status}>{formatarStatus(chamado.status_chamado)}</Text>

        <Text style={styles.label}>Equipamento</Text>
        <Text>Equipamento ID: {chamado.equipamento_id}</Text>

        <Text style={styles.label}>Descrição do problema</Text>
        <Text>{chamado.descricao_problema}</Text>
      </View>

      <Text style={styles.subtitulo}>Atualizar status</Text>

      <View style={styles.botoesLinha}>
        <Pressable
          style={styles.botao}
          disabled={atualizando}
          onPress={() => alterarStatus("EM_ANDAMENTO")}
        >
          <Text style={styles.botaoTexto}>Em andamento</Text>
        </Pressable>

        <Pressable
          style={styles.botaoVerde}
          disabled={atualizando}
          onPress={() => alterarStatus("CONCLUIDO")}
        >
          <Text style={styles.botaoTexto}>Concluir</Text>
        </Pressable>
      </View>

      <Pressable
        style={styles.botaoCinza}
        disabled={atualizando}
        onPress={() => alterarStatus("CANCELADO")}
      >
        <Text style={styles.botaoTexto}>Cancelar chamado</Text>
      </Pressable>

      <Text style={styles.subtitulo}>Adicionar histórico</Text>

      <TextInput
        style={styles.input}
        placeholder="Ação realizada"
        value={acao}
        onChangeText={setAcao}
      />

      <TextInput
        style={styles.textarea}
        placeholder="Observações"
        value={observacoes}
        onChangeText={setObservacoes}
        multiline
        numberOfLines={4}
        textAlignVertical="top"
      />

      <Pressable
        style={styles.botaoAzul}
        disabled={atualizando}
        onPress={salvarHistorico}
      >
        <Text style={styles.botaoTexto}>
          {atualizando ? "Salvando..." : "Salvar histórico"}
        </Text>
      </Pressable>

      <Text style={styles.subtitulo}>Histórico</Text>

      {historicos.length === 0 ? (
        <Text>Nenhum histórico registrado.</Text>
      ) : (
        <FlatList
          data={historicos}
          keyExtractor={(item) => item.id.toString()}
          scrollEnabled={false}
          renderItem={({ item }) => (
            <View style={styles.historicoCard}>
              <Text style={styles.historicoAcao}>{item.acao_realizada}</Text>

              {!!item.tecnico_responsavel && (
                <Text>Técnico: {item.tecnico_responsavel}</Text>
              )}

              {!!item.observacoes && (
                <Text>Obs.: {item.observacoes}</Text>
              )}
            </View>
          )}
        />
      )}
    </ScrollView>
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

  subtitulo: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 12,
  },

  card: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#ddd",
  },

  label: {
    fontWeight: "bold",
    marginTop: 10,
  },

  status: {
    fontSize: 16,
    fontWeight: "bold",
  },

  botoesLinha: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 10,
  },

  botao: {
    flex: 1,
    backgroundColor: "#fb8c00",
    padding: 12,
    borderRadius: 8,
  },

  botaoVerde: {
    flex: 1,
    backgroundColor: "#43a047",
    padding: 12,
    borderRadius: 8,
  },

  botaoCinza: {
    backgroundColor: "#757575",
    padding: 12,
    borderRadius: 8,
  },

  botaoAzul: {
    backgroundColor: "#2196F3",
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },

  botaoTexto: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
  },

  input: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
  },

  textarea: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    minHeight: 100,
    marginBottom: 10,
  },

  historicoCard: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    marginBottom: 10,
  },

  historicoAcao: {
    fontWeight: "bold",
    marginBottom: 6,
  },
});
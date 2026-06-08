import { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  Alert,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";

import {
  obterEquipamento,
  abrirChamado,
  listarChamadosDoEquipamento,
} from "@/services/equipamentos";
import { colors } from "@/theme/colors";
import { AppHeader } from "@/components/AppHeader";
import { Equipamento } from "@/types/equipamentos";

type Chamado = {
  id: number;
  usuario_id: number;
  equipamento_id: number;
  descricao_problema: string;
  status_chamado: string;
};

const problemasPorTipo = {
  LUMINARIA: ["Não acende", "Piscando", "Queimada", "Mau contato", "Outro"],
  AR_CONDICIONADO: [
    "Não liga",
    "Não resfria",
    "Vazamento",
    "Ruído excessivo",
    "Outro",
  ],
};

export default function EquipamentoDetalheScreen() {
  const { id } = useLocalSearchParams();

  const [equipamento, setEquipamento] = useState<Equipamento | null>(null);
  const [chamados, setChamados] = useState<Chamado[]>([]);
  const [problemaSelecionado, setProblemaSelecionado] = useState("");
  const [descricao, setDescricao] = useState("");
  const [loading, setLoading] = useState(true);
  const [enviando, setEnviando] = useState(false);

  useEffect(() => {
    carregarEquipamento();
  }, [id]);

  async function carregarEquipamento() {
    try {
      const dados = await obterEquipamento(String(id));
      const chamadosData = await listarChamadosDoEquipamento(String(id));

      setEquipamento(dados);
      setChamados(chamadosData);
    } catch {
      Alert.alert("Erro", "Não foi possível carregar o equipamento.");
    } finally {
      setLoading(false);
    }
  }

  async function handleAbrirChamado() {
    if (!problemaSelecionado) {
      Alert.alert("Atenção", "Selecione o tipo de problema.");
      return;
    }

    if (problemaSelecionado === "Outro" && !descricao.trim()) {
      Alert.alert("Atenção", "Descreva o problema encontrado.");
      return;
    }

    try {
      setEnviando(true);

      const textoChamado =
        problemaSelecionado === "Outro"
          ? descricao
          : `${problemaSelecionado}${descricao ? ` - ${descricao}` : ""}`;

      await abrirChamado(String(id), textoChamado);

      Alert.alert("Sucesso", "Chamado aberto com sucesso.");

      setProblemaSelecionado("");
      setDescricao("");

      await carregarEquipamento();
    } catch {
      Alert.alert("Erro", "Não foi possível abrir o chamado.");
    } finally {
      setEnviando(false);
    }
  }

  function tipoLabel(tipo?: string) {
    if (tipo === "LUMINARIA") return "Luminária";
    if (tipo === "AR_CONDICIONADO") return "Ar-condicionado";
    return "Equipamento";
  }

  function tipoIcon(tipo?: string) {
    if (tipo === "LUMINARIA") return "lightbulb";
    if (tipo === "AR_CONDICIONADO") return "ac-unit";
    return "construction";
  }

  function statusLabel(status?: string) {
    if (status === "OPERANDO") return "Operando";
    if (status === "DEFEITO") return "Defeito";
    if (status === "MANUTENCAO") return "Manutenção";
    return status || "";
  }

  function statusColor(status?: string) {
    if (status === "OPERANDO") return colors.success;
    if (status === "DEFEITO") return colors.danger;
    if (status === "MANUTENCAO") return colors.warning;
    return colors.muted;
  }

  function predioLabel(predio?: string) {
    if (predio === "PREDIO_PRINCIPAL") return "Prédio Principal";
    if (predio === "COMPLEXO") return "Complexo";
    return predio || "Não informado";
  }

  const problemas =
    equipamento?.tipo === "AR_CONDICIONADO"
      ? problemasPorTipo.AR_CONDICIONADO
      : problemasPorTipo.LUMINARIA;

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.primary} />
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
      <AppHeader
        title={tipoLabel(equipamento.tipo)}
        subtitle={equipamento.patrimonio}
        icon={tipoIcon(equipamento.tipo) as any}
      />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <MaterialIcons name="arrow-back" size={20} color={colors.primary} />
          <Text style={styles.backText}>Voltar</Text>
        </Pressable>

        <View style={styles.mainCard}>
          <View style={styles.equipamentoIcon}>
            <MaterialIcons
              name={tipoIcon(equipamento.tipo) as any}
              size={46}
              color={colors.primary}
            />
          </View>

          <Text style={styles.nomeEquipamento}>
            {tipoLabel(equipamento.tipo)}
          </Text>

          <Text style={styles.patrimonio}>
            Patrimônio: {equipamento.patrimonio}
          </Text>

          <View
            style={[
              styles.statusBadge,
              { backgroundColor: `${statusColor(equipamento.status_atual)}22` },
            ]}
          >
            <View
              style={[
                styles.statusDot,
                { backgroundColor: statusColor(equipamento.status_atual) },
              ]}
            />
            <Text
              style={[
                styles.statusText,
                { color: statusColor(equipamento.status_atual) },
              ]}
            >
              {statusLabel(equipamento.status_atual)}
            </Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Localização</Text>

        <View style={styles.infoCard}>
          <InfoRow
            label="Prédio"
            value={predioLabel(equipamento.sala?.predio)}
            icon="apartment"
          />
          <InfoRow
            label="Andar"
            value={equipamento.sala?.andar || "Não informado"}
            icon="stairs"
          />
          <InfoRow
            label="Bloco / Setor"
            value={equipamento.sala?.bloco || "Não informado"}
            icon="domain"
          />
          <InfoRow
            label="Sala"
            value={equipamento.sala?.codigo_sala || "Não informado"}
            icon="meeting-room"
          />
          <InfoRow
            label="Descrição"
            value={equipamento.sala?.descricao || "Não informado"}
            icon="info"
          />
        </View>
        <Text style={styles.sectionTitle}>Histórico do equipamento</Text>

<View style={styles.infoCard}>
  {chamados.length === 0 ? (
    <Text style={styles.emptyText}>
      Nenhum chamado registrado para este equipamento.
    </Text>
  ) : (
    chamados.slice(0, 3).map((chamado) => (
      <Pressable
        key={chamado.id}
        style={styles.chamadoResumo}
        onPress={() => router.push(`/chamados/${chamado.id}` as any)}
      >
        <View>
          <Text style={styles.chamadoTitulo}>Chamado #{chamado.id}</Text>
          <Text style={styles.chamadoDescricao}>
            {chamado.descricao_problema}
          </Text>
        </View>

        <Text style={styles.chamadoStatus}>
          {chamado.status_chamado === "ABERTO"
            ? "Aberto"
            : chamado.status_chamado === "EM_ANDAMENTO"
            ? "Em andamento"
            : chamado.status_chamado === "CONCLUIDO"
            ? "Concluído"
            : "Cancelado"}
        </Text>
      </Pressable>
    ))
  )}
</View>
        <Text style={styles.sectionTitle}>Abrir chamado</Text>

        <View style={styles.chamadoCard}>
          <Text style={styles.label}>Qual problema foi encontrado?</Text>

          <View style={styles.problemGrid}>
            {problemas.map((problema) => (
              <Pressable
                key={problema}
                style={[
                  styles.problemChip,
                  problemaSelecionado === problema && styles.problemChipActive,
                ]}
                onPress={() => setProblemaSelecionado(problema)}
              >
                <Text
                  style={[
                    styles.problemChipText,
                    problemaSelecionado === problema &&
                      styles.problemChipTextActive,
                  ]}
                >
                  {problema}
                </Text>
              </Pressable>
            ))}
          </View>

          <TextInput
            style={styles.textarea}
            placeholder={
              problemaSelecionado === "Outro"
                ? "Descreva o problema..."
                : "Observação complementar, se necessário..."
            }
            value={descricao}
            onChangeText={setDescricao}
            multiline
            numberOfLines={5}
            textAlignVertical="top"
          />

          <Pressable
            style={[styles.openButton, enviando && styles.disabledButton]}
            onPress={handleAbrirChamado}
            disabled={enviando}
          >
            <MaterialIcons name="add-task" size={22} color={colors.text} />
            <Text style={styles.openButtonText}>
              {enviando ? "Enviando..." : "Abrir chamado"}
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}

function InfoRow({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: keyof typeof MaterialIcons.glyphMap;
}) {
  return (
    <View style={styles.infoRow}>
      <View style={styles.infoIcon}>
        <MaterialIcons name={icon} size={20} color={colors.primary} />
      </View>

      <View style={{ flex: 1 }}>
        <Text style={styles.infoLabel}>{label}</Text>
        <Text style={styles.infoValue}>{value}</Text>
      </View>
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
    paddingBottom: 40,
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
    backgroundColor: colors.background,
  },

  backButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 16,
  },

  backText: {
    color: colors.primary,
    fontWeight: "800",
  },

  mainCard: {
    backgroundColor: colors.surface,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 22,
    alignItems: "center",
    marginBottom: 22,
  },

  equipamentoIcon: {
    width: 86,
    height: 86,
    borderRadius: 28,
    backgroundColor: "#EEF2FF",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
  },

  nomeEquipamento: {
    fontSize: 24,
    fontWeight: "900",
    color: colors.text,
  },

  patrimonio: {
    color: colors.muted,
    marginTop: 6,
    fontWeight: "700",
  },

  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 999,
    marginTop: 16,
  },

  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },

  statusText: {
    fontWeight: "900",
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "900",
    color: colors.text,
    marginBottom: 12,
  },

  infoCard: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 22,
  },

  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 10,
  },

  infoIcon: {
    width: 40,
    height: 40,
    borderRadius: 14,
    backgroundColor: "#EEF2FF",
    alignItems: "center",
    justifyContent: "center",
  },

  infoLabel: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: "800",
    textTransform: "uppercase",
  },

  infoValue: {
    color: colors.text,
    fontSize: 15,
    fontWeight: "700",
    marginTop: 2,
  },

  chamadoCard: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },

  label: {
    fontSize: 15,
    fontWeight: "900",
    color: colors.text,
    marginBottom: 12,
  },

  problemGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 14,
  },

  problemChip: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 999,
    paddingVertical: 9,
    paddingHorizontal: 13,
    backgroundColor: "#fff",
  },

  problemChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },

  problemChipText: {
    color: colors.text,
    fontWeight: "800",
  },

  problemChipTextActive: {
    color: "#fff",
  },

  textarea: {
    minHeight: 120,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    padding: 12,
    marginBottom: 14,
  },

  openButton: {
    backgroundColor: colors.secondary,
    borderRadius: 14,
    padding: 15,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },

  openButtonText: {
    color: colors.text,
    fontWeight: "900",
    fontSize: 16,
  },

  disabledButton: {
    opacity: 0.6,
  },
  emptyText: {
  color: colors.muted,
  fontWeight: "600",
},

chamadoResumo: {
  paddingVertical: 12,
  borderBottomWidth: 1,
  borderBottomColor: colors.border,
  flexDirection: "row",
  justifyContent: "space-between",
  gap: 10,
},

chamadoTitulo: {
  fontWeight: "900",
  color: colors.text,
},

chamadoDescricao: {
  color: colors.muted,
  marginTop: 4,
  maxWidth: 210,
},

chamadoStatus: {
  fontWeight: "900",
  color: colors.primary,
  fontSize: 12,
},
});
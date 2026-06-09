import { useEffect, useState } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ActivityIndicator,
  Modal,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";

import {
  listarEquipamentosDaSala,
  obterSala,
} from "@/services/salas";
import { AppHeader } from "@/components/AppHeader";
import { SalaLayout } from "@/components/SalaLayout";
import { colors } from "@/theme/colors";
import { Equipamento } from "@/types/equipamentos";
import { BackButton } from "@/components/BackButton";
type Sala = {
  id: number;
  codigo_sala: string;
  bloco: string;
  andar: string;
  descricao?: string;
};

export default function SalaDetalheScreen() {
  const { id } = useLocalSearchParams();
  const [equipamentoSelecionado, setEquipamentoSelecionado] = useState<Equipamento | null>(null);
  const [equipamentos, setEquipamentos] = useState<Equipamento[]>([]);
  const [loading, setLoading] = useState(true);
  const [sala, setSala] = useState<Sala | null>(null);

  useEffect(() => {
    carregar();
  }, [id]);

  async function carregar() {
    try {
      const salaData = await obterSala(String(id));
      const equipamentosData = await listarEquipamentosDaSala(String(id));

      setSala(salaData);
      setEquipamentos(equipamentosData);
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
    <AppHeader
      title={sala?.descricao || "Layout da Sala"}
      subtitle={`${sala?.codigo_sala || ""} • ${sala?.bloco || ""} • ${sala?.andar || ""}`}
      icon="meeting-room"
    />
      <View style={{ paddingHorizontal: 20 }}>
        <BackButton />
      </View>
      <View style={styles.content}>
        {loading ? (
          <View style={styles.center}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text>Carregando layout...</Text>
          </View>
        ) : equipamentos.length === 0 ? (
          <Text style={styles.empty}>
            Nenhum equipamento cadastrado nesta sala.
          </Text>
        ) : (
        <SalaLayout
          equipamentos={equipamentos}
          onPressEquipamento={(equipamento) =>
            setEquipamentoSelecionado(equipamento)
          }
        />
        )}
      </View>
      <Modal
  visible={!!equipamentoSelecionado}
  transparent
  animationType="slide"
  onRequestClose={() => setEquipamentoSelecionado(null)}
>
  <View style={styles.modalOverlay}>
    <View style={styles.modalCard}>
      <Text style={styles.modalTitulo}>
        {equipamentoSelecionado?.tipo === "LUMINARIA"
          ? "💡 Luminária"
          : "❄️ Ar-condicionado"}
      </Text>

      <Text style={styles.modalLabel}>Patrimônio</Text>
      <Text style={styles.modalValor}>
        {equipamentoSelecionado?.patrimonio}
      </Text>

      <Text style={styles.modalLabel}>Status</Text>
      <Text style={styles.modalValor}>
        {equipamentoSelecionado?.status_atual === "OPERANDO"
          ? "Operando"
          : equipamentoSelecionado?.status_atual === "DEFEITO"
          ? "Defeito"
          : "Manutenção"}
      </Text>

      <Text style={styles.modalLabel}>Sala</Text>
      <Text style={styles.modalValor}>
        {equipamentoSelecionado?.sala?.codigo_sala || "Não informado"}
      </Text>

      <Text style={styles.modalLabel}>Bloco</Text>
      <Text style={styles.modalValor}>
        {equipamentoSelecionado?.sala?.bloco || "Não informado"}
      </Text>

      <Text style={styles.modalLabel}>Andar</Text>
      <Text style={styles.modalValor}>
        {equipamentoSelecionado?.sala?.andar || "Não informado"}
      </Text>

      <Text style={styles.modalLabel}>Descrição da sala</Text>
      <Text style={styles.modalValor}>
        {equipamentoSelecionado?.sala?.descricao || "Não informado"}
      </Text>

      <Pressable
        style={styles.botaoPrimario}
        onPress={() => {
          const equipamentoId = equipamentoSelecionado?.id;
          setEquipamentoSelecionado(null);

          if (equipamentoId) {
            router.push(`/equipamentos/${equipamentoId}` as any);
          }
        }}
      >
        <Text style={styles.botaoPrimarioTexto}>Ver detalhes / Abrir chamado</Text>
      </Pressable>

      <Pressable
        style={styles.botaoSecundario}
        onPress={() => setEquipamentoSelecionado(null)}
      >
        <Text style={styles.botaoSecundarioTexto}>Fechar</Text>
      </Pressable>
    </View>
  </View>
</Modal>
    </View>

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  content: {
    flex: 1,
    padding: 20,
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
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

  empty: {
    color: colors.muted,
    fontSize: 16,
  },
  modalOverlay: {
  flex: 1,
  backgroundColor: "rgba(0,0,0,0.45)",
  justifyContent: "flex-end",
},

modalCard: {
  backgroundColor: colors.surface,
  borderTopLeftRadius: 28,
  borderTopRightRadius: 28,
  padding: 22,
},

modalTitulo: {
  fontSize: 24,
  fontWeight: "900",
  color: colors.text,
  marginBottom: 16,
},

modalLabel: {
  fontSize: 12,
  fontWeight: "800",
  color: colors.muted,
  marginTop: 10,
  textTransform: "uppercase",
},

modalValor: {
  fontSize: 16,
  fontWeight: "600",
  color: colors.text,
  marginTop: 2,
},

botaoPrimario: {
  backgroundColor: colors.secondary,
  padding: 14,
  borderRadius: 14,
  marginTop: 22,
},

botaoPrimarioTexto: {
  textAlign: "center",
  fontWeight: "900",
  color: colors.text,
},

botaoSecundario: {
  padding: 14,
  borderRadius: 14,
  marginTop: 10,
  borderWidth: 1,
  borderColor: colors.border,
},

botaoSecundarioTexto: {
  textAlign: "center",
  fontWeight: "800",
  color: colors.primary,
},
});
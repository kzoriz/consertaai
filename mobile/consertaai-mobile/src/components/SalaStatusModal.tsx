import { Modal, View, Text, Pressable, StyleSheet } from "react-native";
import { router } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";

import { colors } from "@/theme/colors";
import { SalaStatusDashboard } from "@/types/dashboard";

type Props = {
  sala: SalaStatusDashboard | null;
  visible: boolean;
  onClose: () => void;
};

export function SalaStatusModal({ sala, visible, onClose }: Props) {
  if (!sala) return null;

  function statusLabel(status: string) {
    if (status === "ABERTO") return "Chamado aberto";
    if (status === "EM_ANDAMENTO") return "Em atendimento";
    return "Normal";
  }

  function statusColor(status: string) {
    if (status === "ABERTO") return colors.danger;
    if (status === "EM_ANDAMENTO") return colors.warning;
    return colors.success;
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.card}>
          <View style={styles.header}>
            <View>
              <Text style={styles.title}>
                {sala.descricao || `Sala ${sala.codigo_sala}`}
              </Text>
              <Text style={styles.subtitle}>
                {sala.codigo_sala} • {sala.bloco} • {sala.andar}
              </Text>
            </View>

            <Pressable style={styles.closeButton} onPress={onClose}>
              <MaterialIcons name="close" size={22} color={colors.text} />
            </Pressable>
          </View>

          <View
            style={[
              styles.statusBadge,
              { backgroundColor: `${statusColor(sala.status)}22` },
            ]}
          >
            <View
              style={[
                styles.statusDot,
                { backgroundColor: statusColor(sala.status) },
              ]}
            />
            <Text
              style={[
                styles.statusText,
                { color: statusColor(sala.status) },
              ]}
            >
              {statusLabel(sala.status)}
            </Text>
          </View>

          <Text style={styles.sectionTitle}>Chamados</Text>

          <View style={styles.grid}>
            <InfoBox
              label="Abertos"
              value={sala.chamados_abertos}
              color={colors.danger}
            />
            <InfoBox
              label="Andamento"
              value={sala.chamados_em_andamento}
              color={colors.warning}
            />
            <InfoBox
              label="Concluídos"
              value={sala.chamados_concluidos}
              color={colors.success}
            />
          </View>

          <Text style={styles.sectionTitle}>Equipamentos</Text>

          <View style={styles.grid}>
            <InfoBox
              label="Total"
              value={sala.equipamentos_total}
              color={colors.primary}
            />
            <InfoBox
              label="Operando"
              value={sala.equipamentos_operando}
              color={colors.success}
            />
            <InfoBox
              label="Defeito"
              value={sala.equipamentos_defeito}
              color={colors.danger}
            />
            <InfoBox
              label="Manutenção"
              value={sala.equipamentos_manutencao}
              color={colors.warning}
            />
          </View>

          <Pressable
            style={styles.primaryButton}
            onPress={() => {
              onClose();
              router.push(`/salas/${sala.sala_id}` as any);
            }}
          >
            <Text style={styles.primaryButtonText}>Ver layout da sala</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

function InfoBox({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: string;
}) {
  return (
    <View style={styles.infoBox}>
      <Text style={[styles.infoValue, { color }]}>{value}</Text>
      <Text style={styles.infoLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "flex-end",
  },

  card: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 22,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
    marginBottom: 14,
  },

  title: {
    fontSize: 22,
    fontWeight: "900",
    color: colors.text,
  },

  subtitle: {
    color: colors.muted,
    fontWeight: "700",
    marginTop: 4,
  },

  closeButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.background,
    alignItems: "center",
    justifyContent: "center",
  },

  statusBadge: {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderRadius: 999,
    paddingVertical: 8,
    paddingHorizontal: 14,
    marginBottom: 18,
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
    fontSize: 16,
    fontWeight: "900",
    color: colors.text,
    marginBottom: 10,
    marginTop: 8,
  },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 10,
  },

  infoBox: {
    width: "47%",
    backgroundColor: colors.background,
    borderRadius: 14,
    padding: 12,
  },

  infoValue: {
    fontSize: 22,
    fontWeight: "900",
  },

  infoLabel: {
    color: colors.muted,
    fontWeight: "800",
    marginTop: 3,
    fontSize: 12,
  },

  primaryButton: {
    backgroundColor: colors.secondary,
    padding: 15,
    borderRadius: 16,
    marginTop: 16,
  },

  primaryButtonText: {
    textAlign: "center",
    color: colors.text,
    fontWeight: "900",
  },
});
import { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Pressable,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { router } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";

import { listarChamadosTecnico } from "@/services/tecnico";
import { AppHeader } from "@/components/AppHeader";
import { colors } from "@/theme/colors";
import { ChamadoTecnico } from "@/types/chamadoTecnico";
import { BackButton } from "@/components/BackButton";
type FiltroStatus = "TODOS" | "ABERTO" | "EM_ANDAMENTO" | "CONCLUIDO";

export default function ChamadosTecnicoScreen() {
  const [chamados, setChamados] = useState<ChamadoTecnico[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState<FiltroStatus>("TODOS");

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

  const abertos = chamados.filter((c) => c.status_chamado === "ABERTO").length;
  const andamento = chamados.filter(
    (c) => c.status_chamado === "EM_ANDAMENTO"
  ).length;
  const concluidos = chamados.filter(
    (c) => c.status_chamado === "CONCLUIDO"
  ).length;

  const chamadosFiltrados = useMemo(() => {
    const prioridadePeso: Record<string, number> = {
      ALTA: 1,
      MEDIA: 2,
      BAIXA: 3,
    };

    const statusPeso: Record<string, number> = {
      ABERTO: 1,
      EM_ANDAMENTO: 2,
      CONCLUIDO: 3,
      CANCELADO: 4,
    };

    return chamados
      .filter((c) => filtro === "TODOS" || c.status_chamado === filtro)
      .sort((a, b) => {
        const prioridadeA = prioridadePeso[a.prioridade] || 99;
        const prioridadeB = prioridadePeso[b.prioridade] || 99;

        if (prioridadeA !== prioridadeB) {
          return prioridadeA - prioridadeB;
        }

        const statusA = statusPeso[a.status_chamado] || 99;
        const statusB = statusPeso[b.status_chamado] || 99;

        return statusA - statusB;
      });
  }, [chamados, filtro]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text>Carregando chamados...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <AppHeader
        title="Painel Técnico"
        subtitle="Acompanhamento de manutenções"
        icon="engineering"
      />
      <View style={{ paddingHorizontal: 20 }}>
        <BackButton />
      </View>
      <View style={styles.content}>
        <View style={styles.resumoGrid}>
          <ResumoCard
            icon="error"
            label="Abertos"
            value={abertos}
            color={colors.danger}
          />

          <ResumoCard
            icon="build"
            label="Andamento"
            value={andamento}
            color={colors.warning}
          />

          <ResumoCard
            icon="check-circle"
            label="Concluídos"
            value={concluidos}
            color={colors.success}
          />
        </View>

        <View style={styles.filtros}>
          <FiltroButton
            label="Todos"
            active={filtro === "TODOS"}
            onPress={() => setFiltro("TODOS")}
          />

          <FiltroButton
            label="Abertos"
            active={filtro === "ABERTO"}
            onPress={() => setFiltro("ABERTO")}
          />

          <FiltroButton
            label="Andamento"
            active={filtro === "EM_ANDAMENTO"}
            onPress={() => setFiltro("EM_ANDAMENTO")}
          />

          <FiltroButton
            label="Concluídos"
            active={filtro === "CONCLUIDO"}
            onPress={() => setFiltro("CONCLUIDO")}
          />
        </View>

        <FlatList
          data={chamadosFiltrados}
          keyExtractor={(item) => String(item.id)}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <Text style={styles.emptyText}>
              Nenhum chamado encontrado neste filtro.
            </Text>
          }
          renderItem={({ item }) => (
            <ChamadoCard
              chamado={item}
              onPress={() => router.push(`/chamados/${item.id}` as any)}
            />
          )}
        />
      </View>
    </View>
  );
}

function ResumoCard({
  icon,
  label,
  value,
  color,
}: {
  icon: keyof typeof MaterialIcons.glyphMap;
  label: string;
  value: number;
  color: string;
}) {
  return (
    <View style={styles.resumoCard}>
      <MaterialIcons name={icon} size={26} color={color} />
      <Text style={styles.resumoValue}>{value}</Text>
      <Text style={styles.resumoLabel}>{label}</Text>
    </View>
  );
}

function FiltroButton({
  label,
  active,
  onPress,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      style={[styles.filtroButton, active && styles.filtroButtonActive]}
      onPress={onPress}
    >
      <Text style={[styles.filtroText, active && styles.filtroTextActive]}>
        {label}
      </Text>
    </Pressable>
  );
}

function ChamadoCard({
  chamado,
  onPress,
}: {
  chamado: ChamadoTecnico;
  onPress: () => void;
}) {
  const equipamento = chamado.equipamento;
  const sala = equipamento?.sala;

  return (
    <Pressable style={styles.card} onPress={onPress}>
      <View style={styles.cardHeader}>
        <View style={styles.tipoBox}>
          <MaterialIcons
            name={equipamento?.tipo === "LUMINARIA" ? "lightbulb" : "ac-unit"}
            size={26}
            color={colors.primary}
          />
        </View>

        <View style={styles.cardTitleArea}>
          <Text style={styles.cardTitle}>
            {equipamento?.tipo === "LUMINARIA"
              ? "Luminária"
              : "Ar-condicionado"}
          </Text>

          <Text style={styles.cardSubtitle}>
            {sala?.codigo_sala || "Sala não informada"}
          </Text>
        </View>

        <PrioridadeBadge prioridade={chamado.prioridade} />
      </View>

      <View style={styles.locationRow}>
        <MaterialIcons name="place" size={17} color={colors.muted} />

        <Text style={styles.locationText}>
          {sala?.bloco || "Bloco não informado"} •{" "}
          {sala?.andar || "Andar não informado"}
        </Text>
      </View>

      <Text style={styles.descricao} numberOfLines={2}>
        {chamado.descricao_problema}
      </Text>
      {chamado.status_chamado === "CONCLUIDO" &&
        chamado.ultima_acao && (
          <View style={styles.acaoBox}>
            <Text style={styles.acaoTitulo}>
              Ação realizada
            </Text>

            <Text style={styles.acaoTexto}>
              {chamado.ultima_acao}
            </Text>
          </View>
      )}
      <View style={styles.footer}>
        <StatusBadge status={chamado.status_chamado} />

        <View style={styles.atenderButton}>
          <Text style={styles.atenderText}>Atender</Text>
          <MaterialIcons name="chevron-right" size={20} color={colors.text} />
        </View>
      </View>
    </Pressable>
  );
}

function PrioridadeBadge({ prioridade }: { prioridade: string }) {
  const config =
    prioridade === "ALTA"
      ? { label: "ALTA", color: colors.danger, bg: "#FDECEC" }
      : prioridade === "MEDIA"
      ? { label: "MÉDIA", color: colors.warning, bg: "#FFF4E5" }
      : { label: "BAIXA", color: colors.success, bg: "#EAF6EC" };

  return (
    <Text
      style={[
        styles.prioridadeBadge,
        {
          color: config.color,
          backgroundColor: config.bg,
        },
      ]}
    >
      {config.label}
    </Text>
  );
}

function StatusBadge({ status }: { status: string }) {
  const config =
    status === "ABERTO"
      ? { label: "Aberto", color: colors.danger, bg: "#FDECEC" }
      : status === "EM_ANDAMENTO"
      ? { label: "Em andamento", color: colors.warning, bg: "#FFF4E5" }
      : status === "CONCLUIDO"
      ? { label: "Concluído", color: colors.success, bg: "#EAF6EC" }
      : { label: "Cancelado", color: colors.muted, bg: "#EEF1F5" };

  return (
    <Text style={[styles.statusBadge, { color: config.color, backgroundColor: config.bg }]}>
      {config.label}
    </Text>
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
    backgroundColor: colors.background,
  },

  resumoGrid: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 16,
  },

  resumoCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
  },

  resumoValue: {
    fontSize: 22,
    fontWeight: "900",
    color: colors.text,
    marginTop: 6,
  },

  resumoLabel: {
    fontSize: 12,
    fontWeight: "800",
    color: colors.muted,
    marginTop: 2,
  },

  filtros: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 16,
  },

  filtroButton: {
    paddingHorizontal: 13,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },

  filtroButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },

  filtroText: {
    color: colors.text,
    fontWeight: "800",
    fontSize: 12,
  },

  filtroTextActive: {
    color: "#fff",
  },

  emptyText: {
    color: colors.muted,
    fontWeight: "700",
    textAlign: "center",
    marginTop: 30,
  },

  card: {
    backgroundColor: colors.surface,
    borderRadius: 22,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 14,
  },

  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 12,
  },

  tipoBox: {
    width: 52,
    height: 52,
    borderRadius: 17,
    backgroundColor: "#EEF2FF",
    alignItems: "center",
    justifyContent: "center",
  },

  cardTitleArea: {
    flex: 1,
  },

  cardTitle: {
    fontSize: 17,
    fontWeight: "900",
    color: colors.text,
  },

  cardSubtitle: {
    color: colors.primary,
    fontWeight: "800",
    marginTop: 3,
  },

  prioridadeBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    fontSize: 11,
    fontWeight: "900",
    overflow: "hidden",
  },

  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 10,
  },

  locationText: {
    color: colors.muted,
    fontWeight: "700",
  },

  descricao: {
    color: colors.text,
    fontSize: 15,
    lineHeight: 21,
    marginBottom: 14,
  },

  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    fontSize: 12,
    fontWeight: "900",
    overflow: "hidden",
  },

  atenderButton: {
    backgroundColor: colors.secondary,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },

  atenderText: {
    color: colors.text,
    fontWeight: "900",
    fontSize: 12,
  },
  acaoBox: {
  backgroundColor: "#EAF6EC",
  borderRadius: 12,
  padding: 12,
  marginBottom: 12,
},

acaoTitulo: {
  color: colors.success,
  fontWeight: "900",
  marginBottom: 4,
},

acaoTexto: {
  color: colors.text,
  lineHeight: 20,
},
});
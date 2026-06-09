import { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

import { AppHeader } from "@/components/AppHeader";
import { BackButton } from "@/components/BackButton";
import { colors } from "@/theme/colors";
import { obterDashboardAdmin } from "@/services/dashboard";
import { DashboardAdmin } from "@/types/dashboard";

export default function DashboardTecnicoScreen() {
  const [dashboard, setDashboard] = useState<DashboardAdmin | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    carregar();
  }, []);

  async function carregar() {
    try {
      const dados = await obterDashboardAdmin();
      setDashboard(dados);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text>Carregando dashboard...</Text>
      </View>
    );
  }

  if (!dashboard) {
    return (
      <View style={styles.center}>
        <Text>Não foi possível carregar o dashboard.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <AppHeader
        title="Dashboard"
        subtitle="Visão geral da manutenção"
        icon="dashboard"
      />
        <View style={{ paddingHorizontal: 20 }}>
            <BackButton />
          </View>
      <ScrollView contentContainerStyle={styles.content}>


        <Text style={styles.sectionTitle}>Chamados</Text>

        <View style={styles.grid}>
          <MetricCard
            icon="error"
            label="Abertos"
            value={dashboard.chamados_abertos}
            color={colors.danger}
          />

          <MetricCard
            icon="build"
            label="Andamento"
            value={dashboard.chamados_em_andamento}
            color={colors.warning}
          />

          <MetricCard
            icon="check-circle"
            label="Concluídos"
            value={dashboard.chamados_concluidos}
            color={colors.success}
          />

          <MetricCard
            icon="cancel"
            label="Cancelados"
            value={dashboard.chamados_cancelados}
            color={colors.muted}
          />
        </View>

        <Text style={styles.sectionTitle}>Equipamentos</Text>

        <View style={styles.grid}>
          <MetricCard
            icon="precision-manufacturing"
            label="Total"
            value={dashboard.total_equipamentos}
            color={colors.primary}
          />

          <MetricCard
            icon="report-problem"
            label="Defeito"
            value={dashboard.equipamentos_com_defeito}
            color={colors.danger}
          />

          <MetricCard
            icon="engineering"
            label="Manutenção"
            value={dashboard.equipamentos_em_manutencao}
            color={colors.warning}
          />
        </View>
      </ScrollView>
    </View>
  );
}

function MetricCard({
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
    <View style={styles.metricCard}>
      <MaterialIcons name={icon} size={28} color={color} />
      <Text style={styles.metricValue}>{value}</Text>
      <Text style={styles.metricLabel}>{label}</Text>
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
    backgroundColor: colors.background,
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "900",
    color: colors.text,
    marginBottom: 12,
    marginTop: 10,
  },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 18,
  },

  metricCard: {
    width: "47%",
    backgroundColor: colors.surface,
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
  },

  metricValue: {
    fontSize: 26,
    fontWeight: "900",
    color: colors.text,
    marginTop: 8,
  },

  metricLabel: {
    color: colors.muted,
    fontWeight: "800",
    marginTop: 4,
  },
});
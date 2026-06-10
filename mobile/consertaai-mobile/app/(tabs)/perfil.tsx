import { View, Text, Pressable, StyleSheet, ScrollView } from "react-native";
import { router } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";

import { useAuth } from "@/contexts/AuthContext";
import { AppHeader } from "@/components/AppHeader";
import { colors } from "@/theme/colors";

export default function PerfilScreen() {
  const { user, logout } = useAuth();

  async function handleLogout() {
    await logout();
    router.replace("/login");
  }

  function tipoUsuarioLabel() {
    if (user?.tipo_usuario === "TECNICO" || user?.is_tecnico) {
      return "Técnico";
    }

    if (user?.tipo_usuario === "SERVIDOR") {
      return "Servidor";
    }

    return "Usuário comum";
  }

  function tipoUsuarioIcon() {
    if (user?.tipo_usuario === "TECNICO" || user?.is_tecnico) {
      return "engineering";
    }

    if (user?.tipo_usuario === "SERVIDOR") {
      return "badge";
    }

    return "person";
  }

  function tipoUsuarioColor() {
    if (user?.tipo_usuario === "TECNICO" || user?.is_tecnico) {
      return colors.success;
    }

    if (user?.tipo_usuario === "SERVIDOR") {
      return colors.primary;
    }

    return colors.muted;
  }

  return (
    <View style={styles.container}>
      <AppHeader
        title="Perfil"
        subtitle="Informações da conta"
        icon="person"
      />

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.profileCard}>
          <View
            style={[
              styles.avatar,
              { backgroundColor: `${tipoUsuarioColor()}22` },
            ]}
          >
            <MaterialIcons
              name={tipoUsuarioIcon() as any}
              size={44}
              color={tipoUsuarioColor()}
            />
          </View>

          <Text style={styles.name}>
            {user?.first_name || user?.username || "Usuário"}
          </Text>

          <View
            style={[
              styles.badge,
              { backgroundColor: `${tipoUsuarioColor()}22` },
            ]}
          >
            <Text style={[styles.badgeText, { color: tipoUsuarioColor() }]}>
              {tipoUsuarioLabel()}
            </Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Dados da conta</Text>

        <View style={styles.infoCard}>
          <InfoRow
            icon="person"
            label="Usuário"
            value={user?.username || "Não informado"}
          />

          <InfoRow
            icon="email"
            label="E-mail"
            value={user?.email || "Não informado"}
          />

          <InfoRow
            icon="badge"
            label="Tipo de usuário"
            value={tipoUsuarioLabel()}
          />

          <InfoRow
            icon="priority-high"
            label="Pode definir prioridade"
            value={user?.pode_definir_prioridade ? "Sim" : "Não"}
          />
        </View>

        <Text style={styles.sectionTitle}>Permissões</Text>

        <View style={styles.infoCard}>
          <PermissionItem
            enabled
            text="Abrir chamados"
          />

          <PermissionItem
            enabled
            text="Visualizar salas e equipamentos"
          />

          <PermissionItem
            enabled={!!user?.pode_definir_prioridade}
            text="Definir prioridade dos chamados"
          />

          <PermissionItem
            enabled={!!user?.is_tecnico}
            text="Acessar painel técnico"
          />

          <PermissionItem
            enabled={!!user?.is_tecnico}
            text="Acessar dashboard administrativo"
          />
        </View>

        <Pressable style={styles.logoutButton} onPress={handleLogout}>
          <MaterialIcons name="logout" size={22} color="#fff" />
          <Text style={styles.logoutText}>Sair da conta</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}

function InfoRow({
  icon,
  label,
  value,
}: {
  icon: keyof typeof MaterialIcons.glyphMap;
  label: string;
  value: string;
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

function PermissionItem({
  enabled,
  text,
}: {
  enabled: boolean;
  text: string;
}) {
  return (
    <View style={styles.permissionRow}>
      <MaterialIcons
        name={enabled ? "check-circle" : "cancel"}
        size={22}
        color={enabled ? colors.success : colors.muted}
      />

      <Text
        style={[
          styles.permissionText,
          !enabled && styles.permissionDisabled,
        ]}
      >
        {text}
      </Text>
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

  profileCard: {
    backgroundColor: colors.surface,
    borderRadius: 24,
    padding: 24,
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 22,
  },

  avatar: {
    width: 92,
    height: 92,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
  },

  name: {
    fontSize: 24,
    fontWeight: "900",
    color: colors.text,
    textAlign: "center",
  },

  badge: {
    marginTop: 12,
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 999,
  },

  badgeText: {
    fontWeight: "900",
    fontSize: 13,
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
    fontWeight: "800",
    marginTop: 2,
  },

  permissionRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 9,
  },

  permissionText: {
    color: colors.text,
    fontWeight: "800",
    flex: 1,
  },

  permissionDisabled: {
    color: colors.muted,
  },

  logoutButton: {
    backgroundColor: colors.danger,
    borderRadius: 16,
    padding: 15,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },

  logoutText: {
    color: "#fff",
    fontWeight: "900",
    fontSize: 16,
  },
});
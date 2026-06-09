import { View, Text, Pressable, StyleSheet } from "react-native";
import { router } from "expo-router";
import { useAuth } from "@/contexts/AuthContext";
import { AppHeader } from "@/components/AppHeader";
import { colors } from "@/theme/colors";

export default function PerfilScreen() {
  const { user, logout } = useAuth();

  async function handleLogout() {
    await logout();
    router.replace("/login" as any);
  }

  return (
    <View style={styles.container}>
      <AppHeader
        title="Meu Perfil"
        subtitle={user?.first_name || user?.username}
        icon="person"
      />

      <View style={styles.content}>
        <View style={styles.card}>
          <Text style={styles.label}>Usuário</Text>
          <Text style={styles.value}>{user?.username}</Text>

          <Text style={styles.label}>E-mail</Text>
          <Text style={styles.value}>{user?.email || "Não informado"}</Text>

          <Text style={styles.label}>Tipo</Text>
          <Text style={styles.value}>
            {user?.is_tecnico ? "Técnico" : "Usuário comum"}
          </Text>
        </View>

        <Pressable style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Sair</Text>
        </Pressable>
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
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 20,
  },
  label: {
    color: colors.muted,
    fontWeight: "700",
    marginTop: 10,
  },
  value: {
    color: colors.text,
    fontSize: 16,
    marginTop: 4,
  },
  logoutButton: {
    backgroundColor: colors.danger,
    padding: 14,
    borderRadius: 12,
  },
  logoutText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
  },
});
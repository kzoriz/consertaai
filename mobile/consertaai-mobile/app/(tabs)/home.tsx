import { View, Text, StyleSheet } from "react-native";
import { router } from "expo-router";
import { useAuth } from "@/contexts/AuthContext";
import { AppHeader } from "@/components/AppHeader";
import { MenuButton } from "@/components/MenuButton";
import { colors } from "@/theme/colors";

export default function Home() {
  const { user, logout } = useAuth();

  async function handleLogout() {
    await logout();
    router.replace("/login" as any);
  }

  return (
    <View style={styles.container}>
      <AppHeader
        title="Conserta Aí"
        subtitle={`Olá, ${user?.first_name || user?.username}`}
        icon="home-repair-service"
      />

      <View style={styles.content}>
        <Text style={styles.sectionTitle}>Menu principal</Text>

        <MenuButton
          title="Salas e Equipamentos"
          icon="meeting-room"
          onPress={() => router.push("/salas" as any)}
        />

        <MenuButton
          title="Meus Chamados"
          icon="assignment"
          onPress={() => router.push("/(tabs)/chamados" as any)}
        />

        <MenuButton
          title="Validar Localização"
          icon="my-location"
          onPress={() => router.push("/(tabs)/gps" as any)}
        />

        {user?.is_tecnico && (
          <MenuButton
            title="Painel Técnico"
            icon="engineering"
            onPress={() => router.push("/tecnico/chamados" as any)}
          />
        )}

        {/*<MenuButton*/}
        {/*  title="Sair"*/}
        {/*  icon="logout"*/}
        {/*  danger*/}
        {/*  onPress={handleLogout}*/}
        {/*/>*/}
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
  sectionTitle: {
    fontSize: 16,
    color: colors.muted,
    fontWeight: "700",
    marginBottom: 14,
  },
});
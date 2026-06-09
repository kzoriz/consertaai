import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
} from "react-native";
import { router } from "expo-router";

import { useAuth } from "@/contexts/AuthContext";
import { AppHeader } from "@/components/AppHeader";
import { MenuGridItem } from "@/components/MenuGridItem";
import { colors } from "@/theme/colors";

const { width } = Dimensions.get("window");

export default function Home() {
  const { user } = useAuth();

  return (
    <View style={styles.container}>
      <AppHeader
        title="Conserta Aí"
        subtitle={`Olá, ${user?.first_name || user?.username}`}
        icon="home-repair-service"
      />

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <Text style={styles.sectionTitle}>Acesso rápido</Text>

          <View style={styles.grid}>
            <MenuGridItem
              title="Localizar Sala"
              icon="location-city"
              onPress={() => router.push("/localizacao" as any)}
            />

            <MenuGridItem
              title="Meus Chamados"
              icon="assignment"
              onPress={() => router.push("/chamados" as any)}
            />

            {user?.is_tecnico && (
              <MenuGridItem
                title="Painel Técnico"
                icon="engineering"
                highlight
                onPress={() => router.push("/tecnico/chamados" as any)}
              />
            )}
            {user?.is_tecnico && (
            <MenuGridItem
              title="Dashboard"
              icon="dashboard"
              highlight
              onPress={() => router.push("/tecnico/dashboard" as any)}
            />
            )}
          </View>

        </View>
      </ScrollView>
    </View>
  );
}

const slideWidth = width - 40;

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
    fontWeight: "800",
    marginBottom: 14,
  },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 20,
  },

  slider: {
    marginBottom: 24,
  },

  slide: {
    width: slideWidth,
    minHeight: 150,
    backgroundColor: colors.surface,
    borderRadius: 24,
    padding: 20,
    marginRight: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },

  slideIcon: {
    fontSize: 36,
    marginBottom: 10,
  },

  slideTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: colors.text,
    marginBottom: 8,
  },

  slideText: {
    fontSize: 15,
    color: colors.muted,
    lineHeight: 21,
  },
});
import { View, Text, Pressable, StyleSheet } from "react-native";
import { router } from "expo-router";
import { useAuth } from "../src/contexts/AuthContext";

export default function Home() {
  const { user, logout } = useAuth();

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Conserta Aí UERN</Text>

      <Text style={styles.usuario}>
        Bem-vindo, {user?.first_name || user?.username}
      </Text>

      <Pressable
        style={styles.botao}
        onPress={() => router.push("/salas")}
      >
        <Text style={styles.botaoTexto}>
          Salas
        </Text>
      </Pressable>
      <Pressable
        style={styles.botao}
        onPress={() => router.push("/chamados" as any)}
      >
        <Text style={styles.botaoTexto}>Meus Chamados</Text>
      </Pressable>
        <Pressable
          style={styles.botaoSair}
          onPress={async () => {
            await logout();
            router.replace("/login" as any);
          }}
        >
          <Text style={styles.botaoTexto}>Sair</Text>
        </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 24,
  },

  titulo: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 10,
  },

  usuario: {
    marginBottom: 30,
  },

  botao: {
    backgroundColor: "#2196F3",
    padding: 14,
    borderRadius: 8,
    marginBottom: 12,
  },

  botaoSair: {
    backgroundColor: "#e53935",
    padding: 14,
    borderRadius: 8,
  },

  botaoTexto: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
  },
});
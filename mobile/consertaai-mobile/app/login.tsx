import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  Alert,
  StyleSheet,
} from "react-native";
import { Link, router } from "expo-router";
import { useAuth } from "../src/contexts/AuthContext";

export default function Login() {
  const { login } = useAuth();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [carregando, setCarregando] = useState(false);

  async function handleLogin() {
    if (!username || !password) {
      Alert.alert("Atenção", "Informe usuário e senha.");
      return;
    }

    try {
      setCarregando(true);
      await login(username, password);
      router.replace("/home" as any);
    } catch (error) {
      Alert.alert("Erro", "Usuário ou senha inválidos.");
    } finally {
      setCarregando(false);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Conserta Aí UERN</Text>
      <Text style={styles.subtitulo}>Acesse sua conta</Text>

      <TextInput
        style={styles.input}
        placeholder="Usuário"
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder="Senha"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <Button
        title={carregando ? "Entrando..." : "Entrar"}
        onPress={handleLogin}
        disabled={carregando}
      />

      <Link href="/cadastro" style={styles.link}>
        Criar uma conta
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 24,
    backgroundColor: "#f5f7fa",
  },
  titulo: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 8,
  },
  subtitulo: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 32,
    color: "#555",
  },
  input: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  link: {
    marginTop: 20,
    textAlign: "center",
    color: "#0066cc",
    fontWeight: "bold",
  },
});
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

export default function Cadastro() {
  const { cadastro } = useAuth();

  const [firstName, setFirstName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [carregando, setCarregando] = useState(false);

  async function handleCadastro() {
    if (!username || !email || !password) {
      Alert.alert("Atenção", "Preencha usuário, e-mail e senha.");
      return;
    }

    try {
      setCarregando(true);

      await cadastro(username, email, password, firstName);

      router.replace("/home" as any);
    } catch (error) {
      Alert.alert("Erro", "Não foi possível criar sua conta.");
    } finally {
      setCarregando(false);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Criar conta</Text>
      <Text style={styles.subtitulo}>Conserta Aí UERN</Text>

      <TextInput
        style={styles.input}
        placeholder="Nome"
        value={firstName}
        onChangeText={setFirstName}
      />

      <TextInput
        style={styles.input}
        placeholder="Usuário"
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder="E-mail"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />

      <TextInput
        style={styles.input}
        placeholder="Senha"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <Button
        title={carregando ? "Criando..." : "Cadastrar"}
        onPress={handleCadastro}
        disabled={carregando}
      />

      <Link href="/login" style={styles.link}>
        Já tenho conta
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
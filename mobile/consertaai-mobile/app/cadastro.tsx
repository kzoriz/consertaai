import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  Alert,
  StyleSheet,
  ScrollView,
} from "react-native";
import { Link, router } from "expo-router";
import { useAuth } from "@/contexts/AuthContext";
import { colors } from "@/theme/colors";

export default function Cadastro() {
  const { cadastro } = useAuth();

  const [firstName, setFirstName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [tipoUsuario, setTipoUsuario] = useState("COMUM");
  const [codigoAcesso, setCodigoAcesso] = useState("");

  const [carregando, setCarregando] = useState(false);

  async function handleCadastro() {
    if (!username || !email || !password) {
      Alert.alert("Atenção", "Preencha usuário, e-mail e senha.");
      return;
    }

    if (tipoUsuario !== "COMUM" && !codigoAcesso.trim()) {
      Alert.alert("Atenção", "Informe o código de acesso.");
      return;
    }

    try {
      setCarregando(true);

      await cadastro(
        username,
        email,
        password,
        firstName,
        tipoUsuario,
        codigoAcesso
      );

      router.replace("/gps" as any);
    } catch (error: any) {
      const mensagem =
        error?.response?.data?.erro || "Não foi possível criar sua conta.";

      Alert.alert("Erro", mensagem);
    } finally {
      setCarregando(false);
    }
  }

  function selecionarTipo(tipo: string) {
    setTipoUsuario(tipo);

    if (tipo === "COMUM") {
      setCodigoAcesso("");
    }
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
    >
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

      <Text style={styles.label}>Tipo de usuário</Text>

      <View style={styles.tipoGrid}>
        <TipoButton
          label="Comum"
          active={tipoUsuario === "COMUM"}
          onPress={() => selecionarTipo("COMUM")}
        />

        <TipoButton
          label="Servidor"
          active={tipoUsuario === "SERVIDOR"}
          onPress={() => selecionarTipo("SERVIDOR")}
        />

        <TipoButton
          label="Técnico"
          active={tipoUsuario === "TECNICO"}
          onPress={() => selecionarTipo("TECNICO")}
        />
      </View>

      {tipoUsuario !== "COMUM" && (
        <>
          <Text style={styles.codigoHint}>
            Informe o código institucional para criar uma conta como{" "}
            {tipoUsuario === "SERVIDOR" ? "servidor" : "técnico"}.
          </Text>

          <TextInput
            style={styles.input}
            placeholder="Código de acesso"
            value={codigoAcesso}
            onChangeText={setCodigoAcesso}
            autoCapitalize="characters"
            secureTextEntry
          />
        </>
      )}

      <Pressable
        style={[styles.botao, carregando && styles.botaoDesabilitado]}
        onPress={handleCadastro}
        disabled={carregando}
      >
        <Text style={styles.botaoTexto}>
          {carregando ? "Criando..." : "Cadastrar"}
        </Text>
      </Pressable>

      <Link href="/login" style={styles.link}>
        Já tenho conta
      </Link>
    </ScrollView>
  );
}

function TipoButton({
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
      style={[styles.tipoButton, active && styles.tipoButtonActive]}
      onPress={onPress}
    >
      <Text style={[styles.tipoText, active && styles.tipoTextActive]}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  content: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 24,
  },

  titulo: {
    fontSize: 30,
    fontWeight: "900",
    textAlign: "center",
    marginBottom: 8,
    color: colors.text,
  },

  subtitulo: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 28,
    color: colors.muted,
    fontWeight: "700",
  },

  label: {
    fontWeight: "900",
    color: colors.text,
    marginBottom: 8,
    marginTop: 4,
  },

  input: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    padding: 13,
    marginBottom: 12,
    color: colors.text,
  },

  tipoGrid: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 12,
  },

  tipoButton: {
    flex: 1,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
  },

  tipoButtonActive: {
    backgroundColor: colors.secondary,
    borderColor: colors.secondary,
  },

  tipoText: {
    fontWeight: "900",
    color: colors.text,
    fontSize: 12,
  },

  tipoTextActive: {
    color: colors.text,
  },

  codigoHint: {
    color: colors.muted,
    fontWeight: "700",
    fontSize: 12,
    lineHeight: 18,
    marginBottom: 8,
  },

  botao: {
    backgroundColor: colors.primary,
    borderRadius: 14,
    padding: 15,
    marginTop: 4,
  },

  botaoDesabilitado: {
    opacity: 0.6,
  },

  botaoTexto: {
    color: "#fff",
    fontWeight: "900",
    textAlign: "center",
    fontSize: 16,
  },

  link: {
    marginTop: 20,
    textAlign: "center",
    color: colors.primary,
    fontWeight: "900",
  },
});
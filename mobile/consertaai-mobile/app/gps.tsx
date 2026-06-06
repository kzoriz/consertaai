import { useState } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from "react-native";
import { router } from "expo-router";
import * as Location from "expo-location";

import { listarPerimetros, verificarGPS } from "../src/services/gps";

export default function GPSScreen() {
  const [loading, setLoading] = useState(false);
  const [mensagem, setMensagem] = useState("");

  async function validarLocalizacao() {
    try {
      setLoading(true);
      setMensagem("Solicitando permissão de localização...");

      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        Alert.alert(
          "Permissão negada",
          "Você precisa permitir o acesso à localização."
        );
        return;
      }

      setMensagem("Obtendo localização atual...");

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      const latitude = location.coords.latitude;
      const longitude = location.coords.longitude;

      setMensagem("Verificando perímetro...");

      const perimetros = await listarPerimetros();

      if (!perimetros.length) {
        Alert.alert("Erro", "Nenhum perímetro ativo cadastrado.");
        return;
      }

      const perimetro = perimetros[0];

      const resultado = await verificarGPS(
        perimetro.id,
        latitude,
        longitude
      );

      if (resultado.dentro_perimetro) {
        Alert.alert(
          "Localização validada",
          `Você está dentro do raio permitido. Distância: ${resultado.distancia_metros}m`
        );

        router.replace("/home");
      } else {
        Alert.alert(
          "Fora do perímetro",
          `Você está fora do raio permitido. Distância: ${resultado.distancia_metros}m | Raio permitido: ${resultado.raio_metros}m`
        );
      }
    } catch (error) {
      console.log(error);
      Alert.alert("Erro", "Não foi possível validar sua localização.");
    } finally {
      setLoading(false);
      setMensagem("");
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Validação de Localização</Text>

      <Text style={styles.texto}>
        Para acessar os recursos do Conserta Aí UERN, valide se você está dentro
        do raio permitido do campus.
      </Text>

      {loading && (
        <View style={styles.loadingArea}>
          <ActivityIndicator size="large" />
          <Text style={styles.mensagem}>{mensagem}</Text>
        </View>
      )}

      <Pressable
        style={[styles.botao, loading && styles.botaoDesabilitado]}
        onPress={validarLocalizacao}
        disabled={loading}
      >
        <Text style={styles.botaoTexto}>
          {loading ? "Validando..." : "Validar GPS"}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
    backgroundColor: "#f5f7fa",
  },

  titulo: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },

  texto: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 32,
    color: "#555",
  },

  loadingArea: {
    alignItems: "center",
    marginBottom: 24,
  },

  mensagem: {
    marginTop: 12,
    color: "#555",
  },

  botao: {
    backgroundColor: "#2196F3",
    padding: 14,
    borderRadius: 8,
  },

  botaoDesabilitado: {
    opacity: 0.6,
  },

  botaoTexto: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
  },
});
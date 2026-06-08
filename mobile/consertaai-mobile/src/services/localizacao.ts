import api from "./api";

export async function listarPredios() {
  const response = await api.get("/salas/predios");
  return response.data;
}

export async function listarAndares(predio: string) {
  const response = await api.get("/salas/andares", {
    params: { predio },
  });

  return response.data;
}

export async function listarBlocos(
  predio: string,
  andar: string
) {
  const response = await api.get("/salas/blocos", {
    params: { predio, andar },
  });

  return response.data;
}

export async function listarSalasPorLocal(
  predio: string,
  andar: string,
  bloco: string
) {
  const response = await api.get("/salas/por-local", {
    params: { predio, andar, bloco },
  });

  return response.data;
}
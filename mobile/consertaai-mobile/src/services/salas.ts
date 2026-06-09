import api from "./api";

export async function listarSalas() {
  const response = await api.get("/salas");
  return response.data;
}

export async function listarEquipamentosDaSala(salaId: string | number) {
  const response = await api.get(`/salas/${salaId}/equipamentos`);
  return response.data;
}

export async function obterSala(salaId: string | number) {
  const response = await api.get(`/salas/${salaId}`);
  return response.data;
}
import api from "./api";

export async function listarChamadosTecnico() {
  const response = await api.get("/tecnico/chamados");
  return response.data;
}
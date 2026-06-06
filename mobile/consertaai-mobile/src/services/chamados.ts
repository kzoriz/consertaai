import api from "./api";

export async function listarMeusChamados() {
  const response = await api.get("/meus-chamados");
  return response.data;
}
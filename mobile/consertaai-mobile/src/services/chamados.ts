import api from "./api";

export async function listarMeusChamados() {
  const response = await api.get("/meus-chamados");
  return response.data;
}

export async function obterChamado(chamadoId: string | number) {
  const response = await api.get(`/chamados/${chamadoId}`);
  return response.data;
}

export async function listarHistoricoChamado(chamadoId: string | number) {
  const response = await api.get(`/chamados/${chamadoId}/historico`);
  return response.data;
}

export async function atualizarStatusChamado(
  chamadoId: string | number,
  statusChamado: string
) {
  const response = await api.put(`/chamados/${chamadoId}/status`, {
    status_chamado: statusChamado,
  });

  return response.data;
}

export async function adicionarHistoricoChamado(
  chamadoId: string | number,
  acaoRealizada: string,
  observacoes?: string
) {
  const response = await api.post(`/chamados/${chamadoId}/historico`, {
    acao_realizada: acaoRealizada,
    observacoes: observacoes || "",
  });

  return response.data;
}
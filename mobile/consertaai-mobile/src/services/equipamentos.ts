import api from "./api";

export async function obterEquipamento(equipamentoId: string | number) {
  const response = await api.get(`/equipamentos/${equipamentoId}`);
  return response.data;
}

export async function abrirChamado(
  equipamentoId: string | number,
  descricaoProblema: string
) {
  const response = await api.post("/chamados", {
    equipamento_id: Number(equipamentoId),
    descricao_problema: descricaoProblema,
  });

  return response.data;
}
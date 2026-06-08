import {Equipamento} from "@/types/equipamentos";

export type ChamadoTecnico = {
  id: number;
  usuario_id: number;
  equipamento_id: number;
  descricao_problema: string;
  prioridade: string;
  status_chamado: string;
  ultima_acao?: string;
  equipamento: Equipamento;
};
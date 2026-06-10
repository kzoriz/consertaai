export type SalaStatusDashboard = {
  sala_id: number;
  codigo_sala: string;
  predio: string;
  bloco: string;
  andar: string;
  descricao?: string;
  status: "NORMAL" | "ABERTO" | "EM_ANDAMENTO";
  chamados_abertos: number;
  chamados_em_andamento: number;
  chamados_concluidos: number;
  equipamentos_total: number;
  equipamentos_operando: number;
  equipamentos_defeito: number;
  equipamentos_manutencao: number;
};

export type DashboardAdmin = {
  chamados_abertos: number;
  chamados_em_andamento: number;
  chamados_concluidos: number;
  chamados_cancelados: number;
  equipamentos_com_defeito: number;
  equipamentos_em_manutencao: number;
  total_equipamentos: number;
  salas_status: SalaStatusDashboard[];
};
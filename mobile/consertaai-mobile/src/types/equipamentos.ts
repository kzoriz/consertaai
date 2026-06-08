export type SalaResumo = {
  id: number;
  predio: string;
  codigo_sala: string;
  bloco: string;
  andar: string;
  descricao?: string;
};

export type Equipamento = {
  id: number;
  sala_id: number;
  sala?: SalaResumo;
  patrimonio: string;
  tipo: string;
  status_atual: string;
  posicao_x: number;
  posicao_y: number;
};
import api from "./api";
import { ChamadoTecnico } from "@/types/chamadoTecnico";
export async function listarChamadosTecnico(): Promise<ChamadoTecnico[]> {
  const response = await api.get("/tecnico/chamados");
  return response.data;
}
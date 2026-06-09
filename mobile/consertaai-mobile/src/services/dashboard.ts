import api from "./api";
import { DashboardAdmin } from "@/types/dashboard";

export async function obterDashboardAdmin(): Promise<DashboardAdmin> {
  const response = await api.get("/admin/dashboard");
  return response.data;
}
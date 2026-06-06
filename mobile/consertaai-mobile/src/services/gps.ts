import api from "./api";

export async function listarPerimetros() {
  const response = await api.get("/perimetros");
  return response.data;
}

export async function verificarGPS(
  perimetroId: number,
  latitude: number,
  longitude: number
) {
  const response = await api.post("/verificar-gps", {
    perimetro_id: perimetroId,
    latitude,
    longitude,
  });

  return response.data;
}
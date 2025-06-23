const API_URL = "http://localhost:3001/api";
export const registrarSocio = async (datos) => {
  const res = await fetch(`${API_URL}/socios`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(datos),
  });

  const data = await res.json();
  if (!res.ok || !data.success)
    throw new Error(data.error || "Error al registrar socio");
  return data;
};

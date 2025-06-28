const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3001";

export const registrarSocio = async (datos) => {
  const res = await fetch(`${API_URL}/api/socios`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(datos),
  });

  const data = await res.json();
  if (!res.ok || !data.success)
    throw new Error(data.error || "Error al registrar socio");
  return data;
};

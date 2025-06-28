const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3001";

export async function obtenerCobros() {
  const res = await fetch(`${API_URL}/api/cobros`);
  if (!res.ok) {
    throw new Error("Error al obtener los registros de cobros");
  }
  const data = await res.json();
  return data;
}
export async function enviarCobro(cobro) {
  console.log("Enviando a backend:", cobro);

  const res = await fetch(`${API_URL}/api/cobros`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(cobro),
  });

  if (!res.ok) {
    const errorText = await res.text();
    console.error("Respuesta del backend:", errorText); // 👈 VER EL ERROR REAL
    throw new Error("Error al registrar el cobro");
  }

  return await res.json();
}

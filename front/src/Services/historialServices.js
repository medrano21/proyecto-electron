const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3001";

export async function obtenerHistorial() {
  const res = await fetch(`${API_URL}/api/historial`);
  if (!res.ok) throw new Error("Error al obtener el historial");
  return await res.json();
}

export async function filtrarPorMesAnio(mes, anio) {
  const res = await fetch(
    `${API_URL}/api/historial/mes-anio?mes=${mes}&anio=${anio}`
  );
  if (!res.ok) throw new Error("Error al filtrar por mes y año");
  return await res.json();
}

export async function filtrarPorDia(fecha) {
  const res = await fetch(`${API_URL}/api/historial/dia?fecha=${fecha}`);
  if (!res.ok) throw new Error("Error al filtrar por fecha");
  return await res.json();
}

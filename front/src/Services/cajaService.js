const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3001";

export const obtenerMovimientosCaja = async () => {
  const res = await fetch(`${API_URL}/api/caja`); // o la ruta que uses
  const data = await res.json();
  console.log("Movimientos recibidos:", data); // ✅ Ver qué llega
  return data;
};

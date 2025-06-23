export const obtenerMovimientosCaja = async () => {
  const res = await fetch("http://localhost:3001/api/caja"); // o la ruta que uses
  const data = await res.json();
  console.log("Movimientos recibidos:", data); // ✅ Ver qué llega
  return data;
};

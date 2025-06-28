const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3001";

export const obtenerSociosPorSexo = async () => {
  const response = await fetch(`${API_URL}/api/estadisticas/socios-por-sexo`);
  if (!response.ok) throw new Error("Error al obtener socios por sexo");
  return await response.json();
};

export const obtenerSociosPorPlan = async () => {
  const response = await fetch(`${API_URL}/api/estadisticas/socios-por-plan`);
  if (!response.ok) throw new Error("Error al obtener socios por plan");
  return await response.json();
};

export const obtenerSociosPorMes = async () => {
  const response = await fetch(`${API_URL}/api/estadisticas/socios-por-mes`);
  if (!response.ok) throw new Error("Error al obtener socios por mes");
  return await response.json();
};

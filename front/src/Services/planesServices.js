const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3001";

export const obtenerPlanes = async () => {
  const response = await fetch(`${API_URL}/api/planes`);
  if (!response.ok) throw new Error("Error al obtener los planes");
  return await response.json();
};

export const agregarPlan = async (plan) => {
  const response = await fetch(`${API_URL}/api/planes`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(plan),
  });
  if (!response.ok) throw new Error("Error al agregar el plan");
  return await response.json();
};

export const actualizarPlan = async (id, plan) => {
  const response = await fetch(`${API_URL}/api/planes/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(plan),
  });
  if (!response.ok) throw new Error("Error al actualizar el plan");
  return await response.json();
};

export const eliminarPlan = async (id) => {
  const response = await fetch(`${API_URL}/api/planes/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) throw new Error("Error al eliminar el plan");
  return await response.json();
};

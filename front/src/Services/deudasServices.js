const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

export const getSocios = () =>
  fetch(`${API_URL}/api/deudas/socios-deudas`).then((res) => res.json());

export const getDeudas = (id_socio) =>
  fetch(`${API_URL}/api/deudas/${id_socio}`).then((res) => res.json());

export const agregarDeuda = async (data) => {
  const res = await fetch(`${API_URL}/api/deudas`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  const json = await res.json();
  return json;
};

export const editarDeuda = (data) =>
  fetch(`${API_URL}/api/deudas`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

export const eliminarDeuda = (id) =>
  fetch(`${API_URL}/api/deudas/${id}`, { method: "DELETE" });

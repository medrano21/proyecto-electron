const API = "http://localhost:3001/api";

export const getSocios = () =>
  fetch(`${API}/deudas/socios-deudas`).then((res) => res.json());

export const getDeudas = (id_socio) =>
  fetch(`${API}/deudas/${id_socio}`).then((res) => res.json());

export const agregarDeuda = async (data) => {
  const res = await fetch(`${API}/deudas`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  const json = await res.json();
  return json;
};

export const editarDeuda = (data) =>
  fetch(`${API}/deudas`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

export const eliminarDeuda = (id) =>
  fetch(`${API}/deudas/${id}`, { method: "DELETE" });

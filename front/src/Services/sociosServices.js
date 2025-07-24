const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

export const obtenerSocios = async () => {
  const response = await fetch(`${API_URL}/api/socios`);
  if (!response.ok) throw new Error("Error al obtener los socios");
  return await response.json();
};
export const editarSocio = async (id, socioEditado) => {
  try {
    const response = await fetch(`http://localhost:3001/api/socios/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(socioEditado),
    });

    if (!response.ok) throw new Error("Error al editar el socio");

    return await response.json();
  } catch (error) {
    throw error;
  }
};

export const eliminarSocio = async (id) => {
  const response = await fetch(`${API_URL}/api/socios/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) throw new Error("Error al eliminar el socio");
  return await response.json();
};

export const buscarSocios = async (termino) => {
  const response = await fetch(
    `${API_URL}/api/socios/buscar?termino=${encodeURIComponent(termino)}`
  );
  if (!response.ok) throw new Error("Error al buscar socios");
  return await response.json();
};
export async function getSociosPorEstado(filtro) {
  const res = await fetch(`${API_URL}/api/estado_socios?filtro=${filtro}`);
  if (!res.ok) throw new Error("Error al obtener socios");
  return res.json();
}

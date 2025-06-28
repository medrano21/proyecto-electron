const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

export const buscarSocio = async (documento) => {
  try {
    const response = await fetch(`${API_URL}/api/accesos/buscar`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ documento }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.mensaje);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error al buscar socio:", error);
    throw error;
  }
};

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3001";

export async function login(usuario, pass) {
  const res = await fetch(`${API_URL}/api/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ usuario, pass }),
  });

  const data = await res.json();
  return { ok: res.ok, data };
}

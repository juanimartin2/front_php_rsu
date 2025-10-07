const handleResponse = async (res) => {
  const text = await res.text();
  try {
    return JSON.parse(text);
  } catch (e) {
    return { error: "Respuesta inválida del servidor", raw: text };
  }
};

export async function login(email, password) {
  try {
    const res = await fetch("/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    return await handleResponse(res);
  } catch (e) {
    console.error(e);
    return { error: "Error de red" };
  }
}

export async function register(nombre, email, password) {
  try {
    const res = await fetch("/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nombre, email, password }),
    });
    return await handleResponse(res);
  } catch (e) {
    console.error(e);
    return { error: "Error de red" };
  }
}

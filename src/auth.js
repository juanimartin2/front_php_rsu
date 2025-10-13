// helpers para localStorage
export function setUser(user) {
  try {
    localStorage.setItem("user", JSON.stringify(user));
  } catch (e) {
    console.error("Error guardando user en localStorage:", e);
  }
}

export function getUser() {
  try {
    const raw = localStorage.getItem("user");
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    console.error("Error leyendo user desde localStorage:", e);
    return null;
  }
}

export function isAuthenticated() {
  return !!getUser();
}

export function logout() {
  try {
    localStorage.removeItem("user");
  } catch (e) {
    console.error("Error removiendo user en localStorage:", e);
  }
}

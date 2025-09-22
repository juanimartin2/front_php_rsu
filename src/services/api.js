export async function register(nombre, email, password) {
  const res = await fetch("http://localhost:8000/register.php", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nombre, email, password })
  });
  return res.json();
}

export async function login(email, password) {
  const res = await fetch("http://localhost:8000/auth.php", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  });
  return res.json();
}
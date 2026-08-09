const API_URL = "http://localhost:3000";

function getToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
}

function authHeaders() {
  const token = getToken();
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export async function getCategories() {
  const res = await fetch(`${API_URL}/categories`, { cache: "no-store" });
  return res.json();
}

export async function getProducts() {
  const res = await fetch(`${API_URL}/products`, { cache: "no-store" });
  return res.json();
}

export async function getProduct(id: string) {
  const res = await fetch(`${API_URL}/products/${id}`, { cache: "no-store" });
  return res.json();
}

export async function createProduct(data: any) {
  const res = await fetch(`${API_URL}/products`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function updateProduct(id: string, data: any) {
  const res = await fetch(`${API_URL}/products/${id}`, {
    method: "PATCH",
    headers: authHeaders(),
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function deleteProduct(id: string) {
  const res = await fetch(`${API_URL}/products/${id}`, {
    method: "DELETE",
    headers: authHeaders(),
  });
  return res.json();
}

export async function createCategory(data: any) {
  const res = await fetch(`${API_URL}/categories`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function login(email: string, password: string) {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) {
    throw new Error("Giriş başarısız");
  }
  return res.json();
}
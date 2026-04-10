import { http } from "./http";

const TOKEN_KEY = "sje_admin_token";

export function getAdminToken() {
  return localStorage.getItem(TOKEN_KEY) || "";
}

export function setAdminToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearAdminToken() {
  localStorage.removeItem(TOKEN_KEY);
}

export async function loginAdmin(username: string, password: string) {
  const res = await http<{ token: string }>("/api/login", {
    method: "POST",
    body: JSON.stringify({ username, password }),
  });
  setAdminToken(res.token);
  return res.token;
}


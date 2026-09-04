import { Platform } from "react-native";

const LAN = process.env.EXPO_PUBLIC_API_URL;

export const API_URL =
  LAN ||
  (Platform.OS === "android" ? "http://10.0.2.2:3001" : "http://localhost:3001");

export async function api(path, { token, method = "GET", body } = {}) {
  const headers = { Accept: "application/json" };
  if (body !== undefined) headers["Content-Type"] = "application/json";
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const error = new Error(data.error || "Falha na requisição");
    error.status = res.status;
    throw error;
  }
  return data;
}

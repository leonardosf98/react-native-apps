export const PRODUCTION_API_URL = "https://react-native-apps.vercel.app";

export const API_URL = process.env.EXPO_PUBLIC_API_URL || PRODUCTION_API_URL;

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

export const PRODUCTION_API_URL = "https://react-native-apps.vercel.app";

export const API_URL = process.env.EXPO_PUBLIC_API_URL || PRODUCTION_API_URL;

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function xhrRequest(url, { method, headers, body }) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.timeout = 25000;
    xhr.onload = () => {
      let data = {};
      try {
        data = xhr.responseText ? JSON.parse(xhr.responseText) : {};
      } catch {
        data = {};
      }
      resolve({ status: xhr.status, data });
    };
    xhr.onerror = () => reject(new Error("Sem conexão com a API"));
    xhr.ontimeout = () => reject(new Error("A API demorou demais para responder"));
    xhr.open(method, url, true);
    Object.entries(headers).forEach(([key, value]) => {
      xhr.setRequestHeader(key, value);
    });
    xhr.send(body ?? null);
  });
}

async function send(url, options) {
  let lastError;
  for (let attempt = 0; attempt < 3; attempt += 1) {
    try {
      return await xhrRequest(url, options);
    } catch (error) {
      lastError = error;
      await sleep(400 * (attempt + 1));
    }
  }
  throw lastError;
}

export async function api(path, { token, method = "GET", body } = {}) {
  const headers = { Accept: "application/json" };
  if (body !== undefined) headers["Content-Type"] = "application/json";
  if (token) headers.Authorization = `Bearer ${token}`;

  const { status, data } = await send(`${API_URL}${path}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  if (status < 200 || status >= 300) {
    const error = new Error(data.error || "Falha na requisição");
    error.status = status;
    throw error;
  }
  return data;
}

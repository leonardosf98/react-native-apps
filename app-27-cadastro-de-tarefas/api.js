const BASE_URL = "https://tarefa-backend.onrender.com/tasks";

async function request(path, options = {}) {
  const response = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: { "Content-Type": "application/json", ...(options.headers || {}) },
  });
  const text = await response.text();
  const data = text ? JSON.parse(text) : null;
  if (!response.ok) {
    throw new Error((data && (data.message || data.error)) || `Erro ${response.status}`);
  }
  return data;
}

export function listTasks() {
  return request("");
}

export function getTask(id) {
  return request(`/${id}`);
}

export function createTask({ title, description }) {
  return request("", { method: "POST", body: JSON.stringify({ title, description }) });
}

export function updateTask(id, { title, description, finished }) {
  return request(`/${id}`, { method: "PUT", body: JSON.stringify({ title, description, finished }) });
}

export async function setTaskFinished(task, finished) {
  const patched = await request(`/${task.id}`, { method: "PATCH", body: JSON.stringify({ finished }) });
  if (patched && patched.finished === finished) return patched;
  return updateTask(task.id, { ...task, finished });
}

export function deleteTask(id) {
  return request(`/${id}`, { method: "DELETE" });
}

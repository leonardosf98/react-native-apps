import { useCallback, useState } from "react";
import { api } from "../apiClient";

export function useUsers(token, isStaff) {
  const [users, setUsers] = useState([]);
  const [agents, setAgents] = useState([]);

  const refreshUsers = useCallback(async () => {
    if (!token || !isStaff) return;
    const data = await api("/users", { token });
    setUsers(data.users);
    setAgents(data.users.filter((u) => u.role === "atendente" || u.role === "admin"));
  }, [token, isStaff]);

  async function createUser(payload) {
    await api("/users", { token, method: "POST", body: payload });
    await refreshUsers();
  }

  async function toggleUser(item) {
    await api(`/users/${item.id}`, {
      token,
      method: "PATCH",
      body: { active: !item.active },
    });
    await refreshUsers();
  }

  async function changeRole(item, role) {
    await api(`/users/${item.id}`, { token, method: "PATCH", body: { role } });
    await refreshUsers();
  }

  async function deleteUser(item) {
    await api(`/users/${item.id}`, { token, method: "DELETE" });
    await refreshUsers();
  }

  return { users, agents, refreshUsers, createUser, toggleUser, changeRole, deleteUser };
}

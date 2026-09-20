import { useCallback, useEffect, useState } from "react";
import { api } from "../apiClient";
import { clearToken, loadToken, saveToken } from "../authStore";

export function useAuth() {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [boot, setBoot] = useState(true);
  const [authError, setAuthError] = useState("");
  const [authLoading, setAuthLoading] = useState(false);

  const hydrate = useCallback(async (nextToken) => {
    const me = await api("/auth/me", { token: nextToken });
    setUser(me.user);
    setToken(nextToken);
  }, []);

  useEffect(() => {
    (async () => {
      const stored = await loadToken();
      if (stored) {
        try {
          await hydrate(stored);
        } catch {
          await clearToken();
        }
      }
      setBoot(false);
    })();
  }, [hydrate]);

  async function login(email, password) {
    setAuthLoading(true);
    setAuthError("");
    try {
      const data = await api("/auth/login", { method: "POST", body: { email, password } });
      await saveToken(data.token);
      await hydrate(data.token);
    } catch (err) {
      setAuthError(err.message);
    } finally {
      setAuthLoading(false);
    }
  }

  async function register(payload) {
    setAuthLoading(true);
    setAuthError("");
    try {
      const data = await api("/auth/register", { method: "POST", body: payload });
      await saveToken(data.token);
      await hydrate(data.token);
    } catch (err) {
      setAuthError(err.message);
    } finally {
      setAuthLoading(false);
    }
  }

  async function logout() {
    await clearToken();
    setToken(null);
    setUser(null);
    setAuthError("");
  }

  return { token, user, boot, authError, authLoading, login, register, logout, setAuthError };
}

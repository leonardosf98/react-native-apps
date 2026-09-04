import { StatusBar } from "expo-status-bar";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { api } from "./apiClient";
import { clearToken, loadToken, saveToken } from "./authStore";
import {
  LoginScreen,
  NewTicketScreen,
  NotificationsScreen,
  ProfileScreen,
  RegisterScreen,
  TicketDetailScreen,
  TicketListScreen,
  UsersScreen,
} from "./screens";
import { colors } from "./theme";
import { TabBar } from "./ui";

function tabsFor(role) {
  if (role === "cliente") {
    return [
      { key: "tickets", label: "Chamados" },
      { key: "profile", label: "Conta" },
    ];
  }
  if (role === "atendente") {
    return [
      { key: "queue", label: "Fila" },
      { key: "mine", label: "Meus" },
      { key: "inbox", label: "Avisos" },
      { key: "profile", label: "Conta" },
    ];
  }
  return [
    { key: "queue", label: "Fila" },
    { key: "users", label: "Equipe" },
    { key: "inbox", label: "Avisos" },
    { key: "profile", label: "Conta" },
  ];
}

export default function App() {
  const [boot, setBoot] = useState(true);
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [authMode, setAuthMode] = useState("login");
  const [authError, setAuthError] = useState("");
  const [authLoading, setAuthLoading] = useState(false);
  const [tab, setTab] = useState("tickets");
  const [tickets, setTickets] = useState([]);
  const [users, setUsers] = useState([]);
  const [agents, setAgents] = useState([]);
  const [detail, setDetail] = useState(null);
  const [creating, setCreating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unread, setUnread] = useState(0);
  const sinceRef = useRef(new Date().toISOString());

  const staff = user?.role === "admin" || user?.role === "atendente";

  const hydrate = useCallback(async (nextToken) => {
    const me = await api("/auth/me", { token: nextToken });
    setUser(me.user);
    setToken(nextToken);
    setTab(me.user.role === "cliente" ? "tickets" : "queue");
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

  const refreshTickets = useCallback(async () => {
    if (!token) return;
    const query = tab === "mine" ? "?mine=1" : "";
    const data = await api(`/tickets${query}`, { token });
    setTickets(data.tickets);
  }, [tab, token]);

  const refreshUsers = useCallback(async () => {
    if (!token || !staff) return;
    const data = await api("/users", { token });
    setUsers(data.users);
    setAgents(data.users.filter((item) => item.role === "atendente" || item.role === "admin"));
  }, [staff, token]);

  useEffect(() => {
    if (!token) return;
    refreshTickets().catch(() => setTickets([]));
    refreshUsers().catch(() => setUsers([]));
  }, [refreshTickets, refreshUsers, token]);

  useEffect(() => {
    if (!token || !staff) return undefined;
    const tick = async () => {
      try {
        const data = await api(`/notifications?since=${encodeURIComponent(sinceRef.current)}`, {
          token,
        });
        if (data.notifications.length) {
          setNotifications((prev) => {
            const ids = new Set(prev.map((item) => item.id));
            const extra = data.notifications.filter((item) => !ids.has(item.id));
            if (extra.length) setUnread((n) => n + extra.length);
            return [...extra, ...prev].slice(0, 50);
          });
          refreshTickets().catch(() => {});
        }
      } catch {
        return;
      }
    };
    tick();
    const id = setInterval(tick, 8000);
    return () => clearInterval(id);
  }, [refreshTickets, staff, token]);

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
    setTickets([]);
    setNotifications([]);
    setUnread(0);
    setDetail(null);
    setAuthMode("login");
  }

  async function openTicket(id) {
    const data = await api(`/tickets/${id}`, { token });
    setDetail(data);
    setCreating(false);
  }

  async function createTicket(payload) {
    setSaving(true);
    try {
      const data = await api("/tickets", { token, method: "POST", body: payload });
      setCreating(false);
      await refreshTickets();
      await openTicket(data.ticket.id);
    } catch (err) {
      setAuthError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function patchTicket(id, body) {
    await api(`/tickets/${id}`, { token, method: "PATCH", body });
    await openTicket(id);
    await refreshTickets();
  }

  const tabs = useMemo(() => (user ? tabsFor(user.role) : []), [user]);

  if (boot) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.bg, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator color={colors.primary} />
      </View>
    );
  }

  if (!user) {
    if (authMode === "register") {
      return (
        <>
          <StatusBar style="dark" />
          <RegisterScreen
            onRegister={register}
            onBack={() => setAuthMode("login")}
            loading={authLoading}
            error={authError}
          />
        </>
      );
    }
    return (
      <>
        <StatusBar style="dark" />
        <LoginScreen
          onLogin={login}
          onGoRegister={() => {
            setAuthError("");
            setAuthMode("register");
          }}
          loading={authLoading}
          error={authError}
        />
      </>
    );
  }

  let body = null;
  if (creating) {
    body = (
      <NewTicketScreen
        loading={saving}
        onBack={() => setCreating(false)}
        onSave={createTicket}
      />
    );
  } else if (detail) {
    body = (
      <TicketDetailScreen
        ticket={detail.ticket}
        events={detail.events}
        user={user}
        agents={agents}
        onBack={() => setDetail(null)}
        onAssign={(agentId) => patchTicket(detail.ticket.id, { agentId })}
        onStatus={(status) => patchTicket(detail.ticket.id, { status })}
        onCancel={() => patchTicket(detail.ticket.id, { status: "cancelado" })}
        onDelete={async () => {
          await api(`/tickets/${detail.ticket.id}`, { token, method: "DELETE" });
          setDetail(null);
          await refreshTickets();
        }}
      />
    );
  } else if (tab === "tickets" || tab === "queue" || tab === "mine") {
    body = (
      <TicketListScreen
        title={tab === "mine" ? "Comigo" : tab === "queue" ? "Fila" : "Meus chamados"}
        subtitle={
          tab === "queue"
            ? "Pedidos da operação, para atribuir e avançar status."
            : "Acompanhe abertura, andamento e fechamento."
        }
        tickets={tickets}
        onOpen={(ticket) => openTicket(ticket.id)}
        onCreate={user.role === "cliente" ? () => setCreating(true) : undefined}
        empty="Nenhum chamado por aqui ainda."
      />
    );
  } else if (tab === "inbox") {
    body = (
      <NotificationsScreen
        items={notifications}
        onOpen={openTicket}
        onMarkSeen={() => {
          setUnread(0);
          sinceRef.current = new Date().toISOString();
          setNotifications([]);
        }}
      />
    );
  } else if (tab === "users") {
    body = (
      <UsersScreen
        users={users}
        onCreate={async (payload) => {
          await api("/users", { token, method: "POST", body: payload });
          await refreshUsers();
        }}
        onToggle={async (item) => {
          await api(`/users/${item.id}`, {
            token,
            method: "PATCH",
            body: { active: !item.active },
          });
          await refreshUsers();
        }}
        onRole={async (item, role) => {
          await api(`/users/${item.id}`, { token, method: "PATCH", body: { role } });
          await refreshUsers();
        }}
        onDelete={async (item) => {
          await api(`/users/${item.id}`, { token, method: "DELETE" });
          await refreshUsers();
        }}
      />
    );
  } else {
    body = <ProfileScreen user={user} onLogout={logout} />;
  }

  const hideTabs = creating || Boolean(detail);

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <StatusBar style="dark" />
      <View style={{ flex: 1, paddingTop: 12 }}>{body}</View>
      {hideTabs ? null : (
        <TabBar
          tabs={tabs}
          current={tab}
          onChange={(key) => {
            setTab(key);
            setDetail(null);
          }}
          badge={{ key: "inbox", count: unread }}
        />
      )}
    </View>
  );
}

import { StatusBar } from "expo-status-bar";
import { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { api } from "./apiClient";
import { useAuth, useNotifications, useTickets, useUsers } from "./hooks";
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
  const [tab, setTab] = useState("tickets");
  const [authMode, setAuthMode] = useState("login");

  const auth = useAuth();
  const isStaff = auth.user?.role === "admin" || auth.user?.role === "atendente";

  useEffect(() => {
    if (auth.user) {
      setTab(auth.user.role === "cliente" ? "tickets" : "queue");
    }
  }, [auth.user]);

  const tickets = useTickets(auth.token);
  const users = useUsers(auth.token, isStaff);
  const notifications = useNotifications(auth.token, isStaff, () =>
    tickets.refreshTickets(tab).catch(() => {}),
  );

  useEffect(() => {
    if (!auth.token) return;
    tickets.refreshTickets(tab).catch(() => {});
    users.refreshUsers().catch(() => {});
  }, [auth.token, tab]);

  const tabs = useMemo(() => (auth.user ? tabsFor(auth.user.role) : []), [auth.user]);

  async function handleCreateTicket(payload) {
    const result = await tickets.createTicket(payload, tab);
    if (result.ok) return;
    auth.setAuthError(result.error);
  }

  if (auth.boot) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.bg, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator color={colors.primary} />
      </View>
    );
  }

  if (!auth.user) {
    if (authMode === "register") {
      return (
        <>
          <StatusBar style="dark" />
          <RegisterScreen
            onRegister={auth.register}
            onBack={() => setAuthMode("login")}
            loading={auth.authLoading}
            error={auth.authError}
          />
        </>
      );
    }
    return (
      <>
        <StatusBar style="dark" />
        <LoginScreen
          onLogin={auth.login}
          onGoRegister={() => {
            auth.setAuthError("");
            setAuthMode("register");
          }}
          loading={auth.authLoading}
          error={auth.authError}
        />
      </>
    );
  }

  let body = null;
  if (tickets.creating) {
    body = (
      <NewTicketScreen
        loading={tickets.saving}
        onBack={tickets.cancelCreating}
        onSave={handleCreateTicket}
      />
    );
  } else if (tickets.detail) {
    body = (
      <TicketDetailScreen
        ticket={tickets.detail.ticket}
        events={tickets.detail.events}
        user={auth.user}
        agents={users.agents}
        onBack={tickets.clearDetail}
        onAssign={(agentId) => tickets.patchTicket(tickets.detail.ticket.id, { agentId }, tab)}
        onStatus={(status) => tickets.patchTicket(tickets.detail.ticket.id, { status }, tab)}
        onCancel={() => tickets.patchTicket(tickets.detail.ticket.id, { status: "cancelado" }, tab)}
        onDelete={() => tickets.deleteTicket(tickets.detail.ticket.id, tab)}
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
        tickets={tickets.tickets}
        onOpen={(ticket) => tickets.openTicket(ticket.id)}
        onCreate={auth.user.role === "cliente" ? tickets.startCreating : undefined}
        empty="Nenhum chamado por aqui ainda."
      />
    );
  } else if (tab === "inbox") {
    body = (
      <NotificationsScreen
        items={notifications.notifications}
        onOpen={(item) =>
          notifications.openNotification(item, (id) => tickets.openTicket(id))
        }
        onMarkSeen={notifications.markSeen}
      />
    );
  } else if (tab === "users") {
    body = (
      <UsersScreen
        users={users.users}
        onCreate={users.createUser}
        onToggle={users.toggleUser}
        onRole={users.changeRole}
        onDelete={users.deleteUser}
      />
    );
  } else {
    body = <ProfileScreen user={auth.user} onLogout={auth.logout} />;
  }

  const hideTabs = tickets.creating || Boolean(tickets.detail);

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <StatusBar style="dark" />
      <View style={{ flex: 1 }}>{body}</View>
      {hideTabs ? null : (
        <TabBar
          tabs={tabs}
          current={tab}
          onChange={(key) => {
            setTab(key);
            tickets.clearDetail();
          }}
          badge={{ key: "inbox", count: notifications.unread }}
        />
      )}
    </View>
  );
}

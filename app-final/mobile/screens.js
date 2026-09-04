import { useMemo, useState } from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { COMPANY } from "./company";
import {
  CATEGORY_LABEL,
  PRIORITY_META,
  ROLE_LABEL,
  STATUS_META,
  colors,
} from "./theme";
import { Badge, Button, Card, Chip, Field, Muted, Screen, Title } from "./ui";

function formatWhen(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  return d.toLocaleString("pt-BR", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function LoginScreen({ onLogin, onGoRegister, loading, error }) {
  const [email, setEmail] = useState("cliente@aether.desk");
  const [password, setPassword] = useState("Cliente#123");
  return (
    <Screen style={{ justifyContent: "center" }}>
      <View
        style={{
          width: 56,
          height: 56,
          borderRadius: 18,
          backgroundColor: colors.primary,
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 18,
        }}
      >
        <Text style={{ color: "#fff", fontWeight: "900", fontSize: 22 }}>A</Text>
      </View>
      <Title>{COMPANY.nomeFantasia}</Title>
      <Muted style={{ marginTop: 8, marginBottom: 24 }}>
        Central de chamados. CNPJ {COMPANY.cnpj}
      </Muted>
      <Card>
        <Field label="Email" value={email} onChangeText={setEmail} placeholder="você@empresa.com" />
        <Field
          label="Senha"
          value={password}
          onChangeText={setPassword}
          secure
          placeholder="••••••••"
        />
        {error ? (
          <Text style={{ color: colors.danger, marginBottom: 12, fontWeight: "600" }}>
            {error}
          </Text>
        ) : null}
        <Button title="Entrar" loading={loading} onPress={() => onLogin(email, password)} />
        <View style={{ height: 10 }} />
        <Button title="Criar conta de cliente" variant="ghost" onPress={onGoRegister} />
      </Card>
      <Muted style={{ marginTop: 16 }}>
        Demo: cliente@aether.desk · agente@aether.desk · admin@aether.desk
      </Muted>
    </Screen>
  );
}

export function RegisterScreen({ onRegister, onBack, loading, error }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  return (
    <Screen style={{ paddingTop: 56 }}>
      <Pressable onPress={onBack}>
        <Text style={{ color: colors.primary, fontWeight: "700", marginBottom: 16 }}>Voltar</Text>
      </Pressable>
      <Title>Nova conta</Title>
      <Muted style={{ marginTop: 8, marginBottom: 20 }}>
        Cadastro de cliente em {COMPANY.nomeFantasia}.
      </Muted>
      <Card>
        <Field label="Nome" value={name} onChangeText={setName} placeholder="Seu nome" />
        <Field label="Email" value={email} onChangeText={setEmail} />
        <Field label="Senha" value={password} onChangeText={setPassword} secure />
        {error ? (
          <Text style={{ color: colors.danger, marginBottom: 12, fontWeight: "600" }}>
            {error}
          </Text>
        ) : null}
        <Button title="Cadastrar" loading={loading} onPress={() => onRegister({ name, email, password })} />
      </Card>
    </Screen>
  );
}

export function TicketCard({ ticket, onPress }) {
  const status = STATUS_META[ticket.status] || STATUS_META.aberto;
  const priority = PRIORITY_META[ticket.priority] || PRIORITY_META.media;
  return (
    <Pressable onPress={onPress}>
      <Card style={{ marginBottom: 12 }}>
        <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 8 }}>
          <Badge label={status.label} color={status.color} bg={status.bg} />
          <Text style={{ color: priority.color, fontWeight: "800", fontSize: 12 }}>
            {priority.label}
          </Text>
        </View>
        <Text style={{ fontSize: 17, fontWeight: "800", color: colors.text }}>{ticket.title}</Text>
        <Muted style={{ marginTop: 6 }} numberOfLines={2}>
          {ticket.description}
        </Muted>
        <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 12 }}>
          <Muted>{CATEGORY_LABEL[ticket.category] || ticket.category}</Muted>
          <Muted>{formatWhen(ticket.createdAt)}</Muted>
        </View>
        {ticket.agentName ? (
          <Muted style={{ marginTop: 6 }}>Atendente: {ticket.agentName}</Muted>
        ) : null}
      </Card>
    </Pressable>
  );
}

export function TicketListScreen({
  title,
  subtitle,
  tickets,
  onOpen,
  onCreate,
  createLabel,
  empty,
}) {
  return (
    <Screen style={{ paddingTop: 20 }}>
      <Title>{title}</Title>
      <Muted style={{ marginTop: 6, marginBottom: 16 }}>{subtitle}</Muted>
      {onCreate ? (
        <View style={{ marginBottom: 14 }}>
          <Button title={createLabel || "Novo chamado"} onPress={onCreate} />
        </View>
      ) : null}
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 24 }}>
        {tickets.length === 0 ? (
          <Card>
            <Text style={{ fontWeight: "700", color: colors.text }}>{empty}</Text>
          </Card>
        ) : (
          tickets.map((ticket) => (
            <TicketCard key={ticket.id} ticket={ticket} onPress={() => onOpen(ticket)} />
          ))
        )}
      </ScrollView>
    </Screen>
  );
}

export function NewTicketScreen({ onSave, onBack, loading }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("media");
  const [category, setCategory] = useState("tecnico");
  return (
    <Screen style={{ paddingTop: 20 }}>
      <Pressable onPress={onBack}>
        <Text style={{ color: colors.primary, fontWeight: "700", marginBottom: 12 }}>Voltar</Text>
      </Pressable>
      <Title>Abrir chamado</Title>
      <Muted style={{ marginTop: 6, marginBottom: 16 }}>
        A equipe de {COMPANY.nomeFantasia} recebe o pedido na fila.
      </Muted>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Card>
          <Field label="Título" value={title} onChangeText={setTitle} placeholder="Resumo do problema" />
          <Field
            label="Descrição"
            value={description}
            onChangeText={setDescription}
            multiline
            placeholder="O que aconteceu, quando, e o que já tentou."
          />
          <Muted style={{ marginBottom: 8 }}>Prioridade</Muted>
          <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
            {Object.entries(PRIORITY_META).map(([key, meta]) => (
              <Chip
                key={key}
                label={meta.label}
                selected={priority === key}
                onPress={() => setPriority(key)}
              />
            ))}
          </View>
          <Muted style={{ marginBottom: 8, marginTop: 8 }}>Categoria</Muted>
          <View style={{ flexDirection: "row", flexWrap: "wrap", marginBottom: 12 }}>
            {Object.entries(CATEGORY_LABEL).map(([key, label]) => (
              <Chip
                key={key}
                label={label}
                selected={category === key}
                onPress={() => setCategory(key)}
              />
            ))}
          </View>
          <Button
            title="Enviar chamado"
            loading={loading}
            onPress={() => onSave({ title, description, priority, category })}
          />
        </Card>
      </ScrollView>
    </Screen>
  );
}

export function TicketDetailScreen({
  ticket,
  events,
  user,
  agents,
  onBack,
  onAssign,
  onStatus,
  onCancel,
  onDelete,
}) {
  const status = STATUS_META[ticket.status] || STATUS_META.aberto;
  const staff = user.role === "admin" || user.role === "atendente";
  return (
    <Screen style={{ paddingTop: 20 }}>
      <Pressable onPress={onBack}>
        <Text style={{ color: colors.primary, fontWeight: "700", marginBottom: 12 }}>Voltar</Text>
      </Pressable>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 32 }}>
        <Badge label={status.label} color={status.color} bg={status.bg} />
        <Title style={{ fontSize: 24, marginTop: 10 }}>{ticket.title}</Title>
        <Muted style={{ marginTop: 8 }}>{ticket.description}</Muted>
        <Card style={{ marginTop: 16 }}>
          <Muted>Cliente</Muted>
          <Text style={{ fontWeight: "700", color: colors.text, marginBottom: 8 }}>
            {ticket.clientName}
          </Text>
          <Muted>Atendente</Muted>
          <Text style={{ fontWeight: "700", color: colors.text }}>
            {ticket.agentName || "Não atribuído"}
          </Text>
        </Card>
        {staff ? (
          <Card style={{ marginTop: 12 }}>
            <Text style={{ fontWeight: "800", color: colors.text, marginBottom: 10 }}>
              Atribuir atendente
            </Text>
            <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
              <Chip label="Ninguém" selected={!ticket.agentId} onPress={() => onAssign(null)} />
              {agents.map((agent) => (
                <Chip
                  key={agent.id}
                  label={agent.name}
                  selected={ticket.agentId === agent.id}
                  onPress={() => onAssign(agent.id)}
                />
              ))}
            </View>
            <Text style={{ fontWeight: "800", color: colors.text, marginVertical: 10 }}>
              Status
            </Text>
            <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
              {Object.entries(STATUS_META).map(([key, meta]) => (
                <Chip
                  key={key}
                  label={meta.label}
                  selected={ticket.status === key}
                  onPress={() => onStatus(key)}
                />
              ))}
            </View>
          </Card>
        ) : null}
        {!staff && ticket.status === "aberto" ? (
          <View style={{ marginTop: 12 }}>
            <Button title="Cancelar chamado" variant="danger" onPress={onCancel} />
          </View>
        ) : null}
        {user.role === "admin" ? (
          <View style={{ marginTop: 12 }}>
            <Button title="Excluir chamado" variant="danger" onPress={onDelete} />
          </View>
        ) : null}
        <Text style={{ fontWeight: "800", marginTop: 20, marginBottom: 10, color: colors.text }}>
          Histórico
        </Text>
        {(events || []).map((event) => (
          <View key={event.id} style={{ marginBottom: 10 }}>
            <Text style={{ fontWeight: "700", color: colors.text }}>
              {event.actorName} · {event.type}
            </Text>
            <Muted>{formatWhen(event.createdAt)}</Muted>
          </View>
        ))}
      </ScrollView>
    </Screen>
  );
}

export function NotificationsScreen({ items, onOpen, onMarkSeen }) {
  return (
    <Screen style={{ paddingTop: 20 }}>
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
        <Title>Fila ao vivo</Title>
        <Pressable onPress={onMarkSeen}>
          <Text style={{ color: colors.primary, fontWeight: "700" }}>Limpar</Text>
        </Pressable>
      </View>
      <Muted style={{ marginTop: 6, marginBottom: 16 }}>
        Novos pedidos e mudanças de status entram aqui.
      </Muted>
      <ScrollView showsVerticalScrollIndicator={false}>
        {items.length === 0 ? (
          <Card>
            <Text style={{ fontWeight: "700" }}>Nenhuma notificação nova.</Text>
          </Card>
        ) : (
          items.map((item) => (
            <Pressable key={item.id} onPress={() => onOpen(item.ticketId)}>
              <Card style={{ marginBottom: 10 }}>
                <Text style={{ fontWeight: "800", color: colors.text }}>{item.ticketTitle}</Text>
                <Muted style={{ marginTop: 4 }}>
                  {item.actorName} · {item.type} · {formatWhen(item.createdAt)}
                </Muted>
              </Card>
            </Pressable>
          ))
        )}
      </ScrollView>
    </Screen>
  );
}

export function UsersScreen({ users, onCreate, onToggle, onRole, onDelete }) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("cliente");
  return (
    <Screen style={{ paddingTop: 20 }}>
      <Title>Usuários</Title>
      <Muted style={{ marginTop: 6, marginBottom: 16 }}>CRUD interno da operação.</Muted>
      <Button title={open ? "Fechar formulário" : "Novo usuário"} variant={open ? "ghost" : "primary"} onPress={() => setOpen(!open)} />
      {open ? (
        <Card style={{ marginTop: 12 }}>
          <Field label="Nome" value={name} onChangeText={setName} />
          <Field label="Email" value={email} onChangeText={setEmail} />
          <Field label="Senha inicial" value={password} onChangeText={setPassword} secure />
          <View style={{ flexDirection: "row", flexWrap: "wrap", marginBottom: 12 }}>
            {Object.keys(ROLE_LABEL).map((key) => (
              <Chip key={key} label={ROLE_LABEL[key]} selected={role === key} onPress={() => setRole(key)} />
            ))}
          </View>
          <Button
            title="Criar"
            onPress={() => {
              onCreate({ name, email, password, role });
              setName("");
              setEmail("");
              setPassword("");
            }}
          />
        </Card>
      ) : null}
      <ScrollView style={{ marginTop: 14 }} showsVerticalScrollIndicator={false}>
        {users.map((item) => (
          <Card key={item.id} style={{ marginBottom: 10 }}>
            <Text style={{ fontWeight: "800", color: colors.text }}>{item.name}</Text>
            <Muted>{item.email}</Muted>
            <View style={{ flexDirection: "row", flexWrap: "wrap", marginTop: 10 }}>
              {Object.keys(ROLE_LABEL).map((key) => (
                <Chip
                  key={key}
                  label={ROLE_LABEL[key]}
                  selected={item.role === key}
                  onPress={() => onRole(item, key)}
                />
              ))}
            </View>
            <View style={{ flexDirection: "row", gap: 8, marginTop: 10 }}>
              <View style={{ flex: 1 }}>
                <Button
                  title={item.active ? "Desativar" : "Ativar"}
                  variant="ghost"
                  onPress={() => onToggle(item)}
                />
              </View>
              <View style={{ flex: 1 }}>
                <Button title="Remover" variant="danger" onPress={() => onDelete(item)} />
              </View>
            </View>
          </Card>
        ))}
      </ScrollView>
    </Screen>
  );
}

export function ProfileScreen({ user, onLogout }) {
  const placeholders = useMemo(
    () => [
      ["Razão social", COMPANY.razaoSocial],
      ["CNPJ", COMPANY.cnpj],
      ["IE", COMPANY.inscricaoEstadual],
      ["Email", COMPANY.email],
      ["Telefone", COMPANY.telefone],
      ["Endereço", `${COMPANY.endereco} · ${COMPANY.cidade}/${COMPANY.uf}`],
    ],
    []
  );
  return (
    <Screen style={{ paddingTop: 20 }}>
      <Title>Conta</Title>
      <Card style={{ marginTop: 16 }}>
        <Text style={{ fontSize: 20, fontWeight: "800", color: colors.text }}>{user.name}</Text>
        <Muted style={{ marginTop: 4 }}>{user.email}</Muted>
        <View style={{ marginTop: 10 }}>
          <Badge
            label={ROLE_LABEL[user.role]}
            color={colors.primaryDark}
            bg={colors.primarySoft}
          />
        </View>
      </Card>
      <Card style={{ marginTop: 12 }}>
        <Text style={{ fontWeight: "800", marginBottom: 10, color: colors.text }}>
          {COMPANY.nomeFantasia}
        </Text>
        {placeholders.map(([label, value]) => (
          <View key={label} style={{ marginBottom: 8 }}>
            <Muted>{label}</Muted>
            <Text style={{ color: colors.text, fontWeight: "600" }}>{value}</Text>
          </View>
        ))}
      </Card>
      <View style={{ marginTop: 16 }}>
        <Button
          title="Sair"
          variant="danger"
          onPress={() =>
            Alert.alert("Sair", "Encerrar sessão?", [
              { text: "Cancelar", style: "cancel" },
              { text: "Sair", style: "destructive", onPress: onLogout },
            ])
          }
        />
      </View>
    </Screen>
  );
}

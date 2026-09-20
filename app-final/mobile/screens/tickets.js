import { useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { COMPANY } from "../company";
import { CATEGORY_LABEL, PRIORITY_META, STATUS_META, colors } from "../theme";
import { Badge, Button, Card, Chip, Field, Muted, Screen, Title } from "../ui";
import { BackLink, ChipGroup, EmptyState } from "../components";
import { formatWhen } from "../utils";

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
    <Screen>
      <Title>{title}</Title>
      <Muted style={{ marginTop: 6, marginBottom: 16 }}>{subtitle}</Muted>
      {onCreate ? (
        <View style={{ marginBottom: 14 }}>
          <Button title={createLabel || "Novo chamado"} onPress={onCreate} />
        </View>
      ) : null}
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 24 }}>
        {tickets.length === 0 ? (
          <EmptyState>{empty}</EmptyState>
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
    <Screen>
      <BackLink onPress={onBack} />
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
          <ChipGroup
            label="Prioridade"
            options={Object.entries(PRIORITY_META).map(([k, v]) => [k, v.label])}
            value={priority}
            onChange={setPriority}
          />
          <View style={{ marginTop: 8 }}>
            <ChipGroup
              label="Categoria"
              options={Object.entries(CATEGORY_LABEL)}
              value={category}
              onChange={setCategory}
            />
          </View>
          <View style={{ marginTop: 12 }}>
            <Button
              title="Enviar chamado"
              loading={loading}
              onPress={() => onSave({ title, description, priority, category })}
            />
          </View>
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
    <Screen>
      <BackLink onPress={onBack} />
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
            <ChipGroup
              label="Status"
              options={Object.entries(STATUS_META).map(([k, v]) => [k, v.label])}
              value={ticket.status}
              onChange={onStatus}
            />
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

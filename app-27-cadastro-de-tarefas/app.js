import { StatusBar } from "expo-status-bar";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  RefreshControl,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { createTask, deleteTask, listTasks, setTaskFinished, updateTask } from "./api";

const INK = "#1E1B4B";
const VIOLET = "#7C3AED";
const VIOLET_SOFT = "#EDE9FE";
const MINT = "#10B981";
const MINT_SOFT = "#D1FAE5";
const ROSE = "#E11D48";
const ROSE_SOFT = "#FFE4E6";
const BG = "#F5F3FF";
const CARD = "#FFFFFF";
const LINE = "#DDD6FE";
const TEXT = "#1F1A3D";
const MUTED = "#6B6890";

const FILTERS = [
  { key: "all", label: "Todas" },
  { key: "open", label: "Pendentes" },
  { key: "done", label: "Concluídas" },
];

function formatDate(value) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" });
}

function sortTasks(tasks) {
  return [...tasks].sort((a, b) => {
    if (a.finished !== b.finished) return a.finished ? 1 : -1;
    return new Date(b.create_at || 0) - new Date(a.create_at || 0);
  });
}

function StatPill({ value, label, color }) {
  return (
    <View style={{ flex: 1, backgroundColor: "rgba(255,255,255,0.1)", borderRadius: 16, paddingVertical: 12, alignItems: "center" }}>
      <Text style={{ color, fontSize: 22, fontWeight: "900" }}>{value}</Text>
      <Text style={{ color: "#C4B5FD", fontSize: 12, fontWeight: "700", marginTop: 2 }}>{label}</Text>
    </View>
  );
}

function FilterChip({ label, active, onPress }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      style={{
        flex: 1,
        paddingVertical: 10,
        borderRadius: 12,
        alignItems: "center",
        backgroundColor: active ? VIOLET : "transparent",
      }}
    >
      <Text style={{ color: active ? "#FFFFFF" : MUTED, fontWeight: "800", fontSize: 13 }}>{label}</Text>
    </TouchableOpacity>
  );
}

function IconButton({ label, onPress, color, background, disabled }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.75}
      style={{
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 10,
        backgroundColor: background,
        opacity: disabled ? 0.5 : 1,
      }}
    >
      <Text style={{ color, fontWeight: "800", fontSize: 13 }}>{label}</Text>
    </TouchableOpacity>
  );
}

function TaskCard({ task, busy, onToggle, onEdit, onDelete }) {
  const done = Boolean(task.finished);
  return (
    <View
      style={{
        backgroundColor: CARD,
        borderRadius: 18,
        padding: 16,
        marginBottom: 12,
        borderLeftWidth: 5,
        borderLeftColor: done ? MINT : VIOLET,
        shadowColor: INK,
        shadowOpacity: 0.08,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 4 },
        elevation: 2,
      }}
    >
      <View style={{ flexDirection: "row", alignItems: "flex-start" }}>
        <Pressable
          onPress={onToggle}
          disabled={busy}
          accessibilityRole="checkbox"
          accessibilityState={{ checked: done }}
          accessibilityLabel={done ? "Marcar como pendente" : "Marcar como concluída"}
          style={{
            width: 28,
            height: 28,
            borderRadius: 9,
            borderWidth: 2,
            borderColor: done ? MINT : LINE,
            backgroundColor: done ? MINT : "#FFFFFF",
            alignItems: "center",
            justifyContent: "center",
            marginRight: 12,
            marginTop: 2,
          }}
        >
          {busy ? (
            <ActivityIndicator size="small" color={done ? "#FFFFFF" : VIOLET} />
          ) : done ? (
            <Text style={{ color: "#FFFFFF", fontWeight: "900", fontSize: 16 }}>✓</Text>
          ) : null}
        </Pressable>
        <View style={{ flex: 1 }}>
          <Text
            style={{
              color: done ? MUTED : TEXT,
              fontSize: 17,
              fontWeight: "800",
              textDecorationLine: done ? "line-through" : "none",
            }}
          >
            {task.title || "Sem título"}
          </Text>
          {task.description ? (
            <Text style={{ color: MUTED, fontSize: 14, marginTop: 4, lineHeight: 20 }}>{task.description}</Text>
          ) : null}
          <View style={{ flexDirection: "row", alignItems: "center", marginTop: 10, flexWrap: "wrap" }}>
            <View
              style={{
                backgroundColor: done ? MINT_SOFT : VIOLET_SOFT,
                borderRadius: 999,
                paddingHorizontal: 10,
                paddingVertical: 3,
                marginRight: 8,
              }}
            >
              <Text style={{ color: done ? "#047857" : VIOLET, fontSize: 11, fontWeight: "800" }}>
                {done ? "CONCLUÍDA" : "PENDENTE"}
              </Text>
            </View>
            <Text style={{ color: MUTED, fontSize: 12 }}>
              #{task.id} · {formatDate(task.create_at)}
            </Text>
          </View>
        </View>
      </View>
      <View style={{ flexDirection: "row", justifyContent: "flex-end", marginTop: 12, gap: 8 }}>
        <IconButton label="✏️ Editar" onPress={onEdit} color={VIOLET} background={VIOLET_SOFT} disabled={busy} />
        <IconButton label="🗑️ Excluir" onPress={onDelete} color={ROSE} background={ROSE_SOFT} disabled={busy} />
      </View>
    </View>
  );
}

function Sheet({ visible, onClose, children }) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1, backgroundColor: "rgba(30,27,75,0.55)", justifyContent: "center", padding: 20 }}
      >
        <View style={{ backgroundColor: CARD, borderRadius: 24, padding: 22, width: "100%", maxWidth: 480, alignSelf: "center" }}>
          {children}
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

function FormField({ label, value, onChangeText, placeholder, multiline, maxLength }) {
  return (
    <View style={{ marginBottom: 14 }}>
      <Text style={{ color: TEXT, fontSize: 13, fontWeight: "800", marginBottom: 6 }}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#A8A3C9"
        multiline={multiline}
        maxLength={maxLength}
        accessibilityLabel={label}
        style={{
          backgroundColor: BG,
          borderColor: LINE,
          borderWidth: 2,
          borderRadius: 14,
          paddingHorizontal: 14,
          paddingVertical: 12,
          color: TEXT,
          fontSize: 16,
          minHeight: multiline ? 96 : undefined,
          textAlignVertical: multiline ? "top" : "center",
        }}
      />
    </View>
  );
}

function PrimaryButton({ label, onPress, color = VIOLET, loading, disabled }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.85}
      style={{
        flex: 1,
        backgroundColor: color,
        borderRadius: 14,
        paddingVertical: 14,
        alignItems: "center",
        opacity: disabled ? 0.5 : 1,
      }}
    >
      {loading ? <ActivityIndicator color="#FFFFFF" /> : <Text style={{ color: "#FFFFFF", fontWeight: "900", fontSize: 15 }}>{label}</Text>}
    </TouchableOpacity>
  );
}

function GhostButton({ label, onPress, disabled }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.8}
      style={{ flex: 1, borderRadius: 14, paddingVertical: 14, alignItems: "center", backgroundColor: VIOLET_SOFT }}
    >
      <Text style={{ color: VIOLET, fontWeight: "900", fontSize: 15 }}>{label}</Text>
    </TouchableOpacity>
  );
}

function TaskForm({ visible, task, onClose, onSubmit }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (visible) {
      setTitle(task ? task.title || "" : "");
      setDescription(task ? task.description || "" : "");
      setError("");
      setSaving(false);
    }
  }, [visible, task]);

  async function handleSubmit() {
    const cleanTitle = title.trim();
    if (!cleanTitle) {
      setError("Informe um título para a tarefa.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      await onSubmit({ title: cleanTitle, description: description.trim() });
    } catch (e) {
      setError(e.message || "Não foi possível salvar.");
      setSaving(false);
    }
  }

  return (
    <Sheet visible={visible} onClose={saving ? () => {} : onClose}>
      <Text style={{ color: INK, fontSize: 22, fontWeight: "900" }}>{task ? "Editar tarefa" : "Nova tarefa"}</Text>
      <Text style={{ color: MUTED, fontSize: 14, marginTop: 4, marginBottom: 18 }}>
        {task ? "Altere os dados e salve." : "Preencha os dados da tarefa."}
      </Text>
      <FormField label="Título" value={title} onChangeText={setTitle} placeholder="Ex.: Estudar React Native" maxLength={120} />
      <FormField
        label="Descrição"
        value={description}
        onChangeText={setDescription}
        placeholder="Detalhes da tarefa (opcional)"
        multiline
        maxLength={500}
      />
      {error ? (
        <View style={{ backgroundColor: ROSE_SOFT, borderRadius: 12, padding: 10, marginBottom: 12 }}>
          <Text style={{ color: ROSE, fontWeight: "700", fontSize: 13 }}>{error}</Text>
        </View>
      ) : null}
      <View style={{ flexDirection: "row", gap: 10, marginTop: 4 }}>
        <GhostButton label="Cancelar" onPress={onClose} disabled={saving} />
        <PrimaryButton label={task ? "Salvar" : "Incluir"} onPress={handleSubmit} loading={saving} />
      </View>
    </Sheet>
  );
}

function ConfirmDelete({ task, onCancel, onConfirm }) {
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setDeleting(false);
    setError("");
  }, [task]);

  async function handleConfirm() {
    setDeleting(true);
    setError("");
    try {
      await onConfirm();
    } catch (e) {
      setError(e.message || "Não foi possível excluir.");
      setDeleting(false);
    }
  }

  return (
    <Sheet visible={Boolean(task)} onClose={deleting ? () => {} : onCancel}>
      <View style={{ alignItems: "center" }}>
        <View style={{ width: 56, height: 56, borderRadius: 28, backgroundColor: ROSE_SOFT, alignItems: "center", justifyContent: "center", marginBottom: 12 }}>
          <Text style={{ fontSize: 26 }}>🗑️</Text>
        </View>
        <Text style={{ color: INK, fontSize: 20, fontWeight: "900", textAlign: "center" }}>Excluir tarefa?</Text>
        <Text style={{ color: MUTED, fontSize: 14, textAlign: "center", marginTop: 6, marginBottom: 18 }}>
          "{task ? task.title : ""}" será removida definitivamente.
        </Text>
      </View>
      {error ? (
        <View style={{ backgroundColor: ROSE_SOFT, borderRadius: 12, padding: 10, marginBottom: 12 }}>
          <Text style={{ color: ROSE, fontWeight: "700", fontSize: 13 }}>{error}</Text>
        </View>
      ) : null}
      <View style={{ flexDirection: "row", gap: 10 }}>
        <GhostButton label="Cancelar" onPress={onCancel} disabled={deleting} />
        <PrimaryButton label="Excluir" color={ROSE} onPress={handleConfirm} loading={deleting} />
      </View>
    </Sheet>
  );
}

function CenterState({ children }) {
  return <View style={{ alignItems: "center", paddingVertical: 48, paddingHorizontal: 24 }}>{children}</View>;
}

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all");
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [toDelete, setToDelete] = useState(null);
  const [busyId, setBusyId] = useState(null);
  const [toast, setToast] = useState("");

  const load = useCallback(async (mode = "initial") => {
    if (mode === "refresh") setRefreshing(true);
    else setLoading(true);
    setError("");
    try {
      const data = await listTasks();
      setTasks(Array.isArray(data) ? data : []);
    } catch (e) {
      setError(e.message || "Falha ao carregar as tarefas.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    if (!toast) return undefined;
    const timer = setTimeout(() => setToast(""), 2400);
    return () => clearTimeout(timer);
  }, [toast]);

  const counts = useMemo(() => {
    const done = tasks.filter((t) => t.finished).length;
    return { total: tasks.length, done, open: tasks.length - done };
  }, [tasks]);

  const visible = useMemo(() => {
    const filtered = tasks.filter((t) => (filter === "all" ? true : filter === "done" ? t.finished : !t.finished));
    return sortTasks(filtered);
  }, [tasks, filter]);

  function openCreate() {
    setEditing(null);
    setFormOpen(true);
  }

  function openEdit(task) {
    setEditing(task);
    setFormOpen(true);
  }

  async function handleSubmit(values) {
    if (editing) {
      const saved = await updateTask(editing.id, { ...editing, ...values });
      setTasks((list) => list.map((t) => (t.id === editing.id ? { ...t, ...values, ...(saved || {}) } : t)));
      setToast("Tarefa alterada ✓");
    } else {
      const created = await createTask(values);
      setTasks((list) => [created, ...list]);
      setToast("Tarefa incluída ✓");
    }
    setFormOpen(false);
    setEditing(null);
  }

  async function handleToggle(task) {
    setBusyId(task.id);
    try {
      const saved = await setTaskFinished(task, !task.finished);
      setTasks((list) => list.map((t) => (t.id === task.id ? { ...t, ...saved } : t)));
    } catch (e) {
      setToast(e.message || "Não foi possível atualizar.");
    } finally {
      setBusyId(null);
    }
  }

  async function handleDelete() {
    const target = toDelete;
    await deleteTask(target.id);
    setTasks((list) => list.filter((t) => t.id !== target.id));
    setToDelete(null);
    setToast("Tarefa excluída");
  }

  const progress = counts.total ? counts.done / counts.total : 0;

  const header = (
    <View>
      <View style={{ backgroundColor: INK, borderRadius: 26, padding: 22, marginBottom: 16 }}>
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
          <View style={{ flex: 1 }}>
            <Text style={{ color: "#C4B5FD", fontSize: 12, fontWeight: "800", letterSpacing: 1.5 }}>APP 27</Text>
            <Text style={{ color: "#FFFFFF", fontSize: 28, fontWeight: "900", marginTop: 2 }}>Minhas tarefas</Text>
          </View>
          <TouchableOpacity
            onPress={() => load("refresh")}
            disabled={loading || refreshing}
            accessibilityLabel="Atualizar lista"
            style={{ width: 44, height: 44, borderRadius: 14, backgroundColor: "rgba(255,255,255,0.12)", alignItems: "center", justifyContent: "center" }}
          >
            {refreshing ? <ActivityIndicator color="#FFFFFF" /> : <Text style={{ color: "#FFFFFF", fontSize: 20 }}>↻</Text>}
          </TouchableOpacity>
        </View>
        <View style={{ flexDirection: "row", gap: 10, marginTop: 18 }}>
          <StatPill value={counts.total} label="Total" color="#FFFFFF" />
          <StatPill value={counts.open} label="Pendentes" color="#C4B5FD" />
          <StatPill value={counts.done} label="Concluídas" color="#6EE7B7" />
        </View>
        <View style={{ height: 8, backgroundColor: "rgba(255,255,255,0.12)", borderRadius: 999, marginTop: 16, overflow: "hidden" }}>
          <View style={{ width: `${Math.round(progress * 100)}%`, height: "100%", backgroundColor: MINT, borderRadius: 999 }} />
        </View>
        <Text style={{ color: "#C4B5FD", fontSize: 12, fontWeight: "700", marginTop: 6 }}>
          {Math.round(progress * 100)}% concluído
        </Text>
      </View>
      <View style={{ flexDirection: "row", backgroundColor: CARD, borderRadius: 16, padding: 4, marginBottom: 16, borderWidth: 1, borderColor: LINE }}>
        {FILTERS.map((f) => (
          <FilterChip key={f.key} label={f.label} active={filter === f.key} onPress={() => setFilter(f.key)} />
        ))}
      </View>
    </View>
  );

  let empty = null;
  if (loading) {
    empty = (
      <CenterState>
        <ActivityIndicator size="large" color={VIOLET} />
        <Text style={{ color: TEXT, fontSize: 16, fontWeight: "800", marginTop: 14 }}>Carregando tarefas...</Text>
        <Text style={{ color: MUTED, fontSize: 13, textAlign: "center", marginTop: 6, lineHeight: 19 }}>
          O servidor está hospedado no Render e pode levar até 1 minuto para acordar na primeira vez.
        </Text>
      </CenterState>
    );
  } else if (error) {
    empty = (
      <CenterState>
        <Text style={{ fontSize: 40 }}>⚠️</Text>
        <Text style={{ color: TEXT, fontSize: 17, fontWeight: "900", marginTop: 10 }}>Não deu para carregar</Text>
        <Text style={{ color: MUTED, fontSize: 13, textAlign: "center", marginTop: 6, marginBottom: 16 }}>{error}</Text>
        <TouchableOpacity onPress={() => load()} style={{ backgroundColor: VIOLET, borderRadius: 14, paddingHorizontal: 22, paddingVertical: 12 }}>
          <Text style={{ color: "#FFFFFF", fontWeight: "900" }}>Tentar novamente</Text>
        </TouchableOpacity>
      </CenterState>
    );
  } else {
    empty = (
      <CenterState>
        <Text style={{ fontSize: 40 }}>{filter === "done" ? "🎯" : "📝"}</Text>
        <Text style={{ color: TEXT, fontSize: 17, fontWeight: "900", marginTop: 10 }}>
          {tasks.length ? "Nada neste filtro" : "Nenhuma tarefa ainda"}
        </Text>
        <Text style={{ color: MUTED, fontSize: 13, textAlign: "center", marginTop: 6 }}>
          {tasks.length ? "Troque o filtro para ver outras tarefas." : "Toque em \"+ Nova tarefa\" para começar."}
        </Text>
      </CenterState>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: BG }}>
      <StatusBar style="light" />
      <FlatList
        data={loading || error ? [] : visible}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <TaskCard
            task={item}
            busy={busyId === item.id}
            onToggle={() => handleToggle(item)}
            onEdit={() => openEdit(item)}
            onDelete={() => setToDelete(item)}
          />
        )}
        ListHeaderComponent={header}
        ListEmptyComponent={empty}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => load("refresh")} tintColor={VIOLET} colors={[VIOLET]} />}
        contentContainerStyle={{ padding: 16, paddingTop: Platform.OS === "web" ? 20 : 56, paddingBottom: 110, width: "100%", maxWidth: 640, alignSelf: "center" }}
      />
      <View style={{ position: "absolute", left: 0, right: 0, bottom: 24, alignItems: "center" }} pointerEvents="box-none">
        {toast ? (
          <View style={{ backgroundColor: INK, borderRadius: 999, paddingHorizontal: 16, paddingVertical: 8, marginBottom: 10 }}>
            <Text style={{ color: "#FFFFFF", fontWeight: "700", fontSize: 13 }}>{toast}</Text>
          </View>
        ) : null}
        <TouchableOpacity
          onPress={openCreate}
          activeOpacity={0.85}
          style={{
            backgroundColor: VIOLET,
            borderRadius: 999,
            paddingHorizontal: 26,
            paddingVertical: 16,
            shadowColor: VIOLET,
            shadowOpacity: 0.4,
            shadowRadius: 14,
            shadowOffset: { width: 0, height: 6 },
            elevation: 6,
          }}
        >
          <Text style={{ color: "#FFFFFF", fontWeight: "900", fontSize: 16 }}>+ Nova tarefa</Text>
        </TouchableOpacity>
      </View>
      <TaskForm
        visible={formOpen}
        task={editing}
        onClose={() => {
          setFormOpen(false);
          setEditing(null);
        }}
        onSubmit={handleSubmit}
      />
      <ConfirmDelete task={toDelete} onCancel={() => setToDelete(null)} onConfirm={handleDelete} />
    </View>
  );
}

import AsyncStorage from "@react-native-async-storage/async-storage";
import { StatusBar } from "expo-status-bar";
import { useEffect, useMemo, useRef, useState } from "react";
import { ActivityIndicator, FlatList, Keyboard, Platform, Text, TextInput, TouchableOpacity, View } from "react-native";

const STORAGE_KEY = "@lista-de-tarefas/tarefas";

const INK = "#1E1B4B";
const VIOLET = "#7C3AED";
const LILAC = "#EDE9FE";
const SOFT = "#F5F3FF";
const LINE = "#DDD6FE";
const TEXT = "#1F1937";
const MUTED = "#6B6290";
const MINT = "#10B981";
const DANGER = "#E11D48";

const FILTERS = [
  { key: "all", label: "Todas" },
  { key: "pending", label: "Pendentes" },
  { key: "done", label: "Concluídas" },
];

const EMPTY_MESSAGES = {
  all: { emoji: "📝", title: "Nenhuma tarefa por aqui", text: "Escreva algo acima e toque em Adicionar para começar." },
  pending: { emoji: "🎉", title: "Tudo em dia!", text: "Você não tem tarefas pendentes." },
  done: { emoji: "⏳", title: "Nada concluído ainda", text: "Marque uma tarefa para vê-la aqui." },
};

function createId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function FilterChip({ label, count, active, onPress }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      accessibilityRole="button"
      accessibilityState={{ selected: active }}
      style={{
        flex: 1,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        paddingVertical: 10,
        borderRadius: 12,
        backgroundColor: active ? VIOLET : "transparent",
      }}
    >
      <Text style={{ color: active ? "#FFFFFF" : MUTED, fontSize: 13, fontWeight: "800" }}>{label}</Text>
      <View
        style={{
          marginLeft: 6,
          minWidth: 20,
          paddingHorizontal: 6,
          paddingVertical: 1,
          borderRadius: 99,
          backgroundColor: active ? "rgba(255,255,255,0.25)" : LILAC,
          alignItems: "center",
        }}
      >
        <Text style={{ color: active ? "#FFFFFF" : VIOLET, fontSize: 11, fontWeight: "800" }}>{count}</Text>
      </View>
    </TouchableOpacity>
  );
}

function TaskItem({ task, onToggle, onDelete }) {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: task.done ? SOFT : "#FFFFFF",
        borderColor: task.done ? LINE : "#E9E5FB",
        borderWidth: 1.5,
        borderRadius: 16,
        paddingVertical: 12,
        paddingHorizontal: 14,
        marginBottom: 10,
      }}
    >
      <TouchableOpacity
        onPress={() => onToggle(task.id)}
        activeOpacity={0.7}
        accessibilityRole="checkbox"
        accessibilityState={{ checked: task.done }}
        accessibilityLabel={task.done ? `Desmarcar ${task.title}` : `Concluir ${task.title}`}
        style={{ flex: 1, flexDirection: "row", alignItems: "center" }}
      >
        <View
          style={{
            width: 26,
            height: 26,
            borderRadius: 9,
            borderWidth: 2,
            borderColor: task.done ? MINT : "#C4B5FD",
            backgroundColor: task.done ? MINT : "#FFFFFF",
            alignItems: "center",
            justifyContent: "center",
            marginRight: 12,
          }}
        >
          {task.done ? <Text style={{ color: "#FFFFFF", fontSize: 15, fontWeight: "900" }}>✓</Text> : null}
        </View>
        <Text
          style={{
            flex: 1,
            color: task.done ? MUTED : TEXT,
            fontSize: 16,
            fontWeight: "600",
            textDecorationLine: task.done ? "line-through" : "none",
          }}
        >
          {task.title}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => onDelete(task.id)}
        activeOpacity={0.7}
        accessibilityRole="button"
        accessibilityLabel={`Excluir ${task.title}`}
        hitSlop={8}
        style={{
          marginLeft: 10,
          width: 34,
          height: 34,
          borderRadius: 10,
          backgroundColor: "#FFF1F2",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Text style={{ color: DANGER, fontSize: 16, fontWeight: "900" }}>✕</Text>
      </TouchableOpacity>
    </View>
  );
}

function EmptyState({ filter }) {
  const message = EMPTY_MESSAGES[filter];
  return (
    <View style={{ alignItems: "center", paddingVertical: 48, paddingHorizontal: 24 }}>
      <View
        style={{
          width: 84,
          height: 84,
          borderRadius: 42,
          backgroundColor: LILAC,
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 16,
        }}
      >
        <Text style={{ fontSize: 38 }}>{message.emoji}</Text>
      </View>
      <Text style={{ color: TEXT, fontSize: 18, fontWeight: "800" }}>{message.title}</Text>
      <Text style={{ color: MUTED, fontSize: 14, marginTop: 6, textAlign: "center", lineHeight: 20 }}>{message.text}</Text>
    </View>
  );
}

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [draft, setDraft] = useState("");
  const [filter, setFilter] = useState("all");
  const [storageError, setStorageError] = useState("");
  const inputRef = useRef(null);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((raw) => {
        const parsed = raw ? JSON.parse(raw) : [];
        setTasks(Array.isArray(parsed) ? parsed : []);
      })
      .catch(() => setStorageError("Não foi possível carregar suas tarefas."))
      .finally(() => setLoaded(true));
  }, []);

  useEffect(() => {
    if (!loaded) return;
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(tasks))
      .then(() => setStorageError(""))
      .catch(() => setStorageError("Não foi possível salvar suas tarefas."));
  }, [tasks, loaded]);

  const counts = useMemo(() => {
    const done = tasks.filter((task) => task.done).length;
    return { all: tasks.length, pending: tasks.length - done, done };
  }, [tasks]);

  const visibleTasks = useMemo(() => {
    if (filter === "pending") return tasks.filter((task) => !task.done);
    if (filter === "done") return tasks.filter((task) => task.done);
    return tasks;
  }, [tasks, filter]);

  const progress = counts.all ? counts.done / counts.all : 0;
  const canAdd = draft.trim().length > 0;

  function addTask() {
    const title = draft.trim();
    if (!title) return;
    setTasks((current) => [{ id: createId(), title, done: false, createdAt: Date.now() }, ...current]);
    setDraft("");
    if (filter === "done") setFilter("all");
    inputRef.current?.focus();
  }

  function toggleTask(id) {
    setTasks((current) => current.map((task) => (task.id === id ? { ...task, done: !task.done } : task)));
  }

  function deleteTask(id) {
    setTasks((current) => current.filter((task) => task.id !== id));
  }

  function clearDone() {
    Keyboard.dismiss();
    setTasks((current) => current.filter((task) => !task.done));
  }

  const header = (
    <View>
      <View style={{ padding: 24, paddingTop: Platform.OS === "web" ? 32 : 56 }}>
        <View style={{ backgroundColor: "#A78BFA", height: 8, width: 56, borderRadius: 99, marginBottom: 16 }} />
        <Text style={{ color: "#C4B5FD", fontSize: 13, fontWeight: "800", letterSpacing: 1 }}>APP 21</Text>
        <Text style={{ color: "#FFFFFF", fontSize: 30, fontWeight: "800", marginTop: 8 }}>Lista de Tarefas</Text>
        <Text style={{ color: "#DDD6FE", fontSize: 15, lineHeight: 22, marginTop: 10 }}>
          Organize o seu dia. Suas tarefas ficam salvas neste aparelho.
        </Text>

        <View style={{ backgroundColor: "rgba(255,255,255,0.08)", borderRadius: 18, padding: 16, marginTop: 20 }}>
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end" }}>
            <View>
              <Text style={{ color: "#C4B5FD", fontSize: 12, fontWeight: "800", letterSpacing: 0.5 }}>PENDENTES</Text>
              <Text style={{ color: "#FFFFFF", fontSize: 30, fontWeight: "800", marginTop: 2 }}>{counts.pending}</Text>
            </View>
            <Text style={{ color: "#DDD6FE", fontSize: 13, fontWeight: "700" }}>
              {counts.done} de {counts.all} concluída{counts.all === 1 ? "" : "s"}
            </Text>
          </View>
          <View style={{ height: 8, backgroundColor: "rgba(255,255,255,0.15)", borderRadius: 99, marginTop: 12, overflow: "hidden" }}>
            <View style={{ height: 8, width: `${Math.round(progress * 100)}%`, backgroundColor: MINT, borderRadius: 99 }} />
          </View>
        </View>
      </View>

      <View style={{ backgroundColor: "#FFFFFF", borderTopLeftRadius: 28, borderTopRightRadius: 28, paddingHorizontal: 20, paddingTop: 22 }}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <TextInput
            ref={inputRef}
            value={draft}
            onChangeText={setDraft}
            onSubmitEditing={addTask}
            submitBehavior="submit"
            returnKeyType="done"
            placeholder="O que você precisa fazer?"
            placeholderTextColor="#A39BC4"
            maxLength={120}
            accessibilityLabel="Nova tarefa"
            style={{
              flex: 1,
              backgroundColor: SOFT,
              borderColor: LINE,
              borderWidth: 2,
              borderRadius: 14,
              color: TEXT,
              fontSize: 16,
              fontWeight: "600",
              paddingHorizontal: 14,
              paddingVertical: 13,
            }}
          />
          <TouchableOpacity
            onPress={addTask}
            disabled={!canAdd}
            activeOpacity={0.85}
            accessibilityRole="button"
            accessibilityLabel="Adicionar tarefa"
            style={{
              marginLeft: 10,
              backgroundColor: canAdd ? VIOLET : "#C4B5FD",
              borderRadius: 14,
              paddingHorizontal: 16,
              paddingVertical: 15,
            }}
          >
            <Text style={{ color: "#FFFFFF", fontSize: 15, fontWeight: "800" }}>Adicionar</Text>
          </TouchableOpacity>
        </View>

        <View style={{ flexDirection: "row", backgroundColor: SOFT, borderRadius: 14, padding: 4, marginTop: 16 }}>
          {FILTERS.map((item) => (
            <FilterChip
              key={item.key}
              label={item.label}
              count={counts[item.key]}
              active={filter === item.key}
              onPress={() => setFilter(item.key)}
            />
          ))}
        </View>

        {storageError ? (
          <Text style={{ color: DANGER, fontSize: 13, fontWeight: "700", marginTop: 12 }}>{storageError}</Text>
        ) : null}

        <View style={{ height: 16 }} />
      </View>
    </View>
  );

  const footer = (
    <View style={{ backgroundColor: "#FFFFFF", paddingHorizontal: 20, paddingBottom: 40, flexGrow: 1 }}>
      {counts.done > 0 ? (
        <TouchableOpacity
          onPress={clearDone}
          activeOpacity={0.8}
          accessibilityRole="button"
          accessibilityLabel="Limpar tarefas concluídas"
          style={{
            marginTop: 6,
            borderWidth: 2,
            borderColor: "#FECDD3",
            borderRadius: 14,
            paddingVertical: 13,
            alignItems: "center",
          }}
        >
          <Text style={{ color: DANGER, fontSize: 14, fontWeight: "800" }}>
            Limpar concluídas ({counts.done})
          </Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: INK }}>
      <StatusBar style="light" />
      <View style={{ flex: 1, maxWidth: 480, width: "100%", alignSelf: "center" }}>
        {loaded ? (
          <FlatList
            data={visibleTasks}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={{ backgroundColor: "#FFFFFF", paddingHorizontal: 20 }}>
                <TaskItem task={item} onToggle={toggleTask} onDelete={deleteTask} />
              </View>
            )}
            ListHeaderComponent={header}
            ListEmptyComponent={
              <View style={{ backgroundColor: "#FFFFFF" }}>
                <EmptyState filter={filter} />
              </View>
            }
            ListFooterComponent={footer}
            ListFooterComponentStyle={{ flexGrow: 1 }}
            contentContainerStyle={{ flexGrow: 1 }}
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="on-drag"
          />
        ) : (
          <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
            <ActivityIndicator color="#C4B5FD" size="large" />
            <Text style={{ color: "#DDD6FE", marginTop: 12, fontWeight: "700" }}>Carregando tarefas...</Text>
          </View>
        )}
      </View>
    </View>
  );
}

import { StatusBar } from "expo-status-bar";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  createInitialState,
  createMockBackend,
  EVENT_TYPES,
} from "./mockBackend";

const LOJA = {
  nome: "Loja Centro",
  capacidade: 50,
};

const STATUS = {
  confortavel: { label: "Confortável", color: "#22c55e", bg: "#dcfce7" },
  moderado: { label: "Moderado", color: "#eab308", bg: "#fef9c3" },
  lotado: { label: "Quase lotado", color: "#f97316", bg: "#ffedd5" },
  critico: { label: "Capacidade crítica", color: "#ef4444", bg: "#fee2e2" },
};

function getStatus(ratio) {
  if (ratio >= 0.95) return STATUS.critico;
  if (ratio >= 0.8) return STATUS.lotado;
  if (ratio >= 0.6) return STATUS.moderado;
  return STATUS.confortavel;
}

function formatCurrency(value) {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

function formatTime(iso) {
  return new Date(iso).toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

function eventLabel(event) {
  if (event.type === EVENT_TYPES.ENTRADA) {
    const n = event.pessoas ?? 1;
    return n > 1 ? `${n} pessoas entraram` : "Cliente entrou";
  }
  if (event.type === EVENT_TYPES.SAIDA) return "Cliente saiu";
  return `Venda · ${formatCurrency(event.valor)} · ${event.itens} ${event.itens === 1 ? "item" : "itens"}`;
}

function eventIcon(type) {
  if (type === EVENT_TYPES.ENTRADA) return "↓";
  if (type === EVENT_TYPES.SAIDA) return "↑";
  return "R$";
}

function eventColor(type) {
  if (type === EVENT_TYPES.ENTRADA) return "#22c55e";
  if (type === EVENT_TYPES.SAIDA) return "#64748b";
  return "#3b82f6";
}

export default function App() {
  const backendRef = useRef(null);
  const [state, setState] = useState(() => createInitialState(LOJA.capacidade));
  const [events, setEvents] = useState([]);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const backend = createMockBackend(createInitialState(LOJA.capacidade));
    backendRef.current = backend;

    const unsubscribe = backend.subscribe(({ event, state: nextState }) => {
      setState(nextState);
      setEvents((prev) => [event, ...prev].slice(0, 30));
    });

    const connectDelay = setTimeout(() => {
      setConnected(true);
      backend.start();
    }, 800);

    return () => {
      clearTimeout(connectDelay);
      backend.stop();
      unsubscribe();
    };
  }, []);

  const ratio = state.ocupacao / state.capacidade;
  const status = getStatus(ratio);
  const percent = Math.round(ratio * 100);

  const chartBars = useMemo(() => {
    const slots = Array.from({ length: 12 }, (_, i) => {
      const hora = (new Date().getHours() - 11 + i + 24) % 24;
      const ponto = state.historico.find((h) => h.hora === hora);
      return { hora, ocupacao: ponto?.ocupacao ?? 0 };
    });
    const max = Math.max(state.capacidade, ...slots.map((s) => s.ocupacao), 1);
    return slots.map((slot) => ({
      ...slot,
      height: Math.max(4, (slot.ocupacao / max) * 72),
    }));
  }, [state.historico, state.capacidade]);

  return (
    <View style={{ flex: 1, backgroundColor: "#f1f5f9" }}>
      <StatusBar style="light" />
      <View
        style={{
          backgroundColor: "#0f172a",
          paddingTop: 56,
          paddingBottom: 24,
          paddingHorizontal: 20,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <View>
            <Text style={{ color: "#94a3b8", fontSize: 13 }}>Loja Pulse</Text>
            <Text
              style={{ color: "#f8fafc", fontSize: 22, fontWeight: "700" }}
            >
              {LOJA.nome}
            </Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 6,
              backgroundColor: connected ? "#14532d" : "#334155",
              paddingHorizontal: 10,
              paddingVertical: 5,
              borderRadius: 20,
            }}
          >
            <View
              style={{
                width: 7,
                height: 7,
                borderRadius: 4,
                backgroundColor: connected ? "#4ade80" : "#94a3b8",
              }}
            />
            <Text style={{ color: "#f8fafc", fontSize: 11 }}>
              {connected ? "Ao vivo" : "Conectando..."}
            </Text>
          </View>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={{ padding: 20, paddingBottom: 40, gap: 16 }}
        showsVerticalScrollIndicator={false}
      >
        <View
          style={{
            backgroundColor: "#fff",
            borderRadius: 16,
            padding: 24,
            shadowColor: "#000",
            shadowOpacity: 0.06,
            shadowRadius: 12,
            elevation: 3,
          }}
        >
          <Text style={{ color: "#64748b", fontSize: 14, marginBottom: 4 }}>
            Pessoas na loja agora
          </Text>
          <View
            style={{
              flexDirection: "row",
              alignItems: "flex-end",
              gap: 8,
              marginBottom: 16,
            }}
          >
            <Text
              style={{
                fontSize: 64,
                fontWeight: "800",
                color: "#0f172a",
                lineHeight: 68,
              }}
            >
              {state.ocupacao}
            </Text>
            <Text
              style={{
                fontSize: 18,
                color: "#94a3b8",
                marginBottom: 10,
              }}
            >
              / {state.capacidade}
            </Text>
          </View>

          <View
            style={{
              height: 12,
              backgroundColor: "#e2e8f0",
              borderRadius: 6,
              overflow: "hidden",
              marginBottom: 12,
            }}
          >
            <View
              style={{
                height: "100%",
                width: `${Math.min(percent, 100)}%`,
                backgroundColor: status.color,
                borderRadius: 6,
              }}
            />
          </View>

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <View
              style={{
                backgroundColor: status.bg,
                paddingHorizontal: 12,
                paddingVertical: 6,
                borderRadius: 20,
              }}
            >
              <Text style={{ color: status.color, fontWeight: "600" }}>
                {status.label} · {percent}%
              </Text>
            </View>
            <Text style={{ color: "#64748b", fontSize: 13 }}>
              {LOJA.capacidade - state.ocupacao} vagas
            </Text>
          </View>
        </View>

        <View style={{ flexDirection: "row", gap: 12 }}>
          <StatCard label="Entradas" value={state.entradas} accent="#22c55e" />
          <StatCard label="Saídas" value={state.saidas} accent="#64748b" />
          <StatCard label="Vendas" value={state.vendas} accent="#3b82f6" />
        </View>

        <View
          style={{
            backgroundColor: "#fff",
            borderRadius: 16,
            padding: 20,
            shadowColor: "#000",
            shadowOpacity: 0.04,
            shadowRadius: 8,
            elevation: 2,
          }}
        >
          <Text style={{ color: "#64748b", fontSize: 13, marginBottom: 4 }}>
            Faturamento do dia
          </Text>
          <Text
            style={{ fontSize: 28, fontWeight: "700", color: "#0f172a" }}
          >
            {formatCurrency(state.faturamento)}
          </Text>
        </View>

        <View
          style={{
            backgroundColor: "#fff",
            borderRadius: 16,
            padding: 20,
            shadowColor: "#000",
            shadowOpacity: 0.04,
            shadowRadius: 8,
            elevation: 2,
          }}
        >
          <Text
            style={{
              color: "#0f172a",
              fontWeight: "600",
              fontSize: 15,
              marginBottom: 16,
            }}
          >
            Ocupação por hora
          </Text>
          <View
            style={{
              flexDirection: "row",
              alignItems: "flex-end",
              justifyContent: "space-between",
              height: 80,
            }}
          >
            {chartBars.map((bar) => (
              <View key={bar.hora} style={{ alignItems: "center", flex: 1 }}>
                <View
                  style={{
                    width: 14,
                    height: bar.height,
                    backgroundColor:
                      bar.ocupacao / state.capacidade >= 0.8
                        ? "#f97316"
                        : "#3b82f6",
                    borderRadius: 4,
                    opacity: bar.ocupacao > 0 ? 1 : 0.2,
                  }}
                />
                <Text style={{ color: "#94a3b8", fontSize: 9, marginTop: 4 }}>
                  {bar.hora}h
                </Text>
              </View>
            ))}
          </View>
        </View>

        <View
          style={{
            backgroundColor: "#fff",
            borderRadius: 16,
            padding: 20,
            shadowColor: "#000",
            shadowOpacity: 0.04,
            shadowRadius: 8,
            elevation: 2,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginBottom: 12,
            }}
          >
            <Text style={{ color: "#0f172a", fontWeight: "600", fontSize: 15 }}>
              Eventos ao vivo
            </Text>
            <Text style={{ color: "#94a3b8", fontSize: 12 }}>mock backend</Text>
          </View>

          {events.length === 0 ? (
            <Text style={{ color: "#94a3b8", fontSize: 14 }}>
              Aguardando eventos...
            </Text>
          ) : (
            <ScrollView
              style={{ maxHeight: 280 }}
              nestedScrollEnabled
              showsVerticalScrollIndicator
            >
              {events.map((event) => (
                <View
                  key={event.id}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 12,
                    paddingVertical: 10,
                    borderBottomWidth: 1,
                    borderBottomColor: "#f1f5f9",
                  }}
                >
                  <View
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: 16,
                      backgroundColor: `${eventColor(event.type)}22`,
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Text
                      style={{
                        color: eventColor(event.type),
                        fontWeight: "700",
                        fontSize: 12,
                      }}
                    >
                      {eventIcon(event.type)}
                    </Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={{ color: "#0f172a", fontSize: 14 }}>
                      {eventLabel(event)}
                    </Text>
                    <Text style={{ color: "#94a3b8", fontSize: 12 }}>
                      {formatTime(event.timestamp)}
                    </Text>
                  </View>
                </View>
              ))}
            </ScrollView>
          )}
        </View>

        <View style={{ flexDirection: "row", gap: 12 }}>
          <TouchableOpacity
            onPress={() => backendRef.current?.simulateEntrada()}
            style={{
              flex: 1,
              backgroundColor: "#22c55e",
              paddingVertical: 14,
              borderRadius: 12,
              alignItems: "center",
            }}
          >
            <Text style={{ color: "#fff", fontWeight: "600" }}>
              Simular entrada
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => backendRef.current?.simulateSaida()}
            style={{
              flex: 1,
              backgroundColor: "#64748b",
              paddingVertical: 14,
              borderRadius: 12,
              alignItems: "center",
            }}
          >
            <Text style={{ color: "#fff", fontWeight: "600" }}>
              Simular saída
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

function StatCard({ label, value, accent }) {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#fff",
        borderRadius: 14,
        padding: 16,
        borderTopWidth: 3,
        borderTopColor: accent,
        shadowColor: "#000",
        shadowOpacity: 0.04,
        shadowRadius: 6,
        elevation: 2,
      }}
    >
      <Text style={{ color: "#64748b", fontSize: 12, marginBottom: 4 }}>
        {label}
      </Text>
      <Text style={{ color: "#0f172a", fontSize: 24, fontWeight: "700" }}>
        {value}
      </Text>
    </View>
  );
}

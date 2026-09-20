import { StatusBar } from "expo-status-bar";
import { useMemo, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import {
  applyOp,
  backspace,
  clear,
  createCalc,
  equals,
  expressionLabel,
  inputDigit,
  inputDot,
  percent,
  toggleSign,
} from "./calc";

const KEYS = [
  { label: "C", kind: "fn", action: "clear" },
  { label: "±", kind: "fn", action: "sign" },
  { label: "%", kind: "fn", action: "percent" },
  { label: "÷", kind: "op", action: "/" },
  { label: "7", kind: "num", action: "7" },
  { label: "8", kind: "num", action: "8" },
  { label: "9", kind: "num", action: "9" },
  { label: "×", kind: "op", action: "*" },
  { label: "4", kind: "num", action: "4" },
  { label: "5", kind: "num", action: "5" },
  { label: "6", kind: "num", action: "6" },
  { label: "−", kind: "op", action: "-" },
  { label: "1", kind: "num", action: "1" },
  { label: "2", kind: "num", action: "2" },
  { label: "3", kind: "num", action: "3" },
  { label: "+", kind: "op", action: "+" },
  { label: "⌫", kind: "fn", action: "back" },
  { label: "0", kind: "num", action: "0" },
  { label: ",", kind: "num", action: "dot" },
  { label: "=", kind: "eq", action: "eq" },
];

function keyColors(kind, active) {
  if (kind === "op") {
    return active
      ? { bg: "#93c5fd", color: "#0f172a" }
      : { bg: "#2563eb", color: "#ffffff" };
  }
  if (kind === "eq") return { bg: "#1d4ed8", color: "#ffffff" };
  if (kind === "fn") return { bg: "#334155", color: "#e2e8f0" };
  return { bg: "#1e293b", color: "#f8fafc" };
}

function Key({ item, active, onPress }) {
  const { bg, color } = keyColors(item.kind, active);
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.75}
      accessibilityRole="button"
      accessibilityLabel={item.label}
      style={{
        flex: 1,
        height: 72,
        borderRadius: 18,
        backgroundColor: bg,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Text style={{ color, fontSize: 26, fontWeight: "700" }}>{item.label}</Text>
    </TouchableOpacity>
  );
}

export default function App() {
  const [state, setState] = useState(createCalc);
  const expr = useMemo(() => expressionLabel(state), [state]);

  function press(item) {
    setState((prev) => {
      if (item.action === "clear") return clear();
      if (item.action === "sign") return toggleSign(prev);
      if (item.action === "percent") return percent(prev);
      if (item.action === "back") return backspace(prev);
      if (item.action === "dot") return inputDot(prev);
      if (item.action === "eq") return equals(prev);
      if (item.kind === "op") return applyOp(prev, item.action);
      return inputDigit(prev, item.action);
    });
  }

  const rows = [];
  for (let i = 0; i < KEYS.length; i += 4) {
    rows.push(KEYS.slice(i, i + 4));
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#0f172a" }}>
      <StatusBar style="light" />
      <View style={{ flex: 1, width: "100%", maxWidth: 420, alignSelf: "center" }}>

      <View style={{ paddingTop: 56, paddingHorizontal: 24, paddingBottom: 12 }}>
        <Text style={{ color: "#93c5fd", fontSize: 14, fontWeight: "700", letterSpacing: 0.6 }}>
          APP 03
        </Text>
        <Text style={{ color: "#ffffff", fontSize: 28, fontWeight: "800", marginTop: 6 }}>
          Calculadora
        </Text>
        <Text style={{ color: "#94a3b8", fontSize: 14, marginTop: 6 }}>
          Soma, subtração, multiplicação e divisão.
        </Text>
      </View>

      <View style={{ flex: 1, justifyContent: "flex-end", paddingHorizontal: 20 }}>
        <Text
          style={{
            color: "#64748b",
            fontSize: 18,
            textAlign: "right",
            minHeight: 24,
            marginBottom: 8,
          }}
        >
          {expr}
        </Text>
        <Text
          numberOfLines={1}
          adjustsFontSizeToFit
          accessibilityRole="text"
          accessibilityLabel={`resultado ${state.display.replace(".", ",")}`}
          style={{
            color: "#f8fafc",
            fontSize: 56,
            fontWeight: "700",
            textAlign: "right",
            marginBottom: 20,
          }}
        >
          {state.display.replace(".", ",")}
        </Text>
      </View>

      <View style={{ paddingHorizontal: 16, paddingBottom: 28, gap: 10 }}>
        {rows.map((row) => (
          <View key={row.map((k) => k.label).join("")} style={{ flexDirection: "row", gap: 10 }}>
            {row.map((item) => (
              <Key
                key={item.label}
                item={item}
                active={item.kind === "op" && state.op === item.action && state.fresh}
                onPress={() => press(item)}
              />
            ))}
          </View>
        ))}
      </View>
      </View>
    </View>
  );
}

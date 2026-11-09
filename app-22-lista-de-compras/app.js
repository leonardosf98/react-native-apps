import AsyncStorage from "@react-native-async-storage/async-storage";
import { StatusBar } from "expo-status-bar";
import { useEffect, useMemo, useRef, useState } from "react";
import { ActivityIndicator, Keyboard, Modal, Pressable, ScrollView, Text, TextInput, View } from "react-native";

const STORAGE_KEY = "@lista-de-compras/itens";

const FOREST = "#14532D";
const GREEN = "#16A34A";
const LIME = "#A3E635";
const LIME_SOFT = "#ECFCCB";
const CREAM = "#F7FBEF";
const LINE = "#D9F99D";
const TEXT = "#1A2E05";
const MUTED = "#5B6B4A";
const RED = "#DC2626";

function formatMoney(value) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function centsToDisplay(raw) {
  const digits = String(raw || "").replace(/\D/g, "").replace(/^0+/, "");
  if (!digits) return "";
  const padded = digits.padStart(3, "0");
  return `${padded.slice(0, -2)},${padded.slice(-2)}`;
}

function createId() {
  return `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 7)}`;
}

function sortItems(items) {
  return [...items].sort((a, b) => Number(a.inCart) - Number(b.inCart) || b.createdAt - a.createdAt);
}

function RoundButton({ label, onPress, disabled, tone = "light", size = 34, accessibilityLabel }) {
  const dark = tone === "dark";
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityLabel={accessibilityLabel}
      style={({ pressed }) => ({
        width: size,
        height: size,
        borderRadius: size / 2,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: dark ? GREEN : LIME_SOFT,
        borderWidth: dark ? 0 : 1.5,
        borderColor: LINE,
        opacity: disabled ? 0.35 : pressed ? 0.7 : 1,
      })}
    >
      <Text style={{ color: dark ? "#FFFFFF" : FOREST, fontSize: size * 0.55, fontWeight: "900", lineHeight: size * 0.65 }}>{label}</Text>
    </Pressable>
  );
}

function Stepper({ value, onChange, min = 1 }) {
  return (
    <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
      <RoundButton label="−" accessibilityLabel="Diminuir quantidade" disabled={value <= min} onPress={() => onChange(value - 1)} />
      <Text style={{ minWidth: 28, textAlign: "center", color: TEXT, fontSize: 17, fontWeight: "900" }}>{value}</Text>
      <RoundButton label="+" accessibilityLabel="Aumentar quantidade" disabled={value >= 999} onPress={() => onChange(value + 1)} />
    </View>
  );
}

function SummaryCard({ label, value, highlight }) {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: highlight ? LIME : "rgba(255,255,255,0.12)",
        borderRadius: 18,
        padding: 14,
      }}
    >
      <Text style={{ color: highlight ? FOREST : "#D9F99D", fontSize: 12, fontWeight: "800", textTransform: "uppercase", letterSpacing: 0.6 }}>
        {label}
      </Text>
      <Text style={{ color: highlight ? FOREST : "#FFFFFF", fontSize: 21, fontWeight: "900", marginTop: 4 }} numberOfLines={1} adjustsFontSizeToFit>
        {value}
      </Text>
    </View>
  );
}

function AddForm({ onAdd }) {
  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [price, setPrice] = useState("");
  const [error, setError] = useState("");
  const nameRef = useRef(null);

  function submit() {
    const trimmed = name.trim();
    if (!trimmed) {
      setError("Dê um nome ao item.");
      return;
    }
    const cents = Number(String(price).replace(/\D/g, "")) || 0;
    onAdd({ name: trimmed, quantity, price: cents ? cents / 100 : null });
    setName("");
    setQuantity(1);
    setPrice("");
    setError("");
    nameRef.current?.focus();
  }

  return (
    <View style={{ backgroundColor: "#FFFFFF", borderRadius: 22, padding: 16, borderWidth: 1.5, borderColor: LINE, marginTop: -28 }}>
      <Text style={{ color: TEXT, fontSize: 13, fontWeight: "800", marginBottom: 8 }}>O que vai levar?</Text>
      <TextInput
        ref={nameRef}
        value={name}
        onChangeText={(text) => {
          setName(text);
          if (error) setError("");
        }}
        onSubmitEditing={submit}
        returnKeyType="done"
        placeholder="Ex.: Banana prata"
        placeholderTextColor="#9CAF88"
        maxLength={60}
        accessibilityLabel="Nome do item"
        style={{
          backgroundColor: CREAM,
          borderColor: error ? RED : LINE,
          borderWidth: 1.5,
          borderRadius: 14,
          paddingHorizontal: 14,
          paddingVertical: 12,
          fontSize: 16,
          fontWeight: "700",
          color: TEXT,
        }}
      />
      {error ? <Text style={{ color: RED, fontSize: 12, fontWeight: "700", marginTop: 6 }}>{error}</Text> : null}

      <View style={{ flexDirection: "row", alignItems: "flex-end", gap: 12, marginTop: 14 }}>
        <View>
          <Text style={{ color: MUTED, fontSize: 12, fontWeight: "800", marginBottom: 8 }}>Quantidade</Text>
          <View style={{ height: 46, justifyContent: "center" }}>
            <Stepper value={quantity} onChange={setQuantity} />
          </View>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={{ color: MUTED, fontSize: 12, fontWeight: "800", marginBottom: 8 }}>Preço unitário (opcional)</Text>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: CREAM,
              borderColor: LINE,
              borderWidth: 1.5,
              borderRadius: 14,
              paddingHorizontal: 12,
              height: 46,
            }}
          >
            <Text style={{ color: MUTED, fontWeight: "800", marginRight: 6 }}>R$</Text>
            <TextInput
              value={centsToDisplay(price)}
              onChangeText={(text) => {
                const digits = text.replace(/\D/g, "").replace(/^0+/, "");
                if (digits.length <= 7) setPrice(digits);
              }}
              keyboardType="numeric"
              placeholder="0,00"
              placeholderTextColor="#9CAF88"
              accessibilityLabel="Preço unitário"
              style={{ flex: 1, minWidth: 0, fontSize: 16, fontWeight: "800", color: TEXT, paddingVertical: 8 }}
            />
          </View>
        </View>
      </View>

      <Pressable
        onPress={submit}
        style={({ pressed }) => ({
          marginTop: 16,
          backgroundColor: GREEN,
          borderRadius: 14,
          paddingVertical: 14,
          alignItems: "center",
          opacity: pressed ? 0.85 : 1,
        })}
      >
        <Text style={{ color: "#FFFFFF", fontSize: 16, fontWeight: "900" }}>🧺  Adicionar à lista</Text>
      </Pressable>
    </View>
  );
}

function ItemRow({ item, onToggle, onQuantity, onRemove }) {
  const subtotal = item.price ? item.price * item.quantity : null;
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: item.inCart ? LIME_SOFT : "#FFFFFF",
        borderRadius: 18,
        borderWidth: 1.5,
        borderColor: item.inCart ? LIME : LINE,
        padding: 12,
        marginBottom: 10,
        gap: 12,
      }}
    >
      <Pressable
        onPress={onToggle}
        accessibilityRole="checkbox"
        accessibilityState={{ checked: item.inCart }}
        accessibilityLabel={item.inCart ? "Tirar do carrinho" : "Colocar no carrinho"}
        style={({ pressed }) => ({
          width: 44,
          height: 44,
          borderRadius: 14,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: item.inCart ? GREEN : CREAM,
          borderWidth: item.inCart ? 0 : 2,
          borderColor: LINE,
          borderStyle: item.inCart ? "solid" : "dashed",
          opacity: pressed ? 0.7 : 1,
        })}
      >
        <Text style={{ fontSize: 20 }}>{item.inCart ? "🛒" : "＋"}</Text>
      </Pressable>

      <View style={{ flex: 1, minWidth: 0 }}>
        <Text
          numberOfLines={2}
          style={{
            color: item.inCart ? MUTED : TEXT,
            fontSize: 16,
            fontWeight: "800",
            textDecorationLine: item.inCart ? "line-through" : "none",
          }}
        >
          {item.name}
        </Text>
        <Text style={{ color: MUTED, fontSize: 12, fontWeight: "700", marginTop: 3 }}>
          {item.price ? `${formatMoney(item.price)} un. · ${formatMoney(subtotal)}` : "Sem preço"}
        </Text>
        <View style={{ marginTop: 8, alignSelf: "flex-start" }}>
          <Stepper value={item.quantity} onChange={onQuantity} />
        </View>
      </View>

      <Pressable
        onPress={onRemove}
        accessibilityLabel={`Excluir ${item.name}`}
        hitSlop={8}
        style={({ pressed }) => ({
          width: 36,
          height: 36,
          borderRadius: 12,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: pressed ? "#FEE2E2" : "transparent",
        })}
      >
        <Text style={{ fontSize: 17 }}>🗑️</Text>
      </Pressable>
    </View>
  );
}

function ConfirmModal({ visible, count, onCancel, onConfirm }) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
      <View style={{ flex: 1, backgroundColor: "rgba(20,83,45,0.55)", alignItems: "center", justifyContent: "center", padding: 24 }}>
        <View style={{ width: "100%", maxWidth: 360, backgroundColor: "#FFFFFF", borderRadius: 24, padding: 22 }}>
          <Text style={{ fontSize: 36, textAlign: "center" }}>🧾</Text>
          <Text style={{ color: TEXT, fontSize: 19, fontWeight: "900", textAlign: "center", marginTop: 8 }}>Limpar a lista?</Text>
          <Text style={{ color: MUTED, fontSize: 14, fontWeight: "600", textAlign: "center", marginTop: 6, lineHeight: 20 }}>
            {count === 1 ? "O item será removido" : `Os ${count} itens serão removidos`} e não dá para desfazer.
          </Text>
          <View style={{ flexDirection: "row", gap: 10, marginTop: 20 }}>
            <Pressable
              onPress={onCancel}
              style={({ pressed }) => ({
                flex: 1,
                paddingVertical: 13,
                borderRadius: 14,
                backgroundColor: LIME_SOFT,
                alignItems: "center",
                opacity: pressed ? 0.8 : 1,
              })}
            >
              <Text style={{ color: FOREST, fontWeight: "900", fontSize: 15 }}>Cancelar</Text>
            </Pressable>
            <Pressable
              onPress={onConfirm}
              style={({ pressed }) => ({
                flex: 1,
                paddingVertical: 13,
                borderRadius: 14,
                backgroundColor: RED,
                alignItems: "center",
                opacity: pressed ? 0.85 : 1,
              })}
            >
              <Text style={{ color: "#FFFFFF", fontWeight: "900", fontSize: 15 }}>Limpar</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

export default function App() {
  const [items, setItems] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [storageError, setStorageError] = useState("");
  const [confirmOpen, setConfirmOpen] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((raw) => {
        const parsed = raw ? JSON.parse(raw) : [];
        if (Array.isArray(parsed)) setItems(parsed);
      })
      .catch(() => setStorageError("Não foi possível carregar a lista salva."))
      .finally(() => setLoaded(true));
  }, []);

  useEffect(() => {
    if (!loaded) return;
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(items))
      .then(() => setStorageError(""))
      .catch(() => setStorageError("Não foi possível salvar as alterações."));
  }, [items, loaded]);

  const totals = useMemo(() => {
    let estimated = 0;
    let cart = 0;
    let inCart = 0;
    let unpriced = 0;
    for (const item of items) {
      const subtotal = item.price ? item.price * item.quantity : 0;
      estimated += subtotal;
      if (!item.price) unpriced += 1;
      if (item.inCart) {
        cart += subtotal;
        inCart += 1;
      }
    }
    return { estimated, cart, inCart, unpriced };
  }, [items]);

  const sorted = useMemo(() => sortItems(items), [items]);
  const progress = items.length ? totals.inCart / items.length : 0;

  function addItem({ name, quantity, price }) {
    setItems((current) => [{ id: createId(), name, quantity, price, inCart: false, createdAt: Date.now() }, ...current]);
  }

  function updateItem(id, changes) {
    setItems((current) => current.map((item) => (item.id === id ? { ...item, ...changes } : item)));
  }

  function removeItem(id) {
    setItems((current) => current.filter((item) => item.id !== id));
  }

  function clearList() {
    setConfirmOpen(false);
    setItems([]);
  }

  return (
    <View style={{ flex: 1, backgroundColor: CREAM }}>
      <StatusBar style="light" />
      <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{ paddingBottom: 40 }} onScrollBeginDrag={Keyboard.dismiss}>
        <View style={{ backgroundColor: FOREST, paddingTop: 52, paddingBottom: 48, paddingHorizontal: 20, borderBottomLeftRadius: 32, borderBottomRightRadius: 32 }}>
          <View style={{ width: "100%", maxWidth: 560, alignSelf: "center" }}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
              <View style={{ width: 44, height: 44, borderRadius: 14, backgroundColor: LIME, alignItems: "center", justifyContent: "center" }}>
                <Text style={{ fontSize: 24 }}>🥬</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ color: LIME, fontSize: 12, fontWeight: "900", letterSpacing: 1.2, textTransform: "uppercase" }}>Feira da semana</Text>
                <Text style={{ color: "#FFFFFF", fontSize: 26, fontWeight: "900" }}>Lista de Compras</Text>
              </View>
            </View>

            <View style={{ flexDirection: "row", gap: 10, marginTop: 20 }}>
              <SummaryCard label="Total estimado" value={formatMoney(totals.estimated)} />
              <SummaryCard label="No carrinho" value={formatMoney(totals.cart)} highlight />
            </View>

            <View style={{ marginTop: 16 }}>
              <View style={{ height: 8, borderRadius: 4, backgroundColor: "rgba(255,255,255,0.15)", overflow: "hidden" }}>
                <View style={{ width: `${progress * 100}%`, height: "100%", backgroundColor: LIME, borderRadius: 4 }} />
              </View>
              <Text style={{ color: "#D9F99D", fontSize: 12, fontWeight: "700", marginTop: 8 }}>
                {items.length ? `${totals.inCart} de ${items.length} ${items.length === 1 ? "item" : "itens"} no carrinho` : "Comece adicionando o primeiro item"}
                {totals.unpriced ? ` · ${totals.unpriced} sem preço` : ""}
              </Text>
            </View>
          </View>
        </View>

        <View style={{ width: "100%", maxWidth: 560, alignSelf: "center", paddingHorizontal: 16 }}>
          <AddForm onAdd={addItem} />

          {storageError ? (
            <View style={{ backgroundColor: "#FEF2F2", borderRadius: 12, padding: 12, marginTop: 12 }}>
              <Text style={{ color: RED, fontWeight: "700", fontSize: 13 }}>{storageError}</Text>
            </View>
          ) : null}

          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 24, marginBottom: 12 }}>
            <Text style={{ color: TEXT, fontSize: 18, fontWeight: "900" }}>Itens {items.length ? `(${items.length})` : ""}</Text>
            {items.length ? (
              <Pressable
                onPress={() => setConfirmOpen(true)}
                style={({ pressed }) => ({ paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10, backgroundColor: pressed ? "#FEE2E2" : "transparent" })}
              >
                <Text style={{ color: RED, fontWeight: "800", fontSize: 13 }}>Limpar lista</Text>
              </Pressable>
            ) : null}
          </View>

          {!loaded ? (
            <ActivityIndicator color={GREEN} style={{ marginTop: 24 }} />
          ) : items.length === 0 ? (
            <View style={{ alignItems: "center", paddingVertical: 36, borderRadius: 22, borderWidth: 2, borderColor: LINE, borderStyle: "dashed" }}>
              <Text style={{ fontSize: 44 }}>🛒</Text>
              <Text style={{ color: TEXT, fontSize: 16, fontWeight: "900", marginTop: 8 }}>Carrinho vazio por enquanto</Text>
              <Text style={{ color: MUTED, fontSize: 13, fontWeight: "600", marginTop: 4, textAlign: "center", paddingHorizontal: 24 }}>
                Adicione frutas, verduras e o que mais precisar.
              </Text>
            </View>
          ) : (
            sorted.map((item) => (
              <ItemRow
                key={item.id}
                item={item}
                onToggle={() => updateItem(item.id, { inCart: !item.inCart })}
                onQuantity={(quantity) => updateItem(item.id, { quantity })}
                onRemove={() => removeItem(item.id)}
              />
            ))
          )}
        </View>
      </ScrollView>

      <ConfirmModal visible={confirmOpen} count={items.length} onCancel={() => setConfirmOpen(false)} onConfirm={clearList} />
    </View>
  );
}

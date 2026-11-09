import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import { Keyboard, Platform, Pressable, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import { CURRENCIES, REFERENCE_DATE, convert, formatBrl, formatCurrency, parseAmount } from "./currency";

const DEEP = "#052E2B";
const EMERALD = "#059669";
const MINT = "#ECFDF5";
const LINE = "#A7F3D0";
const GOLD = "#F59E0B";
const TEXT = "#0F2A26";
const MUTED = "#4B6B64";
const ERROR = "#B91C1C";

function CurrencyOption({ currency, selected, onPress }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.85}
      accessibilityRole="radio"
      accessibilityState={{ selected }}
      accessibilityLabel={currency.name}
      style={{
        width: "48%",
        marginBottom: 10,
        padding: 14,
        borderRadius: 16,
        borderWidth: 2,
        borderColor: selected ? EMERALD : LINE,
        backgroundColor: selected ? MINT : "#FFFFFF",
      }}
    >
      <Text style={{ fontSize: 24, color: currency.code === "BTC" ? GOLD : TEXT, fontWeight: "800" }}>{currency.flag}</Text>
      <Text style={{ color: selected ? EMERALD : TEXT, fontSize: 16, fontWeight: "800", marginTop: 6 }}>{currency.code}</Text>
      <Text style={{ color: MUTED, fontSize: 12, fontWeight: "600", marginTop: 2 }}>{currency.name}</Text>
    </TouchableOpacity>
  );
}

function RatesTable({ selectedCode }) {
  return (
    <View style={{ backgroundColor: MINT, borderRadius: 18, padding: 18, marginTop: 24 }}>
      <Text style={{ color: DEEP, fontSize: 15, fontWeight: "800" }}>Cotação de referência</Text>
      <Text style={{ color: MUTED, fontSize: 12, marginTop: 4, marginBottom: 12 }}>
        Valores fixos de {REFERENCE_DATE}, usados apenas para fins didáticos.
      </Text>
      {CURRENCIES.map((currency, index) => {
        const active = currency.code === selectedCode;
        return (
          <View
            key={currency.code}
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              paddingVertical: 10,
              borderTopWidth: index === 0 ? 0 : 1,
              borderTopColor: LINE,
            }}
          >
            <Text style={{ color: active ? EMERALD : TEXT, fontSize: 14, fontWeight: active ? "800" : "600" }}>
              1 {currency.code}
            </Text>
            <Text style={{ color: active ? EMERALD : TEXT, fontSize: 14, fontWeight: "800" }}>{formatBrl(currency.rate)}</Text>
          </View>
        );
      })}
    </View>
  );
}

export default function App() {
  const [input, setInput] = useState("");
  const [code, setCode] = useState(null);

  const currency = CURRENCIES.find((item) => item.code === code);
  const parsed = currency ? parseAmount(input) : null;
  const error = parsed?.error ?? "";
  const result =
    parsed && !parsed.error ? { amount: parsed.amount, currency, value: convert(parsed.amount, currency) } : null;

  return (
    <Pressable style={{ flex: 1, backgroundColor: DEEP }} onPress={Platform.OS === "web" ? undefined : Keyboard.dismiss} accessible={false}>
      <StatusBar style="light" />
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
        <View style={{ flex: 1, maxWidth: 440, width: "100%", alignSelf: "center" }}>
          <View style={{ padding: 24, paddingTop: 56 }}>
            <View style={{ backgroundColor: GOLD, height: 8, width: 56, borderRadius: 99, marginBottom: 16 }} />
            <Text style={{ color: "#6EE7B7", fontSize: 13, fontWeight: "800", letterSpacing: 1 }}>APP 11</Text>
            <Text style={{ color: "#FFFFFF", fontSize: 30, fontWeight: "800", marginTop: 8 }}>Conversor de Moedas</Text>
            <Text style={{ color: "#D1FAE5", fontSize: 15, lineHeight: 22, marginTop: 10 }}>
              Digite um valor em reais e veja quanto ele vale em outra moeda.
            </Text>
          </View>

          <View style={{ flex: 1, backgroundColor: "#FFFFFF", borderTopLeftRadius: 28, borderTopRightRadius: 28, padding: 24 }}>
            <Text style={{ color: TEXT, fontSize: 14, fontWeight: "800", marginBottom: 8 }}>Valor em Real (BRL)</Text>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                backgroundColor: MINT,
                borderColor: error ? ERROR : LINE,
                borderRadius: 14,
                borderWidth: 2,
                paddingHorizontal: 16,
              }}
            >
              <Text style={{ color: EMERALD, fontSize: 22, fontWeight: "800", marginRight: 8 }}>R$</Text>
              <TextInput
                value={input}
                onChangeText={setInput}
                placeholder="Ex.: 1.250,90"
                placeholderTextColor="#86B5A8"
                keyboardType="decimal-pad"
                returnKeyType="done"
                accessibilityLabel="Valor em reais"
                style={{ flex: 1, minWidth: 0, color: TEXT, fontSize: 22, fontWeight: "700", paddingVertical: 14, outlineStyle: "none" }}
              />
            </View>

            <Text style={{ color: TEXT, fontSize: 14, fontWeight: "800", marginTop: 20, marginBottom: 10 }}>Converter para</Text>
            <View style={{ flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between" }}>
              {CURRENCIES.map((item) => (
                <CurrencyOption
                  key={item.code}
                  currency={item}
                  selected={item.code === code}
                  onPress={() => setCode(item.code)}
                />
              ))}
            </View>

            {error ? <Text style={{ color: ERROR, fontWeight: "600", marginTop: 8 }}>{error}</Text> : null}

            {result ? (
              <View style={{ backgroundColor: DEEP, borderRadius: 20, marginTop: 24, padding: 22 }}>
                <Text style={{ color: "#A7F3D0", fontWeight: "700" }}>{formatBrl(result.amount)} equivalem a</Text>
                <Text
                  style={{ color: "#FFFFFF", fontSize: 34, fontWeight: "800", marginTop: 6 }}
                  adjustsFontSizeToFit
                  numberOfLines={2}
                >
                  {formatCurrency(result.value, result.currency)}
                </Text>
                <Text style={{ color: GOLD, fontSize: 14, fontWeight: "800", marginTop: 8 }}>
                  {result.currency.name} · 1 {result.currency.code} = {formatBrl(result.currency.rate)}
                </Text>
              </View>
            ) : null}

            <RatesTable selectedCode={code} />
            <View style={{ height: 32 }} />
          </View>
        </View>
      </ScrollView>
    </Pressable>
  );
}

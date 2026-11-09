import Ionicons from "@expo/vector-icons/Ionicons";
import { useState } from "react";
import { Keyboard, Pressable, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import { RATES_DATE, convert, formatBrl, formatNumber, parseBrl } from "./currencies";

const INK = "#0F172A";
const MUTED = "#64748B";
const LINE = "#E2E8F0";
const QUICK = ["100", "500", "1.000", "5.000"];

export default function Converter({ currency }) {
  const [input, setInput] = useState("");
  const [touched, setTouched] = useState(false);
  const parsed = parseBrl(input);
  const showError = touched && parsed.error;
  const result = parsed.value ? convert(parsed.value, currency) : null;

  function handleChange(text) {
    setInput(text.replace(/[^\d.,]/g, ""));
    setTouched(true);
  }

  function pick(value) {
    setInput(value);
    setTouched(true);
    Keyboard.dismiss();
  }

  function clear() {
    setInput("");
    setTouched(false);
  }

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: "#F1F5F9" }}
      contentContainerStyle={{ padding: 20, paddingBottom: 40, width: "100%", maxWidth: 520, alignSelf: "center" }}
      keyboardShouldPersistTaps="handled"
    >
      <Pressable onPress={Keyboard.dismiss} accessible={false}>
        <View
          style={{
            backgroundColor: currency.accent,
            borderRadius: 24,
            padding: 20,
            marginBottom: 18,
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 14 }}>
            <View
              style={{
                width: 48,
                height: 48,
                borderRadius: 24,
                backgroundColor: "rgba(255,255,255,0.22)",
                alignItems: "center",
                justifyContent: "center",
                marginRight: 12,
              }}
            >
              <Ionicons name={currency.icon} size={26} color="#FFFFFF" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ color: "rgba(255,255,255,0.8)", fontSize: 13, fontWeight: "700" }}>Real → {currency.code}</Text>
              <Text style={{ color: "#FFFFFF", fontSize: 22, fontWeight: "900" }}>{currency.name}</Text>
            </View>
          </View>
          <View style={{ backgroundColor: "rgba(0,0,0,0.14)", borderRadius: 14, padding: 14 }}>
            <Text style={{ color: "rgba(255,255,255,0.8)", fontSize: 12, fontWeight: "700", marginBottom: 4 }}>
              COTAÇÃO FIXA · {RATES_DATE}
            </Text>
            <Text style={{ color: "#FFFFFF", fontSize: 18, fontWeight: "800" }}>
              1 {currency.code} = {formatBrl(currency.rate)}
            </Text>
            <Text style={{ color: "rgba(255,255,255,0.85)", fontSize: 13, fontWeight: "600", marginTop: 2 }}>
              R$ 1,00 = {currency.symbol} {formatNumber(1 / currency.rate, currency.decimals === 8 ? 8 : 4)}
            </Text>
          </View>
        </View>

        <View style={{ backgroundColor: "#FFFFFF", borderRadius: 22, padding: 20, borderWidth: 1, borderColor: LINE }}>
          <Text style={{ color: INK, fontSize: 14, fontWeight: "800", marginBottom: 8 }}>Valor em Real</Text>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              borderWidth: 2,
              borderColor: showError ? "#DC2626" : input ? currency.accent : LINE,
              borderRadius: 14,
              backgroundColor: "#F8FAFC",
              paddingHorizontal: 14,
            }}
          >
            <Text style={{ color: MUTED, fontSize: 20, fontWeight: "800", marginRight: 8 }}>R$</Text>
            <TextInput
              value={input}
              onChangeText={handleChange}
              placeholder="0,00"
              placeholderTextColor="#94A3B8"
              keyboardType="decimal-pad"
              maxLength={16}
              accessibilityLabel="Valor em Real"
              style={{ flex: 1, color: INK, fontSize: 24, fontWeight: "800", paddingVertical: 14, outlineStyle: "none" }}
            />
            {input ? (
              <TouchableOpacity onPress={clear} accessibilityLabel="Limpar valor" hitSlop={10}>
                <Ionicons name="close-circle" size={22} color="#94A3B8" />
              </TouchableOpacity>
            ) : null}
          </View>
          {showError ? (
            <View style={{ flexDirection: "row", alignItems: "center", marginTop: 8 }}>
              <Ionicons name="alert-circle" size={16} color="#DC2626" />
              <Text style={{ color: "#DC2626", fontSize: 13, fontWeight: "600", marginLeft: 6, flex: 1 }}>{parsed.error}</Text>
            </View>
          ) : null}

          <View style={{ flexDirection: "row", flexWrap: "wrap", marginTop: 14, marginHorizontal: -4 }}>
            {QUICK.map((value) => (
              <TouchableOpacity
                key={value}
                onPress={() => pick(value)}
                activeOpacity={0.8}
                style={{
                  paddingVertical: 8,
                  paddingHorizontal: 12,
                  borderRadius: 999,
                  backgroundColor: currency.soft,
                  margin: 4,
                }}
              >
                <Text style={{ color: currency.accent, fontSize: 13, fontWeight: "800" }}>R$ {value}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View
          style={{
            marginTop: 18,
            backgroundColor: INK,
            borderRadius: 22,
            padding: 22,
            alignItems: "center",
          }}
        >
          <Text style={{ color: "#94A3B8", fontSize: 13, fontWeight: "700", marginBottom: 6 }}>
            {result !== null ? `${formatBrl(parsed.value)} equivalem a` : "Resultado"}
          </Text>
          {result !== null ? (
            <>
              <Text
                style={{ color: "#FFFFFF", fontSize: currency.decimals === 8 ? 26 : 34, fontWeight: "900", textAlign: "center" }}
                adjustsFontSizeToFit
                numberOfLines={1}
              >
                {currency.symbol} {formatNumber(result, currency.decimals)}
              </Text>
              <Text style={{ color: currency.soft, fontSize: 13, fontWeight: "700", marginTop: 6 }}>
                {currency.decimals} casas decimais · {currency.code}
              </Text>
            </>
          ) : (
            <Text style={{ color: "#CBD5E1", fontSize: 15, fontWeight: "600", textAlign: "center" }}>
              Digite um valor em Real para converter.
            </Text>
          )}
        </View>
      </Pressable>
    </ScrollView>
  );
}

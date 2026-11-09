import { useState } from "react";
import { Keyboard, Pressable, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import { COLORS, RATES_DATE, convert, formatNumber, parseBrl } from "./rates";

const QUICK_VALUES = [50, 100, 500, 1000];

function maskBrl(text) {
  const digits = String(text || "").replace(/\D/g, "").replace(/^0+/, "").slice(0, 13);
  if (!digits) return "";
  const cents = Number(digits) / 100;
  return formatNumber(cents, 2);
}

export default function Converter({ rate }) {
  const [input, setInput] = useState("");
  const brl = parseBrl(input);
  const result = convert(brl, rate);

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: COLORS.cream }}
      contentContainerStyle={{ padding: 20, paddingBottom: 40, alignItems: "center" }}
      keyboardShouldPersistTaps="handled"
    >
      <Pressable onPress={Keyboard.dismiss} style={{ width: "100%", maxWidth: 480 }} accessible={false}>
        <View
          style={{
            backgroundColor: "#FFFFFF",
            borderRadius: 22,
            borderWidth: 1,
            borderColor: COLORS.line,
            padding: 20,
            shadowColor: COLORS.deep,
            shadowOpacity: 0.12,
            shadowRadius: 18,
            shadowOffset: { width: 0, height: 8 },
            elevation: 4,
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 18 }}>
            <View
              style={{
                width: 48,
                height: 48,
                borderRadius: 24,
                backgroundColor: COLORS.cream,
                alignItems: "center",
                justifyContent: "center",
                marginRight: 12,
              }}
            >
              <Text style={{ fontSize: 24 }}>{rate.flag}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ color: COLORS.text, fontSize: 18, fontWeight: "900" }}>{rate.name}</Text>
              <Text style={{ color: COLORS.muted, fontSize: 13, marginTop: 2 }}>
                1 {rate.code} = R$ {formatNumber(rate.brlPerUnit, 2)}
              </Text>
            </View>
          </View>

          <Text style={{ color: COLORS.text, fontSize: 14, fontWeight: "800", marginBottom: 8 }}>
            Valor em reais
          </Text>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: COLORS.cream,
              borderColor: COLORS.line,
              borderWidth: 2,
              borderRadius: 14,
              paddingHorizontal: 16,
            }}
          >
            <Text style={{ color: COLORS.orange, fontSize: 22, fontWeight: "900", marginRight: 8 }}>R$</Text>
            <TextInput
              value={input}
              onChangeText={(text) => setInput(maskBrl(text))}
              placeholder="0,00"
              placeholderTextColor="#D6A77E"
              keyboardType="numeric"
              accessibilityLabel="Valor em reais"
              style={{
                flex: 1,
                minWidth: 0,
                color: COLORS.text,
                fontSize: 24,
                fontWeight: "800",
                paddingVertical: 14,
                outlineStyle: "none",
              }}
            />
          </View>

          <View style={{ flexDirection: "row", flexWrap: "wrap", marginTop: 12, marginHorizontal: -4 }}>
            {QUICK_VALUES.map((value) => (
              <TouchableOpacity
                key={value}
                onPress={() => setInput(formatNumber(value, 2))}
                activeOpacity={0.8}
                style={{
                  paddingVertical: 8,
                  paddingHorizontal: 14,
                  borderRadius: 999,
                  backgroundColor: COLORS.sand,
                  margin: 4,
                }}
              >
                <Text style={{ color: COLORS.deep, fontSize: 13, fontWeight: "800" }}>R$ {formatNumber(value, 0)}</Text>
              </TouchableOpacity>
            ))}
            {input ? (
              <TouchableOpacity
                onPress={() => setInput("")}
                activeOpacity={0.8}
                style={{ paddingVertical: 8, paddingHorizontal: 14, borderRadius: 999, margin: 4 }}
              >
                <Text style={{ color: COLORS.muted, fontSize: 13, fontWeight: "800" }}>Limpar</Text>
              </TouchableOpacity>
            ) : null}
          </View>

          <View
            style={{
              marginTop: 20,
              backgroundColor: COLORS.dark,
              borderRadius: 18,
              padding: 20,
            }}
          >
            <Text style={{ color: COLORS.sand, fontSize: 13, fontWeight: "800", letterSpacing: 1 }}>
              VOCÊ RECEBE
            </Text>
            <Text
              style={{ color: COLORS.amber, fontSize: 32, fontWeight: "900", marginTop: 6 }}
              adjustsFontSizeToFit
              numberOfLines={1}
            >
              {rate.symbol} {formatNumber(result, rate.decimals)}
            </Text>
            <Text style={{ color: COLORS.sand, fontSize: 13, marginTop: 8 }}>
              R$ {formatNumber(brl, 2)} ÷ {formatNumber(rate.brlPerUnit, 2)}
            </Text>
          </View>
        </View>

        <Text style={{ color: COLORS.muted, fontSize: 12, textAlign: "center", marginTop: 16 }}>
          Cotações fixas de referência ({RATES_DATE}), sem consulta a API.
        </Text>
      </Pressable>
    </ScrollView>
  );
}

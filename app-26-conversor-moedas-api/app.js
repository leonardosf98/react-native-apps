import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import { ActivityIndicator, Keyboard, Platform, Pressable, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import { CURRENCIES, fetchQuotes, formatDate, formatNumber, parseBrl } from "./quotes";

const DEEP = "#052E2B";
const GREEN = "#0F766E";
const MINT = "#ECFDF5";
const LINE = "#A7F3D0";
const GOLD = "#F59E0B";
const TEXT = "#0B2420";
const MUTED = "#4B6B64";
const DANGER = "#B91C1C";

function formatInput(raw) {
  const digits = String(raw || "").replace(/\D/g, "").replace(/^0+/, "");
  if (!digits) return "";
  return formatNumber(Number(digits) / 100, 2);
}

function CurrencyOption({ currency, active, onPress }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.85}
      accessibilityRole="button"
      accessibilityState={{ selected: active }}
      style={{
        flex: 1,
        alignItems: "center",
        paddingVertical: 14,
        borderRadius: 16,
        borderWidth: 2,
        borderColor: active ? GREEN : LINE,
        backgroundColor: active ? GREEN : "#FFFFFF",
      }}
    >
      <Text style={{ fontSize: 26 }}>{currency.flag}</Text>
      <Text style={{ color: active ? "#FFFFFF" : TEXT, fontSize: 15, fontWeight: "800", marginTop: 6 }}>{currency.name}</Text>
      <Text style={{ color: active ? "#CCFBF1" : MUTED, fontSize: 12, fontWeight: "700", marginTop: 2 }}>{currency.code}</Text>
    </TouchableOpacity>
  );
}

function InfoRow({ label, value }) {
  return (
    <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 10, borderTopWidth: 1, borderTopColor: "#D1FAE5" }}>
      <Text style={{ color: MUTED, fontSize: 14, fontWeight: "600" }}>{label}</Text>
      <Text style={{ color: TEXT, fontSize: 14, fontWeight: "800", flexShrink: 1, textAlign: "right", marginLeft: 12 }}>{value}</Text>
    </View>
  );
}

function ResultCard({ result }) {
  const { currency, amount, quote } = result;
  const converted = amount / quote.ask;
  const quoteDecimals = currency.code === "BTC" ? 2 : 4;
  return (
    <View style={{ backgroundColor: MINT, borderRadius: 20, borderWidth: 2, borderColor: LINE, padding: 20, marginTop: 20 }}>
      <Text style={{ color: MUTED, fontSize: 13, fontWeight: "800", textTransform: "uppercase", letterSpacing: 1 }}>
        R$ {formatNumber(amount, 2)} equivalem a
      </Text>
      <Text style={{ color: GREEN, fontSize: 34, fontWeight: "900", marginTop: 6, marginBottom: 14 }} adjustsFontSizeToFit numberOfLines={1}>
        {currency.symbol} {formatNumber(converted, currency.decimals)}
      </Text>
      <InfoRow label={`Cotação (1 ${currency.code})`} value={`R$ ${formatNumber(quote.ask, quoteDecimals)}`} />
      <InfoRow label="Data/hora da cotação" value={formatDate(quote.date)} />
      <InfoRow label="Par" value={quote.name} />
    </View>
  );
}

export default function App() {
  const [raw, setRaw] = useState("");
  const [selected, setSelected] = useState("USD");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);
  const [quotes, setQuotes] = useState(null);

  const amount = parseBrl(raw);
  const canConvert = amount > 0 && !loading;

  function handleChange(text) {
    const digits = text.replace(/\D/g, "").replace(/^0+/, "");
    if (digits.length > 13) return;
    setRaw(digits);
  }

  async function convert() {
    if (!canConvert) return;
    Keyboard.dismiss();
    const currency = CURRENCIES.find((c) => c.code === selected);
    setLoading(true);
    setError("");
    try {
      const fresh = await fetchQuotes();
      setQuotes(fresh);
      setResult({ currency, amount, quote: fresh[currency.code] });
    } catch (e) {
      setResult(null);
      setError(e.message || "Não foi possível buscar a cotação.");
    } finally {
      setLoading(false);
    }
  }

  function selectCurrency(code) {
    setSelected(code);
    if (result && quotes) {
      const currency = CURRENCIES.find((c) => c.code === code);
      setResult({ currency, amount: result.amount, quote: quotes[code] });
    }
  }

  return (
    <View style={{ flex: 1, backgroundColor: DEEP }}>
      <StatusBar style="light" />
      <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{ flexGrow: 1, alignItems: "center", paddingHorizontal: 16, paddingTop: 56, paddingBottom: 32 }}>
        <Pressable onPress={Platform.OS === "web" ? undefined : Keyboard.dismiss} style={{ width: "100%", maxWidth: 480 }} accessible={false}>
          <View style={{ marginBottom: 24 }}>
            <Text style={{ color: GOLD, fontSize: 13, fontWeight: "900", letterSpacing: 2, textTransform: "uppercase" }}>Cotação em tempo real</Text>
            <Text style={{ color: "#FFFFFF", fontSize: 32, fontWeight: "900", marginTop: 6 }}>Conversor de Moedas</Text>
            <Text style={{ color: "#99F6E4", fontSize: 15, marginTop: 8, lineHeight: 21 }}>
              Digite um valor em Real e veja quanto vale em Dólar, Euro ou Bitcoin.
            </Text>
          </View>

          <View style={{ backgroundColor: "#FFFFFF", borderRadius: 24, padding: 20, shadowColor: "#000", shadowOpacity: 0.25, shadowRadius: 20, shadowOffset: { width: 0, height: 10 }, elevation: 8 }}>
            <Text style={{ color: TEXT, fontSize: 14, fontWeight: "800", marginBottom: 8 }}>Valor em Real</Text>
            <View style={{ flexDirection: "row", alignItems: "center", backgroundColor: MINT, borderColor: LINE, borderWidth: 2, borderRadius: 16, paddingHorizontal: 16 }}>
              <Text style={{ color: GREEN, fontSize: 22, fontWeight: "900", marginRight: 8 }}>R$</Text>
              <TextInput
                value={formatInput(raw)}
                onChangeText={handleChange}
                onSubmitEditing={convert}
                placeholder="0,00"
                placeholderTextColor="#86B7AC"
                keyboardType="numeric"
                returnKeyType="done"
                accessibilityLabel="Valor em Real"
                style={{ flex: 1, minWidth: 0, color: TEXT, fontSize: 26, fontWeight: "800", paddingVertical: 14, outlineStyle: "none" }}
              />
            </View>

            <Text style={{ color: TEXT, fontSize: 14, fontWeight: "800", marginTop: 20, marginBottom: 10 }}>Converter para</Text>
            <View style={{ flexDirection: "row", gap: 10 }}>
              {CURRENCIES.map((c) => (
                <CurrencyOption key={c.code} currency={c} active={selected === c.code} onPress={() => selectCurrency(c.code)} />
              ))}
            </View>

            <TouchableOpacity
              onPress={convert}
              disabled={!canConvert}
              activeOpacity={0.85}
              accessibilityRole="button"
              style={{
                marginTop: 22,
                borderRadius: 16,
                paddingVertical: 16,
                alignItems: "center",
                flexDirection: "row",
                justifyContent: "center",
                backgroundColor: canConvert ? GOLD : "#FCD9A0",
              }}
            >
              {loading ? <ActivityIndicator color={DEEP} style={{ marginRight: 10 }} /> : null}
              <Text style={{ color: DEEP, fontSize: 17, fontWeight: "900" }}>{loading ? "Buscando cotação..." : "Converter"}</Text>
            </TouchableOpacity>

            {error ? (
              <View style={{ marginTop: 20, backgroundColor: "#FEF2F2", borderColor: "#FECACA", borderWidth: 2, borderRadius: 16, padding: 16 }}>
                <Text style={{ color: DANGER, fontSize: 15, fontWeight: "900" }}>Ops, algo deu errado</Text>
                <Text style={{ color: "#7F1D1D", fontSize: 14, marginTop: 4, lineHeight: 20 }}>{error}</Text>
                <TouchableOpacity onPress={convert} disabled={!canConvert} style={{ alignSelf: "flex-start", marginTop: 12, backgroundColor: DANGER, borderRadius: 10, paddingHorizontal: 14, paddingVertical: 8 }}>
                  <Text style={{ color: "#FFFFFF", fontWeight: "800" }}>Tentar novamente</Text>
                </TouchableOpacity>
              </View>
            ) : null}

            {result && !error ? <ResultCard result={result} /> : null}
          </View>

          <Text style={{ color: "#5EEAD4", fontSize: 12, textAlign: "center", marginTop: 20 }}>
            Cotações de venda (ask) fornecidas pela AwesomeAPI
          </Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}

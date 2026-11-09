import { StatusBar } from "expo-status-bar";
import { useRef, useState } from "react";
import { ActivityIndicator, Keyboard, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import { fetchCep, formatCep, onlyDigits } from "./cep";

const FOREST = "#064E3B";
const GREEN = "#059669";
const AMBER = "#F59E0B";
const CREAM = "#FFFBEB";
const MINT = "#ECFDF5";
const LINE = "#A7F3D0";
const TEXT = "#0F2A22";
const MUTED = "#4B6B60";
const DANGER = "#B91C1C";

function InfoRow({ icon, label, value, last }) {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 14,
        borderBottomWidth: last ? 0 : 1,
        borderBottomColor: "#D1FAE5",
      }}
    >
      <View
        style={{
          width: 40,
          height: 40,
          borderRadius: 12,
          backgroundColor: MINT,
          alignItems: "center",
          justifyContent: "center",
          marginRight: 14,
        }}
      >
        <Text style={{ fontSize: 18 }}>{icon}</Text>
      </View>
      <View style={{ flex: 1 }}>
        <Text style={{ color: MUTED, fontSize: 12, fontWeight: "800", letterSpacing: 0.6, textTransform: "uppercase" }}>
          {label}
        </Text>
        <Text style={{ color: value ? TEXT : "#9CB5AB", fontSize: 17, fontWeight: "700", marginTop: 2 }}>
          {value || "Não informado"}
        </Text>
      </View>
    </View>
  );
}

function ActionButton({ label, onPress, disabled, primary }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.85}
      style={{
        flex: primary ? 2 : 1,
        paddingVertical: 16,
        borderRadius: 14,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: primary ? GREEN : "#FFFFFF",
        borderWidth: primary ? 0 : 2,
        borderColor: LINE,
        opacity: disabled ? 0.55 : 1,
        marginLeft: primary ? 0 : 12,
      }}
    >
      <Text style={{ color: primary ? "#FFFFFF" : FOREST, fontSize: 16, fontWeight: "800" }}>{label}</Text>
    </TouchableOpacity>
  );
}

export default function App() {
  const [cep, setCep] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [address, setAddress] = useState(null);
  const inputRef = useRef(null);

  async function handleSearch() {
    Keyboard.dismiss();
    setError("");
    setAddress(null);
    const digits = onlyDigits(cep);
    if (digits.length !== 8) {
      setError("CEP inválido. Digite os 8 números do CEP.");
      return;
    }
    setLoading(true);
    try {
      setAddress(await fetchCep(digits));
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  function handleClear() {
    setCep("");
    setError("");
    setAddress(null);
    inputRef.current?.focus();
  }

  const digits = onlyDigits(cep);

  return (
    <View style={{ flex: 1, backgroundColor: FOREST }}>
      <StatusBar style="light" />
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, padding: 20, paddingTop: 56, alignItems: "center" }}
        keyboardShouldPersistTaps="handled"
      >
        <View style={{ width: "100%", maxWidth: 480 }}>
          <View style={{ alignItems: "center", marginBottom: 24 }}>
            <View
              style={{
                width: 72,
                height: 72,
                borderRadius: 22,
                backgroundColor: AMBER,
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 14,
              }}
            >
              <Text style={{ fontSize: 36 }}>📮</Text>
            </View>
            <Text style={{ color: "#FFFFFF", fontSize: 28, fontWeight: "900" }}>Consulta de CEP</Text>
            <Text style={{ color: "#A7F3D0", fontSize: 15, marginTop: 6, textAlign: "center" }}>
              Descubra o endereço completo a partir do CEP
            </Text>
          </View>

          <View style={{ backgroundColor: "#FFFFFF", borderRadius: 22, padding: 20 }}>
            <Text style={{ color: TEXT, fontSize: 14, fontWeight: "800", marginBottom: 8 }}>CEP</Text>
            <TextInput
              ref={inputRef}
              value={formatCep(cep)}
              onChangeText={(text) => {
                setCep(onlyDigits(text));
                if (error) setError("");
              }}
              onSubmitEditing={handleSearch}
              placeholder="00000-000"
              placeholderTextColor="#9CB5AB"
              keyboardType="number-pad"
              maxLength={9}
              returnKeyType="search"
              accessibilityLabel="CEP"
              style={{
                backgroundColor: MINT,
                borderColor: error ? "#FCA5A5" : LINE,
                borderRadius: 14,
                borderWidth: 2,
                color: TEXT,
                fontSize: 26,
                fontWeight: "800",
                letterSpacing: 2,
                paddingHorizontal: 16,
                paddingVertical: 14,
                textAlign: "center",
              }}
            />
            <Text style={{ color: MUTED, fontSize: 12, marginTop: 6, textAlign: "right" }}>{digits.length}/8 dígitos</Text>

            <View style={{ flexDirection: "row", marginTop: 14 }}>
              <ActionButton label={loading ? "Buscando..." : "Buscar"} onPress={handleSearch} disabled={loading} primary />
              <ActionButton label="Limpar" onPress={handleClear} disabled={loading} />
            </View>
          </View>

          {loading && (
            <View style={{ backgroundColor: CREAM, borderRadius: 22, padding: 28, marginTop: 16, alignItems: "center" }}>
              <ActivityIndicator size="large" color={GREEN} />
              <Text style={{ color: MUTED, fontSize: 15, fontWeight: "700", marginTop: 12 }}>Consultando o ViaCEP...</Text>
            </View>
          )}

          {!!error && !loading && (
            <View
              style={{
                backgroundColor: "#FEF2F2",
                borderColor: "#FECACA",
                borderWidth: 2,
                borderRadius: 18,
                padding: 16,
                marginTop: 16,
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <Text style={{ fontSize: 22, marginRight: 12 }}>⚠️</Text>
              <Text style={{ color: DANGER, fontSize: 15, fontWeight: "700", flex: 1 }}>{error}</Text>
            </View>
          )}

          {address && !loading && (
            <View style={{ backgroundColor: "#FFFFFF", borderRadius: 22, marginTop: 16, overflow: "hidden" }}>
              <View
                style={{
                  backgroundColor: AMBER,
                  paddingHorizontal: 20,
                  paddingVertical: 14,
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Text style={{ color: FOREST, fontSize: 13, fontWeight: "900", letterSpacing: 0.8 }}>ENDEREÇO ENCONTRADO</Text>
                <Text style={{ color: FOREST, fontSize: 18, fontWeight: "900" }}>{address.cep}</Text>
              </View>
              <View style={{ paddingHorizontal: 20, paddingVertical: 6 }}>
                <InfoRow icon="🛣️" label="Logradouro" value={address.logradouro} />
                <InfoRow icon="🏷️" label="Complemento" value={address.complemento} />
                <InfoRow icon="🏘️" label="Bairro" value={address.bairro} />
                <InfoRow icon="🏙️" label="Cidade/UF" value={`${address.localidade} / ${address.uf}`} />
                <View style={{ flexDirection: "row" }}>
                  <View style={{ flex: 1, marginRight: 12 }}>
                    <InfoRow icon="📞" label="DDD" value={address.ddd} last />
                  </View>
                  <View style={{ flex: 1 }}>
                    <InfoRow icon="🧾" label="IBGE" value={address.ibge} last />
                  </View>
                </View>
              </View>
            </View>
          )}

          <Text style={{ color: "#6EE7B7", fontSize: 12, textAlign: "center", marginTop: 24, marginBottom: 12 }}>
            Dados fornecidos por viacep.com.br
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

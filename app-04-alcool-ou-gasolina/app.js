import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import {
  Dimensions,
  InputAccessoryView,
  Keyboard,
  Platform,
  Pressable,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { compareFuels, formatRatio, maskReais, parsePrice } from "./fuel";

const ACCESSORY = "fuel-done";

const GREEN = "#007A33";
const GREEN_DARK = "#005C26";
const GREEN_DEEP = "#003D19";
const YELLOW = "#FFCC00";
const CREAM = "#F7FFF4";
const LINE = "#C8E6C0";
const MUTED = "#3D6B45";
const SHELL = Math.min(440, Dimensions.get("window").width);

const VERDICT = {
  etanol: {
    title: "Etanol vale mais",
    detail: "O litro do etanol está abaixo de 70% da gasolina.",
    bg: GREEN,
    color: "#FFFFFF",
  },
  gasolina: {
    title: "Gasolina vale mais",
    detail: "O litro do etanol passou de 70% da gasolina.",
    bg: YELLOW,
    color: GREEN_DEEP,
  },
  empate: {
    title: "Tanto faz",
    detail: "O etanol está exatamente em 70% da gasolina.",
    bg: "#E8F5E1",
    color: GREEN_DARK,
  },
};

function Field({ label, value, onChange, hint }) {
  return (
    <View style={{ marginBottom: 16, alignSelf: "stretch" }}>
      <Text style={{ color: GREEN_DARK, fontWeight: "700", fontSize: 14, marginBottom: 8 }}>
        {label}
      </Text>
      <TextInput
        value={value}
        onChangeText={onChange}
        placeholder={hint}
        placeholderTextColor="#7A9A7E"
        keyboardType="number-pad"
        inputAccessoryViewID={ACCESSORY}
        returnKeyType="done"
        blurOnSubmit
        onSubmitEditing={Keyboard.dismiss}
        accessibilityLabel={label}
        style={{
          backgroundColor: CREAM,
          borderWidth: 2,
          borderColor: LINE,
          borderRadius: 14,
          paddingHorizontal: 16,
          paddingVertical: 14,
          fontSize: 22,
          fontWeight: "700",
          color: GREEN_DEEP,
          width: "100%",
          alignSelf: "stretch",
        }}
      />
    </View>
  );
}

export default function App() {
  const [ethanol, setEthanol] = useState("");
  const [gasoline, setGasoline] = useState("");
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);

  function compare() {
    Keyboard.dismiss();
    const e = parsePrice(ethanol);
    const g = parsePrice(gasoline);
    if (e === null || g === null) {
      setResult(null);
      setError("Informe os dois preços, maiores que zero.");
      return;
    }
    setError("");
    setResult(compareFuels(e, g));
  }

  const verdict = result ? VERDICT[result.pick] : null;

  return (
    <Pressable style={{ flex: 1, backgroundColor: GREEN }} onPress={Keyboard.dismiss}>
      <StatusBar style="light" />
        <View
          style={{
            flex: 1,
            width: SHELL,
            maxWidth: "100%",
            alignSelf: "center",
            alignItems: "stretch",
          }}
        >
          <View style={{ paddingTop: 56, paddingHorizontal: 24, paddingBottom: 20 }}>
            <View
              style={{
                alignSelf: "flex-start",
                backgroundColor: YELLOW,
                width: 56,
                height: 8,
                borderRadius: 99,
                marginBottom: 16,
              }}
            />
            <Text style={{ color: YELLOW, fontSize: 13, fontWeight: "800", letterSpacing: 1 }}>
              APP 04
            </Text>
            <Text style={{ color: "#FFFFFF", fontSize: 30, fontWeight: "800", marginTop: 8 }}>
              Álcool ou gasolina?
            </Text>
            <Text style={{ color: "#D7F5D0", fontSize: 15, marginTop: 10, lineHeight: 22 }}>
              Divida o preço do etanol pelo da gasolina. Abaixo de 0,70, o etanol
              compensa. Acima, a gasolina.
            </Text>
          </View>

          <View
            style={{
              flex: 1,
              backgroundColor: "#FFFFFF",
              borderTopLeftRadius: 28,
              borderTopRightRadius: 28,
              paddingHorizontal: 24,
              paddingTop: 28,
              alignSelf: "stretch",
              width: "100%",
            }}
          >
            <Field
              label="Etanol (R$/L)"
              value={ethanol}
              onChange={(text) => setEthanol(maskReais(text))}
              hint="R$ 3,499"
            />
            <Field
              label="Gasolina (R$/L)"
              value={gasoline}
              onChange={(text) => setGasoline(maskReais(text))}
              hint="R$ 5,879"
            />

            <TouchableOpacity
              onPress={compare}
              activeOpacity={0.85}
              accessibilityRole="button"
              accessibilityLabel="Comparar"
              style={{
                backgroundColor: YELLOW,
                borderRadius: 16,
                paddingVertical: 16,
                alignItems: "center",
                marginTop: 4,
              }}
            >
              <Text style={{ color: GREEN_DEEP, fontSize: 17, fontWeight: "800" }}>
                Comparar
              </Text>
            </TouchableOpacity>

            {error ? (
              <Text style={{ color: "#9F1239", marginTop: 16, fontWeight: "600" }}>{error}</Text>
            ) : null}

            {verdict ? (
              <View
                accessibilityRole="text"
                accessibilityLabel={`resultado ${verdict.title} ${formatRatio(result.ratio)}`}
                style={{
                  marginTop: 24,
                  backgroundColor: verdict.bg,
                  borderRadius: 18,
                  padding: 20,
                }}
              >
                <Text style={{ color: verdict.color, opacity: 0.8, fontWeight: "700" }}>
                  Relação {formatRatio(result.ratio)}
                </Text>
                <Text
                  style={{
                    color: verdict.color,
                    fontSize: 24,
                    fontWeight: "800",
                    marginTop: 6,
                  }}
                >
                  {verdict.title}
                </Text>
                <Text style={{ color: verdict.color, marginTop: 8, lineHeight: 20 }}>
                  {verdict.detail}
                </Text>
              </View>
            ) : (
              <Text style={{ color: MUTED, marginTop: 22, lineHeight: 20 }}>
                O ponto de corte é 0,70. Igual a isso, os dois rendem o mesmo no bolso.
              </Text>
            )}
          </View>
        </View>
      {Platform.OS === "ios" ? (
        <InputAccessoryView nativeID={ACCESSORY}>
          <View
            style={{
              backgroundColor: "#E8F5E1",
              borderTopWidth: 1,
              borderTopColor: LINE,
              paddingHorizontal: 16,
              paddingVertical: 10,
              alignItems: "flex-end",
            }}
          >
            <TouchableOpacity onPress={Keyboard.dismiss} accessibilityRole="button" accessibilityLabel="Pronto">
              <Text style={{ color: GREEN_DARK, fontSize: 16, fontWeight: "800" }}>Pronto</Text>
            </TouchableOpacity>
          </View>
        </InputAccessoryView>
      ) : null}
    </Pressable>
  );
}

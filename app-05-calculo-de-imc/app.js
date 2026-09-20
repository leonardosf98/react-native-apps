import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import { Keyboard, Pressable, Text, TextInput, TouchableOpacity, View } from "react-native";
import { calculateBmi, parseNumber } from "./bmi";

const NAVY = "#172554";
const BLUE = "#2563EB";
const PALE = "#EFF6FF";
const LINE = "#BFDBFE";
const TEXT = "#172033";
const MUTED = "#52617A";

function Field({ label, value, onChangeText, placeholder }) {
  return (
    <View style={{ marginBottom: 16 }}>
      <Text style={{ color: TEXT, fontSize: 14, fontWeight: "800", marginBottom: 8 }}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#8DA2C4"
        keyboardType="decimal-pad"
        accessibilityLabel={label}
        style={{
          backgroundColor: PALE,
          borderColor: LINE,
          borderRadius: 14,
          borderWidth: 2,
          color: TEXT,
          fontSize: 22,
          fontWeight: "700",
          paddingHorizontal: 16,
          paddingVertical: 14,
        }}
      />
    </View>
  );
}

export default function App() {
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);

  function calculate() {
    Keyboard.dismiss();
    const bmi = calculateBmi(parseNumber(weight), parseNumber(height));
    if (!bmi) {
      setResult(null);
      setError("Informe peso e altura com valores maiores que zero.");
      return;
    }

    setError("");
    setResult(bmi);
  }

  return (
    <Pressable style={{ flex: 1, backgroundColor: NAVY }} onPress={Keyboard.dismiss}>
      <StatusBar style="light" />
      <View style={{ flex: 1, maxWidth: 440, width: "100%", alignSelf: "center" }}>
        <View style={{ padding: 24, paddingTop: 56 }}>
          <View style={{ backgroundColor: "#60A5FA", height: 8, width: 56, borderRadius: 99, marginBottom: 16 }} />
          <Text style={{ color: "#BFDBFE", fontSize: 13, fontWeight: "800", letterSpacing: 1 }}>APP 05</Text>
          <Text style={{ color: "#FFFFFF", fontSize: 30, fontWeight: "800", marginTop: 8 }}>Cálculo de IMC</Text>
          <Text style={{ color: "#DBEAFE", fontSize: 15, lineHeight: 22, marginTop: 10 }}>
            Descubra seu índice de massa corporal usando seu peso e sua altura.
          </Text>
        </View>

        <View style={{ flex: 1, backgroundColor: "#FFFFFF", borderTopLeftRadius: 28, borderTopRightRadius: 28, padding: 24 }}>
          <Field label="Peso (kg)" value={weight} onChangeText={setWeight} placeholder="Ex.: 70" />
          <Field label="Altura (m)" value={height} onChangeText={setHeight} placeholder="Ex.: 1,75" />

          <TouchableOpacity
            onPress={calculate}
            activeOpacity={0.85}
            accessibilityRole="button"
            accessibilityLabel="Calcular IMC"
            style={{ backgroundColor: BLUE, borderRadius: 16, paddingVertical: 16, alignItems: "center" }}
          >
            <Text style={{ color: "#FFFFFF", fontSize: 17, fontWeight: "800" }}>Calcular IMC</Text>
          </TouchableOpacity>

          {error ? <Text style={{ color: "#9F1239", fontWeight: "600", marginTop: 16 }}>{error}</Text> : null}
          {result ? (
            <View style={{ backgroundColor: PALE, borderRadius: 18, marginTop: 24, padding: 20 }}>
              <Text style={{ color: MUTED, fontWeight: "700" }}>Seu IMC</Text>
              <Text style={{ color: NAVY, fontSize: 38, fontWeight: "800", marginTop: 4 }}>{result.value.toFixed(2)}</Text>
              <Text style={{ color: BLUE, fontSize: 20, fontWeight: "800", marginTop: 4 }}>{result.classification}</Text>
            </View>
          ) : (
            <Text style={{ color: MUTED, lineHeight: 20, marginTop: 22 }}>
              A fórmula usada é peso dividido pela altura ao quadrado.
            </Text>
          )}
        </View>
      </View>
    </Pressable>
  );
}

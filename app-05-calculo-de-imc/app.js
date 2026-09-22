import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import { Keyboard, Pressable, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import { calculateBmi, parseNumber } from "./bmi";
import { ACTIVITY_LEVELS, calculateTdee } from "./tdee";

const NAVY = "#172554";
const BLUE = "#2563EB";
const PALE = "#EFF6FF";
const LINE = "#BFDBFE";
const TEXT = "#172033";
const MUTED = "#52617A";

function formatDecimal(raw) {
  const d = String(raw || "").replace(/\D/g, "");
  if (!d) return "";
  const trimmed = d.replace(/^0+/, "") || "0";
  if (trimmed.length <= 2) return `0,${trimmed.padStart(2, "0")}`;
  const intPart = trimmed.slice(0, -2);
  const decPart = trimmed.slice(-2);
  return `${intPart},${decPart}`;
}

function Field({ label, rawValue, onChangeText, placeholder, maxIntDigits }) {
  const display = formatDecimal(rawValue);
  const maxRaw = maxIntDigits ? maxIntDigits + 2 : 0;
  const [selection, setSelection] = useState({ start: display.length, end: display.length });

  function handleChange(text) {
    const digits = text.replace(/\D/g, "");
    const newRaw = digits.replace(/^0+/, "");
    if (maxRaw && newRaw.length > maxRaw) return;
    onChangeText(newRaw);
    const newDisplay = formatDecimal(newRaw);
    setSelection({ start: newDisplay.length, end: newDisplay.length });
  }

  return (
    <View style={{ marginBottom: 16 }}>
      <Text style={{ color: TEXT, fontSize: 14, fontWeight: "800", marginBottom: 8 }}>{label}</Text>
      <TextInput
        value={display}
        onChangeText={handleChange}
        selection={selection}
        placeholder={placeholder}
        placeholderTextColor="#8DA2C4"
        keyboardType="numeric"
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

function TabButton({ label, active, onPress }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      style={{
        flex: 1,
        paddingVertical: 12,
        borderRadius: 12,
        backgroundColor: active ? BLUE : "transparent",
        alignItems: "center",
      }}
    >
      <Text style={{ color: active ? "#FFFFFF" : MUTED, fontSize: 14, fontWeight: "800" }}>{label}</Text>
    </TouchableOpacity>
  );
}

function SexButton({ label, value, selected, onPress }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      style={{
        flex: 1,
        paddingVertical: 14,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: selected ? BLUE : LINE,
        backgroundColor: selected ? PALE : "#FFFFFF",
        alignItems: "center",
      }}
    >
      <Text style={{ color: selected ? BLUE : MUTED, fontSize: 14, fontWeight: "800" }}>{label}</Text>
    </TouchableOpacity>
  );
}

function BmiScreen() {
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);

  function calculate() {
    Keyboard.dismiss();
    const bmi = calculateBmi(parseNumber(formatDecimal(weight)), parseNumber(formatDecimal(height)));
    if (!bmi) {
      setResult(null);
      setError("Informe peso e altura com valores maiores que zero.");
      return;
    }
    setError("");
    setResult(bmi);
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#FFFFFF", borderTopLeftRadius: 28, borderTopRightRadius: 28, padding: 24 }}>
      <Field label="Peso (kg)" rawValue={weight} onChangeText={setWeight} placeholder="Ex.: 70,00" />
      <Field label="Altura (m)" rawValue={height} onChangeText={setHeight} placeholder="Ex.: 1,75" maxIntDigits={1} />

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
  );
}

function TdeeScreen() {
  const [sex, setSex] = useState("");
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [age, setAge] = useState("");
  const [activity, setActivity] = useState("");
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);

  function calculate() {
    Keyboard.dismiss();
    const w = parseNumber(formatDecimal(weight));
    const h = parseNumber(formatDecimal(height));
    const a = Number(age);

    if (!sex || !w || !h || !a || !activity) {
      setResult(null);
      setError("Preencha todos os campos.");
      return;
    }

    if (a < 18 || a > 150) {
      setResult(null);
      setError("A idade deve ser entre 18 e 150 anos.");
      return;
    }

    const tdee = calculateTdee({ sex, weight: w, height: h * 100, age: a, activityKey: activity });
    if (!tdee) {
      setResult(null);
      setError("Erro no cálculo. Verifique os valores.");
      return;
    }

    setError("");
    setResult(tdee);
  }

  return (
    <ScrollView style={{ flex: 1, backgroundColor: "#FFFFFF", borderTopLeftRadius: 28, borderTopRightRadius: 28, padding: 24 }}>
      <View style={{ backgroundColor: PALE, borderRadius: 16, padding: 16, marginBottom: 20 }}>
        <Text style={{ color: NAVY, fontSize: 15, fontWeight: "800", marginBottom: 8 }}>O que é GET?</Text>
        <Text style={{ color: TEXT, fontSize: 13, lineHeight: 20 }}>
          O <Text style={{ fontWeight: "800" }}>Gasto Energético Total (GET)</Text> é a quantidade de energia que seu corpo gasta por dia, incluindo respirar, digitar, caminhar e se exercitar. Saber seu GET ajuda a entender quantas calorias você precisa para manter, ganhar ou perder peso.
        </Text>
      </View>

      <Text style={{ color: TEXT, fontSize: 14, fontWeight: "800", marginBottom: 10 }}>Sexo</Text>
      <View style={{ flexDirection: "row", gap: 10, marginBottom: 20 }}>
        <SexButton label="Masculino" value="male" selected={sex === "male"} onPress={() => setSex("male")} />
        <SexButton label="Feminino" value="female" selected={sex === "female"} onPress={() => setSex("female")} />
      </View>

      <Field label="Peso (kg)" rawValue={weight} onChangeText={setWeight} placeholder="Ex.: 70,00" />
      <Field label="Altura (m)" rawValue={height} onChangeText={setHeight} placeholder="Ex.: 1,75" maxIntDigits={1} />
      <View style={{ marginBottom: 16 }}>
        <Text style={{ color: TEXT, fontSize: 14, fontWeight: "800", marginBottom: 8 }}>Idade (anos)</Text>
        <TextInput
          value={age}
          onChangeText={(t) => { if (t.length <= 3) setAge(t.replace(/[^0-9]/g, "")); }}
          placeholder="Ex.: 30"
          placeholderTextColor="#8DA2C4"
          keyboardType="numeric"
          maxLength={3}
          accessibilityLabel="Idade"
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

      <Text style={{ color: TEXT, fontSize: 14, fontWeight: "800", marginBottom: 10 }}>Nível de atividade</Text>
      {ACTIVITY_LEVELS.map((level) => (
        <TouchableOpacity
          key={level.key}
          onPress={() => setActivity(level.key)}
          activeOpacity={0.8}
          style={{
            paddingVertical: 12,
            paddingHorizontal: 16,
            borderRadius: 12,
            borderWidth: 2,
            borderColor: activity === level.key ? BLUE : LINE,
            backgroundColor: activity === level.key ? PALE : "#FFFFFF",
            marginBottom: 8,
          }}
        >
          <Text style={{ color: activity === level.key ? BLUE : TEXT, fontSize: 14, fontWeight: "800" }}>{level.label}</Text>
          <Text style={{ color: MUTED, fontSize: 12, marginTop: 2 }}>{level.description}</Text>
        </TouchableOpacity>
      ))}

      <TouchableOpacity
        onPress={calculate}
        activeOpacity={0.85}
        accessibilityRole="button"
        accessibilityLabel="Calcular GET"
        style={{ backgroundColor: BLUE, borderRadius: 16, paddingVertical: 16, alignItems: "center", marginTop: 8 }}
      >
        <Text style={{ color: "#FFFFFF", fontSize: 17, fontWeight: "800" }}>Calcular GET</Text>
      </TouchableOpacity>

      {error ? <Text style={{ color: "#9F1239", fontWeight: "600", marginTop: 16 }}>{error}</Text> : null}
      {result ? (
        <View style={{ backgroundColor: PALE, borderRadius: 18, marginTop: 24, padding: 20 }}>
          <Text style={{ color: MUTED, fontWeight: "700" }}>Taxa Metabólica Basal (TMB)</Text>
          <Text style={{ color: NAVY, fontSize: 32, fontWeight: "800", marginTop: 4 }}>{result.bmr} kcal/dia</Text>
          <View style={{ height: 1, backgroundColor: LINE, marginVertical: 16 }} />
          <Text style={{ color: MUTED, fontWeight: "700" }}>Seu GET estimado</Text>
          <Text style={{ color: NAVY, fontSize: 38, fontWeight: "800", marginTop: 4 }}>{result.tdee} kcal/dia</Text>
          <Text style={{ color: BLUE, fontSize: 14, fontWeight: "700", marginTop: 8 }}>{result.level.label}</Text>
        </View>
      ) : null}

      <View style={{ marginTop: 24, marginBottom: 40, backgroundColor: "#FFFBEB", borderRadius: 16, padding: 16 }}>
        <Text style={{ color: "#92400E", fontSize: 13, fontWeight: "800", marginBottom: 6 }}>⚠ Atenção</Text>
        <Text style={{ color: "#78350F", fontSize: 12, lineHeight: 18 }}>
          Este cálculo usa a fórmula de Harris-Benedict (revisada em 1984), que é uma estimativa genérica. Ela pode não se aplicar com precisão para atletas, pessoas com composição corporal muito diferente da média, idosos ou crianças. Para orientação personalizada, consulte um profissional de saúde.
        </Text>
      </View>
    </ScrollView>
  );
}

export default function App() {
  const [tab, setTab] = useState("bmi");

  return (
    <Pressable style={{ flex: 1, backgroundColor: NAVY }} onPress={Keyboard.dismiss}>
      <StatusBar style="light" />
      <View style={{ flex: 1, maxWidth: 440, width: "100%", alignSelf: "center" }}>
        <View style={{ padding: 24, paddingTop: 56 }}>
          <View style={{ backgroundColor: "#60A5FA", height: 8, width: 56, borderRadius: 99, marginBottom: 16 }} />
          <Text style={{ color: "#BFDBFE", fontSize: 13, fontWeight: "800", letterSpacing: 1 }}>APP 05</Text>
          <Text style={{ color: "#FFFFFF", fontSize: 30, fontWeight: "800", marginTop: 8 }}>
            {tab === "bmi" ? "Cálculo de IMC" : "Gasto Energético Total"}
          </Text>
          <Text style={{ color: "#DBEAFE", fontSize: 15, lineHeight: 22, marginTop: 10 }}>
            {tab === "bmi"
              ? "Descubra seu índice de massa corporal usando seu peso e sua altura."
              : "Estime quantas calorias seu corpo gasta por dia."}
          </Text>
        </View>

        <View style={{ flexDirection: "row", marginHorizontal: 24, marginBottom: 4 }}>
          <TabButton label="IMC" active={tab === "bmi"} onPress={() => setTab("bmi")} />
          <View style={{ width: 8 }} />
          <TabButton label="GET (TDEE)" active={tab === "tdee"} onPress={() => setTab("tdee")} />
        </View>

        {tab === "bmi" ? <BmiScreen /> : <TdeeScreen />}
      </View>
    </Pressable>
  );
}

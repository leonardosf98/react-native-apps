import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import { Keyboard, Pressable, Text, TextInput, TouchableOpacity, View } from "react-native";
import { drawNumber, parseGuess } from "./game";

const PLUM = "#3F1D38";
const PINK = "#E83E8C";
const PALE = "#FFF1F7";
const LINE = "#F4B7D2";
const TEXT = "#261525";
const MUTED = "#73566D";

export default function App() {
  const [guess, setGuess] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  function play() {
    Keyboard.dismiss();
    const parsedGuess = parseGuess(guess);
    if (parsedGuess === null) {
      setResult(null);
      setError("Digite um número inteiro entre 0 e 10.");
      return;
    }

    const drawn = drawNumber();
    setError("");
    setResult({ drawn, hit: parsedGuess === drawn });
  }

  function newRound() {
    setGuess("");
    setResult(null);
    setError("");
  }

  return (
    <Pressable style={{ flex: 1, backgroundColor: PLUM }} onPress={Keyboard.dismiss}>
      <StatusBar style="light" />
      <View style={{ flex: 1, maxWidth: 440, width: "100%", alignSelf: "center" }}>
        <View style={{ padding: 24, paddingTop: 56 }}>
          <View style={{ backgroundColor: "#FFB3D3", height: 8, width: 56, borderRadius: 99, marginBottom: 16 }} />
          <Text style={{ color: "#FFB3D3", fontSize: 13, fontWeight: "800", letterSpacing: 1 }}>APP 06</Text>
          <Text style={{ color: "#FFFFFF", fontSize: 30, fontWeight: "800", marginTop: 8 }}>Número misterioso</Text>
          <Text style={{ color: "#FCE7F3", fontSize: 15, lineHeight: 22, marginTop: 10 }}>
            Escolha um número de 0 a 10 e veja se ele foi sorteado.
          </Text>
        </View>

        <View style={{ flex: 1, backgroundColor: "#FFFFFF", borderTopLeftRadius: 28, borderTopRightRadius: 28, padding: 24 }}>
          <Text style={{ color: TEXT, fontSize: 14, fontWeight: "800", marginBottom: 8 }}>Seu palpite</Text>
          <TextInput
            value={guess}
            onChangeText={setGuess}
            placeholder="0 a 10"
            placeholderTextColor="#B890AB"
            keyboardType="number-pad"
            maxLength={2}
            accessibilityLabel="Seu palpite"
            style={{ backgroundColor: PALE, borderColor: LINE, borderRadius: 14, borderWidth: 2, color: TEXT, fontSize: 22, fontWeight: "700", paddingHorizontal: 16, paddingVertical: 14 }}
          />
          <TouchableOpacity
            onPress={play}
            activeOpacity={0.85}
            accessibilityRole="button"
            accessibilityLabel="Sortear número"
            style={{ backgroundColor: PINK, borderRadius: 16, paddingVertical: 16, alignItems: "center", marginTop: 4 }}
          >
            <Text style={{ color: "#FFFFFF", fontSize: 17, fontWeight: "800" }}>Sortear número</Text>
          </TouchableOpacity>

          {error ? <Text style={{ color: "#9F1239", fontWeight: "600", marginTop: 16 }}>{error}</Text> : null}
          {result ? (
            <View style={{ backgroundColor: result.hit ? "#ECFDF5" : PALE, borderRadius: 18, marginTop: 24, padding: 20 }}>
              <Text style={{ color: MUTED, fontWeight: "700" }}>O número sorteado foi</Text>
              <Text style={{ color: PLUM, fontSize: 42, fontWeight: "800", marginTop: 4 }}>{result.drawn}</Text>
              <Text style={{ color: result.hit ? "#047857" : PINK, fontSize: 20, fontWeight: "800", marginTop: 4 }}>
                {result.hit ? "Você acertou!" : "Tente novamente"}
              </Text>
              <TouchableOpacity onPress={newRound} accessibilityRole="button" accessibilityLabel="Nova rodada" style={{ alignSelf: "flex-start", marginTop: 16 }}>
                <Text style={{ color: PLUM, fontWeight: "800" }}>Nova rodada</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <Text style={{ color: MUTED, lineHeight: 20, marginTop: 22 }}>
              O sorteio acontece quando você tocar no botão.
            </Text>
          )}
        </View>
      </View>
    </Pressable>
  );
}

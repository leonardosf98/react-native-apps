import { useState } from "react";
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, Switch, Text, TextInput, View } from "react-native";
import { Picker } from "@react-native-picker/picker";
import {
  DEEP,
  ERROR,
  ESCOLARIDADES,
  GOLD,
  GREEN,
  LIMITE_MAX,
  LIMITE_MIN,
  LIMITE_PASSO,
  LINE,
  MINT,
  MUTED,
  SEXOS,
  TEXT,
  formatarMoeda,
} from "./theme";
import { validarConta } from "./validation";

function Rotulo({ children }) {
  return <Text style={{ color: TEXT, fontSize: 14, fontWeight: "800", marginBottom: 8 }}>{children}</Text>;
}

function Erro({ mensagem }) {
  if (!mensagem) return null;
  return <Text style={{ color: ERROR, fontSize: 13, fontWeight: "600", marginTop: 6 }}>{mensagem}</Text>;
}

function Campo({ label, erro, ...props }) {
  return (
    <View style={{ marginBottom: 18 }}>
      <Rotulo>{label}</Rotulo>
      <TextInput
        placeholderTextColor="#8FB3A5"
        accessibilityLabel={label}
        style={{
          backgroundColor: MINT,
          borderColor: erro ? ERROR : LINE,
          borderRadius: 14,
          borderWidth: 2,
          color: TEXT,
          fontSize: 17,
          fontWeight: "600",
          paddingHorizontal: 16,
          paddingVertical: 13,
        }}
        {...props}
      />
      <Erro mensagem={erro} />
    </View>
  );
}

function Selecao({ label, opcoes, valor, onSelecionar, erro }) {
  return (
    <View style={{ marginBottom: 18 }}>
      <Rotulo>{label}</Rotulo>
      <View
        style={{
          backgroundColor: MINT,
          borderColor: erro ? ERROR : LINE,
          borderRadius: 14,
          borderWidth: 2,
          overflow: "hidden",
        }}
      >
        <Picker
          selectedValue={valor}
          onValueChange={onSelecionar}
          accessibilityLabel={label}
          dropdownIconColor={GREEN}
          style={{
            color: valor ? TEXT : MUTED,
            fontSize: 17,
            fontWeight: "600",
            backgroundColor: "transparent",
            borderWidth: 0,
            paddingHorizontal: Platform.OS === "web" ? 14 : 0,
            height: Platform.OS === "ios" ? undefined : 52,
          }}
        >
          <Picker.Item label="Selecione..." value="" color={MUTED} />
          {opcoes.map((opcao) => (
            <Picker.Item key={opcao} label={opcao} value={opcao} />
          ))}
        </Picker>
      </View>
      <Erro mensagem={erro} />
    </View>
  );
}

function BotaoPasso({ simbolo, onPress, desabilitado, label }) {
  return (
    <Pressable
      onPress={onPress}
      disabled={desabilitado}
      accessibilityLabel={label}
      style={({ pressed }) => ({
        width: 48,
        height: 48,
        borderRadius: 24,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: desabilitado ? "#D1D5DB" : DEEP,
        opacity: pressed ? 0.8 : 1,
      })}
    >
      <Text style={{ color: "#FFFFFF", fontSize: 24, fontWeight: "800", lineHeight: 28 }}>{simbolo}</Text>
    </Pressable>
  );
}

function ControleLimite({ valor, onAlterar }) {
  const progresso = (valor - LIMITE_MIN) / (LIMITE_MAX - LIMITE_MIN);
  const ajustar = (delta) => onAlterar(Math.min(LIMITE_MAX, Math.max(LIMITE_MIN, valor + delta)));
  return (
    <View style={{ marginBottom: 18 }}>
      <Rotulo>Limite desejado</Rotulo>
      <View style={{ backgroundColor: MINT, borderColor: LINE, borderWidth: 2, borderRadius: 16, padding: 16 }}>
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
          <BotaoPasso simbolo="−" label="Diminuir limite" desabilitado={valor <= LIMITE_MIN} onPress={() => ajustar(-LIMITE_PASSO)} />
          <Text style={{ color: DEEP, fontSize: 24, fontWeight: "900" }}>{formatarMoeda(valor)}</Text>
          <BotaoPasso simbolo="+" label="Aumentar limite" desabilitado={valor >= LIMITE_MAX} onPress={() => ajustar(LIMITE_PASSO)} />
        </View>
        <View style={{ height: 8, borderRadius: 4, backgroundColor: "#D1FAE5", marginTop: 16, overflow: "hidden" }}>
          <View style={{ height: 8, width: `${Math.round(progresso * 100)}%`, backgroundColor: GOLD, borderRadius: 4 }} />
        </View>
        <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 6 }}>
          <Text style={{ color: MUTED, fontSize: 12, fontWeight: "600" }}>{formatarMoeda(LIMITE_MIN)}</Text>
          <Text style={{ color: MUTED, fontSize: 12, fontWeight: "600" }}>{formatarMoeda(LIMITE_MAX)}</Text>
        </View>
      </View>
    </View>
  );
}

export default function FormularioScreen({ navigation }) {
  const [nome, setNome] = useState("");
  const [idade, setIdade] = useState("");
  const [sexo, setSexo] = useState("");
  const [escolaridade, setEscolaridade] = useState("");
  const [limite, setLimite] = useState(2000);
  const [brasileiro, setBrasileiro] = useState(true);
  const [erros, setErros] = useState({});
  const [tentou, setTentou] = useState(false);

  const dados = { nome, idade, sexo, escolaridade };

  function atualizar(setter, campo) {
    return (valor) => {
      setter(valor);
      if (tentou) setErros(validarConta({ ...dados, [campo]: valor }));
    };
  }

  function abrirConta() {
    setTentou(true);
    const encontrados = validarConta(dados);
    setErros(encontrados);
    if (Object.keys(encontrados).length) return;
    navigation.navigate("Confirmacao", {
      nome: nome.trim().replace(/\s+/g, " "),
      idade: Number(idade),
      sexo,
      escolaridade,
      limite,
      brasileiro,
    });
  }

  const quantidadeErros = Object.keys(erros).length;

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 40, alignItems: "center" }} keyboardShouldPersistTaps="handled">
        <View style={{ width: "100%", maxWidth: 520 }}>
          <View style={{ backgroundColor: DEEP, borderRadius: 22, padding: 22, marginBottom: 18 }}>
            <Text style={{ color: GOLD, fontSize: 13, fontWeight: "800", letterSpacing: 1.5 }}>BANCO VERDE</Text>
            <Text style={{ color: "#FFFFFF", fontSize: 26, fontWeight: "900", marginTop: 6 }}>Sua conta em minutos</Text>
            <Text style={{ color: "#A7F3D0", fontSize: 15, marginTop: 6, lineHeight: 21 }}>
              Preencha seus dados para abrir uma conta corrente sem tarifa.
            </Text>
          </View>

          <View
            style={{
              backgroundColor: "#FFFFFF",
              borderRadius: 22,
              padding: 20,
              shadowColor: DEEP,
              shadowOpacity: 0.08,
              shadowRadius: 16,
              shadowOffset: { width: 0, height: 6 },
              elevation: 3,
            }}
          >
            <Campo
              label="Nome completo"
              value={nome}
              onChangeText={atualizar(setNome, "nome")}
              placeholder="Ex.: Maria da Silva"
              autoCapitalize="words"
              erro={erros.nome}
            />
            <Campo
              label="Idade"
              value={idade}
              onChangeText={(t) => atualizar(setIdade, "idade")(t.replace(/\D/g, "").slice(0, 3))}
              placeholder="Ex.: 28"
              keyboardType="number-pad"
              maxLength={3}
              erro={erros.idade}
            />
            <Selecao label="Sexo" opcoes={SEXOS} valor={sexo} onSelecionar={atualizar(setSexo, "sexo")} erro={erros.sexo} />
            <Selecao
              label="Escolaridade"
              opcoes={ESCOLARIDADES}
              valor={escolaridade}
              onSelecionar={atualizar(setEscolaridade, "escolaridade")}
              erro={erros.escolaridade}
            />
            <ControleLimite valor={limite} onAlterar={setLimite} />

            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                backgroundColor: MINT,
                borderColor: LINE,
                borderWidth: 2,
                borderRadius: 16,
                paddingHorizontal: 16,
                paddingVertical: 12,
              }}
            >
              <View style={{ flex: 1, paddingRight: 12 }}>
                <Text style={{ color: TEXT, fontSize: 15, fontWeight: "800" }}>Sou brasileiro(a)</Text>
                <Text style={{ color: MUTED, fontSize: 13, marginTop: 2 }}>{brasileiro ? "Nacionalidade brasileira" : "Estrangeiro(a)"}</Text>
              </View>
              <Switch
                value={brasileiro}
                onValueChange={setBrasileiro}
                trackColor={{ false: "#CBD5E1", true: "#6EE7B7" }}
                thumbColor={brasileiro ? GREEN : "#F8FAFC"}
                activeThumbColor={GREEN}
                accessibilityLabel="Sou brasileiro"
              />
            </View>

            {quantidadeErros > 0 && (
              <View style={{ backgroundColor: "#FEF2F2", borderRadius: 12, padding: 12, marginTop: 18 }}>
                <Text style={{ color: ERROR, fontSize: 14, fontWeight: "700", textAlign: "center" }}>
                  {quantidadeErros === 1 ? "Corrija 1 campo para continuar." : `Corrija ${quantidadeErros} campos para continuar.`}
                </Text>
              </View>
            )}

            <Pressable
              onPress={abrirConta}
              accessibilityRole="button"
              style={({ pressed }) => ({
                backgroundColor: GREEN,
                borderRadius: 16,
                paddingVertical: 16,
                alignItems: "center",
                marginTop: 18,
                opacity: pressed ? 0.85 : 1,
              })}
            >
              <Text style={{ color: "#FFFFFF", fontSize: 18, fontWeight: "900" }}>Abrir conta</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

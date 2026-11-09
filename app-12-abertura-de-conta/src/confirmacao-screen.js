import { useMemo } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { DEEP, GOLD, GREEN, LINE, MINT, MUTED, TEXT, formatarMoeda } from "./theme";
import { gerarNumeroConta } from "./validation";

function Linha({ rotulo, valor, ultima }) {
  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 14,
        borderBottomWidth: ultima ? 0 : 1,
        borderBottomColor: "#D1FAE5",
      }}
    >
      <Text style={{ color: MUTED, fontSize: 14, fontWeight: "600" }}>{rotulo}</Text>
      <Text style={{ color: TEXT, fontSize: 15, fontWeight: "800", flexShrink: 1, textAlign: "right", marginLeft: 12 }}>{valor}</Text>
    </View>
  );
}

export default function ConfirmacaoScreen({ route, navigation }) {
  const { nome, idade, sexo, escolaridade, limite, brasileiro } = route.params;
  const { agencia, conta } = useMemo(gerarNumeroConta, []);
  const primeiroNome = nome.split(" ")[0];

  return (
    <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 40, alignItems: "center" }}>
      <View style={{ width: "100%", maxWidth: 520 }}>
        <View style={{ alignItems: "center", marginBottom: 18 }}>
          <View
            style={{
              width: 76,
              height: 76,
              borderRadius: 38,
              backgroundColor: GREEN,
              alignItems: "center",
              justifyContent: "center",
              borderWidth: 6,
              borderColor: "#A7F3D0",
            }}
          >
            <Text style={{ color: "#FFFFFF", fontSize: 34, fontWeight: "900" }}>✓</Text>
          </View>
          <Text style={{ color: DEEP, fontSize: 24, fontWeight: "900", marginTop: 14, textAlign: "center" }}>
            Parabéns, {primeiroNome}!
          </Text>
          <Text style={{ color: MUTED, fontSize: 15, marginTop: 4, textAlign: "center" }}>Sua conta foi aberta com sucesso.</Text>
        </View>

        <View style={{ backgroundColor: DEEP, borderRadius: 22, padding: 22, marginBottom: 18 }}>
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
            <Text style={{ color: GOLD, fontSize: 13, fontWeight: "800", letterSpacing: 1.5 }}>BANCO VERDE</Text>
            <View style={{ width: 40, height: 28, borderRadius: 6, backgroundColor: GOLD, opacity: 0.9 }} />
          </View>
          <View style={{ flexDirection: "row", marginTop: 22 }}>
            <View style={{ marginRight: 28 }}>
              <Text style={{ color: "#A7F3D0", fontSize: 12, fontWeight: "700" }}>AGÊNCIA</Text>
              <Text style={{ color: "#FFFFFF", fontSize: 20, fontWeight: "900", marginTop: 2 }}>{agencia}</Text>
            </View>
            <View>
              <Text style={{ color: "#A7F3D0", fontSize: 12, fontWeight: "700" }}>CONTA</Text>
              <Text style={{ color: "#FFFFFF", fontSize: 20, fontWeight: "900", marginTop: 2 }}>{conta}</Text>
            </View>
          </View>
          <Text style={{ color: "#FFFFFF", fontSize: 16, fontWeight: "700", marginTop: 18 }} numberOfLines={1}>
            {nome.toUpperCase()}
          </Text>
          <Text style={{ color: "#A7F3D0", fontSize: 13, marginTop: 4 }}>Limite aprovado: {formatarMoeda(limite)}</Text>
        </View>

        <View style={{ backgroundColor: "#FFFFFF", borderRadius: 22, paddingHorizontal: 20, paddingVertical: 6, borderWidth: 2, borderColor: LINE }}>
          <Text style={{ color: DEEP, fontSize: 16, fontWeight: "900", paddingTop: 14 }}>Resumo dos dados</Text>
          <Linha rotulo="Nome" valor={nome} />
          <Linha rotulo="Idade" valor={`${idade} anos`} />
          <Linha rotulo="Sexo" valor={sexo} />
          <Linha rotulo="Escolaridade" valor={escolaridade} />
          <Linha rotulo="Limite" valor={formatarMoeda(limite)} />
          <Linha rotulo="Nacionalidade" valor={brasileiro ? "Brasileira" : "Estrangeira"} ultima />
        </View>

        <Pressable
          onPress={() => navigation.goBack()}
          accessibilityRole="button"
          style={({ pressed }) => ({
            backgroundColor: MINT,
            borderColor: GREEN,
            borderWidth: 2,
            borderRadius: 16,
            paddingVertical: 15,
            alignItems: "center",
            marginTop: 18,
            opacity: pressed ? 0.85 : 1,
          })}
        >
          <Text style={{ color: DEEP, fontSize: 17, fontWeight: "900" }}>Voltar ao formulário</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

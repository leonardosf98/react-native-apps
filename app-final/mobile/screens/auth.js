import { useState } from "react";
import { Keyboard, Pressable, ScrollView, Text, View } from "react-native";
import { COMPANY } from "../company";
import { colors } from "../theme";
import { Button, Card, Field, Muted, Screen, Title } from "../ui";
import { ErrorText } from "../components";

export function LoginScreen({ onLogin, onGoRegister, loading, error }) {
  const [email, setEmail] = useState("cliente@aether.desk");
  const [password, setPassword] = useState("Cliente#123");
  function submit() {
    Keyboard.dismiss();
    onLogin(email, password);
  }
  return (
    <Screen>
      <ScrollView
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        contentContainerStyle={{ flexGrow: 1, justifyContent: "center", paddingBottom: 32 }}
      >
        <Pressable onPress={Keyboard.dismiss}>
          <View
            style={{
              width: 56,
              height: 56,
              borderRadius: 18,
              backgroundColor: colors.primary,
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 18,
            }}
          >
            <Text style={{ color: "#fff", fontWeight: "900", fontSize: 22 }}>A</Text>
          </View>
          <Title>{COMPANY.nomeFantasia}</Title>
          <Muted style={{ marginTop: 8, marginBottom: 24 }}>
            Central de chamados. CNPJ {COMPANY.cnpj}
          </Muted>
        </Pressable>
        <Card>
          <Field
            label="Email"
            value={email}
            onChangeText={setEmail}
            placeholder="você@empresa.com"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            autoComplete="email"
            returnKeyType="next"
            blurOnSubmit={false}
          />
          <Field
            label="Senha"
            value={password}
            onChangeText={setPassword}
            secure
            placeholder="••••••••"
            autoComplete="password"
            returnKeyType="go"
            onSubmitEditing={submit}
          />
          <ErrorText>{error}</ErrorText>
          <Button title="Entrar" loading={loading} onPress={submit} />
          <View style={{ height: 10 }} />
          <Button title="Criar conta de cliente" variant="ghost" onPress={onGoRegister} />
        </Card>
        <Pressable onPress={Keyboard.dismiss}>
          <Muted style={{ marginTop: 16 }}>
            Demo: cliente@aether.desk · agente@aether.desk · admin@aether.desk
          </Muted>
        </Pressable>
      </ScrollView>
    </Screen>
  );
}

export function RegisterScreen({ onRegister, onBack, loading, error }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  function submit() {
    Keyboard.dismiss();
    onRegister({ name, email, password });
  }
  return (
    <Screen>
      <ScrollView
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        contentContainerStyle={{ paddingBottom: 32 }}
      >
        <Pressable onPress={onBack}>
          <Text style={{ color: colors.primary, fontWeight: "700", marginBottom: 16 }}>Voltar</Text>
        </Pressable>
        <Title>Nova conta</Title>
        <Muted style={{ marginTop: 8, marginBottom: 20 }}>
          Cadastro de cliente em {COMPANY.nomeFantasia}.
        </Muted>
        <Card>
          <Field label="Nome" value={name} onChangeText={setName} placeholder="Seu nome" />
          <Field
            label="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            autoComplete="email"
            returnKeyType="next"
            blurOnSubmit={false}
          />
          <Field
            label="Senha"
            value={password}
            onChangeText={setPassword}
            secure
            autoComplete="password"
            returnKeyType="go"
            onSubmitEditing={submit}
          />
          <ErrorText>{error}</ErrorText>
          <Button title="Cadastrar" loading={loading} onPress={submit} />
        </Card>
      </ScrollView>
    </Screen>
  );
}

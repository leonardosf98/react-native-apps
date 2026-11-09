import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Keyboard,
  Linking,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { fetchGithubUser, formatDate, normalizeUrl } from "./github";

const BG = "#0D1117";
const CARD = "#161B22";
const LINE = "#30363D";
const TEXT = "#E6EDF3";
const MUTED = "#8B949E";
const ACCENT = "#2EA043";
const PURPLE = "#A371F7";
const DANGER = "#F85149";
const WARN = "#D29922";

function Stat({ value, label }) {
  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        backgroundColor: BG,
        borderColor: LINE,
        borderRadius: 14,
        borderWidth: 1,
        paddingVertical: 14,
        marginHorizontal: 4,
      }}
    >
      <Text style={{ color: TEXT, fontSize: 22, fontWeight: "800" }}>{value}</Text>
      <Text style={{ color: MUTED, fontSize: 12, fontWeight: "600", marginTop: 4 }}>{label}</Text>
    </View>
  );
}

function InfoRow({ icon, label, value, onPress }) {
  const empty = !value;
  const content = (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 12,
        borderBottomColor: LINE,
        borderBottomWidth: 1,
      }}
    >
      <Text style={{ fontSize: 18, width: 32 }}>{icon}</Text>
      <View style={{ flex: 1 }}>
        <Text style={{ color: MUTED, fontSize: 12, fontWeight: "700", textTransform: "uppercase", letterSpacing: 0.6 }}>
          {label}
        </Text>
        <Text
          numberOfLines={1}
          style={{
            color: empty ? MUTED : onPress ? "#58A6FF" : TEXT,
            fontSize: 15,
            fontWeight: "600",
            marginTop: 2,
            fontStyle: empty ? "italic" : "normal",
          }}
        >
          {value || "Não informado"}
        </Text>
      </View>
    </View>
  );
  if (empty || !onPress) return content;
  return (
    <TouchableOpacity onPress={onPress} accessibilityRole="link">
      {content}
    </TouchableOpacity>
  );
}

function Message({ color, icon, title, text }) {
  return (
    <View
      style={{
        backgroundColor: CARD,
        borderColor: color,
        borderRadius: 18,
        borderWidth: 1,
        padding: 20,
        alignItems: "center",
      }}
    >
      <Text style={{ fontSize: 36 }}>{icon}</Text>
      <Text style={{ color, fontSize: 18, fontWeight: "800", marginTop: 8, textAlign: "center" }}>{title}</Text>
      <Text style={{ color: MUTED, fontSize: 14, marginTop: 6, textAlign: "center", lineHeight: 20 }}>{text}</Text>
    </View>
  );
}

function Profile({ user }) {
  const blog = normalizeUrl(user.blog);
  return (
    <View
      style={{
        backgroundColor: CARD,
        borderColor: LINE,
        borderRadius: 20,
        borderWidth: 1,
        padding: 20,
      }}
    >
      <View style={{ alignItems: "center" }}>
        <View style={{ borderRadius: 64, borderWidth: 3, borderColor: PURPLE, padding: 3 }}>
          <Image
            source={{ uri: user.avatar_url }}
            accessibilityLabel={`Avatar de ${user.login}`}
            style={{ width: 112, height: 112, borderRadius: 56, backgroundColor: LINE }}
          />
        </View>
        <Text style={{ color: TEXT, fontSize: 24, fontWeight: "800", marginTop: 14, textAlign: "center" }}>
          {user.name || user.login}
        </Text>
        <Text style={{ color: MUTED, fontSize: 16, fontWeight: "600", marginTop: 2 }}>@{user.login}</Text>
        <Text
          style={{
            color: user.bio ? TEXT : MUTED,
            fontSize: 15,
            lineHeight: 22,
            marginTop: 12,
            textAlign: "center",
            fontStyle: user.bio ? "normal" : "italic",
          }}
        >
          {user.bio || "Sem bio por aqui."}
        </Text>
      </View>

      <View style={{ flexDirection: "row", marginTop: 20, marginHorizontal: -4 }}>
        <Stat value={user.public_repos} label="Repositórios" />
        <Stat value={user.followers} label="Seguidores" />
        <Stat value={user.following} label="Seguindo" />
      </View>

      <View style={{ marginTop: 12 }}>
        <InfoRow icon="🏢" label="Empresa" value={user.company} />
        <InfoRow icon="📍" label="Local" value={user.location} />
        <InfoRow icon="🔗" label="Blog" value={user.blog} onPress={blog ? () => Linking.openURL(blog) : null} />
        <InfoRow icon="📅" label="No GitHub desde" value={formatDate(user.created_at)} />
      </View>

      <TouchableOpacity
        onPress={() => Linking.openURL(user.html_url)}
        accessibilityRole="button"
        style={{
          backgroundColor: ACCENT,
          borderRadius: 14,
          paddingVertical: 15,
          alignItems: "center",
          marginTop: 20,
        }}
      >
        <Text style={{ color: "#FFFFFF", fontSize: 16, fontWeight: "800" }}>Abrir perfil no GitHub ↗</Text>
      </TouchableOpacity>
    </View>
  );
}

export default function App() {
  const [login, setLogin] = useState("leonardosf98");
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  async function search(value = login) {
    const term = value.trim();
    Keyboard.dismiss();
    if (!term) {
      setUser(null);
      setError({ kind: "empty" });
      return;
    }
    setLoading(true);
    setError(null);
    try {
      setUser(await fetchGithubUser(term));
    } catch (e) {
      setUser(null);
      setError({ kind: e.kind || "network", resetAt: e.resetAt, login: term });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    search("leonardosf98");
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: BG }}>
      <StatusBar style="light" />
      <ScrollView
        contentContainerStyle={{ padding: 20, paddingTop: 56, paddingBottom: 40, width: "100%", maxWidth: 520, alignSelf: "center" }}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={{ color: PURPLE, fontSize: 13, fontWeight: "800", letterSpacing: 1.5 }}>GITHUB API</Text>
        <Text style={{ color: TEXT, fontSize: 30, fontWeight: "900", marginTop: 4 }}>Perfil de Devs</Text>
        <Text style={{ color: MUTED, fontSize: 15, marginTop: 6, marginBottom: 20 }}>
          Digite o login de um dev e veja o perfil público dele.
        </Text>

        <View style={{ flexDirection: "row", marginBottom: 20 }}>
          <TextInput
            value={login}
            onChangeText={setLogin}
            onSubmitEditing={() => search()}
            placeholder="login do GitHub"
            placeholderTextColor={MUTED}
            autoCapitalize="none"
            autoCorrect={false}
            returnKeyType="search"
            accessibilityLabel="Login do GitHub"
            style={{
              flex: 1,
              backgroundColor: CARD,
              borderColor: LINE,
              borderWidth: 1,
              borderRadius: 14,
              color: TEXT,
              fontSize: 16,
              fontWeight: "600",
              paddingHorizontal: 16,
              paddingVertical: 14,
              marginRight: 10,
            }}
          />
          <TouchableOpacity
            onPress={() => search()}
            disabled={loading}
            accessibilityRole="button"
            style={{
              backgroundColor: loading ? LINE : PURPLE,
              borderRadius: 14,
              paddingHorizontal: 20,
              justifyContent: "center",
            }}
          >
            <Text style={{ color: "#FFFFFF", fontSize: 16, fontWeight: "800" }}>Buscar</Text>
          </TouchableOpacity>
        </View>

        {loading && (
          <View style={{ alignItems: "center", paddingVertical: 40 }}>
            <ActivityIndicator size="large" color={PURPLE} />
            <Text style={{ color: MUTED, marginTop: 12, fontSize: 14 }}>Buscando perfil...</Text>
          </View>
        )}

        {!loading && error?.kind === "not_found" && (
          <Message
            color={DANGER}
            icon="🔍"
            title="Usuário não encontrado"
            text={`Não existe nenhum usuário com o login "${error.login}" no GitHub.`}
          />
        )}

        {!loading && error?.kind === "rate_limit" && (
          <Message
            color={WARN}
            icon="⏳"
            title="Limite de requisições atingido"
            text={`A API do GitHub permite 60 buscas por hora sem autenticação.${
              error.resetAt ? ` Tente novamente às ${error.resetAt}.` : " Tente novamente mais tarde."
            }`}
          />
        )}

        {!loading && error?.kind === "empty" && (
          <Message color={WARN} icon="✏️" title="Digite um login" text="Informe o login do GitHub para buscar." />
        )}

        {!loading && error && ["network", "unknown"].includes(error.kind) && (
          <Message
            color={DANGER}
            icon="⚠️"
            title="Não foi possível buscar"
            text="Verifique sua conexão com a internet e tente novamente."
          />
        )}

        {!loading && user && <Profile user={user} />}
      </ScrollView>
    </View>
  );
}

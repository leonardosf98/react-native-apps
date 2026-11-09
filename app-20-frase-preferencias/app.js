import AsyncStorage from "@react-native-async-storage/async-storage";
import { StatusBar } from "expo-status-bar";
import { useEffect, useRef, useState } from "react";
import { ActivityIndicator, ScrollView, Switch, Text, TextInput, TouchableOpacity, View } from "react-native";

const STORAGE_KEY = "@frase-preferencias:estado";
const MIN_FONT = 16;
const MAX_FONT = 44;
const FONT_STEP = 2;

const ACCENTS = [
  { key: "violeta", label: "Violeta", color: "#8B5CF6" },
  { key: "coral", label: "Coral", color: "#F43F5E" },
  { key: "ambar", label: "Âmbar", color: "#F59E0B" },
  { key: "esmeralda", label: "Esmeralda", color: "#10B981" },
  { key: "oceano", label: "Oceano", color: "#0EA5E9" },
];

const ALIGNMENTS = [
  { key: "left", label: "Esquerda", icon: "⇤" },
  { key: "center", label: "Centro", icon: "↔" },
  { key: "right", label: "Direita", icon: "⇥" },
];

const DEFAULTS = {
  phrase: "A persistência é o caminho do êxito.",
  author: "Charles Chaplin",
  darkMode: false,
  fontSize: 26,
  accent: "violeta",
  align: "center",
  italic: true,
  bold: false,
};

const THEMES = {
  light: {
    bg: "#F5F3FF",
    surface: "#FFFFFF",
    soft: "#EDE9FE",
    line: "#DDD6FE",
    text: "#1E1B2E",
    muted: "#6B6585",
    placeholder: "#A8A2C2",
    bar: "dark",
  },
  dark: {
    bg: "#13111C",
    surface: "#1E1B2E",
    soft: "#2A2640",
    line: "#3B3557",
    text: "#F4F1FF",
    muted: "#A39DC0",
    placeholder: "#6F6990",
    bar: "light",
  },
};

function accentColor(key) {
  return (ACCENTS.find((a) => a.key === key) || ACCENTS[0]).color;
}

function sanitize(saved) {
  const merged = { ...DEFAULTS, ...(saved || {}) };
  const fontSize = Number(merged.fontSize);
  return {
    phrase: typeof merged.phrase === "string" ? merged.phrase : DEFAULTS.phrase,
    author: typeof merged.author === "string" ? merged.author : DEFAULTS.author,
    darkMode: Boolean(merged.darkMode),
    fontSize: Number.isFinite(fontSize) ? Math.min(MAX_FONT, Math.max(MIN_FONT, fontSize)) : DEFAULTS.fontSize,
    accent: ACCENTS.some((a) => a.key === merged.accent) ? merged.accent : DEFAULTS.accent,
    align: ALIGNMENTS.some((a) => a.key === merged.align) ? merged.align : DEFAULTS.align,
    italic: Boolean(merged.italic),
    bold: Boolean(merged.bold),
  };
}

function SectionCard({ theme, title, children }) {
  return (
    <View
      style={{
        backgroundColor: theme.surface,
        borderColor: theme.line,
        borderWidth: 1,
        borderRadius: 20,
        padding: 18,
        marginBottom: 14,
      }}
    >
      <Text style={{ color: theme.muted, fontSize: 12, fontWeight: "800", letterSpacing: 1, marginBottom: 12 }}>
        {title.toUpperCase()}
      </Text>
      {children}
    </View>
  );
}

function SegmentButton({ theme, accent, label, active, onPress, accessibilityLabel }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      accessibilityRole="button"
      accessibilityState={{ selected: active }}
      accessibilityLabel={accessibilityLabel || label}
      style={{
        flex: 1,
        paddingVertical: 11,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: active ? accent : theme.line,
        backgroundColor: active ? accent : theme.soft,
        alignItems: "center",
      }}
    >
      <Text style={{ color: active ? "#FFFFFF" : theme.text, fontSize: 13, fontWeight: "800" }}>{label}</Text>
    </TouchableOpacity>
  );
}

function SizeButton({ theme, label, disabled, onPress, accessibilityLabel }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.8}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      style={{
        width: 56,
        height: 48,
        borderRadius: 14,
        backgroundColor: theme.soft,
        borderColor: theme.line,
        borderWidth: 2,
        alignItems: "center",
        justifyContent: "center",
        opacity: disabled ? 0.4 : 1,
      }}
    >
      <Text style={{ color: theme.text, fontSize: 17, fontWeight: "800" }}>{label}</Text>
    </TouchableOpacity>
  );
}

function ToggleRow({ theme, accent, label, hint, value, onValueChange }) {
  return (
    <View style={{ flexDirection: "row", alignItems: "center", paddingVertical: 6 }}>
      <View style={{ flex: 1, paddingRight: 12 }}>
        <Text style={{ color: theme.text, fontSize: 15, fontWeight: "700" }}>{label}</Text>
        {hint ? <Text style={{ color: theme.muted, fontSize: 12, marginTop: 2 }}>{hint}</Text> : null}
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        accessibilityLabel={label}
        trackColor={{ false: theme.line, true: accent }}
        thumbColor="#FFFFFF"
        activeThumbColor="#FFFFFF"
      />
    </View>
  );
}

function LoadingScreen() {
  return (
    <View style={{ flex: 1, backgroundColor: "#1E1B2E", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <StatusBar style="light" />
      <ActivityIndicator size="large" color="#A78BFA" />
      <Text style={{ color: "#EDE9FE", fontSize: 16, fontWeight: "700", marginTop: 16 }}>Carregando suas preferências…</Text>
    </View>
  );
}

export default function App() {
  const [prefs, setPrefs] = useState(DEFAULTS);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("");
  const loaded = useRef(false);

  useEffect(() => {
    let active = true;
    AsyncStorage.getItem(STORAGE_KEY)
      .then((raw) => {
        if (active && raw) setPrefs(sanitize(JSON.parse(raw)));
      })
      .catch(() => {
        if (active) setStatus("Não foi possível ler as preferências salvas.");
      })
      .finally(() => {
        if (!active) return;
        loaded.current = true;
        setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!loaded.current) return;
    const timer = setTimeout(() => {
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(prefs))
        .then(() => setStatus("Preferências salvas"))
        .catch(() => setStatus("Erro ao salvar as preferências."));
    }, 300);
    return () => clearTimeout(timer);
  }, [prefs]);

  function update(changes) {
    setPrefs((current) => ({ ...current, ...changes }));
  }

  function changeFont(delta) {
    update({ fontSize: Math.min(MAX_FONT, Math.max(MIN_FONT, prefs.fontSize + delta)) });
  }

  if (loading) return <LoadingScreen />;

  const theme = prefs.darkMode ? THEMES.dark : THEMES.light;
  const accent = accentColor(prefs.accent);
  const phrase = prefs.phrase.trim() || "Digite sua frase abaixo ✍️";
  const fontPercent = ((prefs.fontSize - MIN_FONT) / (MAX_FONT - MIN_FONT)) * 100;

  return (
    <View style={{ flex: 1, backgroundColor: theme.bg }}>
      <StatusBar style={theme.bar} />
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }} keyboardShouldPersistTaps="handled">
        <View style={{ maxWidth: 480, width: "100%", alignSelf: "center", padding: 20, paddingTop: 52 }}>
          <View style={{ backgroundColor: accent, height: 8, width: 56, borderRadius: 99, marginBottom: 14 }} />
          <Text style={{ color: accent, fontSize: 13, fontWeight: "800", letterSpacing: 1 }}>APP 20</Text>
          <Text style={{ color: theme.text, fontSize: 30, fontWeight: "800", marginTop: 6 }}>Frase do Dia</Text>
          <Text style={{ color: theme.muted, fontSize: 15, lineHeight: 22, marginTop: 8, marginBottom: 20 }}>
            Personalize a frase e o visual. Tudo fica salvo no aparelho e volta quando você abrir o app.
          </Text>

          <View
            style={{
              backgroundColor: theme.surface,
              borderRadius: 26,
              borderWidth: 2,
              borderColor: accent,
              padding: 24,
              marginBottom: 18,
              minHeight: 180,
              justifyContent: "center",
            }}
          >
            <Text
              style={{
                color: accent,
                fontSize: 64,
                lineHeight: 64,
                fontWeight: "800",
                textAlign: prefs.align,
                marginBottom: -8,
              }}
            >
              “
            </Text>
            <Text
              style={{
                color: theme.text,
                fontSize: prefs.fontSize,
                lineHeight: Math.round(prefs.fontSize * 1.35),
                fontStyle: prefs.italic ? "italic" : "normal",
                fontWeight: prefs.bold ? "800" : "500",
                textAlign: prefs.align,
              }}
            >
              {phrase}
            </Text>
            {prefs.author.trim() ? (
              <Text
                style={{
                  color: accent,
                  fontSize: 15,
                  fontWeight: "800",
                  textAlign: prefs.align,
                  marginTop: 16,
                }}
              >
                — {prefs.author.trim()}
              </Text>
            ) : null}
          </View>

          <SectionCard theme={theme} title="Sua frase">
            <TextInput
              value={prefs.phrase}
              onChangeText={(text) => update({ phrase: text })}
              placeholder="Escreva uma frase que te inspira"
              placeholderTextColor={theme.placeholder}
              multiline
              maxLength={240}
              accessibilityLabel="Frase"
              style={{
                backgroundColor: theme.soft,
                borderColor: theme.line,
                borderWidth: 2,
                borderRadius: 14,
                color: theme.text,
                fontSize: 16,
                minHeight: 90,
                padding: 14,
                textAlignVertical: "top",
              }}
            />
            <Text style={{ color: theme.muted, fontSize: 12, textAlign: "right", marginTop: 6 }}>
              {prefs.phrase.length}/240
            </Text>
            <TextInput
              value={prefs.author}
              onChangeText={(text) => update({ author: text })}
              placeholder="Autor (opcional)"
              placeholderTextColor={theme.placeholder}
              maxLength={60}
              accessibilityLabel="Autor"
              style={{
                backgroundColor: theme.soft,
                borderColor: theme.line,
                borderWidth: 2,
                borderRadius: 14,
                color: theme.text,
                fontSize: 16,
                padding: 14,
                marginTop: 8,
              }}
            />
          </SectionCard>

          <SectionCard theme={theme} title="Aparência">
            <ToggleRow
              theme={theme}
              accent={accent}
              label={prefs.darkMode ? "Tema escuro 🌙" : "Tema claro ☀️"}
              hint="Alterna entre claro e escuro"
              value={prefs.darkMode}
              onValueChange={(value) => update({ darkMode: value })}
            />
            <ToggleRow
              theme={theme}
              accent={accent}
              label="Itálico"
              value={prefs.italic}
              onValueChange={(value) => update({ italic: value })}
            />
            <ToggleRow
              theme={theme}
              accent={accent}
              label="Negrito"
              value={prefs.bold}
              onValueChange={(value) => update({ bold: value })}
            />
          </SectionCard>

          <SectionCard theme={theme} title="Tamanho da fonte">
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <SizeButton
                theme={theme}
                label="A-"
                accessibilityLabel="Diminuir fonte"
                disabled={prefs.fontSize <= MIN_FONT}
                onPress={() => changeFont(-FONT_STEP)}
              />
              <View style={{ flex: 1, paddingHorizontal: 14, alignItems: "center" }}>
                <Text style={{ color: theme.text, fontSize: 22, fontWeight: "800" }}>{prefs.fontSize}px</Text>
                <View style={{ height: 6, alignSelf: "stretch", backgroundColor: theme.soft, borderRadius: 99, marginTop: 8 }}>
                  <View style={{ height: 6, width: `${fontPercent}%`, backgroundColor: accent, borderRadius: 99 }} />
                </View>
              </View>
              <SizeButton
                theme={theme}
                label="A+"
                accessibilityLabel="Aumentar fonte"
                disabled={prefs.fontSize >= MAX_FONT}
                onPress={() => changeFont(FONT_STEP)}
              />
            </View>
          </SectionCard>

          <SectionCard theme={theme} title="Cor de destaque">
            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
              {ACCENTS.map((item) => {
                const selected = item.key === prefs.accent;
                return (
                  <TouchableOpacity
                    key={item.key}
                    onPress={() => update({ accent: item.key })}
                    activeOpacity={0.8}
                    accessibilityRole="button"
                    accessibilityState={{ selected }}
                    accessibilityLabel={`Cor ${item.label}`}
                    style={{ alignItems: "center", width: 60 }}
                  >
                    <View
                      style={{
                        width: 44,
                        height: 44,
                        borderRadius: 22,
                        borderWidth: 3,
                        borderColor: selected ? theme.text : "transparent",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <View style={{ width: 32, height: 32, borderRadius: 16, backgroundColor: item.color }} />
                    </View>
                    <Text
                      style={{
                        color: selected ? theme.text : theme.muted,
                        fontSize: 11,
                        fontWeight: selected ? "800" : "600",
                        marginTop: 4,
                      }}
                    >
                      {item.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </SectionCard>

          <SectionCard theme={theme} title="Alinhamento">
            <View style={{ flexDirection: "row", gap: 8 }}>
              {ALIGNMENTS.map((item) => (
                <SegmentButton
                  key={item.key}
                  theme={theme}
                  accent={accent}
                  label={`${item.icon}  ${item.label}`}
                  accessibilityLabel={`Alinhar: ${item.label}`}
                  active={prefs.align === item.key}
                  onPress={() => update({ align: item.key })}
                />
              ))}
            </View>
          </SectionCard>

          <TouchableOpacity
            onPress={() => setPrefs(DEFAULTS)}
            activeOpacity={0.85}
            accessibilityRole="button"
            accessibilityLabel="Restaurar padrões"
            style={{
              borderRadius: 16,
              borderWidth: 2,
              borderColor: accent,
              paddingVertical: 15,
              alignItems: "center",
              marginTop: 4,
            }}
          >
            <Text style={{ color: accent, fontSize: 16, fontWeight: "800" }}>↺  Restaurar padrões</Text>
          </TouchableOpacity>

          {status ? (
            <Text style={{ color: theme.muted, fontSize: 12, textAlign: "center", marginTop: 12 }}>{status}</Text>
          ) : null}
        </View>
      </ScrollView>
    </View>
  );
}

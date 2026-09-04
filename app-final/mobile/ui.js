import { ActivityIndicator, Pressable, Text, TextInput, View } from "react-native";
import { colors } from "./theme";

export function Screen({ children, style }) {
  return (
    <View style={[{ flex: 1, backgroundColor: colors.bg, paddingHorizontal: 20 }, style]}>
      {children}
    </View>
  );
}

export function Card({ children, style }) {
  return (
    <View
      style={[
        {
          backgroundColor: colors.card,
          borderRadius: 20,
          padding: 18,
          borderWidth: 1,
          borderColor: colors.line,
          shadowColor: "#1E3A8A",
          shadowOpacity: 0.06,
          shadowRadius: 12,
          shadowOffset: { width: 0, height: 6 },
          elevation: 2,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}

export function Title({ children, style }) {
  return (
    <Text
      style={[
        { fontSize: 28, fontWeight: "800", color: colors.text, letterSpacing: -0.6 },
        style,
      ]}
    >
      {children}
    </Text>
  );
}

export function Muted({ children, style, ...rest }) {
  return (
    <Text style={[{ color: colors.muted, fontSize: 14, lineHeight: 20 }, style]} {...rest}>
      {children}
    </Text>
  );
}

export function Badge({ label, color, bg }) {
  return (
    <View
      style={{
        backgroundColor: bg,
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 999,
        alignSelf: "flex-start",
      }}
    >
      <Text style={{ color, fontSize: 12, fontWeight: "700" }}>{label}</Text>
    </View>
  );
}

export function Field({ label, value, onChangeText, secure, placeholder, multiline }) {
  return (
    <View style={{ marginBottom: 14 }}>
      <Text style={{ color: colors.muted, fontSize: 12, fontWeight: "700", marginBottom: 6 }}>
        {label}
      </Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secure}
        placeholder={placeholder}
        placeholderTextColor="#94A3B8"
        multiline={multiline}
        textAlignVertical={multiline ? "top" : "center"}
        style={{
          backgroundColor: "#F8FBFF",
          borderWidth: 1,
          borderColor: colors.line,
          borderRadius: 14,
          paddingHorizontal: 14,
          paddingVertical: multiline ? 12 : 12,
          minHeight: multiline ? 110 : 48,
          color: colors.text,
          fontSize: 16,
        }}
      />
    </View>
  );
}

export function Button({ title, onPress, variant = "primary", disabled, loading }) {
  const map = {
    primary: { bg: colors.primary, color: "#fff" },
    ghost: { bg: colors.primarySoft, color: colors.primaryDark },
    danger: { bg: "#FFE4E6", color: colors.danger },
  };
  const tone = map[variant] || map.primary;
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={({ pressed }) => ({
        backgroundColor: tone.bg,
        borderRadius: 16,
        minHeight: 50,
        alignItems: "center",
        justifyContent: "center",
        opacity: disabled ? 0.5 : pressed ? 0.85 : 1,
        paddingHorizontal: 16,
      })}
    >
      {loading ? (
        <ActivityIndicator color={tone.color} />
      ) : (
        <Text style={{ color: tone.color, fontWeight: "800", fontSize: 15 }}>{title}</Text>
      )}
    </Pressable>
  );
}

export function Chip({ label, selected, onPress }) {
  return (
    <Pressable
      onPress={onPress}
      style={{
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 999,
        backgroundColor: selected ? colors.primary : colors.card,
        borderWidth: 1,
        borderColor: selected ? colors.primary : colors.line,
        marginRight: 8,
        marginBottom: 8,
      }}
    >
      <Text
        style={{
          color: selected ? "#fff" : colors.muted,
          fontWeight: "700",
          fontSize: 13,
        }}
      >
        {label}
      </Text>
    </Pressable>
  );
}

export function TabBar({ tabs, current, onChange, badge }) {
  return (
    <View
      style={{
        flexDirection: "row",
        backgroundColor: colors.card,
        borderTopWidth: 1,
        borderColor: colors.line,
        paddingBottom: 18,
        paddingTop: 10,
        paddingHorizontal: 8,
      }}
    >
      {tabs.map((tab) => {
        const active = current === tab.key;
        return (
          <Pressable
            key={tab.key}
            onPress={() => onChange(tab.key)}
            style={{ flex: 1, alignItems: "center" }}
          >
            <View style={{ position: "relative" }}>
              <Text
                style={{
                  color: active ? colors.primary : colors.muted,
                  fontWeight: active ? "800" : "600",
                  fontSize: 13,
                }}
              >
                {tab.label}
              </Text>
              {tab.key === badge?.key && badge.count > 0 ? (
                <View
                  style={{
                    position: "absolute",
                    right: -14,
                    top: -8,
                    backgroundColor: colors.primary,
                    borderRadius: 8,
                    minWidth: 16,
                    height: 16,
                    alignItems: "center",
                    justifyContent: "center",
                    paddingHorizontal: 4,
                  }}
                >
                  <Text style={{ color: "#fff", fontSize: 10, fontWeight: "800" }}>
                    {badge.count}
                  </Text>
                </View>
              ) : null}
            </View>
          </Pressable>
        );
      })}
    </View>
  );
}

import { Pressable, Text } from "react-native";
import { colors } from "../theme";

export function BackLink({ onPress, label = "Voltar" }) {
  return (
    <Pressable onPress={onPress}>
      <Text style={{ color: colors.primary, fontWeight: "700", marginBottom: 12 }}>
        {label}
      </Text>
    </Pressable>
  );
}

import { Text } from "react-native";
import { colors } from "../theme";

export function ErrorText({ children }) {
  if (!children) return null;
  return (
    <Text style={{ color: colors.danger, marginBottom: 12, fontWeight: "600" }}>
      {children}
    </Text>
  );
}

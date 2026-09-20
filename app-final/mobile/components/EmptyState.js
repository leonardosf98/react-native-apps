import { Text, View } from "react-native";
import { Card } from "../ui";

export function EmptyState({ children }) {
  return (
    <Card>
      <Text style={{ fontWeight: "700", color: "#0F172A" }}>{children}</Text>
    </Card>
  );
}

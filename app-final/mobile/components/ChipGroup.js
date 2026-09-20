import { Text, View } from "react-native";
import { Chip } from "../ui";

export function ChipGroup({ label, options, value, onChange }) {
  return (
    <>
      <Text style={{ color: "#64748B", marginBottom: 8 }}>{label}</Text>
      <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
        {options.map(([key, optionLabel]) => (
          <Chip
            key={key}
            label={optionLabel}
            selected={value === key}
            onPress={() => onChange(key)}
          />
        ))}
      </View>
    </>
  );
}

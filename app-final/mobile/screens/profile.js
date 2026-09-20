import { useMemo } from "react";
import { Alert, Text, View } from "react-native";
import { COMPANY } from "../company";
import { ROLE_LABEL, colors } from "../theme";
import { Badge, Button, Card, Muted, Screen, Title } from "../ui";

export function ProfileScreen({ user, onLogout }) {
  const placeholders = useMemo(
    () => [
      ["Razão social", COMPANY.razaoSocial],
      ["CNPJ", COMPANY.cnpj],
      ["IE", COMPANY.inscricaoEstadual],
      ["Email", COMPANY.email],
      ["Telefone", COMPANY.telefone],
      ["Endereço", `${COMPANY.endereco} · ${COMPANY.cidade}/${COMPANY.uf}`],
    ],
    [],
  );
  return (
    <Screen>
      <Title>Conta</Title>
      <Card style={{ marginTop: 16 }}>
        <Text style={{ fontSize: 20, fontWeight: "800", color: colors.text }}>{user.name}</Text>
        <Muted style={{ marginTop: 4 }}>{user.email}</Muted>
        <View style={{ marginTop: 10 }}>
          <Badge
            label={ROLE_LABEL[user.role]}
            color={colors.primaryDark}
            bg={colors.primarySoft}
          />
        </View>
      </Card>
      <Card style={{ marginTop: 12 }}>
        <Text style={{ fontWeight: "800", marginBottom: 10, color: colors.text }}>
          {COMPANY.nomeFantasia}
        </Text>
        {placeholders.map(([label, value]) => (
          <View key={label} style={{ marginBottom: 8 }}>
            <Muted>{label}</Muted>
            <Text style={{ color: colors.text, fontWeight: "600" }}>{value}</Text>
          </View>
        ))}
      </Card>
      <View style={{ marginTop: 16 }}>
        <Button
          title="Sair"
          variant="danger"
          onPress={() =>
            Alert.alert("Sair", "Encerrar sessão?", [
              { text: "Cancelar", style: "cancel" },
              { text: "Sair", style: "destructive", onPress: onLogout },
            ])
          }
        />
      </View>
    </Screen>
  );
}

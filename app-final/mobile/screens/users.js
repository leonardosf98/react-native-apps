import { useState } from "react";
import { ScrollView, Text, View } from "react-native";
import { ROLE_LABEL, colors } from "../theme";
import { Button, Card, Chip, Field, Muted, Screen, Title } from "../ui";
import { ChipGroup } from "../components";

export function UsersScreen({ users, onCreate, onToggle, onRole, onDelete }) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("cliente");
  return (
    <Screen>
      <Title>Usuários</Title>
      <Muted style={{ marginTop: 6, marginBottom: 16 }}>CRUD interno da operação.</Muted>
      <Button title={open ? "Fechar formulário" : "Novo usuário"} variant={open ? "ghost" : "primary"} onPress={() => setOpen(!open)} />
      {open ? (
        <Card style={{ marginTop: 12 }}>
          <Field label="Nome" value={name} onChangeText={setName} />
          <Field label="Email" value={email} onChangeText={setEmail} />
          <Field label="Senha inicial" value={password} onChangeText={setPassword} secure />
          <ChipGroup
            label="Papel"
            options={Object.entries(ROLE_LABEL)}
            value={role}
            onChange={setRole}
          />
          <View style={{ marginTop: 12 }}>
            <Button
              title="Criar"
              onPress={() => {
                onCreate({ name, email, password, role });
                setName("");
                setEmail("");
                setPassword("");
              }}
            />
          </View>
        </Card>
      ) : null}
      <ScrollView style={{ marginTop: 14 }} showsVerticalScrollIndicator={false}>
        {users.map((item) => (
          <Card key={item.id} style={{ marginBottom: 10 }}>
            <Text style={{ fontWeight: "800", color: colors.text }}>{item.name}</Text>
            <Muted>{item.email}</Muted>
            <View style={{ flexDirection: "row", flexWrap: "wrap", marginTop: 10 }}>
              {Object.keys(ROLE_LABEL).map((key) => (
                <Chip
                  key={key}
                  label={ROLE_LABEL[key]}
                  selected={item.role === key}
                  onPress={() => onRole(item, key)}
                />
              ))}
            </View>
            <View style={{ flexDirection: "row", gap: 8, marginTop: 10 }}>
              <View style={{ flex: 1 }}>
                <Button
                  title={item.active ? "Desativar" : "Ativar"}
                  variant="ghost"
                  onPress={() => onToggle(item)}
                />
              </View>
              <View style={{ flex: 1 }}>
                <Button title="Remover" variant="danger" onPress={() => onDelete(item)} />
              </View>
            </View>
          </Card>
        ))}
      </ScrollView>
    </Screen>
  );
}

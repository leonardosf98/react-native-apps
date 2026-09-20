import { Pressable, ScrollView, Text, View } from "react-native";
import { colors } from "../theme";
import { Card, Muted, Screen, Title } from "../ui";
import { EmptyState } from "../components";
import { formatWhen } from "../utils";

export function NotificationsScreen({ items, onOpen, onMarkSeen }) {
  return (
    <Screen>
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
        <Title>Fila ao vivo</Title>
        <Pressable onPress={onMarkSeen}>
          <Text style={{ color: colors.primary, fontWeight: "700" }}>Limpar</Text>
        </Pressable>
      </View>
      <Muted style={{ marginTop: 6, marginBottom: 16 }}>
        Novos pedidos e mudanças de status entram aqui.
      </Muted>
      <ScrollView showsVerticalScrollIndicator={false}>
        {items.length === 0 ? (
          <EmptyState>Nenhuma notificação nova.</EmptyState>
        ) : (
          items.map((item) => (
            <Pressable key={item.id} onPress={() => onOpen(item)}>
              <Card style={{ marginBottom: 10 }}>
                <Text style={{ fontWeight: "800", color: colors.text }}>{item.ticketTitle}</Text>
                <Muted style={{ marginTop: 4 }}>
                  {item.actorName} · {item.type} · {formatWhen(item.createdAt)}
                </Muted>
              </Card>
            </Pressable>
          ))
        )}
      </ScrollView>
    </Screen>
  );
}

import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StatusBar } from "expo-status-bar";
import { FlatList, Linking, Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { JOBS } from "./jobs";

const INDIGO = "#1E1B4B";
const PURPLE = "#6D28D9";
const VIOLET = "#8B5CF6";
const PALE = "#F5F3FF";
const LINE = "#DDD6FE";
const TEXT = "#1F1B3A";
const MUTED = "#5B5675";

const Stack = createNativeStackNavigator();

const MODE_COLORS = {
  Remoto: { bg: "#DCFCE7", fg: "#166534" },
  Híbrido: { bg: "#FEF3C7", fg: "#92400E" },
  Presencial: { bg: "#E0E7FF", fg: "#3730A3" },
};

function ListHeader() {
  return (
    <View style={{ backgroundColor: INDIGO, borderRadius: 24, padding: 22, marginBottom: 18 }}>
      <Text style={{ color: "#C4B5FD", fontSize: 13, fontWeight: "800", letterSpacing: 1.5 }}>OPORTUNIDADES EM TI</Text>
      <Text style={{ color: "#FFFFFF", fontSize: 28, fontWeight: "800", marginTop: 6 }}>Vagas abertas</Text>
      <Text style={{ color: "#DDD6FE", fontSize: 14, lineHeight: 20, marginTop: 8 }}>
        {JOBS.length} vagas selecionadas. Toque em "Saiba mais" para ver todos os detalhes.
      </Text>
    </View>
  );
}

function Separator() {
  return <View style={{ height: 12 }} />;
}

function JobCard({ job, index, onPress }) {
  return (
    <View
      style={{
        backgroundColor: "#FFFFFF",
        borderRadius: 18,
        borderWidth: 1,
        borderColor: LINE,
        padding: 18,
        flexDirection: "row",
        alignItems: "center",
        gap: 14,
      }}
    >
      <View
        style={{
          width: 42,
          height: 42,
          borderRadius: 12,
          backgroundColor: PALE,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Text style={{ color: PURPLE, fontSize: 16, fontWeight: "800" }}>{String(index + 1).padStart(2, "0")}</Text>
      </View>
      <Text style={{ flex: 1, color: TEXT, fontSize: 16, fontWeight: "800", lineHeight: 22 }}>{job.title}</Text>
      <Pressable
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel={`Saiba mais sobre ${job.title}`}
        style={({ pressed }) => ({
          backgroundColor: pressed ? INDIGO : PURPLE,
          borderRadius: 12,
          paddingHorizontal: 14,
          paddingVertical: 10,
        })}
      >
        <Text style={{ color: "#FFFFFF", fontSize: 13, fontWeight: "800" }}>Saiba mais</Text>
      </Pressable>
    </View>
  );
}

function JobsScreen({ navigation }) {
  return (
    <View style={{ flex: 1, backgroundColor: PALE }}>
      <FlatList
        data={JOBS}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={ListHeader}
        ItemSeparatorComponent={Separator}
        contentContainerStyle={{ padding: 16, paddingBottom: 32, width: "100%", maxWidth: 720, alignSelf: "center" }}
        renderItem={({ item, index }) => (
          <JobCard job={item} index={index} onPress={() => navigation.navigate("Detalhes", { jobId: item.id })} />
        )}
      />
    </View>
  );
}

function InfoRow({ label, value }) {
  return (
    <View style={{ flexDirection: "row", justifyContent: "space-between", gap: 12, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: LINE }}>
      <Text style={{ color: MUTED, fontSize: 14, fontWeight: "700" }}>{label}</Text>
      <Text style={{ flex: 1, color: TEXT, fontSize: 14, fontWeight: "800", textAlign: "right" }}>{value}</Text>
    </View>
  );
}

function Section({ title, children }) {
  return (
    <View style={{ backgroundColor: "#FFFFFF", borderRadius: 18, borderWidth: 1, borderColor: LINE, padding: 18, marginTop: 14 }}>
      <Text style={{ color: PURPLE, fontSize: 13, fontWeight: "800", letterSpacing: 1, marginBottom: 6 }}>{title}</Text>
      {children}
    </View>
  );
}

function JobDetailScreen({ route }) {
  const job = JOBS.find((item) => item.id === route.params?.jobId) ?? JOBS[0];
  const modeColor = MODE_COLORS[job.mode] ?? { bg: PALE, fg: PURPLE };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: PALE }} contentContainerStyle={{ padding: 16, paddingBottom: 32, width: "100%", maxWidth: 720, alignSelf: "center" }}>
      <View style={{ backgroundColor: INDIGO, borderRadius: 24, padding: 22 }}>
        <View style={{ alignSelf: "flex-start", backgroundColor: modeColor.bg, borderRadius: 999, paddingHorizontal: 12, paddingVertical: 5 }}>
          <Text style={{ color: modeColor.fg, fontSize: 12, fontWeight: "800" }}>{job.mode}</Text>
        </View>
        <Text style={{ color: "#FFFFFF", fontSize: 24, fontWeight: "800", lineHeight: 30, marginTop: 12 }}>{job.title}</Text>
        <Text style={{ color: "#C4B5FD", fontSize: 15, fontWeight: "700", marginTop: 6 }}>{job.company}</Text>
      </View>

      <Section title="RESUMO">
        <InfoRow label="Salário" value={job.salary} />
        <InfoRow label="Modalidade" value={job.mode} />
        <InfoRow label="Local" value={job.location} />
      </Section>

      <Section title="DESCRIÇÃO">
        <Text style={{ color: TEXT, fontSize: 15, lineHeight: 22 }}>{job.description}</Text>
      </Section>

      <Section title="REQUISITOS">
        {job.requirements.map((req) => (
          <View key={req} style={{ flexDirection: "row", alignItems: "center", gap: 10, paddingVertical: 6 }}>
            <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: VIOLET }} />
            <Text style={{ flex: 1, color: TEXT, fontSize: 15 }}>{req}</Text>
          </View>
        ))}
      </Section>

      <Section title="CONTATO">
        <Text style={{ color: TEXT, fontSize: 15, marginBottom: 12 }}>{job.contact}</Text>
        <Pressable
          onPress={() => Linking.openURL(`mailto:${job.contact}?subject=${encodeURIComponent(`Candidatura: ${job.title}`)}`)}
          accessibilityRole="button"
          style={({ pressed }) => ({
            backgroundColor: pressed ? INDIGO : PURPLE,
            borderRadius: 14,
            paddingVertical: 14,
            alignItems: "center",
          })}
        >
          <Text style={{ color: "#FFFFFF", fontSize: 15, fontWeight: "800" }}>Enviar e-mail</Text>
        </Pressable>
      </Section>
    </ScrollView>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <StatusBar style="light" />
        <Stack.Navigator
          screenOptions={{
            headerStyle: { backgroundColor: INDIGO },
            headerTintColor: "#FFFFFF",
            headerTitleStyle: { fontWeight: "800" },
            contentStyle: { backgroundColor: PALE },
          }}
        >
          <Stack.Screen name="Vagas" component={JobsScreen} options={{ title: "Vagas de TI" }} />
          <Stack.Screen name="Detalhes" component={JobDetailScreen} options={{ title: "Detalhes da vaga" }} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

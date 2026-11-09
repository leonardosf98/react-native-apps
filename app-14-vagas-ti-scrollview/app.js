import { StatusBar } from "expo-status-bar";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { JOBS } from "./jobs";

const PETROL = "#0F3D3E";
const TEAL = "#0F766E";
const TEAL_LIGHT = "#14B8A6";
const MINT = "#F0FDFA";
const LINE = "#99F6E4";
const TEXT = "#0B2B2C";
const MUTED = "#4B6B6A";
const BG = "#E6F4F2";

const Stack = createNativeStackNavigator();

function Badge({ label }) {
  return (
    <View
      style={{
        backgroundColor: MINT,
        borderColor: LINE,
        borderWidth: 1,
        borderRadius: 999,
        paddingHorizontal: 10,
        paddingVertical: 4,
        marginRight: 8,
        marginBottom: 8,
      }}
    >
      <Text style={{ color: TEAL, fontSize: 12, fontWeight: "800" }}>{label}</Text>
    </View>
  );
}

function JobCard({ job, index, onPress }) {
  return (
    <View
      style={{
        backgroundColor: "#FFFFFF",
        borderRadius: 18,
        padding: 18,
        marginBottom: 14,
        borderLeftWidth: 6,
        borderLeftColor: TEAL_LIGHT,
        shadowColor: PETROL,
        shadowOpacity: 0.08,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 4 },
        elevation: 3,
      }}
    >
      <Text style={{ color: MUTED, fontSize: 12, fontWeight: "800", letterSpacing: 1, marginBottom: 6 }}>
        VAGA {String(index + 1).padStart(2, "0")}
      </Text>
      <Text style={{ color: TEXT, fontSize: 18, fontWeight: "800", marginBottom: 14 }}>{job.title}</Text>
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.85}
        accessibilityRole="button"
        accessibilityLabel={`Saiba mais sobre ${job.title}`}
        style={{
          alignSelf: "flex-start",
          backgroundColor: TEAL,
          borderRadius: 12,
          paddingHorizontal: 18,
          paddingVertical: 10,
        }}
      >
        <Text style={{ color: "#FFFFFF", fontSize: 14, fontWeight: "800" }}>Saiba mais →</Text>
      </TouchableOpacity>
    </View>
  );
}

function HomeScreen({ navigation }) {
  return (
    <ScrollView style={{ flex: 1, backgroundColor: BG }} contentContainerStyle={{ padding: 18, paddingBottom: 36 }}>
      <View style={{ width: "100%", maxWidth: 640, alignSelf: "center" }}>
        <View style={{ backgroundColor: PETROL, borderRadius: 22, padding: 22, marginBottom: 20 }}>
          <Text style={{ fontSize: 34, marginBottom: 6 }}>💼</Text>
          <Text style={{ color: "#FFFFFF", fontSize: 24, fontWeight: "900" }}>Vagas de TI</Text>
          <Text style={{ color: LINE, fontSize: 14, marginTop: 6, lineHeight: 20 }}>
            {JOBS.length} oportunidades abertas. Toque em "Saiba mais" para ver todos os detalhes.
          </Text>
        </View>
        {JOBS.map((job, index) => (
          <JobCard key={job.id} job={job} index={index} onPress={() => navigation.navigate("Detalhes", { job })} />
        ))}
      </View>
    </ScrollView>
  );
}

function InfoRow({ icon, label, value }) {
  return (
    <View style={{ flexDirection: "row", alignItems: "center", paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: "#E2F1EF" }}>
      <Text style={{ fontSize: 20, width: 34 }}>{icon}</Text>
      <View style={{ flex: 1 }}>
        <Text style={{ color: MUTED, fontSize: 12, fontWeight: "700" }}>{label}</Text>
        <Text style={{ color: TEXT, fontSize: 16, fontWeight: "700", marginTop: 2 }}>{value}</Text>
      </View>
    </View>
  );
}

function Section({ title, children }) {
  return (
    <View style={{ backgroundColor: "#FFFFFF", borderRadius: 18, padding: 18, marginBottom: 14 }}>
      <Text style={{ color: TEAL, fontSize: 13, fontWeight: "900", letterSpacing: 1, marginBottom: 10 }}>{title}</Text>
      {children}
    </View>
  );
}

function DetailsScreen({ route, navigation }) {
  const { job } = route.params;
  return (
    <ScrollView style={{ flex: 1, backgroundColor: BG }} contentContainerStyle={{ padding: 18, paddingBottom: 36 }}>
      <View style={{ width: "100%", maxWidth: 640, alignSelf: "center" }}>
        <View style={{ backgroundColor: PETROL, borderRadius: 22, padding: 22, marginBottom: 16 }}>
          <Text style={{ color: LINE, fontSize: 13, fontWeight: "800", marginBottom: 6 }}>{job.company}</Text>
          <Text style={{ color: "#FFFFFF", fontSize: 24, fontWeight: "900", lineHeight: 30 }}>{job.title}</Text>
          <View style={{ flexDirection: "row", flexWrap: "wrap", marginTop: 14 }}>
            <Badge label={job.mode} />
            <Badge label={job.location} />
          </View>
        </View>

        <Section title="INFORMAÇÕES">
          <InfoRow icon="🏢" label="Empresa" value={job.company} />
          <InfoRow icon="💰" label="Salário" value={job.salary} />
          <InfoRow icon="🧭" label="Modalidade" value={job.mode} />
          <InfoRow icon="📍" label="Local" value={job.location} />
        </Section>

        <Section title="DESCRIÇÃO">
          <Text style={{ color: TEXT, fontSize: 15, lineHeight: 23 }}>{job.description}</Text>
        </Section>

        <Section title="REQUISITOS">
          {job.requirements.map((item) => (
            <View key={item} style={{ flexDirection: "row", alignItems: "flex-start", marginBottom: 8 }}>
              <Text style={{ color: TEAL_LIGHT, fontSize: 16, fontWeight: "900", marginRight: 8 }}>✓</Text>
              <Text style={{ color: TEXT, fontSize: 15, flex: 1, lineHeight: 22 }}>{item}</Text>
            </View>
          ))}
        </Section>

        <Section title="CONTATO">
          <Text style={{ color: TEXT, fontSize: 15 }}>Envie seu currículo para:</Text>
          <Text selectable style={{ color: TEAL, fontSize: 16, fontWeight: "800", marginTop: 6 }}>
            ✉️ {job.contact}
          </Text>
        </Section>

        <TouchableOpacity
          onPress={() => navigation.goBack()}
          activeOpacity={0.85}
          accessibilityRole="button"
          style={{ backgroundColor: TEAL, borderRadius: 14, paddingVertical: 14, alignItems: "center", marginTop: 4 }}
        >
          <Text style={{ color: "#FFFFFF", fontSize: 15, fontWeight: "800" }}>← Voltar para as vagas</Text>
        </TouchableOpacity>
      </View>
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
            headerStyle: { backgroundColor: PETROL },
            headerTintColor: "#FFFFFF",
            headerTitleStyle: { fontWeight: "800" },
            contentStyle: { backgroundColor: BG },
          }}
        >
          <Stack.Screen name="Vagas" component={HomeScreen} options={{ title: "Vagas de TI" }} />
          <Stack.Screen name="Detalhes" component={DetailsScreen} options={{ title: "Detalhes da vaga" }} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

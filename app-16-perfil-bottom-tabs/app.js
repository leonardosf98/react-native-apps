import { Ionicons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { DefaultTheme, NavigationContainer } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { Image, Linking, Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { PROFILE_EDITAVEL as PROFILE } from "./profile";

const INDIGO = "#1E1B4B";
const VIOLET = "#7C3AED";
const LILAC = "#EDE9FE";
const BG = "#F7F5FF";
const LINE = "#DDD6FE";
const TEXT = "#1F1B3A";
const MUTED = "#625C80";

const Tab = createBottomTabNavigator();

const theme = {
  ...DefaultTheme,
  colors: { ...DefaultTheme.colors, background: BG, primary: VIOLET, card: "#FFFFFF", text: TEXT, border: LINE },
};

function Screen({ children }) {
  return (
    <ScrollView style={{ flex: 1, backgroundColor: BG }} contentContainerStyle={{ padding: 20, paddingBottom: 32, width: "100%", maxWidth: 560, alignSelf: "center" }}>
      {children}
    </ScrollView>
  );
}

function Card({ children, style }) {
  return (
    <View
      style={{
        backgroundColor: "#FFFFFF",
        borderRadius: 20,
        borderWidth: 1,
        borderColor: LINE,
        padding: 18,
        marginBottom: 14,
        shadowColor: INDIGO,
        shadowOpacity: 0.06,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 4 },
        elevation: 2,
        ...style,
      }}
    >
      {children}
    </View>
  );
}

function SectionTitle({ icon, children }) {
  return (
    <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 14 }}>
      <View style={{ backgroundColor: LILAC, borderRadius: 12, padding: 8, marginRight: 10 }}>
        <Ionicons name={icon} size={20} color={VIOLET} />
      </View>
      <Text style={{ color: TEXT, fontSize: 22, fontWeight: "800" }}>{children}</Text>
    </View>
  );
}

function Chip({ label }) {
  return (
    <View style={{ backgroundColor: LILAC, borderRadius: 999, paddingHorizontal: 12, paddingVertical: 6, marginRight: 8, marginBottom: 8 }}>
      <Text style={{ color: VIOLET, fontSize: 13, fontWeight: "700" }}>{label}</Text>
    </View>
  );
}

function TimelineItem({ title, subtitle, period, last, children }) {
  return (
    <View style={{ flexDirection: "row" }}>
      <View style={{ alignItems: "center", marginRight: 14 }}>
        <View style={{ width: 14, height: 14, borderRadius: 7, backgroundColor: VIOLET, borderWidth: 3, borderColor: LILAC, marginTop: 4 }} />
        {!last && <View style={{ flex: 1, width: 2, backgroundColor: LINE, marginTop: 4 }} />}
      </View>
      <View style={{ flex: 1, paddingBottom: last ? 0 : 20 }}>
        <Text style={{ color: TEXT, fontSize: 16, fontWeight: "800" }}>{title}</Text>
        <Text style={{ color: MUTED, fontSize: 14, fontWeight: "600", marginTop: 2 }}>{subtitle}</Text>
        <Text style={{ color: VIOLET, fontSize: 12, fontWeight: "800", marginTop: 6, letterSpacing: 0.5 }}>{period}</Text>
        {children}
      </View>
    </View>
  );
}

function PessoalScreen() {
  const p = PROFILE.pessoal;
  return (
    <Screen>
      <View style={{ backgroundColor: INDIGO, borderRadius: 24, padding: 24, alignItems: "center", marginBottom: 14 }}>
        <View style={{ borderRadius: 70, borderWidth: 4, borderColor: "#A78BFA", padding: 3 }}>
          <Image source={{ uri: p.avatar }} style={{ width: 120, height: 120, borderRadius: 60, backgroundColor: "#312E81" }} accessibilityLabel={`Foto de ${p.nome}`} />
        </View>
        <Text style={{ color: "#FFFFFF", fontSize: 26, fontWeight: "900", marginTop: 16 }}>{p.nome}</Text>
        <Text style={{ color: "#C4B5FD", fontSize: 15, fontWeight: "700", marginTop: 4 }}>{p.cargo}</Text>
        <View style={{ flexDirection: "row", alignItems: "center", marginTop: 10 }}>
          <Ionicons name="location-outline" size={15} color="#A5B4FC" />
          <Text style={{ color: "#A5B4FC", fontSize: 13, marginLeft: 4 }}>{p.localizacao}</Text>
        </View>
      </View>
      <Card>
        <Text style={{ color: TEXT, fontSize: 16, fontWeight: "800", marginBottom: 8 }}>Sobre mim</Text>
        <Text style={{ color: MUTED, fontSize: 15, lineHeight: 23 }}>{p.bio}</Text>
      </Card>
      <Card>
        <Text style={{ color: TEXT, fontSize: 16, fontWeight: "800", marginBottom: 6 }}>Contato</Text>
        {p.contatos.map((c, i) => (
          <Pressable
            key={c.tipo}
            onPress={() => Linking.openURL(c.url)}
            accessibilityRole="link"
            style={({ pressed }) => ({
              flexDirection: "row",
              alignItems: "center",
              paddingVertical: 12,
              borderTopWidth: i === 0 ? 0 : 1,
              borderTopColor: "#EEEAFB",
              opacity: pressed ? 0.6 : 1,
            })}
          >
            <View style={{ backgroundColor: LILAC, borderRadius: 10, padding: 8, marginRight: 12 }}>
              <Ionicons name={c.icone} size={18} color={VIOLET} />
            </View>
            <Text style={{ color: TEXT, fontSize: 15, fontWeight: "600", flex: 1 }}>{c.rotulo}</Text>
            <Ionicons name="open-outline" size={16} color={MUTED} />
          </Pressable>
        ))}
      </Card>
    </Screen>
  );
}

function FormacaoScreen() {
  return (
    <Screen>
      <SectionTitle icon="school-outline">Formação</SectionTitle>
      <Card>
        {PROFILE.formacao.map((f, i) => (
          <TimelineItem key={f.curso} title={f.curso} subtitle={f.instituicao} period={f.periodo} last={i === PROFILE.formacao.length - 1}>
            <Text style={{ color: MUTED, fontSize: 14, lineHeight: 21, marginTop: 6 }}>{f.descricao}</Text>
          </TimelineItem>
        ))}
      </Card>
    </Screen>
  );
}

function ExperienciaScreen() {
  return (
    <Screen>
      <SectionTitle icon="briefcase-outline">Experiência</SectionTitle>
      {PROFILE.experiencia.map((e) => (
        <Card key={e.cargo + e.empresa}>
          <TimelineItem title={e.cargo} subtitle={e.empresa} period={e.periodo} last>
            <View style={{ marginTop: 10 }}>
              {e.atividades.map((a) => (
                <View key={a} style={{ flexDirection: "row", alignItems: "flex-start", marginBottom: 6 }}>
                  <Ionicons name="checkmark-circle" size={16} color={VIOLET} style={{ marginTop: 2, marginRight: 8 }} />
                  <Text style={{ color: MUTED, fontSize: 14, lineHeight: 20, flex: 1 }}>{a}</Text>
                </View>
              ))}
            </View>
          </TimelineItem>
        </Card>
      ))}
    </Screen>
  );
}

function ProjetosScreen() {
  return (
    <Screen>
      <SectionTitle icon="rocket-outline">Projetos</SectionTitle>
      {PROFILE.projetos.map((p) => (
        <Card key={p.nome}>
          <Text style={{ color: TEXT, fontSize: 17, fontWeight: "800" }}>{p.nome}</Text>
          <Text style={{ color: MUTED, fontSize: 14, lineHeight: 21, marginTop: 6, marginBottom: 12 }}>{p.descricao}</Text>
          <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
            {p.tags.map((t) => (
              <Chip key={t} label={t} />
            ))}
          </View>
        </Card>
      ))}
      <View style={{ height: 10 }} />
      <SectionTitle icon="sparkles-outline">Habilidades</SectionTitle>
      <Card>
        {PROFILE.habilidades.map((h, i) => (
          <View key={h.grupo} style={{ marginBottom: i === PROFILE.habilidades.length - 1 ? 0 : 12 }}>
            <Text style={{ color: TEXT, fontSize: 14, fontWeight: "800", marginBottom: 8 }}>{h.grupo}</Text>
            <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
              {h.itens.map((item) => (
                <Chip key={item} label={item} />
              ))}
            </View>
          </View>
        ))}
      </Card>
    </Screen>
  );
}

const TABS = [
  { name: "Pessoal", component: PessoalScreen, icon: "person" },
  { name: "Formação", component: FormacaoScreen, icon: "school" },
  { name: "Experiência", component: ExperienciaScreen, icon: "briefcase" },
  { name: "Projetos", component: ProjetosScreen, icon: "code-slash" },
];

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer theme={theme}>
        <StatusBar style="light" />
        <Tab.Navigator
          screenOptions={({ route }) => {
            const tab = TABS.find((t) => t.name === route.name);
            return {
              headerStyle: { backgroundColor: INDIGO },
              headerTintColor: "#FFFFFF",
              headerTitleStyle: { fontWeight: "800" },
              headerTitle: route.name === "Pessoal" ? "Meu Perfil" : route.name,
              tabBarActiveTintColor: VIOLET,
              tabBarInactiveTintColor: "#9A93B8",
              tabBarLabelStyle: { fontSize: 12, fontWeight: "700" },
              tabBarStyle: { backgroundColor: "#FFFFFF", borderTopColor: LINE },
              tabBarIcon: ({ color, size, focused }) => (
                <Ionicons name={focused ? tab.icon : `${tab.icon}-outline`} size={size} color={color} />
              ),
            };
          }}
        >
          {TABS.map((t) => (
            <Tab.Screen key={t.name} name={t.name} component={t.component} />
          ))}
        </Tab.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

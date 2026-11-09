import { StatusBar } from "expo-status-bar";
import { NavigationContainer } from "@react-navigation/native";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { SafeAreaProvider, useSafeAreaInsets } from "react-native-safe-area-context";
import { Image, Linking, Pressable, ScrollView, Text, View } from "react-native";
import { PROFILE } from "./profile";

const DEEP = "#064E3B";
const EMERALD = "#059669";
const MINT = "#D1FAE5";
const PALE = "#ECFDF5";
const BG = "#F4FBF7";
const TEXT = "#0F2A20";
const MUTED = "#4B6B5E";
const LINE = "#BBE7D2";

const Tab = createMaterialTopTabNavigator();

function Page({ children }) {
  return (
    <ScrollView style={{ flex: 1, backgroundColor: BG }} contentContainerStyle={{ padding: 18, paddingBottom: 40, width: "100%", maxWidth: 640, alignSelf: "center" }}>
      {children}
    </ScrollView>
  );
}

function Card({ children, style }) {
  return (
    <View
      style={{
        backgroundColor: "#FFFFFF",
        borderRadius: 18,
        borderWidth: 1,
        borderColor: LINE,
        padding: 16,
        marginBottom: 14,
        shadowColor: DEEP,
        shadowOpacity: 0.06,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 4 },
        elevation: 2,
        ...style,
      }}
    >
      {children}
    </View>
  );
}

function SectionTitle({ children }) {
  return <Text style={{ color: DEEP, fontSize: 13, fontWeight: "800", letterSpacing: 1, textTransform: "uppercase", marginBottom: 10 }}>{children}</Text>;
}

function PersonalScreen() {
  const { about, details, interests } = PROFILE.personal;
  return (
    <Page>
      <Card>
        <SectionTitle>Sobre mim</SectionTitle>
        <Text style={{ color: TEXT, fontSize: 15, lineHeight: 23 }}>{about}</Text>
      </Card>
      <Card>
        <SectionTitle>Informações</SectionTitle>
        {details.map((item, index) => (
          <Pressable
            key={item.label}
            disabled={!item.url}
            onPress={() => Linking.openURL(item.url)}
            style={{ flexDirection: "row", alignItems: "center", paddingVertical: 10, borderTopWidth: index ? 1 : 0, borderTopColor: PALE }}
          >
            <View style={{ width: 38, height: 38, borderRadius: 12, backgroundColor: PALE, alignItems: "center", justifyContent: "center", marginRight: 12 }}>
              <Text style={{ fontSize: 18 }}>{item.icon}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ color: MUTED, fontSize: 12, fontWeight: "700" }}>{item.label}</Text>
              <Text style={{ color: item.url ? EMERALD : TEXT, fontSize: 15, fontWeight: "700", marginTop: 2 }}>{item.value}</Text>
            </View>
          </Pressable>
        ))}
      </Card>
      <Card>
        <SectionTitle>Interesses</SectionTitle>
        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
          {interests.map((interest) => (
            <View key={interest} style={{ backgroundColor: MINT, borderRadius: 999, paddingHorizontal: 12, paddingVertical: 6 }}>
              <Text style={{ color: DEEP, fontSize: 13, fontWeight: "700" }}>{interest}</Text>
            </View>
          ))}
        </View>
      </Card>
    </Page>
  );
}

function Timeline({ items, subtitleKey }) {
  return (
    <Page>
      {items.map((item, index) => (
        <View key={item.title} style={{ flexDirection: "row" }}>
          <View style={{ width: 26, alignItems: "center" }}>
            <View style={{ width: 14, height: 14, borderRadius: 7, backgroundColor: index ? "#FFFFFF" : EMERALD, borderWidth: 3, borderColor: EMERALD, marginTop: 20 }} />
            {index < items.length - 1 && <View style={{ flex: 1, width: 2, backgroundColor: LINE }} />}
          </View>
          <Card style={{ flex: 1, marginLeft: 8 }}>
            <View style={{ alignSelf: "flex-start", backgroundColor: PALE, borderRadius: 8, paddingHorizontal: 8, paddingVertical: 3, marginBottom: 8 }}>
              <Text style={{ color: EMERALD, fontSize: 12, fontWeight: "800" }}>{item.period}</Text>
            </View>
            <Text style={{ color: TEXT, fontSize: 16, fontWeight: "800" }}>{item.title}</Text>
            <Text style={{ color: MUTED, fontSize: 14, fontWeight: "600", marginTop: 2 }}>{item[subtitleKey]}</Text>
            <Text style={{ color: TEXT, fontSize: 14, lineHeight: 21, marginTop: 8 }}>{item.description}</Text>
          </Card>
        </View>
      ))}
    </Page>
  );
}

function EducationScreen() {
  return <Timeline items={PROFILE.education} subtitleKey="institution" />;
}

function ExperienceScreen() {
  return <Timeline items={PROFILE.experience} subtitleKey="company" />;
}

function SkillBar({ name, level }) {
  return (
    <View style={{ marginBottom: 12 }}>
      <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 6 }}>
        <Text style={{ color: TEXT, fontSize: 14, fontWeight: "700" }}>{name}</Text>
        <Text style={{ color: EMERALD, fontSize: 13, fontWeight: "800" }}>{level}%</Text>
      </View>
      <View style={{ height: 8, borderRadius: 4, backgroundColor: PALE, overflow: "hidden" }}>
        <View style={{ width: `${level}%`, height: "100%", borderRadius: 4, backgroundColor: EMERALD }} />
      </View>
    </View>
  );
}

function SkillsScreen() {
  return (
    <Page>
      {PROFILE.skills.map((group) => (
        <Card key={group.group}>
          <SectionTitle>{group.group}</SectionTitle>
          {group.items.map((skill) => (
            <SkillBar key={skill.name} {...skill} />
          ))}
        </Card>
      ))}
    </Page>
  );
}

function ProfileHeader() {
  const insets = useSafeAreaInsets();
  return (
    <View style={{ backgroundColor: DEEP, paddingTop: insets.top + 20, paddingBottom: 20, paddingHorizontal: 20, alignItems: "center" }}>
      <View style={{ padding: 3, borderRadius: 52, backgroundColor: "#34D399" }}>
        <Image source={{ uri: PROFILE.avatar }} accessibilityLabel={`Foto de ${PROFILE.name}`} style={{ width: 92, height: 92, borderRadius: 46, backgroundColor: "#065F46", borderWidth: 3, borderColor: DEEP }} />
      </View>
      <Text style={{ color: "#FFFFFF", fontSize: 24, fontWeight: "900", marginTop: 12 }}>{PROFILE.name}</Text>
      <Text style={{ color: "#A7F3D0", fontSize: 15, fontWeight: "600", marginTop: 4 }}>{PROFILE.role}</Text>
      <Text style={{ color: "#6EE7B7", fontSize: 13, marginTop: 4 }}>📍 {PROFILE.location}</Text>
    </View>
  );
}

const TAB_OPTIONS = {
  tabBarActiveTintColor: "#FFFFFF",
  tabBarInactiveTintColor: "#A7F3D0",
  tabBarStyle: { backgroundColor: DEEP, elevation: 0, shadowOpacity: 0, borderBottomWidth: 0 },
  tabBarIndicatorStyle: { backgroundColor: "#34D399", height: 3, borderRadius: 3 },
  tabBarLabelStyle: { fontSize: 12, fontWeight: "800", textTransform: "none" },
  tabBarItemStyle: { paddingHorizontal: 0 },
  tabBarPressColor: "rgba(52, 211, 153, 0.2)",
  sceneStyle: { backgroundColor: BG },
};

export default function App() {
  return (
    <SafeAreaProvider>
      <StatusBar style="light" />
      <View style={{ flex: 1, backgroundColor: BG }}>
        <ProfileHeader />
        <NavigationContainer>
          <Tab.Navigator screenOptions={TAB_OPTIONS}>
            <Tab.Screen name="Pessoal" component={PersonalScreen} />
            <Tab.Screen name="Formação" component={EducationScreen} />
            <Tab.Screen name="Experiência" component={ExperienceScreen} />
            <Tab.Screen name="Habilidades" component={SkillsScreen} />
          </Tab.Navigator>
        </NavigationContainer>
      </View>
    </SafeAreaProvider>
  );
}

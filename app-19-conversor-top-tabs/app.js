import { StatusBar } from "expo-status-bar";
import { NavigationContainer } from "@react-navigation/native";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { SafeAreaProvider, useSafeAreaInsets } from "react-native-safe-area-context";
import { Text, View } from "react-native";
import Converter from "./converter";
import { COLORS, RATES } from "./rates";

const Tab = createMaterialTopTabNavigator();

function Header() {
  const insets = useSafeAreaInsets();
  return (
    <View
      style={{
        backgroundColor: COLORS.dark,
        paddingTop: insets.top + 18,
        paddingBottom: 16,
        paddingHorizontal: 20,
      }}
    >
      <Text style={{ color: COLORS.amber, fontSize: 12, fontWeight: "800", letterSpacing: 2 }}>
        CÂMBIO DO DIA
      </Text>
      <Text style={{ color: "#FFFFFF", fontSize: 26, fontWeight: "900", marginTop: 4 }}>
        Conversor de Moedas
      </Text>
      <Text style={{ color: COLORS.sand, fontSize: 14, marginTop: 4 }}>
        Converta reais para dólar, euro e bitcoin
      </Text>
    </View>
  );
}

function Tabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: { backgroundColor: COLORS.dark, elevation: 0, shadowOpacity: 0 },
        tabBarIndicatorStyle: { backgroundColor: COLORS.amber, height: 4, borderRadius: 2 },
        tabBarActiveTintColor: COLORS.amber,
        tabBarInactiveTintColor: COLORS.sand,
        tabBarLabelStyle: { fontSize: 13, fontWeight: "800", textTransform: "none" },
        sceneStyle: { backgroundColor: COLORS.cream },
      }}
    >
      {RATES.map((rate) => (
        <Tab.Screen key={rate.code} name={rate.code} options={{ title: rate.tabLabel }}>
          {() => <Converter rate={rate} />}
        </Tab.Screen>
      ))}
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <StatusBar style="light" />
      <View style={{ flex: 1, backgroundColor: COLORS.cream }}>
        <Header />
        <NavigationContainer>
          <Tabs />
        </NavigationContainer>
      </View>
    </SafeAreaProvider>
  );
}

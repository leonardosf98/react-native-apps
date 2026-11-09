import Ionicons from "@expo/vector-icons/Ionicons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Converter from "./converter";
import { CURRENCIES } from "./currencies";

const Tab = createBottomTabNavigator();
const HEADER = "#022C22";

function screenFor(currency) {
  return function CurrencyScreen() {
    return <Converter currency={currency} />;
  };
}

const SCREENS = Object.values(CURRENCIES).map((currency) => ({
  currency,
  component: screenFor(currency),
}));

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer documentTitle={{ formatter: () => "Conversor de Moedas" }}>
        <StatusBar style="light" />
        <Tab.Navigator
          screenOptions={{
            headerStyle: { backgroundColor: HEADER },
            headerTintColor: "#FFFFFF",
            headerTitleStyle: { fontWeight: "900" },
            tabBarInactiveTintColor: "#94A3B8",
            tabBarLabelStyle: { fontSize: 12, fontWeight: "800" },
            tabBarStyle: { backgroundColor: "#FFFFFF", borderTopColor: "#E2E8F0" },
          }}
        >
          {SCREENS.map(({ currency, component }) => (
            <Tab.Screen
              key={currency.code}
              name={currency.code}
              component={component}
              options={{
                title: `Real → ${currency.tab}`,
                tabBarLabel: currency.tab,
                tabBarActiveTintColor: currency.accent,
                tabBarIcon: ({ color, size }) => <Ionicons name={currency.icon} size={size} color={color} />,
              }}
            />
          ))}
        </Tab.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

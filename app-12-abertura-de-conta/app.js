import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import FormularioScreen from "./src/formulario-screen";
import ConfirmacaoScreen from "./src/confirmacao-screen";
import { BG, DEEP } from "./src/theme";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <StatusBar style="light" />
        <Stack.Navigator
          screenOptions={{
            headerStyle: { backgroundColor: DEEP },
            headerTintColor: "#FFFFFF",
            headerTitleStyle: { fontWeight: "800" },
            contentStyle: { backgroundColor: BG },
            headerShadowVisible: false,
          }}
        >
          <Stack.Screen name="Formulario" component={FormularioScreen} options={{ title: "Abrir conta" }} />
          <Stack.Screen
            name="Confirmacao"
            component={ConfirmacaoScreen}
            options={{ title: "Conta aberta", headerBackTitle: "Voltar" }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

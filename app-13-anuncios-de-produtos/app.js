import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StatusBar } from "expo-status-bar";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { PRODUCTS, findProduct, formatPrice } from "./products";

const INK = "#1C1917";
const ACCENT = "#EA580C";
const ACCENT_SOFT = "#FFEDD5";
const CREAM = "#FAF7F2";
const CARD = "#FFFFFF";
const LINE = "#E7E0D6";
const TEXT = "#292524";
const MUTED = "#78716C";

const Stack = createNativeStackNavigator();

const theme = {
  ...DefaultTheme,
  colors: { ...DefaultTheme.colors, background: CREAM, primary: ACCENT, card: INK, text: "#FFFFFF", border: INK },
};

function Page({ children }) {
  return (
    <ScrollView style={{ flex: 1, backgroundColor: CREAM }} contentContainerStyle={{ padding: 20, paddingBottom: 40 }}>
      <View style={{ width: "100%", maxWidth: 560, alignSelf: "center" }}>{children}</View>
    </ScrollView>
  );
}

function ProductCard({ product, onPress }) {
  return (
    <View
      style={{
        backgroundColor: CARD,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: LINE,
        marginBottom: 20,
        overflow: "hidden",
        shadowColor: INK,
        shadowOpacity: 0.08,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 4 },
        elevation: 3,
      }}
    >
      <Image source={{ uri: product.image }} resizeMode="contain" style={{ width: "100%", aspectRatio: 3 / 2, backgroundColor: "#F5F0E8" }} />
      <View style={{ padding: 16 }}>
        <Text style={{ color: TEXT, fontSize: 18, fontWeight: "800", marginBottom: 14 }}>{product.title}</Text>
        <TouchableOpacity
          onPress={onPress}
          activeOpacity={0.85}
          accessibilityRole="button"
          style={{ backgroundColor: ACCENT, borderRadius: 14, paddingVertical: 14, alignItems: "center" }}
        >
          <Text style={{ color: "#FFFFFF", fontSize: 16, fontWeight: "800" }}>Ver detalhes</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function ListScreen({ navigation }) {
  return (
    <Page>
      <View style={{ backgroundColor: INK, borderRadius: 22, padding: 22, marginBottom: 24 }}>
        <Text style={{ color: ACCENT, fontSize: 13, fontWeight: "800", letterSpacing: 2, marginBottom: 6 }}>CLASSIFICADOS</Text>
        <Text style={{ color: "#FFFFFF", fontSize: 26, fontWeight: "900", marginBottom: 6 }}>Anúncios em destaque</Text>
        <Text style={{ color: "#D6D3D1", fontSize: 15 }}>{PRODUCTS.length} produtos à venda perto de você</Text>
      </View>
      {PRODUCTS.map((product) => (
        <ProductCard key={product.id} product={product} onPress={() => navigation.navigate("Detalhes", { id: product.id })} />
      ))}
    </Page>
  );
}

function InfoRow({ icon, label, value }) {
  return (
    <View style={{ flexDirection: "row", alignItems: "center", paddingVertical: 12, borderTopWidth: 1, borderTopColor: LINE }}>
      <Text style={{ fontSize: 20, width: 36 }}>{icon}</Text>
      <View style={{ flex: 1 }}>
        <Text style={{ color: MUTED, fontSize: 12, fontWeight: "700", textTransform: "uppercase", letterSpacing: 1 }}>{label}</Text>
        <Text style={{ color: TEXT, fontSize: 16, fontWeight: "600", marginTop: 2 }}>{value}</Text>
      </View>
    </View>
  );
}

function DetailScreen({ route, navigation }) {
  const product = findProduct(route.params?.id);

  if (!product) {
    return (
      <Page>
        <Text style={{ color: TEXT, fontSize: 18, fontWeight: "700", textAlign: "center", marginVertical: 24 }}>Anúncio não encontrado.</Text>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ backgroundColor: ACCENT, borderRadius: 14, paddingVertical: 14, alignItems: "center" }}>
          <Text style={{ color: "#FFFFFF", fontSize: 16, fontWeight: "800" }}>Voltar</Text>
        </TouchableOpacity>
      </Page>
    );
  }

  return (
    <Page>
      <View style={{ backgroundColor: CARD, borderRadius: 20, borderWidth: 1, borderColor: LINE, overflow: "hidden" }}>
        <Image source={{ uri: product.image }} resizeMode="contain" style={{ width: "100%", aspectRatio: 1, backgroundColor: "#F5F0E8" }} />
        <View style={{ padding: 20 }}>
          <View style={{ alignSelf: "flex-start", backgroundColor: ACCENT_SOFT, borderRadius: 999, paddingHorizontal: 12, paddingVertical: 5, marginBottom: 12 }}>
            <Text style={{ color: ACCENT, fontSize: 12, fontWeight: "800" }}>{product.category}</Text>
          </View>
          <Text style={{ color: TEXT, fontSize: 22, fontWeight: "900", marginBottom: 8 }}>{product.title}</Text>
          <Text style={{ color: ACCENT, fontSize: 28, fontWeight: "900", marginBottom: 6 }}>{formatPrice(product.price)}</Text>
          <Text style={{ color: MUTED, fontSize: 13, marginBottom: 18 }}>Publicado {product.postedAt}</Text>

          <Text style={{ color: TEXT, fontSize: 16, fontWeight: "800", marginBottom: 6 }}>Descrição</Text>
          <Text style={{ color: TEXT, fontSize: 15, lineHeight: 23, marginBottom: 18 }}>{product.description}</Text>

          <InfoRow icon="✨" label="Condição" value={product.condition} />
          <InfoRow icon="👤" label="Vendedor" value={product.seller} />
          <InfoRow icon="📍" label="Localização" value={product.city} />
        </View>
      </View>
    </Page>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer theme={theme}>
        <StatusBar style="light" />
        <Stack.Navigator
          screenOptions={{
            headerStyle: { backgroundColor: INK },
            headerTintColor: "#FFFFFF",
            headerTitleStyle: { fontWeight: "800" },
            contentStyle: { backgroundColor: CREAM },
          }}
        >
          <Stack.Screen name="Anuncios" component={ListScreen} options={{ title: "Anúncios" }} />
          <Stack.Screen name="Detalhes" component={DetailScreen} options={{ title: "Detalhes do produto" }} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

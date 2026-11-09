import { StatusBar } from "expo-status-bar";
import { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Image, Modal, Pressable, ScrollView, Text, View } from "react-native";

const API_URL = "https://sujeitoprogramador.com/r-api/?api=filmes";
const BANNER_RATIO = 711 / 291;

const BG = "#0B0B12";
const CARD = "#16161F";
const LINE = "#262633";
const ACCENT = "#F5B300";
const TEXT = "#F4F4F7";
const MUTED = "#9A9AB0";
const DANGER = "#F87171";

async function fetchMovies() {
  const response = await fetch(API_URL);
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  const data = JSON.parse(await response.text());
  if (!Array.isArray(data)) throw new Error("Formato inesperado");
  return data;
}

function Banner({ uri, radius }) {
  const [failed, setFailed] = useState(false);
  return (
    <View style={{ width: "100%", aspectRatio: BANNER_RATIO, backgroundColor: "#1F1F2B", borderRadius: radius, overflow: "hidden", alignItems: "center", justifyContent: "center" }}>
      {failed ? (
        <Text style={{ fontSize: 36 }}>🎬</Text>
      ) : (
        <Image source={{ uri }} onError={() => setFailed(true)} resizeMode="cover" style={{ width: "100%", height: "100%" }} />
      )}
    </View>
  );
}

function MovieCard({ movie, onPress }) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`Ver detalhes de ${movie.nome}`}
      style={({ pressed }) => ({
        backgroundColor: CARD,
        borderColor: pressed ? ACCENT : LINE,
        borderWidth: 1,
        borderRadius: 18,
        marginBottom: 16,
        overflow: "hidden",
        transform: [{ scale: pressed ? 0.985 : 1 }],
      })}
    >
      <Banner uri={movie.foto} radius={0} />
      <View style={{ flexDirection: "row", alignItems: "center", paddingHorizontal: 16, paddingVertical: 14 }}>
        <View style={{ flex: 1, paddingRight: 12 }}>
          <Text numberOfLines={1} style={{ color: TEXT, fontSize: 17, fontWeight: "800" }}>{movie.nome}</Text>
          <Text numberOfLines={1} style={{ color: MUTED, fontSize: 13, marginTop: 4 }}>{movie.sinopse}</Text>
        </View>
        <View style={{ backgroundColor: ACCENT, borderRadius: 999, paddingHorizontal: 12, paddingVertical: 6 }}>
          <Text style={{ color: BG, fontSize: 12, fontWeight: "900" }}>DETALHES</Text>
        </View>
      </View>
    </Pressable>
  );
}

function CenterState({ children }) {
  return <View style={{ flex: 1, alignItems: "center", justifyContent: "center", padding: 32 }}>{children}</View>;
}

function DetailsModal({ movie, onClose }) {
  return (
    <Modal visible={!!movie} animationType="slide" transparent onRequestClose={onClose}>
      <View style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.75)", justifyContent: "flex-end", alignItems: "center" }}>
        <Pressable onPress={onClose} style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }} accessibilityLabel="Fechar" />
        {movie && (
          <View style={{ width: "100%", maxWidth: 720, maxHeight: "88%", backgroundColor: CARD, borderTopLeftRadius: 26, borderTopRightRadius: 26, borderColor: LINE, borderWidth: 1, overflow: "hidden" }}>
            <Banner uri={movie.foto} radius={0} />
            <ScrollView contentContainerStyle={{ padding: 22, paddingBottom: 28 }}>
              <Text style={{ color: ACCENT, fontSize: 12, fontWeight: "900", letterSpacing: 2 }}>SINOPSE</Text>
              <Text style={{ color: TEXT, fontSize: 24, fontWeight: "900", marginTop: 6 }}>{movie.nome}</Text>
              <Text style={{ color: "#D4D4DE", fontSize: 16, lineHeight: 25, marginTop: 14 }}>{movie.sinopse}</Text>
              <Pressable
                onPress={onClose}
                accessibilityRole="button"
                style={({ pressed }) => ({ marginTop: 24, backgroundColor: pressed ? "#D99E00" : ACCENT, borderRadius: 14, paddingVertical: 15, alignItems: "center" })}
              >
                <Text style={{ color: BG, fontSize: 16, fontWeight: "900" }}>Voltar para a lista</Text>
              </Pressable>
            </ScrollView>
          </View>
        )}
      </View>
    </Modal>
  );
}

export default function App() {
  const [movies, setMovies] = useState([]);
  const [status, setStatus] = useState("loading");
  const [selected, setSelected] = useState(null);

  const load = useCallback(async () => {
    setStatus("loading");
    try {
      setMovies(await fetchMovies());
      setStatus("ready");
    } catch {
      setStatus("error");
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <View style={{ flex: 1, backgroundColor: BG, alignItems: "center" }}>
      <StatusBar style="light" />
      <View style={{ flex: 1, width: "100%", maxWidth: 720 }}>
        <View style={{ paddingTop: 52, paddingHorizontal: 20, paddingBottom: 16 }}>
          <Text style={{ color: ACCENT, fontSize: 12, fontWeight: "900", letterSpacing: 3 }}>EM CARTAZ</Text>
          <Text style={{ color: TEXT, fontSize: 30, fontWeight: "900", marginTop: 4 }}>🍿 App de Filmes</Text>
          <Text style={{ color: MUTED, fontSize: 14, marginTop: 6 }}>
            {status === "ready" ? `${movies.length} filmes · toque para ver a sinopse` : "Os destaques da semana"}
          </Text>
        </View>

        {status === "loading" && (
          <CenterState>
            <ActivityIndicator size="large" color={ACCENT} />
            <Text style={{ color: MUTED, fontSize: 15, marginTop: 14 }}>Carregando filmes...</Text>
          </CenterState>
        )}

        {status === "error" && (
          <CenterState>
            <Text style={{ fontSize: 44 }}>📡</Text>
            <Text style={{ color: TEXT, fontSize: 19, fontWeight: "800", marginTop: 12 }}>Não foi possível carregar</Text>
            <Text style={{ color: DANGER, fontSize: 14, marginTop: 6, textAlign: "center" }}>Verifique sua conexão e tente de novo.</Text>
            <Pressable
              onPress={load}
              accessibilityRole="button"
              style={({ pressed }) => ({ marginTop: 20, backgroundColor: pressed ? "#D99E00" : ACCENT, borderRadius: 14, paddingVertical: 14, paddingHorizontal: 28 })}
            >
              <Text style={{ color: BG, fontSize: 16, fontWeight: "900" }}>Tentar novamente</Text>
            </Pressable>
          </CenterState>
        )}

        {status === "ready" && (
          <FlatList
            data={movies}
            keyExtractor={(item) => String(item.id)}
            renderItem={({ item }) => <MovieCard movie={item} onPress={() => setSelected(item)} />}
            contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 32 }}
            ListEmptyComponent={<Text style={{ color: MUTED, textAlign: "center", marginTop: 40 }}>Nenhum filme encontrado.</Text>}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
      <DetailsModal movie={selected} onClose={() => setSelected(null)} />
    </View>
  );
}

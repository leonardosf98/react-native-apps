export interface AppInfo {
  slug: string;
  title: string;
  tag: string;
  description: string;
  emoji: string;
  gradient: string;
  repo?: string;
}

export const apps: AppInfo[] = [
  {
    slug: "meu-perfil-profissional",
    title: "Meu Perfil Profissional",
    tag: "Expo SDK 54",
    description:
      "App de perfil profissional com informações de contato, habilidades e experiência.",
    emoji: "👤",
    gradient: "linear-gradient(135deg, #667eea, #764ba2)",
    repo: "https://github.com/leonardosf98/react-native-apps/tree/main/app-01-meu-perfil-profissional",
  },
  {
    slug: "loja-pulse",
    title: "Loja Pulse",
    tag: "Expo SDK 54",
    description:
      "Simulação de e-commerce com catálogo de produtos, carrinho e mock backend.",
    emoji: "🛒",
    gradient: "linear-gradient(135deg, #f093fb, #f5576c)",
    repo: "https://github.com/leonardosf98/react-native-apps/tree/main/app-02-loja-pulse",
  },
  {
    slug: "calculadora",
    title: "Calculadora",
    tag: "Expo SDK 57",
    description:
      "Calculadora completa com operações básicas e interface responsiva.",
    emoji: "🧮",
    gradient: "linear-gradient(135deg, #4facfe, #00f2fe)",
    repo: "https://github.com/leonardosf98/react-native-apps/tree/main/app-03-calculadora",
  },
  {
    slug: "alcool-ou-gasolina",
    title: "Álcool ou Gasolina",
    tag: "Expo SDK 57",
    description:
      "Calculadora que mostra qual combustível é mais vantajoso com base nos preços.",
    emoji: "⛽",
    gradient: "linear-gradient(135deg, #43e97b, #38f9d7)",
    repo: "https://github.com/leonardosf98/react-native-apps/tree/main/app-04-alcool-ou-gasolina",
  },
  {
    slug: "calculo-de-imc",
    title: "Cálculo de IMC",
    tag: "Expo SDK 57",
    description:
      "Calculadora de Índice de Massa Corporal com classificação e dicas.",
    emoji: "💪",
    gradient: "linear-gradient(135deg, #fa709a, #fee140)",
    repo: "https://github.com/leonardosf98/react-native-apps/tree/main/app-05-calculo-de-imc",
  },
  {
    slug: "jogo-numero-aleatorio",
    title: "Jogo Número Aleatório",
    tag: "Expo SDK 57",
    description:
      "Jogo interativo onde o jogador precisa adivinhar um número aleatório.",
    emoji: "🎲",
    gradient: "linear-gradient(135deg, #a18cd1, #fbc2eb)",
    repo: "https://github.com/leonardosf98/react-native-apps/tree/main/app-06-jogo-numero-aleatorio",
  },
];

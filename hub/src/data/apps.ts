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
    tag: "Expo SDK 58",
    description:
      "Calculadora que mostra qual combustível é mais vantajoso com base nos preços.",
    emoji: "⛽",
    gradient: "linear-gradient(135deg, #43e97b, #38f9d7)",
    repo: "https://github.com/leonardosf98/react-native-apps/tree/main/app-04-alcool-ou-gasolina",
  },
  {
    slug: "calculo-de-imc",
    title: "Cálculo de IMC",
    tag: "Expo SDK 58",
    description:
      "Calculadora de Índice de Massa Corporal com classificação e dicas.",
    emoji: "💪",
    gradient: "linear-gradient(135deg, #fa709a, #fee140)",
    repo: "https://github.com/leonardosf98/react-native-apps/tree/main/app-05-calculo-de-imc",
  },
  {
    slug: "jogo-numero-aleatorio",
    title: "Jogo Número Aleatório",
    tag: "Expo SDK 58",
    description:
      "Jogo interativo onde o jogador precisa adivinhar um número aleatório.",
    emoji: "🎲",
    gradient: "linear-gradient(135deg, #a18cd1, #fbc2eb)",
    repo: "https://github.com/leonardosf98/react-native-apps/tree/main/app-06-jogo-numero-aleatorio",
  },
  ...[
    ["conversor-de-moedas", "app-11-conversor-de-moedas", "Conversor de Moedas", "💱", "Converta reais para Dólar, Euro, Libra ou Bitcoin com cotações de referência fixas.", "#0f9b8e, #f5af19"],
    ["abertura-de-conta", "app-12-abertura-de-conta", "Abertura de Conta", "🏦", "Formulário de abertura de conta em 2 telas com Stack Navigator, validação e resumo da conta.", "#11998e, #38ef7d"],
    ["anuncios-de-produtos", "app-13-anuncios-de-produtos", "Anúncios de Produtos", "🛍️", "Classificados em ScrollView com tela de detalhes do produto via Stack Navigator.", "#f12711, #f5af19"],
    ["vagas-ti-scrollview", "app-14-vagas-ti-scrollview", "Vagas de TI (ScrollView)", "💼", "Vagas de TI em ScrollView; “Saiba mais” abre os detalhes da vaga no Stack Navigator.", "#134e5e, #71b280"],
    ["vagas-ti-flatlist", "app-15-vagas-ti-flatlist", "Vagas de TI (FlatList)", "🧑‍💻", "Vagas de TI em FlatList; “Saiba mais” abre os detalhes da vaga no Stack Navigator.", "#4e54c8, #8f94fb"],
    ["perfil-bottom-tabs", "app-16-perfil-bottom-tabs", "Meu Perfil (Bottom Tabs)", "👤", "Perfil dividido em abas inferiores com ícones: Pessoal, Formação, Experiência e Projetos.", "#5f2c82, #49a09d"],
    ["perfil-top-tabs", "app-17-perfil-top-tabs", "Meu Perfil (Top Tabs)", "🗂️", "Perfil com avatar no topo e abas deslizantes de Pessoal, Formação, Experiência e Habilidades.", "#076585, #56ab2f"],
    ["conversor-bottom-tabs", "app-18-conversor-bottom-tabs", "Conversor (Bottom Tabs)", "💵", "Real para Dólar, Euro e Bitcoin em três abas inferiores com cotações fixas.", "#1d976c, #93f9b9"],
    ["conversor-top-tabs", "app-19-conversor-top-tabs", "Conversor (Top Tabs)", "💶", "Real para Dólar, Euro e Bitcoin em três abas no topo com cotações fixas.", "#e65c00, #f9d423"],
    ["frase-preferencias", "app-20-frase-preferencias", "Frase com Preferências", "💬", "Personalize uma frase com tema, fonte, cor e alinhamento, tudo salvo com AsyncStorage.", "#8e2de2, #4a00e0"],
    ["lista-de-tarefas", "app-21-lista-de-tarefas", "Lista de Tarefas", "✅", "Adicione, conclua, filtre e limpe tarefas salvas no aparelho com AsyncStorage.", "#5433ff, #20bdff"],
    ["lista-de-compras", "app-22-lista-de-compras", "Lista de Compras", "🛒", "Lista de mercado com quantidades, preços e total estimado, salva com AsyncStorage.", "#56ab2f, #a8e063"],
    ["consulta-cep", "app-23-consulta-cep", "Consulta de CEP", "📮", "Digite um CEP e veja o endereço completo pela API do ViaCEP.", "#c79081, #dfa579"],
    ["perfil-de-devs", "app-24-perfil-de-devs", "Perfil de Devs", "🐙", "Busque um dev pelo login e veja o perfil público dele na API do GitHub.", "#232526, #6e48aa"],
    ["filmes", "app-25-filmes", "App de Filmes", "🍿", "Filmes vindos de uma API, com capa e sinopse a um toque.", "#141e30, #f7b733"],
    ["conversor-moedas-api", "app-26-conversor-moedas-api", "Conversor de Moedas (API)", "📈", "Converte Real em Dólar, Euro ou Bitcoin com a cotação atual da AwesomeAPI.", "#0b8793, #d4af37"],
    ["cadastro-de-tarefas", "app-27-cadastro-de-tarefas", "Cadastro de Tarefas", "📝", "Inclua, edite, conclua e exclua tarefas salvas numa API REST.", "#614385, #516395"],
  ].map(([slug, folder, title, emoji, description, colors]) => ({
    slug,
    title,
    tag: "Expo SDK 58",
    description,
    emoji,
    gradient: `linear-gradient(135deg, ${colors})`,
    repo: `https://github.com/leonardosf98/react-native-apps/tree/main/${folder}`,
  })),
];

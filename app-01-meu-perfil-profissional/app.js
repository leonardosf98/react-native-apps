import { StatusBar } from "expo-status-bar";
import {
  Image,
  Linking,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const PROFILE = {
  nome: "Leonardo Souza",
  titulo: "Full Stack Engineer",
  subtitulo: "Software Architect | AWS Certified Developer Associate",
  localizacao: "Santos, SP",
  linkedin: "https://www.linkedin.com/in/leonardo-sf98/",
  github: "https://github.com/leonardosf98",
  foto: "https://github.com/leonardosf98.png",
  sobre:
    "Desenvolvedor com experiência em aplicações escaláveis de ponta a ponta. Especializado em arquiteturas cloud-native, integração de IA e modernização de sistemas, com foco em backend, TDD e código limpo.",
};

const FORMACAO = [
  {
    instituicao: "Instituto Politécnico de Bragança",
    curso: "Intercâmbio acadêmico (FATEC)",
    periodo: "2025 – Atual",
    descricao:
      "Disciplinas em inglês na área de tecnologia e desenvolvimento de software.",
  },
  {
    instituicao: "FATEC",
    curso: "Sistemas para Internet",
    periodo: "Em andamento",
    descricao:
      "Monitor de Lógica de Programação. Base sólida em desenvolvimento web e backend.",
  },
];

const EXPERIENCIAS = [
  {
    empresa: "Almap",
    cargo: "Software Engineer",
    periodo: "2025 – Atual",
    stacks: "Next.js, Python, FastAPI, GCP, Docker",
    descricao:
      "Desenvolvimento de soluções com IA integrando Python (FastAPI) e serviços de nuvem para otimizar processos de marketing.",
  },
  {
    empresa: "Distrito",
    cargo: "Software Engineer",
    periodo: "2024 – 2025",
    stacks: "Next.js, Python, GCP, GitHub Actions",
    descricao:
      "Infraestrutura cloud segura para hospedar aplicações de IA, com CI/CD automatizado e escalabilidade horizontal.",
  },
  {
    empresa: "Intelipost",
    cargo: "Software Engineer",
    periodo: "2023 – 2024",
    stacks: "Vue.js, Java, AWS, Jenkins",
    descricao:
      "Manutenção e evolução de sistemas backend e frontend em ambiente de logística e e-commerce.",
  },
  {
    empresa: "FCamara",
    cargo: "Software Engineer",
    periodo: "2022 – 2023",
    stacks: "Python (FastAPI), React, Svelte, Azure",
    descricao:
      "Desenvolvimento de APIs RESTful e camada de busca inteligente com integração a serviços de IA.",
  },
];

const PROJETOS = [
  {
    nome: "AgrOraculum",
    tecnologias: "Vue 3, TypeScript, FastAPI, PostgreSQL",
    descricao:
      "Plataforma de gestão agrícola com análise de dados e relatórios.",
    link: "https://agroraculum-frontend.vercel.app/",
  },
  {
    nome: "AWS Lex & Python",
    tecnologias: "Python, Vue.js, AWS",
    descricao: "Chatbot inteligente com AWS Lex integrado a backend Python.",
    link: "https://github.com/leonardosf98/lex_python",
  },
  {
    nome: "Wordle",
    tecnologias: "JavaScript, HTML, CSS",
    descricao: "Clone do jogo Wordle com interface responsiva.",
    link: "https://wordle-leonardosf.vercel.app/",
  },
  {
    nome: "Sudoku",
    tecnologias: "React",
    descricao: "Jogo de Sudoku interativo com validação em tempo real.",
    link: "https://sudoku-leonardosf98.vercel.app/",
  },
];

function Section({ title, children }) {
  return (
    <View style={{ marginBottom: 28 }}>
      <Text
        style={{
          fontSize: 20,
          fontWeight: "700",
          color: "#0f172a",
          marginBottom: 14,
          borderLeftWidth: 4,
          borderLeftColor: "#2563eb",
          paddingLeft: 12,
        }}
      >
        {title}
      </Text>
      {children}
    </View>
  );
}

function Card({ children, style }) {
  return (
    <View
      style={{
        backgroundColor: "#ffffff",
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: "#e2e8f0",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 6,
        elevation: 2,
        ...style,
      }}
    >
      {children}
    </View>
  );
}

function LinkButton({ label, url }) {
  return (
    <TouchableOpacity
      onPress={() => Linking.openURL(url)}
      style={{
        backgroundColor: "#2563eb",
        paddingVertical: 10,
        paddingHorizontal: 18,
        borderRadius: 8,
        marginRight: 10,
        marginTop: 8,
      }}
    >
      <Text style={{ color: "#ffffff", fontWeight: "600", fontSize: 14 }}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

export default function App() {
  return (
    <View style={{ flex: 1, backgroundColor: "#f1f5f9" }}>
      <StatusBar style="light" />

      <View
        style={{
          backgroundColor: "#0f172a",
          paddingTop: 56,
          paddingBottom: 32,
          paddingHorizontal: 24,
          alignItems: "center",
        }}
      >
        <Image
          source={{ uri: PROFILE.foto }}
          style={{
            width: 120,
            height: 120,
            borderRadius: 60,
            borderWidth: 4,
            borderColor: "#2563eb",
            marginBottom: 16,
          }}
        />
        <Text
          style={{
            fontSize: 26,
            fontWeight: "800",
            color: "#ffffff",
            textAlign: "center",
          }}
        >
          {PROFILE.nome}
        </Text>
        <Text
          style={{
            fontSize: 16,
            fontWeight: "600",
            color: "#93c5fd",
            marginTop: 6,
            textAlign: "center",
          }}
        >
          {PROFILE.titulo}
        </Text>
        <Text
          style={{
            fontSize: 13,
            color: "#94a3b8",
            marginTop: 4,
            textAlign: "center",
          }}
        >
          {PROFILE.subtitulo}
        </Text>
        <Text style={{ fontSize: 13, color: "#cbd5e1", marginTop: 8 }}>
          {PROFILE.localizacao}
        </Text>
      </View>

      <ScrollView
        contentContainerStyle={{ padding: 20, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        <Section title="Dados Pessoais">
          <Card>
            <Text
              style={{
                fontSize: 14,
                color: "#475569",
                lineHeight: 22,
                marginBottom: 12,
              }}
            >
              {PROFILE.sobre}
            </Text>
            <Text style={{ fontSize: 14, color: "#334155", marginBottom: 4 }}>
              <Text style={{ fontWeight: "700" }}>Certificação: </Text>
              AWS Certified Developer – Associate
            </Text>
            <Text style={{ fontSize: 14, color: "#334155", marginBottom: 4 }}>
              <Text style={{ fontWeight: "700" }}>Stack principal: </Text>
              Java, Python, Node.js, Vue.js, React
            </Text>
            <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
              <LinkButton label="LinkedIn" url={PROFILE.linkedin} />
              <LinkButton label="GitHub" url={PROFILE.github} />
            </View>
          </Card>
        </Section>

        <Section title="Formação">
          {FORMACAO.map((item) => (
            <Card key={item.instituicao}>
              <Text
                style={{ fontSize: 16, fontWeight: "700", color: "#0f172a" }}
              >
                {item.curso}
              </Text>
              <Text
                style={{
                  fontSize: 14,
                  color: "#2563eb",
                  fontWeight: "600",
                  marginTop: 4,
                }}
              >
                {item.instituicao}
              </Text>
              <Text style={{ fontSize: 12, color: "#64748b", marginTop: 4 }}>
                {item.periodo}
              </Text>
              <Text
                style={{
                  fontSize: 14,
                  color: "#475569",
                  marginTop: 8,
                  lineHeight: 20,
                }}
              >
                {item.descricao}
              </Text>
            </Card>
          ))}
        </Section>

        <Section title="Experiência">
          {EXPERIENCIAS.map((item) => (
            <Card key={item.empresa}>
              <Text
                style={{ fontSize: 16, fontWeight: "700", color: "#0f172a" }}
              >
                {item.cargo}
              </Text>
              <Text
                style={{
                  fontSize: 14,
                  color: "#2563eb",
                  fontWeight: "600",
                  marginTop: 4,
                }}
              >
                {item.empresa}
              </Text>
              <Text style={{ fontSize: 12, color: "#64748b", marginTop: 4 }}>
                {item.periodo}
              </Text>
              <Text
                style={{
                  fontSize: 12,
                  color: "#7c3aed",
                  fontWeight: "600",
                  marginTop: 6,
                  fontStyle: "italic",
                }}
              >
                {item.stacks}
              </Text>
              <Text
                style={{
                  fontSize: 14,
                  color: "#475569",
                  marginTop: 8,
                  lineHeight: 20,
                }}
              >
                {item.descricao}
              </Text>
            </Card>
          ))}
        </Section>

        <Section title="Projetos">
          {PROJETOS.map((item) => (
            <Card key={item.nome}>
              <Text
                style={{ fontSize: 16, fontWeight: "700", color: "#0f172a" }}
              >
                {item.nome}
              </Text>
              <Text
                style={{
                  fontSize: 12,
                  color: "#7c3aed",
                  fontWeight: "600",
                  marginTop: 4,
                }}
              >
                {item.tecnologias}
              </Text>
              <Text
                style={{
                  fontSize: 14,
                  color: "#475569",
                  marginTop: 8,
                  lineHeight: 20,
                }}
              >
                {item.descricao}
              </Text>
              <LinkButton label="Ver projeto" url={item.link} />
            </Card>
          ))}
        </Section>
      </ScrollView>
    </View>
  );
}

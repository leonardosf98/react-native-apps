export const PROFILE = {
  name: "Leonardo Souza",
  role: "Desenvolvedor Full Stack",
  avatar: "https://github.com/leonardosf98.png",
  location: "São Paulo, SP",
  personal: {
    about:
      "Desenvolvedor apaixonado por construir produtos digitais simples, rápidos e acessíveis. Gosto de transformar problemas complexos em interfaces claras e de compartilhar o que aprendo com a comunidade.",
    details: [
      { icon: "📍", label: "Localização", value: "São Paulo, SP" },
      { icon: "🌐", label: "Site", value: "leonardosouza.dev", url: "https://leonardosouza.dev" },
      { icon: "🐙", label: "GitHub", value: "@leonardosf98", url: "https://github.com/leonardosf98" },
      { icon: "🗣️", label: "Idiomas", value: "Português (nativo), Inglês (avançado)" },
    ],
    interests: ["Open source", "Café especial", "Ciclismo", "Fotografia", "Jogos indie"],
  },
  education: [
    {
      title: "Bacharelado em Ciência da Computação",
      institution: "Universidade Estadual",
      period: "2016 — 2020",
      description: "TCC sobre otimização de rotas com algoritmos genéticos.",
    },
    {
      title: "Pós-graduação em Engenharia de Software",
      institution: "Instituto de Tecnologia",
      period: "2021 — 2022",
      description: "Foco em arquitetura de sistemas distribuídos e qualidade de software.",
    },
    {
      title: "Desenvolvimento Mobile com React Native",
      institution: "Curso livre",
      period: "2024",
      description: "Apps multiplataforma com Expo, navegação e persistência local.",
    },
  ],
  experience: [
    {
      title: "Desenvolvedor Full Stack Sênior",
      company: "Empresa de Logística",
      period: "2023 — atual",
      description: "Integrações com transportadoras, APIs em Node.js e painéis em React para acompanhamento de entregas.",
    },
    {
      title: "Desenvolvedor Full Stack Pleno",
      company: "Startup de Varejo",
      period: "2021 — 2023",
      description: "Construção do e-commerce e do app mobile, com foco em performance e checkout.",
    },
    {
      title: "Desenvolvedor Júnior",
      company: "Agência Digital",
      period: "2019 — 2021",
      description: "Sites institucionais, landing pages e manutenção de sistemas internos.",
    },
  ],
  skills: [
    { group: "Front-end", items: [{ name: "React", level: 90 }, { name: "React Native", level: 80 }, { name: "TypeScript", level: 85 }] },
    { group: "Back-end", items: [{ name: "Node.js", level: 85 }, { name: "Python", level: 70 }, { name: "PostgreSQL", level: 75 }] },
    { group: "Ferramentas", items: [{ name: "Git", level: 90 }, { name: "Docker", level: 70 }, { name: "CI/CD", level: 65 }] },
  ],
};

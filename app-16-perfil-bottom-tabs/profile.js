export const PROFILE_EDITAVEL = {
  pessoal: {
    nome: "Leonardo Souza",
    cargo: "Desenvolvedor de Software",
    avatar: "https://github.com/leonardosf98.png",
    bio: "Desenvolvedor apaixonado por construir produtos úteis, com foco em back-end, integrações e apps mobile com React Native. Gosto de código simples, bem testado e de aprender algo novo toda semana.",
    localizacao: "Brasil",
    contatos: [
      { tipo: "site", icone: "globe-outline", rotulo: "leonardosouza.dev", url: "https://leonardosouza.dev" },
      { tipo: "github", icone: "logo-github", rotulo: "github.com/leonardosf98", url: "https://github.com/leonardosf98" },
      { tipo: "email", icone: "mail-outline", rotulo: "contato@leonardosouza.dev", url: "mailto:contato@leonardosouza.dev" },
    ],
  },
  formacao: [
    {
      curso: "Análise e Desenvolvimento de Sistemas",
      instituicao: "Faculdade de Tecnologia",
      periodo: "2023 — 2026",
      descricao: "Disciplinas de engenharia de software, banco de dados, desenvolvimento web e mobile.",
    },
    {
      curso: "Desenvolvimento Mobile com React Native",
      instituicao: "Curso livre",
      periodo: "2025",
      descricao: "Expo, navegação, consumo de APIs e publicação de apps.",
    },
    {
      curso: "Técnico em Informática",
      instituicao: "Escola Técnica",
      periodo: "2019 — 2021",
      descricao: "Lógica de programação, redes e fundamentos de desenvolvimento.",
    },
  ],
  experiencia: [
    {
      cargo: "Desenvolvedor de Software",
      empresa: "Empresa de tecnologia em logística",
      periodo: "2024 — atual",
      atividades: [
        "Desenvolvimento de APIs e integrações com transportadoras",
        "Monitoramento e observabilidade de serviços em produção",
        "Revisão de código e melhoria contínua de processos",
      ],
    },
    {
      cargo: "Desenvolvedor Júnior",
      empresa: "Startup de software",
      periodo: "2022 — 2024",
      atividades: [
        "Criação de telas e componentes em React",
        "Manutenção de serviços em Node.js",
        "Escrita de testes automatizados",
      ],
    },
  ],
  projetos: [
    {
      nome: "React Native Apps",
      descricao: "Coleção de apps Expo com hub web unificado para exercícios de aula.",
      tags: ["React Native", "Expo", "Vite"],
    },
    {
      nome: "leonardosouza.dev",
      descricao: "Site pessoal com portfólio, artigos e contato.",
      tags: ["React", "Web"],
    },
    {
      nome: "Memória para agentes",
      descricao: "Ferramenta para guardar conhecimento durável entre sessões de desenvolvimento.",
      tags: ["Node.js", "MCP"],
    },
  ],
  habilidades: [
    { grupo: "Linguagens", itens: ["JavaScript", "TypeScript", "Python", "SQL"] },
    { grupo: "Front-end e mobile", itens: ["React", "React Native", "Expo", "HTML/CSS"] },
    { grupo: "Back-end", itens: ["Node.js", "APIs REST", "PostgreSQL", "Mensageria"] },
    { grupo: "Ferramentas", itens: ["Git", "GitHub", "Docker", "Observabilidade"] },
  ],
};

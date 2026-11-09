const CDN = "https://cdn.dummyjson.com/product-images";

export const PRODUCTS = [
  {
    id: "macbook",
    title: "MacBook Pro 14\" Cinza-espacial",
    price: 8900,
    image: `${CDN}/laptops/apple-macbook-pro-14-inch-space-grey/1.webp`,
    category: "Informática",
    condition: "Usado — excelente estado",
    seller: "Marina Couto",
    city: "São Paulo, SP",
    postedAt: "há 2 dias",
    description:
      "Chip M1 Pro, 16 GB de RAM e SSD de 512 GB. Bateria com 92% de saúde, sem riscos na tela. Acompanha carregador original e caixa.",
  },
  {
    id: "jordan",
    title: "Tênis Nike Air Jordan 1 Vermelho e Preto",
    price: 1150,
    image: `${CDN}/mens-shoes/nike-air-jordan-1-red-and-black/1.webp`,
    category: "Moda",
    condition: "Novo — na caixa",
    seller: "Rafael Lima",
    city: "Rio de Janeiro, RJ",
    postedAt: "há 5 horas",
    description:
      "Tamanho 41, nunca usado. Comprado na loja oficial, com nota fiscal. Envio pelos Correios ou retirada em Botafogo.",
  },
  {
    id: "airpods",
    title: "Fone AirPods Max Prata",
    price: 3200,
    image: `${CDN}/mobile-accessories/apple-airpods-max-silver/1.webp`,
    category: "Áudio",
    condition: "Usado — bom estado",
    seller: "Juliana Prado",
    city: "Belo Horizonte, MG",
    postedAt: "há 1 semana",
    description:
      "Cancelamento de ruído funcionando perfeitamente. Almofadas trocadas recentemente. Vem com a Smart Case e cabo USB-C.",
  },
  {
    id: "kawasaki",
    title: "Moto Kawasaki Z800 2016",
    price: 38500,
    image: `${CDN}/motorcycle/kawasaki-z800/1.webp`,
    category: "Veículos",
    condition: "Usado — revisada",
    seller: "Carlos Mendes",
    city: "Curitiba, PR",
    postedAt: "há 3 dias",
    description:
      "18 mil km rodados, revisões em concessionária, pneus novos. Documentação em dia e IPVA pago. Aceito proposta.",
  },
  {
    id: "ipad",
    title: "iPad Mini 2021 Estelar 64 GB",
    price: 2700,
    image: `${CDN}/tablets/ipad-mini-2021-starlight/1.webp`,
    category: "Tablets",
    condition: "Seminovo",
    seller: "Beatriz Nogueira",
    city: "Porto Alegre, RS",
    postedAt: "ontem",
    description:
      "Usado poucas vezes, sempre com película e capa. Wi-Fi, 64 GB. Ideal para leitura e anotações. Acompanha carregador.",
  },
  {
    id: "abajur",
    title: "Abajur de Mesa Decorativo",
    price: 180,
    image: `${CDN}/home-decoration/table-lamp/1.webp`,
    category: "Casa e decoração",
    condition: "Usado — como novo",
    seller: "Fernanda Alves",
    city: "Florianópolis, SC",
    postedAt: "há 4 dias",
    description:
      "Base em cerâmica e cúpula de tecido. Luz amarelada aconchegante, bivolt. Só estou vendendo porque mudei a decoração.",
  },
  {
    id: "raquete",
    title: "Raquete de Tênis Profissional",
    price: 450,
    image: `${CDN}/sports-accessories/tennis-racket/1.webp`,
    category: "Esportes",
    condition: "Usado — bom estado",
    seller: "Gustavo Rocha",
    city: "Recife, PE",
    postedAt: "há 6 dias",
    description:
      "Peso 300 g, empunhadura L3. Encordoamento refeito há um mês. Acompanha raqueteira e três bolas.",
  },
];

export function findProduct(id) {
  return PRODUCTS.find((product) => product.id === id);
}

export function formatPrice(value) {
  return `R$ ${String(value).replace(/\B(?=(\d{3})+(?!\d))/g, ".")},00`;
}

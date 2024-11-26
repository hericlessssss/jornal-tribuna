import { NewsItem, NewsCategory } from '../types/news';

export const categories: NewsCategory[] = [
  { id: 1, name: 'Cidade', slug: 'cidade' },
  { id: 2, name: 'Economia', slug: 'economia' },
  { id: 3, name: 'Cultura', slug: 'cultura' },
  { id: 4, name: 'Esporte', slug: 'esporte' },
  { id: 5, name: 'Política', slug: 'politica' },
];

export const newsData: NewsItem[] = [
  {
    id: 1,
    title: 'Unaí recebe investimentos para modernização do parque industrial',
    excerpt: 'Nova fase de desenvolvimento econômico promete geração de empregos e crescimento sustentável para a região.',
    content: `A cidade de Unaí está prestes a entrar em uma nova era de desenvolvimento industrial com o anúncio de importantes investimentos para a modernização de seu parque industrial. O projeto, que conta com recursos públicos e privados, promete transformar a região em um dos principais polos industriais do noroeste mineiro.

    De acordo com a Secretaria de Desenvolvimento Econômico, serão investidos mais de R$ 50 milhões na infraestrutura do parque industrial, incluindo melhorias nas vias de acesso, sistema de energia e tratamento de resíduos. A expectativa é que as obras comecem no próximo mês e sejam concluídas em um prazo de 18 meses.

    O prefeito destacou que o investimento vai gerar cerca de 2.000 empregos diretos e indiretos nos próximos anos, fortalecendo a economia local e atraindo novas empresas para a região. "Este é um momento histórico para nossa cidade", afirmou.`,
    image: 'https://www.blsistemas.com.br/wp-content/uploads/2017/04/investir-na-modernizacao-do-parque-industrial-e-a-saida-para-crise.jpg',
    author: 'Maria Silva',
    date: '15 de Março de 2024',
    category: 'Economia'
  },
  {
    id: 2,
    title: 'Festival Cultural celebra tradições do Noroeste Mineiro',
    excerpt: 'Evento reúne artistas locais e apresentações que destacam a rica cultura da região.',
    content: `O Festival Cultural do Noroeste Mineiro chega à sua 10ª edição com uma programação diversificada que celebra as tradições e a identidade cultural da região. O evento, que acontece entre os dias 20 e 25 de março, promete reunir milhares de visitantes no centro histórico de Unaí.

    A programação inclui apresentações de música regional, dança, teatro e exposições de artesanato local. Um dos destaques é a Feira de Sabores, que reúne pratos típicos da culinária mineira preparados por cozinheiros locais.

    "Este festival é uma oportunidade única de valorizar e preservar nossas tradições", destaca João Santos, coordenador do evento. A entrada é gratuita para todas as atrações, e a expectativa é receber mais de 15 mil visitantes durante os seis dias de festa.`,
    image: 'https://images.unsplash.com/photo-1533900298318-6b8da08a523e?q=80&w=1200',
    author: 'Pedro Oliveira',
    date: '14 de Março de 2024',
    category: 'Cultura'
  },
  {
    id: 3,
    title: 'Produção agrícola bate recorde na safra 2024',
    excerpt: 'Agricultores da região celebram resultados expressivos na produção de grãos.',
    content: `A safra 2024 superou todas as expectativas e estabeleceu um novo recorde de produção agrícola em Unaí e região. Segundo dados da Secretaria de Agricultura, a produção de grãos cresceu 15% em comparação com o ano anterior, impulsionada principalmente pelo cultivo de soja e milho.

    O sucesso da safra é atribuído à combinação de condições climáticas favoráveis, investimento em tecnologia e boas práticas agrícolas. "Os agricultores da região têm investido constantemente em inovação e sustentabilidade", explica Ana Costa, engenheira agrônoma.

    A excelente produtividade tem reflexos diretos na economia local, gerando mais empregos e aumentando a renda dos produtores rurais. A expectativa para a próxima safra continua otimista, com previsão de novos investimentos no setor.`,
    image: 'https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?q=80&w=1200',
    author: 'Carlos Mendes',
    date: '13 de Março de 2024',
    category: 'Economia'
  }
  
];
# Jornal Tribuna Web Application

Este é o repositório oficial do site do Jornal Tribuna, um jornal digital localizado em Unaí-MG.

## Tecnologias Utilizadas

- **Frontend**:
  - React + TypeScript
  - Vite (Build tool e dev server)
  - Tailwind CSS (Estilização)
  - React Router (Navegação)
  - Zustand (Gerenciamento de estado)
  - React Hook Form (Formulários)
  - React Hot Toast (Notificações)
  - PDF.js (Visualização de PDFs)
  - Swiper (Slider/carousel)

- **Backend/Infraestrutura**:
  - Supabase (Backend as a Service)
    - Banco de dados PostgreSQL
    - Autenticação
    - Storage para arquivos
  - Netlify (Hospedagem e Deploy)

## Configuração do Projeto

### Pré-requisitos

- Node.js 18 ou superior
- NPM ou Yarn
- Conta no Supabase
- Conta no Netlify

### Configuração do Supabase

1. Crie uma conta no [Supabase](https://supabase.com)
2. Crie um novo projeto
3. No SQL Editor, execute os seguintes comandos para criar as tabelas:

\`\`\`sql
-- Criar tabela de usuários
create table public.users (
  id uuid default uuid_generate_v4() primary key,
  email text unique not null,
  password_hash text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Criar tabela de edições PDF
create table public.pdf_editions (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  date date not null,
  description text,
  pdf_url text not null,
  cover_image_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Criar tabela de notícias
create table public.news (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  content text not null,
  cover_image_url text not null,
  highlighted boolean default false,
  homepage_highlight boolean default false,
  category text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Criar tabela de imagens das notícias
create table public.news_images (
  id uuid default uuid_generate_v4() primary key,
  news_id uuid references public.news(id) on delete cascade,
  image_url text not null,
  "order" integer not null,
  unique(news_id, "order")
);

-- Criar tabela de anúncios
create table public.ads (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  image_url text not null,
  redirect_url text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Criar políticas de segurança (RLS)
alter table public.users enable row level security;
alter table public.pdf_editions enable row level security;
alter table public.news enable row level security;
alter table public.news_images enable row level security;
alter table public.ads enable row level security;

-- Políticas para usuários não autenticados (leitura pública)
create policy "Permitir leitura pública de edições" on public.pdf_editions
  for select using (true);

create policy "Permitir leitura pública de notícias" on public.news
  for select using (true);

create policy "Permitir leitura pública de imagens de notícias" on public.news_images
  for select using (true);

create policy "Permitir leitura pública de anúncios" on public.ads
  for select using (true);

-- Políticas para usuários autenticados (administradores)
create policy "Permitir todas as operações para admins" on public.pdf_editions
  for all using (auth.role() = 'authenticated');

create policy "Permitir todas as operações para admins" on public.news
  for all using (auth.role() = 'authenticated');

create policy "Permitir todas as operações para admins" on public.news_images
  for all using (auth.role() = 'authenticated');

create policy "Permitir todas as operações para admins" on public.ads
  for all using (auth.role() = 'authenticated');
\`\`\`

4. No Storage, crie os seguintes buckets:
   - `pdf-editions`: para armazenar os arquivos PDF
   - `news-images`: para armazenar imagens das notícias
   - `ads`: para armazenar imagens dos anúncios

5. Configure as políticas de acesso dos buckets:
   - Leitura pública
   - Escrita apenas para usuários autenticados

### Configuração Local

1. Clone o repositório:
\`\`\`bash
git clone https://github.com/seu-usuario/jornal-tribuna.git
cd jornal-tribuna
\`\`\`

2. Instale as dependências:
\`\`\`bash
npm install
\`\`\`

3. Crie um arquivo `.env` baseado no `.env.example`:
\`\`\`bash
cp .env.example .env
\`\`\`

4. Preencha as variáveis de ambiente no arquivo `.env`:
\`\`\`
VITE_SUPABASE_URL=sua-url-do-supabase
VITE_SUPABASE_ANON_KEY=sua-chave-anonima-do-supabase
\`\`\`

5. Inicie o servidor de desenvolvimento:
\`\`\`bash
npm run dev
\`\`\`

6. Acesse http://localhost:4000 no navegador

### Deploy no Netlify

1. Faça login no [Netlify](https://netlify.com)

2. Clique em "New site from Git"

3. Conecte seu repositório

4. Configure as variáveis de ambiente:
   - VITE_SUPABASE_URL
   - VITE_SUPABASE_ANON_KEY

5. Configure as opções de build:
   - Build command: \`npm run build\`
   - Publish directory: \`dist\`

6. Clique em "Deploy site"

## Uso do Sistema

### Acesso Administrativo

1. Acesse `/login` no site
2. Use as credenciais de administrador:
   - Email: admin@jornaltribuna.com.br
   - Senha: (definida no painel do Supabase)

### Gerenciamento de Edições PDF

1. No painel administrativo, acesse "Gerenciar Edições"
2. Para adicionar uma nova edição:
   - Clique em "Nova Edição"
   - Preencha os dados
   - Faça upload do arquivo PDF
   - A miniatura será gerada automaticamente

### Gerenciamento de Notícias

1. No painel administrativo, acesse "Gerenciar Notícias"
2. Para adicionar uma nova notícia:
   - Clique em "Nova Notícia"
   - Preencha título, conteúdo e categoria
   - Faça upload da imagem de capa
   - Adicione imagens adicionais se necessário
   - Marque as opções de destaque se desejar

### Gerenciamento de Anúncios

1. No painel administrativo, acesse "Gerenciar Anúncios"
2. Para adicionar um novo anúncio:
   - Clique em "Novo Anúncio"
   - Faça upload da imagem
   - Adicione o título e URL de redirecionamento

## Contribuindo

1. Fork o repositório
2. Crie uma branch para sua feature (\`git checkout -b feature/AmazingFeature\`)
3. Commit suas mudanças (\`git commit -m 'Add some AmazingFeature'\`)
4. Push para a branch (\`git push origin feature/AmazingFeature\`)
5. Abra um Pull Request

## Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.
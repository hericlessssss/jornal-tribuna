# Jornal Tribuna Web Application

Este é o repositório oficial do site do Jornal Tribuna, um jornal digital localizado em Unaí-MG.

## Tecnologias Utilizadas

- **React**: Framework JavaScript para construção da interface
- **TypeScript**: Superset JavaScript para tipagem estática
- **Vite**: Build tool e dev server
- **Tailwind CSS**: Framework CSS para estilização
- **React Router**: Navegação entre páginas
- **@react-pdf-viewer**: Visualizador de PDF integrado
- **react-h5-audio-player**: Player de áudio para a rádio online
- **Lucide React**: Biblioteca de ícones
- **Swiper**: Slider/carousel para notícias em destaque

## Funcionalidades

### Visualizador de PDF
- Visualização integrada de PDFs no navegador
- Interface intuitiva com zoom e navegação
- Download direto dos arquivos
- Miniaturas das primeiras páginas

### Rádio Online
- Player minimalista e responsivo
- Controles de play/pause e volume
- Minimizável para melhor experiência do usuário

## Como Rodar Localmente

1. Clone o repositório:
\`\`\`bash
git clone https://github.com/seu-usuario/jornal-tribuna.git
cd jornal-tribuna
\`\`\`

2. Instale as dependências:
\`\`\`bash
npm install
\`\`\`

3. Inicie o servidor de desenvolvimento:
\`\`\`bash
npm run dev
\`\`\`

4. Acesse http://localhost:4000 no navegador

## Deploy

1. Construa o projeto:
\`\`\`bash
npm run build
\`\`\`

2. Os arquivos de produção estarão na pasta \`dist\`

3. Deploy para Netlify:
   - Conecte seu repositório ao Netlify
   - Configure o comando de build como \`npm run build\`
   - Configure o diretório de publicação como \`dist\`

## Gerenciamento de PDFs

### Upload de PDFs
1. Acesse o painel administrativo em /admin
2. Na aba "Gerenciar Edições"
3. Use o formulário de upload para adicionar novos PDFs
4. Os arquivos são armazenados no servidor e referenciados no banco de dados

### Estrutura de Dados
\`\`\`typescript
interface Edition {
  id: number;
  title: string;
  date: string;
  cover: string;
  pdfUrl: string;
}
\`\`\`

## Rádio Online

### Configuração
1. Acesse o painel administrativo
2. Configure a URL do stream da rádio
3. O player estará disponível em todas as páginas

### Formato Suportado
- Streams no formato MP3
- Compatível com servidores Icecast/Shoutcast
- URLs HTTPS para maior segurança

## Contribuindo

1. Fork o repositório
2. Crie uma branch para sua feature (\`git checkout -b feature/AmazingFeature\`)
3. Commit suas mudanças (\`git commit -m 'Add some AmazingFeature'\`)
4. Push para a branch (\`git push origin feature/AmazingFeature\`)
5. Abra um Pull Request

## Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.
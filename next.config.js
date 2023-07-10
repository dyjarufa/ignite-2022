/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  pageExtensions: ['page.tsx', 'api.ts', 'api.tsx'], //* informar ao Next.js quais as extensões de arquivos queremos que ele transforme em rotas/páginas da aplicação.
}

/*
  ? A partir de agora, todo arquivo que a gente quer que seja uma página, precisa terminar com page.tsx, inclusive o _app e o _document.
*/

module.exports = nextConfig

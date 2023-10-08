/*
?  [...] esse colchete no arquivo significa que eu posso colocar qualquer informação apos a rota auth/, ou seja,
? posse ter múltiplos parâmetros enviados para o next.auth
* ex: http://localhost:3000/api/auth/qualquerCoisa/outra/maisuma
*/

import { PrismaAdapter } from '@/lib/auth/prisma-adapter'
import NextAuth, { NextAuthOptions } from 'next-auth'
import GoogleProvider, { GoogleProfile } from 'next-auth/providers/google'

import type { NextApiRequest, NextApiResponse } from 'next'

export function buildNextAuthOptions(
  req: NextApiRequest,
  res: NextApiResponse
): NextAuthOptions {
  return {
    adapter: PrismaAdapter(req, res), // * neste momento o NextAuth sabe como persistir as informações do usuário no BD

    providers: [
      GoogleProvider({
        clientId: process.env.GOOGLE_CLIENT_ID ?? '',
        clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? '',
        httpOptions: {
          timeout: 40000,
        },
        //* escopos
        authorization: {
          params: {
            scope:
              'https://www.googleapis.com/auth/calendar https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email',
          },
        },
        // * profile: serve para mapear os compos internos do meu app com os dados retornados do google
        profile(profile: GoogleProfile) {
          return {
            id: profile.sub, // ? sub é basicamente um termo que identifica um usuário dentro do JWT
            name: profile.name,
            username: '', // * como o username é algo que vem da minha aplicação, nao preciso do Google nesse momento
            email: profile.email,
            avatar_url: profile.picture,
          }
        },
      }),
    ],
    // ? callbacks sao funções chamadas em momentos de um fluxo de autenticação
    callbacks: {
      // ? SignIn e um tipo de função que sera chamada no momento que o usuario logar no meu app
      async signIn({ account }) {
        if (
          !account?.scope?.includes('https://www.googleapis.com/auth/calendar')
        ) {
          return '/register/connect-calendar/?error=permissions' // ?aqui como o retorno e uma string o next auth considera que houve um erro (redireciona para pagina de auth. do calendar)
        }
        return true // ? o método signIn precisa ter um retorno true ou false. Caso a condição seja atendida retornarei true
      },

      /* 
      Temos uma questão de tipagem. Estou inserindo uma informação ('user') no retorno da função, mas internamento o Next.Auth não sabe o que é esse 'user'
      Preciso adicionar essa tipagem em next-auth.d.ts
     */
      async session({ session, user }) {
        return {
          ...session,
          user,
        }
      },
    },
  }
}

//* De acordo com a documentação essa é a forma de acessar o req e res dentro do arquivo [...nextauth]
// ? https://next-auth.js.org/configuration/initialization#api-routes-pages

export default async function auth(req: NextApiRequest, res: NextApiResponse) {
  // Do whatever you want here, before the request is passed down to `NextAuth`
  return await NextAuth(req, res, buildNextAuthOptions(req, res))
}

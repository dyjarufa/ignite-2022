/*
?  [...] esse colchete no arquivo significa que eu posso colocar qualquer informação apos a rota auth/, ou seja,
? posse ter múltiplos parâmetros enviados 
* ex: http://localhost:3000/api/auth/qualquerCoisa/outra/maisuma
*/

import { PrismaAdapter } from '@/lib/auth/prisma-adapter'
import NextAuth, { NextAuthOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(), // * neste momento o NextAuth sabe como persistir as informações do usuário no BD

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
  },
}

export default NextAuth(authOptions)

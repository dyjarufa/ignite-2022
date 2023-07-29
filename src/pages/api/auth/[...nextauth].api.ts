/*
?  [...] esse colchete no arquivo significa que eu posso colocar qualquer informação apos a rota auth/, ou seja,
? posse ter mútilos parâmetros enviados 
* ex: http://localhost:3000/api/auth/qualquerCoisa/outra/maisuma
*/

import NextAuth, { NextAuthOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? '',
    }),
  ],
}

export default NextAuth(authOptions)

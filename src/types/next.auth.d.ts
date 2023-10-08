// * Arquivo de definição de tipos - serve para extender tipagem de bibliotecas

import NextAuth from 'next-auth/next' // ? estou importando o next-auth para ele entender que vou extender uma interface existente

declare module 'next-auth' {
  interface User {
    id: string
    name: string
    email: string
    username: string
    avatar_url: string
  }

  interface Session {
    user: User
  }
}

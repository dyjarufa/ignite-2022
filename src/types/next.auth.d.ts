// * Arquivo de definição de tipos - serve para sobrescrever tipagem de bibliotecas

import NextAuth from 'next-auth/next' // ? estou importando o next-auth para ele entender que vou sobrescrever uma interface existente

declare module 'next-auth' {
  interface User {
    id: string
    name: string
    email: string
    username: string
    avatar_url: string
  }
}

import { PrismaClient } from '@prisma/client'

export const prisma = new PrismaClient({
  //* PrismaClient instancia que irá ler o .env e assim saber como conectar ao BD
  log: ['query'], // ? mostrar no log todas as operações no BD
})

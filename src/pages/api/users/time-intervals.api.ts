/* Arquivo responsável por receber o formulário do time-intervals e salvar essas info dentro do BD da tabela User */

import { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth'
import { z } from 'zod'

import { prisma } from '@/lib/prisma'

import { buildNextAuthOptions } from '../auth/[...nextauth].api'

const timeIntervalsBodySchema = z.object({
  intervals: z.array(
    z.object({
      weekDay: z.number(),
      startTimeInMinutes: z.number(),
      endTimeInMinutes: z.number(),
    })
  ),
})

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).end()
  }

  /*
    Obter informações do usuário logada no Next.Auth
    ? para pegar informações do usuario do lado do server side:
    ? https://next-auth.js.org/configuration/nextjs#unstable_getserversession
  */
  const session = await getServerSession(
    req,
    res,
    buildNextAuthOptions(req, res) //* passa o req e res para que ele consiga obter informações da sessão
  )

  // console.log(session)

  if (!session) {
    return res.status(401).end()
  }

  // * parse retorna os dados tipados e faz uma validação e dispara um erro caso o bady não retorne o formato do schema
  const { intervals } = timeIntervalsBodySchema.parse(req.body)

  /* existe uma limitação do sql lite a qual não permite múltiplas inserções do BD
    então vou usar a estratégia de Promise.all para ele fazer inserção simultânea
   */
  await Promise.all(
    intervals?.map((interval) => {
      return prisma.userTimeInterval.create({
        data: {
          week_day: interval.weekDay,
          time_start_in_minutes: interval.startTimeInMinutes,
          time_end_in_minutes: interval.endTimeInMinutes,
          user_id: session.user?.id,
        },
      })
    })
  )

  return res.status(201).end()
}

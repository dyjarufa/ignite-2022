```ts
import { NextApiRequest, NextApiResponse } from 'next'
import { z } from 'zod' //* zod adotado para usar o mínimo de parse para as informações vindas do "request"
import dayjs from 'dayjs'

import { prisma } from '@/lib/prisma'

export async function handle(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POSt') {
    return res.status(405).end()
  }

  const username = String(req.query.username)

  const user = await prisma.user.findUnique({
    where: {
      username,
    },
  })

  if (!user) {
    return res.status(400).json({ message: 'User not exist.' })
  }

  // Aqui não será feita uma validação pois ela ja foi feita no front-end, aqui será realizada uma dupla verificação e um parse nos dados

  const createSchedulingBody = z.object({
    name: z.string(),
    email: z.string(),
    observations: z.string(),
    date: z.string().datetime(), // datetime => converte o farmato de string em um objeto Date do javascript
  })

  const { name, email, observations, date } = createSchedulingBody.parse(
    req.body
  )

  // não vou depender que o front-end me envie, então eu forço que toda hora não  esteja quebrada mas esteja no início da hora
  // É mais fácil eu validar que no BD exista uma hora agendada naquele horário
  const schedulingDate = dayjs(date).startOf('hour')

  // Refazer novamente a validação de agendamentos

  /* verificar se a data já passou */
  if (schedulingDate.isBefore(new Date())) {
    return res.status(400).json({ message: 'Date is in the past' })
  }

  /* verificar se nao existe um scheduling no mesmo horário */
  const conflictingScheduling = await prisma.scheduling.findFirst({
    where: {
      user_Id: user.id,
      date: schedulingDate.toDate(),
    },
  })

  if (conflictingScheduling) {
    return res
      .status(400)
      .json({ message: 'There is another scheduling at the same time' })
  }

  await prisma.scheduling.create({
    data: {
      name,
      email,
      observations,
      date: schedulingDate.toDate(),
      user_Id: user.id,
    },
  })

  return res.status(201).end()
}
```

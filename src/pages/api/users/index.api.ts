// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { setCookie } from 'nookies' //* nookies é uma forma de trabalhar com cookies no next

import { prisma } from '@/lib/prisma'

export default async function handler(
  req: NextApiRequest,
  // eslint-disable-next-line prettier/prettier
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(485).end() // ? 485 method not allowed
  }
  const { name, username } = req.body

  const userExists = await prisma.user.findUnique({
    where: {
      username,
    },
  })

  if (userExists) {
    return res.status(400).json({
      message: 'User already exists',
    })
  }

  const user = await prisma.user.create({
    data: {
      name,
      username,
    },
  })

  setCookie({ res }, '@ignitecall:userid', user.id, {
    maxAge: 60 * 60 * 24 * 7, // ? 7 dias
    path: '/', // ? paths disponíveis para esse cookie na aplicação
  })

  return res.status(201).json(user)
}

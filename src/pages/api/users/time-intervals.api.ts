/* Arquivo responsável por receber o formulário do time-intervals e salvar essas info dentro do BD da tabela User*/

import { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth'
import { buildNextAuthOptions } from '../auth/[...nextauth].api'

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
    buildNextAuthOptions(req, res) //* passa o req e res para ele consiga obter informações da sessão
  )

  console.log(session)

  //* formato json() que precisa ser retornado
  return res.json({
    session,
  })
}

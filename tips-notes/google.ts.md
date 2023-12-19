```ts
import { google } from 'googleapis'
import dayjs from 'dayjs'

import { prisma } from './prisma'

export async function getGoogleOauthToken(userId: string) {
  const account = await prisma.account.findFirstOrThrow({
    where: {
      user_Id: userId,
      provider: 'google',
    },
  })

  const auth = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET
  )

  auth.setCredentials({
    access_token: account.access_token,
    expiry_date: account.expires_at,
    refresh_token: account.refresh_token,
  })

  if (!account.expires_at) {
    return auth
  }

  /*
    O valor de account.expires_at é multiplicado por 1000, pois os tempos são armazenados em segundos, mas JavaScript(dayjs) precisa manipular em milissegundos.
    Então, essa linha cria um objeto de data e hora que representa o momento em que o token do usuário irá expirar.
  */
  const isTokenExpired = dayjs(account.expires_at * 1000).isBefore(new Date()) // ?

  if (isTokenExpired) {
    const { credentials } = await auth.refreshAccessToken()
    const {
      access_token,
      expiry_date,
      id_token,
      refresh_token,
      scope,
      token_type,
    } = credentials

    await prisma.account.update({
      where: {
        id: userId,
      },
      data: {
        access_token,

        /* 
          Math.floor é uma função do JavaScript que arredonda um número para baixo, 
          para o menor inteiro maior ou igual a ele. Dividindo expiry_date por 1000 e arredondando para baixo, 
          obtemos a quantidade de segundos desde 1º de janeiro de 1970, que é o tempo padrão representado por JavaScript.

          No BD precisamos salver em segundos e não em milissegundos, desa forma ocupando menos espaço.
        */
        expires_at: expiry_date ? Math.floor(expiry_date / 1000) : null,
        id_token,
        refresh_token,
        scope,
        token_type,
      },
    })
  }
}
```

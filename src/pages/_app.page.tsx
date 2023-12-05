import type { AppProps } from 'next/app'
import { SessionProvider } from 'next-auth/react'

import { globalStyles } from '@/styles/global'

import '../lib/dayjs'
import { QueryClientProvider } from '@tanstack/react-query'

import { queryClient } from '@/lib/react.query'

globalStyles() // ? posso executar a função de forma direta, fora do componente, assim ele irá carregar uma única vez, caso eu usasse dentro do componente ele seria carregado em cada renderização

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <SessionProvider session={session}>
        <Component {...pageProps} />
      </SessionProvider>
    </QueryClientProvider>
  )
}

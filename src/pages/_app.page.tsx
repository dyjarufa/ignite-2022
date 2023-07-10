import type { AppProps } from 'next/app'

import { globalStyles } from '@/styles/global'

globalStyles() // ? posso executar a função de forma direta, fora do componente, assim ele irá carregar uma única vez, caso eu usasse dentro do componente ele seria carregado em cada renderização

export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}

---
id: gwx3xfl3
title: Buscar sessão do usuario
file_version: 1.1.3
app_version: 1.18.21
---

getServerSideProps é uma função disponível no Next.js que permite buscar dados para uma página durante o tempo de requisiçao ou seja, cada vez que um usuário acessa a página.<br/>
<br/>1\. \*\*Exportação da Função \`getServerSideProps\`\*\*:<br/>
\- \`export const getServerSideProps: GetServerSideProps\` declara que você está exportando uma função \`getServerSideProps\` que está tipada com \`GetServerSideProps\`. Isso é uma indicação de TypeScript que assegura que a função retornará um objeto do tipo esperado por um método de busca de servidor.<br/>
<br/>2\. \*\*Função Assíncrona\*\*:<br/>
\- \`async ({ req, res }) => { ... }\` define \`getServerSideProps\` como uma função assíncrona que recebe um objeto contendo os objetos \`req\` (request) e \`res\` (response) do servidor HTTP.<br/>
<br/>3\. \*\*Obtendo a Sessão do Usuário\*\*:<br/>
\- \`const session = await getServerSession(req, res, buildNextAuthOptions(req, res))\` é onde você obtém informações da sessão do usuário. A função \`getServerSession\` é chamada passando os objetos \`req\` e \`res\`, juntamente com opções específicas geradas pela função \`buildNextAuthOptions\`.<br/>
4\. \*\*Passando o Req e Res\*\*:<br/>
<br/>\- O \`req\` e \`res\` são passados para que \`getServerSession\` possa extrair informações necessárias para autenticar a sessão ou realizar outras operações baseadas na requisição ou resposta.<br/>
<br/>5\. \*\*Retorno de Props\*\*:<br/>
\- A função retorna um objeto com uma propriedade \`props\`, que contém a sessão obtida. Essas \`props\` serão passadas ao componente da página, permitindo que você acesse a sessão diretamente dentro do componente e renderize conteúdo baseado na sessão do usuário.<br/>
<br/>Diferentemente de \`getStaticProps\`, que busca dados no momento da construção e serve a mesma página estática até a próxima revalidação, \`getServerSideProps\` é executada em cada requisição, garantindo que a página tenha os dados mais recentes e seja personalizada para cada usuário. Isso é ideal para páginas que precisam de dados dinâmicos e específicos do usuário que não podem ser pré-renderizados.<br/>
<br/>Por exemplo, se você tiver uma aplicação que mostra informações do perfil do usuário que devem estar sempre atualizadas ou que são específicas para cada usuário, usar \`getServerSideProps\` seria a escolha correta. No entanto, isso vem com um custo de desempenho, pois o servidor precisa gerar a página para cada requisição em vez de servir uma página estática do cache.

<!-- NOTE-swimm-snippet: the lines below link your snippet to Swimm -->

### 📄 src/pages/register/update-profile/index.page.tsx

```tsx
89     export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
90       const session = await getServerSession(
91         req,
92         res,
93         buildNextAuthOptions(req, res) //* passa o req e res para que ele consiga obter informações da sessão
94       )
95
96       return {
97         props: {
98           session,
99         },
100      }
101    }
```

<br/>

useSession do next-auth/react é usado para acessar a sessão do usuário.<br/>
<br/>useRouter do next/router é usado para navegar programaticamente para outra rota após a atualização do perfil.

<!-- NOTE-swimm-snippet: the lines below link your snippet to Swimm -->

### 📄 src/pages/register/update-profile/index.page.tsx

```tsx
40       const session = useSession()
41       const router = useRouter()
42
```

<br/>

Esta função assíncrona é chamada quando o formulário é submetido. Ela envia os dados atualizados (bio) para o servidor usando a função api.put e depois redireciona o usuário para uma rota específica baseada no nome de usuário da sessão.

<!-- NOTE-swimm-snippet: the lines below link your snippet to Swimm -->

### 📄 src/pages/register/update-profile/index.page.tsx

```tsx
45       async function handleUpdateProfile(data: UpdateProfileData) {
46         await api.put('/users/profile', {
47           bio: data.bio,
48         })
49
50         await router.push(`/schedule/${session.data?.user.username}`)
51       }
```

<br/>

```javascript
export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const session = await getServerSession(
    req,
    res,
    buildNextAuthOptions(req, res) //* passa o req e res para que ele consiga obter informações da sessão
  )

  return {
    props: {
      session,
    },
  }
}export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const session = await getServerSession(
    req,
    res,
    buildNextAuthOptions(req, res) //* passa o req e res para que ele consiga obter informações da sessão
  )

//A sessão é então passada como prop para o componente da página, permitindo que você acesse dados da sessão diretamente no componente.
  return {
    props: {
      session,
    },
  }
}
```

### <br/>

💡Funcionamento do SessionProvider:

```javascript
import type { AppProps } from 'next/app'
import { SessionProvider } from 'next-auth/react'

import { globalStyles } from '@/styles/global'

globalStyles() // ? posso executar a função de forma direta, fora do componente, assim ele irá carregar uma única vez, caso eu usasse dentro do componente ele seria carregado em cada renderização

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  return (
    <SessionProvider session={session}>
      <Component {...pageProps} />
    </SessionProvider>
  )
}
```

1.  **SessionProvider**:

    - O `SessionProvider` é um componente de contexto do `next-auth/react` que você está usando para envolver sua aplicação no arquivo `_app.tsx`. Isso é feito para fornecer o estado da sessão em toda a aplicação, permitindo que componentes em qualquer lugar da árvore de componentes possam acessar os dados da sessão usando o hook `useSession`.

2.  **Global Styles**:

    - Você está aplicando estilos globais invocando `globalStyles()` fora de qualquer componente. Isso é uma prática comum para garantir que os estilos globais sejam aplicados uma única vez quando a aplicação é carregada, ao invés de reaplicá-los em cada renderização de componente, o que seria ineficiente.

3.  **Propagação de** `pageProps`:

    - No componente `App`, os `pageProps` que são passados para cada página incluem a sessão (`session`) e quaisquer outras props adicionais. Ao extrair `session` de `pageProps`, você pode passá-la diretamente para o `SessionProvider`, o que é necessário para inicializar o estado da sessão no cliente.

4.  **Comportamento de** `useSession` **e** `getServerSideProps`:

    - O hook `useSession` tentará acessar os dados da sessão do lado do cliente. Se a página for gerada estaticamente ou através do SSR sem `getServerSideProps`, a sessão pode inicialmente ser `undefined` até que a requisição do lado do cliente para a API de sessão do NextAuth.js seja concluída.

    - Quando você usa `getServerSideProps`, você pode garantir que os dados da sessão sejam buscados no lado do servidor e passados para o componente de página imediatamente, eliminando a necessidade de uma requisição do lado do cliente para obter esses dados. Isso pode melhorar a performance e a experiência do usuário, especialmente em conexões lentas ou durante o carregamento inicial da página.

Portanto, o uso de `getServerSideProps` para buscar e passar a sessão diretamente para a página está de acordo com as práticas recomendadas para assegurar que os dados da sessão estejam disponíveis no lado do cliente sem atraso. E a documentação do NextAuth.js recomenda essa abordagem para casos onde você precisa de uma renderização do lado do servidor (SSR) para proteger rotas ou pré-carregar dados da sessão.<br/>
<br/>

<br/>

This file was generated by Swimm. [Click here to view it in the app](https://app.swimm.io/repos/Z2l0aHViJTNBJTNBaWduaXRlLTIwMjIlM0ElM0FkeWphcnVmYQ==/docs/gwx3xfl3).

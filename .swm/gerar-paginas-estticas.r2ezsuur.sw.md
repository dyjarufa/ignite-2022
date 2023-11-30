---
id: r2ezsuur
title: Gerar paginas estáticas
file_version: 1.1.3
app_version: 1.18.21
---

aqui seria um exemplo de página estática a ser utilizada, por isso será adotada a abordagem do GetStaticProps<br/>
<br/>as páginas estatática não \*\*possuem\*\* **REQ** e **RES** pois elas não são criadas em tempo de execução, elas são criadas no momento da build. Por isso será usado o "params"<br/>
<br/>correção de erro GetStaticPaths is required : como o \[username\] dessa rota não é fixo e sim parametrizado ou dinâmico(precisamos criar uma página estática por usuário), // preciso informar obrigatoriamente ao Next o método GetStaticPath<br/>
<br/>GetStaticPath sinaliza quais são usuários(parâmetros) quero que gera páginas estáticas no momento desde o primeiro momento da build da aplicação

<!-- NOTE-swimm-snippet: the lines below link your snippet to Swimm -->

### 📄 src/pages/schedule/[username]/index.page.tsx

```tsx
31     export const getStaticPaths: GetStaticPaths = async () => {
32       return {
33         paths: [],
34         fallback: 'blocking',
35       }
36     }
37
```

<br/>

```javascript
export const getStaticPaths: GetStaticPaths = async () => {
  // aqui informo quais são os parâmentros estáticos que quero gerar no momento da build
  return {
    paths: [], //* ao informar o paths vazio[], ele não gera nenhuma página estática no momento da build e sim gerar conforme os usuários vão acessando essa página!
    fallback: 'blocking', // quando um usuário tentar acessar uma página que  nao foi gerada de forma estática, ele vai acessar o banco do lado do server side "GetStaticProps" e quanto estiver pronto ele mostra o usuário
  }

  // ou seja, uma página só sera criada quando alguem acessar essa página
}
```

<br/>

// getStaticProps é uma função que você pode exportar em um arquivo de página Next.js para realizar operações de busca de dados em tempo de compilação, ou seja, no momento em que a página é construída pelo servidor. Isso é diferente de buscar dados no lado do cliente ou no tempo de execução.<br/>
<br/>1\. \*\***Exportação da Função \`getStaticProps\`**\*\*:<br/>
\- \`export const getStaticProps: GetStaticProps\` declara que você está exportando uma função \`getStaticProps\` que está tipada com \`GetStaticProps\`. Isso é útil para TypeScript, garantindo que a função seja usada corretamente.<br/>
<br/>2\. \*\***Função Assíncrona**\*\*:<br/>
\- \`async ({ params }) => { ... }\` define \`getStaticProps\` como uma função assíncrona que recebe um objeto com \`params\`. Esses \`params\` são parâmetros da URL da página, como o slug.<br/>
<br/>3\. \*\***Buscar Dados do Usuário**\*\*:<br/>
\- Dentro da função, você converte o parâmetro \`username\` para uma \`String\` e o utiliza para buscar um usuário único no banco de dados com \`prisma.user.findUnique\`.<br/>
<br/>4\. \*\***Manipulação de Erros**\*\*:<br/>
\- A função verifica se um usuário foi encontrado. Se não (\`if (!user)\`), ela retorna um objeto com uma propriedade \`notFound\` definida como \`true\`. Isso instrui o Next.js a retornar uma página 404 para o usuário.<br/>
<br/>5\. \*\***Retorno de Props**\*\*:<br/>
\- Se um usuário é encontrado, a função retorna um objeto com uma propriedade \`props\`, que contém os dados do usuário (como nome, biografia e URL do avatar). Essas props serão passadas para o componente da página para renderização.<br/>
<br/>6\. \*\*Revalidação\*\*:<br/>
\- A propriedade \`revalidate\` é definida com o valor de 86400 segundos (24 horas), o que significa que a página estática será recriada uma vez a cada 24 horas no mínimo. Isso é útil para atualizar a página com dados novos se eles mudarem, mas sem a necessidade de reconstruir a página a cada requisição.<br/>
<br/>Em resumo, \`\*\*getStaticProps\*\*\` é usado para gerar páginas estáticas com dados que precisam ser buscados no momento da construção da página.<br/>
<br/>O uso de \`getStaticProps\` é ideal para páginas que podem ser pré-renderizadas com dados que mudam periodicamente, mas não a cada visualização da página. Isso melhora o desempenho, pois a página não precisa ser construída em todas as requisições e pode ser servida diretamente do cache do servidor ou CDN.

<!-- NOTE-swimm-snippet: the lines below link your snippet to Swimm -->

### 📄 src/pages/schedule/[username]/index.page.tsx

```tsx
38     export const getStaticProps: GetStaticProps = async ({ params }) => {
39       const username = String(params?.username)
40
41       const user = await prisma.user.findUnique({
42         where: {
43           username,
44         },
45       })
46
47       if (!user) {
48         return {
49           notFound: true,
50         }
51       }
52
53       return {
54         props: {
55           user: {
56             name: user.name,
57             bio: user.bio,
58             avatarUrl: user.avatar_url,
59           },
60         },
61         revalidate: 60 * 60 * 24, // 1day  //indica em quanto tempo quero que essa página seja recriada após o primeiro acesso
62       }
63     }
```

<br/>

```javascript
export const getStaticProps: GetStaticProps = async ({ params }) => {
  const username = String(params?.username)

  // O GetStaticProps é sempre executado do lado do servidor por isso será feito uma chamada diretamente do BD

  const user = await prisma.user.findUnique({
    where: {
      username,
    },
  })

  if (!user) {
    return {
      notFound: true,
    }
  }

  return {
    props: {
      user: {
        name: user.name,
        bio: user.bio,
        avatarUrl: user.avatar_url,
      },
    },
    revalidate: 60 * 60 * 24, // 1day  //indica em quanto tempo quero que essa página seja recriada após o primeiro acesso
  }
}
```

<br/>

This file was generated by Swimm. [Click here to view it in the app](https://app.swimm.io/repos/Z2l0aHViJTNBJTNBaWduaXRlLTIwMjIlM0ElM0FkeWphcnVmYQ==/docs/r2ezsuur).

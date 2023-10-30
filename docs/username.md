```tsx
import { Avatar, Heading, Text } from '@ignite-ui/react'
import { GetStaticPaths, GetStaticProps } from 'next'

import { prisma } from '@/lib/prisma'

import { Container, UserHeader } from './styles'

interface ScheduleProps {
  user: {
    name: string
    bio: string
    avatarUrl: string
  }
}

export default function Schedule({ user }: ScheduleProps) {
  return (
    <Container>
      <UserHeader>
        <Avatar src={user.avatarUrl} />
        <Heading>{user.name}</Heading>
        <Text>{user.bio}</Text>
      </UserHeader>
    </Container>
  )
}

// aqui seria um exemplo de página estática a ser utilizada, por isso será adotada a abordagem do GetStaticProps

// as páginas estatática não possuem REQ e RES pois elas não são criadas em tempo de execução, elas são criadas no momento da build.
// Por isso será usado o "params"

// correção de erro(): como o [username] dessa rota não é fixo e sim parametrizado ou dinâmico(precisamos criar uma página estática por usuário),
// preciso informar obrigatoriamente ao Next o método GetStaticPath

// GetStaticPath sinaliza quais são usuários(parâmetros) quero que gera páginas estáticas no momento desde o primeiro momento da build da aplicação

export const getStaticPaths: GetStaticPaths = async () => {
  // aqui informo quais são os parâmentros estáticos que quero gerar no momento da build
  return {
    paths: [], //* ao informar o paths vazio[], ele não gera nenhuma página estática no momento da build e sim gerar conforme os usuários vão acessando essa página!
    fallback: 'blocking', // quando um usuário tentar acessar uma página que  nao foi gerada de forma estática, ele vai acessar o banco do lado do server side "GetStaticProps" e quanto estiver pronto ele mostra o usuário
  }

  // ou seja, uma página só sera criada quando alguem acessar essa página
}

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
;``
```

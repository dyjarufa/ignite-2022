import { Heading, Text } from '@ignite-ui/react'
import Image from 'next/image'

import previewImage from '../../assets/app-preview.png'

import { Container, Hero, Preview } from './styles'
import { ClaimUserNameForm } from './components/ClaimUsernameForm'

export default function Home() {
  return (
    <Container>
      <Hero>
        <Heading as="h1" size="4xl">
          Uncomplicated booking
        </Heading>
        <Text size="xl">
          Connect your calendar and let people book appointments in their free
          time.
        </Text>

        <ClaimUserNameForm />
      </Hero>
      <Preview>
        <Image
          src={previewImage}
          height={400}
          quality={100}
          priority
          alt="Calendar represents the functioning application"
        />
      </Preview>
    </Container>
  )
}

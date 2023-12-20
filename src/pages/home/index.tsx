import { Heading, Text } from '@ignite-ui/react'
import Image from 'next/image'
import { NextSeo } from 'next-seo'

import previewImage from '../../assets/app-preview.png'

import { Container, Hero, Preview } from './styles'
import { ClaimUserNameForm } from './components/ClaimUsernameForm'

export default function Home() {
  return (
    <>
      <NextSeo
        title="Simplify your schedule | Ignite Call"
        description="Connect your calendar and let people book appointments in their free
        time."
      />
      <p>Simple Usage</p>
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
            quality={
              100
            } /* next diminui a qualidade da imagem - com valor 100 a qualidade é mantida */
            priority /* por padrão o next nao renderiza a imagem no 1o momento - com priority esse comportamento muda */
            alt="Calendar represents the functioning application"
          />
        </Preview>
      </Container>
    </>
  )
}

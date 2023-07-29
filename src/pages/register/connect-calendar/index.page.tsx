import { signIn, useSession } from 'next-auth/react'
import { ArrowRight } from 'phosphor-react'
import { Button, Heading, MultiStep, Text } from '@ignite-ui/react'

import { Container, Header } from '../style'

import { ConnectBox, ConnectItem } from './styles'

export default function Register() {
  const session = useSession()

  return (
    <Container>
      <Header>
        <Heading as="strong">Connect your schedule!</Heading>
        <Text>
          Connect your calendar to automatically check busy hours and new events
          as they are scheduled 😉
        </Text>

        <MultiStep size={4} currentStep={2} />
      </Header>

      <ConnectBox>
        <ConnectItem>
          <Text>Google Calendar</Text>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => signIn('google')}
          >
            Sync
          </Button>
        </ConnectItem>

        <pre>{JSON.stringify(session.data)}</pre>

        <Button type="submit">
          Next step
          <ArrowRight />
        </Button>
      </ConnectBox>
    </Container>
  )
}

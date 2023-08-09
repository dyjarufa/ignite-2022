import { signIn, useSession } from 'next-auth/react'
import { ArrowRight } from 'phosphor-react'
import { Button, Heading, MultiStep, Text } from '@ignite-ui/react'
import { useRouter } from 'next/router'

import { Container, Header } from '../style'

import { AuthError, ConnectBox, ConnectItem } from './styles'

export default function Register() {
  const session = useSession()
  const router = useRouter()

  // console.log(session)

  const isSignedIn = session.status === 'authenticated'

  const hasAuthError = !!router.query.error

  async function handleConnectCalendar() {
    await signIn('google')
  }

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
          {isSignedIn ? (
            <Button size="sm" disabled>
              Connected
            </Button>
          ) : (
            <Button
              variant="secondary"
              size="sm"
              onClick={handleConnectCalendar}
            >
              Sync
            </Button>
          )}
        </ConnectItem>

        {hasAuthError && (
          <AuthError>
            Failed to connect to Google. Please ensure you have enabled access
            permission to Google Calendar.
          </AuthError>
        )}

        <Button type="submit" disabled={!isSignedIn}>
          Next step
          <ArrowRight />
        </Button>
      </ConnectBox>
    </Container>
  )
}

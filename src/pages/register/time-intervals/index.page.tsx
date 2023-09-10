import {
  Button,
  Checkbox,
  Heading,
  MultiStep,
  Text,
  TextInput,
} from '@ignite-ui/react'
import { Container, Header } from '../style'
import {
  IntervalBox,
  IntervalDay,
  IntervalInputs,
  IntervalItem,
  IntervalsContainer,
} from './styles'
import { ArrowRight } from 'phosphor-react'

export default function TimeIntervals() {
  return (
    <Container>
      <Header>
        <Heading as="strong">Almost there </Heading>
        <Text>Book the times you're available on each day of the week 📅</Text>
        <MultiStep size={4} currentStep={3} />
      </Header>

      <IntervalBox as="form">
        <IntervalsContainer>
          <IntervalItem>
            <IntervalDay>
              <Checkbox />
              <Text>Monday</Text>
            </IntervalDay>
            <IntervalInputs>
              <TextInput size="sm" type="time" step={60} />
            </IntervalInputs>
          </IntervalItem>
          <IntervalItem>
            <IntervalDay>
              <Checkbox />
              <Text>Tuesday</Text>
            </IntervalDay>
            <IntervalInputs>
              <TextInput size="sm" type="time" step={60} />
            </IntervalInputs>
          </IntervalItem>
        </IntervalsContainer>
        <Button type="submit">
          Next Step
          <ArrowRight />
        </Button>
      </IntervalBox>
    </Container>
  )
}

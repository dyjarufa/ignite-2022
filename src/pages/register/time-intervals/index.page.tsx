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

import { z } from 'zod'
import { useFieldArray, useForm } from 'react-hook-form'
import { getWeekdays } from '@/utils/get-week-days'

export default function TimeIntervals() {
  const timeIntervalsFormSchema = z.object({})

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      intervals: [
        { weekDay: 0, enable: true, startTime: '08:00', endTime: '06:00' },
        { weekDay: 1, enable: true, startTime: '08:00', endTime: '06:00' },
        { weekDay: 2, enable: true, startTime: '08:00', endTime: '06:00' },
        { weekDay: 3, enable: true, startTime: '08:00', endTime: '06:00' },
        { weekDay: 5, enable: true, startTime: '08:00', endTime: '06:00' },
        { weekDay: 6, enable: true, startTime: '08:00', endTime: '06:00' },
      ],
    },
  })

  const weekDays = getWeekdays()

  async function handleSetTimeInterval() {}

  //? https://react-hook-form.com/docs/usefieldarray#main
  // * Permite manupular o compo de formulario que é um array
  const { fields } = useFieldArray({
    control, // control informa que o useFieldArray esta lidando como os intervals dos useForm
    name: 'intervals',
  })

  return (
    <Container>
      <Header>
        <Heading as="strong">Almost there </Heading>
        <Text>Book the times you're available on each day of the week 📅</Text>
        <MultiStep size={4} currentStep={3} />
      </Header>

      <IntervalBox as="form" onSubmit={handleSubmit(handleSetTimeInterval)}>
        <IntervalsContainer>
          {fields.map((field, index) => {
            return (
              <IntervalItem key={field.id}>
                <IntervalDay>
                  <Checkbox />
                  <Text>{weekDays[field.weekDay]}</Text>
                </IntervalDay>
                <IntervalInputs>
                  <TextInput
                    size="sm"
                    type="time"
                    step={60}
                    {...register(`intervals.${index}.startTime`)}
                  />
                </IntervalInputs>
                <IntervalInputs>
                  <TextInput
                    size="sm"
                    type="time"
                    step={60}
                    {...register(`intervals.${index}.endTime`)}
                  />
                </IntervalInputs>
              </IntervalItem>
            )
          })}
        </IntervalsContainer>
        <Button type="submit">
          Next Step
          <ArrowRight />
        </Button>
      </IntervalBox>
    </Container>
  )
}

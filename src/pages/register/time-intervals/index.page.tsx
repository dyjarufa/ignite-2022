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
import { getWeekdays } from '@/utils/get-week-days'

/*
 * Controller ou Componentes controlados: Se você estiver usando componentes controlados ou componentes de terceiros que não expõem um ref
 * (por exemplo, muitos componentes de UI de bibliotecas populares), você precisará do Controller para integrá-los ao React Hook Form.
 */
import { Controller, useFieldArray, useForm } from 'react-hook-form'

export default function TimeIntervals() {
  const timeIntervalsFormSchema = z.object({})

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      intervals: [
        { weekDay: 0, enable: true, startTime: '08:00', endTime: '06:00' },
        { weekDay: 1, enable: true, startTime: '08:00', endTime: '06:00' },
        { weekDay: 2, enable: true, startTime: '08:00', endTime: '06:00' },
        { weekDay: 3, enable: true, startTime: '08:00', endTime: '06:00' },
        { weekDay: 5, enable: false, startTime: '08:00', endTime: '06:00' },
        { weekDay: 6, enable: false, startTime: '08:00', endTime: '06:00' },
      ],
    },
  })

  //* Permite saber em tempo real as mudanças que sofreram em um campo
  const intervals = watch('intervals')

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
                  {/* ..register não irá funcionar no Checkbox pois ele não é um elemento nativo do html */}

                  {/* Controller ->  quando tem um elemento em tela visual que insere uma informação no formulário
                  e não é um elemento nativo html
                  */}
                  <Controller
                    name={`intervals.${index}.enable`}
                    control={control}
                    render={({ field }) => {
                      return (
                        <Checkbox
                          onCheckedChange={(checked) => {
                            field.onChange(checked === true) //? confirmando que é um valor true, pois o type do checked pode ser 'indeterminate'
                          }}
                          checked={field.value}
                        />
                      )
                    }}
                  />

                  <Text>{weekDays[field.weekDay]}</Text>
                </IntervalDay>
                <IntervalInputs>
                  <TextInput
                    size="sm"
                    type="time"
                    step={60}
                    disabled={intervals[index].enable === false}
                    {...register(`intervals.${index}.startTime`)}
                  />

                  <TextInput
                    size="sm"
                    type="time"
                    step={60}
                    disabled={intervals[index].enable === false}
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

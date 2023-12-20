import {
  Button,
  Checkbox,
  Heading,
  MultiStep,
  Text,
  TextInput,
} from '@ignite-ui/react'
import { ArrowRight } from 'phosphor-react'
import { z } from 'zod'
import { Controller, useFieldArray, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/router'
import { NextSeo } from 'next-seo'

import { getWeekdays } from '@/utils/get-week-days'
import { convertTimeStringToMinutes } from '@/utils/convert-time-string-to-minutes'
import { api } from '@/lib/axios'

import { Container, Header } from '../style'

import {
  FormError,
  IntervalBox,
  IntervalDay,
  IntervalInputs,
  IntervalItem,
  IntervalsContainer,
} from './styles'

export default function TimeIntervals() {
  const timeIntervalsFormSchema = z.object({
    intervals: z
      .array(
        z.object({
          weekDay: z.number().min(0).max(6),
          enable: z.boolean(),
          startTime: z.string(),
          endTime: z.string(),
        })
      )
      .length(7)
      .transform((intervals) => intervals.filter((interval) => interval.enable))
      .refine((intervals) => intervals.length > 0, {
        message: 'you must select at least one day of the week',
      })
      .transform((intervals) => {
        return intervals.map((interval) => {
          return {
            weekDay: interval.weekDay,
            startTimeInMinutes: convertTimeStringToMinutes(interval.startTime),
            endTimeInMinutes: convertTimeStringToMinutes(interval.endTime),
          }
        })
      })
      .refine(
        (intervals) => {
          return intervals.every(
            (interval) =>
              interval.endTimeInMinutes - 60 >= interval.startTimeInMinutes
          )
        },
        {
          message: 'The end time must be at least 1 hour from the start',
        }
      ),
  })

  type timeIntervalFormInput = z.input<typeof timeIntervalsFormSchema>
  type timeIntervalFormOut = z.output<typeof timeIntervalsFormSchema>

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<timeIntervalFormInput, any, timeIntervalFormOut>({
    resolver: zodResolver(timeIntervalsFormSchema),
    defaultValues: {
      intervals: [
        //* o ideal para trabalhar com horas é converte-las para minutos
        { weekDay: 0, enable: true, startTime: '08:00', endTime: '18:00' },
        { weekDay: 1, enable: true, startTime: '08:00', endTime: '18:00' },
        { weekDay: 2, enable: true, startTime: '08:00', endTime: '18:00' },
        { weekDay: 3, enable: true, startTime: '08:00', endTime: '18:00' },
        { weekDay: 4, enable: true, startTime: '08:00', endTime: '18:00' },
        { weekDay: 5, enable: false, startTime: '08:00', endTime: '18:00' },
        { weekDay: 6, enable: false, startTime: '08:00', endTime: '18:00' },
      ],
    },
  })

  const intervals = watch('intervals')

  const weekDays = getWeekdays()
  const router = useRouter()

  async function handleSetTimeInterval(data: timeIntervalFormOut) {
    const { intervals } = data

    //* rota na pasta src/pages/api/users
    await api.post('/users/time-intervals', {
      intervals,
    })

    await router.push('/register/update-profile')
  }

  const { fields } = useFieldArray({
    control,
    name: 'intervals',
  })

  return (
    <>
      <NextSeo title="Select your availability | Ignite Call" />
      <Container>
        <Header>
          <Heading as="strong">Almost there </Heading>
          <Text>
            Book the times you are available on each day of the week 📅
          </Text>
          <MultiStep size={4} currentStep={3} />
        </Header>

        <IntervalBox as="form" onSubmit={handleSubmit(handleSetTimeInterval)}>
          <IntervalsContainer>
            {fields.map((field, index) => {
              return (
                <IntervalItem key={field.id}>
                  <IntervalDay>
                    {/* ..register não irá funcionar no Checkbox pois ele não é um elemento nativo do html */}

                    {/* Controller ->  quando tem um elemento em tela visual não nativo do HTML que insere uma informação no formulário
                     */}
                    <Controller
                      name={`intervals.${index}.enable`}
                      control={control}
                      render={({ field }) => {
                        return (
                          <Checkbox
                            onCheckedChange={(checked) => {
                              field.onChange(checked === true)
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
          {errors.intervals && (
            <FormError size="sm">{errors.intervals.message}</FormError>
          )}
          <Button type="submit" disabled={isSubmitting}>
            Next Step
            <ArrowRight />
          </Button>
        </IntervalBox>
      </Container>
    </>
  )
}

import { useState } from 'react'
import dayjs from 'dayjs'
import { useRouter } from 'next/router'
import { useQuery } from '@tanstack/react-query'

import { Calendar } from '@/components/Calendar'
import { api } from '@/lib/axios'

import {
  Container,
  TimePicker,
  TimePickerHeader,
  TimePickerItem,
  TimePickerList,
} from './styles'

interface IAvailability {
  availableTimes: number[]
  possibleTimes: number[]
}

export function CalendarStep() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)

  const isDataSelected = !!selectedDate

  const router = useRouter()

  const username = String(router.query.username)

  const weekDay = selectedDate ? dayjs(selectedDate).format('dddd') : null

  const describedDate = selectedDate
    ? dayjs(selectedDate).format('DD [de] MMMM')
    : null

  const selectDateWithoutTime = selectedDate
    ? dayjs(selectedDate).format('YYYY-MM-DD')
    : null

  const { data: availability } = useQuery<IAvailability>({
    queryKey: ['availability', selectDateWithoutTime],
    queryFn: async () => {
      const response = await api.get(`/users/${username}/availability`, {
        params: {
          date: selectDateWithoutTime,
        },
      })

      return response.data
    },
    enabled: !!selectedDate,
  })

  /* useEffect(() => {
    if (!selectedDate) {
      return
    }
    api
      .get(`/users/${username}/availability`, {
        params: {
          date: dayjs(selectedDate).format('YYYY-MM-DD'),
        },
      })
      .then((response) => {
        setAvailability(response.data)
      })
  }, [selectedDate, username]) */

  return (
    <Container isTimePickerOpen={isDataSelected}>
      <Calendar selectedData={selectedDate} onDateSelected={setSelectedDate} />

      {isDataSelected && (
        <TimePicker>
          <TimePickerHeader>
            {weekDay}, <span>{describedDate}</span>
          </TimePickerHeader>
          <TimePickerList>
            {availability?.possibleTimes.map((hour) => {
              return (
                <TimePickerItem
                  key={hour}
                  disabled={!availability.availableTimes.includes(hour)}
                >
                  {String(hour).padStart(2, '0')}:00h
                </TimePickerItem>
              )
            })}
          </TimePickerList>
        </TimePicker>
      )}
    </Container>
  )
}

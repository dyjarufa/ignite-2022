interface GetWeekDaysParams {
  short?: boolean
}

export function getWeekdays({ short = false }: GetWeekDaysParams = {}) {
  const formatter = new Intl.DateTimeFormat('en-US', { weekday: 'long' })

  return Array.from(Array(7).keys())
    .map((day) => formatter.format(new Date(Date.UTC(2021, 5, day))))
    .map((weekDay) => {
      if (short) {
        return weekDay.substring(0, 3).toUpperCase()
      }
      return weekDay.substring(0, 1).toUpperCase().concat(weekDay.substring(1))
    })
}

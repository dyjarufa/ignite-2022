import { NextApiResponse, NextApiRequest } from 'next'

import { prisma } from '@/lib/prisma'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).end()
  }

  const username = String(req.query.username)

  const { year, month } = req.query

  if (!year || !month) {
    return res.status(400).json({ message: 'Year or month not specified.' })
  }

  const user = await prisma.user.findUnique({
    where: {
      username,
    },
  })

  if (!user) {
    return res.status(401).json({ message: 'User does not exist.' })
  }

  const availableWeekDays = await prisma.userTimeInterval.findMany({
    select: {
      week_day: true,
    },
    where: {
      user_id: user.id,
    },
  })

  const blockedWeekDays = [0, 1, 2, 3, 4, 5, 6].filter((weekDay) => {
    return !availableWeekDays.some((availableWeekDays) => {
      return availableWeekDays.week_day === weekDay
    })
  })

  // verificar cada dia semana, quais horários tenho disponíveis e também quais agendamentos foram feitos em cada horário
  // realizar isso em 1 query no BD

  // $queryRaw =>  query complexa com prisma

  const blockedDateRaw: Array<{ date: number }> = await prisma.$queryRaw`
    SELECT
      EXTRACT(DAY FROM S.date) AS date,
      COUNT(S.date) AS amount,
      ((UTI.time_end_in_minutes - UTI.time_start_in_minutes) / 60 ) AS size

    FROM schedulings S

    LEFT JOIN user_time_intervals UTI
      ON UTI.week_day = WEEKDAY(DATE_ADD(S.date, INTERVAL 1 DAY))

    WHERE S.user_Id = ${user.id}
      AND DATE_FORMAT(S.date, "%Y-%m") = ${`${year}-${month}`}
    
    GROUP BY EXTRACT(DAY from S.date),
      ((UTI.time_end_in_minutes - UTI.time_start_in_minutes) / 60 )

    HAVING amount >= size 
  `

  const blockedDates = blockedDateRaw.map((item) => item.date)

  console.log(blockedDateRaw)

  return res.json({ blockedWeekDays, blockedDates })
}

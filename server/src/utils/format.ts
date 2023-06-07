import { format } from 'date-fns'

export function formatMealDate(meal_date: string) {
  return format(new Date(meal_date), 'yyyy-MM-dd')
}

export function formatMealTime(meal_time: string) {
  const [hours, minutes, seconds] = meal_time.split(':')

  const time = new Date()
  time.setHours(Number(hours))
  time.setMinutes(Number(minutes))
  time.setSeconds(Number(seconds))

  return format(new Date(time), 'HH:mm')
}

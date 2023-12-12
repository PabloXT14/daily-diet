import { parseISO, format } from 'date-fns'
import { zonedTimeToUtc, utcToZonedTime } from 'date-fns-tz'
import { ptBR } from 'date-fns/locale'

export function formatDatetimeToUTC(datetime: string | Date) {
  const date = new Date(datetime)

  const utcDate = zonedTimeToUtc(date, 'UTC')

  return utcDate.toISOString()
}

export function formatUTCToDatetime(datetime: Date) {
  const date = utcToZonedTime(datetime, 'UTC')

  return date
}

export function getHoursAndMinutes(date: string) {
  const dateInISOFormat = parseISO(date)

  const dateFormated = format(dateInISOFormat, 'HH:mm', {
    locale: ptBR,
  })

  return dateFormated
}

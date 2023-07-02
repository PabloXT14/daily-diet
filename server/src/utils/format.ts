import { zonedTimeToUtc, utcToZonedTime } from 'date-fns-tz'

export function formatDatetimeToUTC(datetime: string | Date) {
  const date = new Date(datetime)

  const utcDate = utcToZonedTime(date, 'UTC')

  return utcDate.toISOString()
}

export function formatUTCToDatetime(datetime: Date) {
  const date = zonedTimeToUtc(datetime, 'UTC')

  return date
}

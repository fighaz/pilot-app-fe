// Deterministic calendar helpers.
// All functions use Date.UTC purely for calendar math (leap years, weekday of a
// given date). None of them reads the system clock, so "today" always comes from
// runtime config (mirroring the backend TODAY value).

const MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
]

const MONTH_NAMES_SHORT = MONTH_NAMES.map((name) => name.slice(0, 3))

const WEEKDAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

/** Parse a YYYY-MM-DD string into its UTC epoch milliseconds. */
function parseIso(iso: string): number {
  const [year, month, day] = iso.split('-').map(Number)
  return Date.UTC(year, month - 1, day)
}

/** Format UTC epoch milliseconds back to a YYYY-MM-DD string. */
function toIso(ms: number): string {
  const d = new Date(ms)
  const year = d.getUTCFullYear()
  const month = `${d.getUTCMonth() + 1}`.padStart(2, '0')
  const day = `${d.getUTCDate()}`.padStart(2, '0')
  return `${year}-${month}-${day}`
}

/** Add N days to a YYYY-MM-DD string. */
export function addDays(iso: string, days: number): string {
  return toIso(parseIso(iso) + days * 86_400_000)
}

/** "2026-05-15" -> "15 May 2026" */
export function formatDisplayDate(iso: string): string {
  const [year, month, day] = iso.split('-').map(Number)
  return `${day} ${MONTH_NAMES_SHORT[month - 1]} ${year}`
}

/** "2026-05-15" -> "15 May" */
export function formatShortDate(iso: string): string {
  const [, month, day] = iso.split('-').map(Number)
  return `${day} ${MONTH_NAMES_SHORT[month - 1]}`
}

/** (2026, 5) -> "May 2026" */
export function formatMonthYear(year: number, month: number): string {
  return `${MONTH_NAMES[month - 1]} ${year}`
}

/** Number of days in a month. month is 1-12. */
export function daysInMonth(year: number, month: number): number {
  return new Date(Date.UTC(year, month, 0)).getUTCDate()
}

/** Weekday index (0 = Monday) of the 1st of the month. */
export function firstWeekdayOfMonth(year: number, month: number): number {
  const weekday = new Date(Date.UTC(year, month - 1, 1)).getUTCDay() // 0 = Sunday
  return (weekday + 6) % 7
}

/** Build a YYYY-MM-DD string from parts. */
export function isoFromParts(year: number, month: number, day: number): string {
  return `${year}-${`${month}`.padStart(2, '0')}-${`${day}`.padStart(2, '0')}`
}

export function weekdayLabels(): string[] {
  return WEEKDAY_LABELS
}

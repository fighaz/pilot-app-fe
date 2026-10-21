// Shared API response types (mirror of the NestJS backend responses)

export interface LoginResponse {
  accessToken: string
}

export interface PilotProfile {
  name: string
  totalFlightHours: number
  avatarUrl: string
}

export interface DailyHoursPoint {
  date: string
  hours: number
}

export interface FlightHoursResponse {
  from: string
  to: string
  totalHours: number
  days: DailyHoursPoint[]
}

export type SummaryRange = '1w' | '1m' | '3m' | '6m' | '1y'

export interface SummaryPoint {
  date: string
  rollingSum: number
}

export interface LimitCardData {
  key: 'daily' | 'weekly' | 'monthly' | 'annual'
  label: string
  current: number
  limit: number
  windowDays: number
}

export interface SummaryResponse {
  range: SummaryRange
  today: string
  windowDays: number
  limit: number
  yMax: number
  points: SummaryPoint[]
  cards: LimitCardData[]
}

export type DocumentStatus = 'safe' | 'soon' | 'expired'

export interface PilotDocumentItem {
  id: string
  label: string
  expiryDate: string
  daysRemaining: number
  status: DocumentStatus
}

export interface DocumentsResponse {
  today: string
  documents: PilotDocumentItem[]
}

export interface ScheduleEntry {
  id: string
  duty_date: string
  status: number
  base_name: string
  base_color: string
  duty_type: string
  count_schedules: number
  count_logbooks: number
}

export interface LegendItem {
  code: string
  label: string
  color: string
}

export interface SchedulesResponse {
  year: number
  month: number
  legend: LegendItem[]
  entries: ScheduleEntry[]
}

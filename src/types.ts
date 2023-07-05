export interface Event {
  timestamp: Date
  duration: number
  data: any
}

// Screentime is stored in day-level objects that have
// their `events` appended when new data is added.
export interface ScreenTimeData {
  userId: number
  public: boolean
  date: Date
  events: Event[]
}

// Same as above, but with events aggregated
export interface ScreenTimeSummary {
  userId: number
  total: number
  category_totals: { [key: string]: number }
}
